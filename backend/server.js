const express = require('express');
const cors = require('cors');
const { ChatGroq } = require('@langchain/groq');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
require('dotenv').config();
const { getJson } = require("serpapi");
const app = express();
const port = 3000;
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");
const bodyParser = require('body-parser');
// Enable CORS
app.use(cors());
app.use(express.json());

// Placeholder for the chatbot model
const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "mixtral-8x7b-32768",
    temperature: 0,
});

let conversationHistory = [
    ["system", "You are a financial advisor and a chatbot in a budgeting app for gen-z.Make sure to give sound financial advice and keep your answers precise and to the point.Answer the given questions and nothing else"]
];

// Default route for root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Financial Chatbot API');
});

// Chat endpoint
app.post('/chat', async (req, res) => {
    const userInput = req.body.message;

    try {
        const prompt = ChatPromptTemplate.fromMessages([
            ...conversationHistory,
            ["human", userInput]
        ]);
        const chain = prompt.pipe(model);

        const response = await chain.invoke({ input: userInput });
        const assistantResponse = response.content;

        conversationHistory.push(["human", userInput]);
        conversationHistory.push(["assistant", assistantResponse]);

        // Keep history to last 10 exchanges
        if (conversationHistory.length > 21) {
            conversationHistory = [
                conversationHistory[0],
                ...conversationHistory.slice(-20)
            ];
        }

        res.json({ response: assistantResponse });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// SerpAPI endpoint
// app.get('/events', async (req, res) => {
//     const location = req.query.location || 'gurugram';

//     try {
//         getJson({
//             api_key: process.env.SERP_API_KEY,
//             engine: "google",
//             q: "upcoming events near me",
//             location: location,
//             google_domain: "google.com",
//             gl: "in",
//             hl: "en",
//         }, (json) => {
//             res.json(json);
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

const chat = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: 'mixtral-8x7b-32768',
    temperature: 0.7,
});

// Endpoint to handle the location query
app.post('/events', async (req, res) => {
    const { location } = req.body;

    if (!location) {
        return res.status(400).json({ error: "Location is required" });
    }

    try {
        // Construct the user query
        const userQuery = `What are the events in ${location}?`;

        // Create the messages array
        const messages = [
            new SystemMessage("You are an event suggestion assistant that gives event name, date, venue, detail, and price. Only provide the defined information in the response.always give atleast 6 or more recent events.also no matter what the date of the event change the year to 2025.also give hyperlins to ticket booking for the events"),
            new HumanMessage(userQuery),
        ];

        // Log the request for debugging
        console.log("Prompt being sent to ChatGroq:", messages);

        // Generate the response from ChatGroq
        const response = await chat.invoke(messages);

        // Send the response back to the client
        res.json({ events: response.content });
    } catch (error) {
        console.error("ChatGroq invocation error:", error.message, error.stack);
        res.status(500).json({ error: "Failed to fetch events" });
    }
});




// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
