import os
import uuid
import logging
import subprocess
import shutil
import imgkit
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv

# Работа с Word
from docx import Document
from docx.shared import Pt, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.oxml.ns import qn

# Загрузка настроек
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Инициализация Supabase
url = os.getenv("VITE_SUPABASE_URL")
key = os.getenv("VITE_SUPABASE_ANON_KEY")
supabase: Client = create_client(url, key)

class ReportRequest(BaseModel):
    repoUrl: str
    fullName: str
    group: str
    workType: str
    workNumber: str
    variant: str
    userId: str
    instruction: str

def set_font_times(run, size=14, bold=False):
    """Шрифт Times New Roman по ГОСТ"""
    run.font.name = 'Times New Roman'
    run._element.rPr.rFonts.set(qn('w:ascii'), 'Times New Roman')
    run._element.rPr.rFonts.set(qn('w:hAnsi'), 'Times New Roman')
    run.font.size = Pt(size)
    run.bold = bold

def parse_instruction(text):
    """Разбор текста на Тему, Цель и Задачи"""
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    theme = lines[0] if lines else "Без темы"
    
    goal = "Цель работы не указана"
    tasks = text
    
    for line in lines:
        if line.lower().startswith("цель:"):
            goal = line.replace("Цель:", "").replace("цель:", "").strip()
        if line.lower().startswith("задача:") or line.lower().startswith("задачи:"):
            tasks = line
            
    return theme, goal, tasks

def process_github_content(repo_url, temp_dir):
    """Клонирование и поиск визуализаций"""
    images = []
    try:
        subprocess.run(["git", "clone", repo_url, temp_dir], check=True, capture_output=True)
        
        for root, dirs, files in os.walk(temp_dir):
            if 'venv' in root or '.git' in root: continue
            for file in files:
                full_path = os.path.join(root, file)
                # Если нашли картинку
                if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                    images.append(full_path)
                # Если нашли HTML график (Plotly и др.)
                elif file.lower().endswith('.html'):
                    try:
                        img_path = full_path.replace('.html', '_snap.png')
                        imgkit.from_file(full_path, img_path, options={'quiet': ''})
                        images.append(img_path)
                    except Exception as e:
                        logger.warning(f"Could not convert HTML {file}: {e}")
    except Exception as e:
        logger.error(f"GitHub Error: {e}")
    return images

def generate_docx_report(data: ReportRequest):
    theme, goal, tasks = parse_instruction(data.instruction)
    repo_dir = f"temp/repo_{uuid.uuid4().hex}"
    images = process_github_content(data.repoUrl, repo_dir)
    
    doc = Document()
    
    # Поля ГОСТ
    section = doc.sections[0]
    section.left_margin, section.right_margin = Inches(1.18), Inches(0.39)

    # --- ТИТУЛЬНЫЙ ЛИСТ (Бауманка) ---
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    header = (
        "Министерство науки и высшего образования Российской Федерации\n"
        "Федеральное государственное автономное образовательное учреждение\n"
        "высшего образования\n"
        "«Московский государственный технический университет\n"
        "имени Н.Э. Баумана\n"
        "(национальный исследовательский университет)»\n"
        "(МГТУ им. Н.Э. Баумана)\n"
    )
    set_font_times(p.add_run(header), 10)

    p_fac = doc.add_paragraph()
    p_fac.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_fac = p_fac.add_run("\nФАКУЛЬТЕТ ИНФОРМАТИКА И СИСТЕМЫ УПРАВЛЕНИЯ\n"
                            "КАФЕДРА СИСТЕМЫ ОБРАБОТКИ ИНФОРМАЦИИ И УПРАВЛЕНИЯ\n")
    set_font_times(run_fac, 12, bold=True)

    for _ in range(4): doc.add_paragraph()
    
    p_work = doc.add_paragraph()
    p_work.alignment = WD_ALIGN_PARAGRAPH.CENTER
    set_font_times(p_work.add_run(f"{data.workType.upper()} №{data.workNumber}\nНА ТЕМУ:"), 16)
    
    p_theme = doc.add_paragraph()
    p_theme.alignment = WD_ALIGN_PARAGRAPH.CENTER
    set_font_times(p_theme.add_run(f"«{theme}»"), 14, bold=True)

    for _ in range(5): doc.add_paragraph()
    
    # Таблица подписей
    table = doc.add_table(rows=2, cols=3)
    table.columns[0].width = Inches(2.0)
    table.rows[0].cells[0].text = f"Студент {data.group}"
    table.rows[0].cells[2].text = data.fullName
    table.rows[1].cells[0].text = "Руководитель"
    table.rows[1].cells[2].text = "М.И. Колосов"
    
    for row in table.rows:
        for cell in row.cells:
            for para in cell.paragraphs:
                if para.runs: set_font_times(para.runs[0], 12)

    doc.add_page_break()

    # --- ОСНОВНАЯ ЧАСТЬ ---
    doc.add_heading('1. ЦЕЛЬ И ЗАДАЧИ РАБОТЫ', level=1)
    p_goal = doc.add_paragraph()
    set_font_times(p_goal.add_run(f"Цель работы: {goal}"), 14)
    
    doc.add_heading('2. ФОРМУЛИРОВКА ЗАДАНИЯ', level=1)
    p_tasks = doc.add_paragraph()
    p_tasks.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_tasks.paragraph_format.first_line_indent = Inches(0.5)
    set_font_times(p_tasks.add_run(tasks), 14)

    # --- ГРАФИКА ---
    doc.add_heading('3. РЕЗУЛЬТАТЫ ВЫПОЛНЕНИЯ (ИЗ РЕПОЗИТОРИЯ)', level=1)
    if images:
        for idx, img_path in enumerate(images[:5]): # Ограничим до 5 картинок
            try:
                doc.add_picture(img_path, width=Inches(5))
                cap = doc.add_paragraph(f"Рисунок {idx+1} — Графический результат ({os.path.basename(img_path)})")
                cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
                set_font_times(cap.runs[0], 12)
            except: continue
    else:
        doc.add_paragraph("В репозитории не обнаружено графических файлов (.png, .jpg) или .html графиков.")

    # Сохранение
    local_path = f"temp/Report_{uuid.uuid4().hex[:6]}.docx"
    doc.save(local_path)
    shutil.rmtree(repo_dir, ignore_errors=True)
    return local_path

@app.post("/generate-report")
async def generate(request: ReportRequest):
    try:
        local_path = generate_docx_report(request)
        storage_path = f"{request.userId}/{os.path.basename(local_path)}"
        
        with open(local_path, "rb") as f:
            supabase.storage.from_("reports").upload(storage_path, f)

        file_url = supabase.storage.from_("reports").get_public_url(storage_path)
        supabase.table("reports").insert({
            "user_id": request.userId, "topic": request.workType, 
            "file_url": file_url, "github_url": request.repoUrl
        }).execute()

        return {"status": "success", "downloadUrl": file_url}
    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if 'local_path' in locals() and os.path.exists(local_path):
            os.remove(local_path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)