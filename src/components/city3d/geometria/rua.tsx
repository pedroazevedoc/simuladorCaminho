'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import type { Coordenada3D, RuaProps } from '@/types/city'
import { anguloDaRua, distanciaEntre, pontoMedio } from '../dados'
import { CORES_AMBIENTE, CORES_ESTADO } from '../config/visuals'
import { formatarPeso, larguraDaRua } from '@/lib/ruas'

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
  inicio: Coordenada3D;
  fim: Coordenada3D;
  naRota: boolean;
  rotaAtiva: boolean;
}

export function RuaViaria({ rua, inicio, fim, naRota, rotaAtiva }: RuaViariaProps) {
  const comprimento = distanciaEntre(inicio, fim);
  const meio = pontoMedio(inicio, fim);
  const angulo = anguloDaRua(inicio, fim);

  // A espessura acompanha o custo da via. O eixo e os extremos permanecem
  // fixos — por isso não há risco de sobrepor o entorno (árvores, postes,
  // estacionamentos), que é posicionado por coordenadas absolutas.
  const larguraAsfalto = larguraDaRua(rua.peso);

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

  return (
    <group>
      {/* Asfalto retangular entre os dois pontos */}
      <group position={[meio[0], ELEVACAO_ASFALTO, meio[2]]} rotation={[0, angulo, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[comprimento, larguraAsfalto]} />
          <meshStandardMaterial
            color={CORES_AMBIENTE.asfalto}
            roughness={0.9}
            metalness={0}
          />
        </mesh>

        {/* Calçadas horizontais nas bordas laterais do asfalto */}
        {[-1, 1].map((lado) => (
          <mesh
            key={lado}
            position={[0, ELEVACAO_CALCADA - ELEVACAO_ASFALTO, lado * ((larguraAsfalto + LARGURA_CALCADA) / 2)]}
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

      {/* Linha contínua da rota apenas quando a rua está no caminho calculado */}
      {comDestaqueRota && <primitive object={linhaObjeto} position={[0, ELEVACAO_LINHA, 0]} />}

      {/* Rótulo do custo da via */}
      <Html position={[meio[0], 0.5, meio[2]]} center distanceFactor={25} zIndexRange={[10, 0]}>
        <div className="bg-card/80 text-card-foreground/70 border border-border text-[10px] font-bold px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap select-none">
          <span className="mr-1 text-[9px] font-normal opacity-60">custo</span>
          {formatarPeso(rua.peso)}
        </div>
      </Html>
    </group>
  );
}