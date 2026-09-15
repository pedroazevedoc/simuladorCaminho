'use client'

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { RespostaRota } from '@/types/city';
import { Header } from '@/components/layouts/header';
import { FormularioRota } from '@/components/layouts/formularioRota';
import { Spinner } from '@/components/kibo-ui/spinner';
import { LOCAIS } from '@/mocks/cityMocks';

const CityMap3D = dynamic(() => import('@/components/city3d/cityMap3D'), {
  ssr: false,
  loading: () => (
    <div className="h-150 flex flex-col items-center justify-center bg-card text-card-foreground rounded-xl space-y-2">
      <Spinner variant="ring" />
      <span>Carregando visualização 3D...</span>
    </div>
  )
});

export default function Home() {
  const [origem, setOrigem] = useState<string>(LOCAIS[0].value);
  const [destino, setDestino] = useState<string>(LOCAIS[4].value);
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
    <main className="relative min-h-screen text-foreground p-4 sm:p-8 flex flex-col items-center">
      <Header
        title="Simulador Cidade do Luizinho"
        subtitle="Algoritmo do Menor Caminho (Teoria dos Grafos)"
      />

      <FormularioRota
        origem={origem}
        destino={destino}
        carregando={carregando}
        onOrigemChange={setOrigem}
        onDestinoChange={setDestino}
        onCalcular={handleCalcularRota}
      />

      {resultado && (
        <div className="mb-4 text-emerald-500 font-semibold bg-emerald-950/60 border border-emerald-800/50 px-4 py-2 rounded-md">
          Distância Total: {resultado.distanciaTotal} km
        </div>
      )}

      <div className="w-full max-w-5xl">
        <CityMap3D rotaResultado={resultado} />
      </div>
    </main>
  );
}