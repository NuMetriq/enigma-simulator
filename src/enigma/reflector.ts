import { ALPHABET, letterToIndex } from './alphabet'

export class Reflector {
  private readonly wiring: number[]

  constructor(wiring: string) {
    if (
      wiring.length !== ALPHABET.length ||
      new Set(wiring).size !== ALPHABET.length
    ) {
      throw new Error('Reflector wiring must contain each letter A–Z exactly once')
    }

    this.wiring = [...wiring].map(letterToIndex)

    for (let input = 0; input < ALPHABET.length; input++) {
      const output = this.wiring[input]!

      if (output === input) {
        throw new Error('A reflector cannot connect a letter to itself')
      }

      if (this.wiring[output] !== input) {
        throw new Error('Reflector connections must work in both directions')
      }
    }
  }

  reflect(input: number): number {
    if (!Number.isInteger(input) || input < 0 || input >= ALPHABET.length) {
      throw new Error('Expected an integer from 0 to 25')
    }

    return this.wiring[input]!
  }
}