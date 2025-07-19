(function() {
    'use strict';
    
    // This content script helps with communication between the page and extension
    let isExtensionActive = false;
    
    // Listen for messages from the extension
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'captureElement') {
            // This could be used for additional functionality if needed
            sendResponse({success: true});
        }
    });
    
    // Inject selector generator utility
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('selector-generator.js');
    (document.head || document.documentElement).appendChild(script);
    script.onload = function() {
        script.remove();
    };
})();