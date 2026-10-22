import { NextResponse } from 'next/server';
import { RequisicaoRota, RespostaRota, RuaProps } from '@/types/city';
import { LOCAIS, RUAS } from '@/mocks/cityMocks';
import { aplicarPesos, chaveRua } from '@/lib/ruas';

interface GrafoAdjacencia {
  [key: string]: { 
    [key: string]: number 
  };
}

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

// Algoritmo de Dijkstra
function calcularDijkstra(
  origemId: string,
  destinoId: string,
  ruas: RuaProps[]
): RespostaRota {
  // 1. Construir lista de adjacência (Grafo não direcionado)
  const grafo: GrafoAdjacencia = {};
  LOCAIS.forEach(loc => { grafo[loc.value] = {}; });
  
  ruas.forEach(rua => {
    grafo[rua.origem][rua.destino] = rua.peso;
    grafo[rua.destino][rua.origem] = rua.peso; // Não direcionado
  });

  // 2. Estruturas para rastrear distâncias e caminhos
  const distancias: Record<string, number> = {};
  const anteriores: Record<string, string | null> = {};
  const naoVisitados = new Set<string>(LOCAIS.map(l => l.value));

  LOCAIS.forEach(loc => {
    distancias[loc.value] = Infinity;
    anteriores[loc.value] = null;
  });
  distancias[origemId] = 0;

  // 3. Loop principal do Dijkstra
  while (naoVisitados.size > 0) {
    let atual: string | null = null;
    let menorDistancia = Infinity;

    for (const no of naoVisitados) {
      if (distancias[no] < menorDistancia) {
        menorDistancia = distancias[no];
        atual = no;
      }
    }

    if (atual === null || atual === destinoId) break;
    naoVisitados.delete(atual);

    for (const vizinho in grafo[atual]) {
      if (naoVisitados.has(vizinho)) {
        const alt = distancias[atual] + grafo[atual][vizinho];
        if (alt < distancias[vizinho]) {
          distancias[vizinho] = alt;
          anteriores[vizinho] = atual;
        }
      }
    }
  }

  // 4. Reconstruir o caminho percorrido
  const caminho: string[] = [];
  let noAtual: string | null = destinoId;
  while (noAtual !== null) {
    caminho.unshift(noAtual);
    noAtual = anteriores[noAtual];
  }

  return {
    caminho: distancias[destinoId] !== Infinity ? caminho : [],
    distanciaTotal: distancias[destinoId]
  };
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
  const resultado = calcularDijkstra(origem, destino, ruas);
  return NextResponse.json(resultado);
}