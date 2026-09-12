import type { Rect, Surface } from '../types'
export const safeBounds = (surface: Surface) => ({ x: surface.safeZone.left, y: surface.safeZone.top, width: surface.width - surface.safeZone.left - surface.safeZone.right, height: surface.height - surface.safeZone.top - surface.safeZone.bottom })
export function constrainRect(rect: Rect, surface: Surface): Rect {
  const safe = safeBounds(surface); const width = Math.min(rect.width, safe.width); const height = Math.min(rect.height, safe.height)
  return { width, height, x: Math.max(safe.x, Math.min(rect.x, safe.x + safe.width - width)), y: Math.max(safe.y, Math.min(rect.y, safe.y + safe.height - height)) }
}
