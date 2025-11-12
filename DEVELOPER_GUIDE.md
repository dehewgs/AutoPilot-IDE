# AutoPilot IDE - Developer Quick Reference Guide

## 🚀 Quick Start

### Project Structure
```
AutoPilot-IDE-Repo/
├── index.html              # Main HTML file (refactored)
├── index-old.html          # Backup of original monolithic version
├── app.py                  # Flask backend
├── js/                     # All JavaScript modules
│   ├── utils.js
│   ├── api-module.js
│   ├── socket-module.js
│   ├── ui-module.js
│   ├── terminal-module.js
│   ├── ai-module.js
│   ├── editor-module.js
│   ├── explorer-module.js
│   ├── extension-module.js
│   ├── event-handlers.js
│   ├── tests.js
│   └── app.js
├── REFACTORING_SUMMARY.md  # Complete refactoring documentation
└── DEVELOPER_GUIDE.md      # This file
```

---

## 📚 Module Quick Reference

### Utils Module
```javascript
// Debounce function calls
const debouncedFn = Utils.debounce(() => console.log('done'), 300);

// Throttle function calls
const throttledFn = Utils.throttle(() => console.log('throttled'), 1000);

// Format text
const formatted = Utils.formatText('  hello  '); // 'hello'

// Escape HTML
const safe = Utils.escapeHtml('<script>alert("xss")</script>');

// Generate unique ID
const id = Utils.generateId(); // '1731385200000-a1b2c3d4e'

// Sleep/delay
await Utils.sleep(1000); // Wait 1 second

// Deep clone object
const copy = Utils.clone({ a: { b: 1 } });
```

### API Module
```javascript
// GET request
const data = await APIModule.get('/api/files');

// POST request
const result = await APIModule.post('/api/extensions/install', {
    extensionId: 'my-extension'
});

// PUT request
const updated = await APIModule.put('/api/settings', {
    theme: 'dark'
});

// DELETE request
await APIModule.delete('/api/extensions/my-extension');
```

### Socket Module
```javascript
// Initialize connection
await SocketModule.init();

// Emit event to server
SocketModule.emit('command', { cmd: 'python app.py' });

// Listen to events
SocketModule.on('output', (data) => {
    console.log('Server output:', data);
});

// Remove listener
SocketModule.off('output', handler);

// Check connection status
if (SocketModule.isConnected()) {
    console.log('Connected to server');
}

// Disconnect
SocketModule.disconnect();
```

### UI Module
```javascript
// Show modal
UIModule.showModal('manageExtensionsModal');

// Hide modal
UIModule.hideModal('manageExtensionsModal');

// Show notification
UIModule.showNotification('Operation successful!', 'success');
UIModule.showNotification('An error occurred', 'error');
UIModule.showNotification('Warning message', 'warning');
UIModule.showNotification('Info message', 'info');

// Update status bar
UIModule.updateStatus('Ready');

// Toggle dropdown menu
UIModule.toggleDropdown('fileMenu', event);

// Close all dropdowns
UIModule.closeAllDropdowns();
```

### Terminal Module
```javascript
// Initialize terminal
await TerminalModule.init();

// Add output line
TerminalModule.addOutput('Hello World', 'output');
TerminalModule.addOutput('Error occurred', 'error');
TerminalModule.addOutput('$ python app.py', 'command');
TerminalModule.addOutput('Success!', 'success');

// Clear terminal
TerminalModule.clear();

// Toggle terminal visibility
TerminalModule.toggle();

// Handle user input
TerminalModule.handleInput('python app.py');
```

### AI Module
```javascript
// Initialize AI
await AIModule.init();

// Send message to AI
await AIModule.send('Optimize this function');

// Add message to chat
AIModule.addMessage('Hello AI', 'user');
AIModule.addMessage('Hello! How can I help?', 'ai');

// Change AI mode
AIModule.setMode('debug');

// Get current mode
const mode = AIModule.getMode(); // 'debug'

// Clear chat history
AIModule.clear();
```

### Editor Module
```javascript
// Open file
EditorModule.openFile('main.py');

// Close file
EditorModule.closeFile('main.py');

// Save file
EditorModule.saveFile('main.py', 'print("hello")');

// Get file content
const content = EditorModule.getContent('main.py');

// Access current file
const current = EditorModule.currentFile;

// Access all files
const files = EditorModule.files;
```

### Explorer Module
```javascript
// Load files from server
await ExplorerModule.loadFiles();

// Expand folder
ExplorerModule.expandFolder('src');

// Select file
ExplorerModule.selectFile('main.py');

// Render file tree
ExplorerModule.render();

// Access file list
const files = ExplorerModule.files;
```

### Extension Module
```javascript
// Install extension
await ExtensionModule.install('database-explorer');

// Uninstall extension
await ExtensionModule.uninstall('database-explorer');

// Toggle extension
await ExtensionModule.toggle('database-explorer');

// Render installed extensions
ExtensionModule.renderInstalled();

// Render available extensions
ExtensionModule.renderAvailable();

// Open manage modal
ExtensionModule.openManage();

// Open get extensions modal
ExtensionModule.openGet();
```

### Event Handlers
```javascript
// Initialize all event handlers
EventHandlers.init();

// Register custom handler
EventHandlers.registerHandler('myHandler', () => {
    console.log('Custom handler called');
});

// Get handler
const handler = EventHandlers.getHandler('myHandler');

// Access all handlers
const handlers = EventHandlers.handlers;
```

---

## 🧪 Testing

### Running Tests
Tests automatically run in development mode (localhost). Check browser console for results.

### Writing Tests
```javascript
// Add to tests.js

// Simple assertion
testSuite.test('My test', () => {
    testSuite.assert(true, 'This should be true');
});

// Equality check
testSuite.test('Equality test', () => {
    testSuite.assertEqual(2 + 2, 4, 'Math should work');
});

// Element existence
testSuite.test('DOM test', () => {
    testSuite.assertExists(
        document.getElementById('terminalContent'),
        'Terminal should exist'
    );
});

// Type checking
testSuite.test('Type test', () => {
    testSuite.assertType('hello', 'string', 'Should be string');
});

// Async test
testSuite.test('Async test', async () => {
    const data = await APIModule.get('/test');
    testSuite.assert(data !== null, 'Should have data');
});
```

---

## 🔧 Common Tasks

### Add a New Button
1. Add HTML button to `index.html`
2. Add onclick handler: `onclick="MyModule.myFunction()"`
3. Implement function in relevant module
4. Add test to `tests.js`

Example:
```html
<!-- In index.html -->
<button onclick="TerminalModule.clear()">Clear Terminal</button>
```

### Add a New Modal
1. Add modal HTML to `index.html`
2. Use UIModule to show/hide:
```javascript
UIModule.showModal('myModalId');
UIModule.hideModal('myModalId');
```

### Add a New API Endpoint
1. Implement endpoint in `app.py`
2. Call from module:
```javascript
const data = await APIModule.get('/api/my-endpoint');
```

### Add a New Module
1. Create `js/my-module.js` with IIFE pattern
2. Export public API
3. Add `init()` method
4. Register in `app.js`
5. Add tests to `tests.js`

Template:
```javascript
const MyModule = (() => {
    const init = () => {
        console.log('[MyModule] Initializing...');
    };

    const myFunction = () => {
        console.log('[MyModule] Function called');
    };

    return {
        init,
        myFunction
    };
})();
```

---

## 🐛 Debugging

### Console Logging
Each module prefixes logs with its name:
```
[APIModule] GET /api/files
[SocketModule] Connected to server
[UIModule] Showing modal: manageExtensionsModal
[TerminalModule] Added output: Hello World
```

### Check Module Status
```javascript
// In browser console
console.log(app.modules); // List all modules
console.log(app.isInitialized()); // Check if initialized
console.log(SocketModule.isConnected()); // Check socket connection
```

### Test Individual Module
```javascript
// In browser console
await APIModule.get('/api/test');
TerminalModule.addOutput('Test output', 'output');
UIModule.showNotification('Test notification', 'info');
```

---

## 📋 Best Practices

### Module Development
- ✅ Use IIFE pattern for encapsulation
- ✅ Prefix console logs with module name
- ✅ Handle errors gracefully
- ✅ Show user notifications on errors
- ✅ Add tests for new functions
- ✅ Document public API

### Error Handling
```javascript
try {
    await someAsyncFunction();
} catch (error) {
    console.error('[MyModule] Error:', error);
    UIModule.showNotification('Operation failed', 'error');
}
```

### Async Operations
```javascript
// Always use async/await
const result = await APIModule.get('/endpoint');

// Or use .then() for compatibility
APIModule.get('/endpoint').then(data => {
    console.log(data);
}).catch(error => {
    console.error(error);
});
```

### DOM Manipulation
```javascript
// Use standard DOM methods
const element = document.getElementById('myElement');
element.textContent = 'New text';
element.classList.add('active');

// Or use UIModule for common operations
UIModule.showModal('myModal');
```

---

## 🚨 Common Issues & Solutions

### Issue: Button not working
**Solution**: 
1. Check HTML has correct onclick handler
2. Check module is initialized
3. Check browser console for errors
4. Verify module method exists

### Issue: Modal not showing
**Solution**:
1. Check modal ID matches in HTML and JavaScript
2. Use `UIModule.showModal('id')`
3. Check CSS for display: none

### Issue: API request failing
**Solution**:
1. Check backend is running
2. Check endpoint URL is correct
3. Check request data format
4. Check browser console for error details

### Issue: Socket not connecting
**Solution**:
1. Check backend is running
2. Check socket.io is loaded
3. Check browser console for connection errors
4. Verify SocketModule.init() was called

---

## 📞 Getting Help

### Check Documentation
- `REFACTORING_SUMMARY.md` - Complete architecture overview
- `DEVELOPER_GUIDE.md` - This file
- Module comments - Inline documentation

### Debug Steps
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Look for module initialization logs
4. Check Network tab for API calls
5. Use debugger to step through code

### Test Your Changes
1. Add test to `tests.js`
2. Run tests in browser console
3. Check test results
4. Fix any failures

---

## 🎯 Development Workflow

### Making Changes
1. Identify relevant module
2. Update module code
3. Add/update tests
4. Test in browser
5. Check console for errors
6. Commit changes

### Adding Features
1. Create new module or update existing
2. Implement functionality
3. Add event handlers if needed
4. Update HTML if needed
5. Add comprehensive tests
6. Document in comments

### Debugging Workflow
1. Reproduce issue
2. Check browser console
3. Add console.log statements
4. Use debugger to step through
5. Check module initialization
6. Verify API responses
7. Fix issue
8. Add test to prevent regression

---

## 📚 Resources

### JavaScript Patterns
- Module Pattern (IIFE)
- Singleton Pattern
- Observer Pattern
- Revealing Module Pattern

### Testing
- Unit tests for functions
- Integration tests for modules
- DOM tests for elements
- Error handling tests

### Performance
- Debounce/throttle for events
- Lazy loading for modules
- Error recovery strategies
- Memory management

---

**Last Updated**: November 12, 2025
**Version**: 1.0
**Status**: ✅ Complete
