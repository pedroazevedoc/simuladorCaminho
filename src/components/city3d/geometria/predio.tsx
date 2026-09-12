'use client'

import { useMemo, useState } from 'react'
import { Html } from '@react-three/drei'
import type { Local } from '@/types/city'
import { CONFIG_TIPO, CORES_ESTADO, resolverDimensoes } from '../config/visuals'

interface PredioProps {
  local: Local;
  isOrigem: boolean;
  isDestino: boolean;
  naRota: boolean;
  selecionado: boolean;
  onSelecionar: () => void;
}

export function Predio({ 
  local,
  isOrigem,
  isDestino,
  naRota,
  selecionado,
  onSelecionar,
}: PredioProps ) {
  const [hovered, setHovered] = useState(false);

  const { dimensoes, cor, rugosidade, metalness } = useMemo(() => {
    const base = CONFIG_TIPO[local.tipo];
    return {
      ...base,
      dimensoes: resolverDimensoes(local.tipo, local.value),
    };
  }, [local]);

  // Precedência de cor do predio: origem > destino > selecionado > naRota > cor padrão do tipo
  const corEfetiva = isOrigem
    ? CORES_ESTADO.origem
    : isDestino
      ? CORES_ESTADO.destino
      : selecionado
        ? CORES_ESTADO.selecionado
        : naRota
          ? CORES_ESTADO.trajeto
        : cor;

  return (
    <group position={local.posicao}>
      <mesh
        position={[0, dimensoes.altura / 2, 0]}
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onSelecionar();
        }}
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <boxGeometry args={[dimensoes.largura, dimensoes.altura, dimensoes.profundidade]} />
        <meshStandardMaterial
          color={corEfetiva}
          roughness={selecionado ? 0.5 : rugosidade}
          metalness={selecionado ? 0.4 : metalness}
          emissive={selecionado ? CORES_ESTADO.selecionado : '#000000'}
          emissiveIntensity={hovered ? 0.5 : 0.3}
        />
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