'use client'

import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import type { Coordenada3D, RuaProps } from '@/types/city'
import { larguraDaRua } from '@/lib/ruas'
import { anguloDaRua, distanciaEntre, pontoMedio } from '../dados'
import { alturaDaVia, pontosDaVia, temViaduto } from './elevacaoVia'
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
  const pontos = pontosDaVia(rua.origem, rua.destino, comprimento);
  const altura = (distancia: number) => alturaDaVia(rua.origem, rua.destino, distancia);

  // Rua da rota em destaque: true quando há rota calculada e a via faz parte dela
  const comDestaqueRota = rotaAtiva && naRota;

  // Posições (eixo X local) dos traços da marcação central ao longo da rua
  const tracos = useMemo(() => {
    const tamanho = distanciaEntre(inicio, fim);
    const quantidade = Math.max(0, Math.floor(tamanho / ESPACAMENTO_TRACO));
    const inicioTraco = -tamanho / 2 + ESPACAMENTO_TRACO / 2;
    return Array.from({ length: quantidade }, (_, i) => inicioTraco + i * ESPACAMENTO_TRACO);
  }, [inicio, fim]);

  // Linha nativa via Three.js (padrão anticrash: NÃO usar <Line>/<line> JSX)
  // Exibida apenas como contínua amarela da rota; fora da rota prevalece o tracejado
  const linhaObjeto = useMemo(() => {
    const tamanho = distanciaEntre(inicio, fim);
    const pontosLinha = pontosDaVia(rua.origem, rua.destino, tamanho).map(distancia => {
      const t = distancia / tamanho;
      return new THREE.Vector3(inicio[0] + (fim[0] - inicio[0]) * t, ELEVACAO_LINHA + alturaDaVia(rua.origem, rua.destino, distancia), inicio[2] + (fim[2] - inicio[2]) * t);
    });
    const geometry = new THREE.BufferGeometry().setFromPoints(pontosLinha);
    const material = new THREE.LineBasicMaterial({
      color: CORES_ESTADO.rota,
    });
    return new THREE.Line(geometry, material);
  }, [inicio, fim, rua.origem, rua.destino]);

  useEffect(() => () => {
    linhaObjeto.geometry.dispose();
    (linhaObjeto.material as THREE.Material).dispose();
  }, [linhaObjeto]);

  return (
    <group>
      {/* Trechos inclinados formam um viaduto sem criar uma conexão no grafo. */}
      <group position={[meio[0], ELEVACAO_ASFALTO, meio[2]]} rotation={[0, angulo, 0]}>
        {pontos.slice(1).map((fimTrecho, indice) => {
          const inicioTrecho = pontos[indice];
          const alturaInicio = altura(inicioTrecho);
          const alturaFim = altura(fimTrecho);
          const comprimentoTrecho = fimTrecho - inicioTrecho;
          const inclinacao = Math.atan2(alturaFim - alturaInicio, comprimentoTrecho);
          const comprimentoPlano = Math.hypot(comprimentoTrecho, alturaFim - alturaInicio);
          return <group key={inicioTrecho} position={[(inicioTrecho + fimTrecho - comprimento) / 2, (alturaInicio + alturaFim) / 2, 0]} rotation={[0, 0, inclinacao]}>
            {temViaduto(rua.origem, rua.destino) && alturaInicio > 0 && alturaFim > 0 && <mesh position={[0, -0.14, 0]} castShadow receiveShadow><boxGeometry args={[comprimentoPlano, 0.24, LARGURA_ASFALTO + LARGURA_CALCADA * 2]} /><meshStandardMaterial color="#64748b" roughness={0.85} /></mesh>}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[comprimentoPlano, LARGURA_ASFALTO]} />
              <meshStandardMaterial color={rua.bloqueada ? '#7f1d1d' : analisada ? '#0891b2' : comDestaqueRota ? '#65552a' : anterior ? '#6b21a8' : CORES_AMBIENTE.asfalto} emissive={comDestaqueRota ? '#eab308' : '#000000'} emissiveIntensity={comDestaqueRota ? 0.18 : 0} roughness={0.9} metalness={0} />
            </mesh>
            {[-1, 1].map(lado => <mesh key={lado} position={[0, ELEVACAO_CALCADA - ELEVACAO_ASFALTO, lado * ((LARGURA_ASFALTO + LARGURA_CALCADA) / 2)]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[comprimentoPlano, LARGURA_CALCADA]} /><meshStandardMaterial color={CORES_AMBIENTE.calcada} roughness={0.85} /></mesh>)}
            {temViaduto(rua.origem, rua.destino) && alturaInicio > 0 && alturaFim > 0 && [-1, 1].map(lado => <mesh key={`protecao-${lado}`} position={[0, 0.18, lado * (LARGURA_ASFALTO / 2 + LARGURA_CALCADA)]} castShadow><boxGeometry args={[comprimentoPlano, 0.3, 0.12]} /><meshStandardMaterial color={CORES_AMBIENTE.calcada} /></mesh>)}
          </group>;
        })}
        {!comDestaqueRota && tracos.map(x => {
          const distancia = x + comprimento / 2;
          const anguloTraco = Math.atan2(altura(Math.min(comprimento, distancia + 0.05)) - altura(Math.max(0, distancia - 0.05)), 0.1);
          return <group key={x} position={[x, altura(distancia) + ELEVACAO_MARCACAO - ELEVACAO_ASFALTO, 0]} rotation={[0, 0, anguloTraco]}><mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[TAMANHO_TRACO, LARGURA_TRACO]} /><meshStandardMaterial color={CORES_AMBIENTE.faixa} roughness={0.85} /></mesh></group>;
        })}
      </group>

      {rua.bloqueada && <group position={[meio[0], altura(comprimento / 2), meio[2]]} rotation={[0, angulo, 0]}>{[-0.6,0,0.6].map(z=><mesh key={z} position={[0,0.4,z]} castShadow><coneGeometry args={[0.22,0.8,8]} /><meshStandardMaterial color="#f97316" /></mesh>)}</group>}
      {/* Linha contínua da rota apenas quando a rua está no caminho calculado */}
      {comDestaqueRota && <primitive object={linhaObjeto} />}

      {/* Rótulo da quilometragem */}
      <Html position={[meio[0], altura(comprimento / 2) + 0.5, meio[2]]} center distanceFactor={25} zIndexRange={[10, 0]}>
        <button type="button" onClick={onAlternar} aria-label={`${rua.bloqueada ? 'Liberar' : 'Bloquear'} rua de ${rua.origem} até ${rua.destino}`} aria-pressed={!!rua.bloqueada} className={`border text-[10px] font-bold px-2 py-1 rounded-full shadow-lg cursor-pointer whitespace-nowrap select-none ${comDestaqueRota ? "bg-amber-400 text-slate-950 border-amber-200" : "bg-slate-950/90 text-white border-white/20"}`}>
          {rua.bloqueada ? '⛔ ' : ''}{rua.peso.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} km
        </button>
      </Html>
    </group>
  );
}
