# 🚀 Guia Rápido de Uso

## Iniciar a Aplicação

### 1️⃣ Backend (Terminal 1)
```bash
cd backend
npm install          # (se ainda não instalou)
npm run build       # Compilar TypeScript
npm start           # Iniciar servidor
```
✅ Backend rodando em: **http://localhost:3000**

### 2️⃣ Frontend (Terminal 2)
```bash
cd frontend
npm install          # (se ainda não instalou)
npm run dev         # Iniciar dev server
```
✅ Frontend rodando em: **http://localhost:5173**

---

## 🎯 Funcionalidades Disponíveis

### ✨ Gerenciamento de Tarefas
- **Criar tarefa**: Preencha título e descrição no formulário à esquerda
- **Listar tarefas**: Visualize todas as tarefas na lista principal
- **Marcar como concluída**: Clique no checkbox da tarefa
- **Editar tarefa**: Clique no botão de editar (✏️)
- **Excluir tarefa**: Clique no botão de deletar (🗑️)

### 🔍 Filtros e Busca
- **Todas**: Mostra todas as tarefas
- **Pendentes**: Apenas tarefas não concluídas
- **Concluídas**: Apenas tarefas finalizadas
- **Busca**: Digite no campo de busca para filtrar por título ou descrição

### 📤 Import/Export
- **Exportar**: Clique no botão "Exportar" no header para baixar JSON
- **Importar**: Clique no botão "Importar" e selecione um arquivo JSON

### 🌙 Tema
- **Dark/Light**: Clique no ícone de sol/lua para alternar o tema
- O tema é salvo automaticamente no navegador

### 📊 Estatísticas
- **Header**: Mostra total, pendentes e concluídas em tempo real

---

## 🧪 Executar Testes

### Backend
```bash
cd backend
npm test                    # Todos os testes
npm run test:coverage      # Com cobertura
```

**Resultado esperado**: 49 testes passando (88.67% cobertura)

---

## 🏗️ Build para Produção

### Backend
```bash
cd backend
npm run build              # Compila para dist/
```

### Frontend
```bash
cd frontend
npm run build              # Compila para dist/
npm run preview            # Preview do build
```

---

## 📝 Validações

### Criar/Editar Tarefa
- **Título**: 
  - Obrigatório
  - Mínimo: 3 caracteres
  - Máximo: 100 caracteres

- **Descrição**: 
  - Obrigatória
  - Mínimo: 3 caracteres
  - Máximo: 500 caracteres

---

## 🐛 Solução de Problemas

### Backend não inicia
```bash
# Verificar se a porta 3000 está livre
lsof -i :3000

# Se estiver em uso, matar o processo
kill -9 <PID>
```

### Frontend não conecta
1. Verificar se backend está rodando em `localhost:3000`
2. Verificar console do navegador para erros
3. Verificar configuração de proxy no `vite.config.ts`

### Banco de dados corrompido
```bash
# Remover banco e começar do zero
cd backend
rm -rf data/
npm start  # Recria automaticamente
```

---

## 📚 Documentação Completa

- **README.md**: Documentação geral do projeto
- **PROJECT_STATUS.md**: Status detalhado e arquitetura
- **backend/README.md**: Documentação específica do backend
- **backend/INSTALLATION.md**: Guia detalhado de instalação

---

## 🎨 Interface

### Layout Responsivo
- **Desktop**: Formulário à esquerda, lista à direita
- **Mobile**: Layout empilhado verticalmente

### Componentes Principais
- **Header**: Logo, estatísticas, ações (export/import/tema)
- **TaskForm**: Formulário de criação (card azul)
- **FilterButtons**: Botões de filtro (all/pending/completed)
- **SearchBar**: Campo de busca com ícone de lupa
- **TaskList**: Lista de tarefas com loading state
- **TaskItem**: Card individual com ações

### Cores e Tema
- **Light Mode**: Fundo claro, texto escuro
- **Dark Mode**: Fundo escuro, texto claro
- **Cards**: Bootstrap design system
- **Feedback**: Toasts no canto inferior direito

---

## 🔗 API Endpoints

### Tarefas
- `GET /api/tasks` - Listar (query: filter, search)
- `GET /api/tasks/:id` - Buscar por ID
- `POST /api/tasks` - Criar
- `PUT /api/tasks/:id` - Atualizar
- `DELETE /api/tasks/:id` - Deletar
- `DELETE /api/tasks` - Deletar todas

### Estatísticas
- `GET /api/tasks/stats/summary` - Resumo

### Saúde
- `GET /health` - Health check

---

## ✅ Checklist de Funcionalidades

- [x] CRUD completo de tarefas
- [x] Filtros (todas, pendentes, concluídas)
- [x] Busca por título/descrição
- [x] Marcar como concluída
- [x] Validação de formulários
- [x] Persistência local (LevelDB)
- [x] Interface responsiva
- [x] Testes backend (88.67% cobertura)
- [x] Exportar/Importar JSON
- [x] Tema dark/light
- [x] Notificações toast
- [x] Estatísticas em tempo real
- [x] Tratamento de erros
- [x] API RESTful
- [x] TypeScript em todo o código
- [x] Commits regulares (7 commits)

---

## 🎉 Pronto para usar!

Siga os passos de **Iniciar a Aplicação** e comece a gerenciar suas tarefas! 🚀
