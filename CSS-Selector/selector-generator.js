window.SelectorGenerator = {
    generate: function(element) {
        if (!element || element.nodeType !== 1) return '';
        
        // Strategy 1: Use ID if unique
        if (element.id) {
            const idSelector = '#' + CSS.escape(element.id);
            if (document.querySelectorAll(idSelector).length === 1) {
                return idSelector;
            }
        }
        
        // Strategy 2: Use data attributes if available
        const dataAttrs = Array.from(element.attributes)
            .filter(attr => attr.name.startsWith('data-') && attr.value)
            .map(attr => `[${attr.name}="${CSS.escape(attr.value)}"]`);
        
        if (dataAttrs.length > 0) {
            const dataSelector = element.tagName.toLowerCase() + dataAttrs.join('');
            if (document.querySelectorAll(dataSelector).length === 1) {
                return dataSelector;
            }
        }
        
        // Strategy 3: Build hierarchical path
        return this.buildPath(element);
    },
    
    buildPath: function(element) {
        const path = [];
        let current = element;
        
        while (current && current.nodeType === 1 && current !== document.body) {
            let selector = this.getElementSelector(current);
            
            // Add position if needed for uniqueness
            const parent = current.parentElement;
            if (parent && this.needsPosition(current, selector)) {
                const position = this.getElementPosition(current);
                selector += `:nth-child(${position})`;
            }
            
            path.unshift(selector);
            
            // Test if current path is unique
            const testSelector = path.join(' > ');
            if (document.querySelectorAll(testSelector).length === 1) {
                break;
            }
            
            current = current.parentElement;
        }
        
        return path.join(' > ');
    },
    
    getElementSelector: function(element) {
        let selector = element.tagName.toLowerCase();
        
        // Add classes
        if (element.className && typeof element.className === 'string') {
            const classes = element.className.trim().split(/\s+/)
                .filter(cls => cls.length > 0 && /^[a-zA-Z][\w-]*$/.test(cls))
                .map(cls => '.' + CSS.escape(cls))
                .join('');
            selector += classes;
        }
        
        // Add other unique attributes
        const uniqueAttrs = ['name', 'type', 'role'].filter(attr => 
            element.hasAttribute(attr) && element.getAttribute(attr)
        );
        
        uniqueAttrs.forEach(attr => {
            selector += `[${attr}="${CSS.escape(element.getAttribute(attr))}"]`;
        });
        
        return selector;
    },
    
    needsPosition: function(element, selector) {
        const parent = element.parentElement;
        if (!parent) return false;
        
        const siblings = Array.from(parent.children)
            .filter(sibling => this.getElementSelector(sibling) === selector);
        
        return siblings.length > 1;
    },
    
    getElementPosition: function(element) {
        const parent = element.parentElement;
        if (!parent) return 1;
        
        return Array.from(parent.children).indexOf(element) + 1;
    }
};