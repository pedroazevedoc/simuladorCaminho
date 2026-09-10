'use client'

import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { locais, ruas } from '@/mocks/cityMocks';
import { Local, Rua, CityMap3DProps, RuaLinhaProps } from '@/types/city';

// Componente para desenhar as linhas (ruas) usando Three.js nativo sem disparar o erro do Clock/Timer
function RuaLinha({ 
  inicio, 
  fim, 
  cor, 
  espessura,
  peso
}: RuaLinhaProps) {
  // 1. Criação da linha nativa via Three.js
  const lineObject = useMemo(() => {
    const points = [new THREE.Vector3(...inicio), new THREE.Vector3(...fim)];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: cor, linewidth: espessura });
    
    return new THREE.Line(geometry, material);
  }, [inicio, fim, cor, espessura]);

  // 2. Cálculo do ponto médio (P) entre inicio (A) e fim (B): P = (A + B) / 2
  const pontoMedio: [number, number, number] = useMemo(() => {
    return [
      (inicio[0] + fim[0]) / 2,
      (inicio[1] + fim[1]) / 2 + 0.5, // Elevação leve em Y para não sobrepor a linha
      (inicio[2] + fim[2]) / 2,
    ];
  }, [inicio, fim]);

  return (
    <group>
      {/* Desenha a linha da rua */}
      <primitive object={lineObject} />

      {/* Rótulo leve em HTML para a quilometragem */}
      <Html position={pontoMedio} center distanceFactor={25}>
        <div className="bg-slate-900/90 text-slate-200 border border-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap">
          {peso} km
        </div>
      </Html>
    </group>
  );
}

export default function CityMap3D({ rotaResultado }: CityMap3DProps) {
  const caminhoIds: string[] = rotaResultado?.caminho || [];

  // Função auxiliar para verificar se uma rua pertence à menor rota calculada
  const isRuaNaRota = (origem: string, destino: string): boolean => {
    for (let i = 0; i < caminhoIds.length - 1; i++) {
      if (
        (caminhoIds[i] === origem && caminhoIds[i + 1] === destino) ||
        (caminhoIds[i] === destino && caminhoIds[i + 1] === origem)
      ) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="w-full h-150 bg-slate-950 rounded-xl overflow-hidden shadow-2xl relative">
      <Canvas camera={{ position: [0, 25, 30], fov: 45 }}>
        {/* Iluminação */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 20, 15]} intensity={1} />

        {/* Controles de Câmera */}
        <OrbitControls makeDefault />

        {/* Plano do Chão */}
        <gridHelper args={[60, 60, '#334155', '#1e293b']} position={[0, -0.1, 0]} />

        {/* Vértices (Nós da Cidade) */}
        {locais.map((local: Local) => {
          const isOrigem = caminhoIds[0] === local.id;
          const isNoVisitado = caminhoIds.includes(local.id);

          let cor = '#3b82f6';
          if (isOrigem) cor = '#f97316'; // Laranja para Origem
          else if (isNoVisitado) cor = '#22c55e'; // Verde para Trajeto

          return (
            <group key={local.id} position={local.posicao}>
              {/* Esfera do Nó */}
              <mesh>
                <sphereGeometry args={[0.8, 32, 32]} />
                <meshStandardMaterial color={cor} roughness={0.3} />
              </mesh>

              {/* Rótulo de Nome com HTML Flutuante */}
              <Html position={[0, 1.5, 0]} center distanceFactor={25}>
                <div className="bg-slate-900/90 text-white border border-slate-700 text-xs font-semibold px-2 py-1 rounded-md shadow-md pointer-events-none whitespace-nowrap">
                  {local.nome}
                </div>
              </Html>
            </group>
          );
        })}

        {/* Renderizar as Arestas (Ruas) */}
        {ruas.map((rua: Rua, idx: number) => {
          const locOrigem = locais.find(l => l.id === rua.origem);
          const locDestino = locais.find(l => l.id === rua.destino);

          if (!locOrigem || !locDestino) return null;

          const naRota = isRuaNaRota(rua.origem, rua.destino);
          const corLinha = naRota ? '#ef4444' : '#64748b'; // Vermelho para a rota, cinza para as demais
          const largura = naRota ? 4 : 1; // Mais espessa para a rota

          return (
            <RuaLinha
              key={idx}
              inicio={locOrigem.posicao}
              fim={locDestino.posicao}
              cor={corLinha}
              espessura={largura}
              peso={rua.peso}
            />
          );
        })}
      </Canvas>
    </div>
  );
}