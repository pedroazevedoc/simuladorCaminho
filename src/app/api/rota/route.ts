import { NextResponse } from 'next/server';
import { locais, ruas } from '@/mocks/cityMocks';
import { RequisicaoRota, RespostaRota } from '@/types/city';

interface GrafoAdjacencia {
  [key: string]: { 
    [key: string]: number 
  };
}

// Algoritmo de Dijkstra
function calcularDijkstra(origemId: string, destinoId: string): RespostaRota {
  // 1. Construir lista de adjacência (Grafo não direcionado)
  const grafo: GrafoAdjacencia = {};
  locais.forEach(loc => { grafo[loc.id] = {}; });
  
  ruas.forEach(rua => {
    grafo[rua.origem][rua.destino] = rua.peso;
    grafo[rua.destino][rua.origem] = rua.peso; // Não direcionado
  });

  // 2. Estruturas para rastrear distâncias e caminhos
  const distancias: Record<string, number> = {};
  const anteriores: Record<string, string | null> = {};
  const naoVisitados = new Set<string>(locais.map(l => l.id));

  locais.forEach(loc => {
    distancias[loc.id] = Infinity;
    anteriores[loc.id] = null;
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
  const body: RequisicaoRota = await request.json();
  const { origem, destino } = body;

  if (!origem || !destino) {
    return NextResponse.json({ error: 'Origem e Destino são obrigatórios' }, { status: 400 });
  }

  const resultado = calcularDijkstra(origem, destino);
  return NextResponse.json(resultado);
}