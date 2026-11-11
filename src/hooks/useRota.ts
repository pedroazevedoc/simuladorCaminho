'use client';

import { useEffect, useRef, useState } from 'react';
import { LOCAIS, RUAS } from '@/mocks/cityMocks';
import { chaveRua } from '@/lib/ruas';
import { solicitarRota } from '@/lib/rota/solicitarRota';
import type { RespostaRota, RuaProps } from '@/types/city';

const ESPERA_RECALCULO = 300;

export function useRota(resetarSimulacao: () => void) {
  const [origem, setOrigem] = useState<string>(LOCAIS[0].value);
  const [destino, setDestino] = useState<string>(LOCAIS[4].value);
  // Custos efetivos das vias (posições e topologia continuam fixas nos mocks)
  const [ruas, setRuas] = useState<RuaProps[]>(RUAS);
  const [resultado, setResultado] = useState<RespostaRota | null>(null);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [erroRota, setErroRota] = useState<string | null>(null);
  const [anterior, setAnterior] = useState<RespostaRota | null>(null);
  const contadorRequisicao = useRef(0);
  const timerRecalculo = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    contadorRequisicao.current += 1;
    if (timerRecalculo.current) clearTimeout(timerRecalculo.current);
  }, []);

  const calcularRota = async (pesos: RuaProps[]) => {
    if (timerRecalculo.current) {
      clearTimeout(timerRecalculo.current);
      timerRecalculo.current = null;
    }
    const id = ++contadorRequisicao.current;
    setCarregando(true);
    setErroRota(null);
    try {
      const data = await solicitarRota({ origem, destino, ruas: pesos });
      if (id !== contadorRequisicao.current) return;
      setAnterior(resultado);
      setResultado(data);
      resetarSimulacao();
    } catch (err) {
      if (id === contadorRequisicao.current) {
        console.error('Erro ao calcular rota:', err);
        setResultado(null);
        setAnterior(null);
        resetarSimulacao();
        setErroRota('Não foi possível calcular a rota. Confira sua conexão e tente novamente.');
      }
    } finally {
      if (id === contadorRequisicao.current) setCarregando(false);
    }
  };

  // Mantém a rota exibida coerente com os custos: se já existe um resultado na
  // tela, recalcula após a edição (com debounce, para não disparar a cada passo)
  const agendarRecalculo = (pesos: RuaProps[]) => {
    if (timerRecalculo.current) clearTimeout(timerRecalculo.current);
    if (!resultado && !carregando) return;
    // Descarta respostas de requisições iniciadas antes da alteração da via.
    contadorRequisicao.current += 1;
    setCarregando(true);
    timerRecalculo.current = setTimeout(() => {
      void calcularRota(pesos);
    }, ESPERA_RECALCULO);
  };

  const handleAlterarPeso = (origemRua: string, destinoRua: string, peso: number) => {
    const chave = chaveRua(origemRua, destinoRua);
    const proximasRuas = ruas.map((rua) =>
      chaveRua(rua.origem, rua.destino) === chave ? { ...rua, peso } : rua
    );
    setRuas(proximasRuas);
    agendarRecalculo(proximasRuas);
  };

  const handleRestaurarPesos = () => {
    setRuas(RUAS);
    agendarRecalculo(RUAS);
  };

  const limparRota = () => {
    contadorRequisicao.current += 1;
    if (timerRecalculo.current) clearTimeout(timerRecalculo.current);
    timerRecalculo.current = null;
    setResultado(null);
    setAnterior(null);
    setErroRota(null);
    setCarregando(false);
    resetarSimulacao();
  };
  const alterarOrigem = (valor: string) => {
    if (valor === origem) return;
    limparRota();
    setOrigem(valor);
  };
  const alterarDestino = (valor: string) => {
    if (valor === destino) return;
    limparRota();
    setDestino(valor);
  };

  const handleTrocarPontos = () => {
    limparRota();
    setOrigem(destino);
    setDestino(origem);
  };

  const alternarRua = (indice: number) => {
    const proximas = ruas.map((rua, i) => i === indice ? { ...rua, bloqueada: !rua.bloqueada } : rua);
    setRuas(proximas);
    agendarRecalculo(proximas);
  };
  return {
    origem, destino, ruas, resultado, anterior, carregando, erroRota,
    calcularRota, alterarOrigem, alterarDestino, handleTrocarPontos,
    handleAlterarPeso, handleRestaurarPesos, alternarRua,
  };
}
