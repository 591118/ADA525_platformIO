const express = require("express");
const app = express();
const http = require("http");
const port = 3000;

//serial stuff
const { SerialPort } = require("serialport");

const sp = new SerialPort({
  path: "/dev/tty.usbmodem111201",
  baudRate: 115200,
});

//socket stuff
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

//global variable that stores accelerometer data from arduino
let accData = 0;
let filter = [];

// Read data that is available but keep the stream in "paused mode"
sp.on("readable", function () {
  accData = sp.read().toString();
});

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("a user connected");
  setInterval(() => {
    filter.push(new Number(accData));
    if (filter.length > 10) {
      filter.shift();
    }
    const packet = filter.reduce((a, b) => a + b, 0) / 10;
    //console.log(packet);
    socket.emit("message", packet);
  }, 30);
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
