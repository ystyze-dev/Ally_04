## Arduino code

// =====================================================
// ALLY
// A voice-responsive and reciprocal fan
//
// Arduino + Servo Motor
// Mechanical pull-chain control
//
// HEAT WORD THRESHOLDS:
// 0-2 words  = OFF
// 3-4 words  = LOW
// 5-9 words  = MEDIUM
// 10+ words  = HIGH
//
// PHYSICAL SWITCH SEQUENCE:
// OFF -> LOW -> MEDIUM -> HIGH -> OFF
// =====================================================

#include <Servo.h>

// =====================================================
// 1. SERVO CONFIGURATION
// =====================================================

Servo chainServo;

const int SERVO_PIN = 9;

// Servo rotation angles
// Adjust according to the physical mechanism.

const int REST_ANGLE = 20;
const int PULL_ANGLE = 80;

// Servo movement timing in milliseconds

const int MOVEMENT_DELAY = 15;
const int PULL_TIME = 500;
const int RELEASE_TIME = 700;
const int BETWEEN_PULLS = 500;

int servoPosition = REST_ANGLE;

// =====================================================
// 2. HEAT WORD THRESHOLDS
// =====================================================

const int LOW_THRESHOLD = 3;
const int MEDIUM_THRESHOLD = 5;
const int HIGH_THRESHOLD = 10;

int heatWordCount = 0;

// =====================================================
// 3. FAN STATES
// =====================================================

enum FanState {
  OFF = 0,
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3
};

FanState currentState = OFF;
FanState targetState = OFF;

bool synchronized = false;

// Serial communication variables

String serialInput = "";
bool inputOverflow = false;

// =====================================================
// 4. SETUP
// =====================================================

void setup() {

  Serial.begin(9600);

  chainServo.attach(SERVO_PIN);

  chainServo.write(REST_ANGLE);

  servoPosition = REST_ANGLE;

  delay(1000);

  Serial.println("");
  Serial.println("==============================");
  Serial.println("ALLY - HEAT RESPONSIVE FAN");
  Serial.println("==============================");
  Serial.println("Servo initialized.");
  Serial.println("");
  Serial.println("Confirm actual fan position:");
  Serial.println("SYNC OFF");
  Serial.println("SYNC LOW");
  Serial.println("SYNC MEDIUM");
  Serial.println("SYNC HIGH");
  Serial.println("");
  Serial.println("After synchronization,");
  Serial.println("enter the number of HEAT words.");
  Serial.println("");
  Serial.println("0-2  = OFF");
  Serial.println("3-4  = LOW");
  Serial.println("5-9  = MEDIUM");
  Serial.println("10+  = HIGH");
  Serial.println("==============================");
}

// =====================================================
// 5. MAIN LOOP
// =====================================================

void loop() {

  while (Serial.available() > 0) {

    char incoming = Serial.read();

    if (incoming == '\n') {

      if (!inputOverflow) {

        serialInput.trim();
        processCommand(serialInput);

      } else {

        Serial.println("Command too long.");
      }

      serialInput = "";
      inputOverflow = false;

    } else if (incoming != '\r') {

      if (serialInput.length() < 32) {

        serialInput += incoming;

      } else {

        inputOverflow = true;
      }
    }
  }
}

// =====================================================
// 6. SERIAL COMMAND PROCESSING
// =====================================================

void processCommand(String command) {

  command.trim();
  command.toUpperCase();

  if (command.length() == 0) {
    return;
  }

  // Manually synchronize the Arduino with
  // the actual physical position of the fan.
  // These commands do not move the servo.

  if (command == "SYNC OFF") {

    synchronizeFan(OFF);
    return;
  }

  if (command == "SYNC LOW") {

    synchronizeFan(LOW);
    return;
  }

  if (command == "SYNC MEDIUM") {

    synchronizeFan(MEDIUM);
    return;
  }

  if (command == "SYNC HIGH") {

    synchronizeFan(HIGH);
    return;
  }

  // Display the current system status

  if (command == "STATUS") {

    printStatus();
    return;
  }

  // Test one complete pull and release

  if (command == "PULL") {

    if (!synchronized) {

      Serial.println("Synchronize fan first.");
      return;
    }

    pullChain();

    targetState = currentState;

    return;
  }

  // Return the fan to OFF

  if (command == "STOP") {

    if (!synchronized) {

      Serial.println("Synchronize fan first.");
      return;
    }

    heatWordCount = 0;
    targetState = OFF;

    changeFanState(targetState);

    return;
  }

  // Check whether the command is a word count

  bool validNumber = true;

  for (unsigned int i = 0;
       i < command.length(); i++) {

    if (!isDigit(command[i])) {

      validNumber = false;
      break;
    }
  }

  if (!validNumber) {

    Serial.println("Invalid command.");
    return;
  }

  if (!synchronized) {

    Serial.println("Synchronize fan first.");
    return;
  }

  // Count HEAT words.
  // Cap at ten to avoid integer overflow.
  // Any number above ten also means HIGH.

  heatWordCount = 0;

  for (unsigned int i = 0;
       i < command.length(); i++) {

    heatWordCount =
      heatWordCount * 10 +
      (command[i] - '0');

    if (heatWordCount >= HIGH_THRESHOLD) {

      heatWordCount = HIGH_THRESHOLD;
      break;
    }
  }

  targetState =
    calculateFanState(heatWordCount);

  Serial.println("");
  Serial.println("------------------------------");

  Serial.print("HEAT words: ");

  if (heatWordCount >= HIGH_THRESHOLD) {

    Serial.println("10+");

  } else {

    Serial.println(heatWordCount);
  }

  Serial.print("Current fan state: ");
  printFanState(currentState);

  Serial.print("Desired fan state: ");
  printFanState(targetState);

  changeFanState(targetState);
}

// =====================================================
// 7. HEAT WORD INTERPRETATION
// =====================================================

FanState calculateFanState(int words) {

  if (words >= HIGH_THRESHOLD) {

    return HIGH;
  }

  if (words >= MEDIUM_THRESHOLD) {

    return MEDIUM;
  }

  if (words >= LOW_THRESHOLD) {

    return LOW;
  }

  return OFF;
}

// =====================================================
// 8. SMOOTH SERVO ROTATION
// =====================================================

void moveServoSmoothly(int targetAngle) {

  targetAngle = constrain(
    targetAngle, 0, 180
  );

  if (servoPosition < targetAngle) {

    for (int angle = servoPosition;
         angle <= targetAngle;
         angle++) {

      chainServo.write(angle);

      delay(MOVEMENT_DELAY);
    }

  } else if (servoPosition > targetAngle) {

    for (int angle = servoPosition;
         angle >= targetAngle;
         angle--) {

      chainServo.write(angle);

      delay(MOVEMENT_DELAY);
    }
  }

  servoPosition = targetAngle;
}

// =====================================================
// 9. MECHANICAL PULL AND RELEASE
// =====================================================

void pullChain() {

  Serial.println("Servo: pulling chain");

  // Rotate servo to pull the chain

  moveServoSmoothly(PULL_ANGLE);

  delay(PULL_TIME);

  // Return servo to its resting position

  Serial.println("Servo: releasing chain");

  moveServoSmoothly(REST_ANGLE);

  delay(RELEASE_TIME);

  // Allow the chain to return completely

  delay(BETWEEN_PULLS);

  // Advance one position in the physical
  // switch sequence.

  currentState = (FanState)(
    ((int)currentState + 1) % 4
  );

  Serial.print("New switch position: ");

  printFanState(currentState);
}

// =====================================================
// 10. CALCULATE REQUIRED CHAIN PULLS
// =====================================================

void changeFanState(FanState desiredState) {

  if (!synchronized) {

    Serial.println("Synchronize fan first.");
    return;
  }

  // Calculate the number of forward pulls
  // necessary to reach the desired state.

  int requiredPulls = (
    (int)desiredState -
    (int)currentState + 4
  ) % 4;

  Serial.print("Required chain pulls: ");
  Serial.println(requiredPulls);

  // If the fan is already at the desired
  // speed, the servo remains stationary.

  if (requiredPulls == 0) {

    Serial.println("No movement required.");

    Serial.print("STATE:");
    printFanState(currentState);

    return;
  }

  // Perform the required number of pulls.

  for (int i = 0; i < requiredPulls; i++) {

    Serial.print("Pull ");
    Serial.print(i + 1);
    Serial.print(" of ");
    Serial.println(requiredPulls);

    pullChain();
  }

  Serial.println("");
  Serial.println("Transition completed.");

  Serial.print("STATE:");
  printFanState(currentState);

  Serial.println("------------------------------");
}

// =====================================================
// 11. MANUAL SYNCHRONIZATION
// =====================================================

void synchronizeFan(FanState actualState) {

  currentState = actualState;
  targetState = actualState;

  synchronized = true;

  Serial.print("Fan synchronized: ");

  printFanState(currentState);
}

// =====================================================
// 12. PRINT FAN STATE
// =====================================================

void printFanState(FanState state) {

  switch (state) {

    case OFF:

      Serial.println("OFF");
      break;

    case LOW:

      Serial.println("LOW");
      break;

    case MEDIUM:

      Serial.println("MEDIUM");
      break;

    case HIGH:

      Serial.println("HIGH");
      break;
  }
}

// =====================================================
// 13. SYSTEM STATUS
// =====================================================

void printStatus() {

  Serial.println("");
  Serial.println("===== ALLY STATUS =====");

  Serial.print("Synchronized: ");

  Serial.println(
    synchronized ? "YES" : "NO"
  );

  Serial.print("HEAT words: ");
  Serial.println(heatWordCount);

  Serial.print("Current fan state: ");

  if (synchronized) {

    printFanState(currentState);

  } else {

    Serial.println("UNKNOWN");
  }

  Serial.print("Target fan state: ");
  printFanState(targetState);

  Serial.print("Servo position: ");
  Serial.println(servoPosition);

  Serial.println("=======================");
}

// =====================================================
// END OF ALLY ARDUINO CODE
// =====================================================
