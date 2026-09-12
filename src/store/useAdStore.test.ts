import { describe, expect, it } from 'vitest'
import { demoLayout } from '../data/demoAd'
import { useAdStore } from './useAdStore'

describe('automatic target adaptation', () => {
  it('regenerates once from the immutable source layout when the target changes', async () => {
    const store = useAdStore.getState(); store.loadDemoCreative()
    const sourceBefore = structuredClone(useAdStore.getState().sourceLayout)
    useAdStore.getState().selectSurface('mobile-banner')
    expect(useAdStore.getState().isAdapting).toBe(true)
    await Promise.resolve()
    const state = useAdStore.getState()
    expect(state.selectedSurfaceId).toBe('mobile-banner')
    expect(state.adaptedLayout?.surfaceId).toBe('mobile-banner')
    expect(state.sourceLayout).toEqual(sourceBefore)
    expect(state.candidates[0]?.score).toBeGreaterThanOrEqual(state.candidates.at(-1)?.score ?? 0)
    expect(state.sourceLayout).toEqual(demoLayout)
  })
})
