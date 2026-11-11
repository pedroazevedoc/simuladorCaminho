import { NextResponse } from 'next/server';
import { calcularDijkstra } from '@/lib/dijkstra';
import { interpretarRequisicao } from '@/lib/rota/interpretarRequisicao';

export async function POST(request: Request) {
  let corpo: unknown;
  try {
    corpo = await request.json();
  } catch {
    return NextResponse.json({ error: 'Corpo da requisição inválido' }, { status: 400 });
  }

  const dados = interpretarRequisicao(corpo);
  if ('erro' in dados) return NextResponse.json({ error: dados.erro }, { status: 400 });

  const resultado = calcularDijkstra(
    dados.origem,
    dados.destino,
    dados.ruas.map((rua) => rua.peso),
    dados.bloqueadas,
  );
  return NextResponse.json(resultado);
}
