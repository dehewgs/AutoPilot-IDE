import os
from pathlib import Path

class Config:
    """Base configuration"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or os.urandom(24).hex()
    PROJECTS_DIR = os.environ.get('PROJECTS_DIR', './projects')
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', './uploads')
    MAX_CONTENT_LENGTH = int(os.environ.get('MAX_CONTENT_LENGTH', 16 * 1024 * 1024))  # 16MB default
    
    # Ensure directories exist
    Path(PROJECTS_DIR).mkdir(parents=True, exist_ok=True)
    Path(UPLOAD_FOLDER).mkdir(parents=True, exist_ok=True)

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    ENV = 'development'
    HOST = os.environ.get('HOST', '127.0.0.1')
    PORT = int(os.environ.get('PORT', 5000))

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    ENV = 'production'
    HOST = os.environ.get('HOST', '0.0.0.0')
    PORT = int(os.environ.get('PORT', 8000))
    
    # Production must have SECRET_KEY set
    if not os.environ.get('SECRET_KEY'):
        raise ValueError("SECRET_KEY environment variable must be set in production")

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    DEBUG = True
    ENV = 'testing'

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
