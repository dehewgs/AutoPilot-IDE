/**
 * Window Layout Manager for AutoPilot IDE
 * Handles resizable, movable panels and layout saving/restoration
 */

class WindowLayoutManager {
    constructor() {
        this.panels = new Map();
        this.currentLayout = null;
        this.isDragging = false;
        this.isResizing = false;
        this.dragTarget = null;
        this.resizeTarget = null;
        this.startX = 0;
        this.startY = 0;
        this.startWidth = 0;
        this.startHeight = 0;
        this.startLeft = 0;
        this.startTop = 0;
        
        this.init();
    }
    
    init() {
        console.log('[LayoutManager] Initializing window layout manager...');
        this.setupEventListeners();
        this.loadLastLayout();
    }
    
    /**
     * Register a panel as resizable and movable
     */
    registerPanel(panelId, options = {}) {
        const panel = document.getElementById(panelId);
        if (!panel) {
            console.error(`[LayoutManager] Panel not found: ${panelId}`);
            return;
        }
        
        const config = {
            id: panelId,
            element: panel,
            resizable: options.resizable !== false,
            movable: options.movable !== false,
            minWidth: options.minWidth || 200,
            minHeight: options.minHeight || 150,
            maxWidth: options.maxWidth || null,
            maxHeight: options.maxHeight || null,
            ...options
        };
        
        this.panels.set(panelId, config);
        
        if (config.movable) {
            this.makeMovable(panel, config);
        }
        
        if (config.resizable) {
            this.makeResizable(panel, config);
        }
        
        console.log(`[LayoutManager] Registered panel: ${panelId}`);
    }
    
    /**
     * Make a panel movable
     */
    makeMovable(panel, config) {
        // Create drag handle if it doesn't exist
        let dragHandle = panel.querySelector('.panel-drag-handle');
        
        if (!dragHandle) {
            dragHandle = document.createElement('div');
            dragHandle.className = 'panel-drag-handle';
            dragHandle.innerHTML = '<span class="drag-icon">⋮⋮</span>';
            
            // Insert at the beginning of the panel
            const header = panel.querySelector('.panel-header, .sidebar-header, .ai-header, .terminal-header');
            if (header) {
                header.style.cursor = 'move';
                header.classList.add('panel-drag-handle');
                dragHandle = header;
            } else {
                panel.insertBefore(dragHandle, panel.firstChild);
            }
        }
        
        dragHandle.addEventListener('mousedown', (e) => this.startDrag(e, panel, config));
    }
    
    /**
     * Make a panel resizable
     */
    makeResizable(panel, config) {
        // Add resize handles
        const handles = ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'];
        
        handles.forEach(direction => {
            let handle = panel.querySelector(`.resize-handle-${direction}`);
            
            if (!handle) {
                handle = document.createElement('div');
                handle.className = `resize-handle resize-handle-${direction}`;
                panel.appendChild(handle);
            }
            
            handle.addEventListener('mousedown', (e) => this.startResize(e, panel, config, direction));
        });
    }
    
    /**
     * Start dragging a panel
     */
    startDrag(e, panel, config) {
        if (e.button !== 0) return; // Only left mouse button
        
        e.preventDefault();
        e.stopPropagation();
        
        this.isDragging = true;
        this.dragTarget = panel;
        this.startX = e.clientX;
        this.startY = e.clientY;
        
        const rect = panel.getBoundingClientRect();
        this.startLeft = rect.left;
        this.startTop = rect.top;
        
        // Make panel absolute positioned if not already
        if (getComputedStyle(panel).position !== 'absolute') {
            panel.style.position = 'absolute';
            panel.style.left = rect.left + 'px';
            panel.style.top = rect.top + 'px';
            panel.style.width = rect.width + 'px';
            panel.style.height = rect.height + 'px';
        }
        
        panel.classList.add('dragging');
        document.body.style.cursor = 'move';
        document.body.style.userSelect = 'none';
        
        console.log(`[LayoutManager] Started dragging: ${config.id}`);
    }
    
    /**
     * Start resizing a panel
     */
    startResize(e, panel, config, direction) {
        if (e.button !== 0) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        this.isResizing = true;
        this.resizeTarget = panel;
        this.resizeDirection = direction;
        this.startX = e.clientX;
        this.startY = e.clientY;
        
        const rect = panel.getBoundingClientRect();
        this.startWidth = rect.width;
        this.startHeight = rect.height;
        this.startLeft = rect.left;
        this.startTop = rect.top;
        
        panel.classList.add('resizing');
        document.body.style.userSelect = 'none';
        
        console.log(`[LayoutManager] Started resizing: ${config.id} (${direction})`);
    }
    
    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.handleDrag(e);
            } else if (this.isResizing) {
                this.handleResize(e);
            }
        });
        
        document.addEventListener('mouseup', (e) => {
            if (this.isDragging) {
                this.endDrag(e);
            } else if (this.isResizing) {
                this.endResize(e);
            }
        });
        
        // Auto-save layout on window resize
        window.addEventListener('resize', () => {
            this.autoSaveLayout();
        });
    }
    
    /**
     * Handle panel dragging
     */
    handleDrag(e) {
        if (!this.dragTarget) return;
        
        const deltaX = e.clientX - this.startX;
        const deltaY = e.clientY - this.startY;
        
        const newLeft = this.startLeft + deltaX;
        const newTop = this.startTop + deltaY;
        
        // Keep panel within viewport
        const maxLeft = window.innerWidth - this.dragTarget.offsetWidth;
        const maxTop = window.innerHeight - this.dragTarget.offsetHeight;
        
        this.dragTarget.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + 'px';
        this.dragTarget.style.top = Math.max(0, Math.min(newTop, maxTop)) + 'px';
    }
    
    /**
     * Handle panel resizing
     */
    handleResize(e) {
        if (!this.resizeTarget) return;
        
        const config = this.panels.get(this.resizeTarget.id);
        if (!config) return;
        
        const deltaX = e.clientX - this.startX;
        const deltaY = e.clientY - this.startY;
        
        let newWidth = this.startWidth;
        let newHeight = this.startHeight;
        let newLeft = this.startLeft;
        let newTop = this.startTop;
        
        // Calculate new dimensions based on resize direction
        if (this.resizeDirection.includes('e')) {
            newWidth = this.startWidth + deltaX;
        }
        if (this.resizeDirection.includes('w')) {
            newWidth = this.startWidth - deltaX;
            newLeft = this.startLeft + deltaX;
        }
        if (this.resizeDirection.includes('s')) {
            newHeight = this.startHeight + deltaY;
        }
        if (this.resizeDirection.includes('n')) {
            newHeight = this.startHeight - deltaY;
            newTop = this.startTop + deltaY;
        }
        
        // Apply constraints
        newWidth = Math.max(config.minWidth, newWidth);
        newHeight = Math.max(config.minHeight, newHeight);
        
        if (config.maxWidth) {
            newWidth = Math.min(config.maxWidth, newWidth);
        }
        if (config.maxHeight) {
            newHeight = Math.min(config.maxHeight, newHeight);
        }
        
        // Apply new dimensions
        this.resizeTarget.style.width = newWidth + 'px';
        this.resizeTarget.style.height = newHeight + 'px';
        
        if (this.resizeDirection.includes('w') || this.resizeDirection.includes('n')) {
            this.resizeTarget.style.left = newLeft + 'px';
            this.resizeTarget.style.top = newTop + 'px';
        }
    }
    
    /**
     * End dragging
     */
    endDrag(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        
        if (this.dragTarget) {
            this.dragTarget.classList.remove('dragging');
            this.dragTarget = null;
        }
        
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        
        this.autoSaveLayout();
        console.log('[LayoutManager] Ended dragging');
    }
    
    /**
     * End resizing
     */
    endResize(e) {
        if (!this.isResizing) return;
        
        this.isResizing = false;
        
        if (this.resizeTarget) {
            this.resizeTarget.classList.remove('resizing');
            this.resizeTarget = null;
        }
        
        document.body.style.userSelect = '';
        
        this.autoSaveLayout();
        console.log('[LayoutManager] Ended resizing');
    }
    
    /**
     * Get current layout state
     */
    getCurrentLayout() {
        const layout = {
            id: this.currentLayout?.id || 'custom-' + Date.now(),
            name: this.currentLayout?.name || 'Custom Layout',
            panels: {}
        };
        
        this.panels.forEach((config, panelId) => {
            const panel = config.element;
            const rect = panel.getBoundingClientRect();
            const computedStyle = getComputedStyle(panel);
            
            layout.panels[panelId] = {
                width: rect.width,
                height: rect.height,
                left: rect.left,
                top: rect.top,
                position: computedStyle.position,
                display: computedStyle.display,
                zIndex: computedStyle.zIndex
            };
        });
        
        return layout;
    }
    
    /**
     * Apply a layout
     */
    applyLayout(layout) {
        console.log('[LayoutManager] Applying layout:', layout.name);
        
        Object.entries(layout.panels).forEach(([panelId, state]) => {
            const config = this.panels.get(panelId);
            if (!config) return;
            
            const panel = config.element;
            
            panel.style.width = state.width + 'px';
            panel.style.height = state.height + 'px';
            panel.style.left = state.left + 'px';
            panel.style.top = state.top + 'px';
            panel.style.position = state.position;
            panel.style.display = state.display;
            panel.style.zIndex = state.zIndex;
        });
        
        this.currentLayout = layout;
    }
    
    /**
     * Save current layout
     */
    async saveLayout(name) {
        const layout = this.getCurrentLayout();
        layout.name = name || layout.name;
        layout.id = name ? name.toLowerCase().replace(/\s+/g, '-') : layout.id;
        
        try {
            const response = await fetch('/api/layouts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(layout)
            });
            
            if (response.ok) {
                console.log('[LayoutManager] Layout saved:', layout.name);
                this.currentLayout = layout;
                return layout;
            } else {
                throw new Error('Failed to save layout');
            }
        } catch (error) {
            console.error('[LayoutManager] Error saving layout:', error);
            // Fallback to localStorage
            this.saveLayoutToLocalStorage(layout);
            return layout;
        }
    }
    
    /**
     * Load a layout by ID
     */
    async loadLayout(layoutId) {
        try {
            const response = await fetch(`/api/layouts/${layoutId}`);
            
            if (response.ok) {
                const layout = await response.json();
                this.applyLayout(layout);
                return layout;
            } else {
                throw new Error('Failed to load layout');
            }
        } catch (error) {
            console.error('[LayoutManager] Error loading layout:', error);
            // Fallback to localStorage
            return this.loadLayoutFromLocalStorage(layoutId);
        }
    }
    
    /**
     * Get all saved layouts
     */
    async getLayouts() {
        try {
            const response = await fetch('/api/layouts');
            
            if (response.ok) {
                return await response.json();
            } else {
                throw new Error('Failed to get layouts');
            }
        } catch (error) {
            console.error('[LayoutManager] Error getting layouts:', error);
            return this.getLayoutsFromLocalStorage();
        }
    }
    
    /**
     * Delete a layout
     */
    async deleteLayout(layoutId) {
        try {
            const response = await fetch(`/api/layouts/${layoutId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                console.log('[LayoutManager] Layout deleted:', layoutId);
                return true;
            } else {
                throw new Error('Failed to delete layout');
            }
        } catch (error) {
            console.error('[LayoutManager] Error deleting layout:', error);
            return this.deleteLayoutFromLocalStorage(layoutId);
        }
    }
    
    /**
     * Auto-save current layout
     */
    autoSaveLayout() {
        if (this.autoSaveTimeout) {
            clearTimeout(this.autoSaveTimeout);
        }
        
        this.autoSaveTimeout = setTimeout(() => {
            const layout = this.getCurrentLayout();
            this.saveLayoutToLocalStorage(layout);
            console.log('[LayoutManager] Auto-saved layout');
        }, 1000);
    }
    
    /**
     * Load last used layout
     */
    loadLastLayout() {
        const lastLayout = this.loadLayoutFromLocalStorage('last-layout');
        
        if (lastLayout) {
            this.applyLayout(lastLayout);
            console.log('[LayoutManager] Loaded last layout');
        }
    }
    
    /**
     * Reset to default layout
     */
    resetToDefault() {
        this.panels.forEach((config, panelId) => {
            const panel = config.element;
            panel.style.position = '';
            panel.style.width = '';
            panel.style.height = '';
            panel.style.left = '';
            panel.style.top = '';
        });
        
        console.log('[LayoutManager] Reset to default layout');
    }
    
    // LocalStorage fallback methods
    saveLayoutToLocalStorage(layout) {
        try {
            localStorage.setItem('layout-' + layout.id, JSON.stringify(layout));
            localStorage.setItem('last-layout', JSON.stringify(layout));
        } catch (error) {
            console.error('[LayoutManager] Error saving to localStorage:', error);
        }
    }
    
    loadLayoutFromLocalStorage(layoutId) {
        try {
            const data = localStorage.getItem('layout-' + layoutId);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('[LayoutManager] Error loading from localStorage:', error);
            return null;
        }
    }
    
    getLayoutsFromLocalStorage() {
        const layouts = [];
        
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('layout-')) {
                    const data = localStorage.getItem(key);
                    if (data) {
                        layouts.push(JSON.parse(data));
                    }
                }
            }
        } catch (error) {
            console.error('[LayoutManager] Error getting layouts from localStorage:', error);
        }
        
        return layouts;
    }
    
    deleteLayoutFromLocalStorage(layoutId) {
        try {
            localStorage.removeItem('layout-' + layoutId);
            return true;
        } catch (error) {
            console.error('[LayoutManager] Error deleting from localStorage:', error);
            return false;
        }
    }
}

// Global instance
const layoutManager = new WindowLayoutManager();
