// import express from "express";
// import cors from 'cors';
// import axios from 'axios';
// import { ChatOpenAI } from "@langchain/openai";
//
// const app = express();
// const PORT = 8000;
//
// app.use(express.json());
// app.use(cors());
//
// const model = new ChatOpenAI({
//     temperature: 0.1,
//     azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
//     azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
//     azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
//     azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
//     maxRetries: 5,
//     callbacks: [
//         {
//             handleLLMEnd(output) {
//                 // Extract token usage from the output and log it
//                 const tokenUsage = output.llmOutput.tokenUsage;
//                 console.log("Token usage:", tokenUsage);
//             }
//         }
//     ]
// });
//
// let chatHistory = [];
//
// app.post("/chat", async (req, res) => {
//     try {
//         const prompt = req.body.query;
//
//         // Voeg de menselijke prompt toe aan de chatgeschiedenis
//         chatHistory.push(["human", prompt]);
//         console.log("human:", prompt)
//
//         // Roep processChat aan om de AI-reactie te verkrijgen
//         const response = await processChat(prompt);
//
//         // Stuur de AI-reactie en de chatgeschiedenis terug naar de client
//         res.json({
//             response: response.content,
//             chatHistory: chatHistory
//         });
//     } catch (error) {
//         console.error("Error processing chat query:", error);
//         chatHistory.push(["system", `Er is een fout opgetreden bij het verwerken van het verzoek: ${error.message}`]);
//         res.json({
//             response: `Er is een fout opgetreden bij het verwerken van het verzoek: ${error.message}`,
//             chatHistory: chatHistory
//         });
//     }
//
// });
//
// async function searchGenius(artistName) {
//     const options = {
//         method: 'GET',
//         url: 'https://genius-song-lyrics1.p.rapidapi.com/search/',
//         params: {
//             q: artistName,
//             per_page: '1',
//             page: '1'
//         },
//         headers: {
//             'X-RapidAPI-Key': 'b4d8bc6edbmsh443996bc35cad37p183b6fjsn8e840239718a',
//             'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
//         }
//     };
//
//     try {
//         const response = await axios.request(options);
//         const hits = response.data.hits;
//         const songTitles = hits.map(hit => `Song ${hits.indexOf(hit) + 1}: ${hit.result.full_title}`);
//         const chatMessages = songTitles.map(title => ["system", title]);
//         return chatMessages;
//     } catch (error) {
//         console.error("Error searching Genius:", error);
//         throw new Error("Fout bij het zoeken naar Genius API");
//     }
// }
//
// async function processChat(prompt) {
//     title = '';
// }
//     // Bouw de berichten-array inclusief de chatgeschiedenis en de huidige prompt
//     const messages = [
//         ...chatHistory,
//         ["system", "Als muziekexpert is het jouw taak om het perfecte rapnummer te vinden om de stemming van de gebruiker te verbeteren." +
//         " De gebruiker zal zijn stemming invoeren in het veld, jouw taak is om een lijst van 5 nieuwe uitgebrachte rapnummers aan te raden die deze stemming aanvult. " +
//         "als de gebruiker een artiest achter de stemming invult, gebruik dan alleen deze artiest om naar een nummer van de artiest die de stemming aanvult "],
//         ["human", prompt]
//     ];
//     console.log(messages);
//     // Roep de AI aan met de berichten-array
//     const response = await model.invoke(messages, {
//         max_tokens: 10,
//     });
//     if (prompt.startsWith('artist:')) {
//         const artistName = prompt.split(':')[1];
//         const geniusResponse = await searchGenius(artistName);
//         // Voeg elk chatbericht toe aan de chatgeschiedenis
//         geniusResponse.forEach(songTitle => {
//             console.log(songTitle);
//             chatHistory.push(songTitle);
//         });
//     }
//     // Voeg de AI-reactie toe aan de chatgeschiedenis
//     chatHistory.push(["system", response.content]);
//     console.log("system", response.content);
//
//     // Retourneer de AI-reactie voor gebruik in de routehandler
//     return {content: response.content, title;
// }
//
//
// app.listen(PORT, () => {
//     console.log(`Server draait op http://localhost:${PORT}`);
// });

import express from "express";
import cors from 'cors';
import axios from 'axios';
import { ChatOpenAI } from "@langchain/openai";

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cors());

const model = new ChatOpenAI({
    temperature: 0.1,
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
    azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
    azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
    maxRetries: 5,
    callbacks: [
        {
            handleLLMEnd(output) {
                // Extract token usage from the output and log it
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

        // Voeg de menselijke prompt toe aan de chatgeschiedenis
        chatHistory.push(["human", prompt]);
        console.log("human:", prompt)

        // Roep processChat aan om de AI-reactie te verkrijgen
        const response = await processChat(prompt);

        // Stuur de AI-reactie en de chatgeschiedenis terug naar de client
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
    let title = ''; // Declareer en initialiseer de variabele 'title'

    // Bouw de berichten-array inclusief de chatgeschiedenis en de huidige prompt
    const messages = [
        ...chatHistory,
        ["system", "Als muziekexpert is het jouw taak om het perfecte rapnummer te vinden om de stemming van de gebruiker te verbeteren." +
        " De gebruiker zal zijn stemming invoeren in het veld, jouw taak is om een lijst van 5 nieuwe uitgebrachte rapnummers aan te raden die deze stemming aanvult. " +
        "als de gebruiker een artiest achter de stemming invult, gebruik dan alleen deze artiest om naar een nummer van de artiest die de stemming aanvult "],
        ["human", prompt]
    ];
    console.log(messages);
    // Roep de AI aan met de berichten-array
    const response = await model.invoke(messages, {
        max_tokens: 10,
    });
    if (prompt.startsWith('artist:')) {
        const artistName = prompt.split(':')[1];
        const geniusResponse = await searchGenius(artistName);
        // Voeg elk chatbericht toe aan de chatgeschiedenis
        geniusResponse.forEach(songTitle => {
            console.log(songTitle);
            chatHistory.push(songTitle);
            title = songTitle;
        });
    }
    // Voeg de AI-reactie toe aan de chatgeschiedenis
    chatHistory.push(["system", response.content]);
    console.log("system", response.content);

    // Retourneer de AI-reactie voor gebruik in de routehandler
    return { content: response.content, title: title }; // Correcte notatie van de returnverklaring
}


app.listen(PORT, () => {
    console.log(`Server draait op http://localhost:${PORT}`);
});
