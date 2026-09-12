import { useEffect, useRef, useState } from 'react'
import type { AdElement, Layout, Surface } from '../engine/models'
import { clampRectForSurface } from '../lib/bounds'

interface Props { layout: Layout; surface: Surface; background: string; selectedId: string | null; onSelect: (id: string | null) => void }
export function AdCanvas({ layout, surface, background, selectedId, onSelect }: Props) {
  const stageRef = useRef<HTMLDivElement>(null); const [available, setAvailable] = useState({ width: 1, height: 1 })
  useEffect(() => { const stage = stageRef.current; if (!stage) return undefined; const update = () => setAvailable({ width: stage.clientWidth - 36, height: stage.clientHeight - 36 }); update(); const observer = new ResizeObserver(update); observer.observe(stage); return () => observer.disconnect() }, [])
  const scale = Math.max(.01, Math.min(available.width / surface.width, available.height / surface.height)); const displayWidth = surface.width * scale; const displayHeight = surface.height * scale
  return <div ref={stageRef} className="canvas-stage"><div className="canvas-display" style={{ width: displayWidth, height: displayHeight }}><div className="ad-canvas" style={{ width: surface.width, height: surface.height, transform: `scale(${scale})`, background }} onClick={() => onSelect(null)}>
    <div className="safe-zone" style={{ left: surface.safeZone.left, top: surface.safeZone.top, right: surface.safeZone.right, bottom: surface.safeZone.bottom }} />
    {layout.elements.slice().sort((a, b) => a.zIndex - b.zIndex).map((element) => <CanvasElement key={element.id} element={element} surface={surface} selected={element.id === selectedId} onSelect={onSelect} />)}
  </div></div></div>
}
function CanvasElement({ element, surface, selected, onSelect }: { element: AdElement; surface: Surface; selected: boolean; onSelect: (id: string) => void }) {
  const rect = clampRectForSurface(element.rect, surface); const style = { left: rect.x, top: rect.y, width: rect.width, height: rect.height, zIndex: element.zIndex }
  if (element.visible === false) return null
  return <button type="button" className={`canvas-element ${element.type} ${selected ? 'selected' : ''}`} style={style} onClick={(event) => { event.stopPropagation(); onSelect(element.id) }} title={element.id}>
    <small className="debug-id">{element.id}</small>
    {element.type === 'text' && <span className={`text-content ${element.role}`} style={{ color: element.color, fontSize: element.fontSize, fontWeight: element.fontWeight, lineHeight: element.role === 'headline' ? .95 : element.role === 'tagline' ? 1.25 : 1.35, letterSpacing: element.letterSpacing, textTransform: element.textTransform, WebkitLineClamp: element.maxLines }}>{element.content}</span>}
    {element.type === 'logo' && <span className="brand-mark">{element.src}</span>}
    {element.type === 'cta' && <span className="cta-label">{element.label}{element.icon === 'arrow' && <b className="cta-arrow" aria-hidden="true">→</b>}</span>}
    {element.type === 'feature' && <span className={`feature-content feature-${element.icon}`} style={{ color: element.color, fontSize: element.fontSize }}>{element.label}</span>}
    {element.type === 'image' && <span className="headphone-art"><i className="headphone-band" /><i className="headphone-cup headphone-cup-left" /><i className="headphone-cup headphone-cup-right" /><b className="headphone-highlight" /></span>}
  </button>
}
