// Settings for the LED grid
const gridWidth = 7;
const gridHeight = 2;
const ledSpacing = 50;
const ledDiameter = 20;
const searchRad = 160;

let ledStates; // Holds the states of the LEDs

function setup() {
  // Create a canvas that's big enough to hold the grid centered
  let canvas = createCanvas(gridWidth * ledSpacing, gridHeight * ledSpacing);
  canvas.parent("sketch-container");
  ledStates = createEmptyLedStates(); // Initialize with all LEDs off
  noFill();
  stroke(0);
}

function draw() {
  background(255);
  noFill();
  ellipse(mouseX, mouseY, searchRad, searchRad);
  // Update LED states if the mouse is pressed and display the grid
  if (mouseIsPressed) {
    updateLEDArray();
    //console.log(ledStates[0]);
    //logLedStates(); // Log the states if you want to see the update in real-time
    sendData(ledStates);
  }

  displayLEDGrid(ledStates); // Always display the LED grid
}

// Update the LED array with the new states based on the mouse position
function updateLEDArray() {
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      let ledX = x * ledSpacing + ledSpacing / 2;
      let ledY = y * ledSpacing + ledSpacing / 2;
      let d = dist(mouseX, mouseY, ledX, ledY);

      ledStates[y][x] = d < searchRad / 2 ? 1 : 0;
    }
  }
  const dataToSend = bitsToBuffer(ledStates);
  writeToPort(dataToSend);
  //console.log(ledStates);
}

// This function displays the LED grid based on the states
function displayLEDGrid(ledStates) {
  for (let y = 0; y < ledStates.length; y++) {
    for (let x = 0; x < ledStates[y].length; x++) {
      let ledX = x * ledSpacing + ledSpacing / 2;
      let ledY = y * ledSpacing + ledSpacing / 2;
      if (ledStates[y][x] === 1) {
        fill(0); // LED is "on"
      } else {
        noFill(); // LED is "off"
      }
      ellipse(ledX, ledY, ledDiameter, ledDiameter);
    }
  }
}

// Create an initial empty state for all LEDs
function createEmptyLedStates() {
  let states = [];
  for (let y = 0; y < gridHeight; y++) {
    let rowStates = new Array(gridWidth).fill(0);
    states.push(rowStates);
  }
  return states;
}
