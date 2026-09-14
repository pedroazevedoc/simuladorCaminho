'use client'

import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { CORES_AMBIENTE } from '../config/visuals'
import { ARVORES, POSTES } from '@/mocks/cityMocks';

interface PosicaoInstancia {
  x: number;
  z: number;
  y: number;
  escala: number;
}

// Instanciador genérico: distribui cópias de uma mesma geometria em posições fixas
function Instancias({
  posicoes,
  children,
}: {
  posicoes: PosicaoInstancia[];
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    posicoes.forEach((posicao, i) => {
      dummy.position.set(posicao.x, posicao.y, posicao.z);
      dummy.scale.setScalar(posicao.escala);
      dummy.updateMatrix();
      ref.current?.setMatrixAt(i, dummy.matrix);
    });
    if (ref.current) {
      ref.current.instanceMatrix.needsUpdate = true;
    }
  }, [posicoes, dummy]);

  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, posicoes.length]}
      castShadow
      receiveShadow
    >
      {children}
    </instancedMesh>
  );
}

export function Entorno() {
  const copas = useMemo(
    () => ARVORES.map(([x, z]) => ({ x, z, y: 1.35, escala: 1 })),
    []
  );
  const troncos = useMemo(
    () => ARVORES.map(([x, z]) => ({ x, z, y: 0.45, escala: 1 })),
    []
  );
  const postes = useMemo(
    () => POSTES.map(([x, z]) => ({ x, z, y: 0.9, escala: 1 })),
    []
  );
  const luzes = useMemo(
    () => POSTES.map(([x, z]) => ({ x, z, y: 1.8, escala: 1 })),
    []
  );

  return (
    <>
      {/* Copas das árvores */}
      <Instancias posicoes={copas}>
        <sphereGeometry args={[0.9, 8, 6]} />
        <meshStandardMaterial color={CORES_AMBIENTE.vegetacao} roughness={1} />
      </Instancias>

      {/* Troncos das árvores */}
      <Instancias posicoes={troncos}>
        <cylinderGeometry args={[0.22, 0.3, 0.9, 6]} />
        <meshStandardMaterial color={CORES_AMBIENTE.tronco} roughness={1} />
      </Instancias>

      {/* Postes de iluminação */}
      <Instancias posicoes={postes}>
        <cylinderGeometry args={[0.08, 0.08, 1.8, 6]} />
        <meshStandardMaterial color={CORES_AMBIENTE.poste} roughness={0.6} metalness={0.4} />
      </Instancias>

      {/* Luzes de iluminação */}
      <Instancias posicoes={luzes}>
        <sphereGeometry args={[0.1, 8, 6]} />
        <meshStandardMaterial color={CORES_AMBIENTE.luz} roughness={1} />
      </Instancias>
    </>
  );
}