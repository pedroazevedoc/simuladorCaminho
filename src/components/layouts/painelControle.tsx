'use client';

import { LayoutDashboard, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormularioRota } from './formularioRota';
import { EditorCustoVia } from './editorCustoVia';
import { ResultadoRota } from './resultadoRota';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import type { PainelControleProps } from '@/types/layouts';

/**
 * Conteúdo compartilhado entre a barra lateral (desktop) e o drawer inferior
 * (mobile). Manter um único componente evita divergência entre as duas
 * apresentações do painel.
 */
export function PainelControle({
  origem,
  destino,
  carregando,
  resultado,
  ruas,
  onOrigemChange,
  onDestinoChange,
  onTrocarPontos,
  onCalcular,
  onAlterarPeso,
  onRestaurar,
  className,
}: PainelControleProps) {
  return (
    <div className={cn('flex w-full flex-col gap-2.5', className)}>
      <div className="hidden items-center gap-2 px-1 lg:flex">
        <LayoutDashboard className="size-4 text-primary" aria-hidden="true" />
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Painel de controle
        </h2>
      </div>

      <FormularioRota
        origem={origem}
        destino={destino}
        carregando={carregando}
        onOrigemChange={onOrigemChange}
        onDestinoChange={onDestinoChange}
        onCalcular={onCalcular}
        onTrocarPontos={onTrocarPontos}
      />

      <ResultadoRota resultado={resultado} carregando={carregando} />

      <EditorCustoVia
        ruas={ruas}
        onAlterarPeso={onAlterarPeso}
        onRestaurar={onRestaurar}
      />

      <p className="px-1 pb-1 text-[10px] leading-relaxed text-muted-foreground">
        Dica: clique em um prédio do mapa 3D para ver os detalhes do local. A rota
        calculada é destacada em amarelo e os pontos em laranja, verde e azul.
      </p>
    </div>
  );
}

type PainelControleDrawerProps = PainelControleProps & {
  aberto: boolean;
  onAbertoChange: (aberto: boolean) => void;
};

/**
 * Versão mobile do painel: drawer inferior com alça de arraste, para preservar
 * a maior área possível do mapa 3D.
 */
export function PainelControleDrawer({
  aberto,
  onAbertoChange,
  className,
  ...props
}: PainelControleDrawerProps) {
  return (
    <Drawer open={aberto} onOpenChange={onAbertoChange} showSwipeHandle>
      <DrawerContent className="lg:hidden **:data-[slot=drawer-swipe-handle]:after:bg-foreground/30">
        <DrawerHeader className="flex-row items-start justify-between gap-3 border-b border-border/60 pb-3 text-left">
          <div className="min-w-0">
            <DrawerTitle>Painel de Controle</DrawerTitle>
            <DrawerDescription className="text-xs">
              Escolha a rota e ajuste o custo das vias.
            </DrawerDescription>
          </div>
          <DrawerClose
            aria-label="Fechar painel de controle"
            className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            <X className="size-4" aria-hidden="true" />
          </DrawerClose>
        </DrawerHeader>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 [scrollbar-thin]">
          <PainelControle {...props} className={className} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
