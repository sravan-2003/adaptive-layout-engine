import type { ArchetypeId } from '../types'
export { stackedVertical } from './stackedVertical'
export { centeredOverlay } from './centeredOverlay'
export { bannerInline } from './bannerInline'
export function applicableArchetypes(width: number, height: number): ArchetypeId[] {
  if (width / height >= 2.4) return ['banner-inline', 'centered']
  if (height / width >= 1.3) return ['stacked', 'centered']
  return ['balanced', 'stacked', 'centered']
}
