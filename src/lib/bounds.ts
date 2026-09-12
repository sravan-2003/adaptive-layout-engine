import type { Rect, Surface } from '../engine/models'
/** Defensive display boundary validation. Layouts remain unchanged; invalid rects are clamped only for rendering. */
export function clampRectForSurface(rect: Rect, surface: Surface): Rect {
  const width = Math.min(Math.max(0, rect.width), surface.width); const height = Math.min(Math.max(0, rect.height), surface.height)
  return { width, height, x: Math.max(0, Math.min(rect.x, surface.width - width)), y: Math.max(0, Math.min(rect.y, surface.height - height)) }
}
