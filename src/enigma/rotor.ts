import { ALPHABET, letterToIndex, wrapIndex } from './alphabet'

export class Rotor {
  private readonly wiring: number[]

  constructor(wiring: string) {
    if (
      wiring.length !== ALPHABET.length ||
      new Set(wiring).size !== ALPHABET.length
    ) {
      throw new Error('Rotor wiring must contain each letter A–Z exactly once')
    }

    this.wiring = [...wiring].map(letterToIndex)
  }

  forward(input: number): number {
    if (!Number.isInteger(input) || input < 0 || input >= ALPHABET.length) {
      throw new Error('Expected an integer from 0 to 25')
    }

    const shiftedInput = wrapIndex(input + this.position)
    const wiredOutput = this.wiring[shiftedInput]!

    return wrapIndex(wiredOutput - this.position)
  }

  backward(input: number): number {
    if (!Number.isInteger(input) || input < 0 || input >= ALPHABET.length) {
      throw new Error('Expected an integer from 0 to 25')
    }

    const shiftedInput = wrapIndex(input + this.position)
    const wiredOutput = this.wiring.indexOf(shiftedInput)

    return wrapIndex(wiredOutput - this.position)
  }

  private position = 0

  step(): void {
    this.position = wrapIndex(this.position + 1)
  }

  setPosition(position: number): void {
    if (
      !Number.isInteger(position) ||
      position < 0 ||
      position >= ALPHABET.length
    ) {
      throw new Error('Expected an integer from 0 to 25')
    }

    this.position = position
  }

  getPosition(): number {
    return this.position
  }
}