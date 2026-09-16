'use client'

import { useMemo, useState } from 'react'
import { Html } from '@react-three/drei'
import { CONFIG_TIPO, CONFIG_TELHADO, CORES_AMBIENTE, CORES_ESTADO, ICONE_TIPO, resolverDimensoes } from '../config/visuals'
import { Telhado } from './telhado'
import { LocalProps } from '@/types/city'

const ELEVACAO_LOTE = 0.005;

interface PredioProps {
  local: LocalProps;
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

  const telhado = CONFIG_TELHADO[local.tipo];
  const Icone = ICONE_TIPO[local.tipo];
  const topoTelhado = dimensoes.altura + telhado.altura + telhado.alturaElevada;

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
      {/* Base de concreto do lote */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, ELEVACAO_LOTE, 0]} receiveShadow>
        <planeGeometry args={[dimensoes.largura + 1, dimensoes.profundidade + 1]} />
        <meshStandardMaterial color={CORES_AMBIENTE.lote} roughness={0.95} metalness={0} />
      </mesh>

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

      <Telhado tipo={local.tipo} dimensoes={dimensoes} />

      <Html
        position={[0, topoTelhado + 1.2, 0]}
        center
        distanceFactor={25}
        zIndexRange={[11, 0]}
      >
        <div className="flex items-center gap-1.5 bg-card/90 text-card-foreground border border-border text-xs font-semibold px-2 py-1 rounded-md shadow-md pointer-events-none whitespace-nowrap select-none">
          <Icone className="w-3.5 h-3.5 shrink-0 text-primary" />
          <span>{local.label}</span>
        </div>
      </Html>
    </group>
  );
}