import { NextResponse } from 'next/server';
import { RequisicaoRota, RuaProps } from '@/types/city';
import { LOCAIS, RUAS } from '@/mocks/cityMocks';
import { calcularDijkstra } from '@/lib/dijkstra';
import { aplicarPesos, chaveRua } from '@/lib/ruas';

const LOCAIS_CONHECIDOS = new Set(LOCAIS.map((local) => local.value));
const CHAVES_CONHECIDAS = new Set(
  RUAS.map((rua) => chaveRua(rua.origem, rua.destino))
);

// Aplica os custos enviados pelo cliente, aceitando apenas vias que existem no
// grafo e valores válidos (finitos e > 0). Entradas inválidas são ignoradas:
// o cliente nunca define a topologia do grafo, apenas o custo das arestas.
function resolverRuas(entrada: unknown): RuaProps[] {
  const pesos = new Map<string, number>();

  if (Array.isArray(entrada)) {
    for (const item of entrada as unknown[]) {
      if (typeof item !== 'object' || item === null) continue;

      const { origem, destino, peso } = item as Partial<RuaProps>;
      if (typeof origem !== 'string' || typeof destino !== 'string') continue;

      const chave = chaveRua(origem, destino);
      if (!CHAVES_CONHECIDAS.has(chave)) continue;

      const valor = Number(peso);
      if (!Number.isFinite(valor) || valor <= 0) continue;

      pesos.set(chave, valor);
    }
  }

  return aplicarPesos(pesos);
}

// Endpoint POST para calcular a rota entre dois locais
export async function POST(request: Request) {
  let body: RequisicaoRota;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Corpo da requisição inválido' },
      { status: 400 }
    );
  }

  const { origem, destino } = body ?? {};

  if (!origem || !destino) {
    return NextResponse.json({ error: 'Origem e Destino são obrigatórios' }, { status: 400 });
  }

  if (!LOCAIS_CONHECIDOS.has(origem) || !LOCAIS_CONHECIDOS.has(destino)) {
    return NextResponse.json({ error: 'Origem ou Destino desconhecido' }, { status: 400 });
  }

  const ruas = resolverRuas(body.ruas);
  const bloqueadas = Array.isArray(body.ruas) ? RUAS.flatMap((rua, i) => body.ruas?.some(item => chaveRua(item.origem, item.destino) === chaveRua(rua.origem, rua.destino) && item.bloqueada === true) ? [i] : []) : [];
  const resultado = calcularDijkstra(origem, destino, ruas.map(rua => rua.peso), bloqueadas);
  return NextResponse.json(resultado);
}