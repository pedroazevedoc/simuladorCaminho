import { Local, Rua } from '@/types/city';

// Coordenadas cartesianas (X, Y, Z) de cada local
// Z = 0 para simular um plano urbano
export const locais: Local[] = [
  { value: 'casa-do-luizinho', label: 'Casa do Luizinho',  posicao: [-10, 0, -5],  tipo: 'residencia' },
  { value: 'casa-dos-amigos',  label: 'Casa dos Amigos',   posicao: [-5, 0, 5],    tipo: 'residencia' },
  { value: 'casa-da-namorada', label: 'Casa da Namorada',  posicao: [5, 0, 8],     tipo: 'residencia' },
  { value: 'comercio',         label: 'Comércio Central',  posicao: [0, 0, -2],    tipo: 'comercio' },
  { value: 'shopping',         label: 'Shopping Center',   posicao: [10, 0, 2],    tipo: 'shopping' },
  { value: 'escola',           label: 'Escola Municipal',  posicao: [-14, 0, 4],   tipo: 'comercio' },
  { value: 'parque',           label: 'Parque Central',    posicao: [-2, 0, 8],    tipo: 'comercio' },
  { value: 'hospital',         label: 'Hospital Geral',    posicao: [4, 0, -8],    tipo: 'comercio' },
  { value: 'faculdade',        label: 'Faculdade',         posicao: [14, 0, -6],   tipo: 'comercio' },
  { value: 'rodoviaria',       label: 'Rodoviária',        posicao: [-6, 0, -12],  tipo: 'comercio' },
  { value: 'padaria',          label: 'Padaria do Bairro', posicao: [-16, 0, -10], tipo: 'comercio' },
  { value: 'cinema',           label: 'Cinema',            posicao: [8, 0, -3],    tipo: 'shopping' }
];

// As ruas (Arestas) com suas respectivas distâncias (Pesos em km)
export const ruas: Rua[] = [
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