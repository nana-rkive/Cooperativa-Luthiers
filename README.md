# Cooperativa de Luthiers — Monorepo

Este repositório contém o sistema completo da **Cooperativa de Luthiers**, desenvolvido como parte da avaliação da 2ª VA de Programação Web I (UEG). O projeto utiliza uma arquitetura de monorepo moderna, estruturada com **pnpm workspaces** e orquestrada pelo **Turborepo**.

---

## 📁 Estrutura do Monorepo

O monorepo está dividido em aplicações (`apps/`) e pacotes compartilhados (`packages/`):

```txt
├── apps/
│   ├── backend/           # API REST em NestJS 11 + TypeORM + SQLite
│   └── frontend/          # SPA em Angular 20 + TailwindCSS + Signals
├── packages/
│   ├── eslint-config/     # Padrões estáticos de linting compartilhados
│   ├── typescript-config/ # Configurações base do TypeScript
│   └── utils/             # DTOs, payloads e tipos compartilhados
├── pnpm-workspace.yaml    # Definição dos workspaces do pnpm
├── turbo.json             # Pipelines de execução do Turborepo
└── AGENT.md               # Guia de governança de IA para o repositório
```

---

## 🛠️ Tecnologias Utilizadas

### Monorepo & Infraestrutura
- **PNPM Workspaces** - Gerenciador de pacotes rápido e eficiente em espaço de disco.
- **Turborepo** - Orquestrador de tarefas para otimizar builds, testes e execução simultânea.

### Backend
- **NestJS 11** - Framework Node.js progressivo para APIs eficientes e escaláveis.
- **TypeORM** - ORM para TypeScript integrado com banco de dados.
- **SQLite** - Banco de dados relacional em arquivo local (rápido e sem dependência de serviços externos).
- **class-validator & class-transformer** - Validação rigorosa dos dados de entrada.
- **Passport JWT** - Mecanismo seguro de autenticação.

### Frontend
- **Angular 20** - Plataforma estruturada com **Standalone Components** (sem NgModules).
- **TailwindCSS** - Framework utilitário de CSS para design ágil e responsivo.
- **Signals** - Controle de estado reativo e eficiente para gerenciar dados em memória.

---

## 🚀 Como Executar o Projeto

Certifique-se de ter o **Node.js (>=20)** e o **pnpm** instalados.

### 1. Instalar as dependências do Monorepo
Na raiz do projeto, execute:
```bash
pnpm install
```

### 2. Executar em Modo de Desenvolvimento
Para subir a API (backend) e a aplicação web (frontend) simultaneamente em modo watch:
```bash
pnpm dev
```
- **Frontend:** [http://localhost:4200](http://localhost:4200)
- **Backend (API):** [http://localhost:3000](http://localhost:3000)
- **Swagger Documentação:** [http://localhost:3000/api](http://localhost:3000/api)

---

## 🧪 Execução de Testes e Linting

Todas as tarefas são otimizadas via Turborepo:

### Executar a suíte de testes de todo o monorepo
```bash
pnpm test
```

### Executar o analisador de código (Linter)
```bash
pnpm lint
```

### Gerar os builds de produção
```bash
pnpm build
```

---

## 🔒 Arquitetura de Segurança & Fluxo de Auth

O sistema implementa autenticação via JWT com as seguintes características críticas:

1. **JWT Strictly In-Memory (Frontend):**
   Conforme especificado na avaliação para evitar riscos de segurança (XSS), o token JWT **nunca** é persistido no `localStorage` ou `sessionStorage`. Ele é armazenado estritamente na memória volátil utilizando um **Signal** no `AuthService`. Ao atualizar a página (F5), a sessão é intencionalmente reiniciada e novo login é exigido.
2. **HTTP Interceptor:**
   Anexa automaticamente o cabeçalho `Authorization: Bearer <token>` em todas as chamadas HTTP e intercepta erros `401 Unauthorized`, limpando a sessão e redirecionando o usuário para `/login`.
3. **Database Seed Idempotente:**
   Na inicialização, o backend executa um seed automático para garantir que a conta administrativa inicial exista no banco de dados.
   - **Administrador padrão:** `admin@ueg.br` | Senha: `admin123`

---

## 💼 Regras de Negócio Implementadas

Abaixo estão listadas as 11 regras de negócio validadas e testadas ativamente:

### Entidade Luthier (Pai)
1. **Campos Obrigatórios:** Todos os campos do cadastro de luthier são obrigatórios.
2. **Mínimo de Bancadas:** O número de bancadas (`bancadasNum`) deve ser no mínimo 2.
3. **Bancadas Inteiras:** O número de bancadas deve ser obrigatoriamente um número inteiro.
4. **Nome Completo:** O campo `nomeMestre` deve conter obrigatoriamente nome e sobrenome.
5. **Data Limite:** A data de abertura da oficina (`dataAbertura`) não pode ser futura.
6. **Data Mínima:** A data de abertura da oficina não pode ser anterior a 1900.

### Entidade Instrumento (Filho)
7. **Integridade de FK:** O `luthierId` referenciado na entrada do instrumento deve existir no sistema.
8. **Validação de Cronologia:** A data de entrada do instrumento (`dataEntrada`) não pode ser anterior à data de abertura da oficina do luthier responsável.
9. **Limite de Custo:** O custo do reparo (`custoReparo`) deve estar estritamente entre R$ 0 e R$ 50.000.
10. **Condicional de Conclusão:** Se o reparo for marcado como concluído (`reparoConcluido = true`), o custo do reparo deve ser estritamente maior que zero.
11. **Modelo Único em Reparo:** Não é permitido duplicar o `modeloMadeira` de instrumento em reparo simultâneo na mesma oficina (para o mesmo luthier).
