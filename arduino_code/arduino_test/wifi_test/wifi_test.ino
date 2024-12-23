#include <SoftwareSerial.h>

// Create a SoftwareSerial object to communicate with ESP8266
SoftwareSerial espSerial(10, 11); // RX, TX

void setup() {
  // Start the hardware serial port for communication with the Serial Monitor
  Serial.begin(9600);
  // Start the software serial port for communication with the ESP8266
  espSerial.begin(9600);

  // Wait for the ESP8266 to be ready
  delay(1000);

  // Send an "AT" command to test communication
  Serial.println("Sending AT command to ESP8266...");
  delay(1000);
  espSerial.println("AT");
}

void loop() {
  // Check if there's data available from ESP8266
  if (espSerial.available()) {
    String espResponse = espSerial.readString();
    Serial.print("ESP8266 Response: ");
    Serial.println(espResponse);
  }

  // Check if there's data available from Serial Monitor
  if (Serial.available()) {
    String command = Serial.readString();
    espSerial.println(command); // Send the command to ESP8266
  }
}
