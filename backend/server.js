const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

let accessToken = '';

async function getAccessToken() {
    const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });
    const data = await res.json();
    accessToken = data.access_token;
    console.log('Spotify access token updated');
}

getAccessToken();
setInterval(getAccessToken, 3500 * 1000); // Refresh token every ~1 hour

app.post('/playlist', async (req, res) => {
    const { mood } = req.body;
    let query = 'chill';
    if (mood === 'happy') query = 'upbeat';
    if (mood === 'sad') query = 'sad';

    const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=playlist&limit=5`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    const data = await response.json();
    const playlists = data.playlists.items.map(p => ({ name: p.name, url: p.external_urls.spotify }));
    res.json({ playlists });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
