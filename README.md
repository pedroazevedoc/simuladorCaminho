[![Licença MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

# Simulador Cidade do Luizinho

Aplicação acadêmica que apresenta a Teoria dos Grafos em uma cidade fictícia interativa. Os locais são vértices, as ruas são arestas não direcionadas e seus pesos representam distâncias em quilômetros. O algoritmo de Dijkstra encontra o caminho de menor custo entre a origem e o destino.

O projeto foi desenvolvido para a disciplina de **Matemática Computacional** e combina Next.js, React, TypeScript, Tailwind CSS, Three.js e React Three Fiber.

## Requisitos e execução

O CI usa Node.js 20 e npm. O projeto usa `package-lock.json`.

```bash
git clone https://github.com/pedroazevedoc/simuladorCaminho.git
cd simuladorCaminho
npm ci
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Para executar a versão de produção, use `npm run build` e `npm run start`.

O mapa 3D requer WebGL 2 habilitado no navegador. Se estiver indisponível, a aplicação oferece um mapa esquemático interativo. O build pode precisar de acesso à rede para baixar as fontes do `next/font`.

## Como usar

1. No **Painel de controle**, escolha origem e destino e clique em **Calcular menor rota**. Em telas menores, abra o painel pelo botão **Controles**.
2. Confira o custo e a sequência de locais no resultado. No mapa, laranja indica origem, azul indica destino, verde indica pontos intermediários e amarelo indica ruas da rota.
3. Na lista **Distâncias das ruas**, altere um valor ou bloqueie uma via. Depois de um primeiro cálculo, o simulador recalcula a rota; **Restaurar** recupera os valores originais e libera as ruas.
4. Clique em um prédio ou ponto do mapa e use **Sair daqui** ou **Ir para cá** para selecionar os locais. Após trocar os pontos, calcule a rota novamente.
5. Use **Iniciar percurso**, pausa, reinício e velocidade para acompanhar o carro. No 3D, é possível ativar o acompanhamento pela câmera e o modo noturno.
6. Em **Dijkstra passo a passo**, avance pelas etapas e abra as distâncias calculadas para comparar os valores provisórios e confirmados.

Se as ruas disponíveis não conectarem origem e destino, a aplicação informa que a viagem é impossível. Se forem o mesmo local, a distância é zero. As edições são mantidas apenas na sessão da página e são perdidas ao recarregá-la.

### Navegação e representação do mapa

No 3D, arraste com o botão esquerdo para girar, com o direito para deslocar e use a roda do mouse sobre a área que deseja aproximar ou afastar. Em telas sensíveis ao toque, use a pinça para zoom. **Restaurar visão** volta ao enquadramento inicial e desativa o acompanhamento do carro. Clique em um prédio para ver informações. Quando disponível, o seletor no mapa alterna entre a cidade 3D e o mapa esquemático.

A geometria é **esquemática**: as posições dos locais permanecem fixas, mesmo quando os pesos são editados. A largura da via pode refletir seu custo dentro de uma faixa visual limitada. A animação usa a geometria desenhada; sua velocidade é ilustrativa e não representa km/h.

As vias Casa dos Amigos ↔ Casa da Namorada e Comércio Central ↔ Parque Central se cruzam visualmente, mas não formam uma conexão no grafo. Um viaduto no 3D diferencia os dois trajetos, sem alterar as rotas possíveis.

## Como funciona

`src/mocks/cityMocks.ts` reúne os 12 locais, suas coordenadas e as 19 ruas do grafo. A página mantém os pesos e bloqueios editados; a API recebe esses dados e executa Dijkstra sobre a topologia dos mocks. O resultado alimenta o painel, os destaques no mapa, o percurso animado e a visualização das etapas do algoritmo.

### API de rotas

`POST /api/rota` recebe IDs de locais existentes e, opcionalmente, uma lista de ruas com pesos e bloqueios. Para custos omitidos, o valor padrão é usado; ruas são identificadas sem considerar o sentido. O corpo não altera a topologia do grafo.

```json
{
  "origem": "casa-do-luizinho",
  "destino": "shopping",
  "ruas": [
    { "origem": "comercio", "destino": "shopping", "peso": 9.8, "bloqueada": true }
  ]
}
```

Uma resposta bem-sucedida contém `caminho`, `distanciaTotal` e `passos`. Cada passo informa o local atual, locais visitados, vizinhos considerados e distâncias conhecidas. Distâncias ainda inacessíveis aparecem como `null` nas etapas. Quando não há caminho, `caminho` é vazio e `distanciaTotal` é `null`; o HTTP continua sendo 200. JSON inválido ou origem/destino ausentes ou desconhecidos recebem HTTP 400. Custos inválidos ou vias desconhecidas são ignorados ao aplicar pesos.

## Organização

```text
src/
  app/page.tsx                    Composição da interface e integração dos componentes
  hooks/                         Estado da rota e da simulação
  app/api/rota/route.ts           Validação da requisição e resposta HTTP
  mocks/cityMocks.ts              Locais, ruas e elementos da cidade
  lib/dijkstra.ts                Cálculo da rota e registro das etapas
  lib/rota/                      Interpretação da requisição e cliente HTTP
  lib/geometria/                 Geometria compartilhada do viaduto
  lib/percurso.ts                Posição do veículo durante a animação
  lib/ruas.ts                    Utilitários de pesos e identidade das ruas
  components/city3d/             Cena 3D, mapa alternativo e geometria
  components/city3d/geometria/   Prédios, ruas e veículo
  components/layouts/            Painel, formulário, resultado e modal de ajuda
  components/ui/                 Componentes shadcn/ui com Base UI
  types/                         Contratos da cidade e da interface
```

A cena 3D é carregada no cliente, sem renderização no servidor. Veja [AGENTS.md](AGENTS.md) para orientações de manutenção e [docs/plano-apresentacao.md](docs/plano-apresentacao.md) para o roteiro de apresentação.

## Verificação

```bash
npm run lint
npm run build
node tests/dijkstra.test.mjs
```

O build também verifica os tipos. A suíte usa `node:test` e o TypeScript já instalado; cobre rotas, mudanças de peso, bloqueios, destino inacessível, origem igual ao destino e elevação do viaduto. A CI atual executa instalação, lint e build, mas ainda não executa essa suíte. Para alterações visuais, confira também a aplicação no navegador e no equipamento da apresentação.

## Licença e segurança

Distribuído sob a licença [MIT](LICENSE). Para relatar vulnerabilidades, consulte [SECURITY.md](SECURITY.md) e use o relato privado indicado.
