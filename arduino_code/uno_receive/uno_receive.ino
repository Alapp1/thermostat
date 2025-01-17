#include <Stepper.h>
#define STEPS_PER_REVOLUTION 32
Stepper stepper(STEPS_PER_REVOLUTION, 8, 10, 9, 11);
const int stepsToCool = 1000;
const int stepsToHeat = -1000;
int currentPosition = 0;
enum Mode { OFF, COOL, HEAT };
Mode currentMode = OFF;

void setup() {
  stepper.setSpeed(400);
  Serial.begin(115200); 
  currentPosition = 0;
}

void loop() {
  static String cool = "cool";
  static String heat = "heat";
  static String off = "off";

  if (Serial.available() > 0){
    String message = Serial.readStringUntil('\n');
    message.trim();
    Serial.println(message);
    if (message.equals(cool)){
      changeModeToCool();
      Serial.println("set to cool");
    }
    else if (message.equals(heat)){
      changeModeToHeat();
      Serial.println("set to heat");
    }
    else if (message.equals(off)){
      changeModeToOff();
      Serial.println("set to off");
    }
    else{
      Serial.println("unrecognized command");
      return;
    }
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