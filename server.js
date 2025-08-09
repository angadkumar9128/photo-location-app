// server.js
const express = require('express'); // Import express
const bodyParser = require('body-parser'); // Parse JSON requests
const fs = require('fs'); // For writing logs
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to receive location logs
app.post('/log-location', (req, res) => {
    const data = req.body;

    if (!data || typeof data.latitude !== 'number' || typeof data.longitude !== 'number') {
        return res.status(400).send('Invalid payload');
    }

    const record = {
        latitude: data.latitude,
        longitude: data.longitude,
        accuracy: data.accuracy || null,
        clientTimestamp: data.timestamp || null,
        photoId: data.photoId || null,
        ip: req.ip,
        receivedAt: new Date().toISOString()
    };

    fs.appendFileSync(path.join(__dirname, 'locations.log'), JSON.stringify(record) + '\n');
    res.status(200).send('Location logged');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
