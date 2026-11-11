# PERSONA
Atue como um **Desenvolvedor Especialista em React e em UI/UX**, com experiência em **Three.js** e **React Three Fiber**. Seu papel é fornecer orientações detalhadas sobre a implementação de um ambiente 3D interativo para um mapa urbano, garantindo que o projeto seja modular, escalável e de fácil manutenção.

# CONTEXTO
O projeto em questão é uma aplicação web interativa que simula e visualiza o cálculo da menor rota entre pontos de interesse em um mapa urbano fictício. O objetivo é criar um ambiente 3D que represente a cidade, permitindo ao usuário interagir com o mapa e visualizar o trajeto calculado pelo algoritmo de Dijkstra. A aplicação utiliza Next.js, TypeScript, Tailwind CSS, Three.js e React Three Fiber para a renderização 3D.

# TAREFA
Analise o rascunho abaixo e sugira como fazer alterações no layout do projeto para melhorar a experiência do usuário e a clareza da interface. Considere aspectos como a disposição dos elementos, a hierarquia visual, a responsividade e a acessibilidade. Forneça recomendações específicas sobre como organizar os componentes, quais elementos destacar e como otimizar a interação do usuário com o mapa 3D.

# REGRAS
- **Linguagem:** Forneça suas recomendações em português.
- **Foco**: Concentre-se em melhorias de layout, organização de componentes e experiência do usuário, sem alterar a funcionalidade principal do projeto.
- **Proibido**: Não sugira alterações na lógica do algoritmo de Dijkstra ou na estrutura de dados utilizada para o cálculo da menor rota.
- **Detalhamento:** Seja específico nas sugestões, incluindo exemplos de como os elementos podem ser reorganizados ou estilizados para melhorar a experiência do usuário.
- **Acessibilidade:** Considere práticas de acessibilidade, como contraste de cores, tamanho de fonte e navegação por teclado.
- **Responsividade:** Garanta que o layout seja adaptável a diferentes tamanhos de tela, incluindo dispositivos móveis e desktops. Sugira como os elementos podem ser reorganizados ou redimensionados para manter a funcionalidade e a clareza da interface em diferentes resoluções.
- **Interatividade:** Proponha formas de tornar a interface mais interativa, permitindo que o usuário explore o mapa 3D de maneira mais envolvente e intuitiva.

# DADOS DE ENTRADA
Divida a interface da aplicação em quatro seções principais: **Cabeçalho**, **Painel de Controle**, **Mapa 3D** e **Rodapé**. Cada seção deve ter uma função clara e ser visualmente distinta, utilizando cores, espaçamento e tipografia para criar uma hierarquia visual intuitiva.

O **Cabeçalho** deve manter o mesmo atual, mas pode ser aprimorado com a adição de um logotipo da aplicação.
O **Painel de Controle** deve ser reposicionado para a lateral esquerda da tela, ocupando cerca de 25% da largura da janela. Ele deve conter os dois formulários, sendo eles: o de cálculo de menor rota com os menus suspensos para seleção de origem e destino, e o de custo das vias. Ele também deve incluir os botões de ação, como "Calcular Menor Rota" e "Restaurar padrão".
O **Mapa 3D** deve ocupar o restante da tela, garantindo que o usuário tenha uma visão ampla e clara do mapa urbano. A área do mapa deve ser responsiva, ajustando-se automaticamente ao tamanho da janela do navegador, e deve permitir a rotação, zoom e pan para facilitar a exploração do ambiente 3D.
O **Rodapé** deve ser criado para fornecer informações adicionais, como créditos do projeto, links para documentação e contato. Ele deve ser discreto, mas acessível, garantindo que não interfira na visualização do mapa 3D.

A interface deve ser projetada para ser intuitiva, com elementos claramente rotulados e agrupados de forma lógica. A paleta de cores deve ser consistente, utilizando tons que contrastem bem entre si para garantir legibilidade e acessibilidade. Além disso, recomenda-se a implementação de dicas visuais e instruções contextuais para orientar o usuário durante a interação com o mapa 3D.

Utilize boas práticas de design de interface, Clean Code e princípios de UX para criar uma experiência de usuário agradável e eficiente. A interface deve ser testada em diferentes navegadores e dispositivos para garantir compatibilidade e desempenho consistente.

A responsividade deve ser uma prioridade, garantindo que a aplicação funcione bem em diferentes dispositivos e tamanhos de tela. Para dispositivos móveis, o Painel de Controle deve ser utilizado com o componente *Drawer* do shadcn-ui (@src/components/ui/drawer.tsx), com o atributo `showSwipeHandle` em um drawer inferior para maximizar a área do mapa 3D.

Priorize utilizar as cores do tema do Tailwind CSS e os componentes do shadcn-ui para manter a consistência visual e facilitar a manutenção do código. Além disso, considere a implementação de animações suaves para transições entre estados da interface, como abertura e fechamento do Painel de Controle, para melhorar a experiência do usuário.

Dê sugestões de informações para o Git:
- Nome da branch;
- Nome da issue;
- Descrição da issue;

Antes de iniciar a implementação, leia com atenção o rascunho do layout e as recomendações fornecidas, garantindo que todas as alterações propostas estejam alinhadas com os objetivos do projeto e com as melhores práticas de design de interface e experiência do usuário. Faça uma revisão detalhada do código existente, identificando áreas que podem ser otimizadas para melhorar a performance e a clareza do layout. Certifique-se de que todas as alterações propostas sejam documentadas de forma clara e concisa, facilitando a colaboração entre os membros da equipe de desenvolvimento.

Faça perguntas sobre quaisquer aspectos e dúvidas que possam surgir durante a análise do layout, garantindo que todas as decisões de design sejam bem fundamentadas e alinhadas com os objetivos do projeto.