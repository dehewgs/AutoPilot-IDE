# 🚀 AutoPilot IDE - AI-Enabled Integrated Development Environment

[![GitHub](https://img.shields.io/badge/GitHub-dehewgs%2FAutoPilot--IDE-blue?logo=github)](https://github.com/dehewgs/AutoPilot-IDE)
[![Python](https://img.shields.io/badge/Python-3.8%2B-blue?logo=python)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.0%2B-green?logo=flask)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

A modern, AI-powered Integrated Development Environment (IDE) built with Flask and JavaScript. Features real-time code editing, AI assistance, terminal integration, and extension management.

## ✨ Features

### 🤖 AI Assistant
- **Multiple Modes**: Chat, Explain, Debug, Refactor
- **Real-time Suggestions**: Get code optimization tips
- **Context Aware**: Understands your project structure
- **Hugging Face Integration**: Powered by state-of-the-art models

### 💻 Code Editor
- **Syntax Highlighting**: Support for multiple languages
- **Line Numbers**: Easy code navigation
- **Multiple Tabs**: Work with multiple files
- **Real-time Editing**: Instant feedback

### 📁 File Explorer
- **Project Navigation**: Browse files and folders
- **Quick Access**: Favorite files and folders
- **File Management**: Create, rename, delete files
- **Context Menu**: Right-click operations

### 🖥️ Integrated Terminal
- **Command Execution**: Run commands directly
- **Multiple Tabs**: Multiple terminal sessions
- **Real-time Output**: Live command output
- **Resizable**: Adjust terminal size as needed

### 🔌 Extension System
- **Install Extensions**: Extend functionality
- **Manage Extensions**: Enable/disable plugins
- **Extension Marketplace**: Browse available extensions
- **Custom Extensions**: Create your own

### 🎨 Modern UI
- **Dark Theme**: Easy on the eyes
- **Responsive Design**: Works on all screen sizes
- **Smooth Animations**: Polished user experience
- **Customizable**: Personalize your workspace

## 🚀 Quick Start

### Windows Users
1. Download the project
2. Double-click `Launcher.bat`
3. Open `http://localhost:5000` in your browser

### Manual Setup
```bash
# Create virtual environment
python -m venv venv

# Activate it
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run the application
python app.py
```

Then open your browser to `http://localhost:5000`

## 📋 System Requirements

- **OS**: Windows 7+, macOS 10.12+, Linux
- **Python**: 3.8 or higher
- **RAM**: 2GB minimum (4GB recommended)
- **Disk Space**: 500MB
- **Browser**: Chrome, Firefox, Safari, Edge (latest versions)

## 📁 Project Structure

```
AutoPilot-IDE/
├── Launcher.bat          # Windows launcher (double-click to start)
├── Cleanup.bat           # Windows cleanup script
├── index.html            # Frontend UI
├── app.py                # Flask backend server
├── config.py             # Configuration settings
├── requirements.txt      # Python dependencies
├── QUICKSTART.md         # Quick start guide
├── SETUP.md              # Detailed setup guide
├── README.md             # This file
├── LICENSE               # MIT License
└── extensions.json       # Extensions data (auto-created)
```

## 🔧 Configuration

Edit `config.py` to customize:
- Debug mode
- Server port
- CORS settings
- Upload folder
- Maximum file size

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get started in 30 seconds
- **[SETUP.md](SETUP.md)** - Detailed installation guide
- **[API Documentation](#api-endpoints)** - Backend API reference

## 🌐 API Endpoints

### Extensions
```
GET    /api/extensions                    # Get all extensions
POST   /api/extensions/<id>/toggle        # Toggle extension
POST   /api/extensions/<id>/install       # Install extension
POST   /api/extensions/<id>/uninstall     # Uninstall extension
```

### Projects
```
GET    /api/projects                      # Get projects list
GET    /api/files                         # Get file tree
```

### WebSocket Events
```
terminal_execute                          # Execute terminal command
ai_message                                # Send message to AI
terminal_output                           # Receive terminal output
ai_response                               # Receive AI response
```

## 🎮 Usage

### Starting the IDE
```bash
# Windows
Launcher.bat

# macOS/Linux
python app.py
```

### Using the AI Assistant
1. Click on the AI Assistant panel (right side)
2. Select a mode: Chat, Explain, Debug, or Refactor
3. Type your question or code snippet
4. Press Enter or click Send

### Managing Extensions
1. Click `Window` → `Extensions` → `Manage Extensions`
2. Enable/disable installed extensions
3. Click `Get Extensions` to install new ones

### Using the Terminal
1. Type commands in the terminal input
2. Press Enter to execute
3. View output in real-time
4. Use multiple terminal tabs for parallel tasks

## 🐛 Troubleshooting

### Python not found
- Install Python from https://www.python.org/
- Check "Add Python to PATH" during installation
- Restart your computer

### Port 5000 already in use
- Close other applications using port 5000
- Or modify the port in `app.py`

### Dependencies installation fails
```bash
pip install --upgrade pip
pip install -r requirements.txt --no-cache-dir
```

### Browser can't connect
- Ensure server is running (check terminal)
- Try `http://127.0.0.1:5000` instead
- Check firewall settings

## 🔐 Security

- CORS enabled for development (restrict in production)
- Input validation on all endpoints
- Secure WebSocket connections
- Environment-based configuration

## 🚀 Deployment

### Production Setup
1. Set `DEBUG = False` in `config.py`
2. Use a production WSGI server (Gunicorn, uWSGI)
3. Set up HTTPS/SSL
4. Configure proper CORS origins
5. Use environment variables for secrets

### Docker Deployment
```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Links

- **GitHub**: https://github.com/dehewgs/AutoPilot-IDE
- **Issues**: https://github.com/dehewgs/AutoPilot-IDE/issues
- **Python**: https://www.python.org/
- **Flask**: https://flask.palletsprojects.com/
- **Hugging Face**: https://huggingface.co/

## 💡 Tips & Tricks

- **Resize Terminal**: Drag the divider between editor and terminal
- **Collapse Terminal**: Click the up arrow in terminal header
- **Switch AI Modes**: Click mode buttons to change AI behavior
- **Multiple Terminals**: Click "+" to add terminal tabs
- **Keyboard Shortcuts**: 
  - `Ctrl+Enter` in AI input to send message
  - `Shift+Enter` in AI input for new line

## 🆘 Support

Need help? Check:
1. [QUICKSTART.md](QUICKSTART.md) for quick setup
2. [SETUP.md](SETUP.md) for detailed instructions
3. [GitHub Issues](https://github.com/dehewgs/AutoPilot-IDE/issues)
4. Terminal output for error messages

## 📊 Project Stats

- **Language**: Python, JavaScript, HTML/CSS
- **Framework**: Flask + SocketIO
- **Lines of Code**: 2000+
- **Features**: 15+
- **Extensions**: 8+

## 🎯 Roadmap

- [ ] Database integration
- [ ] Git integration
- [ ] Collaborative editing
- [ ] Plugin marketplace
- [ ] Mobile app
- [ ] Cloud sync
- [ ] Advanced debugging
- [ ] Performance profiling

## 👨‍💻 Author

**Sack Ba**
- Email: sackba582@gmail.com
- GitHub: [@dehewgs](https://github.com/dehewgs)

## 🙏 Acknowledgments

- Flask and Flask-SocketIO teams
- Hugging Face for AI models
- All contributors and users

---

**Version**: 1.0.0  
**Last Updated**: November 2025  
**Status**: Active Development

**Made with ❤️ by Sack Ba**
