import os
from fastapi import HTTPException, Security, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from supabase import create_client, Client
from dotenv import load_dotenv

# 1. Загружаем переменные из файла .env
load_dotenv()

# 2. Извлекаем ключи
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_ANON_KEY")

# 3. Проверка: если ключи не найдены, сервер сразу скажет об этом в консоли
if not url or not key:
    print("\n" + "="*50)
    print("ОШИБКА: Переменные окружения не найдены!")
    print(f"Текущая рабочая директория: {os.getcwd()}")
    print(f"Файл .env существует: {os.path.exists('.env')}")
    print("="*50 + "\n")
    raise ValueError("supabase_url и supabase_key обязательны. Проверьте файл backend/.env")

# 4. Инициализация клиента Supabase
try:
    supabase: Client = create_client(url, key)
except Exception as e:
    print(f"Ошибка при подключении к Supabase: {e}")
    raise

# 5. Настройка схемы авторизации через Bearer токен
security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Эта функция проверяет JWT токен, который приходит с фронтенда.
    """
    token = credentials.credentials
    try:
        # Просим Supabase проверить токен и вернуть пользователя
        user_response = supabase.auth.get_user(token)
        
        # В новых версиях библиотеки объект пользователя лежит в атрибуте user
        if not user_response or not user_response.user:
            raise HTTPException(status_code=401, detail="Невалидный токен или сессия истекла")
            
        return user_response.user # Возвращаем объект пользователя (там есть id)
        
    except Exception as e:
        print(f"Ошибка авторизации: {str(e)}")
        raise HTTPException(
            status_code=401, 
            detail="Ошибка проверки доступа. Пожалуйста, войдите в систему снова."
        )