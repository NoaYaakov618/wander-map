from flask import Flask, abort, jsonify, request
from models.journey_model import Journey
from models.user_model import User
from database.db import db, init_app
from dotenv import load_dotenv
from flask import Flask, request, jsonify, redirect, url_for, flash
from flask_login import LoginManager, current_user, login_required, login_user, logout_user
from werkzeug.security import check_password_hash
from urllib.parse import urlsplit
from werkzeug.security import generate_password_hash

import sqlalchemy as sa
from flask import send_from_directory
from werkzeug.utils import secure_filename
import os

load_dotenv()
app = Flask(__name__)
app.config.from_object('config.DevelopmentConfig')


init_app(app)

login_manager = LoginManager()
login_manager.init_app(app)  # `app` is your Flask app instance

UPLOAD_FOLDER = 'upload'  # Define where you want to save the images
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}  # Allowed file extensions

# Make sure the upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


@app.route("/api/profile", methods=["GET"])
@login_required
def get_profile():
    # Fetch the user from the database using current_user.id
    user = db.session.scalar(sa.select(User).where(User.id == current_user.id))
    if user is None:
        abort(404, description="User not found")

    # Serialize user data into a dictionary
    
    user_data = {
        'username': user.username,
        'email': user.email,
        'about_me': user.about_me  # Include other fields as necessary
    }

    return jsonify(user_data)


@app.route('/api/profile', methods=['PUT'])
def update_user():
    user = db.session.scalar(sa.select(User).where(User.id == current_user.id))
    if user is None:
        abort(404, description="User not found")
    data = request.json
    user.username = data.get('username', user.username)
    user.about_me = data.get('about_me', user.about_me)
    db.session.commit()
    # Convert user data to a dictionary for the response
    user_data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'about_me': user.about_me
    }

    return jsonify(user_data)


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route('/api/check-auth')
def check_auth():
    # Check if the user is authenticated
    if current_user.is_authenticated:
        return jsonify({'isAuthenticated': True, 'username': current_user.username}), 200
    else:
        return jsonify({'isAuthenticated': False}), 200
    
@app.route('/api/logout', methods=['POST'])
def logout():
    logout_user()
    return jsonify({'success': True, 'message': 'Logout successful', 'next': '/'}), 200

@login_manager.user_loader
def load_user(user_id):
    return db.session.scalar(sa.select(User).where(User.id == user_id))

@app.route('/api/login', methods=['GET', 'POST'])
def login():
    # Check if the user is already authenticated
    if current_user.is_authenticated:
        return jsonify({'success': True, 'message': 'Already logged in'}), 200
        
    if request.method == 'POST':
        data = request.json
        username = data.get('username')
        password = data.get('password')
        
        # Fetch the user from the database
        user = db.session.scalar(sa.select(User).where(User.username == username))
        
        # Check if user exists and the password is correct
        
        if user is None or not check_password_hash(user.password, password):
            flash('Invalid username or password')
            return jsonify({'success': False, 'message': 'Invalid username or password'}), 401
        
        
        login_user(user, remember=data.get('remember_me', False))
       
        
        next_page = request.args.get('next', '/')
        # next_page = request.args.get('next')
        # if not next_page or urlsplit(next_page).netloc != '':
        #     next_page = url_for('/')
    
        return jsonify({'success': True, 'message': 'Login successful', 'next': next_page}), 200

    return jsonify({'success': False, 'message': 'Method not allowed'}), 405




def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('userName')
    password = data.get('password')
    email = data.get('email')
    

    # Input validation
    if not username or not password or not email:
        return jsonify({'status': 'fail', 'message': 'Missing required fields'}), 400


    # Create a new user object
    new_user = User(
        username=username,
        password=generate_password_hash(password),
        email=email
    )
    
    try:
        # Add the user to the database
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'status': 'success', 'message': 'User registered successfully'})
    except Exception as e:
        db.session.rollback()
        # Debugging statement
        print(f"Error occurred: {str(e)}")
        return jsonify({'status': 'fail', 'message': 'Registration failed', 'error': str(e)}), 500
    
    

@app.route('/api/delete', methods=['DELETE'])
def delete_all():
    try:
        db.session.query(Journey).delete()
        db.session.query(User).delete()
        db.session.commit()
        return jsonify({"message": "All users and journeys have been deleted."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/api/journeys', methods=['GET'])
def get_journeys():
    journeys = Journey.query.all()
    return jsonify([journey.to_dict() for journey in journeys])

@app.route('/api/journeys/<int:id>', methods=['GET'])
def get_journey(id):
    journey = Journey.query.get_or_404(id)
    return jsonify(journey.to_dict())

@app.route('/api/journeys', methods=['POST'])
def create_journey():
    if not current_user.is_authenticated:
        return jsonify({'message': 'User not authenticated'}), 401
    
    title = request.form['title']
    description = request.form.get('description')
    location = request.form['location']
    
    # Handle file upload
    image_file = request.files.get('image')
    
    image_filename = None
    if image_file and allowed_file(image_file.filename):
        image_filename = secure_filename(image_file.filename)
        image_path = os.path.join(UPLOAD_FOLDER, image_filename)
        image_file.save(image_path)
        
    
    # Create a new journey with the image URL
    new_journey = Journey(
        title=title,
        description=description,
        location=location,
        image_filename=image_filename,  # Store the filename only
        user_id=current_user.id
    )
    
    db.session.add(new_journey)
    db.session.commit()
    
    # Construct the image URL
    image_url = f"/uploads/{image_filename}"
    
    
    # Return the journey along with the image URL
    return jsonify({**new_journey.to_dict(), 'image_url': image_url}), 201

@app.route('/api/journeys/<int:id>', methods=['PUT'])
def update_journey(id):
    journey = Journey.query.get_or_404(id)
    data = request.json
    journey.title = data.get('title', journey.title)
    journey.description = data.get('description', journey.description)
    journey.location = data.get('location', journey.location)
    journey.user_id = data.get('user_id', journey.user_id)
    db.session.commit()
    return jsonify(journey.to_dict())

@app.route('/api/journeys/<int:id>', methods=['DELETE'])
def delete_journey(id):
    journey = Journey.query.get_or_404(id)
    db.session.delete(journey)
    db.session.commit()
    return jsonify({"message": "Journey deleted"}), 200



if __name__ == '__main__':
    app.run(debug=True)
