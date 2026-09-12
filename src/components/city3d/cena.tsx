'use client'

import { useMemo, useState } from 'react'
import { locais, ruas } from '@/mocks/cityMocks'
import type { CityMap3DProps } from '@/types/city'
import { Iluminacao } from './ambiente/iluminacao'
import { Chao } from './ambiente/chao'
import { Predio } from './geometria/predio'
import { RuaViaria } from './geometria/rua'
import { Entorno } from './geometria/entorno'
import { CartaoLocal } from './geometria/cartaoLocal'
import { isRuaNaRota, isLocalNaRota } from './dados'

export function CityScene({ rotaResultado, onSelecionarLocal }: CityMap3DProps) {
  const caminhoIds = rotaResultado?.caminho ?? [];
  const [predioSelecionado, setPredioSelecionado] = useState<string | null>(null);

  // Pré-computa a geometria das ruas (evita recalculo no render)
  const ruasVisiveis = useMemo(
    () =>
      ruas
        .map((rua) => {
          const inicio = locais.find((l) => l.value === rua.origem);
          const destino = locais.find((l) => l.value === rua.destino);
          if (!inicio || !destino) return null;
          return { rua, inicio, destino };
        })
        .filter((r): r is NonNullable<typeof r> => r !== null),
    []
  );

  const atualizarSelecao = (value: string) => {
    const novoValor = predioSelecionado === value ? null : value;
    setPredioSelecionado(novoValor);
    onSelecionarLocal?.(novoValor);
  };

  const localSelecionado = locais.find((l) => l.value === predioSelecionado) ?? null;

  return (
    <>
      <Iluminacao />
      <Chao />
      <Entorno />

      {ruasVisiveis.map(({ rua, inicio, destino }) => (
        <RuaViaria
          key={`${rua.origem}-${rua.destino}`}
          rua={rua}
          inicio={inicio.posicao}
          fim={destino.posicao}
          naRota={isRuaNaRota(caminhoIds, rua.origem, rua.destino)}
        />
      ))}

      {locais.map((local) => (
        <Predio
          key={local.value}
          local={local}
          isOrigem={caminhoIds[0] === local.value}
          isDestino={caminhoIds[caminhoIds.length - 1] === local.value}
          naRota={isLocalNaRota(caminhoIds, local.value)}
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