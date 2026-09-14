import { Coordenada3D, EstacionamentoProps } from "@/types/city";
import { LOCAIS, RUAS } from "@/mocks/cityMocks";

// Distância euclidiana entre dois pontos (as coordenadas ficam no plano XZ)
export function distanciaEntre(inicio: Coordenada3D, fim: Coordenada3D): number {
  return Math.hypot(
    fim[0] - inicio[0],
    fim[1] - inicio[1],
    fim[2] - inicio[2]
  );
}

// Ponto médio entre os dois extremos da rua
export function pontoMedio(inicio: Coordenada3D, fim: Coordenada3D): Coordenada3D {
  return [
    (inicio[0] + fim[0]) / 2,
    (inicio[1] + fim[1]) / 2,
    (inicio[2] + fim[2]) / 2,
  ];
}

// Ângulo de rotação no eixo Y para alinhar o asfalto com a direção início → fim
export function anguloDaRua(inicio: Coordenada3D, fim: Coordenada3D): number {
  return -Math.atan2(fim[2] - inicio[2], fim[0] - inicio[0]);
}

// Verifica se uma rua (origem → destino, em qualquer sentido) pertence ao menor caminho
export function isRuaNaRota(
  caminhoIds: string[],
  origem: string,
  destino: string
): boolean {
  for (let i = 0; i < caminhoIds.length - 1; i++) {
    if (
      (caminhoIds[i] === origem && caminhoIds[i + 1] === destino) ||
      (caminhoIds[i] === destino && caminhoIds[i + 1] === origem)
    ) {
      return true;
    }
  }
  return false;
}

// Indica se o local faz parte do trajeto calculado
export function isLocalNaRota(caminhoIds: string[], value: string): boolean {
  return caminhoIds.includes(value);
}

// Ponto mais próximo de um ponto dado sobre o segmento AB (projeção com clamp)
function pontoProximoNoSegmento(
  ponto: [number, number],
  a: [number, number],
  b: [number, number]
): [number, number] {
  const abX = b[0] - a[0];
  const abZ = b[1] - a[1];
  const apX = ponto[0] - a[0];
  const apZ = ponto[1] - a[1];
  const t = Math.min(
    1,
    Math.max(0, (apX * abX + apZ * abZ) / (abX * abX + abZ * abZ))
  );
  return [a[0] + t * abX, a[1] + t * abZ];
}

// Identifica o lado da entrada de um estacionamento: aquele voltado para a rua
// mais próxima. Retorna o eixo local ('x' ou 'z') e o sinal (1 ou -1) do lado
// onde o muro deve ter o vão de entrada.
export function ladoDaEntradaEstacionamento(
  estacao: EstacionamentoProps
): { eixo: 'x' | 'z'; sinal: 1 | -1 } {
  let melhorDistancia = Infinity;
  let direcao: [number, number] = [1, 0];

  for (const rua of RUAS) {
    const origem = LOCAIS.find((l) => l.value === rua.origem);
    const destino = LOCAIS.find((l) => l.value === rua.destino);
    if (!origem || !destino) continue;

    const proximo = pontoProximoNoSegmento(
      [estacao.x, estacao.z],
      [origem.posicao[0], origem.posicao[2]],
      [destino.posicao[0], destino.posicao[2]]
    );
    const distancia = Math.hypot(proximo[0] - estacao.x, proximo[1] - estacao.z);

    if (distancia < melhorDistancia) {
      melhorDistancia = distancia;
      direcao = [proximo[0] - estacao.x, proximo[1] - estacao.z];
    }
  }

  // Converte a direção global para o espaço local do estacionamento (rotação em Y)
  const cos = Math.cos(estacao.rotacao);
  const sin = Math.sin(estacao.rotacao);
  const xLocal = direcao[0] * cos - direcao[1] * sin;
  const zLocal = direcao[0] * sin + direcao[1] * cos;

  if (Math.abs(xLocal) >= Math.abs(zLocal)) {
    return { eixo: 'x', sinal: xLocal >= 0 ? 1 : -1 };
  }
  return { eixo: 'z', sinal: zLocal >= 0 ? 1 : -1 };
}