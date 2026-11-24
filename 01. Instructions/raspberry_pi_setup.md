
## Objective

Configure the Raspberry Pi 5 as the computational system responsible for acoustic input, linguistic interpretation, poetry generation and motor control.

## Operating system

Raspberry Pi OS, 64-bit.

## Software environment

Python 3

Whisper — multilingual speech recognition

WebRTC VAD — voice activity detection

NumPy — acoustic signal analysis

SoundDevice — microphone input

eSpeak NG — speech synthesis

JSON — vocabulary storage

PWM — compatible motor speed control

## Hardware connections

Connect the following components:

USB microphone.

Speaker or compatible audio output device.

Digital display.

Compatible motor controller.

External motor power supply.

Raspberry Pi power supply.

The motor must not be powered directly through the Raspberry Pi GPIO pins.


## Project preparation

Transfer the Ally project files to the Raspberry Pi.

Preserve the relative paths between the Python program and the English and Spanish vocabulary folders, or update the paths in the program accordingly.

## Initial testing

Before connecting the physical motor, test the linguistic interaction in simulation mode:

python fan.py --text

Enter heat-related sentences in English or Spanish.

Observe the recognized words and simulated motor speed.

Allow the system to enter silence and generate a poetic invitation.

Enter /blow to simulate the reciprocal breath gesture.

## Hardware calibration

After completing the simulated tests:

1. Calibrate microphone sensitivity.

2. Test speech recognition in both languages.

3. Measure background acoustic noise.

4. alibrate breath detection.

5. Verify that the speaker does not trigger speech recognition.

6. Verify that the fan does not trigger breath detection.

7. Establish safe minimum and maximum motor speeds.

8. Test the complete reciprocal interaction.

## Development status

The software remains an experimental prototype. The final motor driver, GPIO configuration, display integration and installation dependencies must be verified before physical operation.
