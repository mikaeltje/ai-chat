class ChatHistory {
    constructor() {
        this.chatHistory = JSON.parse(localStorage.getItem("myChatHistory")) || [];
    }

    addToChatHistory(message, sender) {
        const chatHistoryElement = document.getElementById('chat-history');
        const messageElement = document.createElement('p');

        messageElement.textContent = `${sender}: ${message}`;
        chatHistoryElement.appendChild(messageElement);

        chatHistoryElement.scrollTop = chatHistoryElement.scrollHeight;

        this.chatHistory.push([sender, message]);
        localStorage.setItem("myChatHistory", JSON.stringify(this.chatHistory));
    }

    getChatHistory() {
        return this.chatHistory;
    }
}

const chatHistory = new ChatHistory();

async function music() {
    const mood = document.getElementById('music');
    const moodValue = mood.value;

    chatHistory.addToChatHistory(moodValue, 'Jij');

    document.getElementById('submit').disabled = true;
    mood.disabled = true;
    document.getElementById('loadingSpinner').classList.remove('hidden');

    try {
        const response = await fetch('http://localhost:8000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: moodValue, chatHistory: chatHistory.getChatHistory() })
        });

        if (!response.ok) {
            throw new Error('Er is een fout opgetreden bij het verwerken van het verzoek.');
        }

        const data = await response.json();
        chatHistory.addToChatHistory(data.response, 'Assistent');
        mood.value = '';
    } catch (error) {
        console.error(error);
        alert('Er is een fout opgetreden bij het verwerken van het verzoek.');
    } finally {
        document.getElementById('submit').disabled = false;
        mood.disabled = false;
        document.getElementById('loadingSpinner').classList.add('hidden');
    }
}
