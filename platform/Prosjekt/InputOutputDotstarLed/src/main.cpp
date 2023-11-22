#include <Adafruit_DotStar.h>
#include <Wire.h>
#include <Adafruit_BMP280.h>
#include <Adafruit_SHT31.h>
#include <Adafruit_LSM6DS33.h>

// Everything is defined in the Board Support Package
// DOTSTAR_NUM        number of onboard DotStars (typically just 1)
// PIN_DOTSTAR_DATA   onboard DotStar data pin
// PIN_DOTSTAR_CLK    onboard DotStar clock pin
Adafruit_DotStar strip(6, 6, 5, DOTSTAR_BRG);
Adafruit_BMP280 bmp280;     // temperautre, barometric pressure
Adafruit_SHT31 sht30;       // humidity
Adafruit_LSM6DS33 lsm;      // gyro

int antallLeds = 6;
int brightness = 0;
float temperature, pressure, altitude, humidity;
float ax, ay, az, gx, gy, gz;

void setup() {
  strip.begin(); // Initialize pins for output
  strip.show();  // Turn all LEDs off ASAP
  bmp280.begin();
  sht30.begin();
  lsm.begin_I2C();
  Serial.begin(115200);
  brightness = 65;
}

void sun () { 
    while (brightness != 255){
      brightness++;
      delay(8000);
    } 
}

void loop() {
  temperature = bmp280.readTemperature();
  pressure = bmp280.readPressure();
  altitude = bmp280.readAltitude(1013.25);
  humidity = sht30.readHumidity();

  sensors_event_t accel;
  sensors_event_t gyro;
  sensors_event_t temp;
  lsm.getEvent(&accel, &gyro, &temp);
  ax = accel.acceleration.x;
  ay = accel.acceleration.y;
  az = accel.acceleration.z;

Serial.print("Brightness: ");
Serial.print(brightness);
Serial.print(", Temp: ");
Serial.print(temperature);
Serial.print(", Altitude: ");
Serial.print(altitude);
Serial.print(", Humidity: ");
Serial.print(humidity);
Serial.print(", AccelX: ");
Serial.print(ax);
Serial.print(", AccelY: ");
Serial.print(ay);
Serial.print(", AccelZ: ");
Serial.println(az);

if (Serial.available() > 0) {
    String message = Serial.readStringUntil('\n'); // Read the incoming message until newline character
    brightness = message.toInt();
}

  if (8 < accel.acceleration.x && accel.acceleration.x < 10) {    // setter "farge"
      for (int i = 0; i < antallLeds; i++) {
      strip.setPixelColor(i, 255, 0, 0);
      strip.setBrightness(brightness);
      strip.show();
    }
  }

    if (-11 < accel.acceleration.x && accel.acceleration.x < -9) {    // setter "farge"
      for (int i = 0; i < antallLeds; i++) {
      strip.setPixelColor(i, 255, 255, 255);
      strip.setBrightness(brightness);
      strip.show();
    }
  }

    if (9 < accel.acceleration.y && accel.acceleration.y < 10) {    // setter "farge"
      for (int i = 0; i < antallLeds; i++) {
      strip.setPixelColor(i, 0, 0, 255);
      strip.setBrightness(brightness);
      strip.show();
    }
  }

    if (-11 < accel.acceleration.y && accel.acceleration.y < -9) {    // setter "farge"
      for (int i = 0; i < antallLeds; i++) {
      strip.setPixelColor(i, 0, 0, 255);
      strip.setBrightness(brightness);
      strip.show();
    }
  }

  if (-11 < accel.acceleration.z && accel.acceleration.z < -9) {
    for (int i = 0; i < antallLeds; i++) {
    strip.setPixelColor(i, 0, 0, 0);  // Set color to black (off)
    }
    strip.setBrightness(0);
    strip.show();
}

delay(50);
}