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

function rotorOptions(selectedRotor: string): string {
  return Object.keys(ROTOR_WIRINGS)
    .map((name) => {
      const selected = name === selectedRotor ? 'selected' : ''

      return `<option value="${name}" ${selected}>${name}</option>`
    })
    .join('')
}

app.innerHTML = `
  <h1>Enigma Simulator</h1>
  <p>A three-rotor Enigma machine, built step by step.</p>

   <fieldset class="position-settings">
    <legend>Rotor selection — left to right</legend>

    <div class="position-grid">
      <div>
        <label for="left-rotor">Left rotor</label>
        <select id="left-rotor">
          ${rotorOptions('I')}
        </select>
      </div>

      <div>
        <label for="middle-rotor">Middle rotor</label>
        <select id="middle-rotor">
          ${rotorOptions('II')}
        </select>
      </div>

      <div>
        <label for="right-rotor">Right rotor</label>
        <select id="right-rotor">
          ${rotorOptions('III')}
        </select>
      </div>
    </div>

    <p>Choose three different rotors.</p>
    <p id="settings-error" role="alert"></p>
  </fieldset>

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

  <label for="plugboard-pairs">Plugboard pairs</label>
  <input
    id="plugboard-pairs"
    type="text"
    placeholder="AB CD EF"
    aria-describedby="plugboard-help"
  />
  <p id="plugboard-help">
    Enter pairs separated by spaces, such as AB CD EF.
    Each letter can appear only once. Leave blank for no plugs.
  </p>

  <button id="reset-settings" type="button">Reset settings</button>

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
    Reflector B 
    Input is converted to uppercase; only A–Z letters are processed.
  </p>
`

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

const leftRotor = document.querySelector<HTMLSelectElement>('#left-rotor')
const middleRotor = document.querySelector<HTMLSelectElement>('#middle-rotor')
const rightRotor = document.querySelector<HTMLSelectElement>('#right-rotor')
const settingsError = document.querySelector<HTMLParagraphElement>('#settings-error')

if (
  leftRotor === null ||
  middleRotor === null ||
  rightRotor === null ||
  settingsError === null
) {
  throw new Error('Could not find the rotor selection controls')
}

function isRotorName(name: string): name is keyof typeof ROTOR_WIRINGS {
  return Object.hasOwn(ROTOR_WIRINGS, name)
}

const plugboardPairs =
  document.querySelector<HTMLInputElement>('#plugboard-pairs')

if (plugboardPairs === null) {
  throw new Error('Could not find the plugboard input')
}

const resetSettings =
  document.querySelector<HTMLButtonElement>('#reset-settings')

if (resetSettings === null) {
  throw new Error('Could not find the reset button')
}

const updateOutput = (): void => {
  settingsError.textContent = ''
  ciphertext.value = ''

  const leftName = leftRotor.value
  const middleName = middleRotor.value
  const rightName = rightRotor.value

  if (
    !isRotorName(leftName) ||
    !isRotorName(middleName) ||
    !isRotorName(rightName)
  ) {
    settingsError.textContent = 'Choose a valid rotor for each position.'
    return
  }

  if (new Set([leftName, middleName, rightName]).size !== 3) {
    settingsError.textContent = 'Choose three different rotors.'
    return
  }

  const pairsText = plugboardPairs.value.trim().toUpperCase()
  const pairs = pairsText === '' ? [] : pairsText.split(/\s+/)

  let plugboard: Plugboard

  try {
    plugboard = new Plugboard(pairs)
  } catch (error) {
    settingsError.textContent =
      error instanceof Error
        ? error.message
        : 'Invalid plugboard settings.'

    return
  }

  const left = new Rotor(
    ROTOR_WIRINGS[leftName],
    ROTOR_TURNOVERS[leftName]
  )
  const middle = new Rotor(
    ROTOR_WIRINGS[middleName],
    ROTOR_TURNOVERS[middleName]
  )
  const right = new Rotor(
    ROTOR_WIRINGS[rightName],
    ROTOR_TURNOVERS[rightName]
  )

  left.setRingSetting(letterToIndex(leftRing.value))
  middle.setRingSetting(letterToIndex(middleRing.value))
  right.setRingSetting(letterToIndex(rightRing.value))

  left.setPosition(letterToIndex(leftPosition.value))
  middle.setPosition(letterToIndex(middlePosition.value))
  right.setPosition(letterToIndex(rightPosition.value))

  const machine = new EnigmaMachine(
    left,
    middle,
    right,
    new Reflector('YRUHQSLDPXNGOKMIEBFZCWVJAT'),
    plugboard
  )

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
leftRotor.addEventListener('change', updateOutput)
middleRotor.addEventListener('change', updateOutput)
rightRotor.addEventListener('change', updateOutput)
plugboardPairs.addEventListener('input', updateOutput)

resetSettings.addEventListener('click', () => {
  leftRotor.value = 'I'
  middleRotor.value = 'II'
  rightRotor.value = 'III'

  leftPosition.value = 'A'
  middlePosition.value = 'A'
  rightPosition.value = 'A'

  leftRing.value = 'A'
  middleRing.value = 'A'
  rightRing.value = 'A'

  plugboardPairs.value = ''

  updateOutput()
})

updateOutput()