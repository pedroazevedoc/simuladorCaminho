'use client'

import { useMemo, useState } from 'react'
import type { CityMap3DProps } from '@/types/city'
import { Iluminacao } from './ambiente/iluminacao'
import { Chao } from './ambiente/chao'
import { Predio } from './geometria/predio'
import { RuaViaria } from './geometria/rua'
import { Entorno } from './geometria/entorno'
import { MobiliarioUrbano } from './geometria/mobiliarioUrbano'
import { VeiculoRota } from './geometria/veiculoRota'
import { CartaoLocal } from './geometria/cartaoLocal'
import { isRuaNaRota, isLocalNaRota } from './dados'
import { LOCAIS, RUAS } from '@/mocks/cityMocks'

export function CityScene(props: CityMap3DProps) {
  const { rotaResultado, ruas = RUAS, onSelecionarLocal, onAlternarRua, passo, rotaAnterior, noturno } = props;
  const caminhoIds = rotaResultado?.caminho ?? [];
  const [predioSelecionado, setPredioSelecionado] = useState<string | null>(null);

  // Pré-computa a geometria das ruas (evita recalculo no render)
  const ruasVisiveis = useMemo(
    () =>
      ruas
        .map((rua) => {
          const inicio = LOCAIS.find((l) => l.value === rua.origem);
          const destino = LOCAIS.find((l) => l.value === rua.destino);
          if (!inicio || !destino) return null;
          return { rua, inicio, destino };
        })
        .filter((r): r is NonNullable<typeof r> => r !== null),
    [ruas]
  );

  const atualizarSelecao = (value: string) => {
    const novoValor = predioSelecionado === value ? null : value;
    setPredioSelecionado(novoValor);
    onSelecionarLocal?.(novoValor);
  };

  const localSelecionado = LOCAIS.find((l) => l.value === predioSelecionado) ?? null;

  return (
    <>
      <Iluminacao noturno={noturno} />
      {!passo && props.progresso !== undefined && <VeiculoRota {...props} />}
      <Chao />
      <Entorno />
      <MobiliarioUrbano />

      {ruasVisiveis.map(({ rua, inicio, destino }) => (
        <RuaViaria
          key={`${rua.origem}-${rua.destino}`}
          rua={rua}
          inicio={inicio.posicao}
          fim={destino.posicao}
          naRota={!passo && isRuaNaRota(caminhoIds, rua.origem, rua.destino)}
          anterior={isRuaNaRota(rotaAnterior ?? [], rua.origem, rua.destino)}
          analisada={!!passo && ((passo.atual === rua.origem && passo.consideradas.includes(rua.destino)) || (passo.atual === rua.destino && passo.consideradas.includes(rua.origem)))}
          onAlternar={() => onAlternarRua?.(ruas.indexOf(rua))}
          rotaAtiva={rotaResultado !== null}
        />
      ))}

      {LOCAIS.map((local) => (
        <Predio
          key={local.value}
          local={local}
          isOrigem={caminhoIds[0] === local.value}
          isDestino={caminhoIds[caminhoIds.length - 1] === local.value}
          naRota={passo ? passo.visitados.includes(local.value) : isLocalNaRota(caminhoIds, local.value)}
          analisado={passo?.atual === local.value}
          selecionado={predioSelecionado === local.value}
          onSelecionar={() => atualizarSelecao(local.value)}
        />
      ))}

      {localSelecionado && (
        <group position={localSelecionado.posicao}>
          <CartaoLocal
            local={localSelecionado}
            isOrigem={caminhoIds[0] === localSelecionado.value}
            isDestino={caminhoIds[caminhoIds.length - 1] === localSelecionado.value}
            naRota={isLocalNaRota(caminhoIds, localSelecionado.value)}
          />
        </group>
      )}
    </>
  );
}