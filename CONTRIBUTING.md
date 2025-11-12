# Contributing to AutoPilot IDE

Thank you for your interest in contributing to AutoPilot IDE! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/AutoPilot-IDE.git
   cd AutoPilot-IDE
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/dehewgs/AutoPilot-IDE.git
   ```

## Development Setup

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Git

### Installation

1. **Create a virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run the application**:
   ```bash
   python app.py
   ```

## How to Contribute

### Types of Contributions

- **Bug Fixes**: Fix issues reported in GitHub Issues
- **Features**: Implement new features from the roadmap
- **Documentation**: Improve or add documentation
- **Tests**: Add or improve test coverage
- **Code Quality**: Refactor code, improve performance

### Workflow

1. **Create a branch** for your work:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Make your changes** following our coding standards

3. **Test your changes** thoroughly

4. **Commit your changes** with clear commit messages

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

## Coding Standards

### Python Code

- Follow **PEP 8** style guide
- Use **type hints** where appropriate
- Write **docstrings** for all functions and classes
- Keep functions small and focused
- Use meaningful variable names

### JavaScript Code

- Use **ES6+** syntax
- Follow **consistent indentation** (2 spaces)
- Use **camelCase** for variables and functions
- Add **JSDoc comments** for complex functions
- Avoid global variables

### Code Formatting

We use automated formatters:

- **Python**: `black` and `flake8`
  ```bash
  black .
  flake8 .
  ```

- **JavaScript**: Follow existing code style

## Commit Guidelines

We follow the **Conventional Commits** specification:

### Commit Message Format

```
<type>: <description>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes

### Examples

```
feat: add file search functionality

fix: resolve command injection vulnerability in terminal

docs: update installation instructions in README

test: add unit tests for extension manager
```

## Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new features
3. **Ensure all tests pass**:
   ```bash
   pytest
   ```
4. **Update CHANGELOG.md** with your changes
5. **Fill out the PR template** completely
6. **Request review** from maintainers
7. **Address review feedback** promptly

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] No new warnings
- [ ] CHANGELOG.md updated

## Testing

### Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=. --cov-report=html

# Run specific test file
pytest tests/test_app.py
```

### Writing Tests

- Place tests in the `tests/` directory
- Name test files `test_*.py`
- Use descriptive test names
- Test edge cases and error conditions
- Aim for high code coverage

### Test Structure

```python
def test_feature_name():
    """Test description"""
    # Arrange
    setup_data = create_test_data()
    
    # Act
    result = function_to_test(setup_data)
    
    # Assert
    assert result == expected_value
```

## Reporting Bugs

### Before Submitting

1. **Check existing issues** to avoid duplicates
2. **Test with the latest version**
3. **Gather relevant information**

### Bug Report Template

```markdown
**Description**
Clear description of the bug

**Steps to Reproduce**
1. Step one
2. Step two
3. Step three

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: [e.g., Windows 10, macOS 12, Ubuntu 22.04]
- Python Version: [e.g., 3.9.7]
- Browser: [e.g., Chrome 96, Firefox 95]

**Screenshots**
If applicable

**Additional Context**
Any other relevant information
```

## Feature Requests

We welcome feature requests! Please:

1. **Check the roadmap** to see if it's already planned
2. **Search existing issues** for similar requests
3. **Provide detailed description** of the feature
4. **Explain the use case** and benefits
5. **Consider implementation** if possible

### Feature Request Template

```markdown
**Feature Description**
Clear description of the feature

**Problem It Solves**
What problem does this address?

**Proposed Solution**
How should it work?

**Alternatives Considered**
Other approaches you've thought about

**Additional Context**
Mockups, examples, etc.
```

## Questions?

If you have questions:

- Check the [README.md](README.md)
- Review existing [Issues](https://github.com/dehewgs/AutoPilot-IDE/issues)
- Create a new issue with the `question` label

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to AutoPilot IDE! 🚀
