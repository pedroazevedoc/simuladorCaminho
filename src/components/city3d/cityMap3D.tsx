'use client'

import { Component, useEffect, useState, type ReactNode } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { CityScene } from './cena';
import { MapaEsquematico } from './mapaEsquematico';
import type { CityMap3DProps } from '@/types/city';

class ProtecaoMapa extends Component<{ children: ReactNode; fallback: ReactNode }, { falhou: boolean }> {
  state = { falhou: false };
  static getDerivedStateFromError() { return { falhou: true }; }
  render() { return this.state.falhou ? this.props.fallback : this.props.children; }
}

function MonitorContexto({ onPerda }: { onPerda: () => void }) {
  const gl = useThree(state => state.gl);
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('webglcontextlost', onPerda);
    // O Fiber descarta o contexto ao desmontar. Isso não indica falta de suporte.
    return () => canvas.removeEventListener('webglcontextlost', onPerda);
  }, [gl, onPerda]);
  return null;
}

export default function CityMap3D(props: CityMap3DProps) {
  const [suporte, setSuporte] = useState<boolean | null>(null);
  const [modo, setModo] = useState<'3d' | 'mapa'>('3d');
  useEffect(() => {
    let ativo = true;
    // Verifica WebGL 2 antes de montar o Fiber, evitando rejeições na inicialização.
    Promise.resolve().then(() => {
      const canvas = document.createElement('canvas');
      let disponivel = false;
      try {
        const contexto = canvas.getContext('webgl2');
        disponivel = contexto !== null;
        contexto?.getExtension('WEBGL_lose_context')?.loseContext();
      } catch { disponivel = false; }
      if (ativo) setSuporte(disponivel);
    });
    return () => { ativo = false; };
  }, []);
  const alternativo = <MapaEsquematico {...props} />;
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-slate-700 bg-[#0b1425] shadow-2xl">
      <div className="absolute left-4 right-4 top-4 z-20 flex items-center justify-between gap-3">
        <span className="rounded-lg border border-white/10 bg-slate-950/90 px-3 py-2 text-xs text-slate-300">{suporte === false ? 'Mapa interativo · WebGL indisponível neste navegador' : 'Cidade do Luizinho · Explore o percurso'}</span>
        {suporte && <div className="flex rounded-lg bg-slate-950/90 p-1 text-xs text-white">{(['3d','mapa'] as const).map(item=><button key={item} type="button" aria-pressed={modo===item} onClick={()=>setModo(item)} className={`rounded-md px-3 py-2 ${modo===item ? 'bg-orange-500 text-white' : 'hover:bg-slate-800'}`}>{item==='3d' ? 'Cidade 3D' : 'Mapa'}</button>)}</div>}
      </div>
      {suporte === null ? <div className="flex h-full items-center justify-center text-sm text-slate-400">Preparando visualização...</div> : suporte && modo==='3d' ? (
        <ProtecaoMapa fallback={alternativo}>
          <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 48, 52], fov: 45 }} fallback={alternativo}>
            <MonitorContexto onPerda={() => setSuporte(false)} />
            <CityScene {...props} />
            <OrbitControls makeDefault minDistance={20} maxDistance={110} maxPolarAngle={Math.PI / 2.15} />
          </Canvas>
        </ProtecaoMapa>
      ) : alternativo}
    </div>
  );
}
