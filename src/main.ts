import './style.css'
import { Rotor } from './enigma/rotor'
import { Reflector } from './enigma/reflector'
import { Plugboard } from './enigma/plugboard'
import { EnigmaMachine } from './enigma/machine'
import { ROTOR_WIRINGS, ROTOR_TURNOVERS } from './enigma/rotorData'

const app = document.querySelector<HTMLDivElement>('#app')

if (app === null) {
  throw new Error('Could not find the app element')
}

app.innerHTML = `
  <h1>Enigma Simulator</h1>
  <p>A three-rotor Enigma machine, built step by step.</p>

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
    Settings: I–II–III · Positions: AAA · Rings: AAA · Reflector B · No plugs.
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

if (plaintext === null || ciphertext === null) {
  throw new Error('Could not find the message text boxes')
}

function encryptMessage(message: string): string {
  left.setPosition(0)
  middle.setPosition(0)
  right.setPosition(0)

  const normalized = message.toUpperCase().replace(/[^A-Z]/g, '')
  let output = ''

  for (const letter of normalized) {
    output += machine.pressKey(letter)
  }

  return output
}

plaintext.addEventListener('input', () => {
  ciphertext.value = encryptMessage(plaintext.value)
})