const express = require('express');
const cors = require('cors');
const { ChatGroq } = require('@langchain/groq');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

require('dotenv').config();
const { getJson } = require("serpapi");
const app = express();
const port = 3000;
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const admin = require('firebase-admin');
const serviceAccount = require('./service-account-Key.json'); // Add the path to your service account file here

// Initialize Firebase Admin SDK with explicit credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://database-url.firebasedatabase.app' // Replace with your Firestore URL
});


// Firestore reference
const db = admin.firestore();

// Enable CORS
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
// Placeholder for the chatbot model
const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "mixtral-8x7b-32768",
    temperature: 0,
});

let conversationHistory = [
    ["system", "You are a financial advisor and a chatbot in a budgeting app for gen-z. Make sure to give sound financial advice and keep your answers precise and to the point. Answer the given questions and nothing else"]
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

// Firestore listener for new documents and modified documents
// Initialize Firebase Admin SDK

// Firestore listener for new documents and modified documents
db.collection('users').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        if (change.type === 'added' || change.type === 'modified') {
            // Process the new or modified document
            const documentId = change.doc.id;  // Get document ID
            const newData = change.doc.data();  // Get document data
            console.log(`Document ${change.type}: `, newData);

            // Trigger retraining process (you can call a function here to retrain your model)
            retrainModelAndStorePrediction(newData, documentId);
        }
    });
});

// Function to handle retraining, plotting, and storing prediction results
function retrainModelAndStorePrediction(data, documentId) {
    // Send data to Python script for model prediction
    const pythonProcess = spawn('python', ['./script.py', JSON.stringify(data)]);

    pythonProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        
        // Parse the predictions from the Python script output
        try {
            const predictions = JSON.parse(data.toString()); // Parse the predictions
            console.log("Predictions received: ", predictions);

            // Store the predictions in Firestore under the document
            db.collection('users').doc(documentId).update({
                predictions: predictions  // Store the full list of predictions
            })
            .then(() => {
                console.log("Predictions stored successfully in Firestore.");
            })
            .catch((error) => {
                console.error("Error storing predictions in Firestore: ", error);
            });
        } catch (error) { 
            console.error("Failed to parse predictions:", error);
        }
    });

    pythonProcess.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}

// Set up Multer for file uploads
const upload = multer({
    dest: 'uploads/', // Temporary directory to store uploaded files
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);
        if (extName && mimeType) {
            return cb(null, true);
        } else {
            cb(new Error('Only .jpeg, .jpg, and .png files are allowed!'));
        }
    }
});

// POST route to handle image uploads and OCR processing
app.post('/process-image', upload.single('image'), (req, res) => {
    // Ensure the file was uploaded
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded or invalid file type.' });
    }

    const imagePath = req.file.path;

    // Spawn Python process with the image path
    const pythonProcess = spawn('python', ['./script_img.py', JSON.stringify({ image_path: imagePath })]);

    let outputData = '';
    let errorData = '';

    // Collect stdout data from the Python process
    pythonProcess.stdout.on('data', (data) => {
        outputData += data.toString();
    });

    // Collect stderr data from the Python process
    pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
    });

    // Handle process close
    pythonProcess.on('close', (code) => {
        // Remove the uploaded file after processing
        fs.unlink(imagePath, (err) => {
            if (err) console.error('Failed to delete temporary file:', err);
        });

        if (code === 0) {
            try {
                // Parse Python script output and send response
                const result = JSON.parse(outputData);
                res.json({ success: true, result });
            } catch (parseError) {
                res.status(500).json({ success: false, error: 'Failed to parse Python output.', details: parseError.message });
            }
        } else {
            res.status(500).json({ success: false, error: 'Python script error.', details: errorData });
        }
    });
});



// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
