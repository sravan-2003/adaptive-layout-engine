import { AdCanvas } from './components/AdCanvas'
import { ElementToolbar } from './components/ElementToolbar'
import { PropertiesPanel } from './components/PropertiesPanel'
import { SurfaceControls } from './components/SurfaceControls'
import { demoCreative } from './data/demoAd'
import { getSurface, targetSurfaces } from './data/surfaces'
import { useAdStore } from './store/useAdStore'

function App() {
  const store = useAdStore()
  const surface = getSurface(store.selectedSurfaceId)
  const displayLayout = store.adaptedLayout ?? store.sourceLayout
  const displaySurface = store.adaptedLayout ? surface : getSurface(store.sourceLayout.surfaceId)
  const selected = displayLayout.elements.find((element) => element.id === store.selectedElementId)
  return <div className="editor-app"><nav className="topbar"><a className="wordmark" href="/">FRAMESHIFT<span>·</span></a><div className="creative-name"><span>CREATIVE</span><b>{demoCreative.name}</b></div><button onClick={store.loadDemoCreative}>Reset demo</button></nav>
    <SurfaceControls surface={surface} surfaces={targetSurfaces} onChange={store.selectSurface} onAdapt={store.generateCandidates} />
    <div className="editor-layout"><ElementToolbar elements={displayLayout.elements} selectedId={store.selectedElementId} onSelect={store.selectElement} onAdd={store.addElement} />
      <section className="workspace"><div className="workspace-label">{store.adaptedLayout ? 'ADAPTED OUTPUT' : 'SOURCE CREATIVE'} <span>{displaySurface.name} · {displaySurface.width} × {displaySurface.height}</span></div><AdCanvas layout={displayLayout} surface={displaySurface} background={demoCreative.background} selectedId={store.selectedElementId} onSelect={store.selectElement} /></section>
      <PropertiesPanel element={selected} onPosition={store.updateElementPosition} onDimensions={store.updateElementDimensions} onText={(id, patch) => { if (selected?.type === 'text') store.updateTextProperties(id, patch); else store.updateElement(id, patch) }} onDelete={store.deleteElement} />
    </div>{store.isAdapting && <div className="adapt-loading">Adapting layout…</div>}{store.candidates.length > 0 && <section className="candidate-result"><b>Best: {store.candidates[0].archetypeId} · {store.candidates[0].score}</b>{store.candidates.map((candidate) => <span key={candidate.id}>{candidate.archetypeId} · {candidate.score} · {candidate.trace.length} actions</span>)}</section>}</div>
}
export default App
