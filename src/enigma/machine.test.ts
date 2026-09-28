import { expect, test } from 'vitest'
import { EnigmaMachine } from './machine'
import { Rotor } from './rotor'
import { Reflector } from './reflector'
import { Plugboard } from './plugboard'
import { ROTOR_WIRINGS, ROTOR_TURNOVERS } from './rotorData'
import { letterToIndex, indexToLetter } from './alphabet'

test('encrypts AAAAA as BDZGO with the default settings', () => {
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

  let encrypted = ''

  for (const letter of 'AAAAA') {
    encrypted += machine.pressKey(letter)
  }

  expect(encrypted).toBe('BDZGO')
})

test('double-steps the middle rotor on consecutive keypresses', () => {
  const left = new Rotor(ROTOR_WIRINGS.I, ROTOR_TURNOVERS.I)
  const middle = new Rotor(ROTOR_WIRINGS.II, ROTOR_TURNOVERS.II)
  const right = new Rotor(ROTOR_WIRINGS.III, ROTOR_TURNOVERS.III)

  const machine = new EnigmaMachine(
    left,
    middle,
    right,
    new Reflector('YRUHQSLDPXNGOKMIEBFZCWVJAT'),
    new Plugboard()
  )

  left.setPosition(letterToIndex('A'))
  middle.setPosition(letterToIndex('D'))
  right.setPosition(letterToIndex('U'))

  function positions(): string {
    return (
      indexToLetter(left.getPosition()) +
      indexToLetter(middle.getPosition()) +
      indexToLetter(right.getPosition())
    )
  }

  machine.pressKey('A')
  expect(positions()).toBe('ADV')

  machine.pressKey('A')
  expect(positions()).toBe('AEW')

  machine.pressKey('A')
  expect(positions()).toBe('BFX')
})

test('recovers a message after restoring non-default starting positions', () => {
  const left = new Rotor(ROTOR_WIRINGS.I, ROTOR_TURNOVERS.I)
  const middle = new Rotor(ROTOR_WIRINGS.II, ROTOR_TURNOVERS.II)
  const right = new Rotor(ROTOR_WIRINGS.III, ROTOR_TURNOVERS.III)

  left.setRingSetting(letterToIndex('B'))
  middle.setRingSetting(letterToIndex('D'))
  right.setRingSetting(letterToIndex('F'))

  const machine = new EnigmaMachine(
    left,
    middle,
    right,
    new Reflector('YRUHQSLDPXNGOKMIEBFZCWVJAT'),
    new Plugboard(['AZ', 'BY', 'CX'])
  )

  function resetPositions(): void {
    left.setPosition(letterToIndex('A'))
    middle.setPosition(letterToIndex('D'))
    right.setPosition(letterToIndex('U'))
  }

  function processMessage(message: string): string {
    let output = ''

    for (const letter of message) {
      output += machine.pressKey(letter)
    }

    return output
  }

  const original = 'ENIGMASIMULATOR'

  resetPositions()
  const encrypted = processMessage(original)

  resetPositions()
  const decrypted = processMessage(encrypted)

  expect(encrypted).not.toBe(original)
  expect(decrypted).toBe(original)
})