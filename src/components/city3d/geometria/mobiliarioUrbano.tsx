'use client'

import { useMemo } from 'react'
import { CARROS_CORES, CORES_AMBIENTE } from '../config/visuals'
import { CarroProps, EstacionamentoProps } from '@/types/city';
import { CARROS, ESTACIONAMENTOS } from '@/mocks/cityMocks';

const ELEVACAO_VAGA = 0.005;
const ELEVACAO_CARRO = 0.15;
const LARGURA_RISCO = 0.07;
const LARGURA_VAGA = 1.15;
const COMPRIMENTO_VAGA = 1.5;

// Carro estacionado: carroceria colorida + cabine escura
function Carro({ carro }: { carro: CarroProps }) {
  return (
    <group position={[carro.x, 0, carro.z]} rotation={[0, carro.rotacao, 0]}>
      <mesh position={[0, ELEVACAO_CARRO, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.36, 0.62]} />
        <meshStandardMaterial color={CARROS_CORES[carro.cor]} roughness={0.6} metalness={0.4} />
      </mesh>
      <mesh position={[0, ELEVACAO_CARRO + 0.22, 0]} castShadow>
        <boxGeometry args={[0.66, 0.26, 0.58]} />
        <meshStandardMaterial color={CORES_AMBIENTE.chao} roughness={0.3} metalness={0.6} />
      </mesh>
    </group>
  );
}

// Estacionamento: pátio pintado com riscos que delimitam uma vaga por carro,
// ocupando apenas a faixa onde o carro está (um lado do pátio)
function Estacionamento({
  estacao,
  carros,
}: {
  estacao: EstacionamentoProps;
  carros: CarroProps[];
}) {
  const linhas = useMemo(() => {
    const cos = Math.cos(estacao.rotacao);
    const sin = Math.sin(estacao.rotacao);

    // Carros do pátio, convertidos para o espaço local do estacionamento
    const locais = carros
      .filter((carro) => {
        const meioLargura = estacao.largura / 2;
        const meioProfundidade = estacao.profundidade / 2;
        return (
          Math.abs(carro.x - estacao.x) <= meioLargura &&
          Math.abs(carro.z - estacao.z) <= meioProfundidade
        );
      })
      .map((carro) => {
        const dx = carro.x - estacao.x;
        const dz = carro.z - estacao.z;
        return {
          x: dx * cos - dz * sin,
          z: dx * sin + dz * cos,
        };
      });

    if (locais.length === 0) return { verticais: [], horizontais: [] };

    const xs = locais.map((p) => p.x).sort((a, b) => a - b);
    const zs = locais.map((p) => p.z).sort((a, b) => a - b);
    const varreduraX = xs[xs.length - 1] - xs[0];
    const varreduraZ = zs[zs.length - 1] - zs[0];

    if (varreduraX > varreduraZ) {
      // Carros lado a lado: riscos verticais delimitam cada vaga,
      // com o comprimento limitado à faixa onde os carros estão
      const meio = estacao.largura / 2;
      const limitar = (v: number) => Math.min(meio, Math.max(-meio, v));
      const verticais = [limitar(xs[0] - LARGURA_VAGA / 2)];
      for (let i = 1; i < xs.length; i++) verticais.push((xs[i - 1] + xs[i]) / 2);
      verticais.push(limitar(xs[xs.length - 1] + LARGURA_VAGA / 2));

      const meioProfundidade = estacao.profundidade / 2;
      const centroZ = zs.reduce((soma, z) => soma + z, 0) / zs.length;
      const inicioZ = Math.max(-meioProfundidade, centroZ - COMPRIMENTO_VAGA / 2);
      const fimZ = Math.min(meioProfundidade, centroZ + COMPRIMENTO_VAGA / 2);
      const zLinha = (inicioZ + fimZ) / 2;
      const comprimento = fimZ - inicioZ;

      return {
        verticais: verticais.map((x) => ({ x, z: zLinha, comprimento })),
        horizontais: [],
      };
    }

    // Carros empilhados: riscos horizontais delimitam cada vaga,
    // com o comprimento limitado à faixa onde os carros estão
    const meio = estacao.profundidade / 2;
    const limitar = (v: number) => Math.min(meio, Math.max(-meio, v));
    const horizontais = [limitar(zs[0] - LARGURA_VAGA / 2)];
    for (let i = 1; i < zs.length; i++) horizontais.push((zs[i - 1] + zs[i]) / 2);
    horizontais.push(limitar(zs[zs.length - 1] + LARGURA_VAGA / 2));

    const meioLargura = estacao.largura / 2;
    const centroX = xs.reduce((soma, x) => soma + x, 0) / xs.length;
    const inicioX = Math.max(-meioLargura, centroX - COMPRIMENTO_VAGA / 2);
    const fimX = Math.min(meioLargura, centroX + COMPRIMENTO_VAGA / 2);
    const xLinha = (inicioX + fimX) / 2;
    const comprimento = fimX - inicioX;

    return {
      verticais: [],
      horizontais: horizontais.map((z) => ({ x: xLinha, z, comprimento })),
    };
  }, [estacao, carros]);

  return (
    <group position={[estacao.x, 0, estacao.z]} rotation={[0, estacao.rotacao, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, ELEVACAO_VAGA, 0]} receiveShadow>
        <planeGeometry args={[estacao.largura, estacao.profundidade]} />
        <meshStandardMaterial color={CORES_AMBIENTE.vaga} roughness={1} metalness={0} />
      </mesh>

      {linhas.verticais.map(({ x, z, comprimento }) => (
        <mesh
          key={`v-${x}-${z}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[x, ELEVACAO_VAGA + 0.001, z]}
        >
          <planeGeometry args={[LARGURA_RISCO, comprimento]} />
          <meshStandardMaterial color={CORES_AMBIENTE.faixa} roughness={0.85} metalness={0} />
        </mesh>
      ))}
      {linhas.horizontais.map(({ x, z, comprimento }) => (
        <mesh
          key={`h-${x}-${z}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[x, ELEVACAO_VAGA + 0.001, z]}
        >
          <planeGeometry args={[comprimento, LARGURA_RISCO]} />
          <meshStandardMaterial color={CORES_AMBIENTE.faixa} roughness={0.85} metalness={0} />
        </mesh>
      ))}
    </group>
  );
}

export function MobiliarioUrbano() {
  return (
    <>
      {ESTACIONAMENTOS.map((estacao) => (
        <Estacionamento
          key={`${estacao.x}-${estacao.z}`}
          estacao={estacao}
          carros={CARROS}
        />
      ))}
      {CARROS.map((carro, i) => (
        <Carro key={i} carro={carro} />
      ))}
    </>
  );
}