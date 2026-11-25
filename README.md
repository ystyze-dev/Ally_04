# Ally_04
This is a fan that misbehave have fun


Ally

A RRECIPROCAL OBJECT

A breeze shaped by words, A breath returned by your body

## Project Description

Ally is an interactive fan conceived as an extension of the human subject. Through speech recognition, linguistic interpretation, generative poetry and physical movement, the object establishes a reciprocal relationship with the subject. 

The fan listens to human speech and identifies words, expressions and discourses associated with heat. The accumulation of thermal references determines the intensity of its airflow. 

When the subject stops speaking about heat, the fan gradually decreases its speed until it reaches stillness. After prolonged silence, a bilingual poem using the heat vocabulary appears for the subject to read. The poem remains visible until the subject breathes into the microphone; the fan then dissolves it and returns to listening for speech.

Through this poetic invitation, the subject is encouraged to approach the microphone and return their breath to the object. 

## Research question

How can a functional object transcend its condition of service and establish a relationship of reciprocity with the human subject? 

## Conceptual framework

1. Object as an extension of the subject/human.
2. Reciprocity and mutual dependence.
3. Language as a generator of physical phenomena.
4. Heat as a physical, emotional, environmental and symbolic condition.
5. Breath as a material expression of exchange.
6. Poetry as a form of communication between human and object.

## Interaction

Human speech - Linguistic heat - air flow fan - human silence - Poetry display - Human breath - reciprocity

## Technology

1. Raspberry pi 5
2. Speech recognition
3. Bilingual Heat vocabulary
4. Generative Poetry
5. Acoustic breath detection
6. Motor speed control
7. Speech synthesis
8. Digital display

## Project status

tbd

## Physical appearance

Ally is a ceiling-suspended circular fan with a retro-industrial aesthetic.

The object consists of four terracotta-colored blades enclosed within a pale sage-green protective structure.

A smaller electronic interface is suspended beneath the fan, establishing a point of proximity between the object and the human subject.

## Physical design

Color palette

Color	HEX	Application
Ivory	#F3F0E7	Background and neutral surfaces
Sage green	#A5B4A8	Structural elements and protective grille
Terracotta	#C87B54	Rotating blades
Deep green	#29352F	Electronic display
Material exploration

## The material and visual research explores:

Heat and thermal transformation.

Melting and liquefaction.

Perspiration and bodily moisture.

Evaporation and condensation.

Dryness and aridity.

Desire and intimacy.

Traces and residues of heat.

## Design intention

The visual language of Ally contrasts the familiarity of a domestic appliance with the unfamiliarity of an object capable of expressing its own needs.

Its appearance suggests a functional object, while its behaviour establishes a relational and poetic presence.

## Electronic interface

## Description

The electronic interface is the point of linguistic and bodily communication between Ally and the human subject.

It contains a microphone, speaker and digital display.

## Microphone

The microphone receives human speech and detects the directed exhalation through which the subject reciprocates the object's airflow.

## Speaker

The current prototype presents bilingual poetry on the display for the subject to read; it does not read the poem aloud.

## Display

The display provides a visual manifestation of the object's linguistic expression.

The typography draws from the original generative poetry experiment:

1. Monospaced typography.

2. English words in regular weight.

3. Spanish words in bold.

4. The letter e highlighted in red.

5. Individual letters behaving as particles.

## Display behaviour

State	 -  Visual expression

## Phase 1
State: State Listening
Visual expresion: Minimal visual activity

## Phase 2
State: Heat recognition
Visual expression: Thermal words appear

## Phase 3
State: Stillness
Visual expression: Visual activity decreases

## Phase 4
State: Poetic invitation
Visual expression: Bilingual poetry appears

## Phase 5
State: Waiting for breath	
Visual expression: Poetry remains visible

## Phase 6
State: Breath received
Visual expression: Letters disperse

## Phase 7
State: Renewal
Visual expression: Display returns to listening

## Breath and typography

The subject's exhalation dissolves the displayed poem into individual typographic particles.

Language becomes visually unstable through the same material substance that completes the reciprocal exchange: air.

## Development status

The typographic behaviour is based on the earlier p5.js experiment. Its integration with the Raspberry Pi motor and speech-control system remains under development.

## Website and project sources

The browser prototype in `Ally_Website/` loads the project's vocabulary, poetry banks, behavior documents, instructions, code, images, hardware research, and archives into an internal data store. These materials inform the interaction and remain hidden from the website's public interface. The merged `Heat-lexicon.json` files are retained as reference material; the prototype uses the valid category JSON files for heat recognition.

Serve the repository root over localhost so the browser can read the sibling folders:

```sh
python3 -m http.server --bind 127.0.0.1 8000
```

Then open `http://127.0.0.1:8000/Ally_Website/`. When adding or moving project files, update `Ally_Website/data/project-sources.json` so the internal data store can include them.
