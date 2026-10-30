import { ArrowRight, Route } from 'lucide-react';
import { Spinner } from '@/components/kibo-ui/spinner';
import { LOCAIS } from '@/mocks/cityMocks';
import { formatarPeso } from '@/lib/ruas';
import type { ResultadoRotaProps } from '@/types/layouts';

const NOME_LOCAL = new Map(LOCAIS.map((local) => [local.value, local.label]));

function nomeLocal(value: string): string {
  return NOME_LOCAL.get(value) ?? value;
}

function corDoPonto(indice: number, total: number): string {
  if (indice === 0) return 'bg-origem';
  if (indice === total - 1) return 'bg-destino';
  return 'bg-trajeto';
}

export function ResultadoRota({ resultado, carregando = false }: ResultadoRotaProps) {
  const temRota =
    resultado !== null && Number.isFinite(resultado.distanciaTotal) && resultado.caminho.length > 0;

  if (!resultado || !temRota) {
    return (
      <section
        aria-labelledby="resultado-titulo"
        className="w-full rounded-xl border border-dashed border-border/80 bg-card/60 p-3.5"
      >
        <header className="flex items-center gap-2">
          <Route className="size-4 text-muted-foreground" aria-hidden="true" />
          <h2 id="resultado-titulo" className="text-sm font-semibold text-foreground">
            Resultado
          </h2>
        </header>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          {resultado
            ? 'Não foi encontrada uma rota entre os pontos selecionados. Ajuste as vias ou escolha outro destino.'
            : 'Escolha origem e destino e clique em Calcular Menor Rota para ver o custo e o trajeto destacado no mapa.'}
        </p>
      </section>
    );
  }

  const caminho = resultado.caminho;
  const trechos = Math.max(0, caminho.length - 1);

  return (
    <section
      aria-labelledby="resultado-titulo"
      aria-live="polite"
      className="w-full rounded-xl border border-success/30 bg-success/10 p-3.5"
    >
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Route className="size-4 text-success" aria-hidden="true" />
          <h2 id="resultado-titulo" className="text-sm font-semibold text-foreground">
            Resultado
          </h2>
        </div>
        {carregando ? (
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Spinner variant="ring" className="size-3.5" />
            Atualizando
          </span>
        ) : (
          <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-success">
            Rota calculada
          </span>
        )}
      </header>

      <div className="mt-3 flex items-end justify-between gap-2">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Custo total
          </p>
          <p className="text-2xl font-bold leading-none tabular-nums text-success">
            {formatarPeso(resultado.distanciaTotal)}
          </p>
        </div>
        <p className="text-right text-[11px] text-muted-foreground">
          {caminho.length} pontos
          <br />
          {trechos} trecho{trechos === 1 ? '' : 's'}
        </p>
      </div>

      <div className="mt-3 border-t border-success/15 pt-2.5">
        <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          Trajeto
        </p>
        <ol className="flex flex-wrap items-center gap-1" aria-label="Trajeto calculado">
          {caminho.map((ponto, indice) => (
            <li key={`${ponto}-${indice}`} className="flex items-center gap-1">
              {indice > 0 && (
                <ArrowRight className="size-3 shrink-0 text-muted-foreground" aria-hidden="true" />
              )}
              <span className="flex items-center gap-1 rounded-md border border-border/70 bg-background/70 px-1.5 py-0.5 text-[10px] text-foreground">
                <span
                  className={`size-1.5 shrink-0 rounded-full ${corDoPonto(indice, caminho.length)}`}
                  aria-hidden="true"
                />
                {nomeLocal(ponto)}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
