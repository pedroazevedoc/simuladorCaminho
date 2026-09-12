'use client'

import { Html } from '@react-three/drei'
import type { Local } from '@/types/city'
import { ROTULO_TIPO, CONFIG_TELHADO, resolverDimensoes } from '../config/visuals'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

interface CartaoLocalProps {
  local: Local;
  isOrigem: boolean;
  isDestino: boolean;
  naRota: boolean;
}

export function CartaoLocal({ local, isOrigem, isDestino, naRota }: CartaoLocalProps) {
  const dimensoes = resolverDimensoes(local.tipo, local.value);
  const telhado = CONFIG_TELHADO[local.tipo];
  const topoTelhado = dimensoes.altura + telhado.altura + telhado.alturaElevada;
  const status = isOrigem
    ? { texto: 'Origem da rota', classe: 'bg-orange-500 text-white' }
    : isDestino
      ? { texto: 'Destino da rota', classe: 'bg-blue-500 text-white' }
    : naRota
      ? { texto: 'No menor trajeto', classe: 'bg-emerald-500 text-white' }
      : { texto: 'Fora da rota', classe: 'bg-secondary text-secondary-foreground' };

  return (
    <Html
      position={[0, topoTelhado + 3, 0]}
      center
      distanceFactor={25}
      zIndexRange={[12, 0]}
    >
      <Card size="sm" className="min-w-48 pointer-events-none shadow-xl">
        <CardHeader>
          <CardTitle>{local.label}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <Label className="text-muted-foreground text-xs">Tipo:</Label>
            <span className="text-xs font-semibold">{ROTULO_TIPO[local.tipo]}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Label className="text-muted-foreground text-xs">Status:</Label>
            <Badge className={status.classe}>{status.texto}</Badge>
          </div>
        </CardContent>
      </Card>
    </Html>
  );
}