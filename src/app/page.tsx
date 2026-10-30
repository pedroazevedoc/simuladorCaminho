'use client'

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { RequisicaoRota, RespostaRota, RuaProps } from '@/types/city';
import { Header } from '@/components/layouts/header';
import { Footer } from '@/components/layouts/footer';
import { PainelControle, PainelControleDrawer } from '@/components/layouts/painelControle';
import { OverlayMapa } from '@/components/layouts/overlayMapa';
import { Spinner } from '@/components/kibo-ui/spinner';
import { LOCAIS, RUAS } from '@/mocks/cityMocks';
import { chaveRua } from '@/lib/ruas';

const CityMap3D = dynamic(() => import('@/components/city3d/cityMap3D'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-2 bg-map text-map-foreground">
      <Spinner variant="ring" />
      <span className="text-sm">Carregando visualização 3D...</span>
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
  const [painelAberto, setPainelAberto] = useState<boolean>(false);
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

  const handleTrocarPontos = () => {
    setOrigem(destino);
    setDestino(origem);
  };

  const propsPainel = {
    origem,
    destino,
    carregando,
    resultado,
    ruas,
    onOrigemChange: setOrigem,
    onDestinoChange: setDestino,
    onTrocarPontos: handleTrocarPontos,
    onCalcular: () => void calcularRota(ruas),
    onAlterarPeso: handleAlterarPeso,
    onRestaurar: handleRestaurarPesos,
  };

  return (
    <main className="flex h-dvh flex-col overflow-hidden text-foreground">
      <a
        href="#mapa"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        Ir para o mapa 3D
      </a>

      <Header
        title="Simulador Cidade do Luizinho"
        subtitle="Algoritmo do Menor Caminho (Teoria dos Grafos)"
      />

      <div className="flex min-h-0 flex-1 gap-3 p-3 sm:gap-4 sm:p-4 lg:p-5">
        {/* Painel de controle: lateral esquerda no desktop */}
        <aside
          aria-label="Painel de controle"
          className="hidden min-h-0 w-[clamp(19rem,25vw,26rem)] shrink-0 flex-col overflow-y-auto pr-1 lg:flex [scrollbar-color:var(--border)_transparent] [scrollbar-thin]"
        >
          <PainelControle {...propsPainel} />
        </aside>

        {/* Mapa 3D: ocupa todo o espaço restante */}
        <section
          id="mapa"
          tabIndex={-1}
          aria-label="Mapa 3D da cidade"
          className="relative min-h-0 flex-1 overflow-hidden rounded-xl border border-border/60 shadow-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
        >
          <CityMap3D rotaResultado={resultado} ruas={ruas} />
          <OverlayMapa
            resultado={resultado}
            carregando={carregando}
            onAbrirPainel={() => setPainelAberto(true)}
          />
        </section>
      </div>

      <Footer />

      {/* Painel inferior no mobile, com alça de arraste */}
      <PainelControleDrawer
        {...propsPainel}
        aberto={painelAberto}
        onAbertoChange={setPainelAberto}
      />
    </main>
  );
}
