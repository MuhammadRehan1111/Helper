import os
import json
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv(override=True)

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

payload = {
    "prompt": "Test Gemini API",
    "workers": []
}

response = client.post("/api/ai/orchestrate", json=payload)
print("Status:", response.status_code)
print("Response:", response.text)
