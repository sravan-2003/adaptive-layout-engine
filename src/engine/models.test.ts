import { describe, expect, it } from 'vitest'
import { demoLayout } from '../data/demoAd'
import { targetSurfaces } from '../data/surfaces'
import { LayoutSchema } from './models'
import { scoringConfig } from './scoring'

describe('editor domain models', () => {
  it('validates the seeded layout and its discriminated elements', () => {
    const elements = LayoutSchema.parse(demoLayout).elements
    expect(elements).toHaveLength(9)
    expect(elements.filter((element) => element.type === 'feature')).toHaveLength(3)
  })
  it('contains the five required target surfaces', () => expect(targetSurfaces).toHaveLength(5))
  it('keeps score weights centralized and normalized', () => expect(Object.values(scoringConfig.weights).reduce((total, weight) => total + weight, 0)).toBe(1))
})
