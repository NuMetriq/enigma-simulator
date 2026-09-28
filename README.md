# Enigma Simulator

An interactive, browser-based simulation of a three-rotor Enigma machine,
built with TypeScript and Vite.

Choose rotor order, starting positions, ring settings, and plugboard
connections, then encrypt or decrypt a message.

## Features

- Three distinct rotors selected from historical rotors I–V
- Configurable starting positions and ring settings
- Reflector B
- Plugboard pairs with validation
- Rotor turnover and middle-rotor double-stepping
- Live output when messages or settings change
- Settings reset and responsive controls
- Automated tests using Vitest

## Run locally

Developed and tested with Node.js 24.

```bash
git clone https://github.com/NuMetriq/enigma-simulator.git
cd enigma-simulator
npm install
npm run dev
```

Open the local URL printed in the terminal.

## Using the simulator

1. Choose three different rotors, ordered left to right.
2. Choose each rotor's starting position and ring setting.
3. Optionally enter plugboard pairs separated by spaces, such as `AB CD EF`.
4. Enter your message to see the output.

Input is converted to uppercase, and characters outside A–Z are removed
from the processed message. Spaces and punctuation are not preserved.

Each edit processes the entire message from the selected starting positions.
The position controls show those starting settings, not the rotors'
positions after processing.

To decrypt, keep exactly the same settings and paste the ciphertext into
the Message box.

**Reset settings** restores rotors I–II–III, positions AAA, rings AAA, and
an empty plugboard. It keeps the message and recalculates the output.

## Try an example

With the default settings:

```text
Input:  AAAAA
Output: BDZGO
```

Entering `BDZGO` with those same settings produces `AAAAA`.

## How it works

Each keypress advances the rotors before processing the letter.

The signal travels through the plugboard, then through the right, middle,
and left rotors. Reflector B sends it back through the inverse rotor
mappings, followed by a second pass through the plugboard.

The middle rotor can advance on consecutive keypresses. The stepping
logic checks turnover positions before moving any rotors.

The encryption engine is separate from the browser interface.

## Project structure

| File | Responsibility |
|---|---|
| `src/main.ts` | Interface, settings validation, and event handling |
| `src/style.css` | Layout and styling |
| `src/enigma/alphabet.ts` | Letter conversion and modular wrapping |
| `src/enigma/rotor.ts` | Rotor wiring, position, rings, and turnover |
| `src/enigma/rotorData.ts` | Historical rotor mappings and turnover letters |
| `src/enigma/reflector.ts` | Reciprocal reflector mapping |
| `src/enigma/plugboard.ts` | Letter-pair connections and validation |
| `src/enigma/machine.ts` | Rotor stepping and complete signal path |

## Tests and production build

```bash
npm test
npm run build
```

Tests cover default encryption, double-stepping, round-trip recovery,
plugboard validation, and a published Py-Enigma example with non-default
settings.

The production build is generated in `dist/`. Preview it locally with:

```bash
npm run preview
```

## References

- [Historical rotor wiring — David Hamer / Enigma Museum](https://enigmamuseum.com/rotwirg.htm)
- [Double-stepping — David Hamer](https://www.cryptomuseum.com/people/hamer/files/double_stepping.pdf)
- [Independent reference example — Py-Enigma](https://py-enigma.readthedocs.io/en/latest/guide.html#example-communication-procedure)

## Scope

This project is an educational historical simulator. It models the
three-rotor configuration with rotors I–V and Reflector B.

Signal-path animation is planned as a possible future enhancement.