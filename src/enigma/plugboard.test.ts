import { expect, test } from 'vitest'
import { Plugboard } from './plugboard'
import { letterToIndex } from './alphabet'

test('swaps paired letters in both directions and leaves others unchanged', () => {
  const plugboard = new Plugboard(['AB', 'CD'])

  expect(plugboard.swap(letterToIndex('A'))).toBe(letterToIndex('B'))
  expect(plugboard.swap(letterToIndex('B'))).toBe(letterToIndex('A'))
  expect(plugboard.swap(letterToIndex('Z'))).toBe(letterToIndex('Z'))
})

test('rejects a letter used in multiple pairs', () => {
  expect(() => new Plugboard(['AB', 'AC'])).toThrow(
    'A letter cannot appear in multiple plugboard pairs'
  )
})

test('rejects a letter paired with itself', () => {
  expect(() => new Plugboard(['AA'])).toThrow(
    'A plugboard pair must contain different letters'
  )
})

test('rejects incomplete pairs', () => {
  expect(() => new Plugboard(['A'])).toThrow(
    'Each plugboard pair must contain two letters'
  )
})

test('rejects characters outside A–Z', () => {
  expect(() => new Plugboard(['A1'])).toThrow(
    'Expected a single uppercase letter A–Z'
  )
})