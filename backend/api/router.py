from fastapi import APIRouter, HTTPException
from backend.models.schemas import OrchestrateRequest, OrchestrateResponse
from backend.services.agent import process_orchestration
from backend.core.db import get_bookings

api_router = APIRouter()

@api_router.post("/ai/orchestrate", response_model=OrchestrateResponse)
async def orchestrate_agent(request: OrchestrateRequest):
    try:
        result = process_orchestration(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/state/bookings")
async def fetch_bookings():
    return {"bookings": get_bookings()}
