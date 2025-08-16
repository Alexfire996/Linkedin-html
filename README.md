# Alex Zhang - Personal Website

A minimalistic personal landing page with a warm aesthetic, featuring interactive sections and background music.

## Features

- 🎨 **Minimalistic Design**: Clean, warm aesthetic with smooth animations
- 📱 **Responsive**: Works beautifully on desktop, tablet, and mobile
- 🎵 **Background Music**: "Dialtone" by Hotel Apache (add your own audio file)
- 🔄 **Interactive Navigation**: Smooth transitions between sections
- 🌟 **Special Effects**: Hover animations, parallax scrolling, and Easter eggs
- 🎯 **Sections**: About, Experience, Education, Skills, and Contact

## Quick Start

### Option 1: Python Server (Recommended)
```bash
# Make sure you're in the website directory
cd "/Applications/Alex's app"

# Run the server
python3 server.py
```

### Option 2: Node.js Server
```bash
# Install a simple HTTP server globally
npm install -g http-server

# Run the server
http-server -p 8000 -o
```

### Option 3: VS Code Live Server
1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## Adding Music

To enable the background music feature:

1. Download "Dialtone" by Hotel Apache (or any .mp3 file you prefer)
2. Rename the file to `dialtone.mp3`
3. Place it in the same directory as your website files
4. The music controls will automatically work

**Note**: Due to browser autoplay policies, users need to click the music button to start playback.

## Customization

### Personal Information
Edit the content in `index.html` to match your personal information:
- Name and tagline in the hero section
- About section description
- Experience and education details
- Skills and technologies
- Contact information and links

### Colors and Styling
Modify the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #2c3e50;
    --secondary-color: #e67e22;
    --warm-orange: #f39c12;
    /* ... other colors */
}
```

### Sections
You can add new sections by:
1. Adding a new navigation button in the HTML
2. Creating a corresponding section element
3. Adding the navigation logic in `script.js`

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Responsive design works on all modern mobile browsers

## File Structure

```
/Applications/Alex's app/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and animations
├── script.js           # JavaScript functionality
├── server.py           # Local development server
├── dialtone.mp3        # Background music (add this file)
└── README.md           # This file
```

## Features Breakdown

### Interactive Elements
- **Navigation**: Click buttons to switch between sections
- **Music Control**: Toggle background music on/off
- **Hover Effects**: Elements respond to mouse interactions
- **Animations**: Smooth transitions and loading effects

### Responsive Design
- **Desktop**: Full-width layout with optimal spacing
- **Tablet**: Adjusted navigation and content sizing
- **Mobile**: Stacked layout with touch-friendly controls

### Accessibility
- Keyboard navigation support
- Screen reader friendly structure
- High contrast ratios
- Proper semantic HTML

## Development

To make changes:
1. Edit the HTML, CSS, or JavaScript files
2. Refresh your browser to see changes
3. The Python server will automatically serve updated files

## Deployment

For production deployment, you can:
1. Upload files to any web hosting service
2. Use GitHub Pages for free hosting
3. Deploy to Netlify, Vercel, or similar platforms

---

Built with ❤️ for Alex Zhang