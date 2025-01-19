# README for Event Tracker and Chatbot Application

Welcome to the repository for our Event Tracker and Chatbot application, built with Next.js and supported by a backend in Express and Python. This document provides an overview of the project, setup instructions, and other necessary details to get started with development and deployment.

## Project Overview

This application serves as a dual-purpose tool:
1. **Event Tracker**: Users can view and manage events fetched from external APIs.
2. **Chatbot**: Assists users by answering queries related to events and performing tasks like image recognition.

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js with Express, Python (for scripts like OCR)
- **Database**: Firebase for user data and event storage
- **APIs**: GroqAI for event data, custom-built chatbot API

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (Node Package Manager)
- Python (for running backend scripts)

### Installation

Clone the repository to your local machine:

```bash
git clone https://github.com/your-repository/event-tracker-chatbot.git
cd event-tracker-chatbot
```

Install the required packages:

```bash
npm install
```

### Setting Up the Environment

Create a `.env` file in the root directory and add the necessary environment variables:

```
FIREBASE_API_KEY=your_firebase_api_key
API_SECRET=your_api_secret_key
GROQ_API_KEY= api_key
```

### Running the Application

To run the frontend development server:

```bash
npm run dev
```

To start the backend server:

```bash
node backend/server.js
```

### Deploying

For deployment, follow these steps:

1. Build the application for production:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

## Usage

Navigate to `http://localhost:3000` in your web browser to view the application. Use the chatbot feature by clicking on the chat icon at the bottom right of the screen.


Thank you for checking out our project! If you have any questions or feedback, feel free to open an issue in the repository.
