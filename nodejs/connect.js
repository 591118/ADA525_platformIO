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