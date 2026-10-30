'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { CityScene } from './cena'
import type { CityMap3DProps } from '@/types/city'

export default function CityMap3D({ rotaResultado, ruas, onSelecionarLocal }: CityMap3DProps) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-map">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 32, 42], fov: 45 }}>
        <CityScene rotaResultado={rotaResultado} ruas={ruas} onSelecionarLocal={onSelecionarLocal} />
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
}
