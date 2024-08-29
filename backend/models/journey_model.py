from database.db import db
from datetime import datetime, timezone
class Journey(db.Model):
    __tablename__ = 'journeys'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    location = db.Column(db.String(100), nullable=False)
    image_filename = db.Column(db.String(255), nullable=True)  # New column for the image
    

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'location': self.location,
            'image_filename': self.image_filename,
            'user_id': self.user_id
        }
        
    def __repr__(self):
        return '<Journey {}>'.format(self.title)

