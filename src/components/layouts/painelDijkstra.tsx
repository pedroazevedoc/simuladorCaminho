import { ChevronLeft, ChevronRight, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LOCAIS } from '@/mocks/cityMocks';
import type { RespostaRota, PassoDijkstra } from '@/types/city';
import type { useSimulacao } from '@/hooks/useSimulacao';

interface PainelDijkstraProps {
  resultado: RespostaRota | null;
  anterior: RespostaRota | null;
  passo: PassoDijkstra | undefined;
  simulacao: ReturnType<typeof useSimulacao>;
}

export function PainelDijkstra({ resultado, anterior, passo, simulacao }: PainelDijkstraProps) {
  const { passoIndice, setPassoIndice, setAnimando } = simulacao;
  const nomeAtual = LOCAIS.find((local) => local.value === passo?.atual)?.label;

  return (
    <section aria-labelledby="dijkstra-titulo" className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 id="dijkstra-titulo" className="flex items-center gap-2 text-base font-semibold">
            <Route className="size-4 text-primary" aria-hidden="true" /> Dijkstra passo a passo
          </h2>
          <p className="text-sm text-muted-foreground">Veja como o algoritmo compara as distâncias até encontrar o menor caminho.</p>
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={!resultado?.passos.length}
          onClick={() => { setAnimando(false); setPassoIndice(passoIndice < 0 ? 0 : -1); }}
        >
          {passo ? 'Ver rota final' : 'Explorar etapas'}
        </Button>
      </div>
      {resultado?.distanciaTotal != null && anterior?.distanciaTotal != null && (
        <p className="mt-4 text-sm text-muted-foreground">
          Distância anterior: {anterior.distanciaTotal.toLocaleString('pt-BR')} km · Atual: {resultado.distanciaTotal.toLocaleString('pt-BR')} km
        </p>
      )}
      {passo && (
        <div className="mt-4 flex flex-col gap-4 border-t border-border pt-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" variant="outline" size="sm" disabled={passoIndice === 0} onClick={() => setPassoIndice((i) => i - 1)}>
              <ChevronLeft data-icon="inline-start" /> Anterior
            </Button>
            <p className="flex-1 text-sm">
              <strong>Passo {passoIndice + 1} de {resultado?.passos.length}:</strong> {nomeAtual} confirmado; {passo.consideradas.length} ligação(ões) analisadas.
            </p>
            <Button type="button" variant="outline" size="sm" disabled={passoIndice === (resultado?.passos.length ?? 0) - 1} onClick={() => setPassoIndice((i) => i + 1)}>
              Próximo <ChevronRight data-icon="inline-end" />
            </Button>
          </div>
          <details className="rounded-lg border border-border p-3 text-sm">
            <summary className="cursor-pointer font-medium">Distâncias calculadas neste passo</summary>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {LOCAIS.map((local) => (
                <div key={local.value} className="rounded-md bg-muted p-2">
                  <span className="block font-medium">{local.label}</span>
                  <span className="text-muted-foreground">
                    {passo.distancias[local.value] === null ? '∞' : `${passo.distancias[local.value]?.toLocaleString('pt-BR')} km`} · {passo.visitados.includes(local.value) ? 'confirmada' : 'provisória'}
                  </span>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </section>
  );
}
