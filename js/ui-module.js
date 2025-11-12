/**
 * UI Module - Handles UI interactions and updates
 * Fixed: Notification positioning to center top, not covering integration buttons
 */

const UIModule = (() => {
    const modals = {};
    let notificationTimeout = null;
    let activeNotification = null;

    const init = () => {
        console.log('[UIModule] Initializing...');
        
        // Register modals
        const modalIds = ['manageExtensionsModal', 'getExtensionsModal'];
        modalIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                modals[id] = el;
            } else {
                console.warn(`[UIModule] Modal not found: ${id}`);
            }
        });

        // Add notification styles to document
        addNotificationStyles();
    };

    const addNotificationStyles = () => {
        // Check if styles already exist
        if (document.getElementById('notification-styles')) return;

        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 60px;
                left: 50%;
                transform: translateX(-50%);
                padding: 14px 24px;
                border-radius: 8px;
                z-index: 10000;
                font-size: 14px;
                font-weight: 500;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(10px);
                display: flex;
                align-items: center;
                gap: 10px;
                min-width: 300px;
                max-width: 500px;
                animation: slideDown 0.3s ease-out;
            }

            .notification::before {
                content: '';
                font-size: 18px;
            }

            .notification-info {
                background: rgba(102, 126, 234, 0.95);
                color: white;
                border: 1px solid rgba(102, 126, 234, 0.3);
            }

            .notification-info::before {
                content: 'ℹ️';
            }

            .notification-success {
                background: rgba(76, 175, 80, 0.95);
                color: white;
                border: 1px solid rgba(76, 175, 80, 0.3);
            }

            .notification-success::before {
                content: '✅';
            }

            .notification-error {
                background: rgba(244, 67, 54, 0.95);
                color: white;
                border: 1px solid rgba(244, 67, 54, 0.3);
            }

            .notification-error::before {
                content: '❌';
            }

            .notification-warning {
                background: rgba(255, 152, 0, 0.95);
                color: white;
                border: 1px solid rgba(255, 152, 0, 0.3);
            }

            .notification-warning::before {
                content: '⚠️';
            }

            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }

            @keyframes slideUp {
                from {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
            }

            .notification.hiding {
                animation: slideUp 0.3s ease-out;
            }
        `;
        document.head.appendChild(style);
    };

    const showModal = (modalId) => {
        const modal = modals[modalId] || document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            console.log(`[UIModule] Showing modal: ${modalId}`);
        } else {
            console.warn(`[UIModule] Modal not found: ${modalId}`);
        }
    };

    const hideModal = (modalId) => {
        const modal = modals[modalId] || document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            console.log(`[UIModule] Hiding modal: ${modalId}`);
        } else {
            console.warn(`[UIModule] Modal not found: ${modalId}`);
        }
    };

    const showNotification = (message, type = 'info', duration = 3000) => {
        // Clear any existing notification
        if (activeNotification) {
            clearTimeout(notificationTimeout);
            activeNotification.classList.add('hiding');
            setTimeout(() => {
                if (activeNotification && activeNotification.parentNode) {
                    activeNotification.remove();
                }
            }, 300);
        }
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const messageSpan = document.createElement('span');
        messageSpan.textContent = message;
        notification.appendChild(messageSpan);
        
        document.body.appendChild(notification);
        activeNotification = notification;
        
        notificationTimeout = setTimeout(() => {
            notification.classList.add('hiding');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
                if (activeNotification === notification) {
                    activeNotification = null;
                }
            }, 300);
        }, duration);

        console.log(`[UIModule] Notification (${type}): ${message}`);
    };

    const updateStatus = (message, type = 'info') => {
        const statusLeft = document.querySelector('.status-left');
        if (statusLeft) {
            const statusItem = statusLeft.querySelector('.status-item');
            if (statusItem) {
                const icons = {
                    'info': '🌐',
                    'success': '✅',
                    'error': '❌',
                    'warning': '⚠️'
                };
                statusItem.textContent = `${icons[type] || '🌐'} ${message}`;
                
                const colors = {
                    'info': '#d4d4d4',
                    'success': '#89d185',
                    'error': '#f48771',
                    'warning': '#ffa726'
                };
                statusItem.style.color = colors[type] || '#d4d4d4';
            }
        }
    };

    const toggleDropdown = (menuId, event) => {
        if (event) event.stopPropagation();
        
        const menu = document.getElementById(menuId);
        if (!menu) {
            console.warn(`[UIModule] Dropdown menu not found: ${menuId}`);
            return;
        }

        // Close other dropdowns
        document.querySelectorAll('.dropdown-menu.show').forEach(m => {
            if (m.id !== menuId) {
                m.classList.remove('show');
            }
        });

        menu.classList.toggle('show');
    };

    const closeAllDropdowns = () => {
        document.querySelectorAll('.dropdown-menu.show').forEach(m => {
            m.classList.remove('show');
        });
    };

    const setLoading = (elementId, isLoading) => {
        const el = document.getElementById(elementId);
        if (el) {
            if (isLoading) {
                el.disabled = true;
                el.style.opacity = '0.6';
                el.style.cursor = 'not-allowed';
            } else {
                el.disabled = false;
                el.style.opacity = '1';
                el.style.cursor = 'pointer';
            }
        }
    };

    const hideNotification = () => {
        if (activeNotification) {
            clearTimeout(notificationTimeout);
            activeNotification.classList.add('hiding');
            setTimeout(() => {
                if (activeNotification && activeNotification.parentNode) {
                    activeNotification.remove();
                }
                activeNotification = null;
            }, 300);
        }
    };

    return {
        init,
        showModal,
        hideModal,
        showNotification,
        hideNotification,
        updateStatus,
        toggleDropdown,
        closeAllDropdowns,
        setLoading,
        modals
    };
})();
