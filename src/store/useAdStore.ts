import { create } from 'zustand'
import { demoLayout } from '../data/demoAd'
import { generateLayoutCandidates } from '../engine'
import type { EngineCandidate } from '../engine'
import { getSurface } from '../data/surfaces'
import type { AdElement, Layout, Rect, TextElement } from '../engine/models'

type TextPatch = Partial<Pick<TextElement, 'content' | 'fontSize' | 'minFontSize' | 'fontWeight' | 'maxLines' | 'color'>>
interface EditorState {
  sourceLayout: Layout; adaptedLayout: Layout | null; selectedElementId: string | null; selectedSurfaceId: string; candidates: EngineCandidate[]; isAdapting: boolean
  addElement: (element: AdElement) => void; updateElement: (id: string, patch: Partial<AdElement>) => void; deleteElement: (id: string) => void
  selectElement: (id: string | null) => void; selectSurface: (id: string) => void
  updateElementPosition: (id: string, position: Pick<Rect, 'x' | 'y'>) => void; updateElementDimensions: (id: string, dimensions: Pick<Rect, 'width' | 'height'>) => void
  updateTextProperties: (id: string, patch: TextPatch) => void; loadDemoCreative: () => void; generateCandidates: () => void
}
const update = (layout: Layout, id: string, updater: (element: AdElement) => AdElement): Layout => ({ ...layout, elements: layout.elements.map((element) => element.id === id ? updater(element) : element) })
const adapt = (sourceLayout: Layout, surfaceId: string) => { const candidates = generateLayoutCandidates(sourceLayout, getSurface(surfaceId)); return { candidates, adaptedLayout: candidates[0]?.layout ?? null } }
const initial = adapt(demoLayout, demoLayout.surfaceId)
export const useAdStore = create<EditorState>((set, get) => ({
  sourceLayout: demoLayout, ...initial, selectedElementId: null, selectedSurfaceId: demoLayout.surfaceId, isAdapting: false,
  addElement: (element) => set((state) => ({ sourceLayout: { ...state.sourceLayout, elements: [...state.sourceLayout.elements, element] }, adaptedLayout: null, candidates: [], selectedElementId: element.id })),
  updateElement: (id, patch) => set((state) => state.adaptedLayout ? { adaptedLayout: update(state.adaptedLayout, id, (element) => ({ ...element, ...patch } as AdElement)) } : { sourceLayout: update(state.sourceLayout, id, (element) => ({ ...element, ...patch } as AdElement)), candidates: [] }),
  deleteElement: (id) => set((state) => state.adaptedLayout ? { adaptedLayout: { ...state.adaptedLayout, elements: state.adaptedLayout.elements.filter((element) => element.id !== id) }, selectedElementId: state.selectedElementId === id ? null : state.selectedElementId } : { sourceLayout: { ...state.sourceLayout, elements: state.sourceLayout.elements.filter((element) => element.id !== id) }, candidates: [], selectedElementId: state.selectedElementId === id ? null : state.selectedElementId }),
  selectElement: (selectedElementId) => set({ selectedElementId }),
  selectSurface: (selectedSurfaceId) => { const current = get(); if (current.selectedSurfaceId === selectedSurfaceId) return; set({ selectedSurfaceId, adaptedLayout: null, candidates: [], isAdapting: true }); queueMicrotask(() => { const state = get(); if (state.selectedSurfaceId !== selectedSurfaceId) return; set({ ...adapt(state.sourceLayout, selectedSurfaceId), isAdapting: false }) }) },
  updateElementPosition: (id, position) => set((state) => state.adaptedLayout ? { adaptedLayout: update(state.adaptedLayout, id, (element) => ({ ...element, rect: { ...element.rect, ...position } })) } : { sourceLayout: update(state.sourceLayout, id, (element) => ({ ...element, rect: { ...element.rect, ...position } })), candidates: [] }),
  updateElementDimensions: (id, dimensions) => set((state) => state.adaptedLayout ? { adaptedLayout: update(state.adaptedLayout, id, (element) => ({ ...element, rect: { ...element.rect, ...dimensions } })) } : { sourceLayout: update(state.sourceLayout, id, (element) => ({ ...element, rect: { ...element.rect, ...dimensions } })), candidates: [] }),
  updateTextProperties: (id, patch) => set((state) => state.adaptedLayout ? { adaptedLayout: update(state.adaptedLayout, id, (element) => element.type === 'text' ? { ...element, ...patch } : element) } : { sourceLayout: update(state.sourceLayout, id, (element) => element.type === 'text' ? { ...element, ...patch } : element), candidates: [] }),
  loadDemoCreative: () => set({ sourceLayout: demoLayout, ...adapt(demoLayout, demoLayout.surfaceId), selectedElementId: null, selectedSurfaceId: demoLayout.surfaceId, isAdapting: false }),
  generateCandidates: () => { set({ isAdapting: true }); queueMicrotask(() => { const latest = get(); set({ ...adapt(latest.sourceLayout, latest.selectedSurfaceId), isAdapting: false }) }) },
}))
