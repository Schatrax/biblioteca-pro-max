# 📚 Sistema de Biblioteca – Versão Avançada para Testes

Sistema completo de gerenciamento de biblioteca com autenticação, dashboard, favoritos, arrendamentos, compras e painel administrativo de usuários. Ideal para praticar testes de API (backend) e interface (frontend) com Node.js, Express e JavaScript puro.

***

## 🎯 Sobre o Projeto

Ambiente de aprendizado focado em **automação de testes** de API e UI.  
Inclui fluxos reais de uso: cadastro/login, CRUD de livros, favoritos, empréstimos (arrendamentos), compras de livros e gestão de usuários por administradores.

***

## ✨ Funcionalidades

### 🔐 Autenticação e Perfis
- **Registro público:** Criação de conta sempre como **Aluno**.
- **Login:** Autenticação por email e senha.
- **Perfis de usuário:**  
  - Aluno (tipo 1)  
  - Funcionário (tipo 2)  
  - Administrador (tipo 3)
- **Admin de Usuários:** Tela exclusiva onde o admin cria/edita/exclui funcionários e outros admins (CRUD completo).

### 📖 Gerenciamento de Livros
- **Criar Livro:** Nome, autor, páginas, descrição, imagem, estoque e preço.
- **Listar Livros:** Grid responsivo com capa e informações principais.
- **Detalhes:** Página dedicada para visualização de um livro.
- **Atualizar / Deletar:** Operações completas de edição e remoção.

### 📅 Arrendamentos (Empréstimos)
- **Aluno:**  
  - Solicitar arrendamento escolhendo o livro por nome.  
  - Ver lista de “Meus Arrendamentos”.
- **Funcionário/Admin:**  
  - Tela de **Aprovação de Arrendamentos** para listar todos.  
  - Aprovar / Rejeitar pedidos, com atualização de estoque.

### 🛒 Compras
- **Compras (Aluno):**  
  - Tela para listar livros disponíveis e registrar compras.  
  - Tela separada “Minhas Compras” para histórico.
- **Compras Admin/Funcionário:**  
  - Tela “Compras Admin” listando todas as compras.  
  - Aprovar ou cancelar, com controle de estoque.

### 📊 Dashboard
- **Visão Aluno:** Livros disponíveis, total de livros, quantidade de alunos.
- **Visão Funcionário:** Arrendamentos pendentes, livros disponíveis, número de funcionários.
- **Visão Admin:** Totais de livros/usuários e contagem de Alunos, Funcionários e Admins.

### ❤️ Sistema de Favoritos
- Adicionar / remover livros dos favoritos.
- Página “Meus Favoritos” listando apenas os livros favoritados.

### 🎨 Interface
- Layout responsivo (desktop, tablet, mobile).
- Navegação consistente em todas as páginas.
- Alertas de sucesso/erro nas principais ações.

***

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** – Runtime JavaScript.
- **Express** – Framework web.
- **CORS** – Liberação de acesso entre origens.
- **Swagger UI Express** + **Swagger JSDoc** – Documentação interativa da API.

### Frontend
- **HTML5** – Estrutura semântica.
- **CSS3** – Layout com flexbox e grid.
- **JavaScript (ES6+)** – Lógica da aplicação.
- **Fetch API** – Requisições HTTP assíncronas.

***

## 📋 Pré‑requisitos

- Node.js 14+ (LTS recomendada).
- npm.
- Git (para clonar o repositório).

***

## 🚀 Como Executar Localmente

```bash
git clone https://github.com/brunonf15/biblioteca-pro-max.git
cd crud-livros-expandido
npm install
npm start
```

O servidor sobe na porta **3000**.

Acessos principais:

- Aplicação (login): `http://localhost:3000/login.html`  
- Swagger: `http://localhost:3000/api-docs`  
- Base da API: `http://localhost:3000`

***

## 📁 Estrutura do Projeto

```text
crud-livros-expandido/
├── package.json           # Dependências e scripts
├── server.js              # Servidor Express e rotas da API
├── README.md              # Este arquivo
└── public/
    ├── css/
    │   └── style.css
    ├── js/
    │   ├── auth.js              # Autenticação no front e menu dinâmico
    │   ├── login.js             # Lógica de login
    │   ├── registro.js          # Registro (sempre aluno)
    │   ├── dashboard.js         # Dashboard com visão por perfil
    │   ├── livros.js            # CRUD de livros (UI)
    │   ├── detalhes.js          # Página de detalhes do livro
    │   ├── favoritos.js         # Meus favoritos
    │   ├── arrendamentos.js     # Meus arrendamentos (aluno)
    │   ├── aprovacoes.js        # Aprovação de arrendamentos (func/admin)
    │   ├── compras.js           # Tela de compras (aluno)
    │   ├── minhas-compras.js    # Histórico de compras (aluno)
    │   ├── compras-admin.js     # Gestão de compras (func/admin)
    │   └── admin-usuarios.js    # CRUD de usuários (admin)
    ├── login.html
    ├── registro.html
    ├── dashboard.html
    ├── livros.html
    ├── detalhes.html
    ├── favoritos.html
    ├── arrendamentos.html
    ├── aprovacoes.html
    ├── compras.html
    ├── minhas-compras.html
    └── admin-usuarios.html
```

***

## 🔌 Endpoints da API (Resumo)

### Autenticação

| Método | Endpoint     | Descrição                              |
|--------|--------------|----------------------------------------|
| POST   | `/registro`  | Criar usuário (aluno / func / admin)  |
| POST   | `/login`     | Autenticar usuário                     |

### Usuários (Admin / CRUD)

| Método | Endpoint         | Descrição                       |
|--------|------------------|---------------------------------|
| GET    | `/usuarios`      | Listar usuários (sem senha)     |
| PUT    | `/usuarios/:id`  | Atualizar nome/email/tipo       |
| DELETE | `/usuarios/:id`  | Excluir usuário (exceto id 1)   |

### Livros

| Método | Endpoint                  | Descrição                         |
|--------|---------------------------|-----------------------------------|
| GET    | `/livros`                 | Listar todos os livros            |
| GET    | `/livros/disponiveis`     | Listar apenas com estoque > 0     |
| GET    | `/livros/:id`             | Buscar livro por ID               |
| POST   | `/livros`                 | Criar livro                       |
| PUT    | `/livros/:id`             | Atualizar livro                   |
| DELETE | `/livros/:id`             | Remover livro                     |
| GET    | `/livros/recentes/ultimos`| Últimos 5 livros cadastrados      |

### Estatísticas

| Método | Endpoint        | Descrição                                              |
|--------|-----------------|--------------------------------------------------------|
| GET    | `/estatisticas` | Totais de livros, páginas, usuários e pendências      |

### Favoritos

| Método | Endpoint               | Descrição                          |
|--------|------------------------|------------------------------------|
| GET    | `/favoritos/:usuarioId`| Listar favoritos do usuário        |
| POST   | `/favoritos`          | Adicionar livro aos favoritos      |
| DELETE | `/favoritos`          | Remover livro dos favoritos        |

### Arrendamentos

| Método | Endpoint                   | Descrição                                    |
|--------|----------------------------|----------------------------------------------|
| GET    | `/arrendamentos`          | Listar todos (para aprovação)                |
| GET    | `/arrendamentos/me`       | Listar arrendamentos de um usuário (`usuarioId` na query) |
| POST   | `/arrendamentos`          | Solicitar arrendamento                       |
| PUT    | `/arrendamentos/:id/status`| Alterar status (APROVADO / REJEITADO)       |

### Compras

| Método | Endpoint                 | Descrição                                        |
|--------|--------------------------|--------------------------------------------------|
| GET    | `/compras`              | Listar todas as compras                          |
| GET    | `/compras/me`           | Compras de um usuário (`usuarioId` na query)     |
| POST   | `/compras`              | Registrar compra                                 |
| PUT    | `/compras/:id/status`   | Alterar status (APROVADA / CANCELADA)           |

***

## 🎓 Uso para Testes Automatizados

Pensado para treinar:

- **API Testing:** registro/login, CRUD de livros, arrendamentos, compras, erros de validação, estados pendente/aprovado/rejeitado.  
- **UI Testing:** fluxos reais (login, navegação por perfis, favoritos, compras, painel admin), validação de formulários e comportamento condicional por tipo de usuário.

Ferramentas sugeridas:

- API: Postman, Insomnia, Rest Assured, Playwright, Cypress.  
- UI: Selenium WebDriver, Cypress, Playwright, Puppeteer.

***

## 💡 Dados de Teste

Usuários iniciais:

- **Admin:**  
  - Email: `admin@biblioteca.com`  
  - Senha: `123456`  
- **Funcionário:**  
  - Email: `func@biblio.com`  
  - Senha: `123456`  
- **Aluno:**  
  - Email: `aluna@teste.com`  
  - Senha: `123456`

Livros iniciais:

1. Clean Code – Robert C. Martin (464 páginas)  
2. Harry Potter – J.K. Rowling (309 páginas)

***

## 📝 Licença e Autor

Projeto de código aberto para fins educacionais.

**Autor:** Bruno Figueiredo  
- GitHub: [@brunonf15](https://github.com/brunonf15)  
- LinkedIn: [Bruno Figueiredo](https://www.linkedin.com/in/brunonascimento15/)

***

Se esse projeto ajudar nos seus estudos ou testes, considere dar uma ⭐ no GitHub!

***

## 🧪 Test Automation

## Contribuição de Automação (Este Fork)

A aplicação Biblioteca Pro Max foi originalmente desenvolvida por Bruno Figueiredo para fins educacionais e de aprendizagem de testes de software.

Toda a framework de automação presente neste fork foi desenvolvida por Nuno Fonseca no âmbito da certificação CRE (Certificação Rumos Expert) – Test Automation Engineer.

O trabalho realizado inclui:

* Desenvolvimento completo da suíte de testes API (32 casos de teste)
* Desenvolvimento completo da suíte de testes UI (24 casos de teste)
* Implementação da arquitetura Page Object Model (POM)
* Criação e gestão de dados dinâmicos para execução dos testes
* Integração contínua através de GitHub Actions
* Configuração de relatórios HTML do Playwright
* Configuração de screenshots, vídeos e traces para análise de falhas
* Estruturação da framework de automação seguindo boas práticas de manutenção e reutilização de código

Este projeto foi desenvolvido como trabalho final da certificação CRE – Test Automation Engineer, tendo obtido a classificação final de 19,8 valores em 20.

### Stack utilizada

* JavaScript
* Playwright
* Node.js
* Page Object Model
* GitHub Actions
* HTML Report do Playwright

### Estrutura dos testes

```text
tests/
├── api/
│   ├── auth.api.spec.js
│   ├── livros.api.spec.js
│   ├── estatisticas.api.spec.js
│   ├── favoritos.api.spec.js
│   ├── arrendamentos.api.spec.js
│   ├── compras.api.spec.js
│   └── usuarios.api.spec.js
│
└── ui/
    ├── auth.ui.spec.js
    ├── navigation.ui.spec.js
    ├── dashboard.ui.spec.js
    ├── livros.ui.spec.js
    ├── favoritos.ui.spec.js
    ├── arrendamentos.ui.spec.js
    ├── compras.ui.spec.js
    └── admin-usuarios.ui.spec.js

pages/
fixtures/
```

### Framework Design

Os testes UI seguem o padrão Page Object Model (POM), promovendo:

- Reutilização de código
- Manutenção simplificada
- Separação entre lógica de teste e locators
- Maior legibilidade dos testes

### Cobertura

* API: 32 casos de teste automatizados
* UI: 24 casos de teste automatizados
* Total: 56 casos de teste
* Execução final: 168 testes Playwright passados

### Instalar dependências

```bash
npm install
npx playwright install
```

### Executar todos os testes

```bash
npx playwright test
```

### Executar apenas testes de API

```bash
npx playwright test tests/api
```

### Executar apenas testes de UI

```bash
npx playwright test tests/ui
```

### Executar apenas em Chromium

```bash
npx playwright test --project=chromium
```

### Executar com browser visível

```bash
npx playwright test --headed
```

### Abrir modo interativo do Playwright

```bash
npx playwright test --ui
```

### Gerar e abrir relatório HTML

Após executar os testes:

```bash
npx playwright show-report
```

O relatório HTML é gerado automaticamente na pasta:

```text
playwright-report/
```

O Playwright também gera evidências em caso de falha, como screenshots, vídeos e traces, conforme configurado no `playwright.config.js`.

### Dados de teste

Os testes utilizam dados dinâmicos com `Date.now()` para evitar conflitos entre execuções.

Exemplo:

```javascript
const email = `user.${Date.now()}@teste.com`;
```

Também são utilizados utilizadores base definidos em:

```text
fixtures/users.js
```

### GitHub Actions

O projeto inclui um workflow em:

```text
.github/workflows/playwright.yml
```

Este workflow executa os testes automaticamente no GitHub Actions e publica o relatório do Playwright como artifact.

### Execução via Docker/Jenkins

A execução via Docker/Jenkins é opcional e pode ser configurada criando uma pipeline no Jenkins com os seguintes passos:

1. Fazer checkout do repositório.
2. Instalar dependências.
3. Instalar browsers do Playwright.
4. Executar os testes.
5. Arquivar o relatório HTML.

Exemplo de pipeline Jenkins:

```groovy
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                url: 'https://github.com/Schatrax/biblioteca-pro-max.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                bat 'npx playwright install'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                bat 'npx playwright test --project=chromium'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
        }
    }
}
```

Caso a pipeline seja executada em Linux/Docker, substituir `bat` por `sh`:

```groovy
sh 'npm install'
sh 'npx playwright install --with-deps'
sh 'npx playwright test --project=chromium'
```

### Nota sobre Jenkins/Docker

A execução local e em GitHub Actions está configurada. A execução em Jenkins/Docker pode ser adicionada como melhoria futura, dependendo da configuração do ambiente Jenkins disponível.
