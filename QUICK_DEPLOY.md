# 🚀 Guia Rápido de Deploy no Render

## Passo 1: Push para GitHub

Já feito! ✅ O código está commitado localmente.

Agora faça push:

```bash
git push origin main
```

## Passo 2: Criar Conta no Render

1. Acesse [render.com](https://render.com)
2. Clique em **"Get Started"** 
3. Faça signup com GitHub
4. Autorize o Render a acessar seus repositórios

## Passo 3: Deploy via Blueprint

1. No dashboard do Render, clique em **"New +"**
2. Selecione **"Blueprint"**
3. Conecte seu repositório `node-vite-react`
4. O Render detectará automaticamente o `render.yaml`
5. Clique em **"Apply"**

## Passo 4: Aguardar Deploy

⏱️ Tempo estimado: 10-15 minutos

- Backend: ~5-7 minutos
- Frontend: ~3-5 minutos

Você pode acompanhar o progresso em tempo real nos logs.

## Passo 5: Configurar URL do Backend no Frontend

Após o backend terminar o deploy:

1. Copie a URL do backend (algo como `https://todo-backend-xxxx.onrender.com`)
2. Vá em `todo-frontend` → **"Environment"**
3. Edite a variável `VITE_API_URL` com a URL do backend
4. Clique em **"Save Changes"**
5. O frontend será re-deployado automaticamente (~3 minutos)

## Passo 6: Testar a Aplicação

URLs finais (exemplo):
- Frontend: `https://todo-frontend-xxxx.onrender.com`
- Backend: `https://todo-backend-xxxx.onrender.com`

Teste:
1. ✅ Acesse o frontend
2. ✅ Crie uma conta
3. ✅ Faça login
4. ✅ Crie uma tarefa
5. ✅ Teste filtros e busca
6. ✅ Faça logout e login novamente

## 🎉 Pronto!

Sua aplicação está no ar! 🚀

---

## ⚠️ Observações Importantes

### Tier Gratuito do Render

- **Sleep após 15 minutos** de inatividade
  - Primeiro acesso pode demorar 30-50 segundos
  - Isso é normal e esperado
  
- **750 horas/mês** de runtime
  - Suficiente para projetos pessoais
  
- **1GB de disco persistente**
  - Seus dados do LevelDB ficam salvos

### Deploy Automático

Após configurado, todo push no GitHub dispara deploy automático:

```bash
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
# Deploy iniciado automaticamente! 🚀
```

### Variáveis de Ambiente

Configuradas automaticamente pelo `render.yaml`:

**Backend:**
- `NODE_ENV`: production
- `PORT`: 3001
- `JWT_SECRET`: gerado automaticamente (seguro)

**Frontend:**
- `VITE_API_URL`: você precisa atualizar manualmente (Passo 5)

---

## 📝 Checklist Final

- [ ] Push para GitHub
- [ ] Criar conta no Render
- [ ] Deploy via Blueprint
- [ ] Aguardar backend terminar
- [ ] Atualizar VITE_API_URL no frontend
- [ ] Aguardar frontend re-deploy
- [ ] Testar todas as funcionalidades
- [ ] Adicionar URLs no README (opcional)
- [ ] Compartilhar no LinkedIn/portfólio (opcional)

---

## 🆘 Ajuda

Problemas? Consulte:
- [DEPLOYMENT.md](DEPLOYMENT.md) - Guia completo com todas as opções
- [Render Docs](https://render.com/docs) - Documentação oficial
- Logs no dashboard do Render

---

**Boa sorte com seu deploy! 🎉**
