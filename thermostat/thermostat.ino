#include "credentials.h"

#include <ESP8266WiFi.h>
#include <AdafruitIO_WiFi.h>
#include <Servo.h>
#include <Wire.h>
#include <RTClib.h>

/** 
 * Adafruit IO for handling requests away from the network 
 * Currently 1 feed just for manual selection
 * Future feed for scheduling requests
 */
AdafruitIO_WiFi io(AIO_USERNAME, AIO_KEY, WIFI_SSID, WIFI_PASS);
AdafruitIO_Feed *thermostat_feed = io.feed("thermostat");

/** Servo object used to control the switch */
Servo servo;

/** Real time clock object for scheduling */
RTC_DS3231 rtc;

/** Instantiate cool and off positions as defined in thermostat.h */
const int cool_position = 90;
const int off_position = 0;


void setup() {
  /** Begin serial communication */
  Serial.begin(115200);

  /** Initialize servo */
  servo.attach(9);

  /** Connect to cloud service  */
  io.connect();

  /** Run handler upon message from thermostat_feed */
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
    servo.write(cool_position);
    Serial.println("Thermostat set to cool.");
  }
  else if (command == "off") {
    servo.write(off_position);
    Serial.println("Thermostat set to off.");
  }
  else {
    Serial.println("Command not found");
  }
}

