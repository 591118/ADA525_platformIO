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
Adafruit_LSM6DS33 lsm;    // gyro

int antallLeds = 6;
int brightness = 0;
bool heltPaaskrudd = false;
float temperature, pressure, altitude, humidity;
float ax, ay, az, gx, gy, gz;

void setup() {
  strip.begin(); // Initialize pins for output
  strip.show();  // Turn all LEDs off ASAP
  bmp280.begin();
  sht30.begin();
  lsm.begin_I2C();
  Serial.begin(115200);
}

void sun () { 
    brightness++;
    if (brightness == 255){
      heltPaaskrudd = true;
    }
}

void loop() {
  temperature = bmp280.readTemperature();
  pressure = bmp280.readPressure();
  altitude = bmp280.readAltitude(1013.25);

  humidity = sht30.readHumidity();

  Serial.println("Brightness: " + String(brightness));
  Serial.println("temp: " + String(temperature));
  Serial.println("altitude: " + String(altitude));
  Serial.println("humidity: " + String(humidity));

 if (true) {
    strip.clear();
    strip.setBrightness(brightness);

    for (int i = 0; i < antallLeds; i++) {
      strip.setPixelColor(i, 0, 255, 0);
      strip.setBrightness(64);
    }

    strip.show();
    delay(100);
  }
  
delay(1000);
  }