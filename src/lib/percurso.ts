import { LOCAIS } from '@/mocks/cityMocks';
import type { Coordenada3D } from '@/types/city';

// A animação usa a geometria do desenho; a velocidade não representa km/h reais.
export function posicaoPercurso(caminho: string[], progresso: number): { posicao: Coordenada3D; angulo: number } | null {
  const pontos = caminho.map(id => LOCAIS.find(local => local.value === id)?.posicao).filter((p): p is Coordenada3D => !!p);
  if (pontos.length < 2) return null;
  const comprimentos = pontos.slice(1).map((p, i) => Math.hypot(p[0] - pontos[i][0], p[2] - pontos[i][2]));
  let restante = Math.min(1, Math.max(0, progresso)) * comprimentos.reduce((a, b) => a + b, 0);
  for (let i = 0; i < comprimentos.length; i++) {
    if (restante <= comprimentos[i] || i === comprimentos.length - 1) {
      const t = comprimentos[i] ? restante / comprimentos[i] : 0;
      const a = pontos[i], b = pontos[i + 1];
      return { posicao: [a[0] + (b[0] - a[0]) * t, 0.4, a[2] + (b[2] - a[2]) * t], angulo: -Math.atan2(b[2] - a[2], b[0] - a[0]) };
    }
    restante -= comprimentos[i];
  }
  return null;
}
