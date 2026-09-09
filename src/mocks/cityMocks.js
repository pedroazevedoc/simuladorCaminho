// Coordenadas cartesianas (X, Y, Z) de cada local
// Z = 0 para simular um plano urbano
export const locais = [
  { id: 'casa_luizinho', nome: 'Casa do Luizinho', posicao: [-10, 0, -5], tipo: 'residencia' },
  { id: 'casa_amigos', nome: 'Casa dos Amigos', posicao: [-5, 0, 5], tipo: 'residencia' },
  { id: 'namorada', nome: 'Casa da Namorada', posicao: [5, 0, 8], tipo: 'residencia' },
  { id: 'comercio', nome: 'Comércio Central', posicao: [0, 0, -2], tipo: 'comercio' },
  { id: 'shopping', nome: 'Shopping Center', posicao: [10, 0, 2], tipo: 'shopping' }
];

// As ruas (Arestas) com suas respectivas distâncias (Pesos em km)
export const ruas = [
  { origem: 'casa_luizinho', destino: 'casa_amigos', peso: 3 },
  { origem: 'casa_luizinho', destino: 'comercio', peso: 4 },
  { origem: 'casa_amigos', destino: 'namorada', peso: 5 },
  { origem: 'comercio', destino: 'shopping', peso: 6 },
  { origem: 'namorada', destino: 'shopping', peso: 2 },
  { origem: 'comercio', destino: 'namorada', peso: 3 }
];