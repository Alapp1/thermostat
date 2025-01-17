#include <ESP8266WiFi.h>
#include "credentials.h"
#include <AdafruitIO_WiFi.h>

AdafruitIO_WiFi io(AIO_USERNAME, AIO_KEY, WIFI_SSID, WIFI_PASS);
AdafruitIO_Feed *thermostat_feed = io.feed("thermostat");

void setup() {
  Serial.println(" ");
  Serial.begin(115200); 

  io.connect();
  thermostat_feed->onMessage(handler);
  Serial.println("Connected to Adafruit IO");
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected! Attempting to reconnect...");
    WiFi.reconnect();
  }
  io.run();
}

void handler(AdafruitIO_Data *data) {
  String command = data->toString();
  static String last_command = "";
  if (command == last_command) {
    Serial.println("Redundant command");
    return;
  }

  last_command = command;
   
  if (command == "cool") {
    Serial.println("cool");
  }
  else if (command == "heat") {
    Serial.println("heat");
  }
  else if (command == "off") {
    Serial.println("off");
  }
  else {
    Serial.println("Command not found");
  } 
}