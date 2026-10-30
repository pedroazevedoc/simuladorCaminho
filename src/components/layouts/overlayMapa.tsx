'use client';

import { Info, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/kibo-ui/spinner';
import { formatarPeso } from '@/lib/ruas';
import type { OverlayMapaProps } from '@/types/layouts';

// Cores semânticas definidas em globals.css e espelhadas na cena 3D
const PONTOS = [
  { cor: 'bg-origem', rotulo: 'Origem' },
  { cor: 'bg-destino', rotulo: 'Destino' },
  { cor: 'bg-trajeto', rotulo: 'Trajeto' },
  { cor: 'bg-selecionado', rotulo: 'Selecionado' },
] as const;

const RUAS = [
  { estilo: 'solida', rotulo: 'Rota' },
  { estilo: 'tracejada', rotulo: 'Fora da rota' },
] as const;

function SeloRua({ estilo }: { estilo: (typeof RUAS)[number]['estilo'] }) {
  return (
    <span
      className="relative block h-2.5 w-7 shrink-0 overflow-hidden rounded-[3px] bg-asfalto"
      aria-hidden="true"
    >
      {estilo === 'solida' ? (
        <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-rota" />
      ) : (
        <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-faixa" />
      )}
    </span>
  );
}

/**
 * Elementos flutuantes sobre o canvas 3D: instruções, legenda, status de
 * carregamento, custo no mobile e o gatilho do painel inferior.
 */
export function OverlayMapa({ resultado, carregando, onAbrirPainel }: OverlayMapaProps) {
  const custo =
    resultado && Number.isFinite(resultado.distanciaTotal)
      ? formatarPeso(resultado.distanciaTotal)
      : null;

  return (
    <>
      <div className="pointer-events-none absolute left-3 top-3 z-10 max-w-[min(21rem,calc(100%-1.5rem))]">
        <div className="flex items-start gap-2 rounded-lg border border-border bg-card/90 px-3 py-2 text-card-foreground shadow-lg backdrop-blur-md">
          <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <p className="text-[11px] font-semibold">Explore o mapa 3D</p>
            <p className="text-[10px] leading-snug text-muted-foreground">
              Arraste para girar · pinça/scroll para zoom · toque em um prédio
              para ver detalhes.
            </p>
          </div>
        </div>
      </div>

      {carregando && (
        <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
          <div
            role="status"
            className="flex items-center gap-2 rounded-full border border-border bg-card/90 px-3 py-1.5 text-xs text-card-foreground shadow-lg backdrop-blur-md"
          >
            <Spinner variant="ring" className="size-4 text-primary" />
            Calculando rota...
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute bottom-3 left-3 z-10 hidden w-[17rem] rounded-lg border border-border bg-card/90 px-3 py-2 text-card-foreground shadow-lg backdrop-blur-md sm:block">
        <h2 className="mb-1.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
          Legenda
        </h2>

        <div className="space-y-2">
          <section aria-labelledby="legenda-edificios">
            <h3
              id="legenda-edificios"
              className="mb-1 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground"
            >
              Edifícios e pontos
            </h3>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
              {PONTOS.map((item) => (
                <li
                  key={item.rotulo}
                  className="flex items-center gap-1.5 text-[10px] text-card-foreground"
                >
                  <span
                    className={`size-2.5 shrink-0 rounded-[3px] ${item.cor}`}
                    aria-hidden="true"
                  />
                  {item.rotulo}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="legenda-ruas">
            <h3
              id="legenda-ruas"
              className="mb-1 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground"
            >
              Ruas e arestas
            </h3>
            <ul className="flex flex-wrap items-center gap-x-3 gap-y-1">
              {RUAS.map((item) => (
                <li
                  key={item.rotulo}
                  className="flex items-center gap-1.5 text-[10px] text-card-foreground"
                >
                  <SeloRua estilo={item.estilo} />
                  {item.rotulo}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {custo && (
        <div className="absolute bottom-3 left-3 z-10 rounded-lg border border-border bg-card/90 px-3 py-1.5 text-card-foreground shadow-lg backdrop-blur-md lg:hidden">
          <p className="text-[9px] uppercase tracking-wide text-muted-foreground">
            Custo total
          </p>
          <p className="text-sm font-bold tabular-nums text-success">{custo}</p>
        </div>
      )}

      <Button
        type="button"
        size="lg"
        onClick={onAbrirPainel}
        aria-label="Abrir painel de controle"
        className="absolute bottom-3 right-3 z-10 gap-2 rounded-full bg-primary px-4 text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 lg:hidden"
      >
        <SlidersHorizontal aria-hidden="true" />
        Controles
      </Button>
    </>
  );
}
