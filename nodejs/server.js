const express = require('express');
const path = require('path');
const http = require('http'); // Require http module for server
const WebSocket = require('ws');
const bodyParser = require('body-parser');

const { SerialPort } = require("serialport");

const app = express();
const port = 3000;

const server = http.createServer(app); // Create an HTTP server using Express app
const wss = new WebSocket.Server({ server }); // Attach WebSocket server to the HTTP server

let temp = 0;

// Middleware to parse JSON requests
app.use(bodyParser.json());


const serial = new SerialPort({
    path: 'COM8',
    baudRate: 115200
  });

  serial.on('data', function (data) {
      const dataString = data.toString('utf-8');
      const tempMatch = dataString.match(/Temp: ([0-9]+\.[0-9]+)/);
  
      if (tempMatch && tempMatch[1]) {
          temp = tempMatch[1];
      }
  });
  
  // Set up the interval to send the last "Temp" value to clients every 5 seconds
  setInterval(() => {
      // Send the last "Temp" value to the client
      wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(temp));
          }
      });
  }, 5000);

wss.on('connection', function connection(ws) {
    console.log('Client connected');

    ws.on('close', function () {
        console.log('Client disconnected');
    });
});

wss.onmessage = event => {
    const data = JSON.parse(event.data);
    console.log('Received data:', data); // Log the received data
};

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Handle POST request for brightness update
app.put('/', (req, res) => {
    const brightnessValue = req.body.brightness;
    console.log('Received brightness value from client:', brightnessValue);

    // Do something with the brightness value, for example, send it to connected clients via WebSocket
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ brightnessValue }));
        }
    });

    // Send the brightness value to Arduino
    const messageToArduino = `Brightness: ${brightnessValue}\n`; // Assuming Arduino expects a message like "Brightness: [value]\n"
    serial.write(messageToArduino, (err) => {
        if (err) {
            console.error('Error sending data to Arduino:', err);
        } else {
            console.log('Sent brightness value to Arduino:', brightnessValue);
            console.log(brightnessValue);
        }
});
});