class CommentSystem {
    constructor() {
        this.comments = [];
        this.unsubscribe = null;
        this.db = window.firebaseDb;
        this.services = window.firebaseServices;
        this.init();
    }

    init() {
        this.createCommentSection();
        this.setupEventListeners();
        this.loadComments();
    }

    createCommentSection() {
        const commentHTML = `
            <section id="comments" class="comments-section">
                <div class="section-content">
                    <h2>Community Comments</h2>
                    <p class="comments-intro">Share your thoughts about Alex's journey or ask questions for the community!</p>
                    
                    <div class="comment-form-container">
                        <form id="comment-form" class="comment-form">
                            <div class="form-group">
                                <textarea 
                                    id="comment-text" 
                                    placeholder="Share your thoughts or ask a question..."
                                    rows="3"
                                    maxlength="500"
                                    disabled
                                ></textarea>
                                <div class="char-count">
                                    <span id="char-count">0</span>/500
                                </div>
                            </div>
                            <div class="form-actions">
                                <button type="submit" id="submit-comment" class="comment-btn" disabled>
                                    Post Comment
                                </button>
                            </div>
                        </form>
                        
                        <div class="auth-required-comment" id="comment-auth-required">
                            <div class="auth-prompt">
                                <span class="lock-icon">🔒</span>
                                <p>Sign in to join the conversation</p>
                                <button id="comment-auth-btn" class="auth-btn-small">Sign In</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="comments-list" id="comments-list">
                        <div class="loading-comments">
                            <div class="loading-spinner"></div>
                            <p>Loading comments...</p>
                        </div>
                    </div>
                </div>
            </section>
        `;

        // Insert before the closing main tag
        const mainElement = document.querySelector('main .sections');
        mainElement.insertAdjacentHTML('beforeend', commentHTML);
        
        // Add comments navigation button
        const navigation = document.querySelector('.navigation');
        const commentsNavBtn = document.createElement('button');
        commentsNavBtn.className = 'nav-btn';
        commentsNavBtn.setAttribute('data-section', 'comments');
        commentsNavBtn.textContent = 'Comments';
        navigation.appendChild(commentsNavBtn);
        
        // Update navigation functionality
        this.updateNavigation();
    }

    updateNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        const sections = document.querySelectorAll('.section');
        
        navButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetSection = this.getAttribute('data-section');
                
                // Remove active class from all buttons and sections
                navButtons.forEach(btn => btn.classList.remove('active'));
                sections.forEach(section => section.classList.remove('active'));
                
                // Add active class to clicked button and corresponding section
                this.classList.add('active');
                const targetElement = document.getElementById(targetSection);
                if (targetElement) {
                    targetElement.classList.add('active');
                }
            });
        });
    }

    setupEventListeners() {
        const commentForm = document.getElementById('comment-form');
        const commentText = document.getElementById('comment-text');
        const charCount = document.getElementById('char-count');
        const commentAuthBtn = document.getElementById('comment-auth-btn');

        commentForm.addEventListener('submit', (e) => this.handleSubmitComment(e));
        
        commentText.addEventListener('input', (e) => {
            const length = e.target.value.length;
            charCount.textContent = length;
            charCount.style.color = length > 450 ? '#e74c3c' : '#666';
        });

        commentAuthBtn.addEventListener('click', () => {
            if (window.authManager) {
                window.authManager.openModal();
            }
        });

        // Listen for auth state changes
        if (window.authManager) {
            this.checkAuthState();
            setInterval(() => this.checkAuthState(), 1000);
        }
    }

    checkAuthState() {
        const user = window.authManager?.getCurrentUser();
        const commentText = document.getElementById('comment-text');
        const submitBtn = document.getElementById('submit-comment');
        const authRequired = document.getElementById('comment-auth-required');

        if (user) {
            commentText.disabled = false;
            submitBtn.disabled = false;
            authRequired.style.display = 'none';
            commentText.placeholder = "Share your thoughts or ask a question...";
        } else {
            commentText.disabled = true;
            submitBtn.disabled = true;
            authRequired.style.display = 'block';
            commentText.placeholder = "Sign in to post a comment...";
        }
    }

    async handleSubmitComment(e) {
        e.preventDefault();
        
        const user = window.authManager?.getCurrentUser();
        if (!user) {
            window.authManager?.openModal();
            return;
        }

        const commentText = document.getElementById('comment-text');
        const submitBtn = document.getElementById('submit-comment');
        const text = commentText.value.trim();

        if (!text) return;

        // Disable form while submitting
        submitBtn.disabled = true;
        submitBtn.textContent = 'Posting...';

        try {
            await this.services.addDoc(this.services.collection(this.db, 'comments'), {
                text: text,
                authorId: user.uid,
                authorName: user.displayName || user.email.split('@')[0],
                authorEmail: user.email,
                timestamp: this.services.serverTimestamp(),
                likes: 0,
                likedBy: []
            });

            // Reset form
            commentText.value = '';
            document.getElementById('char-count').textContent = '0';
            this.showSuccess('Comment posted successfully!');

        } catch (error) {
            console.error('Error posting comment:', error);
            this.showError('Failed to post comment. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Post Comment';
        }
    }

    loadComments() {
        const q = this.services.query(
            this.services.collection(this.db, 'comments'), 
            this.services.orderBy('timestamp', 'desc')
        );
        
        this.unsubscribe = this.services.onSnapshot(q, (snapshot) => {
            this.comments = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            this.renderComments();
        }, (error) => {
            console.error('Error loading comments:', error);
            this.showError('Failed to load comments');
            this.renderComments(); // Show empty state
        });
    }

    renderComments() {
        const commentsList = document.getElementById('comments-list');
        
        if (this.comments.length === 0) {
            commentsList.innerHTML = `
                <div class="no-comments">
                    <div class="no-comments-icon">💬</div>
                    <h3>No comments yet</h3>
                    <p>Be the first to share your thoughts about Alex's journey!</p>
                </div>
            `;
            return;
        }

        const commentsHTML = this.comments.map(comment => {
            const timeAgo = this.getTimeAgo(comment.timestamp);
            const isLiked = this.isCommentLiked(comment);
            const currentUser = window.authManager?.getCurrentUser();
            
            return `
                <div class="comment-item" data-comment-id="${comment.id}">
                    <div class="comment-header">
                        <div class="comment-author">
                            <span class="author-avatar">👤</span>
                            <span class="author-name">${comment.authorName}</span>
                        </div>
                        <span class="comment-time">${timeAgo}</span>
                    </div>
                    <div class="comment-content">
                        <p>${this.escapeHtml(comment.text)}</p>
                    </div>
                    <div class="comment-actions">
                        <button 
                            class="like-btn ${isLiked ? 'liked' : ''}" 
                            data-comment-id="${comment.id}"
                            ${!currentUser ? 'disabled' : ''}
                        >
                            <span class="like-icon">${isLiked ? '❤️' : '🤍'}</span>
                            <span class="like-count">${comment.likes || 0}</span>
                        </button>
                        ${!currentUser ? '<span class="auth-hint">Sign in to like</span>' : ''}
                    </div>
                </div>
            `;
        }).join('');

        commentsList.innerHTML = commentsHTML;
        
        // Add event listeners for like buttons
        this.setupLikeButtons();
    }

    setupLikeButtons() {
        const likeButtons = document.querySelectorAll('.like-btn');
        likeButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleLike(e));
        });
    }

    async handleLike(e) {
        e.preventDefault();
        
        const user = window.authManager?.getCurrentUser();
        if (!user) {
            window.authManager?.openModal();
            return;
        }

        const commentId = e.currentTarget.getAttribute('data-comment-id');
        const comment = this.comments.find(c => c.id === commentId);
        
        if (!comment) return;

        const isLiked = this.isCommentLiked(comment);
        const commentRef = this.services.doc(this.db, 'comments', commentId);

        try {
            if (isLiked) {
                // Unlike
                await this.services.updateDoc(commentRef, {
                    likes: this.services.increment(-1),
                    likedBy: this.services.arrayRemove(user.uid)
                });
            } else {
                // Like
                await this.services.updateDoc(commentRef, {
                    likes: this.services.increment(1),
                    likedBy: this.services.arrayUnion(user.uid)
                });
            }
        } catch (error) {
            console.error('Error updating like:', error);
            this.showError('Failed to update like');
        }
    }

    isCommentLiked(comment) {
        const user = window.authManager?.getCurrentUser();
        return user && comment.likedBy && comment.likedBy.includes(user.uid);
    }

    getTimeAgo(timestamp) {
        if (!timestamp) return 'Just now';
        
        const now = new Date();
        const commentTime = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const diffMs = now - commentTime;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return commentTime.toLocaleDateString();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `toast-message ${type}`;
        messageDiv.textContent = message;
        
        const bgColor = type === 'success' ? 'rgba(46, 204, 113, 0.95)' : 'rgba(231, 76, 60, 0.95)';
        
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 1003;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 3000);
    }

    destroy() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }
}

// Initialize comment system
const commentSystem = new CommentSystem();

// Export for use in other modules
window.commentSystem = commentSystem;