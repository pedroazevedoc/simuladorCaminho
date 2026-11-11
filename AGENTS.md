<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Simulador Caminho

Aplicação acadêmica em Next.js 16 (App Router), React 19, TypeScript e Tailwind v4. Uma cidade 3D visualiza rotas de menor custo calculadas por Dijkstra. Use português (pt-BR) em textos de interface, comentários e mensagens de commit.

## Comandos e verificação

- `npm ci`, `npm run dev`, `npm run lint` e `npm run build`; use npm e preserve `package-lock.json`.
- CI (`.github/workflows/ci.yml`) usa Node.js 20 e executa instalação, lint e build; o build também verifica tipos.
- `node tests/dijkstra.test.mjs` executa os testes existentes com `node:test` e TypeScript já instalado; a CI ainda não os executa. Não há script npm de testes configurado.
- O build padrão usa Turbopack e pode exigir rede para `next/font` e abertura de porta local para processar CSS. Relate limitações do ambiente; `npm run build -- --webpack` é uma verificação alternativa, não equivalente ao build da CI.
- Para mudanças visuais ou de interação, verifique também o 3D e o mapa alternativo em navegador quando disponível. Não declare validação visual se ela não foi realizada.

## Fonte de dados e rotas

- `src/mocks/cityMocks.ts` é a fonte de verdade da topologia: 12 locais (`LocalProps`) e 19 ruas (`RuaProps`). As coordenadas são tuplas `[x, y, z]`; mantenha referências a locais existentes.
- O grafo é ponderado e não direcionado. A interface edita pesos e `bloqueada` sem alterar sua topologia; a ordem de `RUAS` também é usada para associar pesos e índices de bloqueio no Dijkstra. Ao alterar a lista, mantenha algoritmo, API e testes coerentes.
- `src/lib/dijkstra.ts` implementa o algoritmo e retorna `caminho`, `distanciaTotal` e `passos`. Destino inacessível: caminho vazio e distância `null`. Origem igual a destino: distância zero. Preserve as etapas usadas pela visualização didática.
- `src/app/api/rota/route.ts` usa `src/lib/rota/interpretarRequisicao.ts` para interpretar a entrada e invoca o algoritmo; recebe `{ origem, destino, ruas? }`. `src/lib/rota/solicitarRota.ts` faz a chamada HTTP, e `src/hooks/useRota.ts` controla seleção, recálculo, invalidação de respostas antigas e erros; `src/hooks/useSimulacao.ts` controla a animação e as etapas. `src/app/page.tsx` integra os componentes. Não apresente uma resposta anterior como rota dos pontos atuais.
- Os dados editados não persistem após recarregar a página. `src/lib/ruas.ts` contém a chave de rua não direcionada e a escala limitada para largura visual; o editor aceita distâncias positivas até 10.000 km.

## Mapa e animação

- Os painéis da simulação e do Dijkstra estão em `src/components/layouts/`; o carregamento dinâmico do mapa permanece em `src/app/page.tsx`. O componente `CityMap3D` está em `src/components/city3d/cityMap3D.tsx`; mantenha `next/dynamic` com `ssr: false` no componente cliente.
- Preserve o mapa alternativo em `src/components/city3d/mapaEsquematico.tsx` para navegadores sem WebGL 2. O Fiber libera o contexto ao desmontar o canvas; não interprete essa liberação normal como falta de suporte.
- `src/components/city3d/cena.tsx` monta ambiente, prédios e vias. Em `geometria/rua.tsx`, preserve o uso de `THREE.Line` nativo via `<primitive object={...}>` para o destaque da rota; não substitua por `<line>`/`<Line>` JSX. Descarte recursos Three.js criados manualmente.
- As vias Casa dos Amigos ↔ Casa da Namorada e Comércio ↔ Parque cruzam visualmente sem formar uma conexão no grafo. O viaduto é definido em `src/lib/geometria/elevacaoVia.ts`; não altere a topologia para simular o cruzamento. Se mudar coordenadas, rampas ou o modelo do percurso, mantenha via, linha da rota e altura do carro (`src/lib/percurso.ts`) alinhadas nos dois sentidos.
- Pesos editados são custos independentes da geometria. A animação usa o comprimento desenhado e sua velocidade é ilustrativa, não km/h.

## Interface e convenções

- Preserve o painel lateral e o drawer móvel em `src/components/layouts/painelControle.tsx`; a lista de ruas está em `editorCustoVia.tsx`. O modal de ajuda fica em `modalInformativo.tsx`.
- shadcn/ui v4 usa primitivas `@base-ui/react`, não Radix; os componentes locais ficam em `src/components/ui/` e o combobox Kibo em `src/components/kibo-ui/combobox/`. Para trabalho em shadcn, consulte a skill do projeto em `.agents/skills/shadcn/SKILL.md` quando disponível.
- Tailwind v4 é configurado por `@tailwindcss/postcss` e `src/app/globals.css`; não adicione `tailwind.config.js`. Importe `cn` de `@/lib/utils`.
- Tipos compartilhados ficam em `src/types/city.ts` e `src/types/layouts.ts`; o alias `@/*` aponta para `src/*`.

Consulte o [README](README.md) para uso e contrato da API e [docs/plano-apresentacao.md](docs/plano-apresentacao.md) para o roteiro de demonstração.
