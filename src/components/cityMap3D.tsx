// components/MapaCidade3D.jsx
'use client'

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';
import { locais, ruas } from '@/mocks/cityMocks';
import { RespostaRota, Local, Rua } from '@/types/city';

interface cityMap3DProps {
  rotaResultado: RespostaRota | null;
}

export default function MapaCidade3D({ rotaResultado }: cityMap3DProps) {
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

          // Cor da rua: Vermelha se estiver na rota final, Cinza para as demais
          const corLinha = naRota ? '#ef4444' : '#64748b';
          const larguraLinha = naRota ? 5 : 2;

          return (
            <Line
              key={idx}
              points={[locOrigem.posicao, locDestino.posicao]}
              color={corLinha}
              lineWidth={larguraLinha}
            />
          );
        })}
      </Canvas>
    </div>
  );
}