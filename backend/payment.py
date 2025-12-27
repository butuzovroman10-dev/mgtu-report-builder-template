import os
import uuid
from yookassa import Configuration, Payment
from dotenv import load_dotenv

load_dotenv()

Configuration.configure(os.environ.get("YOOKASSA_SHOP_ID"), os.environ.get("YOOKASSA_SECRET_KEY"))

def create_payment_session(amount: int, description: str, user_id: str):
    """
    Создает платеж и возвращает ссылку на оплату
    """
    idempotence_key = str(uuid.uuid4())
    payment = Payment.create({
        "amount": {
            "value": str(amount),
            "currency": "RUB"
        },
        "confirmation": {
            "type": "redirect",
            "return_url": "http://localhost:5173/dashboard?payment=success"
        },
        "capture": True,
        "description": description,
        "metadata": {
            "user_id": user_id
        }
    }, idempotence_key)

    return payment.confirmation.confirmation_url