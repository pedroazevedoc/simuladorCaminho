# Política de Segurança

## Versões suportadas

| Versão | Suporte |
| --- | --- |
| 2.x | ✅ |
| < 2.0 | ❌ |

Apenas a versão mais recente publicada na branch principal recebe correções de segurança.

## Reportando uma vulnerabilidade

**Não abra uma issue pública para relatar vulnerabilidades.**

Use o recurso de relato privado de vulnerabilidades do GitHub:

https://github.com/pedroazevedoc/simuladorCaminho/security/advisories/new

Se não conseguir acessar o link, abra uma issue pública apenas informando que deseja relatar um problema de segurança, **sem detalhes técnicos**, e um mantenedor entrará em contato.

### O que incluir no relato

- Descrição clara da vulnerabilidade;
- Passos para reproduzir;
- Impacto esperado;
- Ambiente utilizado (navegador, sistema, versão do projeto);
- Prova de conceito, se possível;
- Sugestão de correção, se tiver.

## Escopo

### Em escopo

- Execução remota de código;
- XSS, injeção ou manipulação indevida de dados;
- Exposição de segredos ou informações sensíveis;
- Falhas na API `/api/rota` que permitam efeitos indevidos;
- Vulnerabilidades conhecidas em dependências usadas pelo projeto;
- Falhas que permitam consumo excessivo e sustentado de recursos.

### Fora de escopo

- Engenharia social;
- Ataques de força bruta ou negação de serviço puramente volumétricos;
- Problemas em serviços de terceiros (GitHub, Vercel, provedores de CDN etc.);
- Relatórios automatizados sem prova de conceito ou impacto demonstrável;
- Ausência de cabeçalhos de segurança sem exploração viável.

## Processo de resposta

- **Confirmação de recebimento:** até 3 dias úteis;
- **Avaliação inicial:** até 7 dias úteis;
- **Correção:** depende da gravidade e da complexidade; o prazo será informado após a triagem;
- **Créditos:** se desejar, o pesquisador será creditado na correção ou no aviso de segurança.

## Divulgação responsável

Pedimos que a vulnerabilidade não seja divulgada publicamente antes de uma correção ou de um prazo acordado entre as partes. Após a correção, podemos publicar um GitHub Security Advisory com os detalhes e os créditos.

## Safe harbor

Na medida permitida pela lei aplicável, não tomaremos medidas legais contra pesquisadores que atuem de boa-fé, seguindo esta política, para identificar e relatar vulnerabilidades. Atividades que causem dano, interrupção de serviço, acesso a dados de terceiros ou violação de privacidade não são cobertas por esta declaração.