import './style.css'
import { Rotor } from './enigma/rotor'
import { Reflector } from './enigma/reflector'
import { Plugboard } from './enigma/plugboard'
import { EnigmaMachine } from './enigma/machine'
import { ROTOR_WIRINGS, ROTOR_TURNOVERS } from './enigma/rotorData'
import { ALPHABET, letterToIndex } from './enigma/alphabet'

const app = document.querySelector<HTMLDivElement>('#app')

if (app === null) {
  throw new Error('Could not find the app element')
}

const letterOptions = [...ALPHABET]
  .map((letter) => `<option value="${letter}">${letter}</option>`)
  .join('')

app.innerHTML = `
  <h1>Enigma Simulator</h1>
  <p>A three-rotor Enigma machine, built step by step.</p>

  <fieldset class="position-settings">
    <legend>Starting positions</legend>

    <div class="position-grid">
      <div>
        <label for="left-position">Left · Rotor I</label>
        <select id="left-position">${letterOptions}</select>
      </div>

      <div>
        <label for="middle-position">Middle · Rotor II</label>
        <select id="middle-position">${letterOptions}</select>
      </div>

      <div>
        <label for="right-position">Right · Rotor III</label>
        <select id="right-position">${letterOptions}</select>
      </div>
    </div>

    <fieldset class="position-settings">
    <legend>Ring settings</legend>

    <div class="position-grid">
      <div>
        <label for="left-ring">Left · Rotor I</label>
        <select id="left-ring">${letterOptions}</select>
      </div>

      <div>
        <label for="middle-ring">Middle · Rotor II</label>
        <select id="middle-ring">${letterOptions}</select>
      </div>

      <div>
        <label for="right-ring">Right · Rotor III</label>
        <select id="right-ring">${letterOptions}</select>
      </div>
    </div>

    <p>Adjust the wiring offset relative to each rotor's displayed letter.</p>
  </fieldset>

    <p>Each message begins at these positions. Use the same settings to decrypt.</p>
  </fieldset>

  <label for="plaintext">Message</label>
  <textarea
    id="plaintext"
    rows="4"
    placeholder="Enter a message"
  ></textarea>

  <label for="ciphertext">Encrypted output</label>
  <textarea
    id="ciphertext"
    rows="4"
    readonly
  ></textarea>

  <p>
    Rotors: I–II–III ·  Reflector B · No plugs.
    Input is converted to uppercase; only A–Z letters are processed.
  </p>
`

const left = new Rotor(ROTOR_WIRINGS.I, ROTOR_TURNOVERS.I)
const middle = new Rotor(ROTOR_WIRINGS.II, ROTOR_TURNOVERS.II)
const right = new Rotor(ROTOR_WIRINGS.III, ROTOR_TURNOVERS.III)

const reflector = new Reflector('YRUHQSLDPXNGOKMIEBFZCWVJAT')
const plugboard = new Plugboard()

const machine = new EnigmaMachine(
  left,
  middle,
  right,
  reflector,
  plugboard
)

const plaintext = document.querySelector<HTMLTextAreaElement>('#plaintext')
const ciphertext = document.querySelector<HTMLTextAreaElement>('#ciphertext')

const leftPosition =
  document.querySelector<HTMLSelectElement>('#left-position')
const middlePosition =
  document.querySelector<HTMLSelectElement>('#middle-position')
const rightPosition =
  document.querySelector<HTMLSelectElement>('#right-position')

const leftRing = document.querySelector<HTMLSelectElement>('#left-ring')
const middleRing = document.querySelector<HTMLSelectElement>('#middle-ring')
const rightRing = document.querySelector<HTMLSelectElement>('#right-ring')

if (
  plaintext === null ||
  ciphertext === null ||
  leftPosition === null ||
  middlePosition === null ||
  rightPosition === null ||
  leftRing === null ||
  middleRing === null ||
  rightRing === null
) {
  throw new Error('Could not find the message or settings controls')
}

const updateOutput = (): void => {
  left.setRingSetting(letterToIndex(leftRing.value))
  middle.setRingSetting(letterToIndex(middleRing.value))
  right.setRingSetting(letterToIndex(rightRing.value))
  left.setPosition(letterToIndex(leftPosition.value))
  middle.setPosition(letterToIndex(middlePosition.value))
  right.setPosition(letterToIndex(rightPosition.value))

  const normalized = plaintext.value.toUpperCase().replace(/[^A-Z]/g, '')
  let output = ''

  for (const letter of normalized) {
    output += machine.pressKey(letter)
  }

  ciphertext.value = output
}

plaintext.addEventListener('input', updateOutput)

leftPosition.addEventListener('change', updateOutput)
middlePosition.addEventListener('change', updateOutput)
rightPosition.addEventListener('change', updateOutput)
leftRing.addEventListener('change', updateOutput)
middleRing.addEventListener('change', updateOutput)
rightRing.addEventListener('change', updateOutput)

updateOutput()