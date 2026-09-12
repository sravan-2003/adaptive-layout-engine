import { applicableArchetypes } from './archetypes'
import { solveLayout } from './solver/solve'
import type { EngineCandidate, Layout, Surface } from './types'
export { normalizeLayout } from './normalize'
export { solveLayout } from './solver/solve'
export { rectanglesIntersect } from './solver/collisions'
export type { ArchetypeId, EngineCandidate, TraceAction } from './types'
/** Temporary deterministic ranking used for automatic preview selection until full scoring is implemented. */
export function rankCandidates(candidates: EngineCandidate[]): EngineCandidate[] {
  return candidates.map((candidate) => {
    const unresolved = candidate.trace.filter((action) => action.reason === 'collisionUnresolved').length
    const resolved = candidate.trace.filter((action) => action.reason === 'collisionResolved').length
    const safeZoneMoves = candidate.trace.filter((action) => action.reason === 'safeZone').length
    return { ...candidate, score: Math.max(0, 100 - unresolved * 40 - resolved * 4 - safeZoneMoves * 2) }
  }).sort((a, b) => b.score - a.score || a.archetypeId.localeCompare(b.archetypeId))
}
export function generateLayoutCandidates(sourceLayout: Layout, targetSurface: Surface): EngineCandidate[] {
  return rankCandidates(applicableArchetypes(targetSurface.width, targetSurface.height).map((archetypeId) => { const result = solveLayout(sourceLayout, targetSurface, archetypeId); return { id: `${sourceLayout.id}-${targetSurface.id}-${archetypeId}`, archetypeId, ...result, score: 0 } }))
}
