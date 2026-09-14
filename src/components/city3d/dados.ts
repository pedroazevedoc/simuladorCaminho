import { Coordenada3D } from "@/types/city";

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