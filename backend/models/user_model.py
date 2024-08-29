from database.db import db
from werkzeug.security import generate_password_hash
from flask_login import UserMixin


class User(UserMixin, db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    journeys = db.relationship('Journey', backref=db.backref('user', lazy=True))
    about_me = db.Column(db.String(140), nullable=True)

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = password

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'about_me' : self.about_me
        }
        
    
        
    def get_id(self):
        return str(self.id)    
    
    def __repr__(self):
        return '<User {}>'.format(self.username)
    
