'use client'

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { locais } from '@/mocks/cityMocks';
import { RespostaRota } from '@/types/city';
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxList, ComboboxTrigger } from '@/components/kibo-ui/combobox';
import { ThemeSwitcher } from '@/components/kibo-ui/theme-switcher';
import { useTheme } from 'next-themes';

const CityMap3D = dynamic(() => import('@/components/cityMap3D'), {
  ssr: false,
  loading: () => (
    <div className="h-150 flex items-center justify-center bg-card text-card-foreground rounded-xl">
      Carregando visualização 3D...
    </div>
  )
});

export default function Home() {
  const { theme, setTheme } = useTheme();
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
    <main className="relative min-h-screen bg-background text-foreground p-8 flex flex-col items-center">
      <div className="absolute right-8 top-8">
        <ThemeSwitcher
          value={theme as 'light' | 'dark' | 'system'}
          onChange={setTheme}
        />
      </div>
      <h1 className="text-3xl font-bold mb-2">Simulador Cidade do Luizinho</h1>
      <p className="text-muted-foreground mb-8">Algoritmo do Menor Caminho (Teoria dos Grafos)</p>

      <div className="flex flex-wrap gap-4 mb-6 bg-card p-4 rounded-lg border border-border shadow-lg">
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
          <button
            onClick={handleCalcularRota}
            disabled={carregando}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6 py-2 rounded transition-all disabled:opacity-50"
          >
            {carregando ? 'Calculando...' : 'Calcular Menor Rota'}
          </button>
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