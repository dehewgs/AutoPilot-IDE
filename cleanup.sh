#!/bin/bash

# AutoPilot IDE - Comprehensive Cleanup Script
# This script completes all remaining cleanup tasks
# Run this script from the repository root directory

set -e  # Exit on error

echo "=========================================="
echo "  AutoPilot IDE - Cleanup Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    print_error "Not in a git repository. Please run this script from the repository root."
    exit 1
fi

print_info "Starting cleanup process..."
echo ""

# Step 1: Remove redundant HTML files
echo "Step 1: Removing redundant HTML files..."
REDUNDANT_FILES=(
    "index-old.html"
    "index-old-wrong.html"
    "index-hybrid.html"
    "index-modular.html"
)

for file in "${REDUNDANT_FILES[@]}"; do
    if [ -f "$file" ]; then
        git rm "$file"
        print_success "Removed $file"
    else
        print_info "$file not found (may already be deleted)"
    fi
done

# Commit the deletions
if git diff --cached --quiet; then
    print_info "No redundant files to remove"
else
    git commit -m "chore: remove redundant old HTML files"
    print_success "Committed redundant file removals"
fi

echo ""

# Step 2: Create .env file from template
echo "Step 2: Creating .env file from template..."
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        
        # Generate a secure SECRET_KEY
        SECRET_KEY=$(python3 -c "import os; print(os.urandom(24).hex())" 2>/dev/null || openssl rand -hex 24)
        
        # Update the .env file with the generated key
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s/your-secret-key-here-change-in-production/$SECRET_KEY/" .env
        else
            # Linux
            sed -i "s/your-secret-key-here-change-in-production/$SECRET_KEY/" .env
        fi
        
        print_success "Created .env file with secure SECRET_KEY"
        print_info "Please review and update .env with your specific configuration"
    else
        print_error ".env.example not found"
    fi
else
    print_info ".env file already exists"
fi

echo ""

# Step 3: Create tests directory structure
echo "Step 3: Creating tests directory structure..."
if [ ! -d "tests" ]; then
    mkdir -p tests
    
    # Create __init__.py
    cat > tests/__init__.py << 'EOF'
"""
AutoPilot IDE Test Suite
"""
EOF
    
    # Create conftest.py
    cat > tests/conftest.py << 'EOF'
"""
Pytest configuration and fixtures
"""
import pytest
from app import app as flask_app

@pytest.fixture
def app():
    """Create application for testing"""
    flask_app.config['TESTING'] = True
    flask_app.config['SECRET_KEY'] = 'test-secret-key'
    return flask_app

@pytest.fixture
def client(app):
    """Create test client"""
    return app.test_client()

@pytest.fixture
def runner(app):
    """Create test CLI runner"""
    return app.test_cli_runner()
EOF
    
    # Create test_app.py
    cat > tests/test_app.py << 'EOF'
"""
Tests for main application routes
"""
import pytest

def test_index_route(client):
    """Test that index route returns 200"""
    response = client.get('/')
    assert response.status_code == 200

def test_api_extensions(client):
    """Test extensions API endpoint"""
    response = client.get('/api/extensions')
    assert response.status_code == 200
    data = response.get_json()
    assert 'installed' in data
    assert 'available' in data

def test_api_projects(client):
    """Test projects API endpoint"""
    response = client.get('/api/projects')
    assert response.status_code == 200
    data = response.get_json()
    assert 'projects' in data

def test_api_files(client):
    """Test files API endpoint"""
    response = client.get('/api/files')
    assert response.status_code == 200
    data = response.get_json()
    assert 'files' in data
EOF
    
    # Create test_security.py
    cat > tests/test_security.py << 'EOF'
"""
Security validation tests
"""
import pytest
from app import validate_command

def test_command_whitelist():
    """Test that only whitelisted commands are allowed"""
    # Valid commands
    assert validate_command('ls')[0] == True
    assert validate_command('pwd')[0] == True
    assert validate_command('echo hello')[0] == True
    
    # Invalid commands
    assert validate_command('rm -rf /')[0] == False
    assert validate_command('curl malicious.com')[0] == False
    assert validate_command('')[0] == False

def test_dangerous_characters():
    """Test that dangerous characters are blocked"""
    dangerous_commands = [
        'ls; rm -rf /',
        'ls && rm file',
        'ls | grep test',
        'ls `whoami`',
        'ls $(whoami)',
    ]
    
    for cmd in dangerous_commands:
        is_valid, message = validate_command(cmd)
        assert is_valid == False, f"Command should be blocked: {cmd}"

def test_command_length():
    """Test command length validation"""
    # Very long command should still be validated
    long_cmd = 'echo ' + 'a' * 1000
    is_valid, message = validate_command(long_cmd)
    assert is_valid == True  # echo is whitelisted
EOF
    
    print_success "Created tests directory with test files"
    
    # Add tests to git
    git add tests/
    git commit -m "test: add comprehensive test suite with security tests"
    print_success "Committed test files"
else
    print_info "tests directory already exists"
fi

echo ""

# Step 4: Update .gitignore
echo "Step 4: Updating .gitignore..."
if [ -f ".gitignore" ]; then
    # Check if .env is already in .gitignore
    if ! grep -q "^\.env$" .gitignore; then
        echo "" >> .gitignore
        echo "# Environment variables" >> .gitignore
        echo ".env" >> .gitignore
        echo ".env.local" >> .gitignore
        echo ".env.*.local" >> .gitignore
        print_success "Updated .gitignore with .env entries"
    else
        print_info ".gitignore already contains .env entries"
    fi
    
    # Check if logs are in .gitignore
    if ! grep -q "autopilot-ide.log" .gitignore; then
        echo "" >> .gitignore
        echo "# Application logs" >> .gitignore
        echo "autopilot-ide.log" >> .gitignore
        print_success "Updated .gitignore with log entries"
    else
        print_info ".gitignore already contains log entries"
    fi
else
    print_error ".gitignore not found"
fi

echo ""

# Step 5: Create necessary directories
echo "Step 5: Creating necessary directories..."
DIRECTORIES=("projects" "uploads" "logs")

for dir in "${DIRECTORIES[@]}"; do
    if [ ! -d "$dir" ]; then
        mkdir -p "$dir"
        # Create .gitkeep to track empty directories
        touch "$dir/.gitkeep"
        print_success "Created $dir directory"
    else
        print_info "$dir directory already exists"
    fi
done

# Add .gitkeep files
if [ -f "projects/.gitkeep" ] || [ -f "uploads/.gitkeep" ] || [ -f "logs/.gitkeep" ]; then
    git add projects/.gitkeep uploads/.gitkeep logs/.gitkeep 2>/dev/null || true
    if ! git diff --cached --quiet; then
        git commit -m "chore: add directory structure with .gitkeep files"
        print_success "Committed directory structure"
    fi
fi

echo ""

# Step 6: Install/Update dependencies
echo "Step 6: Checking Python dependencies..."
if command -v python3 &> /dev/null; then
    if [ -f "requirements.txt" ]; then
        print_info "Installing/updating Python dependencies..."
        python3 -m pip install -r requirements.txt --upgrade --quiet
        print_success "Dependencies installed/updated"
    else
        print_error "requirements.txt not found"
    fi
else
    print_error "Python 3 not found. Please install Python 3.8 or higher."
fi

echo ""

# Step 7: Run tests
echo "Step 7: Running tests..."
if command -v pytest &> /dev/null; then
    print_info "Running test suite..."
    if pytest tests/ -v; then
        print_success "All tests passed!"
    else
        print_error "Some tests failed. Please review the output above."
    fi
else
    print_info "pytest not installed. Skipping tests."
    print_info "Install with: pip install pytest pytest-flask"
fi

echo ""

# Step 8: Push changes to remote
echo "Step 8: Pushing changes to remote..."
print_info "Ready to push changes to remote repository"
read -p "Do you want to push changes now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push origin main
    print_success "Changes pushed to remote repository"
else
    print_info "Skipped pushing to remote. Run 'git push origin main' when ready."
fi

echo ""
echo "=========================================="
echo "  Cleanup Complete!"
echo "=========================================="
echo ""
print_success "All cleanup tasks completed successfully!"
echo ""
echo "Next steps:"
echo "  1. Review the .env file and update with your configuration"
echo "  2. Test the application: python app.py"
echo "  3. Run tests: pytest tests/"
echo "  4. Review DEPLOYMENT.md for production deployment"
echo ""
print_info "For more information, see:"
echo "  - FIXES_COMPLETED.md - Complete list of fixes"
echo "  - SECURITY.md - Security best practices"
echo "  - CONTRIBUTING.md - Contribution guidelines"
echo ""
