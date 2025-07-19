class SelectorCapture {
    constructor() {
        this.selectorOutput = document.getElementById('selectorOutput');
        this.selectorText = document.getElementById('selectorText');
        this.elementInfo = document.getElementById('elementInfo');
        this.copyBtn = document.getElementById('copyBtn');
        this.status = document.getElementById('status');
        
        // Style injection elements
        this.styleInjector = document.getElementById('styleInjector');
        this.styleInput = document.getElementById('styleInput');
        this.applyStylesBtn = document.getElementById('applyStylesBtn');
        this.removeStylesBtn = document.getElementById('removeStylesBtn');
        this.getComputedBtn = document.getElementById('getComputedBtn');
        this.appliedStyles = document.getElementById('appliedStyles');
        this.appliedStylesContent = document.getElementById('appliedStylesContent');
        
        // State
        this.currentSelector = null;
        this.appliedStylesMap = new Map();
        
        // Preset styles
        this.presetStyles = {
            highlight: 'background-color: yellow !important;\nborder: 2px solid orange !important;',
            border: 'border: 3px solid red !important;',
            shadow: 'box-shadow: 0 0 15px rgba(255, 0, 0, 0.7) !important;',
            opacity: 'opacity: 0.5 !important;',
            rotate: 'transform: rotate(5deg) !important;',
            scale: 'transform: scale(1.2) !important;'
        };
        
        this.init();
    }
    
    init() {
        this.copyBtn.addEventListener('click', () => this.copySelector());
        this.applyStylesBtn.addEventListener('click', () => this.applyStyles());
        this.removeStylesBtn.addEventListener('click', () => this.removeAllStyles());
        this.getComputedBtn.addEventListener('click', () => this.getComputedStyles());
        
        // Add preset button listeners
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.applyPresetStyle(e.target.dataset.preset));
        });
        
        this.listenForElementSelection();
    }
    
    listenForElementSelection() {
        // Listen for element selection in DevTools
        chrome.devtools.panels.elements.onSelectionChanged.addListener(() => {
            this.captureSelectedElement();
        });
    }
    
    async captureSelectedElement() {
        try {
            // Evaluate script in the inspected window to get element info
            chrome.devtools.inspectedWindow.eval(`
                (function() {
                    const element = $0; // $0 is the selected element in DevTools
                    if (!element) return null;
                    
                    // Generate comprehensive CSS selector
                    function generateSelector(el) {
                        if (!el || el.nodeType !== 1) return '';
                        
                        // If element has unique ID, use it
                        if (el.id) {
                            return '#' + CSS.escape(el.id);
                        }
                        
                        // Build path from root
                        const path = [];
                        let current = el;
                        
                        while (current && current.nodeType === 1) {
                            let selector = current.tagName.toLowerCase();
                            
                            // Add classes if available
                            if (current.className && typeof current.className === 'string') {
                                const classes = current.className.trim().split(/\\s+/)
                                    .filter(cls => cls.length > 0)
                                    .map(cls => '.' + CSS.escape(cls))
                                    .join('');
                                if (classes) {
                                    selector += classes;
                                }
                            }
                            
                            // Add nth-child if needed for uniqueness
                            const parent = current.parentElement;
                            if (parent) {
                                const siblings = Array.from(parent.children)
                                    .filter(sibling => sibling.tagName === current.tagName);
                                if (siblings.length > 1) {
                                    const index = siblings.indexOf(current) + 1;
                                    selector += ':nth-child(' + index + ')';
                                }
                            }
                            
                            path.unshift(selector);
                            
                            // Stop if we have a unique selector
                            const testSelector = path.join(' > ');
                            if (document.querySelectorAll(testSelector).length === 1) {
                                break;
                            }
                            
                            current = current.parentElement;
                        }
                        
                        return path.join(' > ');
                    }
                    
                    // Add unique identifier for style tracking
                    if (!element.hasAttribute('data-css-selector-ext')) {
                        element.setAttribute('data-css-selector-ext', 'element-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9));
                    }
                    
                    return {
                        tagName: element.tagName.toLowerCase(),
                        id: element.id,
                        className: element.className,
                        textContent: element.textContent ? element.textContent.substring(0, 100) + '...' : '',
                        selector: generateSelector(element),
                        uniqueId: element.getAttribute('data-css-selector-ext'),
                        attributes: Array.from(element.attributes).map(attr => ({
                            name: attr.name,
                            value: attr.value
                        }))
                    };
                })()
            `, (result, isException) => {
                if (isException) {
                    console.error('Error capturing element:', isException);
                    this.showError('Error capturing element selector');
                    return;
                }
                
                if (result) {
                    this.displaySelector(result);
                } else {
                    this.showError('No element selected');
                }
            });
        } catch (error) {
            console.error('Error in captureSelectedElement:', error);
            this.showError('Error capturing element selector');
        }
    }
    
    displaySelector(elementData) {
        this.status.textContent = 'Element captured successfully!';
        this.status.style.color = '#28a745';
        
        // Show element information
        this.elementInfo.innerHTML = `
            <strong>Tag:</strong> ${elementData.tagName}<br>
            ${elementData.id ? `<strong>ID:</strong> ${elementData.id}<br>` : ''}
            ${elementData.className ? `<strong>Classes:</strong> ${elementData.className}<br>` : ''}
            ${elementData.textContent ? `<strong>Text:</strong> ${elementData.textContent}` : ''}
        `;
        
        // Show selector
        this.selectorText.textContent = elementData.selector;
        this.selectorOutput.style.display = 'block';
        this.styleInjector.style.display = 'block';
        
        // Store for copying and styling
        this.currentSelector = elementData.selector;
        this.currentElementId = elementData.uniqueId;
        
        // Update applied styles display
        this.updateAppliedStylesDisplay();
    }
    
    applyPresetStyle(presetName) {
        if (this.presetStyles[presetName]) {
            this.styleInput.value = this.presetStyles[presetName];
            this.applyStyles();
        }
    }
    
    applyStyles() {
        if (!this.currentElementId) {
            this.showError('No element selected');
            return;
        }
        
        const styles = this.styleInput.value.trim();
        if (!styles) {
            this.showError('Please enter some CSS styles');
            return;
        }
        
        // Parse and validate CSS
        const cssRules = this.parseCSS(styles);
        if (cssRules.length === 0) {
            this.showError('Invalid CSS format');
            return;
        }
        
        chrome.devtools.inspectedWindow.eval(`
            (function() {
                const element = document.querySelector('[data-css-selector-ext="${this.currentElementId}"]');
                if (!element) return false;
                
                const styles = ${JSON.stringify(cssRules)};
                styles.forEach(rule => {
                    element.style.setProperty(rule.property, rule.value, rule.priority || '');
                });
                
                return true;
            })()
        `, (result, isException) => {
            if (isException) {
                console.error('Error applying styles:', isException);
                this.showError('Error applying styles');
                return;
            }
            
            if (result) {
                // Store applied styles
                cssRules.forEach(rule => {
                    this.appliedStylesMap.set(rule.property, rule);
                });
                this.updateAppliedStylesDisplay();
                this.status.textContent = 'Styles applied successfully!';
                this.status.style.color = '#28a745';
            } else {
                this.showError('Element not found');
            }
        });
    }
    
    removeAllStyles() {
        if (!this.currentElementId) {
            this.showError('No element selected');
            return;
        }
        
        chrome.devtools.inspectedWindow.eval(`
            (function() {
                const element = document.querySelector('[data-css-selector-ext="${this.currentElementId}"]');
                if (!element) return false;
                
                // Remove all inline styles that were applied
                const stylesToRemove = ${JSON.stringify(Array.from(this.appliedStylesMap.keys()))};
                stylesToRemove.forEach(property => {
                    element.style.removeProperty(property);
                });
                
                return true;
            })()
        `, (result, isException) => {
            if (isException) {
                console.error('Error removing styles:', isException);
                this.showError('Error removing styles');
                return;
            }
            
            if (result) {
                this.appliedStylesMap.clear();
                this.updateAppliedStylesDisplay();
                this.status.textContent = 'All styles removed!';
                this.status.style.color = '#28a745';
            } else {
                this.showError('Element not found');
            }
        });
    }
    
    getComputedStyles() {
        if (!this.currentElementId) {
            this.showError('No element selected');
            return;
        }
        
        chrome.devtools.inspectedWindow.eval(`
            (function() {
                const element = document.querySelector('[data-css-selector-ext="${this.currentElementId}"]');
                if (!element) return null;
                
                const computed = window.getComputedStyle(element);
                const importantStyles = [
                    'display', 'position', 'top', 'right', 'bottom', 'left',
                    'width', 'height', 'margin', 'padding', 'border',
                    'background-color', 'color', 'font-size', 'font-family',
                    'text-align', 'transform', 'opacity', 'z-index'
                ];
                
                const styles = {};
                importantStyles.forEach(prop => {
                    const value = computed.getPropertyValue(prop);
                    if (value && value !== 'auto' && value !== 'none' && value !== 'normal') {
                        styles[prop] = value;
                    }
                });
                
                return styles;
            })()
        `, (result, isException) => {
            if (isException) {
                console.error('Error getting computed styles:', isException);
                this.showError('Error getting computed styles');
                return;
            }
            
            if (result) {
                const cssText = Object.entries(result)
                    .map(([prop, value]) => `${prop}: ${value};`)
                    .join('\n');
                this.styleInput.value = cssText;
                this.status.textContent = 'Computed styles loaded!';
                this.status.style.color = '#28a745';
            } else {
                this.showError('Element not found');
            }
        });
    }
    
    parseCSS(cssText) {
        const rules = [];
        const lines = cssText.split('\n');
        
        lines.forEach(line => {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.includes(':')) return;
            
            const colonIndex = trimmed.indexOf(':');
            let property = trimmed.substring(0, colonIndex).trim();
            let value = trimmed.substring(colonIndex + 1).trim();
            
            // Remove semicolon if present
            if (value.endsWith(';')) {
                value = value.slice(0, -1);
            }
            
            // Check for !important
            let priority = '';
            if (value.includes('!important')) {
                priority = 'important';
                value = value.replace('!important', '').trim();
            }
            
            if (property && value) {
                rules.push({ property, value, priority });
            }
        });
        
        return rules;
    }
    
    updateAppliedStylesDisplay() {
        if (this.appliedStylesMap.size === 0) {
            this.appliedStyles.style.display = 'none';
            return;
        }
        
        const stylesText = Array.from(this.appliedStylesMap.values())
            .map(rule => `${rule.property}: ${rule.value}${rule.priority ? ' !important' : ''};`)
            .join('\n');
        
        this.appliedStylesContent.textContent = stylesText;
        this.appliedStyles.style.display = 'block';
    }
    
    showError(message) {
        this.status.textContent = message;
        this.status.style.color = '#dc3545';
        this.selectorOutput.style.display = 'none';
        this.styleInjector.style.display = 'none';
    }
    
    async copySelector() {
        if (!this.currentSelector) return;
        
        try {
            await navigator.clipboard.writeText(this.currentSelector);
            this.copyBtn.textContent = 'Copied!';
            this.copyBtn.style.background = '#28a745';
            
            setTimeout(() => {
                this.copyBtn.textContent = 'Copy Selector';
                this.copyBtn.style.background = '#007acc';
            }, 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = this.currentSelector;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            this.copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                this.copyBtn.textContent = 'Copy Selector';
            }, 2000);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SelectorCapture();
});