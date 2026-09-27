import { ALPHABET, letterToIndex, wrapIndex } from './alphabet'

export class Rotor {
  private readonly wiring: number[]
  private readonly turnoverPosition: number

  constructor(wiring: string, turnoverLetter: string) {
    if (
      wiring.length !== ALPHABET.length ||
      new Set(wiring).size !== ALPHABET.length
    ) {
      throw new Error('Rotor wiring must contain each letter A–Z exactly once')
    }

    this.wiring = [...wiring].map(letterToIndex)
    this.turnoverPosition = letterToIndex(turnoverLetter)
  }

  forward(input: number): number {
    if (!Number.isInteger(input) || input < 0 || input >= ALPHABET.length) {
      throw new Error('Expected an integer from 0 to 25')
    }

    const offset = this.position - this.ringSetting
    const shiftedInput = wrapIndex(input + offset)
    const wiredOutput = this.wiring[shiftedInput]!

    return wrapIndex(wiredOutput - offset)
  }

  backward(input: number): number {
    if (!Number.isInteger(input) || input < 0 || input >= ALPHABET.length) {
      throw new Error('Expected an integer from 0 to 25')
    }

    const offset = this.position - this.ringSetting
    const shiftedInput = wrapIndex(input + offset)
    const wiredOutput = this.wiring.indexOf(shiftedInput)

    return wrapIndex(wiredOutput - offset)
  }

  private position = 0
  private ringSetting = 0

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

  setRingSetting(ringSetting: number): void {
    if (
      !Number.isInteger(ringSetting) ||
      ringSetting < 0 ||
      ringSetting >= ALPHABET.length
    ) {
      throw new Error('Expected an integer from 0 to 25')
    }

    this.ringSetting = ringSetting
  }

  isAtTurnover(): boolean {
    return this.position === this.turnoverPosition
  }
}