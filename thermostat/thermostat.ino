#include "credentials.h"
#include <ESP8266WiFi.h>
#include <AdafruitIO_WiFi.h>
#include <Servo.h>
#include <Wire.h>
#include <RTClib.h>
#include <Stepper.h>

#define STEPS_PER_REVOLUTION 32

/** 
 * Adafruit IO for handling requests away from the network 
 * Currently 1 feed just for manual selection
 * Future feed for scheduling requests
 */
AdafruitIO_WiFi io(AIO_USERNAME, AIO_KEY, WIFI_SSID, WIFI_PASS);
AdafruitIO_Feed *thermostat_feed = io.feed("thermostat");


/** Real time clock object for scheduling */
RTC_DS3231 rtc;

Stepper stepper(STEPS_PER_REVOLUTION, 8, 10, 9, 11);

const int stepsToCool = 1000;
const int stepsToHeat = -1000;

enum Mode { OFF, COOL, HEAT };
Mode currentMode = OFF;

int currentPosition = 0;



void setup() {
  Serial.println(" ");
  stepper.setSpeed(400);
  currentMode = OFF;
  currentPosition = 0;
  Serial.begin(9600); 

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
    changeModeToCool();
    Serial.println("Thermostat set to cool.");
  }
  else if (command == "off") {
    changeModeToOff();
    Serial.println("Thermostat set to off.");
  }
  else {
    Serial.println("Command not found");
  }
  
}



void changeModeToCool() {
  if (currentMode != COOL) {
    stepper.step(stepsToCool);
    currentPosition += stepsToCool;
  } else if (currentMode == COOL) {
    Serial.println("Already in Cool mode.");
    return;
  }
  currentMode = COOL;
  delay(1000);
  returnToNeutral();
  Serial.println("Mode changed to Cool and returned to neutral.");
}

void changeModeToHeat() {
  if (currentMode != HEAT) {
    stepper.step(stepsToHeat);
    currentPosition += stepsToHeat;
  } else if (currentMode == HEAT) {
    Serial.println("Already in Heat mode.");
    return;
  }
  currentMode = HEAT;
  delay(1000);
  returnToNeutral();
  Serial.println("Mode changed to Heat and returned to neutral.");
}

void changeModeToOff() {
  if (currentMode == COOL) {
    stepper.step(-stepsToCool);
    currentPosition += -stepsToCool;
  } else if (currentMode == HEAT) {
    stepper.step(-stepsToHeat);
    currentPosition += -stepsToHeat;
  } else if (currentMode == OFF) {
    Serial.println("Already in Off mode");
    return;
  }
  currentMode = OFF;
  delay(1000);
  returnToNeutral();
  Serial.println("Mode changed to Off and returned to neutral.");
}

void returnToNeutral() {
  int stepsToNeutral = -currentPosition;
  stepper.step(stepsToNeutral);
  currentPosition = 0;
}
