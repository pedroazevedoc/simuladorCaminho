'use client';

import { useEffect, useState } from 'react';

export function useSimulacao() {
  const [passoIndice, setPassoIndice] = useState(-1);
  const [progresso, setProgresso] = useState(0);
  const [animando, setAnimando] = useState(false);
  const [velocidade, setVelocidade] = useState(1);
  const [seguir, setSeguir] = useState(false);
  const [noturno, setNoturno] = useState(false);
  const concluido = progresso >= 1;
  useEffect(() => {
    if (!animando || concluido || passoIndice >= 0) return;
    let ultimo = performance.now();
    const timer = setInterval(() => {
      const agora = performance.now();
      const delta = Math.min(agora - ultimo, 100);
      ultimo = agora;
      setProgresso((valor) => Math.min(1, valor + delta * velocidade / 20000));
    }, 33);
    return () => clearInterval(timer);
  }, [animando, concluido, velocidade, passoIndice]);
  const resetarSimulacao = () => {
    setPassoIndice(-1);
    setAnimando(false);
    setProgresso(0);
  };

  return {
    passoIndice, setPassoIndice, progresso, setProgresso, animando, setAnimando,
    velocidade, setVelocidade, seguir, setSeguir, noturno, setNoturno,
    concluido, resetarSimulacao,
  };
}
