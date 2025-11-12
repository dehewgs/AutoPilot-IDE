# AutoPilot IDE - AI-Enabled Integrated Development Environment

![AutoPilot IDE](https://img.shields.io/badge/AutoPilot-IDE-667eea?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.10+-blue?style=for-the-badge&logo=python)
![Flask](https://img.shields.io/badge/Flask-SocketIO-green?style=for-the-badge&logo=flask)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

A modern, AI-powered IDE with **resizable/movable windows**, **persistent layouts**, and **seamless project management**. Built with Flask, SocketIO, and vanilla JavaScript.

---

## 🚀 Features

### ✨ Window Management System
- **Resizable Panels**: All panels (sidebar, editor, terminal, AI assistant) can be resized with 8-directional handles
- **Movable Windows**: Drag panels anywhere on the screen using drag handles
- **Layout Persistence**: Save and restore custom window layouts
- **Auto-Save**: Layouts automatically save as you work
- **Constraint Enforcement**: Min/max sizes and viewport boundaries prevent panels from going off-screen

### 📁 Project Management
- **Single-Button Access**: Prominent "Open Project" button at the top center
- **Recent Projects**: Quick access to your last 10 projects
- **Project Browser**: Browse and open existing projects
- **Project Creation**: Create new projects with templates
- **AppData Storage**: All projects stored in cross-platform AppData directories

### 🤖 AI Assistant
- **Multiple Modes**: Chat, Explain, Debug, and Refactor modes
- **Real-time Communication**: WebSocket-based instant responses
- **Context Awareness**: AI understands your current project and code
- **Resizable Panel**: Adjust AI panel size to your preference

### 🖥️ Terminal Integration
- **Embedded Terminal**: Full terminal access within the IDE
- **Command Execution**: Run commands directly from the IDE
- **Output Streaming**: Real-time command output via WebSocket
- **Collapsible**: Minimize terminal when not needed

### 🎨 Themes & Extensions
- **Theme Support**: Dark and light themes (extensible)
- **Extension System**: Install and manage IDE extensions
- **Extension Manager**: Enable/disable extensions on the fly
- **AppData Storage**: Themes and extensions stored persistently

---

## 📦 Installation

### Prerequisites
- Python 3.10 or higher
- pip (Python package manager)
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/dehewgs/AutoPilot-IDE.git
   cd AutoPilot-IDE
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**
   ```bash
   python app.py
   ```

4. **Open in browser**
   - The IDE will automatically open at `http://localhost:5000`
   - If not, manually navigate to the URL

---

## 🏗️ Architecture

### Backend (Python/Flask)
```
app.py                    # Main Flask application with SocketIO
appdata_manager.py        # Cross-platform AppData management
requirements.txt          # Python dependencies
```

### Frontend (HTML/CSS/JavaScript)
```
index.html                # Main HTML structure
css/
  ├── styles.css          # Core IDE styling
  └── window-layout.css   # Window management styles
js/
  ├── app.js              # Main application logic
  └── window-layout-manager.js  # Window management system
```

### AppData Structure
```
%APPDATA%/AutoPilot-IDE/  (Windows)
~/.config/AutoPilot-IDE/  (Linux)
~/Library/Application Support/AutoPilot-IDE/  (macOS)
├── projects/             # Project configurations
├── layouts/              # Saved window layouts
├── themes/               # Custom themes
├── extensions/           # Extension data
├── settings/             # Application settings
├── logs/                 # Application logs
└── cache/                # Temporary cache
```

---

## 🎯 Usage Guide

### Opening Projects

1. Click the **"Open Project"** button at the top center
2. Choose from:
   - **Recent Projects**: Your last 10 opened projects
   - **Browse**: Navigate to an existing project folder
   - **Create New**: Start a new project with templates

### Managing Window Layouts

#### Save a Layout
1. Arrange panels to your preference (resize/move)
2. Click **"Save Layout"** in the top-right corner
3. Enter a name for your layout
4. Layout is saved automatically

#### Load a Layout
1. Click **"Layouts"** in the top-right corner
2. Select a saved layout from the list
3. Layout applies instantly

#### Reset Layout
1. Click **"Reset"** in the top-right corner
2. Confirm to restore default positions

### Using the AI Assistant

1. **Select a Mode**: Chat, Explain, Debug, or Refactor
2. **Type your question** in the input field
3. **Press Enter** or click the send button
4. **View AI response** in the chat area

### Terminal Commands

1. Click in the terminal input area
2. Type your command
3. Press Enter to execute
4. View output in real-time

### Managing Extensions

#### Install Extensions
1. Click **Extensions** → **Get Extensions**
2. Browse available extensions
3. Click **Install** on desired extensions

#### Manage Installed Extensions
1. Click **Extensions** → **Manage Extensions**
2. Enable/disable extensions with toggle buttons
3. Uninstall extensions you no longer need

---

## 🔧 API Endpoints

### Projects API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List all projects |
| GET | `/api/projects/<id>` | Get specific project |
| POST | `/api/projects` | Create new project |
| PUT | `/api/projects/<id>` | Update project |
| DELETE | `/api/projects/<id>` | Delete project |

### Layouts API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/layouts` | List all layouts |
| GET | `/api/layouts/<id>` | Get specific layout |
| POST | `/api/layouts` | Save new layout |
| DELETE | `/api/layouts/<id>` | Delete layout |

### Themes API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/themes` | List all themes |
| GET | `/api/themes/<id>` | Get specific theme |
| POST | `/api/themes` | Save new theme |

### Extensions API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/extensions` | List all extensions |
| POST | `/api/extensions/<id>/toggle` | Enable/disable extension |
| POST | `/api/extensions/<id>/install` | Install extension |
| POST | `/api/extensions/<id>/uninstall` | Uninstall extension |

### Settings API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings` | Get application settings |
| POST | `/api/settings` | Save application settings |
| GET | `/api/storage-info` | Get storage information |

---

## 🎨 Customization

### Creating Custom Themes

1. Create a JSON file in `%APPDATA%/AutoPilot-IDE/themes/`
2. Define your theme:
   ```json
   {
     "id": "my-theme",
     "name": "My Custom Theme",
     "colors": {
       "bg-primary": "#1e1e1e",
       "bg-secondary": "#252526",
       "accent-primary": "#667eea",
       "text-primary": "#d4d4d4"
     }
   }
   ```
3. Restart the IDE to load your theme

### Developing Extensions

1. Create a folder in `%APPDATA%/AutoPilot-IDE/extensions/`
2. Add a `manifest.json`:
   ```json
   {
     "id": "my-extension",
     "name": "My Extension",
     "version": "1.0.0",
     "description": "My custom extension",
     "main": "index.js"
   }
   ```
3. Implement your extension logic in `index.js`
4. Install via the Extensions Manager

---

## 🔌 WebSocket Events

### Client → Server
| Event | Data | Description |
|-------|------|-------------|
| `terminal_execute` | `{command: string}` | Execute terminal command |
| `ai_message` | `{message: string, mode: string}` | Send message to AI |

### Server → Client
| Event | Data | Description |
|-------|------|-------------|
| `terminal_output` | `{stdout: string, stderr: string}` | Terminal command output |
| `ai_response` | `{message: string}` | AI assistant response |

---

## 🛠️ Development

### Project Structure
```
AutoPilot-IDE/
├── app.py                      # Flask backend
├── appdata_manager.py          # AppData management
├── requirements.txt            # Python dependencies
├── index.html                  # Main HTML
├── css/
│   ├── styles.css              # Core styles
│   └── window-layout.css       # Window management styles
├── js/
│   ├── app.js                  # Main application
│   └── window-layout-manager.js # Window management
└── README.md                   # This file
```

### Running in Development Mode

```bash
# Enable Flask debug mode
export FLASK_ENV=development  # Linux/macOS
set FLASK_ENV=development     # Windows

# Run with auto-reload
python app.py
```

### Building for Production

```bash
# Install production dependencies
pip install gunicorn

# Run with Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 --worker-class eventlet app:app
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Open/close projects
- [ ] Resize all panels (sidebar, terminal, AI panel)
- [ ] Move panels around the screen
- [ ] Save and load layouts
- [ ] Execute terminal commands
- [ ] Send messages to AI assistant
- [ ] Install/uninstall extensions
- [ ] Switch themes
- [ ] Test on different browsers
- [ ] Test on different screen sizes

### Automated Testing (Coming Soon)
```bash
# Run unit tests
python -m pytest tests/

# Run integration tests
python -m pytest tests/integration/
```

---

## 🐛 Troubleshooting

### IDE doesn't open in browser
- Check if port 5000 is available
- Try manually navigating to `http://localhost:5000`
- Check firewall settings

### WebSocket connection fails
- Ensure Flask-SocketIO is installed: `pip install flask-socketio`
- Check browser console for errors
- Verify no proxy is blocking WebSocket connections

### Layouts not saving
- Check AppData directory permissions
- Verify `appdata_manager.py` is working: `python appdata_manager.py`
- Check browser console for API errors

### Terminal commands not executing
- Verify WebSocket connection is active (green indicator)
- Check backend logs for errors
- Ensure commands are valid for your OS

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

### Commit Message Format
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Flask** - Web framework
- **Socket.IO** - Real-time communication
- **Font Awesome** - Icons (if used)
- **VS Code** - Design inspiration

---

## 📧 Contact

- **GitHub**: [@dehewgs](https://github.com/dehewgs)
- **Repository**: [AutoPilot-IDE](https://github.com/dehewgs/AutoPilot-IDE)
- **Issues**: [Report a bug](https://github.com/dehewgs/AutoPilot-IDE/issues)

---

## 🗺️ Roadmap

### Version 1.1 (Planned)
- [ ] Code completion with AI
- [ ] Git integration
- [ ] Multi-file search
- [ ] Syntax highlighting improvements
- [ ] More themes

### Version 1.2 (Planned)
- [ ] Collaborative editing
- [ ] Cloud sync for layouts/settings
- [ ] Plugin marketplace
- [ ] Mobile responsive design
- [ ] Docker integration

### Version 2.0 (Future)
- [ ] Language server protocol support
- [ ] Debugger integration
- [ ] Performance profiling
- [ ] Advanced AI features
- [ ] Custom keybindings

---

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/dehewgs/AutoPilot-IDE?style=social)
![GitHub forks](https://img.shields.io/github/forks/dehewgs/AutoPilot-IDE?style=social)
![GitHub issues](https://img.shields.io/github/issues/dehewgs/AutoPilot-IDE)
![GitHub pull requests](https://img.shields.io/github/issues-pr/dehewgs/AutoPilot-IDE)

---

**Made with ❤️ by the AutoPilot IDE Team**

*Empowering developers with AI-assisted coding*
