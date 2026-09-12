import type { AdElement, Layout, Rect, Surface } from './models'

export type { AdElement, Layout, Rect, Surface }
export type ArchetypeId = 'stacked' | 'centered' | 'balanced' | 'banner-inline'
export interface NormalizedElement { element: AdElement; relativeX: number; relativeY: number; relativeWidth: number; relativeHeight: number; aspectRatio: number; minimumWidth: number; minimumHeight: number }
export interface NormalizedLayout { source: Layout; width: number; height: number; elements: NormalizedElement[] }
export type TraceReason = 'archetype' | 'safeZone' | 'collisionResolved' | 'fitReadability' | 'minimumTouchTarget' | 'minimumLogoSize' | 'aspectRatio' | 'collisionUnresolved'
export interface TraceAction { kind: 'move' | 'resize' | 'collisionCheck'; elementId?: string; reason: TraceReason; from?: Rect; to?: Rect; details?: string }
export interface EngineCandidate { id: string; archetypeId: ArchetypeId; layout: Layout; trace: TraceAction[]; score: number }
