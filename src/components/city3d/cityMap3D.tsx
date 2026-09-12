'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { CityScene } from './cena'
import type { CityMap3DProps } from '@/types/city'

export default function CityMap3D({ rotaResultado, onSelecionarLocal }: CityMap3DProps) {
  return (
    <div className="w-full h-150 rounded-xl overflow-hidden shadow-2xl relative bg-[#0f172a]">
      <Canvas shadows camera={{ position: [0, 32, 42], fov: 45 }}>
        <CityScene rotaResultado={rotaResultado} onSelecionarLocal={onSelecionarLocal} />
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
}