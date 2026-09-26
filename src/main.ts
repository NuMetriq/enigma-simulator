import './style.css'
import { Rotor } from './enigma/rotor'
import { indexToLetter, letterToIndex } from './enigma/alphabet'

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

  <p>Encryption is not connected yet.</p>
`

// Practice wiring: swap A and B, leaving other letters unchanged.
const rotor = new Rotor('BACDEFGHIJKLMNOPQRSTUVWXYZ')

rotor.setPosition(letterToIndex('Z'))

console.log(
  'Starting position:',
  indexToLetter(rotor.getPosition())
)

rotor.step()

console.log(
  'After one step:',
  indexToLetter(rotor.getPosition())
)

for (let i = 0; i < 26; i++) {
  rotor.step()
}

console.log(
  'After 26 more steps:',
  indexToLetter(rotor.getPosition())
)