class AlexAI {
    constructor() {
        this.chatHistory = [];
        this.isOpen = false;
        // OpenAI API key should be set via environment variable or config
        // For development, you can set this in a separate config file that's not committed to git
        this.openAIKey = window.OPENAI_API_KEY || null;
        this.alexPersonality = {
            experiences: {
                countries: ['United States', 'China', 'Germany', 'Hong Kong', 'Spain', 'Chile', 'United Kingdom'],
                companies: ['TikTok', 'Siemens Advanta', 'Bain & Company', 'Six AI', 'Vibing', 'CreatiBI'],
                interests: ['PLG (Product-Led Growth)', 'Growth Hacking', 'AI Technology', 'Investment Banking', 'Venture Capital'],
                education: ['CEMS Global Alliance', 'ESADE', 'HKUST', 'Universidad Adolfo Ibáñez', 'University of Birmingham']
            },
            personality: 'Entrepreneurial, growth-focused, internationally experienced, direct communicator with a sense of humor about consulting and business life'
        };
        this.init();
    }

    init() {
        this.createChatInterface();
        this.setupEventListeners();
    }

    createChatInterface() {
        const chatHTML = `
            <div id="ai-chat-widget" class="ai-chat-widget">
                <button id="chat-toggle" class="chat-toggle">
                    <span class="chat-icon">🤖</span>
                    <span class="chat-text">Chat with Alex</span>
                </button>
                
                <div id="chat-container" class="chat-container" style="display: none;">
                    <div class="chat-header">
                        <div class="chat-avatar">🚀</div>
                        <div class="chat-info">
                            <h4>Alex Zhang AI</h4>
                            <p class="chat-status">Ask me about my experiences worldwide!</p>
                        </div>
                        <button id="chat-minimize" class="chat-minimize">−</button>
                    </div>
                    
                    <div class="chat-messages" id="chat-messages">
                        <div class="message ai-message">
                            <div class="message-avatar">🚀</div>
                            <div class="message-content">
                                <p>Hey! I'm Alex's AI assistant${this.openAIKey ? ' powered by GPT-4' : ''}. I can tell you about my experiences across different countries, companies, and answer any questions about my journey from investment banking to AI startups!</p>
                                <p>Try asking me things like:</p>
                                <ul>
                                    <li>"What was your experience at TikTok like?"</li>
                                    <li>"What's your favorite food in New York?"</li>
                                    <li>"Tell me about working in Germany"</li>
                                    <li>"What did you learn from your startup Six?"</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="chat-input-container">
                        <input type="text" id="chat-input" placeholder="Ask me anything about Alex's experiences..." disabled>
                        <button id="send-message" class="send-btn" disabled>
                            <span>→</span>
                        </button>
                    </div>
                    
                    <div class="auth-required-message" id="auth-required">
                        <p>🔒 Please sign in to chat with Alex AI</p>
                        <button id="chat-auth-btn" class="chat-auth-btn">Sign In</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatHTML);
    }

    setupEventListeners() {
        const chatToggle = document.getElementById('chat-toggle');
        const chatMinimize = document.getElementById('chat-minimize');
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-message');
        const chatAuthBtn = document.getElementById('chat-auth-btn');

        chatToggle.addEventListener('click', () => this.toggleChat());
        chatMinimize.addEventListener('click', () => this.minimizeChat());
        sendBtn.addEventListener('click', () => this.handleSendMessage());
        chatAuthBtn.addEventListener('click', () => this.handleAuthRequired());
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSendMessage();
            }
        });

        // Listen for auth state changes
        if (window.authManager) {
            this.checkAuthState();
            // Set up periodic auth state check
            setInterval(() => this.checkAuthState(), 1000);
        }
    }

    checkAuthState() {
        const user = window.authManager?.getCurrentUser();
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-message');
        const authRequired = document.getElementById('auth-required');

        if (user) {
            chatInput.disabled = false;
            sendBtn.disabled = false;
            authRequired.style.display = 'none';
            chatInput.placeholder = "Ask me anything about Alex's experiences...";
        } else {
            chatInput.disabled = true;
            sendBtn.disabled = true;
            authRequired.style.display = 'block';
            chatInput.placeholder = "Sign in to chat...";
        }
    }

    handleAuthRequired() {
        if (window.authManager) {
            window.authManager.openModal();
        }
    }

    toggleChat() {
        const container = document.getElementById('chat-container');
        const toggle = document.getElementById('chat-toggle');
        
        if (this.isOpen) {
            this.minimizeChat();
        } else {
            container.style.display = 'block';
            toggle.innerHTML = '<span class="chat-icon">✕</span>';
            this.isOpen = true;
            
            // Auto-focus input if user is authenticated
            setTimeout(() => {
                const chatInput = document.getElementById('chat-input');
                if (!chatInput.disabled) {
                    chatInput.focus();
                }
            }, 100);
        }
    }

    minimizeChat() {
        const container = document.getElementById('chat-container');
        const toggle = document.getElementById('chat-toggle');
        
        container.style.display = 'none';
        toggle.innerHTML = '<span class="chat-icon">🤖</span><span class="chat-text">Chat with Alex</span>';
        this.isOpen = false;
    }

    async handleSendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Check auth
        if (!window.authManager?.getCurrentUser()) {
            this.handleAuthRequired();
            return;
        }

        // Add user message
        this.addMessage(message, 'user');
        input.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        // Generate AI response
        const response = await this.generateResponseWithGPT(message);
        
        // Remove typing indicator and add AI response
        this.removeTypingIndicator();
        this.addMessage(response, 'ai');
    }

    addMessage(content, type) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const avatar = type === 'ai' ? '🚀' : '👤';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <p>${content}</p>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Store in chat history
        this.chatHistory.push({ content, type, timestamp: new Date() });
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message typing-indicator';
        typingDiv.id = 'typing-indicator';
        
        typingDiv.innerHTML = `
            <div class="message-avatar">🚀</div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    async generateResponseWithGPT(userMessage) {
        // Check if OpenAI API key is available
        if (!this.openAIKey) {
            return this.generateFallbackResponse(userMessage);
        }

        const systemPrompt = `You are Alex Zhang, an experienced entrepreneur and growth specialist. You have worked across multiple countries including the US, China, Germany, Hong Kong, Spain, Chile, and the UK. Your experience spans:

Companies: TikTok (Strategy & Operations), Siemens Advanta Consulting, Bain & Company, Six AI (Co-founder), Vibing (Growth Specialist), CreatiBI (Growth Specialist), Cygnus Equity (Investment Banking), Cartier (Business Consultant), K2VC (Venture Capitalist), China Securities Co. (Investment Banking)

Education: CEMS Global Alliance, ESADE, HKUST Business School, Universidad Adolfo Ibáñez, University of Birmingham (Mathematical and Statistical Economics)

Personality: You're entrepreneurial, growth-focused, internationally experienced, and a direct communicator with a sense of humor about consulting and business life. You're honest about your mistakes and failures, especially with Six AI where you raised $300k but made many mistakes. You're currently exploring PLG (Product-Led Growth).

Keep responses conversational, authentic, and draw from your real experiences. Be specific about locations, foods, cultural differences, and business insights. Show your personality - you're not afraid to admit when you don't understand something (like why people choose consulting).`;

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.openAIKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...this.chatHistory.slice(-10).map(msg => ({
                            role: msg.type === 'user' ? 'user' : 'assistant',
                            content: msg.content
                        })),
                        { role: 'user', content: userMessage }
                    ],
                    max_tokens: 500,
                    temperature: 0.8
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content.trim();

        } catch (error) {
            console.error('Error calling OpenAI API:', error);
            return this.generateFallbackResponse(userMessage);
        }
    }

    generateFallbackResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Experience-based responses (fallback if OpenAI fails)
        if (message.includes('tiktok')) {
            return "Working at TikTok was incredible! I was in Strategy & Operations for their Music division in China. The pace was insane - typical ByteDance culture where everything moves at light speed. I learned so much about data-driven decision making and how to operate in high-growth environments.";
        }
        
        if (message.includes('six') || message.includes('startup')) {
            return "Six was my co-founding adventure - an AI agent that could order takeout 30% cheaper! We actually raised $300k in SAFE funding and had some initial traction. But wow, did I make mistakes! 😅 The biggest lesson? Product-market fit is everything. We built something cool, but didn't validate demand properly.";
        }
        
        if (message.includes('germany') || message.includes('siemens')) {
            return "Germany with Siemens Advanta was my consulting chapter. Honestly, I still don't understand why people choose consulting - me included! 😂 But it taught me about large-scale transformations and how big corporations think. The work-life balance was actually decent compared to banking, and I got to work on some fascinating industrial IoT projects.";
        }
        
        if (message.includes('new york') || message.includes('nyc') || message.includes('food')) {
            return "NYC food scene is insane! For fine dining, I love Le Bernardin for seafood - absolutely mind-blowing. For casual but amazing, Joe's Pizza for that perfect NY slice, and Xi'an Famous Foods for hand-pulled noodles that remind me of China. Katz's Deli for pastrami is a must!";
        }
        
        // Default response
        return "That's an interesting question! My journey has taken me from investment banking in China to AI startups in the US, with stops in consulting in Germany and consumer insights in Hong Kong. I've learned that every experience shapes your perspective. What specific aspect of my international career would you like to explore?";
    }
}

// Initialize AI chat
const alexAI = new AlexAI();

// Export for use in other modules
window.alexAI = alexAI;