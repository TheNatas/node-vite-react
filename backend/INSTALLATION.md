# Guia de Instalação e Execução - Backend

## Pré-requisitos

- Node.js 22 ou superior
- npm (vem com Node.js)
- jq (opcional, para o script de teste)

## Passo a Passo

### 1. Instalar dependências

```bash
cd backend
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

O arquivo `.env` já vem configurado com valores padrão:
- `PORT=3000`
- `NODE_ENV=development`
- `DB_PATH=./data/leveldb`

### 3. Executar o servidor

#### Modo desenvolvimento (com hot reload)
```bash
npm run dev
```

#### Modo produção
```bash
npm run build
npm start
```

O servidor estará disponível em: `http://localhost:3000`

### 4. Verificar se está funcionando

Abra o navegador e acesse:
- `http://localhost:3000` - Página inicial da API
- `http://localhost:3000/api/health` - Health check

Ou use curl:
```bash
curl http://localhost:3000/api/health
```

Resposta esperada:
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2025-11-04T17:30:00.000Z"
}
```

### 5. Executar testes

```bash
npm test
```

Isso irá executar todos os testes unitários e de integração, e gerar um relatório de cobertura.

### 6. Testar a API manualmente (opcional)

Se você tiver `jq` instalado, pode executar o script de teste:

```bash
./test-api.sh
```

Este script testa todos os endpoints da API automaticamente.

## Estrutura de Diretórios Criados

Após executar o servidor pela primeira vez, os seguintes diretórios serão criados:

- `data/leveldb/` - Banco de dados LevelDB
- `dist/` - Código compilado (ao executar `npm run build`)
- `coverage/` - Relatório de cobertura de testes (ao executar `npm test`)

## Comandos Úteis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor em modo desenvolvimento |
| `npm run build` | Compila o código TypeScript |
| `npm start` | Inicia servidor em modo produção |
| `npm test` | Executa todos os testes |
| `npm run test:watch` | Executa testes em modo watch |
| `npm run lint` | Verifica erros de linting |
| `npm run format` | Formata o código |

## Troubleshooting

### Porta 3000 já está em uso

Se você receber um erro dizendo que a porta já está em uso:

1. Altere a porta no arquivo `.env`:
```env
PORT=3001
```

2. Ou mate o processo que está usando a porta:
```bash
# No Linux/Mac
lsof -ti:3000 | xargs kill -9

# No Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Erro de permissão no diretório data

Se você receber erro de permissão ao criar o diretório do banco de dados:

```bash
sudo chown -R $USER:$USER data/
```

### Testes falhando

Se os testes estiverem falhando:

1. Certifique-se de que não há nenhum servidor rodando na porta 3000
2. Limpe o diretório de teste:
```bash
rm -rf data/test-leveldb
```
3. Execute os testes novamente:
```bash
npm test
```

## Próximos Passos

Com o backend rodando com sucesso, você pode:

1. Testar os endpoints usando ferramentas como:
   - Postman
   - Insomnia
   - cURL
   - Thunder Client (extensão VS Code)

2. Ver a documentação completa da API no [README.md](README.md)

3. Começar a desenvolver o frontend que irá consumir esta API
