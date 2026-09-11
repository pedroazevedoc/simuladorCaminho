'use client'

import { useMemo } from 'react'
import { Html } from '@react-three/drei'
import type { Local } from '@/types/city'
import { CONFIG_TIPO, CORES_ESTADO, resolverDimensoes } from '../config/visuals'

interface PredioProps {
  local: Local;
  isOrigem: boolean;
  naRota: boolean;
}

export function Predio({ local, isOrigem, naRota }: PredioProps) {
  const { dimensoes, cor, rugosidade, metalness } = useMemo(() => {
    const base = CONFIG_TIPO[local.tipo];
    return {
      ...base,
      dimensoes: resolverDimensoes(local.tipo, local.value),
    };
  }, [local]);

  const corEfetiva = isOrigem
    ? CORES_ESTADO.origem
    : naRota
      ? CORES_ESTADO.trajeto
      : cor;

  return (
    <group position={local.posicao}>
      <mesh
        position={[0, dimensoes.altura / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[dimensoes.largura, dimensoes.altura, dimensoes.profundidade]} />
        <meshStandardMaterial color={corEfetiva} roughness={rugosidade} metalness={metalness} />
      </mesh>

      <Html
        position={[0, dimensoes.altura + 1.2, 0]}
        center
        distanceFactor={25}
        zIndexRange={[11, 0]}
      >
        <div className="bg-card/90 text-card-foreground border border-border text-xs font-semibold px-2 py-1 rounded-md shadow-md pointer-events-none whitespace-nowrap select-none">
          {local.label}
        </div>
      </Html>
    </group>
  );
}