class ChatHistory {
    constructor() {
        this.chatHistory = JSON.parse(localStorage.getItem("myChatHistory")) || [];
    }

    addToChatHistory(message, sender) {
        const chatHistoryElement = document.getElementById('chat-history');
        const messageElement = document.createElement('p');

        messageElement.textContent = `${sender}: ${message}`;
        chatHistoryElement.appendChild(messageElement);

        // Automatisch scrollen naar het nieuwste bericht
        chatHistoryElement.scrollTop = chatHistoryElement.scrollHeight;

        // Update chatHistory and localStorage
        this.chatHistory.push([sender, message]);
        localStorage.setItem("myChatHistory", JSON.stringify(this.chatHistory));
    }

    getChatHistory() {
        return this.chatHistory;
    }
}

const chatHistory = new ChatHistory();

async function music() {
    // Invoer van de gebruiker ophalen
    const mood = document.getElementById('music');
    const moodValue = mood.value;

    // De vraag toevoegen aan de chatgeschiedenis
    chatHistory.addToChatHistory(moodValue, 'Jij');

    // De submit-knop en het invoerveld uitschakelen en de loading spinner tonen
    document.getElementById('submit').disabled = true;
    mood.disabled = true; // Dit schakelt het invoerveld uit
    document.getElementById('loadingSpinner').classList.remove('hidden');

    try {
        // Server aanroepen met fetch() en POST-methode
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

        // Het ontvangen antwoord weergeven in de gebruikersinterface
        const data = await response.json();
        document.getElementById('answer').textContent = data.response; // Aanpassing hier
        document.getElementById('answer').classList.remove('hidden');

        // Het antwoord toevoegen aan de chatgeschiedenis
        chatHistory.addToChatHistory(data.response, 'Assistent'); // Aanpassing hier
    } catch (error) {
        console.error(error);
        // Toon een foutmelding als er een fout optreedt
        alert('Er is een fout opgetreden bij het verwerken van het verzoek.');
    } finally {
        // De submit-knop en het invoerveld inschakelen en de loading spinner verbergen
        document.getElementById('submit').disabled = false;
        mood.disabled = false; // Dit schakelt het invoerveld weer in
        document.getElementById('loadingSpinner').classList.add('hidden');
    }
}