'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CircleDot,
  GitBranch,
  Map,
  Route,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type ModalInformativoProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConcluir: () => void;
};

const ETAPAS = [
  {
    titulo: 'Conheça o projeto',
    descricao: 'Uma cidade interativa para visualizar o menor caminho.',
    icone: Map,
  },
  {
    titulo: 'Como utilizar',
    descricao: 'Escolha os pontos, calcule a rota e explore o mapa.',
    icone: Route,
  },
  {
    titulo: 'Conceitos de grafos',
    descricao: 'Entenda como a cidade é representada matematicamente.',
    icone: GitBranch,
  },
  {
    titulo: 'Algoritmo de Dijkstra',
    descricao: 'Veja como o menor caminho é encontrado.',
    icone: BookOpen,
  },
] as const;

export function ModalInformativo({
  open,
  onOpenChange,
  onConcluir,
}: ModalInformativoProps) {
  const [etapaAtual, setEtapaAtual] = useState(0);
  const etapa = ETAPAS[etapaAtual];
  const EtapaIcon = etapa.icone;
  const ultimaEtapa = etapaAtual === ETAPAS.length - 1;

  const avancar = () => {
    if (ultimaEtapa) {
      onConcluir();
      return;
    }
    setEtapaAtual((atual) => atual + 1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[calc(100dvh-2rem)] max-w-2xl flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <div className="flex min-h-0 flex-1 flex-col">
          <DialogHeader className="border-b border-border/60 px-5 pt-5 pr-12 sm:px-7 sm:pt-7 sm:pr-14">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                <EtapaIcon aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <DialogTitle className="text-lg sm:text-xl">
                  {etapa.titulo}
                </DialogTitle>
                <DialogDescription className="mt-1">
                  {etapa.descricao}
                </DialogDescription>
              </div>
            </div>

            <div className="flex items-center gap-2 pb-5 pt-4 sm:pb-3 sm:pt-2" aria-label={`Etapa ${etapaAtual + 1} de ${ETAPAS.length}`}>
              {ETAPAS.map((item, indice) => (
                <span
                  key={item.titulo}
                  className={`h-1.5 flex-1 rounded-full ${indice <= etapaAtual ? 'bg-primary' : 'bg-muted'}`}
                  aria-hidden="true"
                />
              ))}
              <span className="ml-1 shrink-0 text-xs tabular-nums text-muted-foreground">
                {etapaAtual + 1}/{ETAPAS.length}
              </span>
            </div>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
            {etapaAtual === 0 && (
              <div className="flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
                <p>
                  O Simulador Cidade do Luizinho é uma aplicação acadêmica que
                  transforma uma cidade fictícia em um mapa 3D interativo.
                </p>
                <p>
                  Seu objetivo é demonstrar, de forma visual, como a Teoria dos
                  Grafos e o algoritmo de Dijkstra encontram o menor caminho entre
                  dois pontos.
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <InfoItem icon={Map} titulo="Mapa 3D" texto="Explore a cidade e seus locais." />
                  <InfoItem icon={Route} titulo="Rotas" texto="Visualize o caminho calculado." />
                  <InfoItem icon={GitBranch} titulo="Grafos" texto="Aprenda com uma simulação." />
                </div>
              </div>
            )}

            {etapaAtual === 1 && (
              <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
                <Instruction number="1" titulo="Defina a rota">Selecione a origem e o destino no painel de controle.</Instruction>
                <Instruction number="2" titulo="Calcule o menor caminho">Clique em “Calcular Menor Rota” para enviar os dados ao algoritmo.</Instruction>
                <Instruction number="3" titulo="Leia o resultado">A distância total e os locais do trajeto aparecem no painel e no mapa.</Instruction>
                <Instruction number="4" titulo="Experimente">Ajuste o custo de uma via e observe como a rota pode mudar. No mapa, arraste para rotacionar, use o botão direito para mover e a rolagem para aproximar.</Instruction>
              </div>
            )}

            {etapaAtual === 2 && (
              <div className="flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
                <p>
                  A cidade é modelada como um grafo não direcionado e ponderado,
                  representado por G = (V, E).
                </p>
                <dl className="grid gap-3 sm:grid-cols-3">
                  <Concept titulo="Vértices (V)">São os locais da cidade, como casas, faculdade e shopping.</Concept>
                  <Concept titulo="Arestas (E)">São as ruas que conectam dois locais.</Concept>
                  <Concept titulo="Pesos">São os custos ou distâncias de cada rua.</Concept>
                </dl>
                <p>
                  Como as ruas são não direcionadas, o trajeto pode ser percorrido
                  nos dois sentidos. Alterar um peso muda o custo considerado pelo
                  cálculo, sem modificar a estrutura do grafo.
                </p>
              </div>
            )}

            {etapaAtual === 3 && (
              <div className="flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
                <p>
                  Dijkstra começa pela origem com custo zero e mantém as melhores
                  distâncias conhecidas para os demais locais.
                </p>
                <ol className="flex flex-col gap-3">
                  <Instruction number="1" titulo="Escolher">Seleciona o local não visitado com menor custo acumulado.</Instruction>
                  <Instruction number="2" titulo="Atualizar">Compara os custos dos vizinhos e guarda uma alternativa menor quando existir.</Instruction>
                  <Instruction number="3" titulo="Repetir">Continua até alcançar o destino ou não existirem locais acessíveis.</Instruction>
                  <Instruction number="4" titulo="Reconstruir">Volta pelos locais anteriores para formar o caminho final.</Instruction>
                </ol>
                <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-foreground">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  <p>Agora você já pode experimentar diferentes rotas e custos na cidade.</p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="m-0! shrink-0 flex-row items-center justify-between border-t border-border/60 px-5 py-4 sm:px-7">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setEtapaAtual((atual) => Math.max(0, atual - 1))}
              disabled={etapaAtual === 0}
            >
              <ArrowLeft data-icon="inline-start" aria-hidden="true" />
              Anterior
            </Button>
            <Button type="button" onClick={avancar}>
              {ultimaEtapa ? 'Entendi, começar' : 'Próxima'}
              {!ultimaEtapa && <ArrowRight data-icon="inline-end" aria-hidden="true" />}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoItem({
  icon: Icon,
  titulo,
  texto,
}: {
  icon: typeof Map;
  titulo: string;
  texto: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-lg border border-border/60 bg-muted/30 p-3">
      <div className="flex items-center gap-1.5">
        <Icon className="size-4 text-primary" aria-hidden="true" />
        <strong className="text-xs text-foreground">{titulo}</strong>
      </div>
      <span className="text-xs leading-relaxed">{texto}</span>
    </div>
  );
}

function Instruction({
  number,
  titulo,
  children,
}: {
  number: string;
  titulo: string;
  children: ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
        {number}
      </span>
      <p>
        <strong className="text-foreground">{titulo}: </strong>
        {children}
      </p>
    </li>
  );
}

function Concept({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-lg border border-border/60 p-3">
      <dt className="flex items-center gap-1.5 font-semibold text-foreground">
        <CircleDot className="size-3.5 text-primary" aria-hidden="true" />
        {titulo}
      </dt>
      <dd className="text-xs leading-relaxed">{children}</dd>
    </div>
  );
}