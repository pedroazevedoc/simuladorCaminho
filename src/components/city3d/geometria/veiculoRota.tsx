'use client'

import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { posicaoPercurso } from '@/lib/percurso';
import type { CityMap3DProps } from '@/types/city';

export function VeiculoRota({ rotaResultado, progresso = 0, seguir }: CityMap3DProps) {
  const movimento = posicaoPercurso(rotaResultado?.caminho ?? [], progresso);
  const controls = useThree(state => state.controls);
  useFrame(({ camera }, delta) => {
    if (!seguir || !movimento) return;
    const [x,,z] = movimento.posicao;
    camera.position.lerp(new Vector3(x + 10, 13, z + 13), 1 - Math.exp(-delta * 4));
    if (controls && 'target' in controls) {
      (controls.target as Vector3).set(x, 0, z);
    } else camera.lookAt(x, 0, z);
  });
  if (!movimento) return null;
  return <group position={movimento.posicao} rotation={[0, movimento.angulo, 0]}>
    <mesh castShadow><boxGeometry args={[1.7, 0.55, 0.85]} /><meshStandardMaterial color="#f97316" metalness={0.4} roughness={0.3} /></mesh>
    <mesh position={[-0.15, 0.4, 0]} castShadow><boxGeometry args={[0.85, 0.4, 0.72]} /><meshStandardMaterial color="#bae6fd" metalness={0.6} roughness={0.2} /></mesh>
    {[-0.55,0.55].flatMap(x=>[-0.45,0.45].map(z=><mesh key={`${x}-${z}`} position={[x,-0.2,z]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[0.23,0.23,0.15,12]} /><meshStandardMaterial color="#111827" /></mesh>))}
    <mesh position={[0.87,0,0]}><boxGeometry args={[0.03,0.18,0.65]} /><meshStandardMaterial color="#fff7ed" emissive="#fff7ed" emissiveIntensity={1} /></mesh>
  </group>;
}
