import { describe, expect, it } from 'vitest'
import { demoLayout } from '../data/demoAd'
import { getSurface } from '../data/surfaces'
import { generateLayoutCandidates, normalizeLayout, rectanglesIntersect, solveLayout } from './index'
import { clampRectForSurface } from '../lib/bounds'

describe('adaptive layout engine', () => {
  it('normalizes source geometry relative to its canvas', () => {
    const normalized = normalizeLayout(demoLayout); const headline = normalized.elements.find((item) => item.element.id === 'headline')!
    expect(headline.relativeX).toBeCloseTo(80 / 1080); expect(headline.relativeWidth).toBeCloseTo(410 / 1080)
  })
  it('detects rectangle collisions', () => {
    expect(rectanglesIntersect({ x: 0, y: 0, width: 10, height: 10 }, { x: 9, y: 9, width: 10, height: 10 })).toBe(true)
    expect(rectanglesIntersect({ x: 0, y: 0, width: 10, height: 10 }, { x: 10, y: 0, width: 4, height: 4 })).toBe(false)
  })
  it('clamps invalid rectangles before display without changing the logical layout', () => {
    const rect = clampRectForSurface({ x: -40, y: 70, width: 400, height: 50 }, getSurface('mobile-banner'))
    expect(rect).toEqual({ x: 0, y: 50, width: 320, height: 50 })
  })
  it('keeps every solved element inside story safe bounds', () => {
    const surface = getSurface('instagram-story'); const result = solveLayout(demoLayout, surface, 'stacked')
    for (const element of result.layout.elements) { expect(element.rect.x).toBeGreaterThanOrEqual(surface.safeZone.left); expect(element.rect.y).toBeGreaterThanOrEqual(surface.safeZone.top); expect(element.rect.x + element.rect.width).toBeLessThanOrEqual(surface.width - surface.safeZone.right); expect(element.rect.y + element.rect.height).toBeLessThanOrEqual(surface.height - surface.safeZone.bottom) }
  })
  it('respects minimum text size and CTA touch target on a mobile banner', () => {
    const result = solveLayout(demoLayout, getSurface('mobile-banner'), 'banner-inline'); const headline = result.layout.elements.find((item) => item.id === 'headline')!; const cta = result.layout.elements.find((item) => item.type === 'cta')!
    expect(headline.type === 'text' && headline.fontSize).toBeGreaterThanOrEqual(headline.type === 'text' ? headline.minFontSize : 0); expect(cta.rect.width).toBeGreaterThanOrEqual(cta.type === 'cta' ? cta.minTouchTarget : 0); expect(cta.rect.height).toBeGreaterThanOrEqual(cta.type === 'cta' ? cta.minTouchTarget : 0)
  })
  it('preserves the locked image aspect ratio', () => {
    const image = solveLayout(demoLayout, getSurface('youtube-thumbnail'), 'banner-inline').layout.elements.find((item) => item.type === 'image')!
    expect(image.rect.width / image.rect.height).toBeCloseTo(demoLayout.elements.find((item) => item.type === 'image')!.rect.width / demoLayout.elements.find((item) => item.type === 'image')!.rect.height, 4)
  })
  it('is deterministic and resolves attempted collisions without unbounded work', () => {
    const surface = getSurface('instagram-story'); expect(solveLayout(demoLayout, surface, 'centered')).toEqual(solveLayout(demoLayout, surface, 'centered'))
  })
  it('moves the less-important element when an archetype creates a collision', () => {
    const source = { ...demoLayout, elements: [...demoLayout.elements, { ...demoLayout.elements.find((item) => item.id === 'headline')!, id: 'secondary-headline', importance: 'tertiary' as const }] }
    const result = solveLayout(source, getSurface('instagram-story'), 'stacked')
    expect(result.trace.some((action) => action.kind === 'move' && action.reason === 'collisionResolved' && action.elementId === 'secondary-headline')).toBe(true)
  })
  it('generates structurally distinct candidates for square to mobile banner', () => {
    const candidates = generateLayoutCandidates(demoLayout, getSurface('mobile-banner')); expect(candidates.map((candidate) => candidate.archetypeId)).toContain('banner-inline')
    const sourceHeadline = demoLayout.elements.find((item) => item.id === 'headline')!; const targetHeadline = candidates[0].layout.elements.find((item) => item.id === 'headline')!
    expect(targetHeadline.rect.x / sourceHeadline.rect.x).not.toBeCloseTo(targetHeadline.rect.width / sourceHeadline.rect.width)
  })
  it('produces stacked and centered candidates for a dramatic square to story conversion', () => {
    expect(generateLayoutCandidates(demoLayout, getSurface('instagram-story')).map((candidate) => candidate.archetypeId).sort()).toEqual(['centered', 'stacked'])
  })
})
