from flask import Blueprint, request, jsonify
from models.user_model import User
from database.db import db
from werkzeug.security import generate_password_hash, check_password_hash

users_api = Blueprint('users_api', __name__)

# Get all users
@users_api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

# Get a user by ID
@users_api.route('/users/<int:id>', methods=['GET'])
def get_user(id):
    user = User.query.get_or_404(id)
    return jsonify(user.to_dict())

# Create a new user
@users_api.route('/users', methods=['POST'])
def create_user():
    data = request.json
    hashed_password = generate_password_hash(data['password'], method='sha256')
    new_user = User(
        username=data['username'],
        email=data['email'],
        password=hashed_password
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.to_dict()), 201

# Update a user by ID
@users_api.route('/users/<int:id>', methods=['PUT'])
def update_user(id):
    user = User.query.get_or_404(id)
    data = request.json
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    if 'password' in data:
        user.password = generate_password_hash(data['password'], method='sha256')
    db.session.commit()
    return jsonify(user.to_dict())

# Delete a user by ID
@users_api.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'}), 204
