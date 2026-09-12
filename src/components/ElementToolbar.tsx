import { Image, Layers3, MousePointer2, Plus, Type } from 'lucide-react'
import type { AdElement } from '../engine/models'
interface Props { elements: AdElement[]; selectedId: string | null; onSelect: (id: string) => void; onAdd: (element: AdElement) => void }
const iconFor = (element: AdElement) => element.type === 'text' ? <Type size={15} /> : element.type === 'image' ? <Image size={15} /> : <MousePointer2 size={15} />
export function ElementToolbar({ elements, selectedId, onSelect, onAdd }: Props) {
  const addText = () => onAdd({ id: `text-${Date.now()}`, type: 'text', role: 'subtext', importance: 'tertiary', rect: { x: 100, y: 850, width: 280, height: 54 }, zIndex: 4, locked: false, content: 'New supporting text', fontSize: 24, minFontSize: 14, fontWeight: 500, maxLines: 2, color: '#ffffff' })
  return <aside className="editor-panel toolbar"><div className="panel-title"><Layers3 size={17} /> Elements</div><p className="panel-hint">Click an element to edit it.</p><div className="element-list">{elements.map((element) => <button key={element.id} onClick={() => onSelect(element.id)} className={`element-row ${selectedId === element.id ? 'active' : ''}`}>{iconFor(element)}<span>{element.type === 'text' ? element.role : element.type}</span><small>{element.importance}</small></button>)}</div><button className="add-button" onClick={addText}><Plus size={16} /> Add text</button></aside>
}
