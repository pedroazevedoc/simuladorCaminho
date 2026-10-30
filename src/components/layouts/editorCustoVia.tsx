'use client'

import { useState } from 'react'
import { RotateCcw, SlidersHorizontal } from 'lucide-react'
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from '@/components/kibo-ui/combobox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { LOCAIS, RUAS } from '@/mocks/cityMocks'
import {
  arredondarPeso,
  chaveRua,
  formatarPeso,
  limitarPeso,
  pesoPadrao,
  PESO_MAX,
  PESO_MIN,
  PESO_PASSO,
} from '@/lib/ruas'
import type { EditorCustoViaProps } from '@/types/layouts'

const NOME_LOCAL = new Map(LOCAIS.map((local) => [local.value, local.label]))

function nomeLocal(value: string): string {
  return NOME_LOCAL.get(value) ?? value
}

export function EditorCustoVia({ ruas, onAlterarPeso, onRestaurar }: EditorCustoViaProps) {
  const [origem, setOrigem] = useState<string>(RUAS[0].origem)
  const [destino, setDestino] = useState<string>(RUAS[0].destino)
  // Texto em edição, atrelado à via selecionada e ao valor que foi de fato
  // aplicado. Se o custo da rua mudar por fora (ex.: "Restaurar padrão"), o
  // ajuste pendente deixa de corresponder e o campo volta ao valor da via.
  const [ajuste, setAjuste] = useState<{
    chave: string
    texto: string
    aplicado: number | null
  } | null>(null)

  const chaveSelecionada = chaveRua(origem, destino)
  const rua = ruas.find((r) => chaveRua(r.origem, r.destino) === chaveSelecionada) ?? null
  const padrao = pesoPadrao(origem, destino)

  const ajusteValido =
    ajuste !== null &&
    ajuste.chave === chaveSelecionada &&
    (ajuste.aplicado === null || ajuste.aplicado === rua?.peso)

  const valorTexto = ajusteValido
    ? ajuste.texto
    : rua
      ? formatarPeso(rua.peso)
      : ''

  const numeroDigitado = Number(valorTexto.replace(',', '.'))
  const foraDaFaixa =
    valorTexto.trim() !== '' &&
    (!Number.isFinite(numeroDigitado) ||
      numeroDigitado < PESO_MIN ||
      numeroDigitado > PESO_MAX)

  const valorSlider = rua ? limitarPeso(rua.peso) : PESO_MIN
  const editadas = ruas.filter((r) => pesoPadrao(r.origem, r.destino) !== r.peso)

  // Vias que existem a partir do local escolhido (ajuda quando não há ligação direta)
  const vizinhos = RUAS.map((r) => {
    if (r.origem === origem) return r.destino
    if (r.destino === origem) return r.origem
    return null
  }).filter((valor): valor is string => valor !== null)

  // Só aplica valores dentro da faixa: enquanto o usuário digita, o texto é
  // preservado (evita que "0" vire "0,5" no meio da digitação)
  const aplicar = (texto: string) => {
    const numero = Number(texto.replace(',', '.'))
    const dentroDaFaixa =
      texto.trim() !== '' &&
      Number.isFinite(numero) &&
      numero >= PESO_MIN &&
      numero <= PESO_MAX

    const aplicado = dentroDaFaixa ? limitarPeso(arredondarPeso(numero)) : null

    setAjuste({
      chave: chaveSelecionada,
      texto,
      aplicado,
    })

    if (aplicado !== null) onAlterarPeso(origem, destino, aplicado)
  }

  const aplicarSlider = (numero: number) => {
    setAjuste({ chave: chaveSelecionada, texto: formatarPeso(numero), aplicado: numero })
    onAlterarPeso(origem, destino, numero)
  }

  return (
    <section
      aria-labelledby="custo-vias-titulo"
      className="w-full rounded-xl border border-border/70 bg-card p-3.5 shadow-sm"
    >
      <header className="mb-3 flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-2">
          <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <SlidersHorizontal className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 id="custo-vias-titulo" className="text-sm font-semibold text-foreground">
              Custo das vias
            </h2>
            <p className="text-xs leading-snug text-muted-foreground">
              Ajuste o peso de uma rua: só a espessura e o cálculo mudam.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={onRestaurar}
          disabled={editadas.length === 0}
          aria-label="Restaurar custos padrão de todas as vias"
          title="Restaurar padrão"
          className="shrink-0 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw />
          <span className="hidden min-[380px]:inline">Restaurar</span>
        </Button>
      </header>

      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex flex-col">
            <Label htmlFor="via-origem" className="mb-1.5 text-xs font-medium text-foreground">
              De
            </Label>
            <Combobox data={LOCAIS} type="origem" value={origem} onValueChange={setOrigem}>
              <ComboboxTrigger id="via-origem" className="w-full" />
              <ComboboxContent>
                <ComboboxInput />
                <ComboboxList>
                  {LOCAIS.map((loc) => (
                    <ComboboxItem key={loc.value} value={loc.value}>
                      {loc.label}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>

          <div className="flex flex-col">
            <Label htmlFor="via-destino" className="mb-1.5 text-xs font-medium text-foreground">
              Até
            </Label>
            <Combobox data={LOCAIS} type="destino" value={destino} onValueChange={setDestino}>
              <ComboboxTrigger id="via-destino" className="w-full" />
              <ComboboxContent>
                <ComboboxInput />
                <ComboboxList>
                  {LOCAIS.map((loc) => (
                    <ComboboxItem key={loc.value} value={loc.value}>
                      {loc.label}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>
        </div>

        <div className="flex flex-col">
          <Label htmlFor="custo-via" id="custo-via-label" className="mb-1.5 text-xs font-medium text-foreground">
            Custo da via
            {padrao !== undefined && (
              <span className="ml-1 font-normal text-muted-foreground">
                (padrão {formatarPeso(padrao)})
              </span>
            )}
          </Label>
          <Input
            id="custo-via"
            type="number"
            inputMode="decimal"
            min={PESO_MIN}
            max={PESO_MAX}
            step={PESO_PASSO}
            value={valorTexto}
            disabled={!rua}
            aria-invalid={foraDaFaixa}
            onChange={(e) => aplicar(e.target.value)}
            onBlur={() => setAjuste(null)}
            className="tabular-nums"
          />
        </div>

        <Slider
          aria-labelledby="custo-via-label"
          value={[valorSlider]}
          min={PESO_MIN}
          max={PESO_MAX}
          step={PESO_PASSO}
          disabled={!rua}
          onValueChange={(valor) =>
            aplicarSlider(typeof valor === 'number' ? valor : valor[0])
          }
        />
      </div>

      {/* Informação sobre as vias disponíveis */}
      {!rua && (
        <div className="mt-3 rounded-lg border border-dashed border-border bg-muted/30 p-2.5 text-[11px] text-muted-foreground space-y-1.5">
          <p>
            Não há rua direta entre{' '}
            <strong className="text-foreground">{nomeLocal(origem)}</strong> e{' '}
            <strong className="text-foreground">{nomeLocal(destino)}</strong>. Vias
            disponíveis a partir de {nomeLocal(origem)}:
          </p>
          <div className="flex flex-wrap gap-1">
            {vizinhos.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setDestino(value)}
                className="rounded border border-border px-1.5 py-0.5 text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 cursor-pointer"
              >
                {nomeLocal(value)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Informação sobre as vias editadas */}
      {editadas.length > 0 && (
        <div className="mt-3 space-y-1.5">
          <p className="text-[11px] text-muted-foreground">
            {editadas.length} via{editadas.length > 1 ? 's' : ''} editada
            {editadas.length > 1 ? 's' : ''}:
          </p>
          <ul className="flex flex-wrap gap-1.5 text-[11px]">
            {editadas.map((r) => (
              <li
                key={chaveRua(r.origem, r.destino)}
                className="rounded border border-border bg-muted/40 px-1.5 py-0.5 text-muted-foreground"
              >
                {nomeLocal(r.origem)} ↔ {nomeLocal(r.destino)}:{' '}
                <span className="line-through">
                  {formatarPeso(pesoPadrao(r.origem, r.destino) ?? r.peso)}
                </span>{' '}
                → <strong className="text-foreground">{formatarPeso(r.peso)}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
