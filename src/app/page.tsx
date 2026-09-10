'use client'

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { locais } from '@/mocks/cityMocks';
import { RespostaRota } from '@/types/city';

const CityMap3D = dynamic(() => import('@/components/cityMap3D'), {
  ssr: false,
  loading: () => (
    <div className="h-150 flex items-center justify-center bg-slate-900 text-white rounded-xl">
      Carregando visualização 3D...
    </div>
  )
});

export default function Home() {
  const [origem, setOrigem] = useState<string>(locais[0].id);
  const [destino, setDestino] = useState<string>(locais[4].id);
  const [resultado, setResultado] = useState<RespostaRota | null>(null);
  const [carregando, setCarregando] = useState<boolean>(false);

  const handleCalcularRota = async () => {
    setCarregando(true);
    try {
      const response = await fetch('/api/rota', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origem, destino })
      });
      const data: RespostaRota = await response.json();
      setResultado(data);
    } catch (err) {
      console.error('Erro ao calcular rota:', err);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-2">Simulador Cidade do Luizinho</h1>
      <p className="text-slate-400 mb-8">Algoritmo do Menor Caminho (Teoria dos Grafos)</p>

      <div className="flex flex-wrap gap-4 mb-6 bg-slate-900 p-4 rounded-lg border border-slate-800 shadow-lg">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Origem:</label>
          <select
            value={origem}
            onChange={(e) => setOrigem(e.target.value)}
            className="bg-slate-800 text-white p-2 rounded border border-slate-700 outline-none"
          >
            {locais.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Destino:</label>
          <select
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            className="bg-slate-800 text-white p-2 rounded border border-slate-700 outline-none"
          >
            {locais.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleCalcularRota}
            disabled={carregando}
            className="bg-blue-600 hover:bg-blue-500 font-semibold px-6 py-2 rounded transition-all disabled:opacity-50"
          >
            {carregando ? 'Calculando...' : 'Calcular Menor Rota'}
          </button>
        </div>
      </div>

      {resultado && (
        <div className="mb-4 text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-800/50 px-4 py-2 rounded-md">
          Distância Total: {resultado.distanciaTotal} km
        </div>
      )}

      <div className="w-full max-w-5xl">
        <CityMap3D rotaResultado={resultado} />
      </div>
    </main>
  );
}