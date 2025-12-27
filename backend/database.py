from supabase import create_client
import os

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

def save_report_to_db(user_id, report_data):
    # report_data содержит тему, цель, задачи и данные для титульника
    res = supabase.table("reports").insert({
        "user_id": user_id,
        "content": report_data,
        "status": "completed"
    }).execute()
    return res.data