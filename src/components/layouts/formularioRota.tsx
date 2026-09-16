import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxList, ComboboxTrigger } from '@/components/kibo-ui/combobox';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { Label } from '@/components/ui/label';
import { Navigation } from 'lucide-react';
import { LOCAIS } from '@/mocks/cityMocks';
import { FormularioRotaProps } from '@/types/layouts';

export function FormularioRota({ origem, destino, carregando, onOrigemChange, onDestinoChange, onCalcular }: FormularioRotaProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 space-y-2 gap-2 bg-card p-3 rounded-lg border border-border shadow-lg max-w-4xl">
      {/* Origem */}
      <div className="flex flex-col">
        <Label htmlFor="origem" className="text-xs text-primary mb-1">Origem:</Label>
        <Combobox
          data={LOCAIS}
          type="origem"
          onValueChange={onOrigemChange}
          value={origem}
        >
          <ComboboxTrigger />
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

      {/* Destino */}
      <div className="flex flex-col">
        <Label htmlFor="destino" className="text-xs text-primary mb-1">Destino:</Label>
        <Combobox
          data={LOCAIS}
          type="destino"
          onValueChange={onDestinoChange}
          value={destino}
        >
          <ComboboxTrigger />
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

      <div className="flex items-center justify-center col-span-2 sm:col-span-1">
        <ShimmerButton
          onClick={onCalcular}
          disabled={carregando}
          shimmerColor="#f54900"
          shimmerSize="0.12rem"
          shimmerDuration="2s"
          background="rgba(15, 23, 42, 0.9)"
          className="relative flex items-center justify-center gap-3 px-6 py-2 rounded-xl font-bold text-white transition-all duration-300 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/25 hover:scale-[1.02] active:scale-[0.98] border border-orange-500/30 hover:border-orange-500/60 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
        >
          {/* Ícone com animação de pulso no hover */}
          <Navigation className={`w-5 h-5 text-orange-400 transition-transform duration-300 group-hover:rotate-45 ${carregando ? 'animate-spin' : ''}`} />

          <span className="tracking-wide bg-linear-to-r from-orange-200 via-white to-orange-100 bg-clip-text text-transparent">
            {carregando ? 'Calculando Rota...' : 'Calcular Menor Rota'}
          </span>
        </ShimmerButton>
      </div>
    </div>
  );
}