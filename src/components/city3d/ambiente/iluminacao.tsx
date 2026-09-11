'use client'

import { CORES_AMBIENTE } from '../config/visuals'

export function Iluminacao() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[12, 25, 18]}
        intensity={1.6}
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
      <fog attach="fog" args={[CORES_AMBIENTE.chao, 40, 100]} />
    </>
  );
}