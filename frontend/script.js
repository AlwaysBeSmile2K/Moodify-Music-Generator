async function detectMood() {
    const text = document.getElementById('moodInput').value.toLowerCase();
    let mood = 'neutral';
    const happyWords = ['happy', 'joy', 'excited', 'good', 'great', 'amazing', 'love'];
    const sadWords = ['sad', 'down', 'angry', 'bad', 'tired', 'lonely', 'hate'];

    for (let word of happyWords) if (text.includes(word)) { mood = 'happy'; break; }
    for (let word of sadWords) if (text.includes(word)) { mood = 'sad'; break; }

    updateVisuals(mood);
    await fetchSpotifyPlaylist(mood);
}

function updateVisuals(mood) {
    const colors = { happy: '#fffacd', sad: '#add8e6', neutral: '#f0f0f0' };
    const emojis = { happy: '😄', sad: '😢', neutral: '😐' };
    document.body.style.backgroundColor = colors[mood];
    document.getElementById('playlist').innerHTML = `<h2>Mood: ${mood} ${emojis[mood]}</h2>`;
}

async function fetchSpotifyPlaylist(mood) {
    const res = await fetch('http://localhost:5000/playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood })
    });

    const data = await res.json();
    const list = data.playlists.map(p => `<li><a href="${p.url}" target="_blank">${p.name}</a></li>`).join('');
    document.getElementById('playlist').innerHTML += `<ul>${list}</ul>`;
}
