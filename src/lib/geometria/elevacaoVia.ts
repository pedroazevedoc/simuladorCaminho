import { LOCAIS } from '@/mocks/cityMocks';

const AMIGOS = 'casa-dos-amigos';
const NAMORADA = 'casa-da-namorada';
const ALTURA = 1.4;
const MEIO_TABULEIRO = 2;
const RAMPA = 3;

// O viaduto separa visualmente duas arestas que se cruzam sem formar um nó.
const posicao = (id: string) => LOCAIS.find(local => local.value === id)!.posicao;
const amigos = posicao(AMIGOS);
const namorada = posicao(NAMORADA);
const comercio = posicao('comercio');
const parque = posicao('parque');
const ax = namorada[0] - amigos[0];
const az = namorada[2] - amigos[2];
const bx = parque[0] - comercio[0];
const bz = parque[2] - comercio[2];
const cruzamento = ((comercio[0] - amigos[0]) * bz - (comercio[2] - amigos[2]) * bx) / (ax * bz - az * bx);
const comprimento = Math.hypot(ax, az);
const centro = cruzamento * comprimento;

export function temViaduto(origem: string, destino: string): boolean {
  return (origem === AMIGOS && destino === NAMORADA) || (origem === NAMORADA && destino === AMIGOS);
}

// Distância horizontal medida no sentido informado pelos IDs da rua.
export function alturaDaVia(origem: string, destino: string, distancia: number): number {
  if (!temViaduto(origem, destino)) return 0;
  const distanciaAmigos = origem === AMIGOS ? distancia : comprimento - distancia;
  const afastamento = Math.abs(distanciaAmigos - centro);
  return ALTURA * Math.max(0, Math.min(1, (MEIO_TABULEIRO + RAMPA - afastamento) / RAMPA));
}

export function pontosDaVia(origem: string, destino: string, tamanho: number): number[] {
  if (!temViaduto(origem, destino)) return [0, tamanho];
  const pontos = [0, centro - MEIO_TABULEIRO - RAMPA, centro - MEIO_TABULEIRO, centro + MEIO_TABULEIRO, centro + MEIO_TABULEIRO + RAMPA, tamanho];
  return origem === AMIGOS ? pontos : pontos.map(ponto => tamanho - ponto).reverse();
}
