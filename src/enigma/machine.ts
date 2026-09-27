import { Rotor } from './rotor'
import { Reflector } from './reflector'
import { Plugboard } from './plugboard'
import { letterToIndex, indexToLetter } from './alphabet'

export class EnigmaMachine {
  private readonly left: Rotor
  private readonly middle: Rotor
  private readonly right: Rotor
  private readonly reflector: Reflector
  private readonly plugboard: Plugboard

  constructor(
    left: Rotor,
    middle: Rotor,
    right: Rotor,
    reflector: Reflector,
    plugboard: Plugboard
  ) {
    this.left = left
    this.middle = middle
    this.right = right
    this.reflector = reflector
    this.plugboard = plugboard
  }

  stepRotors(): void {
    const middleAtTurnover = this.middle.isAtTurnover()
    const rightAtTurnover = this.right.isAtTurnover()

    if (middleAtTurnover) {
      this.left.step()
    }

    if (middleAtTurnover || rightAtTurnover) {
      this.middle.step()
    }

    this.right.step()
  }

  pressKey(letter: string): string {
    const input = letterToIndex(letter)

    this.stepRotors()

    const output = this.passThrough(input)
    return indexToLetter(output)
  }

  passThrough(input: number): number {
    let signal = this.plugboard.swap(input)

    signal = this.right.forward(signal)
    signal = this.middle.forward(signal)
    signal = this.left.forward(signal)

    signal = this.reflector.reflect(signal)

    signal = this.left.backward(signal)
    signal = this.middle.backward(signal)
    signal = this.right.backward(signal)

    return this.plugboard.swap(signal)
  }
}