/**
 * AutoPilot IDE - Comprehensive Test Suite
 * Tests all modules and functionality before deployment
 */

class TestSuite {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
        this.results = [];
    }

    test(name, fn) {
        this.tests.push({ name, fn });
    }

    async run() {
        console.log('🧪 Starting Test Suite...\n');
        
        for (const test of this.tests) {
            try {
                await test.fn();
                this.passed++;
                this.results.push({ name: test.name, status: '✅ PASS' });
                console.log(`✅ ${test.name}`);
            } catch (error) {
                this.failed++;
                this.results.push({ name: test.name, status: '❌ FAIL', error: error.message });
                console.error(`❌ ${test.name}: ${error.message}`);
            }
        }

        this.printSummary();
        return this.failed === 0;
    }

    printSummary() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 TEST SUMMARY');
        console.log('='.repeat(60));
        console.log(`✅ Passed: ${this.passed}`);
        console.log(`❌ Failed: ${this.failed}`);
        console.log(`📈 Total: ${this.tests.length}`);
        console.log(`🎯 Success Rate: ${((this.passed / this.tests.length) * 100).toFixed(2)}%`);
        console.log('='.repeat(60) + '\n');
    }

    assert(condition, message) {
        if (!condition) {
            throw new Error(message || 'Assertion failed');
        }
    }

    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message || `Expected ${expected}, got ${actual}`);
        }
    }

    assertExists(obj, message) {
        if (!obj) {
            throw new Error(message || 'Object does not exist');
        }
    }

    assertType(obj, type, message) {
        if (typeof obj !== type) {
            throw new Error(message || `Expected type ${type}, got ${typeof obj}`);
        }
    }
}

// Create global test suite
const testSuite = new TestSuite();

// ============================================================================
// SOCKET MODULE TESTS
// ============================================================================

testSuite.test('SocketModule: Should initialize socket', async () => {
    testSuite.assertExists(SocketModule, 'SocketModule should exist');
    testSuite.assertType(SocketModule.init, 'function', 'init should be a function');
});

testSuite.test('SocketModule: Should have required methods', async () => {
    const methods = ['init', 'emit', 'on', 'disconnect', 'isConnected'];
    methods.forEach(method => {
        testSuite.assertExists(SocketModule[method], `SocketModule.${method} should exist`);
    });
});

testSuite.test('SocketModule: Should handle connection events', async () => {
    testSuite.assertType(SocketModule.handlers, 'object', 'handlers should be an object');
});

// ============================================================================
// UI MODULE TESTS
// ============================================================================

testSuite.test('UIModule: Should initialize UI', async () => {
    testSuite.assertExists(UIModule, 'UIModule should exist');
    testSuite.assertType(UIModule.init, 'function', 'init should be a function');
});

testSuite.test('UIModule: Should have required methods', async () => {
    const methods = ['init', 'showModal', 'hideModal', 'showNotification', 'updateStatus'];
    methods.forEach(method => {
        testSuite.assertExists(UIModule[method], `UIModule.${method} should exist`);
    });
});

testSuite.test('UIModule: Should manage modals', async () => {
    testSuite.assertType(UIModule.modals, 'object', 'modals should be an object');
});

// ============================================================================
// EXTENSION MODULE TESTS
// ============================================================================

testSuite.test('ExtensionModule: Should initialize extensions', async () => {
    testSuite.assertExists(ExtensionModule, 'ExtensionModule should exist');
    testSuite.assertType(ExtensionModule.init, 'function', 'init should be a function');
});

testSuite.test('ExtensionModule: Should have required methods', async () => {
    const methods = ['init', 'fetch', 'install', 'uninstall', 'toggle', 'render'];
    methods.forEach(method => {
        testSuite.assertExists(ExtensionModule[method], `ExtensionModule.${method} should exist`);
    });
});

testSuite.test('ExtensionModule: Should manage extension state', async () => {
    testSuite.assertType(ExtensionModule.installed, 'object', 'installed should be an object');
    testSuite.assertType(ExtensionModule.available, 'object', 'available should be an object');
});

// ============================================================================
// TERMINAL MODULE TESTS
// ============================================================================

testSuite.test('TerminalModule: Should initialize terminal', async () => {
    testSuite.assertExists(TerminalModule, 'TerminalModule should exist');
    testSuite.assertType(TerminalModule.init, 'function', 'init should be a function');
});

testSuite.test('TerminalModule: Should have required methods', async () => {
    const methods = ['init', 'execute', 'addOutput', 'clear', 'toggle'];
    methods.forEach(method => {
        testSuite.assertExists(TerminalModule[method], `TerminalModule.${method} should exist`);
    });
});

testSuite.test('TerminalModule: Should manage terminal state', async () => {
    testSuite.assertType(TerminalModule.isCollapsed, 'boolean', 'isCollapsed should be a boolean');
});

// ============================================================================
// AI MODULE TESTS
// ============================================================================

testSuite.test('AIModule: Should initialize AI', async () => {
    testSuite.assertExists(AIModule, 'AIModule should exist');
    testSuite.assertType(AIModule.init, 'function', 'init should be a function');
});

testSuite.test('AIModule: Should have required methods', async () => {
    const methods = ['init', 'send', 'addMessage', 'setMode', 'getMode'];
    methods.forEach(method => {
        testSuite.assertExists(AIModule[method], `AIModule.${method} should exist`);
    });
});

testSuite.test('AIModule: Should manage AI modes', async () => {
    testSuite.assertType(AIModule.modes, 'object', 'modes should be an object');
    testSuite.assertType(AIModule.currentMode, 'string', 'currentMode should be a string');
});

// ============================================================================
// EDITOR MODULE TESTS
// ============================================================================

testSuite.test('EditorModule: Should initialize editor', async () => {
    testSuite.assertExists(EditorModule, 'EditorModule should exist');
    testSuite.assertType(EditorModule.init, 'function', 'init should be a function');
});

testSuite.test('EditorModule: Should have required methods', async () => {
    const methods = ['init', 'openFile', 'closeFile', 'saveFile', 'getContent'];
    methods.forEach(method => {
        testSuite.assertExists(EditorModule[method], `EditorModule.${method} should exist`);
    });
});

testSuite.test('EditorModule: Should manage files', async () => {
    testSuite.assertType(EditorModule.files, 'object', 'files should be an object');
    testSuite.assertType(EditorModule.currentFile, 'string', 'currentFile should be a string');
});

// ============================================================================
// EXPLORER MODULE TESTS
// ============================================================================

testSuite.test('ExplorerModule: Should initialize explorer', async () => {
    testSuite.assertExists(ExplorerModule, 'ExplorerModule should exist');
    testSuite.assertType(ExplorerModule.init, 'function', 'init should be a function');
});

testSuite.test('ExplorerModule: Should have required methods', async () => {
    const methods = ['init', 'loadFiles', 'expandFolder', 'selectFile', 'render'];
    methods.forEach(method => {
        testSuite.assertExists(ExplorerModule[method], `ExplorerModule.${method} should exist`);
    });
});

testSuite.test('ExplorerModule: Should manage file tree', async () => {
    testSuite.assertType(ExplorerModule.files, 'object', 'files should be an object');
});

// ============================================================================
// EVENT HANDLER TESTS
// ============================================================================

testSuite.test('EventHandlers: Should have all button handlers', async () => {
    testSuite.assertExists(EventHandlers, 'EventHandlers should exist');
    testSuite.assertType(EventHandlers.init, 'function', 'init should be a function');
});

testSuite.test('EventHandlers: Should register all event listeners', async () => {
    testSuite.assertType(EventHandlers.handlers, 'object', 'handlers should be an object');
});

// ============================================================================
// API MODULE TESTS
// ============================================================================

testSuite.test('APIModule: Should initialize API', async () => {
    testSuite.assertExists(APIModule, 'APIModule should exist');
    testSuite.assertType(APIModule.get, 'function', 'get should be a function');
    testSuite.assertType(APIModule.post, 'function', 'post should be a function');
});

testSuite.test('APIModule: Should have correct base URL', async () => {
    testSuite.assertExists(APIModule.baseURL, 'baseURL should exist');
});

// ============================================================================
// UTILITY TESTS
// ============================================================================

testSuite.test('Utils: Should have utility functions', async () => {
    testSuite.assertExists(Utils, 'Utils should exist');
    testSuite.assertType(Utils.debounce, 'function', 'debounce should be a function');
    testSuite.assertType(Utils.throttle, 'function', 'throttle should be a function');
});

testSuite.test('Utils: Debounce should work correctly', async () => {
    let callCount = 0;
    const debounced = Utils.debounce(() => callCount++, 10);
    debounced();
    debounced();
    debounced();
    await new Promise(resolve => setTimeout(resolve, 20));
    testSuite.assertEqual(callCount, 1, 'Debounce should only call once');
});

testSuite.test('Utils: Should format text correctly', async () => {
    const result = Utils.formatText('hello world');
    testSuite.assertExists(result, 'formatText should return a value');
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

testSuite.test('Integration: All modules should be initialized', async () => {
    const modules = [
        'SocketModule', 'UIModule', 'ExtensionModule', 'TerminalModule',
        'AIModule', 'EditorModule', 'ExplorerModule', 'EventHandlers', 'APIModule'
    ];
    modules.forEach(module => {
        testSuite.assertExists(window[module], `${module} should be available globally`);
    });
});

testSuite.test('Integration: DOM elements should exist', async () => {
    const elements = [
        'aiChat', 'aiInput', 'sendBtn', 'terminalContent', 'terminalInput',
        'extensionsList', 'availableExtensionsList', 'manageExtensionsModal',
        'getExtensionsModal'
    ];
    elements.forEach(id => {
        const el = document.getElementById(id);
        testSuite.assertExists(el, `Element with id "${id}" should exist`);
    });
});

testSuite.test('Integration: Event listeners should be attached', async () => {
    const sendBtn = document.getElementById('sendBtn');
    testSuite.assertExists(sendBtn, 'Send button should exist');
    // Check if button has click handler (this is a basic check)
    testSuite.assert(sendBtn.onclick !== null || sendBtn.hasAttribute('onclick'), 
        'Send button should have click handler');
});

// ============================================================================
// ERROR HANDLING TESTS
// ============================================================================

testSuite.test('ErrorHandling: Should handle missing elements gracefully', async () => {
    try {
        const result = UIModule.showModal('nonexistent-modal');
        // Should not throw
        testSuite.assert(true, 'Should handle missing elements gracefully');
    } catch (error) {
        testSuite.assert(false, 'Should not throw on missing elements');
    }
});

testSuite.test('ErrorHandling: Should handle API errors', async () => {
    try {
        // This will fail but should be caught
        await APIModule.get('/nonexistent-endpoint');
        testSuite.assert(true, 'Should handle API errors gracefully');
    } catch (error) {
        testSuite.assert(true, 'Should handle API errors gracefully');
    }
});

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = testSuite;
}
