import pytest
import mongomock
from unittest.mock import patch
from fastapi.testclient import TestClient


@pytest.fixture(autouse=True)
def mock_mongo():
    """Replace MongoClient with mongomock for all tests."""
    with patch("app.main.MongoClient", mongomock.MongoClient):
        from app import main

        # Reset the module-level db objects to use mongomock
        main.mongo_client = mongomock.MongoClient()
        main.db = main.mongo_client["payment_db"]
        main.payments_collection = main.db["payments"]
        main.payments_collection.drop()
        yield main


@pytest.fixture
def client(mock_mongo):
    return TestClient(mock_mongo.app)


class TestCreateAndPersist:
    @patch("app.main.httpx.Client")
    def test_create_payment_persisted_in_db(self, mock_httpx, client, mock_mongo):
        mock_httpx.return_value.__enter__ = lambda s: s
        mock_httpx.return_value.__exit__ = lambda s, *a: None
        mock_httpx.return_value.post = lambda *a, **kw: None

        response = client.post("/api/payments", json={"amount": 49.99, "currency": "EUR"})
        assert response.status_code == 200

        data = response.json()
        assert data["amount"] == 49.99
        assert data["currency"] == "EUR"
        assert data["status"] == "completed"

        # Verify persisted in DB
        db_payment = mock_mongo.payments_collection.find_one({"id": data["id"]}, {"_id": 0})
        assert db_payment is not None
        assert db_payment["amount"] == 49.99

    @patch("app.main.httpx.Client")
    def test_create_then_get_by_id(self, mock_httpx, client, mock_mongo):
        mock_httpx.return_value.__enter__ = lambda s: s
        mock_httpx.return_value.__exit__ = lambda s, *a: None
        mock_httpx.return_value.post = lambda *a, **kw: None

        create_resp = client.post("/api/payments", json={"amount": 75.00, "currency": "USD"})
        payment_id = create_resp.json()["id"]

        get_resp = client.get(f"/api/payments/{payment_id}")
        assert get_resp.status_code == 200
        assert get_resp.json()["amount"] == 75.00
        assert get_resp.json()["currency"] == "USD"

    @patch("app.main.httpx.Client")
    def test_create_two_then_list_all(self, mock_httpx, client, mock_mongo):
        mock_httpx.return_value.__enter__ = lambda s: s
        mock_httpx.return_value.__exit__ = lambda s, *a: None
        mock_httpx.return_value.post = lambda *a, **kw: None

        client.post("/api/payments", json={"amount": 10.00})
        client.post("/api/payments", json={"amount": 20.00})

        resp = client.get("/api/payments")
        assert resp.status_code == 200
        payments = resp.json()
        assert len(payments) == 2
        amounts = [p["amount"] for p in payments]
        assert 10.00 in amounts
        assert 20.00 in amounts


class TestGetPaymentNotFound:
    def test_get_nonexistent_payment_returns_404(self, client):
        resp = client.get("/api/payments/nonexistent-id")
        assert resp.status_code == 404
        assert resp.json()["detail"] == "Payment not found"


class TestCreatePaymentWithItems:
    @patch("app.main.httpx.Client")
    def test_create_payment_with_items_persisted(self, mock_httpx, client, mock_mongo):
        mock_httpx.return_value.__enter__ = lambda s: s
        mock_httpx.return_value.__exit__ = lambda s, *a: None
        mock_httpx.return_value.post = lambda *a, **kw: None

        payload = {
            "amount": 1699.98,
            "currency": "EUR",
            "description": "Order with items",
            "items": [
                {"id": 1, "name": "Laptop", "price": 999.99, "quantity": 1},
                {"id": 2, "name": "Phone", "price": 699.99, "quantity": 1},
            ],
        }
        resp = client.post("/api/payments", json=payload)
        assert resp.status_code == 200

        data = resp.json()
        assert len(data["items"]) == 2
        assert data["items"][0]["name"] == "Laptop"

        # Verify items persisted in DB
        db_payment = mock_mongo.payments_collection.find_one({"id": data["id"]}, {"_id": 0})
        assert len(db_payment["items"]) == 2
        assert db_payment["description"] == "Order with items"
