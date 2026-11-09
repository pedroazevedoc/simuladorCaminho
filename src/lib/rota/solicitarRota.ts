import type { RequisicaoRota, RespostaRota } from '@/types/city';

export async function solicitarRota(requisicao: RequisicaoRota): Promise<RespostaRota> {
  const resposta = await fetch('/api/rota', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requisicao),
  });

  if (!resposta.ok) {
    throw new Error(`Falha ao calcular a rota (${resposta.status})`);
  }
  return resposta.json() as Promise<RespostaRota>;
}
