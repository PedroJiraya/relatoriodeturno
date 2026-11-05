# Prompt do projeto

Crie uma aplicação web frontend para padronizar relatórios de serviços de final de turno de manutenção corretiva.

## Requisitos

- Usar Vite no frontend.
- Disponibilizar uma página responsiva para preenchimento do relatório.
- Campos do turno: data, turno, turma, supervisor e executantes.
- Campos do atendimento: ativo/CM, código, árvore de falhas, causa, diagnóstico executado, solução aplicada e status final.
- O código de manutenção deve ser um select com exatamente estas quatro opções:
  - HMC – 9200
  - MPS – 9600
  - MPNS – 9100
  - HAC – 9700
- O código deve ser selecionável tanto no atendimento principal quanto em cada equipamento parado.
- Usar a árvore de falhas fornecida pelo usuário para montar cinco selects hierárquicos, nesta ordem:
  1. Sistema
  2. Componente
  3. Subcomponente
  4. Causa
  5. Solução
- Cada select deve ser habilitado/preenchido conforme a seleção do nível anterior. Exemplo:
  `AHS ON BOARD > Autonomy > Roteador > Aterramento > Corrigir`.
- O relatório deve possuir uma seção “Equipamentos Parados” com uma lista repetível.
- Cada linha de equipamento parado deve possuir o identificador CM e um select de código, além de controles para adicionar e remover linhas.
- Gerar o texto no formato do modelo de relatório fornecido.
- Permitir abrir uma mensagem pré-preenchida no WhatsApp.
- Deixar a implementação do PDF para uma etapa futura.
- Manter a arquitetura preparada para um backend futuro com persistência e histórico (ledger), sem implementar backend nesta primeira etapa.
- Preservar os textos em português do Brasil e priorizar uma interface clara para uso em campo.

## Saída para WhatsApp

Gerar uma mensagem de texto simples e legível, com cabeçalho de relatório de turno, dados da equipe, ativo atendido, código selecionado, os cinco níveis da árvore de falhas, diagnóstico, solução aplicada, status final e a relação de equipamentos parados com seus respectivos códigos.

Essa saída deve ser otimizada para copiar, compartilhar e abrir no WhatsApp.

## PDF

Fica fora do escopo da implementação atual. A ficha visual baseada na imagem de referência será retomada em uma etapa futura.

## Próxima evolução

Integrar a árvore completa de falhas em `src/data/`, manter os cinco selects dependentes, adicionar validação, permitir múltiplos atendimentos por relatório, implementar a ficha PDF em etapa futura e adicionar persistência em backend.
