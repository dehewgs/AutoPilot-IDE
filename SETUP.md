# AutoPilot IDE - Setup Guide

## Quick Start (Windows)

### Option 1: Automatic Setup (Recommended)
1. Download the project
2. Double-click `Launcher.bat`
3. Wait for dependencies to install
4. Open your browser to `http://localhost:5000`

### Option 2: Manual Setup

#### Prerequisites
- Python 3.8 or higher
- pip (comes with Python)

#### Installation Steps

1. **Extract the project** to your desired location

2. **Open Command Prompt** in the project directory

3. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```

4. **Activate the virtual environment:**
   ```bash
   venv\Scripts\activate
   ```

5. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

6. **Run the application:**
   ```bash
   python app.py
   ```

7. **Open your browser** and go to:
   ```
   http://localhost:5000
   ```

## Features

✨ **AI-Powered IDE**
- Integrated AI Assistant with multiple modes (Chat, Explain, Debug, Refactor)
- Real-time code suggestions and optimization

📁 **File Explorer**
- Browse and manage project files
- Quick file navigation

💻 **Code Editor**
- Syntax highlighting
- Line numbers
- Multiple file tabs

🖥️ **Terminal**
- Integrated terminal emulator
- Execute commands directly
- Real-time output

🔌 **Extensions**
- Manage extensions
- Install/uninstall plugins
- Enable/disable features

## System Requirements

- **OS**: Windows 7 or later
- **RAM**: 2GB minimum (4GB recommended)
- **Disk Space**: 500MB
- **Python**: 3.8+

## Troubleshooting

### Python not found
- Install Python from https://www.python.org/
- Make sure to check "Add Python to PATH" during installation
- Restart your computer after installation

### Port 5000 already in use
- Close other applications using port 5000
- Or modify the port in `app.py` (line with `socketio.run()`)

### Dependencies installation fails
- Try: `pip install --upgrade pip`
- Then: `pip install -r requirements.txt --no-cache-dir`

### Browser can't connect
- Make sure the server is running (check Command Prompt)
- Try refreshing the page (Ctrl+R)
- Check firewall settings

## Project Structure

```
AutoPilot-IDE/
├── index.html          # Main frontend
├── app.py              # Flask backend
├── config.py           # Configuration
├── requirements.txt    # Python dependencies
├── Launcher.bat        # Windows launcher
├── extensions.json     # Extensions data
└── README.md           # Documentation
```

## Development

### Backend (Python/Flask)
- Located in `app.py`
- Handles file management, extensions, and terminal commands
- Uses Flask-SocketIO for real-time communication

### Frontend (HTML/CSS/JavaScript)
- Located in `index.html`
- Responsive design with dark theme
- Real-time updates via WebSocket

## API Endpoints

### Extensions
- `GET /api/extensions` - Get all extensions
- `POST /api/extensions/<id>/toggle` - Toggle extension
- `POST /api/extensions/<id>/install` - Install extension
- `POST /api/extensions/<id>/uninstall` - Uninstall extension

### Projects
- `GET /api/projects` - Get projects list
- `GET /api/files` - Get file tree

### WebSocket Events
- `terminal_execute` - Execute terminal command
- `ai_message` - Send message to AI assistant
- `terminal_output` - Receive terminal output
- `ai_response` - Receive AI response

## Support

For issues or questions, visit:
- GitHub: https://github.com/dehewgs/AutoPilot-IDE
- Issues: https://github.com/dehewgs/AutoPilot-IDE/issues

## License

See LICENSE file for details

---

**Version**: 1.0.0
**Last Updated**: November 2025
