#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>
#include <TinyGPSPlus.h>
#include <HardwareSerial.h>
#include <WiFi.h>
#include <HTTPClient.h>

// Wi-Fi credentials
const char* ssid = "Mpofu";
const char* password = "j52dz9bX";

// Backend Server Details
const char* serverName = "http://192.168.1.X:8000/api/sensor-data/";  // Replace with your Django server's IP and port

// LCD setup
LiquidCrystal_I2C lcd(0x27, 16, 2);

// DHT11 setup
#define DHTPIN 4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Ultrasonic Sensor
#define TRIG_PIN 5
#define ECHO_PIN 18

// MQ3
#define MQ3_PIN 34

// GPS
HardwareSerial gpsSerial(1);
TinyGPSPlus gps;

// Global variables to store latest values
float temp = 0.0, hum = 0.0, distance_cm = 0.0, lat = 0.0, lng = 0.0;
int mq3_value = 0;

void setup() {
  Serial.begin(115200);
  lcd.init();
  lcd.backlight();
  dht.begin();

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  
  gpsSerial.begin(9600, SERIAL_8N1, 16, 17); // GPS TX/RX

  lcd.print("Initializing...");
  delay(2000);
  lcd.clear();

  // ===== Wi-Fi Setup =====
  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi connected.");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void sendSensorData() {
  // Verify WiFi connection before sending request
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected! Attempting to reconnect...");
    WiFi.reconnect();
    delay(5000); // Wait for reconnection
    return;
  }

  HTTPClient http;
  http.begin(serverName);
  http.addHeader("Content-Type", "application/json");

  // Create JSON payload
  String jsonPayload = "{";
  jsonPayload += "\"temperature\":" + String(temp, 1) + ",";
  jsonPayload += "\"humidity\":" + String(hum, 1) + ",";
  jsonPayload += "\"distance_cm\":" + String(distance_cm, 1) + ",";
  jsonPayload += "\"mq3\":" + String(mq3_value) + ",";
  jsonPayload += "\"latitude\":" + String(lat, 6) + ",";
  jsonPayload += "\"longitude\":" + String(lng, 6);
  jsonPayload += "}";

  int httpResponseCode = http.POST(jsonPayload);
  
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("HTTP Response code: " + String(httpResponseCode));
    Serial.println(response);
  } else {
    Serial.print("Error on sending POST: ");
    Serial.println(httpResponseCode);
    
    // More detailed error logging
    Serial.println("Possible reasons for error:");
    Serial.println("1. Server unreachable");
    Serial.println("2. Network connectivity issue");
    Serial.println("3. Incorrect server URL");
    Serial.println("4. Firewall blocking request");
    
    // Print current network details for debugging
    Serial.print("Current IP: ");
    Serial.println(WiFi.localIP());
    Serial.print("Server URL: ");
    Serial.println(serverName);
  }

  http.end();
}

void loop() {
  // Read Ultrasonic Distance
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long duration = pulseIn(ECHO_PIN, HIGH);
  distance_cm = duration * 0.034 / 2;

  // Read DHT11
  temp = dht.readTemperature();
  hum = dht.readHumidity();

  // Read MQ3
  mq3_value = analogRead(MQ3_PIN);

  // Read GPS
  while (gpsSerial.available()) {
    gps.encode(gpsSerial.read());
  }
  lat = gps.location.isValid() ? gps.location.lat() : 0.0;
  lng = gps.location.isValid() ? gps.location.lng() : 0.0;

  // Display on LCD
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("T:");
  lcd.print(temp, 0);
  lcd.print(" H:");
  lcd.print(hum, 0);
  
  lcd.setCursor(0, 1);
  lcd.print("Dist:");
  lcd.print(distance_cm, 0);
  lcd.print("cm");

  // Debug via Serial
  Serial.printf("Temp: %.1f°C, Hum: %.1f%%, Dist: %.1fcm, MQ3: %d\n", temp, hum, distance_cm, mq3_value);
  Serial.printf("Lat: %.6f, Lng: %.6f\n", lat, lng);

  // Send sensor data to Django backend
  sendSensorData();

  delay(5000);  // Send data every 5 seconds
}
