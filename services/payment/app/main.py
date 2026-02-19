from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import uuid
import httpx
import os
from pymongo import MongoClient

NOTIFICATION_URL = os.getenv("NOTIFICATION_URL", "http://notification:3001")
MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongo:27017")

app = FastAPI(title="Payment Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

mongo_client = MongoClient(MONGO_URI)
db = mongo_client["payment_db"]
payments_collection = db["payments"]


class CartItem(BaseModel):
    id: int
    name: str
    price: float
    quantity: int


class PaymentRequest(BaseModel):
    amount: float
    currency: str = "EUR"
    description: Optional[str] = None
    items: Optional[List[CartItem]] = None


class PaymentResponse(BaseModel):
    id: str
    amount: float
    currency: str
    status: str
    description: Optional[str] = None
    items: Optional[List[CartItem]] = None


@app.get("/api/health")
def health():
    return {"status": "UP", "service": "payment"}


@app.get("/api/payments")
def list_payments():
    payments = list(payments_collection.find({}, {"_id": 0}))
    return payments


@app.get("/api/payments/{payment_id}")
def get_payment(payment_id: str):
    payment = payments_collection.find_one({"id": payment_id}, {"_id": 0})
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment


@app.post("/api/payments", response_model=PaymentResponse)
def create_payment(payment: PaymentRequest):
    new_payment = {
        "id": str(uuid.uuid4()),
        "amount": payment.amount,
        "currency": payment.currency,
        "status": "completed",
        "description": payment.description,
        "items": [item.model_dump() for item in payment.items] if payment.items else None,
    }
    payments_collection.insert_one(new_payment)

    notification_payload = {k: v for k, v in new_payment.items() if k != "_id"}

    try:
        with httpx.Client(timeout=5.0) as client:
            client.post(
                f"{NOTIFICATION_URL}/api/notifications",
                json=notification_payload,
            )
    except Exception as e:
        print(f"[WARN] Failed to notify: {e}")

    return notification_payload
