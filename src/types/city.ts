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

export interface CityMap3DProps {
  rotaResultado: RespostaRota | null;
}

export interface RuaLinhaProps {
  inicio: [number, number, number];
  fim: [number, number, number];
  cor: string;
  espessura: number;
  peso: number; // Distância em km
}