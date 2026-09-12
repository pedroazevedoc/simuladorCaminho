'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import type { Rua } from '@/types/city'
import type { Coordenada3D } from '../dados'
import { anguloDaRua, distanciaEntre, pontoMedio } from '../dados'
import { CORES_AMBIENTE, CORES_ESTADO } from '../config/visuals'

const LARGURA_ASFALTO = 1;
const ELEVACAO_ASFALTO = 0.02;
const ELEVACAO_LINHA = 0.08;

interface RuaViariaProps {
  rua: Rua;
  inicio: Coordenada3D;
  fim: Coordenada3D;
  naRota: boolean;
}

export function RuaViaria({ rua, inicio, fim, naRota }: RuaViariaProps) {
  const comprimento = distanciaEntre(inicio, fim);
  const meio = pontoMedio(inicio, fim);
  const angulo = anguloDaRua(inicio, fim);

  // Linha nativa via Three.js (padrão anticrash: NÃO usar <Line>/<line> JSX)
  const linhaObjeto = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...inicio),
      new THREE.Vector3(...fim),
    ]);
    const material = new THREE.LineBasicMaterial({
      color: naRota ? CORES_ESTADO.rota : '#64748b',
    });
    return new THREE.Line(geometry, material);
  }, [inicio, fim, naRota]);

  return (
    <group>
      {/* Asfalto retangular entre os dois pontos */}
      <group position={[meio[0], ELEVACAO_ASFALTO, meio[2]]} rotation={[0, angulo, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[comprimento, LARGURA_ASFALTO]} />
          <meshStandardMaterial
            color={CORES_AMBIENTE.asfalto}
            roughness={0.9}
            metalness={0}
          />
        </mesh>
      </group>

      {/* Linha de destaque do trajeto (translada só o eixo Y para levantar do asfalto) */}
      <primitive object={linhaObjeto} position={[0, ELEVACAO_LINHA, 0]} />

      {/* Rótulo da quilometragem */}
      <Html position={[meio[0], 0.5, meio[2]]} center distanceFactor={25} zIndexRange={[10, 0]}>
        <div className="bg-card/90 text-card-foreground border border-border text-[10px] font-bold px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap select-none">
          {rua.peso} km
        </div>
      </Html>
    </group>
  );
}