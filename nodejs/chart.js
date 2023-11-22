// Function to initialize the chart
function initializeChart() {
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Tempratur',
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

// WebSocket connection and chart update
const ws = new WebSocket('ws://localhost:3000'); // Connect to the WebSocket server
let myChart = initializeChart(); // Initialize the chart

// Variable to count time for the updates
let count = 0;
let temp = null;

// Function to update the chart every 5 seconds
function updateChart(temp) {
    // Use the latestData if available
    if (temp != null) {
        // Extract temperature value from the second element of the first string

        console.log(temp);

        // Generate new data for the chart
        const newData = {
            x: temp, // Use the extracted temperature as x value
            y: count // Use the 'count' variable as y value
        };

        myChart.data.labels.push(newData.y.toString());
        myChart.data.datasets[0].data.push(newData.x);
        myChart.update();

        count++; // Increment the count
    }
}

ws.addEventListener('message', function (event) {
    const data = JSON.parse(event.data);
    latestData = data;
    updateChart(latestData);
});