export type TipoLocal = 'residencia' | 'comercio' | 'shopping';

export interface Local {
  id: string;
  nome: string;
  posicao: [number, number, number]; // Tupla de coordenadas 3D [X, Y, Z]
  tipo: TipoLocal;
}

export interface Rua {
  origem: string;
  destino: string;
  peso: number;
}

export interface RequisicaoRota {
  origem: string;
  destino: string;
}

export interface RespostaRota {
  caminho: string[];
  distanciaTotal: number;
}