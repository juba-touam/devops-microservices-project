from unittest.mock import patch, MagicMock
import sys

# Patch MongoClient before importing the app module (it connects at import time)
mock_mongo_client = MagicMock()
mock_db = MagicMock()
mock_collection = MagicMock()
mock_mongo_client.__getitem__ = MagicMock(return_value=mock_db)
mock_db.__getitem__ = MagicMock(return_value=mock_collection)

with patch("pymongo.MongoClient", return_value=mock_mongo_client):
    # Remove cached module if any
    sys.modules.pop("app.main", None)
    from fastapi.testclient import TestClient
    from app.main import app
    import app.main as app_module

# Ensure the app uses our mock collection
app_module.payments_collection = mock_collection

client = TestClient(app)


class TestHealth:
    def test_health(self):
        resp = client.get("/api/health")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "UP"
        assert data["service"] == "payment"


class TestListPayments:
    def test_list_payments(self):
        mock_collection.find.return_value = [
            {"id": "abc", "amount": 10.0, "currency": "EUR", "status": "completed"}
        ]
        resp = client.get("/api/payments")
        assert resp.status_code == 200
        assert len(resp.json()) == 1


class TestGetPayment:
    def test_found(self):
        mock_collection.find_one.return_value = {
            "id": "abc", "amount": 10.0, "currency": "EUR", "status": "completed"
        }
        resp = client.get("/api/payments/abc")
        assert resp.status_code == 200
        assert resp.json()["id"] == "abc"

    def test_not_found(self):
        mock_collection.find_one.return_value = None
        resp = client.get("/api/payments/unknown")
        assert resp.status_code == 404


class TestCreatePayment:
    @patch("app.main.httpx.Client")
    @patch("app.main.uuid.uuid4", return_value="test-uuid")
    def test_success(self, _mock_uuid, mock_httpx_cls):
        mock_http = MagicMock()
        mock_httpx_cls.return_value.__enter__ = MagicMock(return_value=mock_http)
        mock_httpx_cls.return_value.__exit__ = MagicMock(return_value=False)

        resp = client.post("/api/payments", json={
            "amount": 42.0,
            "currency": "EUR",
            "description": "Test payment"
        })
        assert resp.status_code == 200
        data = resp.json()
        assert data["id"] == "test-uuid"
        assert data["amount"] == 42.0
        assert data["status"] == "completed"
        mock_collection.insert_one.assert_called()
        mock_http.post.assert_called_once()

    @patch("app.main.httpx.Client")
    @patch("app.main.uuid.uuid4", return_value="test-uuid-2")
    def test_notification_failure(self, _mock_uuid, mock_httpx_cls):
        mock_http = MagicMock()
        mock_http.post.side_effect = Exception("connection refused")
        mock_httpx_cls.return_value.__enter__ = MagicMock(return_value=mock_http)
        mock_httpx_cls.return_value.__exit__ = MagicMock(return_value=False)

        resp = client.post("/api/payments", json={
            "amount": 10.0,
            "description": "Will fail notify"
        })
        # Payment still succeeds even if notification fails
        assert resp.status_code == 200
        assert resp.json()["status"] == "completed"

    @patch("app.main.httpx.Client")
    @patch("app.main.uuid.uuid4", return_value="test-uuid-3")
    def test_minimal_payload(self, _mock_uuid, mock_httpx_cls):
        mock_http = MagicMock()
        mock_httpx_cls.return_value.__enter__ = MagicMock(return_value=mock_http)
        mock_httpx_cls.return_value.__exit__ = MagicMock(return_value=False)

        resp = client.post("/api/payments", json={"amount": 5.0})
        assert resp.status_code == 200
        data = resp.json()
        assert data["currency"] == "EUR"  # default
        assert data["description"] is None
        assert data["items"] is None

    @patch("app.main.httpx.Client")
    @patch("app.main.uuid.uuid4", return_value="test-uuid-4")
    def test_with_items(self, _mock_uuid, mock_httpx_cls):
        mock_http = MagicMock()
        mock_httpx_cls.return_value.__enter__ = MagicMock(return_value=mock_http)
        mock_httpx_cls.return_value.__exit__ = MagicMock(return_value=False)

        resp = client.post("/api/payments", json={
            "amount": 100.0,
            "items": [{"id": 1, "name": "Laptop", "price": 100.0, "quantity": 1}]
        })
        assert resp.status_code == 200
        data = resp.json()
        assert len(data["items"]) == 1
        assert data["items"][0]["name"] == "Laptop"
