import { NextResponse } from 'next/server';
import { locais, ruas } from '@/mocks/cityMocks';

// Algoritmo de Dijkstra
function calcularDijkstra(origemId, destinoId) {
  // 1. Construir lista de adjacência (Grafo não direcionado)
  const grafo = {};
  locais.forEach(loc => { grafo[loc.id] = {}; });
  
  ruas.forEach(rua => {
    grafo[rua.origem][rua.destino] = rua.peso;
    grafo[rua.destino][rua.origem] = rua.peso; // Não direcionado
  });

  // 2. Estruturas para rastrear distâncias e caminhos
  const distancias = {};
  const anteriores = {};
  const naoVisitados = new Set(locais.map(l => l.id));

  locais.forEach(loc => {
    distancias[loc.id] = Infinity;
    anteriores[loc.id] = null;
  });
  distancias[origemId] = 0;

  // 3. Loop principal do Dijkstra
  while (naoVisitados.size > 0) {
    let atual = null;
    let menorDistancia = Infinity;

    for (let no of naoVisitados) {
      if (distancias[no] < menorDistancia) {
        menorDistancia = distancias[no];
        atual = no;
      }
    }

    if (atual === null || atual === destinoId) break;
    naoVisitados.delete(atual);

    for (let vizinho in grafo[atual]) {
      if (naoVisitados.has(vizinho)) {
        let alt = distancias[atual] + grafo[atual][vizinho];
        if (alt < distancias[vizinho]) {
          distancias[vizinho] = alt;
          anteriores[vizinho] = atual;
        }
      }
    }
  }

  // 4. Reconstruir o caminho percorrido
  const caminho = [];
  let noAtual = destinoId;
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
export async function POST(request) {
  const body = await request.json();
  const { origem, destino } = body;

  if (!origem || !destino) {
    return NextResponse.json({ error: 'Origem e Destino são obrigatórios' }, { status: 400 });
  }

  const resultado = calcularDijkstra(origem, destino);
  return NextResponse.json(resultado);
}