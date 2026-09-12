import type { TipoLocal } from '@/types/city';

// Cores de estado compartilhadas entre os objetos 3D
export const CORES_ESTADO = {
  origem: '#f97316',      // Laranja — ponto de partida da rota
  destino: '#3b82f6',    // Azul — ponto final da rota
  trajeto: '#22c55e',     // Verde — nós visitados no caminho
  selecionado: '#eab308', // Amarelo — local em destaque (interação)
  rota: '#ef4444',        // Vermelho — ruas que fazem parte do menor caminho
} as const;

// Cores do ambiente (entorno)
export const CORES_AMBIENTE = {
  chao: '#0f172a',        // Tom escuro do solo urbano
  chaoSecundario: '#1e293b',
  asfalto: '#475569',     // Cor padrão das ruas
  asfaltoRota: '#ef4444', // Asfalto das ruas do trajeto (efeito neon)
  vegetacao: '#15803d',   // Árvores e vegetação do entorno
  veiculo: '#f59e0b',     // Carros estáticos do entorno
} as const;

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

export const CONFIG_TIPO: Record<TipoLocal, VisualTipo> = {
  residencia: {
    dimensoes: { largura: 2.2, altura: 1.8, profundidade: 2.2 },
    cor: '#e2e8f0',
    rugosidade: 0.8,
    metalness: 0.1,
  },
  comercio: {
    dimensoes: { largura: 3, altura: 3.2, profundidade: 3 },
    cor: '#cbd5e1',
    rugosidade: 0.7,
    metalness: 0.2,
  },
  shopping: {
    dimensoes: { largura: 4.5, altura: 3.5, profundidade: 4.5 },
    cor: '#94a3b8',
    rugosidade: 0.6,
    metalness: 0.3,
  },
};

// Rótulos em pt-BR de cada tipologia (usados no cartão de informações)
export const ROTULO_TIPO: Record<TipoLocal, string> = {
  residencia: 'Residência',
  comercio: 'Comércio',
  shopping: 'Shopping',
};

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

export const CONFIG_TELHADO: Record<TipoLocal, ConfigTelhado> = {
  residencia: {
    tipo: 'piramide',
    cor: '#b45309',
    altura: 1.1,
    saliencia: 0,
    alturaElevada: 0,
    rugosidade: 0.9,
    metalness: 0,
  },
  comercio: {
    tipo: 'laje',
    cor: '#64748b',
    altura: 0.18,
    saliencia: 0.35,
    alturaElevada: 0,
    rugosidade: 0.7,
    metalness: 0.2,
  },
  shopping: {
    tipo: 'laje-elevada',
    cor: '#475569',
    altura: 0.25,
    saliencia: 0.5,
    alturaElevada: 0.9,
    rugosidade: 0.6,
    metalness: 0.3,
  },
};

// Exceções de dimensões para locais específicos que devem fugir do padrão do tipo
export const EXCECOES_DIMENSOES: Record<string, VisualTipo['dimensoes']> = {
  faculdade: { largura: 5, altura: 4, profundidade: 5 },
  hospital: { largura: 4, altura: 3, profundidade: 4 },
};

// Resolve as dimensões efetivas de um local (config do tipo + exceção, se houver)
export function resolverDimensoes(
  tipo: TipoLocal,
  value: string
): VisualTipo['dimensoes'] {
  return EXCECOES_DIMENSOES[value] ?? CONFIG_TIPO[tipo].dimensoes;
}