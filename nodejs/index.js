const express = require('express');
const path = require('path');
const http = require('http'); // Require http module for server
const WebSocket = require('ws');

const app = express();
const port = 3000;

const server = http.createServer(app); // Create an HTTP server using Express app
const wss = new WebSocket.Server({ server }); // Attach WebSocket server to the HTTP server

function generateRandomNumber() {
    return Math.floor(Math.random() * 11); // Generates a number from 0 to 10
}

wss.on('connection', ws => {
    let count = 0;
    const interval = setInterval(() => {
            const newData = {
                x: generateRandomNumber(),
                y: count
            };
            ws.send(JSON.stringify(newData));
            count++;
       
    }, 1000);
});

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
