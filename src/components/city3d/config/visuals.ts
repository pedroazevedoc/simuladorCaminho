import type { ConfigTelhado, TipoLocal, VisualTipo } from '@/types/city';
import {
  Bus,
  Clapperboard,
  GraduationCap,
  Home,
  Hospital,
  School,
  ShoppingBag,
  Store,
  TreePine,
  type LucideIcon,
} from 'lucide-react';

// Cores de estado compartilhadas entre os objetos 3D
export const CORES_ESTADO = {
  origem: '#f97316',      // Laranja — ponto de partida da rota
  destino: '#3b82f6',     // Azul — ponto final da rota
  trajeto: '#22c55e',     // Verde — nós visitados no caminho
  selecionado: '#eab308', // Amarelo — local em destaque (interação)
  rota: '#eab308',        // Amarelo — ruas que fazem parte do menor caminho
} as const;

// Cores do ambiente (entorno)
export const CORES_AMBIENTE = {
  chao: '#166534',      // Tom escuro do solo urbano
  asfalto: '#475569',   // Cor padrão das ruas
  calcada: '#94a3b8',   // Cor das calçadas laterais
  grama: '#166534',     // Canteiros e praça verde do parque
  lote: '#263244',      // Base de concreto dos lotes dos prédios
  muro: '#8b93a1',      // Muros que cercam os estacionamentos
  faixa: '#e2e8f0',     // Marcações de trânsito e faixas de pedestres
  vaga: '#475569',      // Piso dos estacionamentos
  vegetacao: '#15803d', // Árvores e vegetação do entorno
  tronco: '#7c4a26',    // Troncos das árvores
  poste: '#64748b',     // Postes de iluminação
  luz: '#fbbf24',       // Luzes de iluminação
} as const;

// Paleta de cores da lataria dos carros estacionados
export const CARROS_CORES = [
  '#dc2626', // Vermelho
  '#2563eb', // Azul
  '#eab308', // Amarelo
  '#adacac', // Cinza
  '#16a34a', // Verde
  '#8b5cf6', // Roxo
  '#f97316', // Laranja
  '#db2777', // Rosa
  '#14b8a6', // Ciano
  '#a85432', // Marrom
] as const;

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
  escola: {
    dimensoes: { largura: 6, altura: 2.2, profundidade: 4 },
    cor: '#d9b99b',
    rugosidade: 0.8,
    metalness: 0.1,
  },
  faculdade: {
    dimensoes: { largura: 5, altura: 4, profundidade: 5 },
    cor: '#b6c7d9',
    rugosidade: 0.7,
    metalness: 0.2,
  },
  hospital: {
    dimensoes: { largura: 4, altura: 3, profundidade: 4 },
    cor: '#f3f4f6',
    rugosidade: 0.75,
    metalness: 0.1,
  },
  parque: {
    dimensoes: { largura: 2.6, altura: 2, profundidade: 2.6 },
    cor: '#7aa776',
    rugosidade: 0.85,
    metalness: 0.05,
  },
  rodoviaria: {
    dimensoes: { largura: 5.5, altura: 3.2, profundidade: 5.5 },
    cor: '#9aa4b0',
    rugosidade: 0.7,
    metalness: 0.2,
  },
  cinema: {
    dimensoes: { largura: 4.2, altura: 3, profundidade: 3.6 },
    cor: '#3b4252',
    rugosidade: 0.6,
    metalness: 0.3,
  },
};

// Ícones de cada tipologia (usados no rótulo dos prédios e no cartão de informações)
export const ICONE_TIPO: Record<TipoLocal, LucideIcon> = {
  residencia: Home,
  comercio: Store,
  shopping: ShoppingBag,
  escola: School,
  faculdade: GraduationCap,
  hospital: Hospital,
  parque: TreePine,
  rodoviaria: Bus,
  cinema: Clapperboard,
};

// Rótulos em pt-BR de cada tipologia (usados no cartão de informações)
export const ROTULO_TIPO: Record<TipoLocal, string> = {
  residencia: 'Residência',
  comercio: 'Comércio',
  shopping: 'Shopping',
  escola: 'Escola',
  faculdade: 'Faculdade',
  hospital: 'Hospital',
  parque: 'Parque',
  rodoviaria: 'Rodoviária',
  cinema: 'Cinema',
};

export const CONFIG_TELHADO: Record<TipoLocal, ConfigTelhado> = {
  residencia: {
    tipo: 'piramide',
    cor: '#314158',
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
  escola: {
    tipo: 'laje',
    cor: '#8a5a44',
    altura: 0.16,
    saliencia: 0.35,
    alturaElevada: 0,
    rugosidade: 0.8,
    metalness: 0.1,
  },
  faculdade: {
    tipo: 'laje-elevada',
    cor: '#5a6b7c',
    altura: 0.2,
    saliencia: 0.4,
    alturaElevada: 0.7,
    rugosidade: 0.6,
    metalness: 0.2,
  },
  hospital: {
    tipo: 'laje',
    cor: '#94a3b8',
    altura: 0.18,
    saliencia: 0.35,
    alturaElevada: 0,
    rugosidade: 0.75,
    metalness: 0.15,
  },
  parque: {
    tipo: 'laje',
    cor: '#4d7c4f',
    altura: 0.15,
    saliencia: 0.3,
    alturaElevada: 0,
    rugosidade: 0.85,
    metalness: 0.05,
  },
  rodoviaria: {
    tipo: 'laje-elevada',
    cor: '#64748b',
    altura: 0.22,
    saliencia: 0.45,
    alturaElevada: 0.8,
    rugosidade: 0.65,
    metalness: 0.25,
  },
  cinema: {
    tipo: 'laje',
    cor: '#1f2937',
    altura: 0.2,
    saliencia: 0.4,
    alturaElevada: 0,
    rugosidade: 0.6,
    metalness: 0.3,
  },
};

// Exceções de dimensões para locais específicos que devem fugir do padrão do tipo
export const EXCECOES_DIMENSOES: Record<string, VisualTipo['dimensoes']> = {};

// Resolve as dimensões efetivas de um local (config do tipo + exceção, se houver)
export function resolverDimensoes(
  tipo: TipoLocal,
  value: string
): VisualTipo['dimensoes'] {
  return EXCECOES_DIMENSOES[value] ?? CONFIG_TIPO[tipo].dimensoes;
}