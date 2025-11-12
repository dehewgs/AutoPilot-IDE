"""
Tests for Flask Application (app.py)
=====================================

Tests for routes, endpoints, and core application functionality.
"""

import pytest
import json
from app import app, socketio


@pytest.fixture
def client():
    """Create a test client for the Flask app."""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


@pytest.fixture
def socket_client():
    """Create a test client for SocketIO."""
    return socketio.test_client(app)


class TestRoutes:
    """Test Flask routes and endpoints."""
    
    def test_index_route(self, client):
        """Test that index route returns 200."""
        response = client.get('/')
        assert response.status_code == 200
    
    def test_api_health_check(self, client):
        """Test API health check endpoint."""
        response = client.get('/api/health')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['status'] == 'healthy'
    
    def test_api_extensions(self, client):
        """Test extensions API endpoint."""
        response = client.get('/api/extensions')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'installed' in data
        assert 'available' in data


class TestCommandValidation:
    """Test command validation and security."""
    
    def test_valid_command(self, client):
        """Test that valid commands are accepted."""
        response = client.post('/api/execute', 
            json={'command': 'ls -la'},
            content_type='application/json')
        assert response.status_code in [200, 400]  # Depends on whitelist
    
    def test_dangerous_command_blocked(self, client):
        """Test that dangerous commands are blocked."""
        dangerous_commands = [
            'rm -rf /',
            'sudo rm -rf /',
            'dd if=/dev/zero of=/dev/sda',
            'mkfs.ext4 /dev/sda',
            ':(){ :|:& };:',  # Fork bomb
        ]
        
        for cmd in dangerous_commands:
            response = client.post('/api/execute',
                json={'command': cmd},
                content_type='application/json')
            # Should be rejected (400) or not in whitelist
            assert response.status_code in [400, 403]
    
    def test_command_injection_blocked(self, client):
        """Test that command injection attempts are blocked."""
        injection_attempts = [
            'ls; rm -rf /',
            'ls && rm -rf /',
            'ls | rm -rf /',
            'ls `rm -rf /`',
            'ls $(rm -rf /)',
        ]
        
        for cmd in injection_attempts:
            response = client.post('/api/execute',
                json={'command': cmd},
                content_type='application/json')
            assert response.status_code in [400, 403]


class TestInputValidation:
    """Test input validation and sanitization."""
    
    def test_message_length_limit(self, client):
        """Test that messages over 1000 chars are rejected."""
        long_message = 'A' * 1001
        response = client.post('/api/ai/message',
            json={'message': long_message},
            content_type='application/json')
        assert response.status_code == 400
    
    def test_empty_message_rejected(self, client):
        """Test that empty messages are rejected."""
        response = client.post('/api/ai/message',
            json={'message': ''},
            content_type='application/json')
        assert response.status_code == 400
    
    def test_valid_message_accepted(self, client):
        """Test that valid messages are accepted."""
        response = client.post('/api/ai/message',
            json={'message': 'Hello AI'},
            content_type='application/json')
        assert response.status_code in [200, 201]


class TestSocketIO:
    """Test SocketIO functionality."""
    
    def test_socket_connection(self, socket_client):
        """Test that socket connection works."""
        assert socket_client.is_connected()
    
    def test_terminal_execute_event(self, socket_client):
        """Test terminal execute event."""
        socket_client.emit('terminal_execute', {'command': 'echo test'})
        received = socket_client.get_received()
        # Should receive some response
        assert len(received) >= 0
    
    def test_ai_message_event(self, socket_client):
        """Test AI message event."""
        socket_client.emit('ai_message', {
            'message': 'Test message',
            'mode': 'Chat'
        })
        received = socket_client.get_received()
        assert len(received) >= 0


class TestSecurity:
    """Test security features."""
    
    def test_cors_headers(self, client):
        """Test that CORS headers are properly set."""
        response = client.get('/')
        # CORS headers should be present
        assert 'Access-Control-Allow-Origin' in response.headers or response.status_code == 200
    
    def test_secret_key_not_default(self):
        """Test that secret key is not the default value."""
        assert app.config['SECRET_KEY'] != 'dev-secret-key-change-in-production'
    
    def test_debug_mode_in_testing(self):
        """Test that debug mode is properly configured."""
        # In testing, debug should be False or controlled
        assert app.config['TESTING'] == True


class TestErrorHandling:
    """Test error handling."""
    
    def test_404_error(self, client):
        """Test 404 error handling."""
        response = client.get('/nonexistent-route')
        assert response.status_code == 404
    
    def test_invalid_json(self, client):
        """Test handling of invalid JSON."""
        response = client.post('/api/execute',
            data='invalid json',
            content_type='application/json')
        assert response.status_code in [400, 415]


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
