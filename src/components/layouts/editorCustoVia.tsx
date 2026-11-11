'use client';

import { useId, useState } from 'react';
import { RotateCcw, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LOCAIS } from '@/mocks/cityMocks';
import type { RuaProps } from '@/types/city';
import type { EditorCustoViaProps } from '@/types/layouts';

const nomes = new Map(LOCAIS.map((local) => [local.value, local.label]));

function LinhaRua({ rua, onAlterarPeso, onAlternarRua }: {
  rua: RuaProps;
  onAlterarPeso: EditorCustoViaProps['onAlterarPeso'];
  onAlternarRua: EditorCustoViaProps['onAlternarRua'];
}) {
  const id = useId();
  const [texto, setTexto] = useState<string | null>(null);
  const valor = texto ?? String(rua.peso);
  const numero = Number(valor.replace(',', '.'));
  const invalido = !valor.trim() || !Number.isFinite(numero) || numero <= 0 || numero > 10000;
  const origem = nomes.get(rua.origem) ?? rua.origem;
  const destino = nomes.get(rua.destino) ?? rua.destino;

  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/70 py-3 last:border-0">
      <div className="flex min-w-0 flex-col items-start gap-1 text-xs leading-relaxed">
        <label htmlFor={id}>
          <span className="block font-semibold">{origem}</span>
          <span className="text-muted-foreground">até {destino}</span>
        </label>
        <Button type="button" variant={rua.bloqueada ? 'destructive' : 'secondary'} size="xs" aria-pressed={!!rua.bloqueada} onClick={() => onAlternarRua(rua.origem, rua.destino)}>
          {rua.bloqueada ? 'Liberar rua' : 'Bloquear rua'}
        </Button>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Input
          id={id}
          type="text"
          inputMode="decimal"
          value={valor}
          aria-invalid={invalido}
          aria-describedby={invalido ? `${id}-erro` : undefined}
          className="w-20 text-right tabular-nums"
          onChange={(event) => {
            const novoTexto = event.target.value;
            const novoValor = Number(novoTexto.replace(',', '.'));
            setTexto(novoTexto);
            if (novoTexto.trim() && Number.isFinite(novoValor) && novoValor > 0 && novoValor <= 10000) {
              onAlterarPeso(rua.origem, rua.destino, novoValor);
            }
          }}
          onBlur={() => setTexto(null)}
        />
        <span className="text-xs text-muted-foreground">km</span>
      </div>
      {invalido && <span id={`${id}-erro`} className="sr-only">Informe uma distância maior que zero e até 10.000 km. O último valor válido permanece aplicado.</span>}
    </div>
  );
}

export function EditorCustoVia({ ruas, onAlterarPeso, onAlternarRua, onRestaurar }: EditorCustoViaProps) {
  return (
    <section aria-label="Distâncias das ruas" className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <header className="flex items-start justify-between gap-3 border-b border-border p-4">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-semibold"><Route className="size-4 text-primary" aria-hidden="true" /> Distâncias das ruas</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Altere os valores ou bloqueie ruas para recalcular uma rota existente.</p>
        </div>
        <Button type="button" variant="outline" size="xs" onClick={onRestaurar}>
          <RotateCcw data-icon="inline-start" /> Restaurar
        </Button>
      </header>
      <div
        role="region"
        aria-label="Lista de distâncias das ruas"
        tabIndex={0}
        className="max-h-[min(24rem,45dvh)] overflow-y-auto px-4 [scrollbar-color:var(--border)_transparent] [scrollbar-width:thin]"
      >
        {ruas.map((rua) => <LinhaRua key={`${rua.origem}-${rua.destino}`} rua={rua} onAlterarPeso={onAlterarPeso} onAlternarRua={onAlternarRua} />)}
      </div>
      <p className="border-t border-border px-4 py-3 text-xs text-muted-foreground">Distâncias maiores que zero, até 10.000 km.</p>
    </section>
  );
}
