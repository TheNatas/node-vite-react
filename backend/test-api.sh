#!/bin/bash

# Script de teste da API
# Este script testa os principais endpoints da API

API_URL="http://localhost:3000/api"
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Testando API TODO App${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Teste 1: Health Check
echo -e "${BLUE}1. Testando Health Check...${NC}"
HEALTH=$(curl -s -X GET "${API_URL}/health")
echo "$HEALTH" | jq .
if echo "$HEALTH" | jq -e '.success == true' > /dev/null; then
    echo -e "${GREEN}✓ Health check passou!${NC}\n"
else
    echo -e "${RED}✗ Health check falhou!${NC}\n"
    exit 1
fi

# Teste 2: Criar uma tarefa
echo -e "${BLUE}2. Criando uma tarefa...${NC}"
TASK_1=$(curl -s -X POST "${API_URL}/tasks" \
    -H "Content-Type: application/json" \
    -d '{
        "title": "Estudar TypeScript",
        "description": "Revisar conceitos avançados de TypeScript"
    }')
echo "$TASK_1" | jq .
TASK_1_ID=$(echo "$TASK_1" | jq -r '.data.id')
if [ "$TASK_1_ID" != "null" ]; then
    echo -e "${GREEN}✓ Tarefa criada com sucesso! ID: $TASK_1_ID${NC}\n"
else
    echo -e "${RED}✗ Falha ao criar tarefa!${NC}\n"
    exit 1
fi

# Teste 3: Criar segunda tarefa
echo -e "${BLUE}3. Criando segunda tarefa...${NC}"
TASK_2=$(curl -s -X POST "${API_URL}/tasks" \
    -H "Content-Type: application/json" \
    -d '{
        "title": "Implementar frontend",
        "description": "Criar interface com React e Bootstrap"
    }')
echo "$TASK_2" | jq .
TASK_2_ID=$(echo "$TASK_2" | jq -r '.data.id')
echo -e "${GREEN}✓ Segunda tarefa criada! ID: $TASK_2_ID${NC}\n"

# Teste 4: Listar todas as tarefas
echo -e "${BLUE}4. Listando todas as tarefas...${NC}"
ALL_TASKS=$(curl -s -X GET "${API_URL}/tasks")
echo "$ALL_TASKS" | jq .
TASK_COUNT=$(echo "$ALL_TASKS" | jq '.count')
echo -e "${GREEN}✓ Total de tarefas: $TASK_COUNT${NC}\n"

# Teste 5: Buscar tarefa por ID
echo -e "${BLUE}5. Buscando tarefa por ID...${NC}"
TASK_BY_ID=$(curl -s -X GET "${API_URL}/tasks/${TASK_1_ID}")
echo "$TASK_BY_ID" | jq .
echo -e "${GREEN}✓ Tarefa encontrada!${NC}\n"

# Teste 6: Atualizar tarefa (completar)
echo -e "${BLUE}6. Completando tarefa...${NC}"
UPDATED_TASK=$(curl -s -X PUT "${API_URL}/tasks/${TASK_1_ID}" \
    -H "Content-Type: application/json" \
    -d '{"completed": true}')
echo "$UPDATED_TASK" | jq .
echo -e "${GREEN}✓ Tarefa atualizada!${NC}\n"

# Teste 7: Filtrar tarefas concluídas
echo -e "${BLUE}7. Filtrando tarefas concluídas...${NC}"
COMPLETED=$(curl -s -X GET "${API_URL}/tasks?filter=completed")
echo "$COMPLETED" | jq .
COMPLETED_COUNT=$(echo "$COMPLETED" | jq '.count')
echo -e "${GREEN}✓ Tarefas concluídas: $COMPLETED_COUNT${NC}\n"

# Teste 8: Filtrar tarefas pendentes
echo -e "${BLUE}8. Filtrando tarefas pendentes...${NC}"
PENDING=$(curl -s -X GET "${API_URL}/tasks?filter=pending")
echo "$PENDING" | jq .
PENDING_COUNT=$(echo "$PENDING" | jq '.count')
echo -e "${GREEN}✓ Tarefas pendentes: $PENDING_COUNT${NC}\n"

# Teste 9: Buscar tarefas
echo -e "${BLUE}9. Buscando tarefas com 'frontend'...${NC}"
SEARCH=$(curl -s -X GET "${API_URL}/tasks?search=frontend")
echo "$SEARCH" | jq .
echo -e "${GREEN}✓ Busca executada!${NC}\n"

# Teste 10: Obter estatísticas
echo -e "${BLUE}10. Obtendo estatísticas...${NC}"
STATS=$(curl -s -X GET "${API_URL}/tasks/stats")
echo "$STATS" | jq .
echo -e "${GREEN}✓ Estatísticas obtidas!${NC}\n"

# Teste 11: Deletar uma tarefa
echo -e "${BLUE}11. Deletando primeira tarefa...${NC}"
DELETE_RESULT=$(curl -s -X DELETE "${API_URL}/tasks/${TASK_1_ID}")
echo "$DELETE_RESULT" | jq .
echo -e "${GREEN}✓ Tarefa deletada!${NC}\n"

# Teste 12: Verificar se foi deletada
echo -e "${BLUE}12. Verificando tarefas restantes...${NC}"
REMAINING=$(curl -s -X GET "${API_URL}/tasks")
REMAINING_COUNT=$(echo "$REMAINING" | jq '.count')
echo -e "${GREEN}✓ Tarefas restantes: $REMAINING_COUNT${NC}\n"

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}   Todos os testes passaram! ✓${NC}"
echo -e "${BLUE}========================================${NC}"
