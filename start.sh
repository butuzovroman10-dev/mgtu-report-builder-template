#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}>>> Инициализация запуска проекта...${NC}"

# 1. Очистка портов
fuser -k 8000/tcp 2>/dev/null
fuser -k 5173/tcp 2>/dev/null
sleep 1

# 2. Поиск виртуального окружения
cd backend
if [ -d ".venv" ]; then
    VENV_DIR=".venv"
elif [ -d "venv" ]; then
    VENV_DIR="venv"
else
    echo -e "${RED}>>> Ошибка: Папка виртуального окружения (.venv или venv) не найдена!${NC}"
    exit 1
fi

# 3. Запуск Backend
echo -e "${GREEN}>>> Запуск Backend из папки $VENV_DIR...${NC}"
./$VENV_DIR/bin/python main.py > backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Проверка запуска
sleep 2
if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}>>> Backend запущен (PID: $BACKEND_PID)${NC}"
else
    echo -e "${RED}>>> Backend упал. Ошибка из backend/backend.log:${NC}"
    cat backend/backend.log
    exit 1
fi

# 4. Запуск Frontend
echo -e "${GREEN}>>> Запуск Frontend...${NC}"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo -e '\n${RED}>>> Серверы остановлены${NC}'; exit" SIGINT

echo -e "${BLUE}>>> Всё работает! Нажми Ctrl+C для выхода.${NC}"
wait