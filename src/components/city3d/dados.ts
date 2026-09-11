export type Coordenada3D = [number, number, number];

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

// Posições fixas (determinísticas) dos elementos de entorno — evitam o uso
// de Math.random durante o render (regra react-hooks/purity do lint)
export const ARVORES: [number, number][] = [
  [-18, -14],
  [-17, 9],
  [-12, 3],
  [12, 11],
  [16, 5],
  [-8, -16],
  [6, -15],
  [19, -2],
  [3, 14],
  [-4, 13],
];

export const CARROS: [number, number][] = [
  [10, 1],
  [-4, 0.5],
  [-11, 7],
  [13, 5],
  [2, -11],
];

export const POSTES: [number, number][] = [
  [-13, -3],
  [11, -7],
  [-9, 1],
  [15, 8],
];