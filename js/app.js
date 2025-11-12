/**
 * AutoPilot IDE - Main Application Initialization
 * Fixed: All initialization bugs, status updates, and UI synchronization
 */

class App {
    constructor() {
        this.initialized = false;
        this.modules = [];
    }

    async init() {
        console.log('🚀 AutoPilot IDE - Initializing Application...\n');
        
        try {
            // Update initial status
            this.updateStatus('Initializing...', 'info');
            
            // Initialize modules in correct order
            this.modules = [
                { name: 'APIModule', module: APIModule },
                { name: 'SocketModule', module: SocketModule },
                { name: 'UIModule', module: UIModule },
                { name: 'TerminalModule', module: TerminalModule },
                { name: 'AIModule', module: AIModule },
                { name: 'EditorModule', module: EditorModule },
                { name: 'ExplorerModule', module: ExplorerModule },
                { name: 'ExtensionModule', module: ExtensionModule },
                { name: 'EventHandlers', module: EventHandlers }
            ];

            // Initialize each module
            for (const { name, module } of this.modules) {
                if (module && module.init) {
                    console.log(`[App] Initializing ${name}...`);
                    await module.init();
                } else {
                    console.warn(`[App] Module ${name} has no init method`);
                }
            }

            // Post-initialization: Update UI with current project
            this.postInitialization();

            this.initialized = true;
            console.log('\n✅ Application initialized successfully!\n');
            
            // Update status to ready
            this.updateStatus('Connected', 'success');
            this.updateAIStatus('Ready');
            
            if (typeof UIModule !== 'undefined') {
                UIModule.showNotification('AutoPilot IDE Ready', 'success');
            }

            // Run tests if in development
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log('\n🧪 Running test suite...\n');
                if (typeof testSuite !== 'undefined' && testSuite.run) {
                    await testSuite.run();
                }
            }

        } catch (error) {
            console.error('[App] Initialization failed:', error);
            this.updateStatus('Initialization failed', 'error');
            if (typeof UIModule !== 'undefined') {
                UIModule.showNotification('Failed to initialize application', 'error');
            }
        }
    }

    postInitialization() {
        console.log('[App] Running post-initialization tasks...');
        
        // Update project display if project manager is available
        if (typeof projectManager !== 'undefined') {
            const currentProject = projectManager.getCurrentProject();
            if (currentProject) {
                console.log('[App] Current project:', currentProject.name);
                
                // Update project name in sidebar
                const projectNameEl = document.getElementById('currentProjectName');
                if (projectNameEl) {
                    projectNameEl.textContent = currentProject.name;
                }
                
                // Update file tree
                this.updateFileTree(currentProject);
            } else {
                console.log('[App] No current project, creating defaults...');
                // This will trigger if no projects exist
            }
        }
        
        // Update backend status in status bar
        const backendStatus = document.getElementById('backendStatus');
        if (backendStatus) {
            backendStatus.textContent = '🌐 Connected';
            backendStatus.style.color = '#89d185';
        }
        
        // Update AI status
        this.updateAIStatus('Ready');
        
        console.log('[App] Post-initialization complete');
    }

    updateFileTree(project) {
        const fileTree = document.getElementById('fileTree');
        if (!fileTree) {
            console.warn('[App] File tree element not found');
            return;
        }

        if (!project.files || project.files.length === 0) {
            fileTree.innerHTML = '<div class="empty-state">No files in project</div>';
            return;
        }

        fileTree.innerHTML = project.files.map(file => `
            <div class="file-item" data-file-name="${file.name}">
                <span class="file-icon">${file.icon}</span>
                <span>${file.name}</span>
            </div>
        `).join('');

        // Add click handlers to file items
        fileTree.querySelectorAll('.file-item').forEach(item => {
            item.addEventListener('click', () => {
                fileTree.querySelectorAll('.file-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                const fileName = item.getAttribute('data-file-name');
                console.log('[App] Selected file:', fileName);
                
                // Show notification
                if (typeof UIModule !== 'undefined') {
                    UIModule.showNotification(`Opened: ${fileName}`, 'info');
                }
            });
        });

        console.log('[App] File tree updated with', project.files.length, 'files');
    }

    updateStatus(message, type = 'info') {
        const statusEl = document.getElementById('backendStatus');
        if (statusEl) {
            const icons = {
                'info': '🌐',
                'success': '✅',
                'error': '❌'
            };
            statusEl.textContent = `${icons[type] || '🌐'} ${message}`;
            
            const colors = {
                'info': '#d4d4d4',
                'success': '#89d185',
                'error': '#f48771'
            };
            statusEl.style.color = colors[type] || '#d4d4d4';
        }
    }

    updateAIStatus(status) {
        const aiStatusEl = document.getElementById('aiStatus');
        if (aiStatusEl) {
            aiStatusEl.textContent = status;
            
            // Update context indicator color
            const indicator = document.querySelector('.context-indicator');
            if (indicator) {
                if (status === 'Ready') {
                    indicator.style.background = '#4caf50';
                    indicator.style.boxShadow = '0 0 8px rgba(76, 175, 80, 0.6)';
                } else if (status === 'Initializing...') {
                    indicator.style.background = '#ff9800';
                    indicator.style.boxShadow = '0 0 8px rgba(255, 152, 0, 0.6)';
                } else if (status.includes('Error')) {
                    indicator.style.background = '#f44336';
                    indicator.style.boxShadow = '0 0 8px rgba(244, 67, 54, 0.6)';
                }
            }
        }
    }

    isInitialized() {
        return this.initialized;
    }

    getModule(name) {
        const mod = this.modules.find(m => m.name === name);
        return mod ? mod.module : null;
    }

    // Public method to refresh project display
    refreshProjectDisplay() {
        if (typeof projectManager !== 'undefined') {
            const currentProject = projectManager.getCurrentProject();
            if (currentProject) {
                this.updateFileTree(currentProject);
                
                const projectNameEl = document.getElementById('currentProjectName');
                if (projectNameEl) {
                    projectNameEl.textContent = currentProject.name;
                }
            }
        }
    }
}

// Create global app instance
const app = new App();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = app;
}
