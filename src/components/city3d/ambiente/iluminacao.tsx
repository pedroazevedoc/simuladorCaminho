'use client'

import { CORES_AMBIENTE } from '../config/visuals'

export function Iluminacao({ noturno = false }: { noturno?: boolean }) {
  return (
    <>
      <ambientLight intensity={noturno ? 0.2 : 0.65} />
      <directionalLight
        position={[12, 25, 18]}
        intensity={noturno ? 0.45 : 1.6}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-camera-near={1}
        shadow-camera-far={80}
      />
      <color attach="background" args={[noturno ? '#080f21' : '#bfd7e0']} />
      <fog attach="fog" args={[noturno ? '#080f21' : CORES_AMBIENTE.chao, 80, 160]} />
    </>
  );
}