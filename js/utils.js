/**
 * Utils - Utility functions
 */

const Utils = (() => {
    const debounce = (fn, delay) => {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn(...args), delay);
        };
    };

    const throttle = (fn, delay) => {
        let lastCall = 0;
        return function(...args) {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                fn(...args);
            }
        };
    };

    const formatText = (text) => {
        if (!text) return '';
        return text.trim();
    };

    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    const generateId = () => {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    };

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    const clone = (obj) => {
        return JSON.parse(JSON.stringify(obj));
    };

    return {
        debounce,
        throttle,
        formatText,
        escapeHtml,
        generateId,
        sleep,
    /**
     * Sanitize HTML to prevent XSS attacks
     * @param {string} html - HTML string to sanitize
     * @returns {string} Sanitized HTML
     */
    sanitizeHTML: (html) => {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    },

    /**
     * Safely set innerHTML with sanitization
     * @param {HTMLElement} element - Element to update
     * @param {string} html - HTML content to set
     */
    setInnerHTML: (element, html) => {
        if (!element) return;
        const div = document.createElement('div');
        div.textContent = html;
        element.innerHTML = div.innerHTML;
    },

        clone
    };
})();
