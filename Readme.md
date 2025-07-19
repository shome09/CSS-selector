# 🎯 CSS Selector Capture & Style Injector

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Extension-blue?logo=google-chrome)](https://chrome.google.com/webstore)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](https://github.com/shome09/css-selector)

A powerful Chrome DevTools extension that automatically captures CSS selectors of DOM elements and provides real-time style injection capabilities. Perfect for developers, designers, and anyone working with CSS.

## ✨ Features

### 🎯 CSS Selector Generation
- **Smart Selector Generation**: Creates optimal CSS selectors using multiple strategies
- **Unique ID Detection**: Prioritizes unique IDs when available
- **Hierarchical Path Building**: Builds parent-to-child paths with classes and nth-child selectors
- **Selector Validation**: Ensures generated selectors are unique and accurate
- **One-Click Copy**: Copy selectors to clipboard instantly

### 🎨 Style Injection
- **Real-Time Style Application**: Apply CSS styles directly to selected elements
- **Preset Quick Styles**: 6 built-in preset styles for common effects
- **Custom CSS Input**: Write and apply any CSS properties
- **Style Tracking**: Monitor which styles are currently applied
- **Batch Style Removal**: Remove all applied styles with one click
- **Computed Style Loading**: Load existing element styles for modification

### 🔧 Developer Tools Integration
- **Native DevTools Integration**: Seamlessly integrates with Chrome DevTools
- **Element Panel Sync**: Automatically captures elements selected in the Elements panel
- **Professional UI**: Clean, intuitive interface matching DevTools design
- **Real-Time Feedback**: Immediate status updates and error handling

## 🚀 Installation



### Manual Installation (Development)
1. **Download the extension**:
   ```bash
   git clone https://github.com/shome09/css-selector.git
   cd css-selector
   ```

2. **Load in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the extension directory

3. **Start using**:
   - Open any webpage
   - Open DevTools (F12)
   - Look for the new "CSS Selector" tab

## 📖 Usage Guide

### Basic Selector Capture
1. Open Chrome DevTools (`F12` or right-click → Inspect)
2. Navigate to the **"CSS Selector"** tab
3. Click any element in the **Elements panel** or use the element picker
4. The CSS selector appears automatically
5. Click **"Copy Selector"** to copy to clipboard

### Style Injection Workflow
1. **Select an element** using the steps above
2. **Choose a method**:
   - Click a **preset button** for quick effects
   - Write **custom CSS** in the text area
   - Load **computed styles** to modify existing styles
3. Click **"Apply Styles"** to see changes instantly
4. Use **"Remove All Styles"** to reset the element

### Preset Styles Available
- **🟡 Highlight**: Yellow background with orange border
- **🔴 Red Border**: Prominent red border outline
- **✨ Box Shadow**: Red glowing shadow effect
- **👻 Semi-transparent**: 50% opacity effect
- **🔄 Rotate**: 5-degree rotation transform
- **📈 Scale Up**: 120% scale transform

## 🛠️ Technical Details

### File Structure
```
css-selector/
├── manifest.json          # Extension configuration
├── devtools.html          # DevTools page entry point
├── devtools.js            # DevTools panel creation
├── panel.html             # Main extension interface
├── panel.js               # Core functionality and logic
├── content.js             # Content script for page interaction
├── selector-generator.js  # CSS selector generation utilities
└── popup.html             # Extension popup interface
```

### Key Technologies
- **Chrome Extensions API**: Manifest V3 compliance
- **DevTools API**: Native integration with Chrome DevTools
- **CSS.escape()**: Secure CSS selector generation
- **DOM Manipulation**: Real-time style injection
- **Modern JavaScript**: ES6+ features and best practices

### Selector Generation Algorithm
1. **ID Strategy**: Check for unique element IDs
2. **Data Attribute Strategy**: Utilize data-* attributes
3. **Hierarchical Strategy**: Build parent-child relationships
4. **Class Strategy**: Include relevant CSS classes
5. **Position Strategy**: Add nth-child when needed for uniqueness
6. **Validation**: Ensure selector matches only target element

## 🎮 Demo

### Before Selection
```
Status: Click on an element in the page to capture its CSS selector
```

### After Selection
```css
/* Generated Selector */
div.container > section.content:nth-child(2) > article.post

/* Applied Styles */
background-color: yellow !important;
border: 2px solid orange !important;
transform: scale(1.1);
```

## 🔧 Development

### Prerequisites
- Chrome Browser (version 88+)
- Basic knowledge of JavaScript and CSS
- Chrome Extensions development experience (optional)

### Local Development
1. **Clone the repository**:
   ```bash
   git clone https://github.com/shome09/css-selector.git
   ```

2. **Make your changes** to the relevant files

3. **Test the extension**:
   - Load the unpacked extension in Chrome
   - Open DevTools and test functionality
   - Check the console for any errors

4. **Debug issues**:
   - Use `chrome://extensions/` to view extension errors
   - Check DevTools console for runtime errors
   - Test on multiple websites

### Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Permissions Explained

| Permission | Purpose |
|------------|---------|
| `activeTab` | Access current tab for element selection |
| `scripting` | Inject scripts for style manipulation |
| `devtools_page` | Create DevTools panel integration |

## 🐛 Known Issues & Limitations

- **Dynamic Content**: May need re-selection after DOM changes
- **Shadow DOM**: Limited support for elements within Shadow DOM
- **Protected Pages**: Cannot inject styles on chrome:// pages
- **Complex Selectors**: Very deep nested elements may generate long selectors

## 🔮 Roadmap

- [ ] **CSS Animation Presets**: Add keyframe animation options
- [ ] **Style Export**: Save applied styles as CSS files
- [ ] **Selector History**: Keep track of recently generated selectors
- [ ] **Custom Preset Manager**: Allow users to create custom presets
- [ ] **Responsive Testing**: Quick viewport size adjustments
- [ ] **Color Picker Integration**: Visual color selection tools

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Chrome DevTools team for excellent APIs
- Web development community for feedback and inspiration
- CSS Working Group for standardizing selector specifications

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/shome09/css-selector/issues)
- **Discussions**: [GitHub Discussions](https://github.com/shome09/css-selector/discussions)
- **Email**: debjit.shome99@gmail.com

---

<div align="center">

**Made with ❤️ for the web development community and people like me who struggle with CSS :D**

[⭐ Star this repo](https://github.com/shome09/css-selector) | [🐛 Report Bug](https://github.com/shome09/css-selector/issues) | [💡 Request Feature](https://github.com/shome09/css-selector/issues)

</div>