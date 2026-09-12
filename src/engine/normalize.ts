import type { Layout, NormalizedLayout } from './types'
import { getSurface } from './surfaces'

export function normalizeLayout(source: Layout): NormalizedLayout {
  const surface = getSurface(source.surfaceId)
  return { source, width: surface.width, height: surface.height, elements: source.elements.map((element) => ({
    element, relativeX: element.rect.x / surface.width, relativeY: element.rect.y / surface.height,
    relativeWidth: element.rect.width / surface.width, relativeHeight: element.rect.height / surface.height,
    aspectRatio: element.rect.width / element.rect.height,
    minimumWidth: element.type === 'cta' ? element.minTouchTarget : element.type === 'logo' ? element.minSize : element.type === 'text' ? Math.max(element.minFontSize * 2, 24) : 1,
    minimumHeight: element.type === 'cta' ? element.minTouchTarget : element.type === 'logo' ? element.minSize : element.type === 'text' ? element.minFontSize * 1.15 : 1,
  })) }
}
