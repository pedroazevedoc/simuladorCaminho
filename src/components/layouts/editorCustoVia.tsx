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
    <div className="w-full max-w-4xl bg-card p-3 rounded-lg border border-border shadow-lg space-y-3">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <SlidersHorizontal className="size-4 text-primary" />
        <h2 className="text-xs font-semibold text-primary uppercase tracking-wide">Custo das vias</h2>
        <span className="text-[11px] text-muted-foreground">
          Altere o custo de uma rua: a cidade não se move, apenas a espessura da via e o cálculo da rota mudam.
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-end">
        <div className="flex flex-col">
          <Label className="text-xs text-primary mb-1">De:</Label>
          <Combobox data={LOCAIS} type="origem" value={origem} onValueChange={setOrigem}>
            <ComboboxTrigger />
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
          <Label className="text-xs text-primary mb-1">Até:</Label>
          <Combobox data={LOCAIS} type="destino" value={destino} onValueChange={setDestino}>
            <ComboboxTrigger />
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
          <Label htmlFor="custo-via" id="custo-via-label" className="text-xs text-primary mb-1">
            Custo:
            {padrao !== undefined && (
              <span className="ml-1 font-normal text-muted-foreground">(padrão {formatarPeso(padrao)})</span>
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
          />
        </div>

        <div className="flex items-center sm:justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onRestaurar}
            disabled={editadas.length === 0}
            className="w-full sm:w-auto"
          >
            <RotateCcw />
            Restaurar padrão
          </Button>
        </div>
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

      {!rua && (
        <div className="text-[11px] text-muted-foreground space-y-1">
          <p>
            Não há rua direta entre <strong className="text-foreground">{nomeLocal(origem)}</strong> e{' '}
            <strong className="text-foreground">{nomeLocal(destino)}</strong>. Vias disponíveis a partir de{' '}
            {nomeLocal(origem)}:
          </p>
          <div className="flex flex-wrap gap-1">
            {vizinhos.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setDestino(value)}
                className="px-1.5 py-0.5 rounded border border-border text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                {nomeLocal(value)}
              </button>
            ))}
          </div>
        </div>
      )}

      {editadas.length > 0 && (
        <ul className="flex flex-wrap gap-1.5 text-[11px]">
          {editadas.map((r) => (
            <li
              key={chaveRua(r.origem, r.destino)}
              className="px-1.5 py-0.5 rounded border border-border bg-muted/40 text-muted-foreground"
            >
              {nomeLocal(r.origem)} ↔ {nomeLocal(r.destino)}:{' '}
              <span className="line-through">{formatarPeso(pesoPadrao(r.origem, r.destino) ?? r.peso)}</span>{' '}
              → <strong className="text-foreground">{formatarPeso(r.peso)}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
