import { ALPHABET, letterToIndex } from './alphabet'

export class Plugboard {
  private readonly wiring: number[]

  constructor(pairs: string[] = []) {
    this.wiring = [...ALPHABET].map(letterToIndex)

    const usedLetters = new Set<string>()

    for (const pair of pairs) {
      if (pair.length !== 2) {
        throw new Error('Each plugboard pair must contain two letters')
      }

      const first = pair.charAt(0)
      const second = pair.charAt(1)

      const firstIndex = letterToIndex(first)
      const secondIndex = letterToIndex(second)

      if (first === second) {
        throw new Error('A plugboard pair must contain different letters')
      }

      if (usedLetters.has(first) || usedLetters.has(second)) {
        throw new Error('A letter cannot appear in multiple plugboard pairs')
      }

      usedLetters.add(first)
      usedLetters.add(second)

      this.wiring[firstIndex] = secondIndex
      this.wiring[secondIndex] = firstIndex
    }
  }

  swap(input: number): number {
    if (!Number.isInteger(input) || input < 0 || input >= ALPHABET.length) {
      throw new Error('Expected an integer from 0 to 25')
    }

    return this.wiring[input]!
  }
}