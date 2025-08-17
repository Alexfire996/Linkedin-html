class AuthManager {
    constructor() {
        this.currentUser = null;
        this.authModal = null;
        this.auth = window.firebaseAuth;
        this.services = window.firebaseServices;
        this.init();
    }

    init() {
        this.createAuthModal();
        this.setupAuthStateListener();
        this.setupAuthUI();
    }

    createAuthModal() {
        const modalHTML = `
            <div id="authModal" class="auth-modal" style="display: none;">
                <div class="auth-modal-content">
                    <span class="auth-close">&times;</span>
                    <div class="auth-container">
                        <div class="auth-tabs">
                            <button class="auth-tab active" data-tab="signin">Sign In</button>
                            <button class="auth-tab" data-tab="signup">Sign Up</button>
                        </div>
                        
                        <div id="signin-form" class="auth-form active">
                            <h3>Welcome Back</h3>
                            <form id="signin">
                                <input type="email" id="signin-email" placeholder="Email" required>
                                <input type="password" id="signin-password" placeholder="Password" required>
                                <button type="submit" class="auth-btn">Sign In</button>
                            </form>
                            <div class="auth-divider">or</div>
                            <button id="google-signin" class="google-btn">
                                <span class="google-icon">G</span>
                                Continue with Google
                            </button>
                        </div>
                        
                        <div id="signup-form" class="auth-form">
                            <h3>Join the Community</h3>
                            <form id="signup">
                                <input type="email" id="signup-email" placeholder="Email" required>
                                <input type="password" id="signup-password" placeholder="Password (min 6 characters)" required>
                                <input type="password" id="signup-confirm" placeholder="Confirm Password" required>
                                <button type="submit" class="auth-btn">Sign Up</button>
                            </form>
                            <div class="auth-divider">or</div>
                            <button id="google-signup" class="google-btn">
                                <span class="google-icon">G</span>
                                Continue with Google
                            </button>
                        </div>
                        
                        <div id="auth-error" class="auth-error"></div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.authModal = document.getElementById('authModal');
        this.setupModalEvents();
    }

    setupModalEvents() {
        const closeBtn = document.querySelector('.auth-close');
        const authTabs = document.querySelectorAll('.auth-tab');
        const signinForm = document.getElementById('signin');
        const signupForm = document.getElementById('signup');
        const googleSigninBtn = document.getElementById('google-signin');
        const googleSignupBtn = document.getElementById('google-signup');

        closeBtn.addEventListener('click', () => this.closeModal());
        
        window.addEventListener('click', (e) => {
            if (e.target === this.authModal) {
                this.closeModal();
            }
        });

        authTabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
        });

        signinForm.addEventListener('submit', (e) => this.handleSignIn(e));
        signupForm.addEventListener('submit', (e) => this.handleSignUp(e));
        googleSigninBtn.addEventListener('click', () => this.handleGoogleAuth());
        googleSignupBtn.addEventListener('click', () => this.handleGoogleAuth());
    }

    setupAuthStateListener() {
        this.services.onAuthStateChanged(this.auth, (user) => {
            this.currentUser = user;
            this.updateAuthUI();
        });
    }

    setupAuthUI() {
        // Add auth button to header
        const heroContent = document.querySelector('.hero-content');
        const authButton = document.createElement('button');
        authButton.id = 'authButton';
        authButton.className = 'auth-header-btn';
        authButton.textContent = 'Sign In';
        heroContent.appendChild(authButton);

        authButton.addEventListener('click', () => {
            if (this.currentUser) {
                this.handleSignOut();
            } else {
                this.openModal();
            }
        });
    }

    updateAuthUI() {
        const authButton = document.getElementById('authButton');
        if (this.currentUser) {
            authButton.textContent = 'Sign Out';
            authButton.classList.add('signed-in');
            this.showUserInfo();
        } else {
            authButton.textContent = 'Sign In';
            authButton.classList.remove('signed-in');
            this.hideUserInfo();
        }
    }

    showUserInfo() {
        let userInfo = document.getElementById('userInfo');
        if (!userInfo) {
            userInfo = document.createElement('div');
            userInfo.id = 'userInfo';
            userInfo.className = 'user-info';
            document.querySelector('.hero-content').appendChild(userInfo);
        }
        
        const email = this.currentUser.email;
        const displayName = this.currentUser.displayName || email.split('@')[0];
        userInfo.innerHTML = `
            <span class="user-avatar">👤</span>
            <span class="user-name">Welcome, ${displayName}</span>
        `;
    }

    hideUserInfo() {
        const userInfo = document.getElementById('userInfo');
        if (userInfo) {
            userInfo.remove();
        }
    }

    openModal() {
        this.authModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.authModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        this.clearErrors();
    }

    switchTab(tab) {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
        
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        document.getElementById(`${tab}-form`).classList.add('active');
        this.clearErrors();
    }

    async handleSignIn(e) {
        e.preventDefault();
        const email = document.getElementById('signin-email').value;
        const password = document.getElementById('signin-password').value;

        try {
            await this.services.signInWithEmailAndPassword(this.auth, email, password);
            this.closeModal();
            this.showSuccess('Successfully signed in!');
        } catch (error) {
            this.showError(this.getErrorMessage(error.code));
        }
    }

    async handleSignUp(e) {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm').value;

        if (password !== confirmPassword) {
            this.showError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            this.showError('Password must be at least 6 characters');
            return;
        }

        try {
            await this.services.createUserWithEmailAndPassword(this.auth, email, password);
            this.closeModal();
            this.showSuccess('Account created successfully!');
        } catch (error) {
            this.showError(this.getErrorMessage(error.code));
        }
    }

    async handleGoogleAuth() {
        const provider = new this.services.GoogleAuthProvider();
        try {
            await this.services.signInWithPopup(this.auth, provider);
            this.closeModal();
            this.showSuccess('Successfully signed in with Google!');
        } catch (error) {
            this.showError(this.getErrorMessage(error.code));
        }
    }

    async handleSignOut() {
        try {
            await this.services.signOut(this.auth);
            this.showSuccess('Successfully signed out!');
        } catch (error) {
            this.showError('Error signing out');
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('auth-error');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }

    clearErrors() {
        const errorDiv = document.getElementById('auth-error');
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
    }

    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(46, 204, 113, 0.95);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 1003;
            font-family: 'Inter', sans-serif;
        `;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 3000);
    }

    getErrorMessage(errorCode) {
        const errorMessages = {
            'auth/email-already-in-use': 'Email is already registered',
            'auth/weak-password': 'Password is too weak',
            'auth/user-not-found': 'No account found with this email',
            'auth/wrong-password': 'Incorrect password',
            'auth/invalid-email': 'Invalid email address',
            'auth/too-many-requests': 'Too many failed attempts. Try again later',
            'auth/popup-closed-by-user': 'Sign-in popup was closed',
            'auth/cancelled-popup-request': 'Sign-in was cancelled'
        };
        
        return errorMessages[errorCode] || 'An error occurred. Please try again.';
    }

    requireAuth(callback) {
        if (this.currentUser) {
            callback();
        } else {
            this.openModal();
            this.showError('Please sign in to continue');
        }
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Export for use in other modules
window.authManager = authManager;