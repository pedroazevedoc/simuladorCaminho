'use client'

import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import type { Coordenada3D, RuaProps } from '@/types/city'
import { larguraDaRua } from '@/lib/ruas'
import { anguloDaRua, distanciaEntre, pontoMedio } from '../dados'
import { CORES_AMBIENTE, CORES_ESTADO } from '../config/visuals'


const ELEVACAO_ASFALTO = 0.02;
const LARGURA_CALCADA = 0.3;
const ELEVACAO_CALCADA = 0.01;
const ELEVACAO_LINHA = 0.03;
const ELEVACAO_MARCACAO = 0.03;
const ESPACAMENTO_TRACO = 1.4;
const TAMANHO_TRACO = 0.5;
const LARGURA_TRACO = 0.07;

interface RuaViariaProps {
  rua: RuaProps;
  anterior?: boolean;
  analisada?: boolean;
  onAlternar?: () => void;
  inicio: Coordenada3D;
  fim: Coordenada3D;
  naRota: boolean;
  rotaAtiva: boolean;
}

export function RuaViaria({ rua, inicio, fim, naRota, rotaAtiva, anterior, analisada, onAlternar }: RuaViariaProps) {
  const LARGURA_ASFALTO = larguraDaRua(rua.peso);
  const comprimento = distanciaEntre(inicio, fim);
  const meio = pontoMedio(inicio, fim);
  const angulo = anguloDaRua(inicio, fim);

  // Rua da rota em destaque: true quando há rota calculada e a via faz parte dela
  const comDestaqueRota = rotaAtiva && naRota;

  // Posições (eixo X local) dos traços da marcação central ao longo da rua
  const tracos = useMemo(() => {
    const quantidade = Math.max(0, Math.floor(comprimento / ESPACAMENTO_TRACO));
    const inicioTraco = -comprimento / 2 + ESPACAMENTO_TRACO / 2;
    return Array.from({ length: quantidade }, (_, i) => inicioTraco + i * ESPACAMENTO_TRACO);
  }, [comprimento]);

  // Linha nativa via Three.js (padrão anticrash: NÃO usar <Line>/<line> JSX)
  // Exibida apenas como contínua amarela da rota; fora da rota prevalece o tracejado
  const linhaObjeto = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...inicio),
      new THREE.Vector3(...fim),
    ]);
    const material = new THREE.LineBasicMaterial({
      color: CORES_ESTADO.rota,
    });
    return new THREE.Line(geometry, material);
  }, [inicio, fim]);

  useEffect(() => () => {
    linhaObjeto.geometry.dispose();
    (linhaObjeto.material as THREE.Material).dispose();
  }, [linhaObjeto]);

  return (
    <group>
      {/* Asfalto retangular entre os dois pontos */}
      <group position={[meio[0], ELEVACAO_ASFALTO, meio[2]]} rotation={[0, angulo, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[comprimento, LARGURA_ASFALTO]} />
          <meshStandardMaterial
            color={rua.bloqueada ? '#7f1d1d' : analisada ? '#0891b2' : comDestaqueRota ? '#65552a' : anterior ? '#6b21a8' : CORES_AMBIENTE.asfalto}
            emissive={comDestaqueRota ? '#eab308' : '#000000'}
            emissiveIntensity={comDestaqueRota ? 0.18 : 0}
            roughness={0.9}
            metalness={0}
          />
        </mesh>

        {/* Calçadas horizontais nas bordas laterais do asfalto */}
        {[-1, 1].map((lado) => (
          <mesh
            key={lado}
            position={[0, ELEVACAO_CALCADA - ELEVACAO_ASFALTO, lado * ((LARGURA_ASFALTO + LARGURA_CALCADA) / 2)]}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
          >
            <planeGeometry args={[comprimento, LARGURA_CALCADA]} />
            <meshStandardMaterial
              color={CORES_AMBIENTE.calcada}
              roughness={0.85}
              metalness={0}
            />
          </mesh>
        ))}

        {/* Linha tracejada central no sentido da via (oculta na rota, que usa a contínua) */}
        {!comDestaqueRota &&
          tracos.map((x) => (
            <mesh
              key={x}
              position={[x, ELEVACAO_MARCACAO - ELEVACAO_ASFALTO, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              receiveShadow
            >
              <planeGeometry args={[TAMANHO_TRACO, LARGURA_TRACO]} />
              <meshStandardMaterial color={CORES_AMBIENTE.faixa} roughness={0.85} metalness={0} />
            </mesh>
          ))}
      </group>

      {rua.bloqueada && <group position={[meio[0], 0, meio[2]]} rotation={[0, angulo, 0]}>{[-0.6,0,0.6].map(z=><mesh key={z} position={[0,0.4,z]} castShadow><coneGeometry args={[0.22,0.8,8]} /><meshStandardMaterial color="#f97316" /></mesh>)}</group>}
      {/* Linha contínua da rota apenas quando a rua está no caminho calculado */}
      {comDestaqueRota && <primitive object={linhaObjeto} position={[0, ELEVACAO_LINHA, 0]} />}

      {/* Rótulo da quilometragem */}
      <Html position={[meio[0], 0.5, meio[2]]} center distanceFactor={25} zIndexRange={[10, 0]}>
        <button type="button" onClick={onAlternar} aria-label={`${rua.bloqueada ? 'Liberar' : 'Bloquear'} rua de ${rua.origem} até ${rua.destino}`} aria-pressed={!!rua.bloqueada} className={`border text-[10px] font-bold px-2 py-1 rounded-full shadow-lg cursor-pointer whitespace-nowrap select-none ${comDestaqueRota ? "bg-amber-400 text-slate-950 border-amber-200" : "bg-slate-950/90 text-white border-white/20"}`}>
          {rua.bloqueada ? '⛔ ' : ''}{rua.peso.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} km
        </button>
      </Html>
    </group>
  );
}