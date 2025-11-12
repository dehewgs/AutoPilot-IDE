# Changelog

All notable changes to AutoPilot IDE will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive security fixes for command injection vulnerabilities
- Environment variable support for configuration
- Proper CORS configuration with allowed origins
- Input validation and sanitization for all user inputs
- Logging system with file and console output
- Command whitelist for terminal execution
- .env.example template for environment configuration
- MIT License file
- CONTRIBUTING.md with comprehensive contribution guidelines
- CHANGELOG.md for tracking version history
- Enhanced requirements.txt with dev dependencies and production server
- Automatic directory creation for projects and uploads
- Security validation for file paths (prevent directory traversal)

### Changed
- Refactored app.py with security best practices
- Updated config.py to use environment variables
- Improved error handling and logging throughout application
- Changed terminal command execution from shell=True to shell=False
- Updated CORS from wildcard (*) to configurable allowed origins
- Enhanced WebSocket event handlers with input validation
- Improved extension management with better error handling

### Fixed
- **CRITICAL**: Command injection vulnerability in terminal execution
- **CRITICAL**: Hardcoded secret key exposure
- **HIGH**: Open CORS policy security risk
- **HIGH**: Missing input validation on API endpoints
- Unsafe Werkzeug flag in production
- Missing error logging to files
- Hardcoded host and port values
- Missing directory creation for projects and uploads

### Security
- Implemented command whitelist for terminal
- Added shlex.split() for safe command parsing
- Removed shell=True from subprocess calls
- Added dangerous character filtering
- Implemented proper CORS configuration
- Added SECRET_KEY validation for production
- Added file path validation to prevent directory traversal
- Added message length limits for AI assistant

### Removed
- Hardcoded secret key 'dev-secret-key-change-in-production'
- allow_unsafe_werkzeug=True flag
- Wildcard CORS origins

## [1.0.0] - 2025-11-12

### Initial Release
- Flask-based backend with SocketIO support
- Modern web-based IDE interface
- File explorer with tree view
- Code editor with syntax highlighting
- Integrated terminal
- AI assistant with multiple modes (Chat, Explain, Debug, Refactor)
- Extension system with install/uninstall capabilities
- Project management
- Dark theme UI
- Real-time WebSocket communication
- RESTful API endpoints

---

## Version History

### [Unreleased] - Current Development
- Security hardening and comprehensive fixes
- Documentation improvements
- Development workflow enhancements

### [1.0.0] - 2025-11-12
- Initial public release
- Core IDE functionality
- Basic security implementation

---

## Migration Guide

### Upgrading to Latest Version

If you're upgrading from an earlier version, follow these steps:

1. **Backup your data**:
   ```bash
   cp -r projects projects_backup
   cp extensions.json extensions_backup.json
   ```

2. **Update dependencies**:
   ```bash
   pip install -r requirements.txt --upgrade
   ```

3. **Create .env file**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set SECRET_KEY** (REQUIRED for production):
   ```bash
   # Generate a secure secret key
   python -c "import os; print(os.urandom(24).hex())"
   # Add to .env file
   ```

5. **Update CORS origins** in .env:
   ```
   CORS_ORIGINS=http://localhost:5000,https://yourdomain.com
   ```

6. **Test the application**:
   ```bash
   python app.py
   ```

### Breaking Changes

#### Command Execution
- Terminal now uses command whitelist
- Only allowed commands can be executed
- Shell operators (|, &, ;, etc.) are blocked
- Update any automation scripts accordingly

#### Configuration
- SECRET_KEY must be set via environment variable in production
- CORS_ORIGINS must be explicitly configured
- HOST and PORT now configurable via environment variables

#### API Changes
- All API endpoints now return proper error responses
- WebSocket events include better error messages
- File operations validate paths for security

---

## Support

For issues, questions, or contributions:
- GitHub Issues: https://github.com/dehewgs/AutoPilot-IDE/issues
- Contributing Guide: [CONTRIBUTING.md](CONTRIBUTING.md)
- Documentation: [README.md](README.md)

---

**Note**: This changelog follows [Keep a Changelog](https://keepachangelog.com/) format.
