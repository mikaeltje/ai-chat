import express from "express";
import cors from 'cors';
import axios from 'axios';
import { ChatOpenAI } from "@langchain/openai";

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cors());

const model = new ChatOpenAI({
    temperature: 0.2,
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
    azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
    azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
    maxRetries: 5,
    callbacks: [
        {
            handleLLMEnd(output) {
                const tokenUsage = output.llmOutput.tokenUsage;
                console.log("Token usage:", tokenUsage);
            }
        }
    ]
});

let chatHistory = [];

app.post("/chat", async (req, res) => {
    try {
        const prompt = req.body.query;
        chatHistory.push(["human", prompt]);
        const response = await processChat(prompt);
        res.json({
            response: response.content,
            chatHistory: chatHistory
        });
    } catch (error) {
        console.error("Error processing chat query:", error);
        chatHistory.push(["system", `Er is een fout opgetreden bij het verwerken van het verzoek: ${error.message}`]);
        res.json({
            response: `Er is een fout opgetreden bij het verwerken van het verzoek: ${error.message}`,
            chatHistory: chatHistory
        });
    }
});

async function searchGenius(artistName) {
    const options = {
        method: 'GET',
        url: 'https://genius-song-lyrics1.p.rapidapi.com/search/',
        params: {
            q: artistName,
            per_page: '1',
            page: '1'
        },
        headers: {
            'X-RapidAPI-Key': 'b4d8bc6edbmsh443996bc35cad37p183b6fjsn8e840239718a',
            'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        const hits = response.data.hits;
        const songTitles = hits.map(hit => `Song ${hits.indexOf(hit) + 1}: ${hit.result.full_title}`);
        const chatMessages = songTitles.map(title => ["system", title]);
        return chatMessages;
    } catch (error) {
        console.error("Error searching Genius:", error);
        throw new Error("Fout bij het zoeken naar Genius API");
    }
}

async function processChat(prompt) {
    let title = '';
    const messages = [
        ...chatHistory,
        ["system", "Als muziekexpert is het jouw taak om het perfecte nummer te vinden om de stemming van de gebruiker te verbeteren." +
        " De gebruiker zal zijn stemming invoeren in het veld, jouw taak is om een lijst van 5 nieuwe uitgebrachte nummers aan te raden die deze stemming aanvult. " +
        "als de gebruiker een artiest achter de stemming invult, gebruik dan alleen nummers van deze artiest "],
        ["human", prompt]
    ];
    const response = await model.invoke(messages, {
        max_tokens: 10,
    });
    if (prompt.startsWith('artist:')) {
        const artistName = prompt.split(':')[1];
        const geniusResponse = await searchGenius(artistName);
        geniusResponse.forEach(songTitle => {
            console.log(songTitle);
            chatHistory.push(songTitle);
            title = songTitle;
        });
    }
    chatHistory.push(["system", response.content]);
    console.log("system", response.content);
    return { content: response.content, title: title };
}

app.listen(PORT, () => {
    console.log(`Server draait op http://localhost:${PORT}`);
});
