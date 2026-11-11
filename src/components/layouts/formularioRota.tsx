import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxList, ComboboxTrigger } from '@/components/kibo-ui/combobox';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowUpDown, Navigation } from 'lucide-react';
import { LOCAIS } from '@/mocks/cityMocks';
import { FormularioRotaProps } from '@/types/layouts';

export function FormularioRota({
  origem,
  destino,
  carregando,
  onOrigemChange,
  onDestinoChange,
  onCalcular,
  onTrocarPontos,
}: FormularioRotaProps) {
  return (
    <section
      aria-labelledby="form-rota-titulo"
      className="w-full rounded-xl border border-border/70 bg-card p-3.5 shadow-sm"
    >
      <header className="mb-3 flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-2">
          <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Navigation className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 id="form-rota-titulo" className="text-sm font-semibold text-foreground">
              Planejar rota
            </h2>
            <p className="text-xs leading-snug text-muted-foreground">
              Escolha os pontos para calcular o menor caminho.
            </p>
          </div>
        </div>

        {onTrocarPontos && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onTrocarPontos}
            aria-label="Inverter origem e destino"
            title="Inverter origem e destino"
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            <ArrowUpDown />
          </Button>
        )}
      </header>

      <div className="space-y-3">
        <div className="flex flex-col">
          <Label
            htmlFor="origem"
            className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-foreground"
          >
            <span className="size-2 rounded-full bg-origem" aria-hidden="true" />
            Origem
          </Label>
          <Combobox
            data={LOCAIS}
            type="origem"
            onValueChange={onOrigemChange}
            value={origem}
          >
            <ComboboxTrigger id="origem" className="w-full" />
            <ComboboxContent>
              <ComboboxInput />
              <ComboboxEmpty />
              <ComboboxList>
                <ComboboxGroup>
                  {LOCAIS.map((loc) => (
                    <ComboboxItem key={loc.value} value={loc.value}>
                      {loc.label}
                    </ComboboxItem>
                  ))}
                </ComboboxGroup>
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>

        <div className="flex flex-col">
          <Label
            htmlFor="destino"
            className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-foreground"
          >
            <span className="size-2 rounded-full bg-destino" aria-hidden="true" />
            Destino
          </Label>
          <Combobox
            data={LOCAIS}
            type="destino"
            onValueChange={onDestinoChange}
            value={destino}
          >
            <ComboboxTrigger id="destino" className="w-full" />
            <ComboboxContent>
              <ComboboxInput />
              <ComboboxEmpty />
              <ComboboxList>
                <ComboboxGroup>
                  {LOCAIS.map((loc) => (
                    <ComboboxItem key={loc.value} value={loc.value}>
                      {loc.label}
                    </ComboboxItem>
                  ))}
                </ComboboxGroup>
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>

        <ShimmerButton
          type="button"
          onClick={onCalcular}
          disabled={carregando}
          aria-busy={carregando}
          shimmerColor="var(--primary)"
          shimmerSize="0.12rem"
          shimmerDuration="2s"
          background="var(--map)"
          className="relative flex w-full items-center justify-center gap-3 rounded-xl px-4 py-2 text-sm font-bold text-map-foreground shadow-lg shadow-primary/10 transition-all duration-300 hover:scale-[1.01] hover:shadow-primary/25 active:scale-[0.99] border border-primary/30 hover:border-primary/60 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Navigation
            className={`size-4 text-primary transition-transform duration-300 group-hover:rotate-45 ${carregando ? 'animate-spin' : ''}`}
            aria-hidden="true"
          />
          <span className="tracking-wide">
            {carregando ? 'Calculando Rota...' : 'Calcular Menor Rota'}
          </span>
        </ShimmerButton>
      </div>
    </section>
  );
}
