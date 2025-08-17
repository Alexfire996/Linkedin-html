# Alex Zhang - Personal Portfolio Website

A modern, interactive portfolio website with AI chat functionality and community features.

## 🚀 Features

- **🤖 AI Chat Interface**: Interactive chat powered by GPT-4 to discuss Alex's experiences
- **🔐 Firebase Authentication**: Secure user authentication with email/password and Google OAuth
- **💬 Community Comments**: Real-time commenting system with like functionality
- **🎨 Space-themed Design**: Modern UI with smooth animations and responsive layout
- **🎵 Background Music**: Interactive music player with "Shadow Grip"
- **📱 Responsive**: Works beautifully on desktop, tablet, and mobile
- **🌟 Interactive Navigation**: Smooth transitions between sections

## 🛠️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Alexfire996/Linkedin-html.git
cd Linkedin-html
```

### 2. Configure API Keys
1. Copy the example config file:
   ```bash
   cp config.example.js config.js
   ```

2. Edit `config.js` and add your OpenAI API key:
   ```javascript
   window.OPENAI_API_KEY = 'your-openai-api-key-here';
   ```

### 3. Firebase Setup
The Firebase configuration is already included in the code. The project uses:
- Firebase Authentication for user management
- Firestore for real-time comments storage

### 4. Run Locally
Start a local server (Python 3 required):
```bash
# Using the included server script
python3 server.py

# Or using Python's built-in server
python3 -m http.server 8080
```

Visit `http://localhost:8080` to view the website.

## 📁 Project Structure

```
├── index.html                 # Main HTML file
├── styles.css                 # All CSS styles
├── script.js                  # Original functionality (navigation, music, etc.)
├── auth-integrated.js         # Firebase authentication system
├── ai-chat-integrated.js      # AI chat interface with GPT-4
├── comments-integrated.js     # Real-time comments system
├── config.js                  # Local configuration (ignored by git)
├── config.example.js          # Example configuration file
├── server.py                  # Local development server
└── README.md                  # This file
```

## 🔧 Configuration

### OpenAI API Key
To enable the AI chat functionality:
1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Add it to your `config.js` file
3. The chat will automatically use GPT-4 for responses

### Firebase Configuration
The Firebase project is already configured. If you want to use your own Firebase project:
1. Create a new Firebase project
2. Enable Authentication and Firestore
3. Update the Firebase configuration in `index.html`

## 🌐 Deployment

The website can be deployed to any static hosting service:

- **Vercel**: Connect your GitHub repository for automatic deployments
- **Netlify**: Drag and drop the files or connect via GitHub
- **GitHub Pages**: Enable in repository settings
- **Firebase Hosting**: Use Firebase CLI to deploy

For production deployment, make sure to:
1. Set up environment variables for API keys
2. Configure proper CORS settings
3. Enable Firebase security rules

## 🔒 Security Notes

- The `config.js` file is ignored by git to prevent API keys from being committed
- OpenAI API key should be stored securely in production
- Firebase security rules should be configured for production use

## 📱 Features Overview

### Authentication System
- Email/password registration and login
- Google OAuth integration
- User session management
- Secure sign-out functionality

### AI Chat
- GPT-4 powered conversations about Alex's experiences
- Context-aware responses about different countries and companies
- Fallback responses when API is not available
- Chat history management

### Comments System
- Real-time commenting with Firestore
- Like/unlike functionality
- User authentication required
- Responsive comment display

### UI/UX
- Space-themed design with animations
- Responsive mobile layout
- Smooth transitions and hover effects
- Music player controls

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project as inspiration for your own portfolio!

## 🔗 Links

- [Live Website](https://linkedin-html-alexfire996.vercel.app/)
- [GitHub Repository](https://github.com/Alexfire996/Linkedin-html)
- [Alex's LinkedIn](https://www.linkedin.com/in/alexzhang-7173a6174)

---

Built with ❤️ using HTML, CSS, JavaScript, Firebase, and OpenAI GPT-4.