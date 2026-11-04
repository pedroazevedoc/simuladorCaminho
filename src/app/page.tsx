'use client'

import { useState, useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';
import { Header } from '@/components/layouts/header';
import { Footer } from '@/components/layouts/footer';
import { PainelControle, PainelControleDrawer } from '@/components/layouts/painelControle';
import { OverlayMapa } from '@/components/layouts/overlayMapa';
import { ModalInformativo } from '@/components/layouts/modalInformativo';
import { Spinner } from '@/components/kibo-ui/spinner';
import { Button } from '@/components/ui/button';
import { PainelSimulacao } from '@/components/layouts/painelSimulacao';
import { PainelDijkstra } from '@/components/layouts/painelDijkstra';
import { LOCAIS } from '@/mocks/cityMocks';
import { useRota } from '@/hooks/useRota';
import { useSimulacao } from '@/hooks/useSimulacao';
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

const CHAVE_ONBOARDING = 'simulador-caminho:onboarding-v1';
const assinaturaVazia = () => () => {};

function useOnboardingPendente() {
  return useSyncExternalStore(
    assinaturaVazia,
    () => {
      try {
        return !window.localStorage.getItem(CHAVE_ONBOARDING);
      } catch {
        return true;
      }
    },
    () => false
  );
}

export default function Home() {
  const simulacao = useSimulacao();
  const { passoIndice, progresso, seguir, setSeguir, noturno, resetarSimulacao } = simulacao;
  const {
    origem, destino, ruas, resultado, anterior, carregando, erroRota,
    calcularRota, alterarOrigem, alterarDestino, handleTrocarPontos,
    handleAlterarPeso, handleRestaurarPesos, alternarRua,
  } = useRota(resetarSimulacao);
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [painelAberto, setPainelAberto] = useState<boolean>(false);
  const [modalAberto, setModalAberto] = useState<boolean>(false);
  const [onboardingConcluido, setOnboardingConcluido] = useState<boolean>(false);
  const [modalInstancia, setModalInstancia] = useState<number>(0);
  const onboardingPendente = useOnboardingPendente();
  const modalVisivel = modalAberto || (onboardingPendente && !onboardingConcluido);

  const marcarOnboardingComoVisto = () => {
    try {
      window.localStorage.setItem(CHAVE_ONBOARDING, 'true');
    } catch {
      // O modal continua funcionando mesmo quando o armazenamento não está disponível.
    }
    setOnboardingConcluido(true);
    setModalAberto(false);
  };

  const abrirAjuda = () => {
    setModalInstancia((instancia) => instancia + 1);
    setModalAberto(true);
  };

  const passo = resultado?.passos[passoIndice];
  const propsPainel = {
    origem,
    destino,
    carregando,
    resultado,
    ruas,
    onOrigemChange: alterarOrigem,
    onDestinoChange: alterarDestino,
    onTrocarPontos: handleTrocarPontos,
    onCalcular: () => void calcularRota(ruas),
    onAlterarPeso: handleAlterarPeso,
    onAlternarRua: (origemRua: string, destinoRua: string) => {
      const indice = ruas.findIndex((rua) => chaveRua(rua.origem, rua.destino) === chaveRua(origemRua, destinoRua));
      if (indice >= 0) alternarRua(indice);
    },
    onRestaurar: handleRestaurarPesos,
  };

  return (
    <main className="flex min-h-dvh flex-col text-foreground">
      <a
        href="#mapa"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        Ir para o mapa 3D
      </a>

      <Header
        title="Simulador Cidade do Luizinho"
        subtitle="Algoritmo do Menor Caminho (Teoria dos Grafos)"
        onAbrirAjuda={abrirAjuda}
      />

      <div className="mx-auto grid w-full max-w-[1600px] flex-1 items-start gap-5 p-4 sm:gap-6 sm:p-6 lg:grid-cols-[minmax(19rem,23rem)_minmax(0,1fr)] lg:p-8">
        {/* Painel de controle: lateral esquerda no desktop */}
        <aside
          aria-label="Painel de controle"
          className="hidden min-w-0 lg:block"
        >
          <PainelControle {...propsPainel} />
        </aside>

        <div className="flex min-w-0 flex-col gap-5">
          <section
            id="mapa"
            tabIndex={-1}
            aria-label="Mapa 3D da cidade"
            className="relative h-[min(68vh,640px)] min-h-[380px] overflow-hidden rounded-2xl border border-border/60 shadow-xl outline-none focus-visible:ring-2 focus-visible:ring-ring/60 sm:min-h-[480px]"
          >
            <CityMap3D
              rotaResultado={resultado}
              ruas={ruas}
              onSelecionarLocal={setSelecionado}
              onAlternarRua={alternarRua}
              onRestaurarCamera={() => setSeguir(false)}
              passo={passo}
              progresso={passo ? undefined : progresso}
              seguir={seguir}
              noturno={noturno}
              rotaAnterior={resultado?.caminho.length ? anterior?.caminho : undefined}
            />
            {selecionado && (
              <div className="absolute left-3 top-20 z-20 flex gap-2 rounded-lg border bg-card p-2 text-sm">
                <span>{LOCAIS.find((local) => local.value === selecionado)?.label}</span>
                <button onClick={() => { alterarOrigem(selecionado); setSelecionado(null); }}>Sair daqui</button>
                <button onClick={() => { alterarDestino(selecionado); setSelecionado(null); }}>Ir para cá</button>
              </div>
            )}
            <OverlayMapa
              resultado={resultado}
              carregando={carregando}
              onAbrirPainel={() => setPainelAberto(true)}
            />
          </section>

          {erroRota && (
            <section role="alert" className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-foreground shadow-sm sm:p-5">
              <h2 className="text-base font-semibold">Não foi possível calcular a rota</h2>
              <p className="mt-1 text-sm">{erroRota}</p>
              <Button type="button" variant="outline" className="mt-3" onClick={() => void calcularRota(ruas)}>
                Tentar novamente
              </Button>
            </section>
          )}
          {!carregando && resultado && resultado.caminho.length === 0 && (
            <section role="status" className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-foreground shadow-sm sm:p-5">
              <h2 className="text-base font-semibold">Viagem impossível</h2>
              <p className="mt-1 text-sm">Não há um caminho disponível entre a origem e o destino com os bloqueios atuais. Libere uma ou mais ruas ou escolha outros locais para tentar novamente.</p>
            </section>
          )}

          <PainelSimulacao resultado={resultado} passo={passo} simulacao={simulacao} />
          <PainelDijkstra resultado={resultado} anterior={anterior} passo={passo} simulacao={simulacao} />
        </div>
      </div>
      <Footer />

      {/* Painel inferior no mobile, com alça de arraste */}
      <PainelControleDrawer
        {...propsPainel}
        aberto={painelAberto}
        onAbertoChange={setPainelAberto}
      />

      <ModalInformativo
        key={modalInstancia}
        open={modalVisivel}
        onOpenChange={(aberto) => {
          if (aberto) {
            setModalAberto(true);
          } else {
            marcarOnboardingComoVisto();
          }
        }}
        onConcluir={marcarOnboardingComoVisto}
      />
    </main>
  );
}
