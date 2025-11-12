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
from appdata_manager import appdata_manager

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(appdata_manager.get_logs_dir() / 'autopilot-ide.log'),
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

# Whitelist of safe commands for terminal
ALLOWED_COMMANDS = {
    # Navigation
    'ls', 'dir', 'pwd', 'cd', 'pushd', 'popd',
    # File operations
    'cat', 'head', 'tail', 'grep', 'find', 'cp', 'mv', 'rm', 'mkdir', 'rmdir', 'touch',
    # Text processing
    'echo', 'sed', 'awk', 'sort', 'uniq', 'wc', 'cut',
    # System
    'clear', 'cls', 'echo', 'whoami', 'date', 'time',
    # Development
    'python', 'python3', 'pip', 'pip3', 'npm', 'node', 'git', 'docker',
    # Help
    'help', 'man', 'info',
    # Compression
    'tar', 'zip', 'unzip', 'gzip', 'gunzip',
    # Networking
    'ping', 'curl', 'wget', 'netstat',
    # Permissions
    'chmod', 'chown'
}

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

# ============================================================================
# PROJECTS API
# ============================================================================

@app.route('/api/projects', methods=['GET'])
def get_projects():
    """Get list of all projects"""
    try:
        projects = appdata_manager.list_projects()
        return jsonify({"projects": projects})
    except Exception as e:
        logger.error(f"Error getting projects: {e}")
        return jsonify({"error": "Failed to load projects"}), 500

@app.route('/api/projects/<project_id>', methods=['GET'])
def get_project(project_id):
    """Get a specific project"""
    try:
        project = appdata_manager.load_project(project_id)
        return jsonify(project)
    except FileNotFoundError:
        return jsonify({"error": "Project not found"}), 404
    except Exception as e:
        logger.error(f"Error loading project: {e}")
        return jsonify({"error": "Failed to load project"}), 500

@app.route('/api/projects', methods=['POST'])
def create_project():
    """Create a new project"""
    try:
        project_data = request.json
        if not project_data.get('id'):
            return jsonify({"error": "Project ID is required"}), 400
        
        appdata_manager.save_project(project_data)
        return jsonify({"status": "success", "project": project_data})
    except Exception as e:
        logger.error(f"Error creating project: {e}")
        return jsonify({"error": "Failed to create project"}), 500

@app.route('/api/projects/<project_id>', methods=['PUT'])
def update_project(project_id):
    """Update a project"""
    try:
        project_data = request.json
        project_data['id'] = project_id
        appdata_manager.save_project(project_data)
        return jsonify({"status": "success", "project": project_data})
    except Exception as e:
        logger.error(f"Error updating project: {e}")
        return jsonify({"error": "Failed to update project"}), 500

@app.route('/api/projects/<project_id>', methods=['DELETE'])
def delete_project(project_id):
    """Delete a project"""
    try:
        if appdata_manager.delete_project(project_id):
            return jsonify({"status": "success"})
        return jsonify({"error": "Project not found"}), 404
    except Exception as e:
        logger.error(f"Error deleting project: {e}")
        return jsonify({"error": "Failed to delete project"}), 500

# ============================================================================
# LAYOUTS API
# ============================================================================

@app.route('/api/layouts', methods=['GET'])
def get_layouts():
    """Get all saved layouts"""
    try:
        layouts = appdata_manager.list_layouts()
        return jsonify(layouts)
    except Exception as e:
        logger.error(f"Error getting layouts: {e}")
        return jsonify({"error": "Failed to load layouts"}), 500

@app.route('/api/layouts/<layout_id>', methods=['GET'])
def get_layout(layout_id):
    """Get a specific layout"""
    try:
        layout = appdata_manager.load_layout(layout_id)
        return jsonify(layout)
    except FileNotFoundError:
        return jsonify({"error": "Layout not found"}), 404
    except Exception as e:
        logger.error(f"Error loading layout: {e}")
        return jsonify({"error": "Failed to load layout"}), 500

@app.route('/api/layouts', methods=['POST'])
def save_layout():
    """Save a new layout"""
    try:
        layout_data = request.json
        if not layout_data.get('id'):
            return jsonify({"error": "Layout ID is required"}), 400
        
        appdata_manager.save_layout(layout_data)
        return jsonify({"status": "success", "layout": layout_data})
    except Exception as e:
        logger.error(f"Error saving layout: {e}")
        return jsonify({"error": "Failed to save layout"}), 500

@app.route('/api/layouts/<layout_id>', methods=['DELETE'])
def delete_layout(layout_id):
    """Delete a layout"""
    try:
        if appdata_manager.delete_layout(layout_id):
            return jsonify({"status": "success"})
        return jsonify({"error": "Layout not found"}), 404
    except Exception as e:
        logger.error(f"Error deleting layout: {e}")
        return jsonify({"error": "Failed to delete layout"}), 500

# ============================================================================
# THEMES API
# ============================================================================

@app.route('/api/themes', methods=['GET'])
def get_themes():
    """Get all available themes"""
    try:
        themes = appdata_manager.list_themes()
        return jsonify(themes)
    except Exception as e:
        logger.error(f"Error getting themes: {e}")
        return jsonify({"error": "Failed to load themes"}), 500

@app.route('/api/themes/<theme_id>', methods=['GET'])
def get_theme(theme_id):
    """Get a specific theme"""
    try:
        theme = appdata_manager.load_theme(theme_id)
        return jsonify(theme)
    except FileNotFoundError:
        return jsonify({"error": "Theme not found"}), 404
    except Exception as e:
        logger.error(f"Error loading theme: {e}")
        return jsonify({"error": "Failed to load theme"}), 500

@app.route('/api/themes', methods=['POST'])
def save_theme():
    """Save a new theme"""
    try:
        theme_data = request.json
        if not theme_data.get('id'):
            return jsonify({"error": "Theme ID is required"}), 400
        
        appdata_manager.save_theme(theme_data)
        return jsonify({"status": "success", "theme": theme_data})
    except Exception as e:
        logger.error(f"Error saving theme: {e}")
        return jsonify({"error": "Failed to save theme"}), 500

# ============================================================================
# EXTENSIONS API
# ============================================================================

@app.route('/api/extensions', methods=['GET'])
def get_extensions():
    """Get all extensions"""
    try:
        extensions = appdata_manager.list_extensions()
        # For backward compatibility, return in old format
        return jsonify({
            "installed": [ext for ext in extensions if ext.get('installed', False)],
            "available": [ext for ext in extensions if not ext.get('installed', False)]
        })
    except Exception as e:
        logger.error(f"Error getting extensions: {e}")
        return jsonify({"error": "Failed to load extensions"}), 500

@app.route('/api/extensions/<ext_id>/toggle', methods=['POST'])
def toggle_extension(ext_id):
    """Toggle extension enabled/disabled status"""
    try:
        extension = appdata_manager.load_extension(str(ext_id))
        extension['enabled'] = not extension.get('enabled', False)
        appdata_manager.save_extension(extension)
        logger.info(f"Toggled extension {ext_id}: {extension['name']}")
        return jsonify({"status": "success", "extension": extension})
    except FileNotFoundError:
        return jsonify({"status": "error", "message": "Extension not found"}), 404
    except Exception as e:
        logger.error(f"Error toggling extension: {e}")
        return jsonify({"error": "Failed to toggle extension"}), 500

@app.route('/api/extensions/<ext_id>/install', methods=['POST'])
def install_extension(ext_id):
    """Install an extension"""
    try:
        # This would typically download and install the extension
        # For now, just mark it as installed
        extension = appdata_manager.load_extension(str(ext_id))
        extension['installed'] = True
        extension['enabled'] = True
        appdata_manager.save_extension(extension)
        logger.info(f"Installed extension {ext_id}: {extension['name']}")
        return jsonify({"status": "success", "extension": extension})
    except Exception as e:
        logger.error(f"Error installing extension: {e}")
        return jsonify({"error": "Failed to install extension"}), 500

@app.route('/api/extensions/<ext_id>/uninstall', methods=['POST'])
def uninstall_extension(ext_id):
    """Uninstall an extension"""
    try:
        extension = appdata_manager.load_extension(str(ext_id))
        extension['installed'] = False
        extension['enabled'] = False
        appdata_manager.save_extension(extension)
        logger.info(f"Uninstalled extension {ext_id}: {extension['name']}")
        return jsonify({"status": "success"})
    except Exception as e:
        logger.error(f"Error uninstalling extension: {e}")
        return jsonify({"error": "Failed to uninstall extension"}), 500

# ============================================================================
# SETTINGS API
# ============================================================================

@app.route('/api/settings', methods=['GET'])
def get_settings():
    """Get application settings"""
    try:
        settings = appdata_manager.load_settings()
        return jsonify(settings)
    except Exception as e:
        logger.error(f"Error getting settings: {e}")
        return jsonify({"error": "Failed to load settings"}), 500

@app.route('/api/settings', methods=['POST'])
def save_settings():
    """Save application settings"""
    try:
        settings_data = request.json
        appdata_manager.save_settings(settings_data)
        return jsonify({"status": "success", "settings": settings_data})
    except Exception as e:
        logger.error(f"Error saving settings: {e}")
        return jsonify({"error": "Failed to save settings"}), 500

@app.route('/api/storage-info', methods=['GET'])
def get_storage_info():
    """Get storage information"""
    try:
        info = appdata_manager.get_storage_info()
        return jsonify(info)
    except Exception as e:
        logger.error(f"Error getting storage info: {e}")
        return jsonify({"error": "Failed to get storage info"}), 500

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

# ============================================================================
# WebSocket Events
# ============================================================================

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
    print(f"[*] AppData Location: {appdata_manager.base_dir}")
    print(f"[*] Starting server on http://{host}:{port}")
    print("[*] 🌐 Browser will open automatically...")
    print("[*] Press Ctrl+C to stop the server\n")
    
    # Start browser in a separate thread to avoid blocking
    browser_thread = threading.Thread(target=open_browser, args=(host, port), daemon=True)
    browser_thread.start()
    
    socketio.run(app, host=host, port=port, debug=debug, use_reloader=False, allow_unsafe_werkzeug=True)
