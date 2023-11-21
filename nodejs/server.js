const express = require('express');
const path = require('path');
const http = require('http'); // Require http module for server
const WebSocket = require('ws');
const SerialPort = require('serialport');

const app = express();
const port = 3000;

const server = http.createServer(app); // Create an HTTP server using Express app
const wss = new WebSocket.Server({ server }); // Attach WebSocket server to the HTTP server

function generateRandomNumber() {
    return Math.floor(Math.random() * 11); // Generates a number from 0 to 10
}

wss.onmessage = event => {
    const data = JSON.parse(event.data);
    console.log('Received data:', data); // Log the received data

    // Generate random data for the chart
    const newData = {
        x: generateRandomNumber(), // Generate a new random x value
        y: data.count // Use the received 'count' as y value
    };

    myChart.data.labels.push(newData.y.toString());
    myChart.data.datasets[0].data.push(newData.x);
    myChart.update();
};

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

