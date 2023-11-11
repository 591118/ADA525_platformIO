#include <Arduino.h>
#include <Adafruit_BMP280.h>
#include <bluefruit.h>

Adafruit_BMP280 bmp280;
float temp;

void setup() {
  Serial.begin(9600);
  bmp280.begin();

  if (!Bluefruit.begin(1,1)){
    Serial.println("Not connected");
  } else {
     Serial.println("Initialized (central mode)");
  }

  Bluefruit.setTxPower(4);  
  Bluefruit.setConnLedInterval(250);

  Bluefruit.Scanner.setRxCallback(scan_callback);
  Bluefruit.Scanner.restartOnDisconnect(true);
  Bluefruit.Scanner.filterRssi(-80);            // Only invoke callback for devices with RSSI >= -80 dBm
  Bluefruit.Scanner.filterUuid(uuid);           // Only invoke callback if the target UUID was found
  Bluefruit.Scanner.setInterval(160, 80);       // in units of 0.625 ms
  Bluefruit.Scanner.useActiveScan(true);        // Request scan response data
  Bluefruit.Scanner.start(0);                   // 0 = Don't stop scanning after n seconds
  Serial.println("Scanning ...");
}

void loop() {
  if (Bluefruit.connected()) {
    temp = bmp280.readTemperature();
    char temp_str[10];
    dtostrf(temp, 6, 2, temp_str);
    Bluefruit.print(temp_str);
    delay(1000);
  }
}