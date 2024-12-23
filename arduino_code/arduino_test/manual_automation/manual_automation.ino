#include <Stepper.h>
#define STEPS 32
Stepper myStepper(STEPS, 8, 10, 9, 11);  // Pin inversion to make the library work

int mode = 0; // 0: Cool, 1: Off, 2: Heat
unsigned long previousMillis = 0;
const long interval = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

void setup() {
  myStepper.setSpeed(400);
  Serial.begin(9600);
  setThermostatMode(0);  // Start with Cool mode
}

void loop() {
  unsigned long currentMillis = millis();

  // Check if 8 hours have passed
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    // Cycle through modes: 0 -> 1 -> 2 -> 0 ...
    mode = (mode + 1) % 3;
    setThermostatMode(mode);
  }
}

void setThermostatMode(int mode) {
  switch (mode) {
    case 0: // Cool
      Serial.println("Setting mode to Cool");
      myStepper.step(2048); // Move to Cool position (e.g., 1 full rotation)
      break;
    case 1: // Off
      Serial.println("Setting mode to Off");
      myStepper.step(-2048); // Move to Off position (e.g., back to initial position)
      break;
    case 2: // Heat
      Serial.println("Setting mode to Heat");
      myStepper.step(4096); // Move to Heat position (e.g., 2 full rotations)
      break;
  }
  delay(1000);  // Allow time for the stepper to reach the position
}