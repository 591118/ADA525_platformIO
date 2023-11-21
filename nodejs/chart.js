// Function to initialize the chart
function initializeChart() {
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Random Data',
                data: [],
                borderColor: 'blue',
                backgroundColor: 'transparent',
                tension: 0.4,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });

    return myChart;
}

const socket = new WebSocket('ws://localhost:3000');
socket.addEventListener('message', function (event) {
  console.log('Message from server: ', event.data);
});

// Function to generate random data
function generateRandomNumber() {
    return Math.floor(Math.random() * 11); // Generates a number from 0 to 10
}

// WebSocket connection and chart update
const ws = new WebSocket('ws://localhost:3000'); // Connect to the WebSocket server
let myChart = initializeChart(); // Initialize the chart

// Variable to count time for the updates
let count = 0;

// Function to update the chart every second
function updateChart() {
    // Generate random data for the chart
    const newData = {
        x: generateRandomNumber(), // Generate a new random x value
        y: count // Use the 'count' variable as y value
    };

    myChart.data.labels.push(newData.y.toString());
    myChart.data.datasets[0].data.push(newData.x);
    myChart.update();

    count++; // Increment the count
}

// Update the chart every second
setInterval(updateChart, 1000);

// Receive WebSocket messages (if necessary, adjust the following lines)
ws.onmessage = event => {
    const data = JSON.parse(event.data);
    console.log('Received data:', data); // Log the received data

    // Assuming 'data.count' is received from the server
    count = data.count; // Update the 'count' for chart y-values
};