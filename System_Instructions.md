## System objective

Translate human language into airflow and establish a reciprocal exchange through spoken poetry and human breath.

## Input

The system receives:

Human speech.

Heat-related words and expressions.

Silence.

Directed human exhalation.

## Processing

Capture acoustic input through the microphone.

Detect human speech.

Transcribe speech into written language.

Normalize English and Spanish vocabulary.

Compare the transcription with the heat lexicon.

Count recognized thermal references within a rolling time window.

Calculate the corresponding motor speed.

Monitor the duration of silence.

Generate poetry when the object reaches stillness after prolonged silence.

Detect human breath following the poetic invitation.

Acknowledge the reciprocal gesture.

Return to the listening state.

## Output

Fan blades spinning.

Variable airflow.

Spoken bilingual poetry.

Displayed language.

Poetic acknowledgment.

## Speed parameters

Heat references	 -  State	 -  Motor command
0	         -       Stillness	   -     0%
1-3	       -          Low	       -     35%
4–7	       -         Medium	     -     65%
8 or more	 -          High	     -     100%

## temporal parameters

Parameter	    -     Value
Vocabulary accumulation window	-  15 seconds
Silence before target speed becomes zero	-  5 seconds
Silence before poetic invitation	-  20 seconds
Minimum breath detection duration	-  450 milliseconds
Interval between repeated invitations	-  45 seconds

## System restrictions

Do not interpret speech volume as linguistic heat.

Do not count general connectors and prepositions as independent heat references.

Do not interpret the object's own poetry as human speech.

Do not interpret the object's own airflow as human breath.

Do not resume normal airflow generation until the reciprocal gesture has been recognized.

Stop motor operation safely in the event of a system failure.

The speed thresholds and timing values are experimental parameters subject to hardware calibration.
