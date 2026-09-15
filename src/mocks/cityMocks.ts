import { CarroProps, EstacionamentoProps, LocalProps, RuaProps } from '@/types/city';

// Coordenadas cartesianas (X, Y, Z) de cada local
// Z = 0 para simular um plano urbano
export const LOCAIS: LocalProps[] = [
  { value: 'casa-do-luizinho', label: 'Casa do Luizinho',  posicao: [-18, 0, -9],  tipo: 'residencia' },
  { value: 'casa-dos-amigos',  label: 'Casa dos Amigos',   posicao: [-9, 0, 9],    tipo: 'residencia' },
  { value: 'casa-da-namorada', label: 'Casa da Namorada',  posicao: [9, 0, 14],    tipo: 'residencia' },
  { value: 'comercio',         label: 'Comércio Central',  posicao: [0, 0, -4],    tipo: 'comercio' },
  { value: 'shopping',         label: 'Shopping Center',   posicao: [18, 0, 4],    tipo: 'shopping' },
  { value: 'escola',           label: 'Escola Municipal',  posicao: [-25, 0, 7],   tipo: 'comercio' },
  { value: 'parque',           label: 'Parque Central',    posicao: [-3, 0, 20],   tipo: 'comercio' },
  { value: 'hospital',         label: 'Hospital Geral',    posicao: [7, 0, -14],   tipo: 'comercio' },
  { value: 'faculdade',        label: 'Faculdade',         posicao: [25, 0, -11],  tipo: 'comercio' },
  { value: 'rodoviaria',       label: 'Rodoviária',        posicao: [-11, 0, -22], tipo: 'comercio' },
  { value: 'padaria',          label: 'Padaria do Bairro', posicao: [-29, 0, -18], tipo: 'comercio' },
  { value: 'cinema',           label: 'Cinema',            posicao: [14, 0, -5],   tipo: 'shopping' }
];

// As ruas (Arestas) com suas respectivas distâncias (Pesos em km)
export const RUAS: RuaProps[] = [
  { origem: 'casa-do-luizinho', destino: 'casa-dos-amigos',  peso: 3 },
  { origem: 'casa-do-luizinho', destino: 'comercio',         peso: 4 },
  { origem: 'casa-dos-amigos',  destino: 'casa-da-namorada', peso: 5 },
  { origem: 'comercio',         destino: 'shopping',         peso: 6 },
  { origem: 'casa-da-namorada', destino: 'shopping',         peso: 2 },
  { origem: 'comercio',         destino: 'casa-da-namorada', peso: 3 },
  { origem: 'casa-do-luizinho', destino: 'padaria',          peso: 2 },
  { origem: 'padaria',          destino: 'rodoviaria',       peso: 4 },
  { origem: 'rodoviaria',       destino: 'comercio',         peso: 3 },
  { origem: 'casa-do-luizinho', destino: 'escola',           peso: 3 },
  { origem: 'escola',           destino: 'casa-dos-amigos',  peso: 4 },
  { origem: 'casa-dos-amigos',  destino: 'parque',           peso: 2 },
  { origem: 'parque',           destino: 'casa-da-namorada', peso: 3 },
  { origem: 'comercio',         destino: 'parque',           peso: 4 },
  { origem: 'comercio',         destino: 'hospital',         peso: 3 },
  { origem: 'hospital',         destino: 'cinema',           peso: 2 },
  { origem: 'hospital',         destino: 'faculdade',        peso: 5 },
  { origem: 'cinema',           destino: 'shopping',         peso: 2 },
  { origem: 'shopping',         destino: 'faculdade',        peso: 4 }
];

// Posições fixas (determinísticas) dos elementos de entorno — evitam o uso
// de Math.random durante o render (regra react-hooks/purity do lint).
export const ARVORES: [number, number][] = [
  [-32, -25],
  [-31, 16],
  [-22, 5],
  [22, 20],
  [29, 9],
  [-14, -29],
  [11, -27],
  [34, -4],
  [5, 25],
  [-7, 23],
];

export const POSTES: [number, number][] = [
  [-23, -5],
  [20, -13],
  [-16, 2],
  [27, 14],
];

// Áreas de estacionamento:
export const ESTACIONAMENTOS: EstacionamentoProps[] = [
  { x: 15.68, z: 10.01,  rotacao: 0.838,  largura: 6,   profundidade: 3 }, // Shopping Center
  { x: 24.80, z: -5.15,  rotacao: 1.134,  largura: 5,   profundidade: 3 }, // Faculdade
  { x: 14.08, z: -15.15, rotacao: -0.165, largura: 9.1, profundidade: 3 }, // Hospital
  { x: -25.5, z: 2.40,   rotacao: -1.984, largura: 5,   profundidade: 3 }, // Escola Municipal
];

// Carros estacionados
export const CARROS: CarroProps[] = [
  // Shopping Center
  // X: Aumenta | Z: Diminui
  { x: 14.65, z: 12.25, rotacao: Math.PI / 2 + 0.838, cor: 0 },
  { x: 15.30, z: 11.50, rotacao: Math.PI / 2 + 0.838, cor: 1 },
  { x: 15.95, z: 10.80, rotacao: Math.PI / 2 + 0.838, cor: 2 },
  { x: 16.60, z: 10.10, rotacao: Math.PI / 2 + 0.838, cor: 3 },
  { x: 17.20, z: 9.45,  rotacao: Math.PI / 2 + 0.838, cor: 4 },
  { x: 17.85, z: 8.75,  rotacao: Math.PI / 2 + 0.838, cor: 5 },

  // Faculdade 
  // X: Aumenta | Z: Aumenta
  { x: 24.7, z: -3.18,  rotacao: Math.PI / 2 + 1.134, cor: 5 },
  { x: 25.08, z: -4,    rotacao: Math.PI / 2 + 1.134, cor: 6 },
  { x: 25.42, z: -4.8,  rotacao: Math.PI / 2 + 1.134, cor: 7 },
  { x: 25.88, z: -5.62, rotacao: Math.PI / 2 + 1.134, cor: 8 },
  { x: 26.30, z: -6.52, rotacao: Math.PI / 2 + 1.134, cor: 9 },

  // Hospital
  { x: 10.43, z: -16.54, rotacao: Math.PI / 2 - 0.165, cor: 1 },
  { x: 11.32, z: -16.39, rotacao: Math.PI / 2 - 0.165, cor: 2 },
  { x: 12.21, z: -16.24, rotacao: Math.PI / 2 - 0.165, cor: 3 },
  { x: 13.10, z: -16.09, rotacao: Math.PI / 2 - 0.165, cor: 4 },
  { x: 13.99, z: -15.94, rotacao: Math.PI / 2 - 0.165, cor: 5 },
  { x: 14.88, z: -15.79, rotacao: Math.PI / 2 - 0.165, cor: 6 },
  { x: 15.77, z: -15.64, rotacao: Math.PI / 2 - 0.165, cor: 7 },
  { x: 16.66, z: -15.49, rotacao: Math.PI / 2 - 0.165, cor: 8 },
  { x: 17.55, z: -15.34, rotacao: Math.PI / 2 - 0.165, cor: 9 },

  // Escola Municipal
  // X: Diminui | Z: Aumenta
  { x: -25.50, z: 0.35, rotacao: Math.PI / 2 - 1.984, cor: 0 },
  { x: -25.85, z: 1.20, rotacao: Math.PI / 2 - 1.984, cor: 2 },
  { x: -26.20, z: 2.00, rotacao: Math.PI / 2 - 1.984, cor: 8 },
  { x: -26.60, z: 2.90, rotacao: Math.PI / 2 - 1.984, cor: 6 },
  { x: -27.00, z: 3.80, rotacao: Math.PI / 2 - 1.984, cor: 1 },
];