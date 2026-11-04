'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';
import { RequisicaoRota, RespostaRota, RuaProps } from '@/types/city';
import { Header } from '@/components/layouts/header';
import { Footer } from '@/components/layouts/footer';
import { PainelControle, PainelControleDrawer } from '@/components/layouts/painelControle';
import { OverlayMapa } from '@/components/layouts/overlayMapa';
import { ModalInformativo } from '@/components/layouts/modalInformativo';
import { Spinner } from '@/components/kibo-ui/spinner';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Navigation, Pause, Play, RotateCcw, Route } from 'lucide-react';
import { LOCAIS, RUAS } from '@/mocks/cityMocks';
import { chaveRua } from '@/lib/ruas';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

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
const CHAVE_ONBOARDING = 'simulador-caminho:onboarding-v1';
const assinaturaVazia = () => () => {};

const velocidadesMock = [
  { label: '0.5×', value: 0.5 },
  { label: '1×', value: 1 },
  { label: '2×', value: 2 },
  { label: '4×', value: 4 },
]

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
  const [origem, setOrigem] = useState<string>(LOCAIS[0].value);
  const [destino, setDestino] = useState<string>(LOCAIS[4].value);
  // Custos efetivos das vias (posições e topologia continuam fixas nos mocks)
  const [ruas, setRuas] = useState<RuaProps[]>(RUAS);
  const [resultado, setResultado] = useState<RespostaRota | null>(null);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [erroRota, setErroRota] = useState<string | null>(null);
  const [passoIndice, setPassoIndice] = useState(-1);
  const [progresso, setProgresso] = useState(0);
  const [animando, setAnimando] = useState(false);
  const [velocidade, setVelocidade] = useState(1);
  const [seguir, setSeguir] = useState(false);
  const [noturno, setNoturno] = useState(false);
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [anterior, setAnterior] = useState<RespostaRota | null>(null);
  const contadorRequisicao = useRef(0);
  const concluido = progresso >= 1;
  useEffect(() => {
    if (!animando || concluido || passoIndice >= 0) return;
    let ultimo = performance.now();
    const timer = setInterval(() => { const agora = performance.now(); const delta = Math.min(agora - ultimo, 100); ultimo = agora; setProgresso(valor => Math.min(1, valor + delta * velocidade / 20000)); }, 33);
    return () => clearInterval(timer);
  }, [animando, concluido, velocidade, passoIndice]);
  const [painelAberto, setPainelAberto] = useState<boolean>(false);
  const [modalAberto, setModalAberto] = useState<boolean>(false);
  const [onboardingConcluido, setOnboardingConcluido] = useState<boolean>(false);
  const [modalInstancia, setModalInstancia] = useState<number>(0);
  const timerRecalculo = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  const calcularRota = async (pesos: RuaProps[]) => {
    if (timerRecalculo.current) {
      clearTimeout(timerRecalculo.current);
      timerRecalculo.current = null;
    }
    const id = ++contadorRequisicao.current;
    setCarregando(true);
    setErroRota(null);
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
      if (id !== contadorRequisicao.current) return;
      setAnterior(resultado);
      setResultado(data);
      setPassoIndice(-1);
      setAnimando(false);
      setProgresso(0);
    } catch (err) {
      if (id === contadorRequisicao.current) {
        console.error('Erro ao calcular rota:', err);
        setResultado(null);
        setAnterior(null);
        setAnimando(false);
        setPassoIndice(-1);
        setErroRota('Não foi possível calcular a rota. Confira sua conexão e tente novamente.');
      }
    } finally {
      if (id === contadorRequisicao.current) setCarregando(false);
    }
  };

  // Mantém a rota exibida coerente com os custos: se já existe um resultado na
  // tela, recalcula após a edição (com debounce, para não disparar a cada passo)
  const agendarRecalculo = (pesos: RuaProps[]) => {
    if (timerRecalculo.current) clearTimeout(timerRecalculo.current);
    if (!resultado && !carregando) return;
    // Descarta respostas de requisições iniciadas antes da alteração da via.
    contadorRequisicao.current += 1;
    setCarregando(true);
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

  const limparRota = () => {
    contadorRequisicao.current += 1;
    if (timerRecalculo.current) clearTimeout(timerRecalculo.current);
    timerRecalculo.current = null;
    setResultado(null);
    setAnterior(null);
    setErroRota(null);
    setCarregando(false);
    setAnimando(false);
    setProgresso(0);
    setPassoIndice(-1);
  };
  const alterarOrigem = (valor: string) => { if (valor !== origem) { limparRota(); setOrigem(valor); } };
  const alterarDestino = (valor: string) => { if (valor !== destino) { limparRota(); setDestino(valor); } };

  const handleTrocarPontos = () => {
    limparRota();
    setOrigem(destino);
    setDestino(origem);
  };

  const alternarRua = (indice: number) => {
    const proximas = ruas.map((rua, i) => i === indice ? { ...rua, bloqueada: !rua.bloqueada } : rua);
    setRuas(proximas);
    agendarRecalculo(proximas);
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
        {/* Mapa 3D com altura própria para manter a página rolável. */}
        <section
          id="mapa"
          tabIndex={-1}
          aria-label="Mapa 3D da cidade"
          className="relative h-[min(68vh,640px)] min-h-95 overflow-hidden rounded-2xl border border-border/60 shadow-xl outline-none focus-visible:ring-2 focus-visible:ring-ring/60 sm:min-h-120"
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
              <span>{LOCAIS.find(l => l.value === selecionado)?.label}</span>
              <button
                onClick={() => { 
                  alterarOrigem(selecionado);
                  setSelecionado(null);
                }}
              >
                Sair daqui
              </button>
              <button
                onClick={() => { 
                  alterarDestino(selecionado);
                  setSelecionado(null);
                }}
              >
                Ir para cá
              </button>
            </div>
          )}
          <OverlayMapa
            resultado={resultado}
            carregando={carregando}
            onAbrirPainel={() => setPainelAberto(true)}
          />
        </section>

        {erroRota && <section role="alert" className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-foreground shadow-sm sm:p-5"><h2 className="text-base font-semibold">Não foi possível calcular a rota</h2><p className="mt-1 text-sm">{erroRota}</p><Button type="button" variant="outline" className="mt-3" onClick={() => void calcularRota(ruas)}>Tentar novamente</Button></section>}
        {!carregando && resultado && resultado.caminho.length === 0 && (
          <section role="status" className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-foreground shadow-sm sm:p-5">
            <h2 className="text-base font-semibold">Viagem impossível</h2>
            <p className="mt-1 text-sm">Não há um caminho disponível entre a origem e o destino com os bloqueios atuais. Libere uma ou mais ruas ou escolha outros locais para tentar novamente.</p>
          </section>
        )}

        <section aria-labelledby="simulacao-titulo" className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-1">
            <h2 id="simulacao-titulo" className="flex items-center gap-2 text-base font-semibold"><Navigation className="size-4 text-primary" aria-hidden="true" /> Simulação do percurso</h2>
            <p className="text-sm text-muted-foreground">Acompanhe o carro pela cidade e personalize a visualização.</p>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button type="button" disabled={!resultado || resultado.caminho.length < 2 || !!passo} onClick={() => { if (concluido) setProgresso(0); setAnimando(concluido || !animando); }}>
              {animando && !concluido ? <Pause data-icon="inline-start" /> : <Play data-icon="inline-start" />}{animando && !concluido ? 'Pausar' : concluido ? 'Repetir percurso' : 'Iniciar percurso'}
            </Button>
            <Button type="button" variant="outline" onClick={() => { setAnimando(false); setProgresso(0); }}><RotateCcw data-icon="inline-start" /> Reiniciar</Button>
            <div className="flex flex-row items-center gap-2">
              <Label
                htmlFor='velocidade'
                className="text-sm text-foreground"
              >
                Velocidade
              </Label>
              <Select 
                items={velocidadesMock}
                value={velocidade}
                onValueChange={v => setVelocidade(Number(v))}
                aria-label="Velocidade da simulação"
              >
                <SelectTrigger className="w-full max-w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Velocidade</SelectLabel>
                    {velocidadesMock.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={seguir} onChange={e => setSeguir(e.target.checked)} /> Seguir carro</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={noturno} onChange={e => setNoturno(e.target.checked)} /> Modo noturno</label>
            <span className="text-sm text-muted-foreground">{concluido ? 'Destino alcançado' : `${Math.round(progresso * 100)}% do percurso`}</span>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Selecione a distância de uma rua no mapa ou use o painel de controle para bloqueá-la ou liberá-la.</p>
        </section>

        <section aria-labelledby="dijkstra-titulo" className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <h2 id="dijkstra-titulo" className="flex items-center gap-2 text-base font-semibold"><Route className="size-4 text-primary" aria-hidden="true" /> Dijkstra passo a passo</h2>
              <p className="text-sm text-muted-foreground">Veja como o algoritmo compara as distâncias até encontrar o menor caminho.</p>
            </div>
            <Button type="button" variant="outline" disabled={!resultado?.passos.length} onClick={() => { setAnimando(false); setPassoIndice(passoIndice < 0 ? 0 : -1); }}>{passo ? 'Ver rota final' : 'Explorar etapas'}</Button>
          </div>
          {resultado?.distanciaTotal != null && anterior?.distanciaTotal != null && <p className="mt-4 text-sm text-muted-foreground">Distância anterior: {anterior.distanciaTotal.toLocaleString('pt-BR')} km · Atual: {resultado.distanciaTotal.toLocaleString('pt-BR')} km</p>}
          {passo && <div className="mt-4 flex flex-col gap-4 border-t border-border pt-4">
            <div className="flex flex-wrap items-center gap-3">
              <Button type="button" variant="outline" size="sm" disabled={passoIndice === 0} onClick={() => setPassoIndice(i => i - 1)}><ChevronLeft data-icon="inline-start" /> Anterior</Button>
              <p className="flex-1 text-sm"><strong>Passo {passoIndice + 1} de {resultado?.passos.length}:</strong> {LOCAIS.find(l => l.value === passo.atual)?.label} confirmado; {passo.consideradas.length} ligação(ões) analisadas.</p>
              <Button type="button" variant="outline" size="sm" disabled={passoIndice === (resultado?.passos.length ?? 0) - 1} onClick={() => setPassoIndice(i => i + 1)}>Próximo <ChevronRight data-icon="inline-end" /></Button>
            </div>
            <details className="rounded-lg border border-border p-3 text-sm"><summary className="cursor-pointer font-medium">Distâncias calculadas neste passo</summary><div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">{LOCAIS.map(local => <div key={local.value} className="rounded-md bg-muted p-2"><span className="block font-medium">{local.label}</span><span className="text-muted-foreground">{passo.distancias[local.value] === null ? '∞' : `${passo.distancias[local.value]?.toLocaleString('pt-BR')} km`} · {passo.visitados.includes(local.value) ? 'confirmada' : 'provisória'}</span></div>)}</div></details>
          </div>}
        </section>
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
