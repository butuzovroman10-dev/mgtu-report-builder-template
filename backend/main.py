import os
import shutil
import uuid
from datetime import datetime
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv

# Библиотеки для Word и Графиков
from docx import Document
from docx.shared import Pt, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.oxml.ns import qn
import matplotlib.pyplot as plt

load_dotenv()

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# Инициализация Supabase
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

class ReportRequest(BaseModel):
    repoUrl: str
    fullName: str
    group: str
    workType: str
    workNumber: str
    variant: str
    userId: str
    instruction: str  # Текст задания из методички

def set_font_times_new_roman(run, size=14):
    """Утилита для установки шрифта Times New Roman"""
    run.font.name = 'Times New Roman'
    run._element.rPr.rFonts.set(qn('w:eastAsia'), 'Times New Roman')
    run._element.rPr.rFonts.set(qn('w:hAnsi'), 'Times New Roman')
    run._element.rPr.rFonts.set(qn('w:ascii'), 'Times New Roman')
    run.font.size = Pt(size)

def create_report_docx(data: ReportRequest):
    # Логика именования и выбора преподавателя
    fio_parts = data.fullName.split()
    fio_short = f"{fio_parts[0]}_{fio_parts[1][0]}{fio_parts[2][0]}" if len(fio_parts) >= 3 else "Student"
    
    type_map = {
        "Лабораторная работа": {"short": "лаб", "teacher": "М.И. Колосов", "title": "ОТЧЕТ ПО ЛАБОРАТОРНОЙ РАБОТЕ"},
        "Домашнее задание": {"short": "ДЗ", "teacher": "М.И. Колосов", "title": "ДОМАШНЯЯ РАБОТА"},
        "Семинар": {"short": "Семинар", "teacher": "А.В. Волосова", "title": "ОТЧЕТ ПО СЕМИНАРНОЙ РАБОТЕ"}
    }
    info = type_map.get(data.workType, {"short": "работа", "teacher": "Преподаватель", "title": "ОТЧЕТ"})
    
    filename = f"{fio_short}_{data.group}_{info['short']}_{data.workNumber}_Основы_программирования_2025.docx"
    
    doc = Document()
    
    # Настройка абзаца по умолчанию (1.5 интервал, выравнивание по ширине)
    style = doc.styles['Normal']
    pf = style.paragraph_format
    pf.line_spacing_rule = WD_LINE_SPACING.ONE_POINT_FIVE
    pf.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY

    # --- ТИТУЛЬНЫЙ ЛИСТ ---
    p_header = doc.add_paragraph()
    p_header.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p_header.add_run(
        "Министерство науки и высшего образования Российской Федерации\n"
        "МГТУ им. Н.Э. Баумана\n"
        "ФАКУЛЬТЕТ ИНФОРМАТИКА И СИСТЕМЫ УПРАВЛЕНИЯ\n"
        "КАФЕДРА ИУ5\n\n\n\n"
    )
    set_font_times_new_roman(run, 12)

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_t = p_title.add_run(f"{info['title']} №{data.workNumber}\nВариант {data.variant}")
    run_t.bold = True
    set_font_times_new_roman(run_t, 16)

    for _ in range(6): doc.add_paragraph()

    table = doc.add_table(rows=2, cols=2)
    table.cell(0, 0).text = f"Студент {data.group}"
    table.cell(0, 1).text = data.fullName
    table.cell(1, 0).text = "Преподаватель"
    table.cell(1, 1).text = info['teacher']
    
    for row in table.rows:
        for cell in row.cells:
            for p in cell.paragraphs:
                set_font_times_new_roman(p.runs[0] if p.runs else p.add_run(), 14)

    doc.add_page_break()

    # --- СОДЕРЖАНИЕ НА ОСНОВЕ ИНСТРУКЦИИ ---
    h1 = doc.add_heading('1. Цель и задачи работы', level=1)
    set_font_times_new_roman(h1.add_run(), 16)
    
    doc.add_paragraph(f"В соответствии с заданием: {data.instruction}")

    # Генерация графика
    plt.figure(figsize=(6, 4))
    plt.plot([1, 2, 3], [10, 40, 90], marker='o')
    plt.title('Анализ производительности')
    graph_path = f"temp/plot_{uuid.uuid4()}.png"
    os.makedirs("temp", exist_ok=True)
    plt.savefig(graph_path)
    plt.close()

    doc.add_heading('2. Результаты тестирования', level=1)
    doc.add_picture(graph_path, width=Inches(5))
    cap = doc.add_paragraph("Рисунок 1 — График зависимости времени от входных данных")
    cap.alignment = WD_ALIGN_PARAGRAPH.CENTER

    doc.add_page_break()
    doc.add_heading('3. Заключение', level=1)
    doc.add_paragraph("Работа выполнена в полном объеме. Алгоритмы протестированы и соответствуют заданным критериям точности.")

    local_path = f"temp/{filename}"
    doc.save(local_path)
    return local_path, filename

@app.post("/generate-report")
async def generate(request: ReportRequest):
    try:
        # Генерация файла
        local_path, filename = create_report_docx(request)

        # Загрузка в Supabase Storage (бакет 'reports')
        storage_path = f"{request.userId}/{filename}"
        with open(local_path, "rb") as f:
            supabase.storage.from_("reports").upload(storage_path, f)

        # Получение ссылки
        file_url = supabase.storage.from_("reports").get_public_url(storage_path)

        # Сохранение в БД
        supabase.table("reports").insert({
            "user_id": request.userId,
            "topic": f"{request.workType} №{request.workNumber}",
            "file_url": file_url
        }).execute()

        return {"status": "success", "downloadUrl": file_url}

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Чистим локальные временные файлы
        if 'local_path' in locals() and os.path.exists(local_path):
            os.remove(local_path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)