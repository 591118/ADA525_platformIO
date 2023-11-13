// Add event listener to the 'Connect' button
document.getElementById("connect").addEventListener("click", async () => {
  if ("serial" in navigator) {
    try {
      // Prompt user to select any serial port
      const port = await navigator.serial.requestPort();
      // Open the port
      await port.open({ baudRate: 115200 });
      writer = port.writable.getWriter();
      //readAndLogArduinoReplies(port);
    } catch (error) {
      // Handle errors such as user not selecting a port
      console.error("There was an error opening the port:", error);
    }
  } else {
    console.log("Web Serial API not supported.");
  }
});

function bitsToBuffer(arr) {
  // Flatten the array
  let bits = arr.flat();

  // Ensure there are exactly 14 bits
  if (bits.length !== 14) {
    throw new Error(
      "The input array must have exactly 14 bits to fit into 2 bytes with MSBs set to 0."
    );
  }

  // Prepare the bytes
  let byte1 = 0;
  let byte2 = 0;

  // Convert first 7 bits to the first byte
  for (let i = 0; i < 7; i++) {
    byte1 |= bits[i] << (6 - i);
  }

  // Convert the next 7 bits to the second byte
  for (let i = 7; i < 14; i++) {
    byte2 |= bits[i] << (13 - i);
  }

  // Create a Buffer from the two bytes
  let buffer = new Uint8Array([byte1, byte2]);
  return buffer;
}

function sendData(ledStates) {
  const buffer = bitsToBuffer(ledStates);
  //console.log(buffer);
  writeToPort(buffer);
  //sendSpecificValue();
}

async function writeToPort(data) {
  if (writer) {
    const textEncoder = new TextEncoder();
    try {
      const d = new Uint8Array([0xff, data[0], data[1]]);
      await writer.write(d);
      //console.log("Data sent to port: ", d);
    } catch (error) {
      console.error("Error writing to serial port:", error);
    }
  } else {
    console.error("No writer available for the serial port.");
  }
}
