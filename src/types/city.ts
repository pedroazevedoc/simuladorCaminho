export type TipoLocal = 'residencia' | 'comercio' | 'shopping';

export type Coordenada3D = [number, number, number];

export interface LocalProps {
  value: string;
  label: string;
  posicao: [number, number, number]; // Tupla de coordenadas 3D [X, Y, Z]
  tipo: TipoLocal;
}

export interface RuaProps {
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
  onSelecionarLocal?: (value: string | null) => void;
}

// Configuração visual (dimensões e material) de cada tipologia de local
export interface VisualTipo {
  dimensoes: {
    largura: number;
    altura: number;
    profundidade: number;
  };
  cor: string;
  rugosidade: number;
  metalness: number;
}

// Configuração visual do telhado de cada tipologia
export interface ConfigTelhado {
  tipo: 'piramide' | 'laje' | 'laje-elevada';
  cor: string;
  altura: number;       // Espessura/altura do telhado
  saliencia: number;    // O quanto a laje avança além das paredes
  alturaElevada: number; // Altura do bloco central (apenas laje-elevada)
  rugosidade: number;
  metalness: number;
}

export interface EstacionamentoProps {
  x: number;
  z: number;
  rotacao: number;
  largura: number;
  profundidade: number;
}

export interface CarroProps {
  x: number;
  z: number;
  rotacao: number;
  cor: number;
}