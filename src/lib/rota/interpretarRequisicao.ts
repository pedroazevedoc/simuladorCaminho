import { LOCAIS, RUAS } from '@/mocks/cityMocks';
import { aplicarPesos, chaveRua } from '@/lib/ruas';
import type { RuaProps } from '@/types/city';

const LOCAIS_CONHECIDOS = new Set(LOCAIS.map((local) => local.value));
const CHAVES_CONHECIDAS = new Set(RUAS.map((rua) => chaveRua(rua.origem, rua.destino)));

type RequisicaoInterpretada =
  | { erro: string }
  | { origem: string; destino: string; ruas: RuaProps[]; bloqueadas: number[] };

// A topologia vem dos mocks; o cliente só pode ajustar pesos e bloqueios de vias conhecidas.
export function interpretarRequisicao(entrada: unknown): RequisicaoInterpretada {
  const corpo = typeof entrada === 'object' && entrada !== null
    ? entrada as { origem?: unknown; destino?: unknown; ruas?: unknown }
    : {};
  const { origem, destino } = corpo;

  if (!origem || !destino) return { erro: 'Origem e Destino são obrigatórios' };
  if (typeof origem !== 'string' || typeof destino !== 'string' ||
      !LOCAIS_CONHECIDOS.has(origem) || !LOCAIS_CONHECIDOS.has(destino)) {
    return { erro: 'Origem ou Destino desconhecido' };
  }

  const pesos = new Map<string, number>();
  const chavesBloqueadas = new Set<string>();
  if (Array.isArray(corpo.ruas)) {
    for (const item of corpo.ruas as unknown[]) {
      if (typeof item !== 'object' || item === null) continue;
      const rua = item as { origem?: unknown; destino?: unknown; peso?: unknown; bloqueada?: unknown };
      if (typeof rua.origem !== 'string' || typeof rua.destino !== 'string') continue;
      const chave = chaveRua(rua.origem, rua.destino);
      if (!CHAVES_CONHECIDAS.has(chave)) continue;

      const peso = Number(rua.peso);
      if (Number.isFinite(peso) && peso > 0) pesos.set(chave, peso);
      if (rua.bloqueada === true) chavesBloqueadas.add(chave);
    }
  }

  return {
    origem,
    destino,
    ruas: aplicarPesos(pesos),
    bloqueadas: RUAS.flatMap((rua, indice) =>
      chavesBloqueadas.has(chaveRua(rua.origem, rua.destino)) ? [indice] : []
    ),
  };
}
