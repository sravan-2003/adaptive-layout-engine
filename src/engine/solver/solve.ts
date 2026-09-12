import type { AdElement, ArchetypeId, Layout, Rect, Surface, TraceAction } from '../types'
import { normalizeLayout } from '../normalize'
import { constrainRect, safeBounds } from './constraints'
import { rectanglesIntersect } from './collisions'

const importance = { primary: 3, secondary: 2, tertiary: 1 } as const
const copy = <T,>(value: T): T => structuredClone(value)
const fitAspect = (box: Rect, aspect: number): Rect => { const width = Math.min(box.width, box.height * aspect); const height = width / aspect; return { x: box.x + (box.width - width) / 2, y: box.y + (box.height - height) / 2, width, height } }

function targetRect(element: AdElement, surface: Surface, archetype: ArchetypeId, aspect: number, relativeX = 0): Rect {
  const s = safeBounds(surface); const x = s.x; const y = s.y; const w = s.width; const h = s.height
  if (element.type === 'feature') {
    const width = Math.max(42, w * (w < 500 ? .2 : .18)); const gap = w * .025
    const left = x + Math.min(Math.max(0, relativeX * w), w - width - gap)
    const top = y + (archetype === 'stacked' ? h * .9 : archetype === 'banner-inline' ? h * .76 : archetype === 'centered' ? h * .92 : h * .87)
    return { x: left, y: top, width, height: Math.max(24, h * (h < 180 ? .2 : .075)) }
  }
  if (archetype === 'banner-inline') {
    if (element.type === 'logo') return { x: x + w * .02, y: y + h * .2, width: w * .13, height: h * .25 }
    if (element.type === 'image') return fitAspect({ x: x + w * .56, y: y + h * .08, width: w * .19, height: h * .84 }, aspect)
    if (element.type === 'cta') return { x: x + w * .78, y: y + h * .25, width: w * .2, height: h * .5 }
    if (element.type === 'text' && element.role === 'headline') return { x: x + w * .18, y: y + h * .18, width: w * .34, height: h * .4 }
    if (element.type === 'text' && element.role === 'tagline') return { x: x + w * .72, y: y + h * .08, width: w * .22, height: h * .25 }
    return { x: x + w * .18, y: y + h * .62, width: w * .34, height: h * .22 }
  }
  if (archetype === 'balanced') {
    if (element.type === 'logo') return { x: x + w * .06, y: y + h * .06, width: w * .28, height: h * .07 }
    if (element.type === 'text' && element.role === 'tagline') return { x: x + w * .75, y: y + h * .06, width: w * .2, height: h * .1 }
    if (element.type === 'image') return fitAspect({ x: x + w * .54, y: y + h * .18, width: w * .41, height: h * .64 }, aspect)
    if (element.type === 'text' && element.role === 'headline') return { x: x + w * .08, y: y + h * .22, width: w * .44, height: h * .3 }
    if (element.type === 'text') return { x: x + w * .08, y: y + h * .56, width: w * .34, height: h * .11 }
    if (element.type === 'cta') return { x: x + w * .08, y: y + h * .7, width: w * .27, height: h * .09 }
  }
  if (archetype === 'stacked' && element.type === 'cta') return { x: x + w * .08, y: y + h * .78, width: w * .36, height: h * .07 }
  if (archetype === 'centered') {
    if (element.type === 'logo') return { x: x + w * .35, y: y + h * .05, width: w * .3, height: h * .06 }
    if (element.type === 'text' && element.role === 'headline') return { x: x + w * .1, y: y + h * .15, width: w * .8, height: h * .14 }
    if (element.type === 'image') return fitAspect({ x: x + w * .18, y: y + h * .32, width: w * .64, height: h * .42 }, aspect)
    if (element.type === 'cta') return { x: x + w * .3, y: y + h * .83, width: w * .4, height: h * .06 }
    if (element.type === 'text') return { x: x + w * .18, y: y + h * .76, width: w * .64, height: h * .07 }
    return { x: x + w * .3, y: y + h * .87, width: w * .4, height: h * .08 }
  }
  if (element.type === 'logo') return { x: x + w * .05, y: y + h * .04, width: w * .3, height: h * .06 }
  if (element.type === 'image') return fitAspect({ x: x + w * .15, y: y + h * .14, width: w * .7, height: h * .34 }, aspect)
  if (element.type === 'text' && element.role === 'headline') return { x: x + w * .08, y: y + h * .53, width: w * .84, height: h * .16 }
  if (element.type === 'text' && element.role === 'tagline') return { x: x + w * .7, y: y + h * .05, width: w * .25, height: h * .22 }
  if (element.type === 'text') return { x: x + w * .08, y: y + h * .71, width: w * .84, height: h * .08 }
  return { x: x + w * .3, y: y + h * .84, width: w * .4, height: h * .1 }
}

function applyMinimums(element: AdElement, rect: Rect, surface: Surface, trace: TraceAction[]): AdElement {
  const before = copy(rect); let next = copy(rect); let updated = copy(element)
  if (element.type === 'image' && element.aspectRatioLocked) { const ratio = element.rect.width / element.rect.height; next = fitAspect(next, ratio) }
  if (element.type === 'cta') { next.width = Math.max(next.width, element.minTouchTarget); next.height = Math.max(next.height, element.minTouchTarget) }
  if (element.type === 'logo') { next.width = Math.max(next.width, element.minSize); next.height = Math.max(next.height, element.minSize) }
  next = constrainRect(next, surface)
  if (element.type === 'text') {
    const charactersPerLine = Math.max(1, Math.ceil(element.content.length / element.maxLines)); const fitFont = Math.floor(Math.min(next.width / (charactersPerLine * .55), next.height / (element.maxLines * 1.15)))
    const fontSize = Math.max(element.minFontSize, Math.min(element.fontSize, fitFont))
    if (fontSize !== element.fontSize) { updated = { ...element, fontSize }; trace.push({ kind: 'resize', elementId: element.id, reason: 'fitReadability', from: before, to: copy(next) }) }
  }
  if (element.type === 'image' && element.aspectRatioLocked && (next.width !== before.width || next.height !== before.height)) trace.push({ kind: 'resize', elementId: element.id, reason: 'aspectRatio', from: before, to: copy(next) })
  if (element.type === 'cta' && (next.width !== before.width || next.height !== before.height)) trace.push({ kind: 'resize', elementId: element.id, reason: 'minimumTouchTarget', from: before, to: copy(next) })
  if (element.type === 'logo' && (next.width !== before.width || next.height !== before.height)) trace.push({ kind: 'resize', elementId: element.id, reason: 'minimumLogoSize', from: before, to: copy(next) })
  return { ...updated, rect: next } as AdElement
}

function enforceSafeZone(element: AdElement, surface: Surface, trace: TraceAction[]): AdElement { const rect = constrainRect(element.rect, surface); if (JSON.stringify(rect) !== JSON.stringify(element.rect)) trace.push({ kind: 'move', elementId: element.id, reason: 'safeZone', from: element.rect, to: rect }); return { ...element, rect } as AdElement }

function resolveCollisions(elements: AdElement[], surface: Surface, trace: TraceAction[]): AdElement[] {
  const result = elements.map(copy); const safe = safeBounds(surface)
  for (let iteration = 0; iteration < 12; iteration += 1) { let changed = false
    for (let a = 0; a < result.length; a += 1) for (let b = a + 1; b < result.length; b += 1) {
      if (result[a].visible === false || result[b].visible === false || !rectanglesIntersect(result[a].rect, result[b].rect)) continue
      trace.push({ kind: 'collisionCheck', elementId: `${result[a].id}:${result[b].id}`, reason: 'collisionResolved' })
      const movingIndex = importance[result[a].importance] <= importance[result[b].importance] ? a : b; const fixed = result[movingIndex === a ? b : a]; const moving = result[movingIndex]; const before = copy(moving.rect)
      const options: Rect[] = [ { ...before, y: fixed.rect.y - before.height - 2 }, { ...before, y: fixed.rect.y + fixed.rect.height + 2 }, { ...before, x: fixed.rect.x - before.width - 2 }, { ...before, x: fixed.rect.x + fixed.rect.width + 2 } ].map((rect) => constrainRect(rect, surface))
      const candidate = options.find((rect) => !rectanglesIntersect(rect, fixed.rect) && rect.x >= safe.x && rect.y >= safe.y)
      if (candidate && JSON.stringify(candidate) !== JSON.stringify(before)) { result[movingIndex] = { ...moving, rect: candidate } as AdElement; trace.push({ kind: 'move', elementId: moving.id, reason: 'collisionResolved', from: before, to: candidate }); changed = true }
      else trace.push({ kind: 'collisionCheck', elementId: moving.id, reason: 'collisionUnresolved', details: `Could not fully separate from ${fixed.id}` })
    }
    if (!changed) break
  }
  return result
}

export function solveLayout(sourceLayout: Layout, targetSurface: Surface, archetype: ArchetypeId): { layout: Layout; trace: TraceAction[] } {
  const normalized = normalizeLayout(sourceLayout); const trace: TraceAction[] = []
  const placed = normalized.elements.slice().sort((a, b) => importance[b.element.importance] - importance[a.element.importance]).map(({ element, aspectRatio, relativeX }) => {
    const rect = targetRect(element, targetSurface, archetype, aspectRatio, relativeX); const withConstraints = applyMinimums(element, rect, targetSurface, trace)
    if (JSON.stringify(element.rect) !== JSON.stringify(withConstraints.rect)) trace.push({ kind: 'resize', elementId: element.id, reason: 'archetype', from: element.rect, to: withConstraints.rect })
    const placedElement = enforceSafeZone(withConstraints, targetSurface, trace)
    return targetSurface.width / targetSurface.height >= 2.4 && (element.type === 'feature' || element.type === 'text' && element.role === 'tagline')
      ? { ...placedElement, visible: false }
      : placedElement
  })
  return { layout: { id: `${sourceLayout.id}-${targetSurface.id}-${archetype}`, surfaceId: targetSurface.id, elements: resolveCollisions(placed, targetSurface, trace) }, trace }
}
