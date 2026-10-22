'use client'

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { RequisicaoRota, RespostaRota, RuaProps } from '@/types/city';
import { Header } from '@/components/layouts/header';
import { FormularioRota } from '@/components/layouts/formularioRota';
import { EditorCustoVia } from '@/components/layouts/editorCustoVia';
import { Spinner } from '@/components/kibo-ui/spinner';
import { LOCAIS, RUAS } from '@/mocks/cityMocks';
import { chaveRua, formatarPeso } from '@/lib/ruas';

const CityMap3D = dynamic(() => import('@/components/city3d/cityMap3D'), {
  ssr: false,
  loading: () => (
    <div className="h-150 flex flex-col items-center justify-center bg-card text-card-foreground rounded-xl space-y-2">
      <Spinner variant="ring" />
      <span>Carregando visualização 3D...</span>
    </div>
  )
});

// Espera antes de recalcular a rota enquanto o usuário arrasta o slider de custo
const ESPERA_RECALCULO = 300;

export default function Home() {
  const [origem, setOrigem] = useState<string>(LOCAIS[0].value);
  const [destino, setDestino] = useState<string>(LOCAIS[4].value);
  // Custos efetivos das vias (posições e topologia continuam fixas nos mocks)
  const [ruas, setRuas] = useState<RuaProps[]>(RUAS);
  const [resultado, setResultado] = useState<RespostaRota | null>(null);
  const [carregando, setCarregando] = useState<boolean>(false);
  const timerRecalculo = useRef<ReturnType<typeof setTimeout> | null>(null);

  const calcularRota = async (pesos: RuaProps[]) => {
    setCarregando(true);
    try {
      const corpo: RequisicaoRota = { origem, destino, ruas: pesos };
      const response = await fetch('/api/rota', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corpo)
      });
      if (!response.ok) {
        throw new Error(`Falha ao calcular a rota (${response.status})`);
      }
      const data: RespostaRota = await response.json();
      setResultado(data);
    } catch (err) {
      console.error('Erro ao calcular rota:', err);
    } finally {
      setCarregando(false);
    }
  };

  // Mantém a rota exibida coerente com os custos: se já existe um resultado na
  // tela, recalcula após a edição (com debounce, para não disparar a cada passo)
  const agendarRecalculo = (pesos: RuaProps[]) => {
    if (timerRecalculo.current) clearTimeout(timerRecalculo.current);
    if (!resultado) return;
    timerRecalculo.current = setTimeout(() => {
      void calcularRota(pesos);
    }, ESPERA_RECALCULO);
  };

  const handleAlterarPeso = (origemRua: string, destinoRua: string, peso: number) => {
    const chave = chaveRua(origemRua, destinoRua);
    const proximasRuas = ruas.map((rua) =>
      chaveRua(rua.origem, rua.destino) === chave ? { ...rua, peso } : rua
    );
    setRuas(proximasRuas);
    agendarRecalculo(proximasRuas);
  };

  const handleRestaurarPesos = () => {
    setRuas(RUAS);
    agendarRecalculo(RUAS);
  };

  return (
    <main className="relative min-h-screen text-foreground p-4 sm:p-8 flex flex-col items-center space-y-4">
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
        onCalcular={() => void calcularRota(ruas)}
      />

      <EditorCustoVia
        ruas={ruas}
        onAlterarPeso={handleAlterarPeso}
        onRestaurar={handleRestaurarPesos}
      />

      {resultado && Number.isFinite(resultado.distanciaTotal) && (
        <div className="text-emerald-500 font-semibold bg-emerald-500/20 dark:bg-emerald-950/60 border border-emerald-800/50 px-4 py-2 rounded-md">
          Custo Total: {formatarPeso(resultado.distanciaTotal)}
        </div>
      )}

      <div className="w-full max-w-5xl">
        <CityMap3D rotaResultado={resultado} ruas={ruas} />
      </div>
    </main>
  );
}
