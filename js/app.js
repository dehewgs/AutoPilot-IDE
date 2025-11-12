/**
 * AutoPilot IDE - Main Application JavaScript
 * Handles all UI interactions, WebSocket communication, and window management
 */

const API_BASE = '/api';
let socket = null;
let layoutManager = null;
let installedExtensions = [];
let availableExtensions = [];
let currentDropdown = null;

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('[AutoPilot IDE] Initializing...');
    
    // Initialize WebSocket connection
    initSocket();
    
    // Initialize Window Layout Manager
    initLayoutManager();
    
    // Initialize UI event handlers
    initUIHandlers();
    
    // Load extensions
    fetchExtensions();
    
    // Load projects
    loadProjects();
    
    console.log('[AutoPilot IDE] Initialization complete');
});

// ============================================================================
// WEBSOCKET CONNECTION
// ============================================================================

function initSocket() {
    socket = io(window.location.origin, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5
    });

    socket.on('connect', () => {
        console.log('[WebSocket] Connected to backend');
        addTerminalOutput('✓ Connected to backend', 'success');
        updateConnectionStatus(true);
    });

    socket.on('disconnect', () => {
        console.log('[WebSocket] Disconnected from backend');
        addTerminalOutput('✗ Disconnected from backend', 'error');
        updateConnectionStatus(false);
    });

    socket.on('terminal_output', (data) => {
        if (data.stdout) addTerminalOutput(data.stdout, 'output');
        if (data.stderr) addTerminalOutput(data.stderr, 'error');
    });

    socket.on('ai_response', (data) => {
        addAIMessage(data.message, false);
    });
}

function updateConnectionStatus(connected) {
    const indicator = document.querySelector('.context-indicator');
    const statusText = document.querySelector('.context-left span');
    
    if (indicator && statusText) {
        if (connected) {
            indicator.style.background = '#4caf50';
            statusText.textContent = 'Backend Connected';
        } else {
            indicator.style.background = '#f44336';
            statusText.textContent = 'Backend Disconnected';
        }
    }
}

// ============================================================================
// WINDOW LAYOUT MANAGER
// ============================================================================

function initLayoutManager() {
    layoutManager = new WindowLayoutManager({
        apiEndpoint: API_BASE + '/layouts',
        autoSave: true,
        autoSaveDelay: 2000
    });
    
    // Register all panels as resizable and movable
    layoutManager.registerPanel('sidebar', {
        minWidth: 200,
        maxWidth: 500,
        minHeight: 300,
        resizable: true,
        movable: true
    });
    
    layoutManager.registerPanel('terminal-section', {
        minHeight: 150,
        maxHeight: 500,
        resizable: true,
        movable: true
    });
    
    layoutManager.registerPanel('ai-panel', {
        minWidth: 300,
        maxWidth: 600,
        minHeight: 400,
        resizable: true,
        movable: true
    });
    
    // Try to load the last used layout
    loadLastLayout();
    
    console.log('[LayoutManager] Initialized with 3 panels');
}

async function loadLastLayout() {
    try {
        const layouts = await layoutManager.getLayouts();
        if (layouts && layouts.length > 0) {
            // Load the most recently saved layout
            const lastLayout = layouts[0];
            await layoutManager.loadLayout(lastLayout.id);
            console.log('[LayoutManager] Loaded last layout:', lastLayout.name);
        }
    } catch (error) {
        console.log('[LayoutManager] No previous layout found, using defaults');
    }
}

async function saveCurrentLayout() {
    const name = prompt('Enter a name for this layout:');
    if (name && name.trim()) {
        try {
            await layoutManager.saveLayout(name.trim());
            alert('Layout saved successfully!');
            console.log('[LayoutManager] Saved layout:', name);
        } catch (error) {
            console.error('[LayoutManager] Error saving layout:', error);
            alert('Failed to save layout');
        }
    }
}

async function openLayoutManager() {
    const modal = document.getElementById('layoutModal');
    const layoutList = document.getElementById('layoutList');
    
    try {
        const layouts = await layoutManager.getLayouts();
        
        layoutList.innerHTML = layouts.map(layout => `
            <div class="layout-item" onclick="loadLayoutById('${layout.id}')">
                <div class="layout-item-info">
                    <div class="layout-item-name">${layout.name}</div>
                    <div class="layout-item-date">${new Date(layout.timestamp).toLocaleString()}</div>
                </div>
                <div class="layout-item-actions">
                    <button onclick="event.stopPropagation(); loadLayoutById('${layout.id}')">Load</button>
                    <button class="delete" onclick="event.stopPropagation(); deleteLayoutById('${layout.id}')">Delete</button>
                </div>
            </div>
        `).join('');
        
        if (layouts.length === 0) {
            layoutList.innerHTML = '<div style="text-align: center; color: var(--text-secondary); padding: 20px;">No saved layouts yet</div>';
        }
        
        modal.classList.add('active');
    } catch (error) {
        console.error('[LayoutManager] Error loading layouts:', error);
        alert('Failed to load layouts');
    }
}

function closeLayoutManager() {
    document.getElementById('layoutModal').classList.remove('active');
}

async function saveLayoutWithName() {
    const input = document.getElementById('layoutNameInput');
    const name = input.value.trim();
    
    if (name) {
        try {
            await layoutManager.saveLayout(name);
            input.value = '';
            alert('Layout saved successfully!');
            openLayoutManager(); // Refresh the list
        } catch (error) {
            console.error('[LayoutManager] Error saving layout:', error);
            alert('Failed to save layout');
        }
    }
}

async function loadLayoutById(layoutId) {
    try {
        await layoutManager.loadLayout(layoutId);
        closeLayoutManager();
        console.log('[LayoutManager] Loaded layout:', layoutId);
    } catch (error) {
        console.error('[LayoutManager] Error loading layout:', error);
        alert('Failed to load layout');
    }
}

async function deleteLayoutById(layoutId) {
    if (confirm('Are you sure you want to delete this layout?')) {
        try {
            await layoutManager.deleteLayout(layoutId);
            openLayoutManager(); // Refresh the list
            console.log('[LayoutManager] Deleted layout:', layoutId);
        } catch (error) {
            console.error('[LayoutManager] Error deleting layout:', error);
            alert('Failed to delete layout');
        }
    }
}

function resetLayout() {
    if (confirm('Reset all panels to default positions?')) {
        // Reset to default positions
        const sidebar = document.getElementById('sidebar');
        const terminal = document.getElementById('terminal-section');
        const aiPanel = document.getElementById('ai-panel');
        
        if (sidebar) {
            sidebar.style.cssText = '';
        }
        if (terminal) {
            terminal.style.cssText = '';
        }
        if (aiPanel) {
            aiPanel.style.cssText = '';
        }
        
        console.log('[LayoutManager] Reset to default layout');
    }
}

function togglePanel(panelId) {
    const panel = document.getElementById(panelId);
    if (panel) {
        panel.style.display = panel.style.display === 'none' ? '' : 'none';
        console.log('[UI] Toggled panel:', panelId);
    }
}

// ============================================================================
// UI EVENT HANDLERS
// ============================================================================

function initUIHandlers() {
    // Terminal toggle
    const toggleTerminalBtn = document.getElementById('toggleTerminalBtn');
    if (toggleTerminalBtn) {
        toggleTerminalBtn.addEventListener('click', function() {
            const terminal = document.getElementById('terminal-section');
            const content = document.getElementById('terminalContent');
            
            terminal.classList.toggle('collapsed');
            content.classList.toggle('collapsed');
            
            const svg = this.querySelector('svg polyline');
            if (terminal.classList.contains('collapsed')) {
                svg.setAttribute('points', '6 9 12 15 18 9');
            } else {
                svg.setAttribute('points', '18 15 12 9 6 15');
            }
        });
    }
    
    // Terminal resizer
    const terminalResizer = document.getElementById('terminalResizer');
    const terminalSection = document.getElementById('terminal-section');
    let isResizing = false;
    
    if (terminalResizer && terminalSection) {
        terminalResizer.addEventListener('mousedown', function(e) {
            isResizing = true;
            document.body.style.cursor = 'ns-resize';
            document.body.style.userSelect = 'none';
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isResizing) return;
            
            const containerRect = terminalSection.parentElement.getBoundingClientRect();
            const newHeight = containerRect.bottom - e.clientY;
            
            if (newHeight >= 150 && newHeight <= 500) {
                terminalSection.style.height = newHeight + 'px';
            }
        });
        
        document.addEventListener('mouseup', function() {
            isResizing = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        });
    }
    
    // AI input auto-resize
    const aiInput = document.getElementById('aiInput');
    if (aiInput) {
        aiInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });
    }
    
    // AI mode selector
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // AI send button
    const sendBtn = document.getElementById('sendBtn');
    if (sendBtn) {
        sendBtn.addEventListener('click', sendAIMessage);
    }
    
    // AI input enter key
    if (aiInput) {
        aiInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendAIMessage();
            }
        });
    }
    
    // Terminal input
    const terminalInput = document.getElementById('terminalInput');
    if (terminalInput) {
        terminalInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const command = this.value.trim();
                if (command && socket) {
                    addTerminalOutput(`user@autopilot:~/project$ ${command}`, 'command');
                    socket.emit('terminal_execute', { command: command });
                    this.value = '';
                }
            }
        });
    }
    
    // Close modals on outside click
    window.addEventListener('click', function(event) {
        const layoutModal = document.getElementById('layoutModal');
        const projectModal = document.getElementById('projectModal');
        const manageModal = document.getElementById('manageExtensionsModal');
        const getModal = document.getElementById('getExtensionsModal');
        
        if (event.target === layoutModal) layoutModal.classList.remove('active');
        if (event.target === projectModal) projectModal.classList.remove('active');
        if (event.target === manageModal) manageModal.classList.remove('active');
        if (event.target === getModal) getModal.classList.remove('active');
    });
    
    // Close dropdowns on outside click
    document.addEventListener('click', function(e) {
        if (currentDropdown && !e.target.closest('.menu-tab-wrapper')) {
            currentDropdown.classList.remove('show');
            currentDropdown = null;
        }
    });
}

// ============================================================================
// TERMINAL FUNCTIONS
// ============================================================================

function addTerminalOutput(text, type = 'output') {
    const content = document.getElementById('terminalContent');
    if (!content) return;
    
    const line = document.createElement('div');
    line.className = 'terminal-line';
    
    const span = document.createElement('span');
    span.className = `terminal-${type}`;
    span.textContent = text;
    
    line.appendChild(span);
    content.insertBefore(line, content.lastElementChild);
    content.scrollTop = content.scrollHeight;
}

// ============================================================================
// AI ASSISTANT FUNCTIONS
// ============================================================================

function sendAIMessage() {
    const input = document.getElementById('aiInput');
    const message = input.value.trim();
    
    if (message) {
        addAIMessage(message, true);
        
        if (socket) {
            const mode = document.querySelector('.mode-btn.active').textContent.trim();
            socket.emit('ai_message', {
                message: message,
                mode: mode
            });
        }
        
        input.value = '';
        input.style.height = 'auto';
    }
}

function addAIMessage(message, isUser = false) {
    const chat = document.getElementById('aiChat');
    if (!chat) return;
    
    const msg = document.createElement('div');
    msg.className = `ai-message ${isUser ? 'user' : ''}`;
    msg.textContent = message;
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
}

// ============================================================================
// DROPDOWN MENU FUNCTIONS
// ============================================================================

function toggleDropdown(menuId, event) {
    event.stopPropagation();
    const menu = document.getElementById(menuId);
    
    if (currentDropdown === menu && menu.classList.contains('show')) {
        menu.classList.remove('show');
        currentDropdown = null;
        return;
    }
    
    if (currentDropdown) {
        currentDropdown.classList.remove('show');
    }
    
    menu.classList.add('show');
    currentDropdown = menu;
}

// ============================================================================
// PROJECT MANAGEMENT
// ============================================================================

async function loadProjects() {
    try {
        const response = await fetch(`${API_BASE}/projects`);
        const data = await response.json();
        
        if (data.projects) {
            updateProjectGrid(data.projects);
        }
    } catch (error) {
        console.error('[Projects] Error loading projects:', error);
    }
}

function updateProjectGrid(projects) {
    const grid = document.getElementById('projectGrid');
    if (!grid) return;
    
    // Keep the "New Project" card and add project cards
    const projectCards = projects.map(project => `
        <div class="project-card" onclick="openProjectById('${project.id}')">
            <div class="project-card-icon">📁</div>
            <div class="project-card-name">${project.name}</div>
            <div class="project-card-path">${project.path || 'No path'}</div>
        </div>
    `).join('');
    
    grid.innerHTML = `
        <div class="project-card project-card-new" onclick="createNewProject()">
            <div class="project-card-new-icon">+</div>
            <div class="project-card-name">New Project</div>
        </div>
        ${projectCards}
    `;
}

function openProjectModal() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.classList.add('active');
        loadProjects();
    }
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

async function openProjectById(projectId) {
    try {
        const response = await fetch(`${API_BASE}/projects/${projectId}`);
        const project = await response.json();
        
        // Update UI with project data
        const projectName = document.querySelector('.project-name');
        if (projectName) {
            projectName.textContent = project.name;
        }
        
        closeProjectModal();
        console.log('[Projects] Opened project:', project.name);
    } catch (error) {
        console.error('[Projects] Error opening project:', error);
        alert('Failed to open project');
    }
}

function createNewProject() {
    const name = prompt('Enter project name:');
    if (name && name.trim()) {
        createProject(name.trim());
    }
}

async function createProject(name) {
    try {
        const response = await fetch(`${API_BASE}/projects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: Date.now().toString(),
                name: name,
                path: `/projects/${name}`,
                created: new Date().toISOString()
            })
        });
        
        if (response.ok) {
            loadProjects();
            alert('Project created successfully!');
        }
    } catch (error) {
        console.error('[Projects] Error creating project:', error);
        alert('Failed to create project');
    }
}

// ============================================================================
// EXTENSIONS MANAGEMENT
// ============================================================================

async function fetchExtensions() {
    try {
        const response = await fetch(`${API_BASE}/extensions`);
        const data = await response.json();
        installedExtensions = data.installed || [];
        availableExtensions = data.available || [];
    } catch (error) {
        console.error('[Extensions] Error fetching extensions:', error);
    }
}

function openManageExtensions() {
    const modal = document.getElementById('manageExtensionsModal');
    const list = document.getElementById('extensionsList');
    
    list.innerHTML = installedExtensions.map(ext => `
        <div class="extension-item">
            <div class="extension-info">
                <div class="extension-status ${ext.enabled ? '' : 'disabled'}"></div>
                <div class="extension-details">
                    <div class="extension-name">${ext.name}</div>
                    <div class="extension-version">v${ext.version} • ${ext.enabled ? 'Enabled' : 'Disabled'}</div>
                </div>
            </div>
            <div class="extension-actions">
                <button class="extension-btn" onclick="toggleExtensionAPI(${ext.id})">
                    ${ext.enabled ? 'Disable' : 'Enable'}
                </button>
                <button class="extension-btn danger" onclick="uninstallExtensionAPI(${ext.id})">
                    Uninstall
                </button>
            </div>
        </div>
    `).join('');
    
    if (installedExtensions.length === 0) {
        list.innerHTML = '<div style="text-align: center; color: var(--text-secondary); padding: 20px;">No extensions installed</div>';
    }
    
    modal.classList.add('active');
}

function closeManageExtensions() {
    document.getElementById('manageExtensionsModal').classList.remove('active');
}

function openGetExtensions() {
    const modal = document.getElementById('getExtensionsModal');
    const list = document.getElementById('availableExtensionsList');
    
    const notInstalled = availableExtensions.filter(
        avail => !installedExtensions.some(inst => inst.id === avail.id)
    );
    
    list.innerHTML = notInstalled.map(ext => `
        <div class="extension-item">
            <div class="extension-info">
                <div class="extension-details">
                    <div class="extension-name">${ext.name}</div>
                    <div class="extension-version">v${ext.version} • ${ext.description}</div>
                </div>
            </div>
            <div class="extension-actions">
                <button class="extension-btn install" onclick="installExtensionAPI(${ext.id})">
                    Install
                </button>
            </div>
        </div>
    `).join('');
    
    if (notInstalled.length === 0) {
        list.innerHTML = '<div style="text-align: center; color: var(--text-secondary); padding: 20px;">All available extensions are installed!</div>';
    }
    
    modal.classList.add('active');
}

function closeGetExtensions() {
    document.getElementById('getExtensionsModal').classList.remove('active');
}

async function toggleExtensionAPI(extId) {
    try {
        await fetch(`${API_BASE}/extensions/${extId}/toggle`, { method: 'POST' });
        await fetchExtensions();
        openManageExtensions();
    } catch (error) {
        console.error('[Extensions] Error toggling extension:', error);
    }
}

async function installExtensionAPI(extId) {
    try {
        await fetch(`${API_BASE}/extensions/${extId}/install`, { method: 'POST' });
        await fetchExtensions();
        openGetExtensions();
    } catch (error) {
        console.error('[Extensions] Error installing extension:', error);
    }
}

async function uninstallExtensionAPI(extId) {
    if (confirm('Are you sure you want to uninstall this extension?')) {
        try {
            await fetch(`${API_BASE}/extensions/${extId}/uninstall`, { method: 'POST' });
            await fetchExtensions();
            openManageExtensions();
        } catch (error) {
            console.error('[Extensions] Error uninstalling extension:', error);
        }
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

console.log('[AutoPilot IDE] app.js loaded');
