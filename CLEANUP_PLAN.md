# Repository Cleanup Plan

## Files to Delete (7 files, ~170KB)

### Old HTML Files (4 files)
These are outdated versions that have been replaced by the current `index.html`:

1. **index-hybrid.html** (21KB)
   - Old hybrid version with mixed inline/modular JavaScript
   - Replaced by: current `index.html`
   - Status: ❌ DELETE

2. **index-modular.html** (21KB)
   - Old modular version with incomplete module system
   - Replaced by: current `index.html`
   - Status: ❌ DELETE

3. **index-old-wrong.html** (21KB)
   - Duplicate of index-hybrid.html
   - Replaced by: current `index.html`
   - Status: ❌ DELETE

4. **index-old.html** (73KB)
   - Very old monolithic version with all code inline
   - Completely outdated and non-functional
   - Replaced by: current `index.html`
   - Status: ❌ DELETE

### Outdated Documentation (3 files)

5. **CODEBASE_ANALYSIS.md** (11KB)
   - Analysis from early development phase
   - Information is outdated and no longer accurate
   - Status: ❌ DELETE

6. **CURRENT_STATUS.md** (10KB)
   - Status document from early development
   - Information is outdated and no longer accurate
   - Status: ❌ DELETE

7. **PROJECT_SUMMARY.txt** (13KB)
   - Summary from early development
   - Information is outdated and no longer accurate
   - Status: ❌ DELETE

## Files to Keep

### Active HTML
- ✅ **index.html** - Current working version with modular JavaScript

### Active Documentation
- ✅ **README.md** - Main project documentation
- ✅ **FEATURE_ROADMAP.md** - Future development plans

### Backend Files
- ✅ **app.py** - Flask backend server
- ✅ **config.py** - Backend configuration
- ✅ **requirements.txt** - Python dependencies

### Utility Scripts
- ✅ **Launcher.bat** - Windows launcher
- ✅ **Cleanup.bat** - Cleanup utility

### Configuration
- ✅ **.gitignore** - Git ignore rules

### JavaScript Modules (All Active)
- ✅ **js/app.js** - Main application
- ✅ **js/project-manager.js** - Project management
- ✅ **js/event-handlers.js** - Event handling
- ✅ **js/ui-module.js** - UI utilities
- ✅ **js/ai-module.js** - AI functionality
- ✅ **js/api-module.js** - API calls
- ✅ **js/socket-module.js** - WebSocket communication
- ✅ **js/terminal-module.js** - Terminal functionality
- ✅ **js/editor-module.js** - Editor functionality
- ✅ **js/explorer-module.js** - File explorer
- ✅ **js/extension-module.js** - Extension system
- ✅ **js/utils.js** - Utility functions
- ✅ **js/tests.js** - Test suite

### Stylesheets
- ✅ **css/styles.css** - Main stylesheet

## Deletion Commands

To delete these files from the repository, run:

```bash
# Navigate to repository
cd AutoPilot-IDE

# Switch to test branch
git checkout test

# Delete old HTML files
git rm index-hybrid.html
git rm index-modular.html
git rm index-old-wrong.html
git rm index-old.html

# Delete outdated documentation
git rm CODEBASE_ANALYSIS.md
git rm CURRENT_STATUS.md
git rm PROJECT_SUMMARY.txt

# Commit the cleanup
git commit -m "chore: remove old/unused files (7 files, ~170KB)"

# Push to remote
git push origin test
```

## Summary

**Total Cleanup:**
- 7 files removed
- ~170KB of old code eliminated
- Repository now contains only active, functional files
- All outdated documentation removed

**Result:**
- Cleaner repository structure
- Easier navigation
- No confusion about which files are current
- Reduced repository size
