import { LOCAIS, RUAS } from '@/mocks/cityMocks';
import type { PassoDijkstra, RespostaRota } from '@/types/city';

export function calcularDijkstra(origem: string, destino: string, pesos: number[], bloqueadas: number[] = []): RespostaRota {
  const distancias: Record<string, number> = Object.fromEntries(LOCAIS.map(local => [local.value, Infinity]));
  const anteriores: Record<string, string> = {};
  const pendentes = new Set(LOCAIS.map(local => local.value));
  const visitados: string[] = [];
  const passos: PassoDijkstra[] = [];
  distancias[origem] = 0;
  while (pendentes.size) {
    const atual = [...pendentes].reduce((melhor, id) => distancias[id] < distancias[melhor] ? id : melhor);
    if (!Number.isFinite(distancias[atual])) break;
    pendentes.delete(atual);
    visitados.push(atual);
    const consideradas: string[] = [];
    if (atual !== destino) RUAS.forEach((rua, indice) => {
      if (bloqueadas.includes(indice)) return;
      const vizinho = rua.origem === atual ? rua.destino : rua.destino === atual ? rua.origem : null;
      if (!vizinho || !pendentes.has(vizinho)) return;
      consideradas.push(vizinho);
      const alternativa = distancias[atual] + pesos[indice];
      if (alternativa < distancias[vizinho]) {
        distancias[vizinho] = alternativa;
        anteriores[vizinho] = atual;
      }
    });
    passos.push({ atual, visitados: [...visitados], consideradas, distancias: Object.fromEntries(Object.entries(distancias).map(([id, valor]) => [id, Number.isFinite(valor) ? Math.round(valor * 100) / 100 : null])) });
    if (atual === destino) break;
  }
  if (!Number.isFinite(distancias[destino])) return { caminho: [], distanciaTotal: null, passos };
  const caminho = [destino];
  while (caminho[0] !== origem) caminho.unshift(anteriores[caminho[0]]);
  return { caminho, distanciaTotal: Math.round(distancias[destino] * 100) / 100, passos };
}
