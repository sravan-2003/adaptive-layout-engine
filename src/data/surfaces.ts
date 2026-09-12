import type { Surface } from '../engine/models'

export const targetSurfaces: Surface[] = [
  { id: 'instagram-square', name: 'Instagram Square', width: 1080, height: 1080, category: 'social', safeZone: { top: 54, right: 54, bottom: 54, left: 54 } },
  { id: 'instagram-story', name: 'Instagram Story', width: 1080, height: 1920, category: 'social', safeZone: { top: 150, right: 54, bottom: 180, left: 54 } },
  { id: 'youtube-thumbnail', name: 'YouTube Thumbnail', width: 1280, height: 720, category: 'video', safeZone: { top: 36, right: 48, bottom: 36, left: 48 } },
  { id: 'mobile-banner', name: 'Mobile Banner', width: 320, height: 100, category: 'display', safeZone: { top: 8, right: 10, bottom: 8, left: 10 } },
  { id: 'desktop-banner', name: 'Desktop Banner', width: 970, height: 250, category: 'display', safeZone: { top: 16, right: 24, bottom: 16, left: 24 } },
]
export const getSurface = (id: string) => targetSurfaces.find((surface) => surface.id === id) ?? targetSurfaces[0]
