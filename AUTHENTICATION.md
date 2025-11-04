# Sistema de Autenticação

## Visão Geral

O sistema implementa autenticação completa com JWT (JSON Web Tokens) e criptografia de senhas usando bcrypt.

## Arquitetura Backend

### Dependências
- `bcrypt` (5.1.1): Hash de senhas
- `jsonwebtoken` (9.0.2): Geração e verificação de tokens JWT

### Estrutura de Arquivos

```
backend/src/
├── types/user.types.ts        # Interfaces de usuário e autenticação
├── services/
│   ├── user.repository.ts     # CRUD de usuários no LevelDB
│   └── auth.service.ts        # Lógica de autenticação
├── middleware/
│   ├── auth.ts                # Middleware de verificação JWT
│   └── validators.ts          # Validação de requisições
├── controllers/
│   └── auth.controller.ts     # Handlers de rotas
└── routes/
    └── auth.routes.ts         # Definição das rotas
```

### Modelos de Dados

#### User
```typescript
interface User {
  id: string;
  email: string;
  password: string;  // Hash bcrypt
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### UserResponse (sem senha)
```typescript
interface UserResponse {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Endpoints da API

#### POST /api/auth/register
Registra um novo usuário.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Validações:**
- Email válido
- Senha mínimo 6 caracteres
- Nome entre 2 e 100 caracteres

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "joao@example.com",
      "name": "João Silva",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt-token-aqui"
  }
}
```

**Erros:**
- 409: Email já registrado
- 400: Validação falhou

#### POST /api/auth/login
Autentica um usuário.

**Body:**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "joao@example.com",
      "name": "João Silva",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt-token-aqui"
  }
}
```

**Erros:**
- 401: Credenciais inválidas
- 400: Validação falhou

#### GET /api/auth/me
Retorna dados do usuário autenticado (requer token).

**Headers:**
```
Authorization: Bearer jwt-token-aqui
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "joao@example.com",
    "name": "João Silva",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Erros:**
- 401: Token inválido ou ausente
- 404: Usuário não encontrado

### Segurança

#### Hash de Senhas
- Algoritmo: bcrypt
- Salt rounds: 10
- Senhas nunca são armazenadas em texto plano

#### JWT
- Expiração: 7 dias
- Secret: Variável de ambiente `JWT_SECRET`
- Payload inclui: `userId`, `email`

#### Middleware de Autenticação
Verifica o token JWT em rotas protegidas:
- Extrai token do header `Authorization: Bearer <token>`
- Verifica validade do token
- Adiciona `userId` e `userEmail` à requisição

### Armazenamento (LevelDB)

Estrutura de chaves:
- `user:${userId}` → Dados completos do usuário (JSON)
- `user:email:${email}` → Mapeamento email → userId (índice)

## Arquitetura Frontend

### Estrutura de Arquivos

```
frontend/src/
├── types/auth.ts              # Interfaces TypeScript
├── context/AuthContext.tsx    # Context API para estado global
├── services/authService.ts    # Chamadas à API
└── components/
    ├── Login.tsx              # Formulário de login
    └── Register.tsx           # Formulário de cadastro
```

### AuthContext

Gerencia o estado de autenticação globalmente.

**Funcionalidades:**
- Carrega usuário do localStorage na inicialização
- Gerencia token no localStorage
- Fornece funções: `login`, `register`, `logout`
- Estado: `user`, `loading`, `isAuthenticated`

**Uso:**
```typescript
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  // ...
}
```

### authService

Serviço para comunicação com a API.

**Métodos:**
- `register(data)`: Cria conta
- `login(data)`: Autentica usuário
- `getMe()`: Busca dados do usuário logado
- `logout()`: Remove token
- `isAuthenticated()`: Verifica se há token

**Gerenciamento de Token:**
- Token armazenado em `localStorage` com chave `'token'`
- Token incluído em todas as requisições autenticadas via header `Authorization`
- Token removido automaticamente em caso de erro 401

### Componentes

#### Login
Formulário de autenticação:
- Campos: email, senha
- Validação: email válido, senha mínimo 6 caracteres
- Link para cadastro
- Tratamento de erros

#### Register
Formulário de cadastro:
- Campos: nome, email, senha, confirmar senha
- Validações:
  - Nome entre 2-100 caracteres
  - Email válido
  - Senha mínimo 6 caracteres
  - Senhas devem coincidir
- Link para login
- Tratamento de erros

### Fluxo de Autenticação

1. **Inicialização**
   - App carrega
   - AuthContext verifica token em localStorage
   - Se token existe, chama `getMe()` para carregar dados do usuário
   - Se falhar, remove token

2. **Login**
   - Usuário preenche formulário
   - Frontend envia POST `/api/auth/login`
   - Backend valida credenciais
   - Retorna usuário + token
   - Frontend salva token em localStorage
   - Atualiza estado global

3. **Uso da Aplicação**
   - Todas as requisições incluem token
   - Backend verifica token via middleware
   - Usuário pode acessar recursos protegidos

4. **Logout**
   - Remove token do localStorage
   - Limpa estado global
   - Redireciona para login

### Proteção de Rotas

O componente `App` verifica autenticação:
```typescript
if (!isAuthenticated) {
  return <Login /> ou <Register />
}
return <MainApp />
```

## Variáveis de Ambiente

### Backend (.env)

```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production-please
PORT=3001
```

**IMPORTANTE:** 
- Altere `JWT_SECRET` em produção para uma chave forte e única
- Nunca commite o arquivo `.env` (já está no `.gitignore`)

## Testando a Autenticação

### Teste Manual

1. Inicie o backend:
```bash
cd backend
npm run dev
```

2. Inicie o frontend:
```bash
cd frontend
npm run dev
```

3. Acesse `http://localhost:3000`

4. Teste o fluxo:
   - Criar conta (Register)
   - Fazer login
   - Ver nome no header
   - Criar tarefas
   - Fazer logout
   - Login novamente

### Teste com cURL

**Registrar:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste User",
    "email": "teste@example.com",
    "password": "senha123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "senha123"
  }'
```

**Buscar usuário (com token):**
```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer SEU-TOKEN-AQUI"
```

## Próximos Passos (Opcional)

- [ ] Associar tarefas a usuários específicos
- [ ] Adicionar refresh tokens
- [ ] Implementar "Esqueci minha senha"
- [ ] Adicionar verificação de email
- [ ] Implementar testes automatizados de autenticação
- [ ] Adicionar rate limiting para prevenir brute force
