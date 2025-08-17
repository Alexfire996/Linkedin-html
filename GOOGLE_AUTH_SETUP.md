# Google Authentication Setup Guide

If you're experiencing issues with Google sign-in (like the "An error occurred. Please try again." message), it's likely because Google OAuth isn't properly configured for your domain.

## 🔧 How to Fix Google Authentication

### Option 1: Configure Firebase Google Authentication (Recommended)

1. **Go to Firebase Console**: Visit [Firebase Console](https://console.firebase.google.com/)

2. **Select your project**: Choose the `alex2-b07a9` project (or your own if you're using a different Firebase project)

3. **Enable Google Authentication**:
   - Go to **Authentication** > **Sign-in method**
   - Find **Google** in the providers list
   - Click **Enable**
   - Add your domain to the **Authorized domains** list:
     - For local development: `localhost`
     - For production: your actual domain (e.g., `your-domain.com`)

4. **Configure OAuth consent screen** (if using your own Firebase project):
   - Go to Google Cloud Console
   - Navigate to APIs & Credentials > OAuth consent screen
   - Configure the app information and add your domain

### Option 2: Use Email/Password Authentication Only

If you prefer to disable Google authentication temporarily:

1. **Hide Google buttons** by adding this CSS:
```css
.google-btn {
    display: none !important;
}
.auth-divider {
    display: none !important;
}
```

2. **Users can still create accounts** using email and password, which works perfectly.

## 🌐 Domain Authorization

For Google sign-in to work, your domain must be authorized. Common domains that need to be added:

- **Local development**: `localhost`, `127.0.0.1`
- **GitHub Pages**: `your-username.github.io`
- **Vercel**: `your-app.vercel.app`
- **Netlify**: `your-app.netlify.app`
- **Custom domain**: `your-domain.com`

## 🛠️ Troubleshooting

### Error: "This domain is not authorized"
- Add your domain to Firebase Authentication > Settings > Authorized domains

### Error: "Popup blocked"
- The system will automatically try redirect method as fallback
- Users should allow popups for your site

### Error: "Google sign-in is not enabled"
- Enable Google provider in Firebase Console
- Make sure your Firebase configuration is correct

## ✅ Testing

To test if Google authentication is working:

1. Open browser developer console (F12)
2. Try to sign in with Google
3. Check console for detailed error messages
4. Look for specific error codes like:
   - `auth/unauthorized-domain`
   - `auth/operation-not-allowed`
   - `auth/popup-blocked`

## 📝 Alternative: Email Authentication Works Perfectly

Even if Google sign-in isn't working, users can still:
- ✅ Create accounts with email/password
- ✅ Sign in with email/password  
- ✅ Access all features (AI chat, comments, likes)
- ✅ Full functionality without Google

The email authentication is fully functional and doesn't require any additional setup!