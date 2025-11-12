# 🚀 AutoPilot IDE - Quick Start Guide

## ⚡ 30-Second Setup (Windows)

1. **Download** the project from GitHub
2. **Extract** the ZIP file
3. **Double-click** `Launcher.bat`
4. **Wait** for dependencies to install (~2-3 minutes first time)
5. **Open browser** to `http://localhost:5000`

That's it! 🎉

---

## 📋 System Requirements

- ✅ Windows 7 or later
- ✅ Python 3.8+ (download from https://www.python.org/)
- ✅ 2GB RAM minimum
- ✅ 500MB disk space

---

## 🔧 Installation Methods

### Method 1: Automatic (Recommended)
```bash
Double-click Launcher.bat
```
The launcher will:
- Check for Python installation
- Create a virtual environment
- Install all dependencies
- Start the server automatically

### Method 2: Manual Setup
```bash
# Open Command Prompt in project folder

# Create virtual environment
python -m venv venv

# Activate it
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the app
python app.py
```

### Method 3: Using PowerShell
```powershell
# Open PowerShell as Administrator in project folder

# Create virtual environment
python -m venv venv

# Activate it
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Run the app
python app.py
```

---

## 🌐 Accessing the IDE

Once the server is running, open your browser and go to:

```
http://localhost:5000
```

You should see the AutoPilot IDE interface with:
- 📁 File Explorer (left sidebar)
- 💻 Code Editor (center)
- 🖥️ Terminal (bottom)
- 🤖 AI Assistant (right sidebar)

---

## ✨ Features Overview

### 📁 File Explorer
- Browse project files
- Quick navigation
- File management

### 💻 Code Editor
- Syntax highlighting
- Line numbers
- Multiple tabs
- Real-time editing

### 🖥️ Terminal
- Execute commands
- Real-time output
- Multiple terminal tabs
- Resizable panel

### 🤖 AI Assistant
- **Chat Mode**: Ask questions about code
- **Explain Mode**: Get code explanations
- **Debug Mode**: Find and fix bugs
- **Refactor Mode**: Improve code quality

### 🔌 Extensions
- Manage installed extensions
- Install new extensions
- Enable/disable features

---

## 🐛 Troubleshooting

### ❌ "Python not found"
**Solution:**
1. Install Python from https://www.python.org/
2. During installation, **CHECK** "Add Python to PATH"
3. Restart your computer
4. Try again

### ❌ "Port 5000 already in use"
**Solution:**
1. Close other applications using port 5000
2. Or modify `app.py` line with `socketio.run()` to use different port

### ❌ "Dependencies installation fails"
**Solution:**
```bash
pip install --upgrade pip
pip install -r requirements.txt --no-cache-dir
```

### ❌ "Browser can't connect"
**Solution:**
1. Check Command Prompt - server should show "Running on http://localhost:5000"
2. Try refreshing browser (Ctrl+R)
3. Check Windows Firewall settings
4. Try `http://127.0.0.1:5000` instead

### ❌ "Launcher.bat doesn't work"
**Solution:**
1. Right-click `Launcher.bat` → Properties
2. Check "Unblock" checkbox
3. Click Apply → OK
4. Try again

---

## 📁 Project Structure

```
AutoPilot-IDE/
├── Launcher.bat          ← Double-click to start
├── index.html            ← Frontend UI
├── app.py                ← Backend server
├── config.py             ← Configuration
├── requirements.txt      ← Dependencies
├── SETUP.md              ← Detailed setup guide
├── QUICKSTART.md         ← This file
├── README.md             ← Project info
└── extensions.json       ← Extensions data (auto-created)
```

---

## 🎮 First Steps

1. **Start the server** using Launcher.bat
2. **Open the IDE** at http://localhost:5000
3. **Explore the interface**:
   - Click files in the explorer
   - Try the terminal (type `python --version`)
   - Ask the AI assistant a question
4. **Manage extensions** via the Extensions menu

---

## 🔗 Useful Links

- **GitHub Repository**: https://github.com/dehewgs/AutoPilot-IDE
- **Report Issues**: https://github.com/dehewgs/AutoPilot-IDE/issues
- **Python Download**: https://www.python.org/downloads/
- **Flask Documentation**: https://flask.palletsprojects.com/

---

## 💡 Tips & Tricks

- **Resize Terminal**: Drag the divider between editor and terminal
- **Collapse Terminal**: Click the up arrow in terminal header
- **AI Modes**: Switch between Chat, Explain, Debug, Refactor modes
- **Multiple Terminals**: Click the "+" button to add terminal tabs
- **Extensions**: Manage extensions via Window → Extensions menu

---

## 🆘 Need Help?

1. Check the **SETUP.md** file for detailed instructions
2. Visit the **GitHub Issues** page
3. Check the **Terminal** for error messages
4. Try restarting the server

---

## 📝 Version Info

- **Version**: 1.0.0
- **Last Updated**: November 2025
- **Python**: 3.8+
- **Framework**: Flask + SocketIO

---

**Happy Coding! 🚀**

For more information, see SETUP.md or visit the GitHub repository.
