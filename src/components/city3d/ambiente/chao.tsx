'use client'

import { CORES_AMBIENTE } from '../config/visuals'

export function Chao() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
      <planeGeometry args={[120, 120]} />
      <meshStandardMaterial color={CORES_AMBIENTE.chao} roughness={1} metalness={0} />
    </mesh>
  );
}