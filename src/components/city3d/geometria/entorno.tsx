'use client'

import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { ARVORES, CARROS, POSTES } from '../dados'
import { CORES_AMBIENTE } from '../config/visuals'

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
  const carros = useMemo(
    () => CARROS.map(([x, z]) => ({ x, z, y: 0.4, escala: 1 })),
    []
  );
  const postes = useMemo(
    () => POSTES.map(([x, z]) => ({ x, z, y: 0.9, escala: 1 })),
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
        <meshStandardMaterial color="#7c4a26" roughness={1} />
      </Instancias>

      {/* Carros estacionados */}
      <Instancias posicoes={carros}>
        <boxGeometry args={[1.6, 0.6, 0.9]} />
        <meshStandardMaterial color={CORES_AMBIENTE.veiculo} roughness={0.4} metalness={0.2} />
      </Instancias>

      {/* Postes de iluminação */}
      <Instancias posicoes={postes}>
        <cylinderGeometry args={[0.08, 0.08, 1.8, 6]} />
        <meshStandardMaterial color="#64748b" roughness={0.6} metalness={0.4} />
      </Instancias>
    </>
  );
}