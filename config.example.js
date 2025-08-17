// Example configuration file
// Copy this to config.js and add your actual API keys
// DO NOT commit config.js to version control

window.OPENAI_API_KEY = 'your-openai-api-key-here';

// You can also add other configuration options here
window.CONFIG = {
    openAI: {
        model: 'gpt-4',
        maxTokens: 500,
        temperature: 0.8
    },
    chat: {
        enabled: true,
        maxHistory: 10
    }
};