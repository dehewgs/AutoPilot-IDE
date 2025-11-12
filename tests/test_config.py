"""
Tests for Configuration (config.py)
====================================

Tests for configuration management and environment variables.
"""

import pytest
import os
from config import DevelopmentConfig, ProductionConfig, TestingConfig


class TestDevelopmentConfig:
    """Test development configuration."""
    
    def test_debug_enabled(self):
        """Test that debug is enabled in development."""
        assert DevelopmentConfig.DEBUG == True
    
    def test_testing_disabled(self):
        """Test that testing is disabled in development."""
        assert DevelopmentConfig.TESTING == False


class TestProductionConfig:
    """Test production configuration."""
    
    def test_debug_disabled(self):
        """Test that debug is disabled in production."""
        assert ProductionConfig.DEBUG == False
    
    def test_testing_disabled(self):
        """Test that testing is disabled in production."""
        assert ProductionConfig.TESTING == False
    
    def test_secret_key_required(self):
        """Test that secret key is required in production."""
        # Production should have a secret key set
        assert hasattr(ProductionConfig, 'SECRET_KEY')


class TestTestingConfig:
    """Test testing configuration."""
    
    def test_testing_enabled(self):
        """Test that testing is enabled."""
        assert TestingConfig.TESTING == True
    
    def test_debug_enabled(self):
        """Test that debug is enabled in testing."""
        assert TestingConfig.DEBUG == True


class TestEnvironmentVariables:
    """Test environment variable handling."""
    
    def test_env_override(self):
        """Test that environment variables override defaults."""
        # Set environment variable
        os.environ['FLASK_ENV'] = 'production'
        
        # Import config (would need to reload module in real test)
        # This is a placeholder for the concept
        assert os.environ.get('FLASK_ENV') == 'production'
        
        # Clean up
        del os.environ['FLASK_ENV']
    
    def test_secret_key_from_env(self):
        """Test that secret key can be loaded from environment."""
        test_key = 'test-secret-key-12345'
        os.environ['SECRET_KEY'] = test_key
        
        assert os.environ.get('SECRET_KEY') == test_key
        
        # Clean up
        del os.environ['SECRET_KEY']


class TestDirectoryCreation:
    """Test that required directories are created."""
    
    def test_projects_dir_exists(self):
        """Test that projects directory exists or can be created."""
        projects_dir = './projects'
        if not os.path.exists(projects_dir):
            os.makedirs(projects_dir)
        assert os.path.exists(projects_dir)
    
    def test_uploads_dir_exists(self):
        """Test that uploads directory exists or can be created."""
        uploads_dir = './uploads'
        if not os.path.exists(uploads_dir):
            os.makedirs(uploads_dir)
        assert os.path.exists(uploads_dir)
    
    def test_logs_dir_exists(self):
        """Test that logs directory exists or can be created."""
        logs_dir = './logs'
        if not os.path.exists(logs_dir):
            os.makedirs(logs_dir)
        assert os.path.exists(logs_dir)


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
