# 🚀 Guia de Deploy - TODO List Application

Este guia apresenta várias opções para fazer deploy da aplicação TODO List. Escolha a que melhor se adequa às suas necessidades.

---

## 📋 Índice

1. [Render.com (Recomendado)](#opção-1-rendercom-recomendado-)
2. [Vercel + Railway](#opção-2-vercel-frontend--railway-backend)
3. [Fly.io](#opção-3-flyio)
4. [Docker + VPS](#opção-4-docker--vps)
5. [Comparação de Plataformas](#-comparação-de-plataformas)

---

## Opção 1: Render.com (Recomendado) 🌟

### Por que Render?

- ✅ **100% Gratuito** para projetos pessoais
- ✅ **Deploy automático** via GitHub
- ✅ **SSL/HTTPS grátis** incluso
- ✅ **Disco persistente** para LevelDB (1GB free)
- ✅ **Logs em tempo real**
- ✅ **Simples** - Deploy em ~15 minutos

### Pré-requisitos

- Conta no GitHub
- Repositório do projeto no GitHub
- Conta no [Render.com](https://render.com) (gratuita)

### Passo a Passo

#### 1. Preparar o Repositório

O arquivo `render.yaml` já está configurado na raiz do projeto. Certifique-se de fazer commit e push:

```bash
git add .
git commit -m "chore: configuração de deploy para Render"
git push origin main
```

#### 2. Criar Conta no Render

1. Acesse [render.com](https://render.com)
2. Clique em **"Get Started"**
3. Faça signup com GitHub
4. Autorize o acesso do Render ao GitHub

#### 3. Deploy via Blueprint

1. No dashboard do Render, clique em **"New +"**
2. Selecione **"Blueprint"**
3. Conecte seu repositório GitHub
4. O Render detectará automaticamente o `render.yaml`
5. Revise as configurações:
   - **Backend**: `todo-backend`
   - **Frontend**: `todo-frontend`
6. Clique em **"Apply"**

#### 4. Configurar Variáveis de Ambiente

**Backend (automático via render.yaml):**
- `NODE_ENV`: production
- `PORT`: 3001
- `JWT_SECRET`: (gerado automaticamente)

**Frontend (você precisa atualizar após o backend estar rodando):**
1. Vá em `todo-frontend` → **"Environment"**
2. Atualize `VITE_API_URL` com a URL do backend:
   ```
   https://todo-backend-xxxx.onrender.com
   ```
3. Clique em **"Save Changes"**
4. O frontend será re-deployado automaticamente

#### 5. Aguardar o Deploy

- Backend: ~5-7 minutos
- Frontend: ~3-5 minutos
- Total: ~10-12 minutos

#### 6. Testar a Aplicação

Após o deploy, você receberá URLs:

- **Frontend**: `https://todo-frontend-xxxx.onrender.com`
- **Backend**: `https://todo-backend-xxxx.onrender.com`

Teste:
1. Acesse o frontend
2. Crie uma conta
3. Faça login
4. Crie algumas tarefas

### ⚠️ Limitações do Tier Gratuito

- **Sleep após 15 minutos de inatividade** - Primeiro acesso pode demorar ~30s
- **750 horas/mês** de runtime (suficiente para projetos pessoais)
- **1GB de disco persistente**
- Não há suporte

### 🔄 Deploy Contínuo

Após configurado, todo push na branch `main` dispara deploy automático!

```bash
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
# Deploy automático iniciado! 🚀
```

---

## Opção 2: Vercel (Frontend) + Railway (Backend)

### Vantagens

- ✅ **Performance excelente** para frontend
- ✅ **Edge Network** do Vercel
- ✅ **Railway** com bom tier gratuito
- ✅ **Deploy rápido**

### Deploy do Frontend no Vercel

#### 1. Instalar Vercel CLI

```bash
npm install -g vercel
```

#### 2. Login

```bash
vercel login
```

#### 3. Deploy

```bash
cd frontend
vercel
```

Siga o wizard:
- **Set up and deploy?** Yes
- **Which scope?** Sua conta
- **Link to existing project?** No
- **Project name?** todo-frontend
- **Directory?** ./
- **Override settings?** Yes
  - **Build Command:** `npm run build`
  - **Output Directory:** `dist`
  - **Install Command:** `npm install`

#### 4. Configurar Variável de Ambiente

```bash
vercel env add VITE_API_URL
# Cole a URL do backend do Railway
```

#### 5. Re-deploy

```bash
vercel --prod
```

### Deploy do Backend no Railway

#### 1. Criar Conta

Acesse [railway.app](https://railway.app) e faça login com GitHub

#### 2. Novo Projeto

1. Clique em **"New Project"**
2. Selecione **"Deploy from GitHub repo"**
3. Escolha seu repositório
4. Railway detectará automaticamente o Node.js

#### 3. Configurar

1. Vá em **"Variables"**
2. Adicione:
   ```
   NODE_ENV=production
   PORT=3001
   JWT_SECRET=seu-secret-super-seguro-aqui
   ```

#### 4. Configurar Build

1. Vá em **"Settings"**
2. **Root Directory:** `backend`
3. **Build Command:** `npm install && npm run build`
4. **Start Command:** `npm start`

#### 5. Deploy

Railway faz deploy automático!

---

## Opção 3: Fly.io

### Vantagens

- ✅ **Edge computing** - servidores em várias regiões
- ✅ **Disco persistente** incluso
- ✅ **CLI poderosa**
- ✅ **Docker nativo**

### Instalação

```bash
# Linux/macOS
curl -L https://fly.io/install.sh | sh

# Windows
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

### Login

```bash
fly auth login
```

### Deploy do Backend

```bash
cd backend

# Inicializar
fly launch

# Configurações:
# - App name: todo-backend-seu-nome
# - Region: escolha a mais próxima
# - Database: No
# - Deploy: Yes

# Configurar secrets
fly secrets set JWT_SECRET=seu-secret-super-seguro
fly secrets set NODE_ENV=production

# Volume persistente para LevelDB
fly volumes create leveldb_data --size 1

# Deploy
fly deploy
```

### Deploy do Frontend

```bash
cd frontend

# Criar fly.toml
cat > fly.toml << EOF
app = "todo-frontend-seu-nome"

[build]
  [build.args]
    VITE_API_URL = "https://todo-backend-seu-nome.fly.dev"

[env]
  PORT = "8080"

[[services]]
  internal_port = 8080
  protocol = "tcp"

  [[services.ports]]
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443
EOF

# Deploy
fly launch --dockerfile Dockerfile
fly deploy
```

### URLs Finais

- Backend: `https://todo-backend-seu-nome.fly.dev`
- Frontend: `https://todo-frontend-seu-nome.fly.dev`

---

## Opção 4: Docker + VPS

### Vantagens

- ✅ **Controle total**
- ✅ **Performance máxima**
- ✅ **Escalável**
- ❌ Requer conhecimento de DevOps

### Pré-requisitos

- VPS (Digital Ocean, Linode, AWS, etc.)
- Docker e Docker Compose instalados
- Domínio próprio (opcional)

### 1. Configurar VPS

```bash
# SSH no servidor
ssh root@seu-servidor-ip

# Instalar Docker
curl -fsSL https://get.docker.com | sh

# Instalar Docker Compose
apt install docker-compose-plugin
```

### 2. Clonar Repositório

```bash
git clone https://github.com/seu-usuario/node-vite-react.git
cd node-vite-react
```

### 3. Configurar Variáveis de Ambiente

```bash
# Criar .env
cat > .env << EOF
JWT_SECRET=$(openssl rand -base64 32)
VITE_API_URL=http://seu-dominio.com:3001
EOF
```

### 4. Build e Deploy

```bash
# Build das imagens
docker-compose build

# Iniciar serviços
docker-compose up -d

# Ver logs
docker-compose logs -f
```

### 5. Configurar Nginx (Opcional)

```bash
# Instalar Nginx
apt install nginx

# Configurar proxy reverso
cat > /etc/nginx/sites-available/todo << EOF
server {
    listen 80;
    server_name seu-dominio.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header Host \$host;
    }
}
EOF

# Ativar site
ln -s /etc/nginx/sites-available/todo /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### 6. SSL com Let's Encrypt

```bash
# Instalar Certbot
apt install certbot python3-certbot-nginx

# Obter certificado
certbot --nginx -d seu-dominio.com

# Renovação automática já configurada!
```

---

## 📊 Comparação de Plataformas

| Plataforma | Custo Mensal | Facilidade | Performance | Persistência | Tempo Setup | Recomendado Para |
|------------|--------------|------------|-------------|--------------|-------------|------------------|
| **Render** | Grátis | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ 1GB | 15 min | **Iniciantes, MVPs** |
| Vercel + Railway | Grátis | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ | 20 min | Produção leve |
| Fly.io | Grátis/$1.94 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ | 25 min | Edge computing |
| VPS + Docker | $5-10 | ⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ Ilimitado | 45 min | Produção pesada |

### Critérios de Escolha

**Escolha Render se:**
- 🎯 É seu primeiro deploy
- 🎯 Quer deploy automático via Git
- 🎯 Não quer configurar infraestrutura
- 🎯 Projeto pessoal/portfólio

**Escolha Vercel + Railway se:**
- 🎯 Precisa de melhor performance frontend
- 🎯 Já usa Vercel para outros projetos
- 🎯 Quer CDN global

**Escolha Fly.io se:**
- 🎯 Precisa de edge computing
- 🎯 Usuários em várias regiões
- 🎯 Gosta de trabalhar com Docker

**Escolha VPS + Docker se:**
- 🎯 Precisa de controle total
- 🎯 Vai escalar muito
- 🎯 Tem conhecimento DevOps
- 🎯 Múltiplos projetos no mesmo servidor

---

## 🔒 Checklist de Segurança

Antes de fazer deploy em produção:

- [ ] Alterar `JWT_SECRET` para um valor forte e único
- [ ] Adicionar `.env` ao `.gitignore` (já feito)
- [ ] Configurar CORS adequadamente
- [ ] Ativar HTTPS/SSL
- [ ] Validar inputs no backend
- [ ] Implementar rate limiting
- [ ] Adicionar logs de auditoria
- [ ] Configurar backups do banco
- [ ] Testar recuperação de desastres
- [ ] Documentar variáveis de ambiente

---

## 🐛 Troubleshooting

### Build Falha no Render

```bash
# Verificar logs no dashboard
# Comum: falta de memória no tier free

# Solução: Otimizar build
npm ci --production
```

### Frontend não conecta no Backend

```bash
# Verificar VITE_API_URL
# Deve ser a URL completa do backend

# Exemplo correto:
VITE_API_URL=https://todo-backend.onrender.com
```

### Banco de Dados Perde Dados

```bash
# No Render, verificar se o disco persistente está configurado
# No Docker, verificar se o volume está montado corretamente

# Render:
disk:
  name: leveldb-data
  mountPath: /opt/render/project/backend/data

# Docker:
volumes:
  - leveldb-data:/app/data
```

### Aplicação Lenta (Render Free)

```bash
# Normal no tier free após 15min de inatividade
# Primeiro request "acorda" o servidor (~30s)

# Soluções:
# 1. Upgrade para paid tier ($7/mês)
# 2. Usar serviço de ping (UptimeRobot)
# 3. Aceitar o cold start
```

---

## 📝 Próximos Passos Após Deploy

1. ✅ Testar todas as funcionalidades
2. ✅ Criar conta de teste
3. ✅ Verificar logs de erro
4. ✅ Configurar domínio customizado (opcional)
5. ✅ Adicionar URL ao README
6. ✅ Compartilhar com amigos/recrutadores
7. ✅ Configurar analytics (opcional)
8. ✅ Implementar CI/CD (já feito via Git)

---

## 🎉 Deploy Completo!

Parabéns! Sua aplicação agora está no ar! 🚀

### Compartilhe

Adicione as URLs ao seu:
- README.md
- LinkedIn
- GitHub Profile
- Portfólio

### Monitore

- Logs de erro
- Performance
- Uptime
- Uso de recursos

### Melhore

- Adicione mais features
- Otimize performance
- Implemente analytics
- Colete feedback

---

## 📚 Recursos Adicionais

- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Fly.io Docs](https://fly.io/docs)
- [Docker Docs](https://docs.docker.com)

---

**Precisa de ajuda?** Abra uma issue no GitHub!

**Contribua:** Pull requests são bem-vindos! 🤝
