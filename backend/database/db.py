from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# Create a SQLAlchemy object
db = SQLAlchemy()

def init_app(app):
    """
    Initialize the app with the SQLAlchemy object and bind the app with the database.
    """
    db.init_app(app)
    migrate = Migrate(app, db)
    with app.app_context():
        db.create_all()
