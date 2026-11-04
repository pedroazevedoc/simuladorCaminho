import { Navigation, Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { RespostaRota, PassoDijkstra } from '@/types/city';
import type { useSimulacao } from '@/hooks/useSimulacao';

interface PainelSimulacaoProps {
  resultado: RespostaRota | null;
  passo: PassoDijkstra | undefined;
  simulacao: ReturnType<typeof useSimulacao>;
}

export function PainelSimulacao({ resultado, passo, simulacao }: PainelSimulacaoProps) {
  const {
    animando, concluido, setProgresso, setAnimando, velocidade, setVelocidade,
    seguir, setSeguir, noturno, setNoturno, progresso,
  } = simulacao;
  const textoBotao = animando && !concluido
    ? 'Pausar'
    : concluido ? 'Repetir percurso' : 'Iniciar percurso';

  return (
    <section aria-labelledby="simulacao-titulo" className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-1">
        <h2 id="simulacao-titulo" className="flex items-center gap-2 text-base font-semibold">
          <Navigation className="size-4 text-primary" aria-hidden="true" /> Simulação do percurso
        </h2>
        <p className="text-sm text-muted-foreground">Acompanhe o carro pela cidade e personalize a visualização.</p>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          disabled={!resultado || resultado.caminho.length < 2 || !!passo}
          onClick={() => {
            if (concluido) setProgresso(0);
            setAnimando(concluido || !animando);
          }}
        >
          {animando && !concluido ? <Pause data-icon="inline-start" /> : <Play data-icon="inline-start" />}
          {textoBotao}
        </Button>
        <Button type="button" variant="outline" onClick={() => { setAnimando(false); setProgresso(0); }}>
          <RotateCcw data-icon="inline-start" /> Reiniciar
        </Button>
        <label className="flex items-center gap-2 text-sm">
          Velocidade
          <select className="h-9 rounded-md border border-input bg-background px-2" value={velocidade} onChange={(e) => setVelocidade(Number(e.target.value))}>
            {[0.5, 1, 2, 4].map((v) => <option key={v} value={v}>{v}×</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={seguir} onChange={(e) => setSeguir(e.target.checked)} /> Seguir carro
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={noturno} onChange={(e) => setNoturno(e.target.checked)} /> Modo noturno
        </label>
        <span className="text-sm text-muted-foreground">
          {concluido ? 'Destino alcançado' : `${Math.round(progresso * 100)}% do percurso`}
        </span>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Selecione a distância de uma rua no mapa ou use o painel de controle para bloqueá-la ou liberá-la.</p>
    </section>
  );
}
