# Simulador Cidade do Luizinho — Menor Rota com Dijkstra

Aplicação web interativa para simular e visualizar o cálculo da menor rota entre pontos de interesse em um mapa urbano fictício. O projeto foi desenvolvido para a matéria de **Matemática Computacional**, aplicando os conceitos fundamentais da **Teoria dos Grafos**.

---

## Objetivo

O objetivo do projeto é resolver o problema do menor caminho (*Shortest Path Problem*) em um grafo não direcionado e ponderado. A aplicação permite selecionar um ponto de **Origem** e um de **Destino** na "Cidade do Luizinho", calculando a menor distância acumulada (em km) e destacando o trajeto dinamicamente em um mapa 3D interativo.

---

## Tech Stack

### **Full-Stack (Next.js)**
* **Framework:** [Next.js](https://nextjs.org/) (App Router & React 18+)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/)

### **Backend & Algoritmos**
* **Runtime:** Node.js (via Next.js API Routes)
* **Algoritmo:** Dijkstra (Teoria dos Grafos)
* **Estrutura de Dados:** Lista de Adjacência / Matriz de Pesos

### **Visualização 3D**
* **3D Engine:** [Three.js](https://threejs.org/)
* **React Abstraction:** [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber)
* **Helpers & Utilitários:** [@react-three/drei](https://github.com/pmndrs/drei)

---

## Arquitetura do Projeto

O projeto utiliza a arquitetura Full-Stack integrada do Next.js, separando explicitamente a lógica de grafos da renderização visual:
  ```bash
  ├── src/
  │   ├── app/
  │   │   ├── api/
  │   │   │   └── rota/
  │   │   │       └── route.ts       # Backend Node.js: Executa o Algoritmo de Dijkstra
  │   │   ├── page.tsx               # Frontend UI: Seletores 2D e Painel de Controle
  │   │   └── layout.tsx
  │   ├── components/
  │   │   └── cityMap3D.tsx          # Renderização Three.js: Nós, Ruas e Etiquetas 3D
  │   ├── mocks/
  │   │   └── cityMocks.ts           # Modelagem do Grafo (Vértices, Arestas e Coordenadas)
  │   └── types/
  │       └── city.ts                # Interfaces e Tipagens TypeScript
  ```


### **Fluxo de Funcionamento:**
1. **Frontend:** O usuário escolhe a origem e o destino nos menus suspensos.
2. **API (Node.js):** A requisição `POST /api/rota` envia os IDs dos locais.
3. **Dijkstra:** O backend processa o menor caminho acumulado e retorna o array de nós visitados e a distância total em km.
4. **Renderização 3D:** O mapa atualiza as cores do trajeto:
   * **Laranja:** Ponto de Origem
   * **Verde:** Nós/Vértices pertencentes à rota
   * **Vermelho:** Arestas/Ruas do menor caminho
   * **Cinza:** Ruas comuns do mapa

---

## Guia de Instalação

### **Pré-requisitos**
* [Node.js](https://nodejs.org/) (versão 18.x ou superior)
* Gerenciador de pacotes (`npm`, `yarn` ou `pnpm`)

### **Passo a Passo**

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/seu-usuario/cidade-luizinho-3d.git](https://github.com/seu-usuario/cidade-luizinho-3d.git)
   cd cidade-luizinho-3d

2. **Instale as dependências:**
   ```bash
   npm install
   # ou
   yarn install
   # ou
   pnpm install

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   # ou
   yarn dev
   # ou
   pnpm dev

4. **Acesse a aplicação:**
   Abra o navegador e vá para [http://localhost:3000](http://localhost:3000)

---

## Como usar:

1. No painel superior, selecione o ponto de Origem (ex: Casa do Luizinho).

2. Selecione o ponto de Destino (ex: Shopping Center).

3. Clique no botão Calcular Menor Rota.

4. Observe a resposta:
   - A distância total (km) será exibida no painel.
   - O mapa 3D destacará o trajeto ideal em vermelho.

5. Interação no Mapa 3D:
   - Rotacionar Câmera: Clique e arraste com o botão esquerdo do mouse.
   - Pan / Mover Câmera: Clique e arraste com o botão direito do mouse.
   - Zoom: Utilizar a barra de rolagem (scroll) do mouse.

---

## Conceitos de Teoria dos Grafos Aplicados:

- **Grafo $G = (V, E)$**: A cidade é modelada onde $V$ representa os locais (vértices) e $E$ representa as vias públicas (arestas).
- **Grafo Ponderado**: Cada aresta possui um peso $w(e)$ equivalente à distância em quilômetros.
- **Algoritmo de Dijkstra**: Garante a determinação do caminho de custo mínimo acumulado entre a origem e o destino escolhidos.
- **Mapeamento Cartesiano**: Cada nó possui coordenadas fixas $(X, Y, Z)$ para evitar sobreposição de linhas e garantir estabilidade visual.