from flask import Blueprint, request, jsonify
from models.journey_model import Journey
from database.db import db
from werkzeug.utils import secure_filename
import os

journeys_api = Blueprint('journeys_api', __name__)

# Get all journeys
@journeys_api.route('/journeys', methods=['GET'])
def get_journeys():
    journeys = Journey.query.all()
    return jsonify([journey.to_dict() for journey in journeys])

# Get a journey by ID
@journeys_api.route('/journeys/<int:id>', methods=['GET'])
def get_journey(id):
    journey = Journey.query.get_or_404(id)
    return jsonify(journey.to_dict())

# Create a new journey
@journeys_api.route('/journeys', methods=['POST'])
def create_journey():
    title = request.form.get('title')
    description = request.form.get('description')
    location = request.form.get('location')
    
    # Check if required fields are provided
    if not title or not location:
        return jsonify({"error": "Title and location are required."}), 400

    # Handle image file
    image = request.files.get('image')
    image_filename = None
    
    if image:
        # Save the image file to the server
        image_filename = secure_filename(image.filename)
        image.save(os.path.join('path/to/save/images', image_filename))

    # Create new journey
    new_journey = Journey(
        title=title,
        description=description,
        location=location,
        image_filename=image_filename  # Add this field to the Journey model if it doesn't exist
    )

    db.session.add(new_journey)
    db.session.commit()

    return jsonify(new_journey.to_dict()), 201

# Update a journey by ID
@journeys_api.route('/journeys/<int:id>', methods=['PUT'])
def update_journey(id):
    journey = Journey.query.get_or_404(id)
    data = request.json
    journey.title = data.get('title', journey.title)
    journey.description = data.get('description', journey.description)
    journey.location = data.get('location', journey.location)
    db.session.commit()
    return jsonify(journey.to_dict())

# Delete a journey by ID
@journeys_api.route('/journeys/<int:id>', methods=['DELETE'])
def delete_journey(id):
    journey = Journey.query.get_or_404(id)
    db.session.delete(journey)
    db.session.commit()
    return jsonify({'message': 'Journey deleted successfully'}), 204
