'use client'

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { locais } from '@/mocks/cityMocks';
import { RespostaRota } from '@/types/city';
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxList, ComboboxTrigger } from '@/components/kibo-ui/combobox';
import { Header } from '@/components/layouts/header';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { Navigation } from 'lucide-react';

const CityMap3D = dynamic(() => import('@/components/cityMap3D'), {
  ssr: false,
  loading: () => (
    <div className="h-150 flex items-center justify-center bg-card text-card-foreground rounded-xl">
      Carregando visualização 3D...
    </div>
  )
});

export default function Home() {
  const [origem, setOrigem] = useState<string>(locais[0].value);
  const [destino, setDestino] = useState<string>(locais[4].value);
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
    <main className="relative min-h-screen bg-background text-foreground p-4 sm:p-8 flex flex-col items-center">
      <Header
        title="Simulador Cidade do Luizinho"
        subtitle="Algoritmo do Menor Caminho (Teoria dos Grafos)"
      />

      <div className="flex flex-wrap gap-4 my-6 bg-card p-4 rounded-lg border border-border shadow-lg">
        {/* Origem */}
        <div>
          <label className="block text-xs text-primary mb-1">Origem:</label>
          <Combobox
            data={locais}
            type="origem"
            onValueChange={setOrigem}
            value={origem}
          >
            <ComboboxTrigger />
            <ComboboxContent>
              <ComboboxInput />
              <ComboboxEmpty />
              <ComboboxList>
                <ComboboxGroup>
                  {locais.map((loc) => (
                    <ComboboxItem key={loc.value} value={loc.value}>
                      {loc.label}
                    </ComboboxItem>
                  ))}
                </ComboboxGroup>
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>

        {/* Destino */}
        <div>
          <label className="block text-xs text-primary mb-1">Destino:</label>
          <Combobox
            data={locais}
            type="destino"
            onValueChange={setDestino}
            value={destino}
          >
            <ComboboxTrigger />
            <ComboboxContent>
              <ComboboxInput />
              <ComboboxEmpty />
              <ComboboxList>
                <ComboboxGroup>
                  {locais.map((loc) => (
                    <ComboboxItem key={loc.value} value={loc.value}>
                      {loc.label}
                    </ComboboxItem>
                  ))}
                </ComboboxGroup>
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>

        <div className="flex items-end">
          <ShimmerButton
            onClick={handleCalcularRota}
            disabled={carregando}
            shimmerColor="#f97316"
            shimmerSize="0.12rem"
            shimmerDuration="2s"
            background="rgba(15, 23, 42, 0.9)"
            className="relative flex items-center justify-center gap-3 px-6 py-2 rounded-xl font-bold text-white transition-all duration-300 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/25 hover:scale-[1.02] active:scale-[0.98] border border-orange-500/30 hover:border-orange-500/60 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
          >
            {/* Ícone com animação de pulso no hover */}
            <Navigation className={`w-5 h-5 text-orange-400 transition-transform duration-300 group-hover:rotate-45 ${carregando ? 'animate-spin' : ''}`} />
            
            <span className="tracking-wide bg-linear-to-r from-orange-200 via-white to-orange-100 bg-clip-text text-transparent">
              {carregando ? 'Calculando Rota...' : 'Calcular Menor Rota'}
            </span>
          </ShimmerButton>
        </div>
      </div>

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