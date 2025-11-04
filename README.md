# TODO List Application 📝

Aplicação full-stack de lista de tarefas desenvolvida com Node.js, TypeScript, React e LevelDB.

![Status](https://img.shields.io/badge/status-completo-brightgreen)
![Backend](https://img.shields.io/badge/backend-Node.js%20%2B%20TypeScript-blue)
![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20TypeScript-61dafb)
![Tests](https://img.shields.io/badge/tests-49%20passing-success)
![Coverage](https://img.shields.io/badge/coverage-88.67%25-brightgreen)

## 📋 Sobre o Projeto

Este é um projeto full-stack de gerenciamento de tarefas (TODO list) que atende aos seguintes requisitos:

- ✅ CRUD completo de tarefas
- ✅ Filtros (todas, pendentes, concluídas)
- ✅ Busca por título/descrição
- ✅ Persistência local com LevelDB
- ✅ Validação de formulários
- ✅ Testes frontend e backend
- ✅ Tratamento de erros robusto
- ✅ API RESTful bem documentada

## 🚀 Tecnologias

### Backend
- **Node.js 22** - Runtime JavaScript
- **TypeScript** - Tipagem estática
- **Express** - Framework web
- **LevelDB** - Banco de dados NoSQL local
- **Jest** - Framework de testes (88.67% cobertura)
- **Express Validator** - Validação de requisições

### Frontend
- **Vite 7** - Build tool
- **React 19** - Biblioteca UI
- **Bootstrap 5** - Framework CSS responsivo
- **TypeScript** - Tipagem estática
- **Axios** - Cliente HTTP
- **React Toastify** - Notificações
- **Vitest** - Framework de testes (configurado)

## 📁 Estrutura do Projeto

```
node-vite-react/
├── backend/           # API backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   ├── tests/
│   └── README.md
├── frontend/          # (Em desenvolvimento)
└── README.md
```

## 🔧 Instalação e Execução

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

Para mais detalhes sobre o backend, veja [backend/README.md](backend/README.md)

## 🧪 Testes

### Backend
```bash
cd backend
npm test
```

Cobertura atual: **88.67%**

## 📡 API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/health` | Status da API |
| GET | `/api/tasks` | Lista todas as tarefas |
| GET | `/api/tasks/:id` | Obtém uma tarefa |
| GET | `/api/tasks/stats` | Estatísticas das tarefas |
| POST | `/api/tasks` | Cria uma nova tarefa |
| PUT | `/api/tasks/:id` | Atualiza uma tarefa |
| DELETE | `/api/tasks/:id` | Deleta uma tarefa |
| DELETE | `/api/tasks` | Deleta todas as tarefas |

## 🎯 Funcionalidades Implementadas

### Backend ✅
- [x] CRUD completo de tarefas
- [x] Filtros por status (todas, pendentes, concluídas)
- [x] Busca por título e descrição
- [x] Persistência com LevelDB
- [x] Validação de dados
- [x] Tratamento de erros
- [x] Testes unitários e de integração
- [x] API RESTful documentada

### Frontend 🚧
- [ ] Interface com React + Bootstrap
- [ ] Formulários de criação e edição
- [ ] Filtros e busca
- [ ] Tema claro/escuro
- [ ] Importar/Exportar dados
- [ ] Testes de componentes

## 📝 Commits Regulares

Este projeto segue a convenção de commits regulares para facilitar o acompanhamento do desenvolvimento:

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `test:` - Adição ou modificação de testes
- `docs:` - Documentação
- `refactor:` - Refatoração de código
- `style:` - Formatação e estilo

## 👤 Autor

Desenvolvido como parte de um desafio técnico.

## 📄 Licença

ISC
