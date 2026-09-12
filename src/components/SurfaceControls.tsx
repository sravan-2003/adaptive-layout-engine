import { ChevronDown, Sparkles } from 'lucide-react'
import type { Surface } from '../engine/models'
import { formatSurfaceSize } from '../lib/format'
interface Props { surface: Surface; surfaces: Surface[]; onChange: (id: string) => void; onAdapt: () => void }
export function SurfaceControls({ surface, surfaces, onChange, onAdapt }: Props) {
  return <header className="surface-controls"><div><span className="control-label">TARGET SURFACE</span><div className="surface-select"><select value={surface.id} onChange={(event) => onChange(event.target.value)}>{surfaces.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select><ChevronDown size={15} /></div><span className="surface-meta">{formatSurfaceSize(surface.width, surface.height)} · {(surface.width / surface.height).toFixed(2)}:1 · {surface.category}</span></div><button className="adapt-button" type="button" onClick={onAdapt}><Sparkles size={16} /> Adapt Layouts</button></header>
}
