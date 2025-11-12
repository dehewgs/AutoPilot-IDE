/**
 * AutoPilot IDE - Event Handlers Module
 * Centralized event listener management and UI action routing
 * Fixed: All UI synchronization bugs and proper app integration
 */

const EventHandlers = (() => {
    let initialized = false;

    const init = () => {
        if (initialized) {
            console.warn('[EventHandlers] Already initialized');
            return;
        }

        console.log('[EventHandlers] Initializing event handlers...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupAllHandlers);
        } else {
            setupAllHandlers();
        }

        initialized = true;
    };

    const setupAllHandlers = () => {
        console.log('[EventHandlers] Setting up all handlers...');
        
        // Setup all event listeners
        setupMenuHandlers();
        setupSidebarHandlers();
        setupProjectModalHandlers();
        setupExtensionModalHandlers();
        setupTerminalHandlers();
        setupAIHandlers();
        setupGlobalHandlers();
        
        // Initialize project system UI - AFTER a short delay to ensure app is ready
        setTimeout(() => {
            initializeProjectUI();
        }, 100);
        
        console.log('[EventHandlers] ✓ All event handlers registered');
    };

    // ===== Menu Handlers =====
    const setupMenuHandlers = () => {
        // Menu tab dropdowns
        document.querySelectorAll('.menu-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.stopPropagation();
                const menuId = tab.getAttribute('data-menu');
                if (menuId) {
                    toggleDropdown(menuId);
                }
            });
        });

        // Dropdown items with actions
        document.querySelectorAll('.dropdown-item[data-action]').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = item.getAttribute('data-action');
                handleAction(action);
                closeAllDropdowns();
            });
        });

        console.log('[EventHandlers] Menu handlers registered');
    };

    // ===== Sidebar Handlers =====
    const setupSidebarHandlers = () => {
        // Sidebar action buttons
        document.querySelectorAll('.sidebar-btn[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.getAttribute('data-action');
                handleAction(action);
            });
        });

        console.log('[EventHandlers] Sidebar handlers registered');
    };

    // ===== Project Modal Handlers =====
    const setupProjectModalHandlers = () => {
        const modal = document.getElementById('projectModal');
        if (!modal) return;

        // Modal close button
        const closeBtn = modal.querySelector('[data-action="close-project-modal"]');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeProjectModal());
        }

        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeProjectModal();
            }
        });

        // Project tabs
        document.querySelectorAll('.project-tab[data-tab]').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = tab.getAttribute('data-tab');
                switchProjectTab(tabName);
            });
        });

        // Create project button
        const createBtn = modal.querySelector('[data-action="create-project"]');
        if (createBtn) {
            createBtn.addEventListener('click', () => createNewProject());
        }

        // Browse button
        const browseBtn = modal.querySelector('[data-action="browse-projects"]');
        if (browseBtn) {
            browseBtn.addEventListener('click', () => browseProjects());
        }

        // Enter key in project name input
        const nameInput = document.getElementById('newProjectName');
        if (nameInput) {
            nameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    createNewProject();
                }
            });
        }

        console.log('[EventHandlers] Project modal handlers registered');
    };

    // ===== Extension Modal Handlers =====
    const setupExtensionModalHandlers = () => {
        // Manage Extensions modal
        const manageModal = document.getElementById('manageExtensionsModal');
        if (manageModal) {
            const closeBtn = manageModal.querySelector('[data-action="close-manage-extensions"]');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    manageModal.classList.remove('show');
                });
            }
            manageModal.addEventListener('click', (e) => {
                if (e.target === manageModal) {
                    manageModal.classList.remove('show');
                }
            });
        }

        // Get Extensions modal
        const getModal = document.getElementById('getExtensionsModal');
        if (getModal) {
            const closeBtn = getModal.querySelector('[data-action="close-get-extensions"]');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    getModal.classList.remove('show');
                });
            }
            getModal.addEventListener('click', (e) => {
                if (e.target === getModal) {
                    getModal.classList.remove('show');
                }
            });
        }

        console.log('[EventHandlers] Extension modal handlers registered');
    };

    // ===== Terminal Handlers =====
    const setupTerminalHandlers = () => {
        // Terminal action buttons
        document.querySelectorAll('.terminal-btn[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.getAttribute('data-action');
                handleAction(action);
            });
        });

        // Terminal tabs
        document.querySelectorAll('.terminal-tab[data-terminal]').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.terminal-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
            });
        });

        // Terminal resizer
        const resizer = document.getElementById('terminalResizer');
        const terminalSection = document.getElementById('terminalSection');
        if (resizer && terminalSection) {
            let isResizing = false;
            
            resizer.addEventListener('mousedown', (e) => {
                isResizing = true;
                document.body.style.cursor = 'ns-resize';
                document.body.style.userSelect = 'none';
            });

            document.addEventListener('mousemove', (e) => {
                if (!isResizing) return;
                const containerRect = terminalSection.parentElement.getBoundingClientRect();
                const newHeight = containerRect.bottom - e.clientY;
                if (newHeight >= 150 && newHeight <= 500) {
                    terminalSection.style.height = newHeight + 'px';
                }
            });

            document.addEventListener('mouseup', () => {
                isResizing = false;
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            });
        }

        console.log('[EventHandlers] Terminal handlers registered');
    };

    // ===== AI Panel Handlers =====
    const setupAIHandlers = () => {
        // AI action buttons
        document.querySelectorAll('.icon-btn[data-action], .input-tool[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.getAttribute('data-action');
                handleAction(action);
            });
        });

        // AI mode buttons
        document.querySelectorAll('.mode-btn[data-mode]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // AI input auto-resize
        const aiInput = document.getElementById('aiInput');
        if (aiInput) {
            aiInput.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = Math.min(this.scrollHeight, 120) + 'px';
            });

            // Enter to send (Shift+Enter for new line)
            aiInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAction('send-ai-message');
                }
            });
        }

        // Send button
        const sendBtn = document.getElementById('sendBtn');
        if (sendBtn) {
            sendBtn.addEventListener('click', () => handleAction('send-ai-message'));
        }

        console.log('[EventHandlers] AI panel handlers registered');
    };

    // ===== Global Handlers =====
    const setupGlobalHandlers = () => {
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.menu-tab-wrapper')) {
                closeAllDropdowns();
            }
        });

        // Integration buttons
        document.querySelectorAll('.btn[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.getAttribute('data-action');
                handleAction(action);
            });
        });

        console.log('[EventHandlers] Global handlers registered');
    };

    // ===== Action Handler =====
    const handleAction = (action) => {
        console.log('[EventHandlers] Action:', action);

        switch (action) {
            // Project actions
            case 'open-project':
            case 'select-project':
                openProjectModal();
                break;
            case 'create-project':
                createNewProject();
                break;
            case 'close-project-modal':
                closeProjectModal();
                break;
            case 'browse-projects':
                browseProjects();
                break;
            case 'regen-context':
                console.log('[Action] Regenerating context...');
                if (typeof UIModule !== 'undefined') {
                    UIModule.showNotification('Regenerating project context...', 'info');
                }
                break;
            case 'configure-project':
                console.log('[Action] Opening project configuration...');
                if (typeof UIModule !== 'undefined') {
                    UIModule.showNotification('Project configuration coming soon!', 'info');
                }
                break;

            // Extension actions
            case 'get-extensions':
                if (typeof ExtensionModule !== 'undefined') {
                    ExtensionModule.openGetExtensions();
                }
                break;
            case 'manage-extensions':
                if (typeof ExtensionModule !== 'undefined') {
                    ExtensionModule.openManageExtensions();
                }
                break;
            case 'open-extension-dir':
                console.log('[Action] Opening extension directory...');
                break;
            case 'close-manage-extensions':
                document.getElementById('manageExtensionsModal')?.classList.remove('show');
                break;
            case 'close-get-extensions':
                document.getElementById('getExtensionsModal')?.classList.remove('show');
                break;

            // Terminal actions
            case 'toggle-terminal':
                toggleTerminal();
                break;
            case 'clear-terminal':
                if (typeof TerminalModule !== 'undefined') {
                    TerminalModule.clear();
                }
                break;
            case 'split-terminal':
                console.log('[Action] Splitting terminal...');
                if (typeof UIModule !== 'undefined') {
                    UIModule.showNotification('Split terminal coming soon!', 'info');
                }
                break;
            case 'new-terminal':
                console.log('[Action] Creating new terminal...');
                if (typeof UIModule !== 'undefined') {
                    UIModule.showNotification('New terminal coming soon!', 'info');
                }
                break;

            // AI actions
            case 'send-ai-message':
                sendAIMessage();
                break;
            case 'new-chat':
                if (typeof AIModule !== 'undefined') {
                    AIModule.clear();
                    if (typeof UIModule !== 'undefined') {
                        UIModule.showNotification('Chat cleared', 'info');
                    }
                }
                break;
            case 'ai-settings':
                console.log('[Action] Opening AI settings...');
                if (typeof UIModule !== 'undefined') {
                    UIModule.showNotification('AI settings coming soon!', 'info');
                }
                break;
            case 'attach-file':
                console.log('[Action] Attaching file...');
                if (typeof UIModule !== 'undefined') {
                    UIModule.showNotification('File attachment coming soon!', 'info');
                }
                break;
            case 'add-context':
                console.log('[Action] Adding context...');
                if (typeof UIModule !== 'undefined') {
                    UIModule.showNotification('Context addition coming soon!', 'info');
                }
                break;
            case 'voice-input':
                console.log('[Action] Starting voice input...');
                if (typeof UIModule !== 'undefined') {
                    UIModule.showNotification('Voice input coming soon!', 'info');
                }
                break;

            // Integration actions
            case 'connect-github':
                console.log('[Action] Connecting to GitHub...');
                if (typeof UIModule !== 'undefined') {
                    UIModule.showNotification('GitHub integration coming soon!', 'info');
                }
                break;
            case 'connect-huggingface':
                console.log('[Action] Connecting to Hugging Face...');
                if (typeof UIModule !== 'undefined') {
                    UIModule.showNotification('Hugging Face integration coming soon!', 'info');
                }
                break;

            // Theme actions
            case 'theme-dark':
                console.log('[Action] Switching to dark theme...');
                if (typeof UIModule !== 'undefined') {
                    UIModule.showNotification('Already using dark theme', 'info');
                }
                break;
            case 'theme-light':
                console.log('[Action] Switching to light theme...');
                if (typeof UIModule !== 'undefined') {
                    UIModule.showNotification('Light theme coming soon!', 'info');
                }
                break;
            case 'open-theme-dir':
                console.log('[Action] Opening theme directory...');
                break;

            // Window actions
            case 'toggle-explorer':
            case 'toggle-editor':
            case 'toggle-ai':
                console.log('[Action] Toggling panel:', action);
                if (typeof UIModule !== 'undefined') {
                    UIModule.showNotification('Panel toggle coming soon!', 'info');
                }
                break;

            default:
                console.warn('[EventHandlers] Unknown action:', action);
        }
    };

    // ===== Helper Functions =====

    const toggleDropdown = (menuId) => {
        const menu = document.getElementById(menuId);
        if (!menu) return;

        const isOpen = menu.classList.contains('show');
        
        // Close all dropdowns first
        closeAllDropdowns();
        
        // Toggle this one
        if (!isOpen) {
            menu.classList.add('show');
        }
    };

    const closeAllDropdowns = () => {
        document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
            menu.classList.remove('show');
        });
    };

    const openProjectModal = () => {
        const modal = document.getElementById('projectModal');
        if (modal) {
            modal.classList.add('show');
            updateRecentProjectsList();
            console.log('[EventHandlers] Project modal opened');
        }
    };

    const closeProjectModal = () => {
        const modal = document.getElementById('projectModal');
        if (modal) {
            modal.classList.remove('show');
            console.log('[EventHandlers] Project modal closed');
        }
    };

    const switchProjectTab = (tabName) => {
        // Hide all tab contents
        document.querySelectorAll('.project-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Show selected tab content
        const selectedContent = document.getElementById(tabName + 'Tab');
        if (selectedContent) {
            selectedContent.classList.add('active');
        }
        
        // Update tab buttons
        document.querySelectorAll('.project-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        const selectedTab = document.querySelector(`.project-tab[data-tab="${tabName}"]`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        console.log('[EventHandlers] Switched to project tab:', tabName);
    };

    const createNewProject = () => {
        const nameInput = document.getElementById('newProjectName');
        const typeSelect = document.getElementById('projectType');
        const locationInput = document.getElementById('projectLocation');
        
        if (!nameInput || !typeSelect) {
            console.error('[EventHandlers] Project form elements not found');
            return;
        }

        const name = nameInput.value.trim();
        const type = typeSelect.value;
        const location = locationInput?.value.trim();

        if (!name) {
            if (typeof UIModule !== 'undefined') {
                UIModule.showNotification('Please enter a project name', 'error');
            } else {
                alert('Please enter a project name');
            }
            return;
        }

        try {
            // Create project using ProjectManager
            if (typeof projectManager !== 'undefined') {
                const project = projectManager.createProject(name, type, location || undefined);
                console.log('[EventHandlers] Project created:', project);
                
                // CRITICAL FIX: Refresh the entire app display
                if (typeof app !== 'undefined' && app.refreshProjectDisplay) {
                    app.refreshProjectDisplay();
                }
                
                // Update recent projects list
                updateRecentProjectsList();
                
                // Close modal
                closeProjectModal();
                
                // Clear form
                nameInput.value = '';
                if (locationInput) locationInput.value = '';
                
                // Show success message
                if (typeof UIModule !== 'undefined') {
                    UIModule.showNotification(`Project "${name}" created successfully!`, 'success');
                } else {
                    alert(`Project "${name}" created successfully!`);
                }
            } else {
                console.error('[EventHandlers] ProjectManager not available');
                alert('Project system not initialized');
            }
        } catch (error) {
            console.error('[EventHandlers] Error creating project:', error);
            if (typeof UIModule !== 'undefined') {
                UIModule.showNotification('Error creating project: ' + error.message, 'error');
            } else {
                alert('Error creating project: ' + error.message);
            }
        }
    };

    const browseProjects = () => {
        const pathInput = document.getElementById('projectPath');
        if (pathInput) {
            console.log('[EventHandlers] Browse path:', pathInput.value);
            // In a real implementation, this would open a file browser
            if (typeof UIModule !== 'undefined') {
                UIModule.showNotification('File browser requires backend integration', 'info');
            } else {
                alert('File browser functionality requires backend integration');
            }
        }
    };

    const updateRecentProjectsList = () => {
        if (typeof projectManager === 'undefined') return;

        const listEl = document.getElementById('recentProjectsList');
        if (!listEl) return;

        const recentProjects = projectManager.getRecentProjects(10);
        
        if (recentProjects.length === 0) {
            listEl.innerHTML = '<div class="empty-state">No recent projects</div>';
            return;
        }

        listEl.innerHTML = recentProjects.map(project => `
            <div class="project-item" data-project-id="${project.id}">
                <div class="project-icon">📁</div>
                <div class="project-info">
                    <div class="project-title">${project.name}</div>
                    <div class="project-path">${project.path}</div>
                    <div class="project-date">${projectManager.formatDate(project.lastOpened)}</div>
                </div>
                <div class="project-arrow">→</div>
            </div>
        `).join('');

        // Add click handlers to project items
        listEl.querySelectorAll('.project-item').forEach(item => {
            item.addEventListener('click', () => {
                const projectId = item.getAttribute('data-project-id');
                openProject(projectId);
            });
        });

        console.log('[EventHandlers] Updated recent projects list');
    };

    const openProject = (projectId) => {
        if (typeof projectManager === 'undefined') return;

        if (projectManager.setCurrentProject(projectId)) {
            // CRITICAL FIX: Refresh the entire app display
            if (typeof app !== 'undefined' && app.refreshProjectDisplay) {
                app.refreshProjectDisplay();
            }
            
            closeProjectModal();
            console.log('[EventHandlers] Opened project:', projectId);
            
            if (typeof UIModule !== 'undefined') {
                const project = projectManager.getCurrentProject();
                UIModule.showNotification(`Opened project: ${project.name}`, 'success');
            }
        } else {
            console.error('[EventHandlers] Failed to open project:', projectId);
        }
    };

    const initializeProjectUI = () => {
        if (typeof projectManager !== 'undefined' && typeof app !== 'undefined') {
            // Use app's refresh method for consistency
            if (app.refreshProjectDisplay) {
                app.refreshProjectDisplay();
                console.log('[EventHandlers] Project UI initialized via app.refreshProjectDisplay()');
            }
        }
    };

    const toggleTerminal = () => {
        const terminal = document.getElementById('terminalSection');
        const content = document.getElementById('terminalContent');
        const btn = document.getElementById('toggleTerminalBtn');
        
        if (terminal && content && btn) {
            terminal.classList.toggle('collapsed');
            content.classList.toggle('collapsed');
            
            const svg = btn.querySelector('svg polyline');
            if (svg) {
                if (terminal.classList.contains('collapsed')) {
                    svg.setAttribute('points', '6 9 12 15 18 9');
                } else {
                    svg.setAttribute('points', '18 15 12 9 6 15');
                }
            }
        }
    };

    const sendAIMessage = () => {
        const input = document.getElementById('aiInput');
        if (!input) return;

        const message = input.value.trim();
        if (!message) return;

        console.log('[EventHandlers] Sending AI message:', message);

        // Add user message to chat
        const chat = document.getElementById('aiChat');
        if (chat) {
            const msgEl = document.createElement('div');
            msgEl.className = 'ai-message user';
            msgEl.textContent = message;
            chat.appendChild(msgEl);
            chat.scrollTop = chat.scrollHeight;
        }

        // Clear input
        input.value = '';
        input.style.height = 'auto';

        // Send to AI module if available
        if (typeof AIModule !== 'undefined' && AIModule.sendMessage) {
            const mode = document.querySelector('.mode-btn.active')?.getAttribute('data-mode') || 'chat';
            AIModule.sendMessage(message, mode);
        } else {
            // Simulate response
            setTimeout(() => {
                if (chat) {
                    const responseEl = document.createElement('div');
                    responseEl.className = 'ai-message';
                    responseEl.textContent = 'AI response functionality requires backend connection. Your message: "' + message + '"';
                    chat.appendChild(responseEl);
                    chat.scrollTop = chat.scrollHeight;
                }
            }, 500);
        }
    };

    // Public API
    return {
        init,
        handleAction,
        openProjectModal,
        closeProjectModal,
        updateRecentProjectsList
    };
})();
