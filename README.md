# Relatório de Manutenção Corretiva

Aplicação frontend para padronizar relatórios de serviços de final de turno de manutenção corretiva.

O sistema permite preencher os dados do turno, classificar a falha usando uma árvore hierárquica, registrar vários atendimentos e gerar uma mensagem pronta para envio pelo WhatsApp.

## Funcionalidades

- Cadastro dos dados do turno:
  - Data;
  - Turno;
  - Turma;
  - Supervisor;
  - Executantes.
- Registro de um ou mais atendimentos no mesmo relatório.
- Seleção do código de manutenção:
  - HMC – 9200;
  - MPS – 9600;
  - MPNS – 9100;
  - HAC – 9700.
- Classificação hierárquica da falha em cinco níveis:
  1. Sistema;
  2. Componente;
  3. Subcomponente;
  4. Causa;
  5. Solução.
- Registro de diagnóstico e solução aplicada.
- Seleção do status final:
  - Liberado;
  - Em manutenção;
  - Aguardando recurso;
  - Aguardando componente.
- Cadastro de equipamentos parados com seus respectivos códigos.
- Geração de mensagem em formato de texto.
- Abertura da mensagem no WhatsApp.
- Cópia da mensagem para a área de transferência, preservando emojis e acentos.

## Tecnologias

- HTML;
- CSS;
- JavaScript;
- Vite;
- JSON para a árvore de falhas.

## Requisitos

- Node.js instalado;
- npm disponível no ambiente.

## Instalação

No terminal, dentro da pasta do projeto, execute:

```powershell
npm.cmd install
```

## Executar em desenvolvimento

```powershell
npm.cmd run dev
```

Depois, abra no navegador o endereço exibido pelo Vite, normalmente:

```text
http://localhost:5173
```

## Gerar build de produção

```powershell
npm.cmd run build
```

O resultado será gerado na pasta `dist/`.

Para visualizar o build localmente:

```powershell
npm.cmd run preview
```

## Como usar

1. Abra a aplicação no navegador.
2. Preencha os dados do turno.
3. Na seção **Ativos em manutenção**, preencha o primeiro atendimento.
4. Se houver outro equipamento trabalhado, clique em **Adicionar atendimento**.
5. Selecione os cinco níveis da árvore de falhas na ordem:
   - Sistema;
   - Componente;
   - Subcomponente;
   - Causa;
   - Solução.
6. Preencha o diagnóstico, a solução aplicada e o status final.
7. Cadastre os equipamentos parados, se houver.
8. Clique em **Gerar WhatsApp**.
9. Na pré-visualização, escolha uma opção:
   - **Abrir no WhatsApp** para enviar a mensagem;
   - **Copiar mensagem** para colar manualmente em uma conversa.

## Árvore de falhas

A árvore utilizada pela aplicação está em:

`src/data/fault-tree.json`

Sua estrutura possui cinco níveis de classificação. Para adicionar ou atualizar opções, altere esse arquivo mantendo a hierarquia existente.

## Estrutura do projeto

```text
.
├── index.html
├── package.json
├── plan.md
├── prompt.md
└── src
    ├── data
    │   └── fault-tree.json
    ├── main.js
    └── style.css
```

## PDF

A geração do PDF foi deixada para uma etapa futura. Atualmente, o projeto concentra-se no preenchimento do relatório e no envio da versão textual pelo WhatsApp.

## Próximos passos

- Implementar o PDF com o layout da ficha operacional de referência.
- Adicionar validação dos campos obrigatórios.
- Permitir múltiplos relatórios salvos.
- Criar backend para persistência dos relatórios.
- Implementar histórico/ledger de atendimentos.
