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
  { value: 'parque',           label: 'Parque Central',    posicao: [-4, 0, 14],   tipo: 'comercio' },
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

// Áreas de estacionamento (pátio pintado no solo, com riscos de vagas)
export const ESTACIONAMENTOS: EstacionamentoProps[] = [
  { x: 17.75, z: 8.25, rotacao: 0,  largura: 6,   profundidade: 3 }, // Shopping Center
  { x: 25.5,  z: -6.5, rotacao: 0,  largura: 5,   profundidade: 3 }, // Faculdade
  { x: 14.05, z: -15,  rotacao: 0,  largura: 9.1, profundidade: 3 }, // Hospital
  { x: -25.5, z: 2.8,  rotacao: 11, largura: 5,   profundidade: 3 }, // Escola Municipal
];

// Carros estacionados: posição fixa, rotação (em torno de Y) e índice da cor na paleta
export const CARROS: CarroProps[] = [
  // Shopping Center
  { x: 16.14, z: 9, rotacao: -Math.PI / 2, cor: 0 },
  { x: 17.14, z: 9, rotacao: -Math.PI / 2, cor: 1 },
  { x: 18.14, z: 9, rotacao: -Math.PI / 2, cor: 2 },
  { x: 19.14, z: 9, rotacao: -Math.PI / 2, cor: 3 },
  { x: 20.14, z: 9, rotacao: -Math.PI / 2, cor: 4 },

  // Faculdade
  { x: 24.4, z: -5.7, rotacao: -Math.PI / 2, cor: 5 },
  { x: 25.4, z: -5.7, rotacao: -Math.PI / 2, cor: 6 },
  { x: 26.4, z: -5.7, rotacao: -Math.PI / 2, cor: 7 },
  { x: 27.4, z: -5.7, rotacao: -Math.PI / 2, cor: 8 },

  // Hospital
  { x: 10.11, z: -15.8, rotacao: -Math.PI / 2, cor: 1 },
  { x: 10.99, z: -15.8, rotacao: -Math.PI / 2, cor: 2 },
  { x: 11.99, z: -15.8, rotacao: -Math.PI / 2, cor: 3 },
  { x: 12.99, z: -15.8, rotacao: -Math.PI / 2, cor: 4 },
  { x: 13.99, z: -15.8, rotacao: -Math.PI / 2, cor: 5 },
  { x: 14.99, z: -15.8, rotacao: -Math.PI / 2, cor: 6 },
  { x: 15.99, z: -15.8, rotacao: -Math.PI / 2, cor: 7 },
  { x: 16.99, z: -15.8, rotacao: -Math.PI / 2, cor: 8 },
  { x: 17.99, z: -15.8, rotacao: -Math.PI / 2, cor: 9 },
  
  // Escola Municipal
  { x: -26.3, z: 1.3, rotacao: 0, cor: 0 },
  { x: -26.3, z: 2.3, rotacao: 0, cor: 2 },
  { x: -26.3, z: 3.3, rotacao: 0, cor: 8 },
  { x: -26.3, z: 4.3, rotacao: 0, cor: 6 },
];