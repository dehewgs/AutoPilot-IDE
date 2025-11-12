from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room
import os
import json
import subprocess
import threading
import queue
from datetime import datetime
from pathlib import Path
import logging

app = Flask(__name__, template_folder='.', static_folder='.')
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

PROJECT_ROOT = Path(__file__).parent
PROJECTS_DIR = PROJECT_ROOT / "projects"
PROJECTS_DIR.mkdir(exist_ok=True)

class TerminalManager:
    def __init__(self):
        self.terminals = {}
        self.output_queues = {}
    
    def create_terminal(self, terminal_id):
        self.terminals[terminal_id] = {
            'process': None,
            'created_at': datetime.now().isoformat()
        }
        self.output_queues[terminal_id] = queue.Queue()
    
    def execute_command(self, terminal_id, command):
        try:
            result = subprocess.run(
                command,
                shell=True,
                capture_output=True,
                text=True,
                timeout=30,
                cwd=PROJECTS_DIR
            )
            return {
                'stdout': result.stdout,
                'stderr': result.stderr,
                'returncode': result.returncode
            }
        except subprocess.TimeoutExpired:
            return {
                'stdout': '',
                'stderr': 'Command timeout',
                'returncode': -1
            }
        except Exception as e:
            return {
                'stdout': '',
                'stderr': str(e),
                'returncode': -1
            }

terminal_manager = TerminalManager()

class FileManager:
    @staticmethod
    def get_project_structure(project_path):
        structure = []
        try:
            for item in sorted(os.listdir(project_path)):
                if item.startswith('.'):
                    continue
                item_path = os.path.join(project_path, item)
                if os.path.isdir(item_path):
                    structure.append({
                        'name': item,
                        'type': 'folder',
                        'path': item_path,
                        'children': FileManager.get_project_structure(item_path)
                    })
                else:
                    structure.append({
                        'name': item,
                        'type': 'file',
                        'path': item_path
                    })
        except PermissionError:
            pass
        return structure
    
    @staticmethod
    def read_file(file_path):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            return f"Error reading file: {str(e)}"
    
    @staticmethod
    def write_file(file_path, content):
        try:
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return {'success': True}
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    @staticmethod
    def create_file(file_path):
        try:
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            Path(file_path).touch()
            return {'success': True}
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    @staticmethod
    def create_folder(folder_path):
        try:
            os.makedirs(folder_path, exist_ok=True)
            return {'success': True}
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    @staticmethod
    def delete_file(file_path):
        try:
            if os.path.isfile(file_path):
                os.remove(file_path)
            elif os.path.isdir(file_path):
                import shutil
                shutil.rmtree(file_path)
            return {'success': True}
        except Exception as e:
            return {'success': False, 'error': str(e)}

class ExtensionManager:
    def __init__(self):
        self.extensions_file = PROJECT_ROOT / "extensions.json"
        self.load_extensions()
    
    def load_extensions(self):
        try:
            if self.extensions_file.exists():
                with open(self.extensions_file, 'r') as f:
                    self.extensions = json.load(f)
            else:
                self.extensions = self._default_extensions()
                self.save_extensions()
        except Exception as e:
            logger.error(f"Error loading extensions: {e}")
            self.extensions = self._default_extensions()
    
    def _default_extensions(self):
        return {
            'installed': [
                {'id': 1, 'name': 'Python Linter', 'version': '1.0.0', 'enabled': True},
                {'id': 2, 'name': 'Git Integration', 'version': '2.1.0', 'enabled': True},
                {'id': 3, 'name': 'Docker Support', 'version': '1.5.0', 'enabled': False},
                {'id': 4, 'name': 'REST Client', 'version': '0.9.0', 'enabled': True}
            ],
            'available': [
                {'id': 101, 'name': 'TypeScript Support', 'version': '1.2.0', 'description': 'Full TypeScript language support'},
                {'id': 102, 'name': 'Database Explorer', 'version': '2.0.0', 'description': 'Browse and query databases'},
                {'id': 103, 'name': 'API Tester', 'version': '1.8.0', 'description': 'Test REST APIs directly'},
                {'id': 104, 'name': 'Code Formatter', 'version': '3.1.0', 'description': 'Auto-format code with multiple styles'},
                {'id': 105, 'name': 'Theme Pack', 'version': '1.0.0', 'description': 'Additional color themes'}
            ]
        }
    
    def save_extensions(self):
        try:
            with open(self.extensions_file, 'w') as f:
                json.dump(self.extensions, f, indent=2)
        except Exception as e:
            logger.error(f"Error saving extensions: {e}")
    
    def toggle_extension(self, ext_id):
        for ext in self.extensions['installed']:
            if ext['id'] == ext_id:
                ext['enabled'] = not ext['enabled']
                self.save_extensions()
                return ext
        return None
    
    def install_extension(self, ext_id):
        for avail in self.extensions['available']:
            if avail['id'] == ext_id:
                new_ext = {
                    'id': avail['id'],
                    'name': avail['name'],
                    'version': avail['version'],
                    'enabled': True
                }
                self.extensions['installed'].append(new_ext)
                self.extensions['available'].remove(avail)
                self.save_extensions()
                return new_ext
        return None
    
    def uninstall_extension(self, ext_id):
        for ext in self.extensions['installed']:
            if ext['id'] == ext_id:
                self.extensions['available'].append({
                    'id': ext['id'],
                    'name': ext['name'],
                    'version': ext['version'],
                    'description': f"{ext['name']} extension"
                })
                self.extensions['installed'].remove(ext)
                self.save_extensions()
                return True
        return False

extension_manager = ExtensionManager()

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/api/projects', methods=['GET'])
def get_projects():
    try:
        projects = []
        for item in os.listdir(PROJECTS_DIR):
            item_path = PROJECTS_DIR / item
            if os.path.isdir(item_path):
                projects.append({
                    'name': item,
                    'path': str(item_path),
                    'created': os.path.getctime(item_path)
                })
        return jsonify({'projects': projects})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/projects/<project_name>/structure', methods=['GET'])
def get_project_structure(project_name):
    try:
        project_path = PROJECTS_DIR / project_name
        if not project_path.exists():
            return jsonify({'error': 'Project not found'}), 404
        structure = FileManager.get_project_structure(str(project_path))
        return jsonify({'structure': structure})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/files/read', methods=['POST'])
def read_file():
    try:
        data = request.json
        file_path = data.get('path')
        if not file_path:
            return jsonify({'error': 'Path required'}), 400
        content = FileManager.read_file(file_path)
        return jsonify({'content': content})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/files/write', methods=['POST'])
def write_file():
    try:
        data = request.json
        file_path = data.get('path')
        content = data.get('content', '')
        if not file_path:
            return jsonify({'error': 'Path required'}), 400
        result = FileManager.write_file(file_path, content)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/files/create', methods=['POST'])
def create_file():
    try:
        data = request.json
        file_path = data.get('path')
        file_type = data.get('type', 'file')
        if not file_path:
            return jsonify({'error': 'Path required'}), 400
        
        if file_type == 'folder':
            result = FileManager.create_folder(file_path)
        else:
            result = FileManager.create_file(file_path)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/files/delete', methods=['POST'])
def delete_file():
    try:
        data = request.json
        file_path = data.get('path')
        if not file_path:
            return jsonify({'error': 'Path required'}), 400
        result = FileManager.delete_file(file_path)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/extensions', methods=['GET'])
def get_extensions():
    return jsonify(extension_manager.extensions)

@app.route('/api/extensions/<int:ext_id>/toggle', methods=['POST'])
def toggle_extension(ext_id):
    result = extension_manager.toggle_extension(ext_id)
    if result:
        return jsonify(result)
    return jsonify({'error': 'Extension not found'}), 404

@app.route('/api/extensions/<int:ext_id>/install', methods=['POST'])
def install_extension(ext_id):
    result = extension_manager.install_extension(ext_id)
    if result:
        return jsonify(result)
    return jsonify({'error': 'Extension not found'}), 404

@app.route('/api/extensions/<int:ext_id>/uninstall', methods=['POST'])
def uninstall_extension(ext_id):
    if extension_manager.uninstall_extension(ext_id):
        return jsonify({'success': True})
    return jsonify({'error': 'Extension not found'}), 404

@socketio.on('connect')
def handle_connect():
    logger.info(f"Client connected: {request.sid}")
    emit('connection_response', {'data': 'Connected to server'})

@socketio.on('disconnect')
def handle_disconnect():
    logger.info(f"Client disconnected: {request.sid}")

@socketio.on('terminal_create')
def handle_terminal_create(data):
    terminal_id = data.get('terminal_id', request.sid)
    terminal_manager.create_terminal(terminal_id)
    emit('terminal_created', {'terminal_id': terminal_id})

@socketio.on('terminal_execute')
def handle_terminal_execute(data):
    terminal_id = data.get('terminal_id', request.sid)
    command = data.get('command', '')
    
    if not command:
        emit('terminal_output', {'error': 'No command provided'})
        return
    
    result = terminal_manager.execute_command(terminal_id, command)
    emit('terminal_output', result)

@socketio.on('ai_message')
def handle_ai_message(data):
    message = data.get('message', '')
    mode = data.get('mode', 'chat')
    context = data.get('context', {})
    
    response = {
        'mode': mode,
        'message': message,
        'context': context,
        'timestamp': datetime.now().isoformat()
    }
    
    emit('ai_response', response, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
