#include <Stepper.h>
#define STEPS_PER_REVOLUTION 32
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
  Serial.println("Enter 'c' for Cool, 'h' for Heat, or 'o' for Off:");
}

void loop() {
  if (Serial.available() > 0) {
    char input = Serial.read();
    input = tolower(input);
    if (input == 'c' || input == 'h' || input == 'o') {
      switch (input) {
        case 'c':
          changeModeToCool();
          break;
        case 'h':
          changeModeToHeat();
          break;
        case 'o':
          changeModeToOff();
          break;
        default:
          Serial.println("Invalid input. Enter 'c' for Cool, 'h' for Heat, or 'o' for Off:");
          break;
      }
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