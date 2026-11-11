'use client';

import { useState } from 'react';
import { posicaoPercurso } from '@/lib/percurso';
import { LOCAIS, RUAS } from '@/mocks/cityMocks';
import type { CityMap3DProps, PassoDijkstra, RuaProps } from '@/types/city';
import { isRuaNaRota } from './dados';
import { ICONE_TIPO } from './config/visuals';

const ponto = (id: string) => {
  const local = LOCAIS.find((item) => item.value === id)!;
  return [90 + (local.posicao[0] + 30) * 11, 75 + (local.posicao[2] + 22) * 8];
};

function ruaEmAnalise(rua: RuaProps, passo?: PassoDijkstra): boolean {
  return !!passo && (
    (passo.atual === rua.origem && passo.consideradas.includes(rua.destino)) ||
    (passo.atual === rua.destino && passo.consideradas.includes(rua.origem))
  );
}

function corDaRua(rua: RuaProps, ativa: boolean, rotaAnterior: string[], passo?: PassoDijkstra): string {
  if (rua.bloqueada) return '#ef4444';
  if (ruaEmAnalise(rua, passo)) return '#22d3ee';
  if (ativa) return '#facc15';
  if (isRuaNaRota(rotaAnterior, rua.origem, rua.destino)) return '#c084fc';
  return '#64748b';
}

function corDoLocal(id: string, caminho: string[], passo?: PassoDijkstra): string {
  const indice = caminho.indexOf(id);
  if (passo?.atual === id) return '#22d3ee';
  if (passo?.visitados.includes(id)) return '#22c55e';
  if (indice === 0) return '#f97316';
  if (indice >= 0 && indice === caminho.length - 1) return '#3b82f6';
  if (indice >= 0) return '#22c55e';
  return '#94a3b8';
}

export function MapaEsquematico({
  rotaResultado,
  ruas = RUAS,
  onSelecionarLocal,
  onAlternarRua,
  progresso,
  passo,
  rotaAnterior = [],
}: CityMap3DProps) {
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const caminho = passo ? [] : rotaResultado?.caminho ?? [];
  const carro = progresso === undefined ? null : posicaoPercurso(caminho, progresso);

  const selecionarLocal = (id: string) => {
    const novoValor = selecionado === id ? null : id;
    setSelecionado(novoValor);
    onSelecionarLocal?.(novoValor);
  };

  return (
    <svg viewBox="0 0 800 520" role="img" aria-label="Mapa da cidade com ruas, distâncias e menor caminho" className="h-full w-full">
      <defs>
        <pattern id="malha-cidade" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.7" fill="#334155" />
        </pattern>
        <filter id="brilho-rota"><feGaussianBlur stdDeviation="4" /></filter>
      </defs>
      <rect width="800" height="520" fill="#0b1425" />
      <rect width="800" height="520" fill="url(#malha-cidade)" />
      <ellipse cx="420" cy="290" rx="350" ry="200" fill="#12342f" opacity="0.3" />

      {ruas.map((rua) => {
        const [x1, y1] = ponto(rua.origem);
        const [x2, y2] = ponto(rua.destino);
        const ativa = isRuaNaRota(caminho, rua.origem, rua.destino);
        return (
          <g key={`${rua.origem}-${rua.destino}`}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#334155" strokeWidth="13" strokeLinecap="round" />
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#172337" strokeWidth="9" />
            {ativa && <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#facc15" strokeWidth="9" opacity="0.55" filter="url(#brilho-rota)" />}
            <line
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={corDaRua(rua, ativa, rotaAnterior, passo)}
              strokeWidth={ativa ? 3 : 1}
              strokeDasharray={ativa ? undefined : '4 6'}
            />
          </g>
        );
      })}

      {ruas.map((rua, indice) => {
        const [x1, y1] = ponto(rua.origem);
        const [x2, y2] = ponto(rua.destino);
        const ativa = isRuaNaRota(caminho, rua.origem, rua.destino);
        const origem = LOCAIS.find((local) => local.value === rua.origem)?.label;
        const destino = LOCAIS.find((local) => local.value === rua.destino)?.label;
        const alternar = () => onAlternarRua?.(indice);
        return (
          <g
            key={`peso-${rua.origem}-${rua.destino}`}
            role="button"
            tabIndex={0}
            aria-label={`${rua.bloqueada ? 'Liberar' : 'Bloquear'} rua de ${origem} até ${destino}`}
            aria-pressed={!!rua.bloqueada}
            className="cursor-pointer focus:opacity-70"
            onClick={alternar}
            onKeyDown={(evento) => {
              if (evento.key === 'Enter' || evento.key === ' ') {
                evento.preventDefault();
                alternar();
              }
            }}
            transform={`translate(${(x1 + x2) / 2},${(y1 + y2) / 2})`}
          >
            <rect x="-25" y="-10" width="50" height="20" rx="10" fill={rua.bloqueada ? '#991b1b' : ativa ? '#facc15' : '#0f172a'} stroke={ativa ? '#fef08a' : '#475569'} />
            <text textAnchor="middle" y="4" fill={ativa ? '#0f172a' : '#cbd5e1'} fontSize="10" fontWeight="700">
              {rua.bloqueada ? '⛔' : `${rua.peso.toLocaleString('pt-BR')} km`}
            </text>
          </g>
        );
      })}

      {LOCAIS.map((local) => {
        const [x, y] = ponto(local.value);
        const indice = caminho.indexOf(local.value);
        const cor = corDoLocal(local.value, caminho, passo);
        const Icone = ICONE_TIPO[local.tipo];
        const selecionar = () => selecionarLocal(local.value);
        return (
          <g
            key={local.value}
            transform={`translate(${x},${y})`}
            role="button"
            tabIndex={0}
            aria-label={local.label}
            aria-pressed={selecionado === local.value}
            onClick={selecionar}
            onKeyDown={(evento) => {
              if (evento.key === 'Enter' || evento.key === ' ') {
                evento.preventDefault();
                selecionar();
              }
            }}
            className="cursor-pointer outline-none focus:opacity-70"
          >
            <title>{local.label}{indice >= 0 ? ` · Parada ${indice + 1}` : ''}</title>
            <circle r={selecionado === local.value ? 25 : 21} fill={cor} opacity="0.15" />
            <rect x="-15" y="-18" width="30" height="32" rx="8" fill="#15243a" stroke={cor} strokeWidth="2" />
            <Icone x="-9" y="-12" width="18" height="18" color={cor} />
            <rect x={-local.label.length * 3.2 - 7} y="19" width={local.label.length * 6.4 + 14} height="21" rx="5" fill="#0b1425" stroke={selecionado === local.value ? cor : '#334155'} />
            <text y="33" textAnchor="middle" fill="#f1f5f9" fontSize="11" fontWeight="600">{local.label}</text>
            {indice >= 0 && (
              <g transform="translate(15,-18)">
                <circle r="8" fill={cor} />
                <text y="3" textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="800">{indice + 1}</text>
              </g>
            )}
          </g>
        );
      })}

      {carro && (
        <g transform={`translate(${90 + (carro.posicao[0] + 30) * 11},${75 + (carro.posicao[2] + 22) * 8}) rotate(${-carro.angulo * 180 / Math.PI})`} pointerEvents="none">
          <circle r="14" fill="#f97316" opacity="0.25" />
          <rect x="-9" y="-5" width="18" height="10" rx="3" fill="#f97316" stroke="white" />
          <rect x="-2" y="-4" width="5" height="8" rx="1" fill="#bae6fd" />
        </g>
      )}
    </svg>
  );
}
