# Plano de preparação para a apresentação

1. Manter a rota coerente com a origem e o destino selecionados: invalidar resultados, animação e requisições pendentes ao alterar os pontos; permitir novo cálculo.
2. Informar falhas de requisição na tela, com ação para tentar novamente, sem apresentar resultado antigo como atual.
3. Destacar origem e destino no mapa com identificação textual e cores consistentes.
4. Verificar os cenários: rota padrão, alteração de peso que muda o caminho, desvio por bloqueio, destino isolado, restauração das vias e origem igual ao destino. Conferir também trocas rápidas de pontos e falhas de rede.
5. Ensaiar no computador e navegador da apresentação: mapa 3D, mapa alternativo, interação, rolagem, modo noturno e desempenho. Essa verificação depende do equipamento da apresentação.
6. Verificar o algoritmo com os testes permanentes em `tests/dijkstra.test.mjs`, além do lint e do build. Os testes usam o executor nativo do Node.js e o TypeScript já instalado, sem adicionar dependências ou alterar os scripts do projeto.

## Roteiro sugerido

- Calcule Casa do Luizinho → Shopping Center e apresente os vértices, arestas e pesos.
- Explore alguns passos do Dijkstra e inicie o percurso do carro.
- Aumente o custo de uma via do percurso ou bloqueie-a e compare o desvio.
- Bloqueie todas as ruas conectadas ao destino para demonstrar a mensagem de viagem impossível.
- Restaure as ruas. Se WebGL não estiver disponível, use o mapa alternativo.

## Verificação automatizada do Dijkstra

Execute `node tests/dijkstra.test.mjs`. Os casos cobrem rota original, alteração de peso, desvio e restauração, destino inacessível e origem igual ao destino. Os fluxos visuais e a falha de rede devem ser verificados no navegador.
