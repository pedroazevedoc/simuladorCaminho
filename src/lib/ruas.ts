import type { RuaProps } from '@/types/city';
import { RUAS } from '@/mocks/cityMocks';

// Limites do custo de uma via editável pelo usuário
export const PESO_MIN = 0.5;
export const PESO_MAX = 20;
export const PESO_PASSO = 0.1;

// Faixa de espessura do asfalto (em unidades do grid)
const LARGURA_MIN = 0.9;
const LARGURA_MAX = 1.3;

// Referência fixa: a faixa de custos originais do grafo. Usar limites fixos
// (em vez do mínimo/máximo atuais) evita que a espessura de uma via mude só
// porque outra via foi editada.
const PESOS_PADRAO = RUAS.map((rua) => rua.peso);
const REFERENCIA_MIN = Math.min(...PESOS_PADRAO);
const REFERENCIA_MAX = Math.max(...PESOS_PADRAO);

// Chave canônica de uma aresta: independe do sentido escolhido pelo usuário
export function chaveRua(origem: string, destino: string): string {
  return origem < destino ? `${origem}|${destino}` : `${destino}|${origem}`;
}

// Custo padrão (original do mock) de uma via, ou undefined se ela não existir
export function pesoPadrao(origem: string, destino: string): number | undefined {
  const chave = chaveRua(origem, destino);
  return RUAS.find((rua) => chaveRua(rua.origem, rua.destino) === chave)?.peso;
}

export function limitarPeso(peso: number): number {
  if (!Number.isFinite(peso)) return PESO_MIN;
  return Math.min(PESO_MAX, Math.max(PESO_MIN, peso));
}

export function formatarPeso(peso: number): string {
  return peso.toFixed(1);
}

// Normaliza para a mesma precisão exibida no rótulo (1 decimal), evitando que
// um valor digitado como 0.55 seja exibido como 0.6 mas pesado como 0.55
export function arredondarPeso(peso: number): number {
  return Number(peso.toFixed(1));
}

// Espessura do asfalto proporcional ao custo: é o único feedback visual que
// pode acompanhar o valor sem mover vértices (o eixo da via não muda, então
// não há risco de sobrepor árvores, postes ou estacionamentos).
export function larguraDaRua(peso: number): number {
  const proporcao =
    (limitarPeso(peso) - REFERENCIA_MIN) / (REFERENCIA_MAX - REFERENCIA_MIN);
  const normalizada = Math.min(1, Math.max(0, proporcao));
  return LARGURA_MIN + normalizada * (LARGURA_MAX - LARGURA_MIN);
}

// Aplica uma lista de custos sobre as vias originais do mock
export function aplicarPesos(
  pesos: Map<string, number>,
  base: RuaProps[] = RUAS
): RuaProps[] {
  return base.map((rua) => {
    const peso = pesos.get(chaveRua(rua.origem, rua.destino));
    return peso === undefined ? rua : { ...rua, peso };
  });
}
