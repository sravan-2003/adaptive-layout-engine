import type { Layout } from '../engine/models'

export const demoCreative = { id: 'aurora-wireless-launch', name: 'Aurora Wireless Launch', background: 'radial-gradient(ellipse at 74% 48%, rgba(154, 119, 255, .26), transparent 24%), radial-gradient(ellipse at 74% 70%, rgba(44, 109, 212, .16), transparent 34%), linear-gradient(122deg, #050711 0%, #0b1022 48%, #19112b 100%)' }
export const demoLayout: Layout = { id: 'aurora-square-source', surfaceId: 'instagram-square', elements: [
  { id: 'logo', type: 'logo', importance: 'tertiary', rect: { x: 76, y: 72, width: 220, height: 44 }, zIndex: 3, locked: false, src: 'NOVA / AUDIO', minSize: 24 },
  { id: 'tagline', type: 'text', role: 'tagline', importance: 'tertiary', rect: { x: 790, y: 72, width: 205, height: 145 }, zIndex: 3, locked: false, content: 'WIRELESS\nFREEDOM\nALWAYS', fontSize: 22, minFontSize: 11, fontWeight: 700, maxLines: 3, color: '#a9a4c4', letterSpacing: '.18em', textTransform: 'uppercase' },
  { id: 'headline', type: 'text', role: 'headline', importance: 'primary', rect: { x: 80, y: 235, width: 410, height: 280 }, zIndex: 3, locked: false, content: 'Sound that\nmoves with\nyou.', fontSize: 88, minFontSize: 30, fontWeight: 800, maxLines: 3, color: '#ffffff' },
  { id: 'subtext', type: 'text', role: 'subtext', importance: 'secondary', rect: { x: 84, y: 565, width: 350, height: 78 }, zIndex: 3, locked: false, content: 'Immersive clarity.\nAll-day comfort.', fontSize: 25, minFontSize: 14, fontWeight: 500, maxLines: 2, color: '#d1d2e2' },
  { id: 'cta', type: 'cta', importance: 'secondary', rect: { x: 80, y: 712, width: 276, height: 70 }, zIndex: 4, locked: false, label: 'DISCOVER NOVA', minTouchTarget: 44, icon: 'arrow', variant: 'pill' },
  { id: 'product', type: 'image', importance: 'primary', rect: { x: 505, y: 120, width: 535, height: 690 }, zIndex: 2, locked: false, src: 'aurora-headphones', asset: 'aurora-headphones-premium', aspectRatioLocked: true, glow: 'violet-blue' },
  { id: 'feature-sound', type: 'feature', importance: 'tertiary', rect: { x: 82, y: 922, width: 190, height: 74 }, zIndex: 3, locked: false, label: 'RICHER\nSOUND', icon: 'circle', color: '#b8b5d0', fontSize: 17, minFontSize: 10 },
  { id: 'feature-comfort', type: 'feature', importance: 'tertiary', rect: { x: 374, y: 922, width: 190, height: 74 }, zIndex: 3, locked: false, label: 'ALL-DAY\nCOMFORT', icon: 'diamond', color: '#b8b5d0', fontSize: 17, minFontSize: 10 },
  { id: 'feature-playtime', type: 'feature', importance: 'tertiary', rect: { x: 666, y: 922, width: 190, height: 74 }, zIndex: 3, locked: false, label: 'LONGER\nPLAYTIME', icon: 'square', color: '#b8b5d0', fontSize: 17, minFontSize: 10 },
] }
