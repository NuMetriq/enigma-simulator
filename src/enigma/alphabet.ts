export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export function letterToIndex(letter: string): number {
  if (letter.length !== 1 || !ALPHABET.includes(letter)) {
    throw new Error('Expected a single uppercase letter A–Z')
  }

  return ALPHABET.indexOf(letter)
}

export function indexToLetter(index: number): string {
  if (!Number.isInteger(index) || index < 0 || index >= ALPHABET.length) {
    throw new Error('Expected an integer from 0 to 25')
  }

  return ALPHABET.charAt(index)
}

export function wrapIndex(index: number): number {
  if (!Number.isInteger(index)) {
    throw new Error('Expected an integer')
  }

  const size = ALPHABET.length
  return ((index % size) + size) % size
}