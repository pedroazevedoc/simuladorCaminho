'use client'

import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { locais, ruas } from '@/mocks/cityMocks';
import { Local, Rua, cityMap3DProps, RuaLinhaProps } from '@/types/city';

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

      {/* Rótulo com a quilometragem no ponto médio da rua */}
      <Text
        position={pontoMedio}
        fontSize={0.6}
        color="#f8fafc"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#0f172a" // Borda escura para facilitar a leitura no mapa
      >
        {`${peso} km`}
      </Text>
    </group>
  );
}

export default function cityMap3D({ rotaResultado }: cityMap3DProps) {
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
    <div className="w-full h-150 bg-slate-900 rounded-xl overflow-hidden shadow-2xl relative">
      <Canvas camera={{ position: [0, 20, 25], fov: 50 }}>
        {/* Iluminação */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 20, 15]} intensity={1} />

        {/* Controles do Mouse (Girar / Zoom) */}
        <OrbitControls makeDefault />

        {/* Plano do Chão */}
        <gridHelper args={[50, 50, '#475569', '#1e293b']} position={[0, -0.1, 0]} />

        {/* Renderizar os Nós (Pontos de Interesse) */}
        {locais.map((local: Local) => {
          const isOrigem = caminhoIds[0] === local.id;
          const isNoVisitado = caminhoIds.includes(local.id);

          // Define a cor de acordo com o roteiro: Origem Laranja, Rota Verde, Outros Azul
          let cor = '#3b82f6';
          if (isOrigem) cor = '#f97316'; // Laranja
          else if (isNoVisitado) cor = '#22c55e'; // Verde

          return (
            <group key={local.id} position={local.posicao}>
              {/* Esfera do Nó */}
              <mesh>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial color={cor} />
              </mesh>

              {/* Rótulo 3D com Nome */}
              <Text
                position={[0, 1.8, 0]}
                fontSize={0.8}
                color="white"
                anchorX="center"
                anchorY="middle"
              >
                {local.nome}
              </Text>
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
          const largura = naRota ? 3 : 1; // Mais espessa para a rota

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