#include <Adafruit_DotStar.h>
#include <Wire.h>
#include <Adafruit_BMP280.h>
#include <Adafruit_SHT31.h>
#include <MPU6050.h>

// Everything is defined in the Board Support Package
// DOTSTAR_NUM        number of onboard DotStars (typically just 1)
// PIN_DOTSTAR_DATA   onboard DotStar data pin
// PIN_DOTSTAR_CLK    onboard DotStar clock pin
Adafruit_DotStar strip(6, 6, 9, DOTSTAR_BRG);
Adafruit_BMP280 bmp280;     // temperautre, barometric pressure
Adafruit_SHT31 sht30;       // humidity
Adafruit_MPU6050 mpu;       //gyro

int ledPin = 6;
int oppvekkingsDelayIntervall = 0;   // 8 sekunder intervall  - 8000
int antallLeds = 6;                     // antall ledlys
int brightness;
bool heltPaaskrudd = false;
uint16_t hue;
float temperature, pressure, altitude, humidity;
int16_t gyroX, gyroY, gyroZ;


void setup() {
  strip.begin(); // Initialize pins for output
  strip.show();  // Turn all LEDs off ASAP
  brightness = 0;
  bmp280.begin();
  sht30.begin();

  Serial.begin(115200);

  if (!mpu.begin()) {
    Serial.println("Failed to find MPU6050 chip");
    while (1) {
      delay(10);
    }
  }
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

  mpu.getRotation(&gyroX, &gyroY, &gyroZ);

  Serial.println("Brightness: " + String(brightness));
  Serial.println("temp: " + String(temperature));
  Serial.println("altitude: " + String(altitude));
  Serial.println("humidity: " + String(humidity));
  Serial.println("GyroX: " + String(gyroX));
  Serial.println("GyroY: " + String(gyroY));
  Serial.println("GyroZ: " + String(gyroZ));

    if (temperature > 24.00 && altitude > 187.00){
      strip.clear(); 
      strip.setBrightness(10);
      strip.setPixelColor(i,0,255,0);
      strip.show();
      delay(100);
    }
  
delay(1000);

 // if (heltPaaskrudd == false){
  //     sun (); 
  // } else {
  //   hue = 23593;    //(120 * 65535) / 360 = 23593
  // }
  //   Serial.println("Brightness: " + String(brightness));
  //   hue = (249309 + brightness) % 65536;
  //   strip.fill(strip.ColorHSV(hue, 29 * 255 / 100, brightness));
  //   strip.show();
  //   delay(7000);

  }

 

    //  rainbow(10);  // Flowing rainbow cycle along the whole stri
  