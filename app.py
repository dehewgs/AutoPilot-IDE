import os
import json
import shlex
import logging
import webbrowser
import threading
from pathlib import Path
from flask import Flask, jsonify, send_from_directory, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from config import config

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('autopilot-ide.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__, static_folder='.')

# Get environment from environment variable, default to development
env = os.environ.get('FLASK_ENV', 'development')
app.config.from_object(config.get(env, config['development']))

# Configure CORS properly
allowed_origins = os.environ.get('CORS_ORIGINS', 'http://localhost:3000,http://localhost:5000,http://127.0.0.1:5000').split(',')
CORS(app, resources={r"/api/*": {"origins": allowed_origins}})

socketio = SocketIO(app, cors_allowed_origins=allowed_origins)

# Store for extensions
EXTENSIONS_FILE = Path(__file__).parent / "extensions.json"

# Whitelist of safe commands for terminal
ALLOWED_COMMANDS = {
    'ls', 'dir', 'pwd', 'echo', 'cat', 'head', 'tail', 
    'python', 'pip', 'npm', 'node', 'git', 'clear', 'help'
}

def load_extensions():
    """Load extensions from JSON file"""
    try:
        if EXTENSIONS_FILE.exists():
            with open(EXTENSIONS_FILE, 'r') as f:
                return json.load(f)
    except Exception as e:
        logger.error(f"Error loading extensions: {e}")
    return {"installed": [], "available": []}

def save_extensions(data):
    """Save extensions to JSON file"""
    try:
        with open(EXTENSIONS_FILE, 'w') as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        logger.error(f"Error saving extensions: {e}")
        raise

def validate_command(command):
    """Validate terminal command for security"""
    if not command or not command.strip():
        return False, "Empty command"
    
    # Parse command safely
    try:
        parts = shlex.split(command)
    except ValueError as e:
        return False, f"Invalid command syntax: {e}"
    
    if not parts:
        return False, "Empty command"
    
    base_command = parts[0]
    
    # Check if command is in whitelist
    if base_command not in ALLOWED_COMMANDS:
        return False, f"Command '{base_command}' is not allowed. Allowed commands: {', '.join(sorted(ALLOWED_COMMANDS))}"
    
    # Additional security checks
    dangerous_chars = ['&', '|', ';', '`', '$', '(', ')', '<', '>', '\n', '\r']
    for char in dangerous_chars:
        if char in command:
            return False, f"Dangerous character '{char}' not allowed in commands"
    
    return True, "Valid command"

def open_browser(host, port):
    """Open browser after a short delay to ensure server is ready"""
    import time
    time.sleep(1.5)  # Wait for server to start
    url = f"http://{host}:{port}"
    logger.info(f"🌐 Opening browser at {url}")
    try:
        webbrowser.open(url)
    except Exception as e:
        logger.warning(f"Could not auto-open browser: {e}")

# Initialize extensions file if it doesn't exist
if not EXTENSIONS_FILE.exists():
    initial_extensions = {
        "installed": [
            {"id": 1, "name": "Python Linter", "version": "1.0.0", "enabled": True},
            {"id": 2, "name": "Git Integration", "version": "2.1.0", "enabled": True},
            {"id": 3, "name": "REST Client", "version": "0.9.0", "enabled": True},
            {"id": 4, "name": "TypeScript Support", "version": "1.2.0", "enabled": True}
        ],
        "available": [
            {"id": 5, "name": "Database Explorer", "version": "2.0.0", "description": "Browse and query databases"},
            {"id": 6, "name": "API Tester", "version": "1.8.0", "description": "Test REST APIs directly"},
            {"id": 7, "name": "Code Formatter", "version": "3.1.0", "description": "Auto-format code with multiple styles"},
            {"id": 8, "name": "Theme Pack", "version": "1.0.0", "description": "Additional color themes"}
        ]
    }
    save_extensions(initial_extensions)

# Create necessary directories
for directory in [app.config.get('PROJECTS_DIR'), app.config.get('UPLOAD_FOLDER')]:
    if directory:
        Path(directory).mkdir(parents=True, exist_ok=True)

@app.route('/')
def index():
    """Serve the main HTML file"""
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files"""
    # Prevent directory traversal
    if '..' in filename or filename.startswith('/'):
        return jsonify({"error": "Invalid file path"}), 400
    return send_from_directory('.', filename)

# API Routes
@app.route('/api/extensions', methods=['GET'])
def get_extensions():
    """Get all extensions"""
    try:
        return jsonify(load_extensions())
    except Exception as e:
        logger.error(f"Error getting extensions: {e}")
        return jsonify({"error": "Failed to load extensions"}), 500

@app.route('/api/extensions/<int:ext_id>/toggle', methods=['POST'])
def toggle_extension(ext_id):
    """Toggle extension enabled/disabled status"""
    try:
        data = load_extensions()
        for ext in data['installed']:
            if ext['id'] == ext_id:
                ext['enabled'] = not ext['enabled']
                save_extensions(data)
                logger.info(f"Toggled extension {ext_id}: {ext['name']}")
                return jsonify({"status": "success", "extension": ext})
        return jsonify({"status": "error", "message": "Extension not found"}), 404
    except Exception as e:
        logger.error(f"Error toggling extension: {e}")
        return jsonify({"error": "Failed to toggle extension"}), 500

@app.route('/api/extensions/<int:ext_id>/install', methods=['POST'])
def install_extension(ext_id):
    """Install an extension"""
    try:
        data = load_extensions()
        for ext in data['available']:
            if ext['id'] == ext_id:
                ext['enabled'] = True
                data['installed'].append(ext)
                data['available'].remove(ext)
                save_extensions(data)
                logger.info(f"Installed extension {ext_id}: {ext['name']}")
                return jsonify({"status": "success", "extension": ext})
        return jsonify({"status": "error", "message": "Extension not found"}), 404
    except Exception as e:
        logger.error(f"Error installing extension: {e}")
        return jsonify({"error": "Failed to install extension"}), 500

@app.route('/api/extensions/<int:ext_id>/uninstall', methods=['POST'])
def uninstall_extension(ext_id):
    """Uninstall an extension"""
    try:
        data = load_extensions()
        for ext in data['installed']:
            if ext['id'] == ext_id:
                data['available'].append({
                    "id": ext['id'],
                    "name": ext['name'],
                    "version": ext['version'],
                    "description": f"Uninstalled {ext['name']}"
                })
                data['installed'].remove(ext)
                save_extensions(data)
                logger.info(f"Uninstalled extension {ext_id}: {ext['name']}")
                return jsonify({"status": "success"})
        return jsonify({"status": "error", "message": "Extension not found"}), 404
    except Exception as e:
        logger.error(f"Error uninstalling extension: {e}")
        return jsonify({"error": "Failed to uninstall extension"}), 500

@app.route('/api/projects', methods=['GET'])
def get_projects():
    """Get list of projects"""
    return jsonify({
        "projects": [
            {"id": 1, "name": "AutoPilot-Project", "path": "./projects/autopilot", "language": "Python"}
        ]
    })

@app.route('/api/files', methods=['GET'])
def get_files():
    """Get file tree structure"""
    return jsonify({
        "files": [
            {"name": "main.py", "type": "file", "path": "main.py"},
            {"name": "src", "type": "folder", "path": "src", "children": [
                {"name": "utils.py", "type": "file", "path": "src/utils.py"},
                {"name": "config.py", "type": "file", "path": "src/config.py"}
            ]},
            {"name": "README.md", "type": "file", "path": "README.md"}
        ]
    })

# WebSocket Events
@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    logger.info('Client connected')
    emit('response', {'data': 'Connected to backend'})

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    logger.info('Client disconnected')

@socketio.on('terminal_execute')
def handle_terminal_command(data):
    """Execute terminal command with security validation"""
    command = data.get('command', '').strip()
    
    # Validate command
    is_valid, message = validate_command(command)
    
    if not is_valid:
        logger.warning(f"Blocked unsafe command: {command}")
        emit('terminal_output', {
            'stderr': f"⚠️  Security Error: {message}"
        })
        return
    
    try:
        # Use shlex.split for safe command parsing
        import subprocess
        parts = shlex.split(command)
        
        result = subprocess.run(
            parts,
            capture_output=True,
            text=True,
            timeout=10,
            shell=False  # NEVER use shell=True
        )
        
        logger.info(f"Executed command: {command}")
        emit('terminal_output', {
            'stdout': result.stdout,
            'stderr': result.stderr
        })
    except subprocess.TimeoutExpired:
        logger.warning(f"Command timed out: {command}")
        emit('terminal_output', {
            'stderr': '⏱️  Command timed out (10s limit)'
        })
    except FileNotFoundError:
        emit('terminal_output', {
            'stderr': f"❌ Command not found: {parts[0]}"
        })
    except Exception as e:
        logger.error(f"Error executing command: {e}")
        emit('terminal_output', {
            'stderr': f"❌ Error: {str(e)}"
        })

@socketio.on('ai_message')
def handle_ai_message(data):
    """Handle AI assistant messages"""
    message = data.get('message', '').strip()
    mode = data.get('mode', 'Chat')
    
    if not message:
        return
    
    # Sanitize input
    message = message[:1000]  # Limit message length
    
    # Simple AI response logic
    responses = {
        "Chat": f"I received your message: {message}",
        "Explain": f"Explaining: {message}",
        "Debug": f"Debugging: {message}",
        "Refactor": f"Refactoring: {message}"
    }
    
    response = responses.get(mode, f"Processing: {message}")
    logger.info(f"AI message processed in {mode} mode")
    emit('ai_response', {'message': response})

if __name__ == '__main__':
    # Get configuration from environment
    host = os.environ.get('HOST', '127.0.0.1')
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('DEBUG', 'True').lower() == 'true'
    
    print("=" * 60)
    print("  🚀 AutoPilot IDE - Backend Server")
    print("=" * 60)
    print(f"\n[*] Environment: {env}")
    print(f"[*] Starting server on http://{host}:{port}")
    print("[*] 🌐 Browser will open automatically...")
    print("[*] Press Ctrl+C to stop the server\n")
    
    # Start browser in a separate thread to avoid blocking
    browser_thread = threading.Thread(target=open_browser, args=(host, port), daemon=True)
    browser_thread.start()
    
    socketio.run(app, host=host, port=port, debug=debug)
