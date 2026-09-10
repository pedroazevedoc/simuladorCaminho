import { Local, Rua } from '@/types/city';

// Coordenadas cartesianas (X, Y, Z) de cada local
// Z = 0 para simular um plano urbano
export const locais: Local[] = [
  { id: 'casa_luizinho', nome: 'Casa do Luizinho', posicao: [-10, 0, -5],  tipo: 'residencia' },
  { id: 'casa_amigos',   nome: 'Casa dos Amigos',  posicao: [-5, 0, 5],    tipo: 'residencia' },
  { id: 'namorada',      nome: 'Casa da Namorada', posicao: [5, 0, 8],     tipo: 'residencia' },
  { id: 'comercio',      nome: 'Comércio Central', posicao: [0, 0, -2],    tipo: 'comercio' },
  { id: 'shopping',      nome: 'Shopping Center',  posicao: [10, 0, 2],    tipo: 'shopping' },
  { id: 'escola',        nome: 'Escola Municipal', posicao: [-14, 0, 4],   tipo: 'comercio' },
  { id: 'parque',        nome: 'Parque Central',   posicao: [-2, 0, 8],    tipo: 'comercio' },
  { id: 'hospital',      nome: 'Hospital Geral',   posicao: [4, 0, -8],    tipo: 'comercio' },
  { id: 'faculdade',     nome: 'Faculdade',        posicao: [14, 0, -6],   tipo: 'comercio' },
  { id: 'rodoviaria',    nome: 'Rodoviária',       posicao: [-6, 0, -12],  tipo: 'comercio' },
  { id: 'padaria',       nome: 'Padaria do Bairro',posicao: [-16, 0, -10], tipo: 'comercio' },
  { id: 'cinema',        nome: 'Cinema',           posicao: [8, 0, -3],    tipo: 'shopping' }
];

// As ruas (Arestas) com suas respectivas distâncias (Pesos em km)
export const ruas: Rua[] = [
  { origem: 'casa_luizinho', destino: 'casa_amigos', peso: 3 },
  { origem: 'casa_luizinho', destino: 'comercio',    peso: 4 },
  { origem: 'casa_amigos',   destino: 'namorada',    peso: 5 },
  { origem: 'comercio',      destino: 'shopping',    peso: 6 },
  { origem: 'namorada',      destino: 'shopping',    peso: 2 },
  { origem: 'comercio',      destino: 'namorada',    peso: 3 },
  { origem: 'casa_luizinho', destino: 'padaria',     peso: 2 },
  { origem: 'padaria',       destino: 'rodoviaria',  peso: 4 },
  { origem: 'rodoviaria',    destino: 'comercio',    peso: 3 },
  { origem: 'casa_luizinho', destino: 'escola',      peso: 3 },
  { origem: 'escola',        destino: 'casa_amigos', peso: 4 },
  { origem: 'casa_amigos',   destino: 'parque',      peso: 2 },
  { origem: 'parque',        destino: 'namorada',    peso: 3 },
  { origem: 'comercio',      destino: 'parque',      peso: 4 },
  { origem: 'comercio',      destino: 'hospital',    peso: 3 },
  { origem: 'hospital',      destino: 'cinema',      peso: 2 },
  { origem: 'hospital',      destino: 'faculdade',   peso: 5 },
  { origem: 'cinema',        destino: 'shopping',    peso: 2 },
  { origem: 'shopping',      destino: 'faculdade',   peso: 4 }
];