import openai
import os
import json

def get_report_content(repo_files_text, work_type, work_num):
    """
    repo_files_text: Весь код/текст из файлов репозитория
    work_type: Лаба или Семинар
    work_num: Номер работы
    """
    client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    prompt = f"""
    Ты — ассистент кафедры ИУ5. Проанализируй код лабораторной работы №{work_num} ({work_type}) и составь:
    1. Точную тему работы.
    2. Цель работы (что изучалось).
    3. Список из 3-4 задач, которые были решены в коде.
    4. Глубокий технический вывод по результатам работы.

    Данные репозитория:
    {repo_files_text[:4000]} 

    Ответь ТОЛЬКО в формате JSON:
    {{
      "topic": "...",
      "goal": "...",
      "tasks": ["задача 1", "задача 2", "задача 3"],
      "summary": "..."
    }}
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "system", "content": "Ты эксперт по техническим отчетам."},
                  {"role": "user", "content": prompt}]
    )
    
    # Парсим JSON из ответа
    return json.loads(response.choices[0].message.content)