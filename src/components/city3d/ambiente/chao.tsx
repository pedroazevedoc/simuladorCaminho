'use client'

import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { CORES_AMBIENTE } from '../config/visuals'
import { ARVORES } from '@/mocks/cityMocks';

const ELEVACAO_GRAMA = -0.04;
const RAIO_CANTEIRO = 1.02;

// Instanciador de geometrias circulares dos canteiros de grama
function Canteiros({ posicoes }: { posicoes: [number, number][] }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    posicoes.forEach(([x, z], i) => {
      dummy.position.set(x, ELEVACAO_GRAMA, z);
      dummy.rotation.set(-Math.PI / 2, 0, 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      ref.current?.setMatrixAt(i, dummy.matrix);
    });
    if (ref.current) {
      ref.current.instanceMatrix.needsUpdate = true;
    }
  }, [posicoes, dummy]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, posicoes.length]} receiveShadow>
      <circleGeometry args={[RAIO_CANTEIRO, 20]} />
      <meshStandardMaterial color={CORES_AMBIENTE.grama} roughness={1} metalness={0} />
    </instancedMesh>
  );
}

export function Chao() {
  return (
    <>
      {/* Solo base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color={CORES_AMBIENTE.chao} roughness={1} metalness={0} />
      </mesh>

      {/* Canteiros de grama ao redor das árvores */}
      <Canteiros posicoes={ARVORES} />
    </>
  );
}