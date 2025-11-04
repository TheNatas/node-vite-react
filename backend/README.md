# TODO App Backend

Backend da aplicação de lista de tarefas construído com Node.js, TypeScript e LevelDB.

## 🚀 Tecnologias

- **Node.js 22** - Runtime JavaScript
- **TypeScript** - Tipagem estática
- **Express** - Framework web
- **LevelDB** - Banco de dados NoSQL local
- **Jest** - Framework de testes
- **Express Validator** - Validação de requisições

## 📋 Requisitos

- Node.js 22 ou superior
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório e navegue até a pasta do backend:

```bash
cd backend
```

2. Instale as dependências:

```bash
npm install
```

3. Copie o arquivo de exemplo de variáveis de ambiente:

```bash
cp .env.example .env
```

4. Configure as variáveis de ambiente no arquivo `.env` conforme necessário.

## 🏃 Executando o Projeto

### Desenvolvimento

```bash
npm run dev
```

O servidor iniciará na porta 3000 (ou a porta definida no `.env`).

### Produção

```bash
npm run build
npm start
```

## 🧪 Testes

### Executar todos os testes

```bash
npm test
```

### Executar testes em modo watch

```bash
npm run test:watch
```

### Gerar relatório de cobertura

```bash
npm test
```

O relatório será gerado na pasta `coverage/`.

## 📡 API Endpoints

### Health Check

```
GET /api/health
```

### Tarefas

#### Listar todas as tarefas

```
GET /api/tasks
```

Query Parameters:
- `filter` (opcional): `all`, `pending`, `completed`
- `search` (opcional): Busca por título ou descrição
- `userId` (opcional): Filtrar por usuário

#### Obter uma tarefa

```
GET /api/tasks/:id
```

#### Criar uma tarefa

```
POST /api/tasks
```

Body:
```json
{
  "title": "Título da tarefa",
  "description": "Descrição da tarefa",
  "userId": "opcional"
}
```

#### Atualizar uma tarefa

```
PUT /api/tasks/:id
```

Body:
```json
{
  "title": "Novo título (opcional)",
  "description": "Nova descrição (opcional)",
  "completed": true
}
```

#### Deletar uma tarefa

```
DELETE /api/tasks/:id
```

#### Deletar todas as tarefas

```
DELETE /api/tasks
```

#### Obter estatísticas

```
GET /api/tasks/stats
```

Query Parameters:
- `userId` (opcional): Filtrar estatísticas por usuário

Response:
```json
{
  "success": true,
  "data": {
    "total": 10,
    "completed": 5,
    "pending": 5
  }
}
```

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── controllers/       # Controladores da API
│   ├── middleware/        # Middlewares (validação, erros)
│   ├── routes/           # Rotas da API
│   ├── services/         # Serviços (database, repository)
│   ├── types/            # Tipos e interfaces TypeScript
│   ├── app.ts            # Configuração do Express
│   └── index.ts          # Entry point da aplicação
├── tests/
│   ├── integration/      # Testes de integração
│   ├── services/         # Testes de serviços
│   └── setup.ts          # Configuração dos testes
├── data/                 # Banco de dados LevelDB (gerado)
├── dist/                 # Código compilado (gerado)
└── coverage/             # Relatório de cobertura (gerado)
```

## 🔐 Tratamento de Erros

A API retorna respostas padronizadas para erros:

```json
{
  "success": false,
  "error": "Mensagem de erro"
}
```

Códigos de status HTTP:
- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Erro de validação
- `404` - Recurso não encontrado
- `500` - Erro interno do servidor

## 🧹 Linting e Formatação

```bash
# Verificar linting
npm run lint

# Formatar código
npm run format
```

## 📝 Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `PORT` | Porta do servidor | `3000` |
| `NODE_ENV` | Ambiente de execução | `development` |
| `DB_PATH` | Caminho do banco LevelDB | `./data/leveldb` |

## 🎯 Funcionalidades Implementadas

- ✅ CRUD completo de tarefas
- ✅ Filtros (todas, pendentes, concluídas)
- ✅ Busca por título/descrição
- ✅ Persistência local com LevelDB
- ✅ Validação de formulários
- ✅ Tratamento de erros robusto
- ✅ Testes unitários e de integração
- ✅ Documentação completa da API

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

ISC
