import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const diretorio = path.dirname(fileURLToPath(import.meta.url));

// Transpila os módulos reais sem depender de um executor TypeScript externo.
function carregarModulo(caminho, dependencias = {}) {
  const fonte = fs.readFileSync(path.join(diretorio, '..', caminho), 'utf8');
  const codigo = ts.transpileModule(fonte, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const modulo = { exports: {} };
  const carregar = (nome) => {
    if (Object.hasOwn(dependencias, nome)) return dependencias[nome];
    throw new Error(`Dependência inesperada: ${nome}`);
  };
  new Function('require', 'module', 'exports', codigo)(carregar, modulo, modulo.exports);
  return modulo.exports;
}

const { RUAS } = carregarModulo('src/mocks/cityMocks.ts');
const { calcularDijkstra } = carregarModulo('src/lib/dijkstra.ts', {
  '@/mocks/cityMocks': carregarModulo('src/mocks/cityMocks.ts'),
});
const origem = 'casa-do-luizinho';
const destino = 'shopping';
const pesos = RUAS.map((rua) => rua.peso);
const indiceVia = (a, b) => RUAS.findIndex((rua) =>
  (rua.origem === a && rua.destino === b) || (rua.origem === b && rua.destino === a));

test('encontra a menor rota com os custos originais', () => {
  const resultado = calcularDijkstra(origem, destino, pesos);
  assert.deepEqual(resultado.caminho, [origem, 'comercio', destino]);
  assert.equal(resultado.distanciaTotal, 19.1);
  assert.equal(resultado.passos[0].atual, origem);
  assert.equal(resultado.passos.at(-1).atual, destino);
});

test('alterar o peso de uma via pode mudar o percurso', () => {
  const alterados = [...pesos];
  alterados[indiceVia(origem, 'comercio')] = 100;
  const resultado = calcularDijkstra(origem, destino, alterados);
  assert.deepEqual(resultado.caminho, [origem, 'casa-dos-amigos', 'casa-da-namorada', destino]);
  assert.equal(resultado.distanciaTotal, 26.1);
});

test('um bloqueio força um desvio e restaurar as vias recupera a rota', () => {
  const bloqueada = indiceVia('comercio', destino);
  assert.notEqual(bloqueada, -1);
  const desvio = calcularDijkstra(origem, destino, pesos, [bloqueada]);
  assert.notDeepEqual(desvio.caminho, [origem, 'comercio', destino]);
  assert(desvio.distanciaTotal > 19.1);
  assert.equal(calcularDijkstra(origem, destino, pesos).distanciaTotal, 19.1);
});

test('informa destino inacessível quando todas as suas ruas estão bloqueadas', () => {
  const bloqueadas = RUAS.flatMap((rua, i) => rua.origem === destino || rua.destino === destino ? [i] : []);
  const resultado = calcularDijkstra(origem, destino, pesos, bloqueadas);
  assert.deepEqual(resultado.caminho, []);
  assert.equal(resultado.distanciaTotal, null);
  assert(resultado.passos.length > 0);
});

test('origem igual ao destino tem custo zero, mesmo com ruas bloqueadas', () => {
  const bloqueadas = RUAS.map((_, i) => i);
  const resultado = calcularDijkstra(destino, destino, pesos, bloqueadas);
  assert.deepEqual(resultado.caminho, [destino]);
  assert.equal(resultado.distanciaTotal, 0);
});

test('viaduto separa as vias e o carro acompanha a elevação nos dois sentidos', () => {
  const mocks = carregarModulo('src/mocks/cityMocks.ts');
  const elevacao = carregarModulo('src/components/city3d/geometria/elevacaoVia.ts', {
    '@/mocks/cityMocks': mocks,
  });
  const { posicaoPercurso } = carregarModulo('src/lib/percurso.ts', {
    '@/mocks/cityMocks': mocks,
    '@/components/city3d/geometria/elevacaoVia': elevacao,
  });
  const amigos = 'casa-dos-amigos';
  const namorada = 'casa-da-namorada';
  const comprimento = Math.hypot(18, 5);
  const pontos = elevacao.pontosDaVia(amigos, namorada, comprimento);
  assert.equal(elevacao.alturaDaVia(amigos, namorada, 0), 0);
  assert.equal(elevacao.alturaDaVia(amigos, namorada, comprimento), 0);
  assert(elevacao.alturaDaVia(amigos, namorada, (pontos[2] + pontos[3]) / 2) > 1);
  assert.equal(elevacao.alturaDaVia('comercio', 'parque', comprimento / 2), 0);
  const ponto = (pontos[2] + pontos[3]) / 2;
  assert.equal(elevacao.alturaDaVia(amigos, namorada, ponto), elevacao.alturaDaVia(namorada, amigos, comprimento - ponto));
  assert(posicaoPercurso([amigos, namorada], ponto / comprimento).posicao[1] > 1);
  assert(posicaoPercurso([namorada, amigos], 1 - ponto / comprimento).posicao[1] > 1);
});
