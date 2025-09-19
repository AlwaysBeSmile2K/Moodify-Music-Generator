# Moodify-Music-Generator
A web app that detects your mood from text input and recommends music playlists accordingly. Perfect for discovering songs that match your feelings, including your own tracks! Built with Node.js, Express, and simple sentiment analysis.

#Folder Structure

moodify/
├─ backend/
│  └─ server.js
├─ frontend/
│  ├─ index.html
│  └─ script.js
├─ package.json
└─ README.md

#backend/server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Sentiment = require('sentiment');

const app = express();
const sentiment = new Sentiment();

app.use(cors());
app.use(bodyParser.json());

app.post('/detect-mood', (req, res) => {
    const { text } = req.body;
    const result = sentiment.analyze(text);
    let mood = 'neutral';
    if(result.score > 1) mood = 'happy';
    else if(result.score < -1) mood = 'sad';
    res.json({ mood });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
