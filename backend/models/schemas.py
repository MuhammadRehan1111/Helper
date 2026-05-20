from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class WorkerSchema(BaseModel):
    id: str
    name: str
    category: str
    rating: float
    hourlyRate: float
    available: bool = True
    distance: float = 0.0
    reviewsCount: int = 0
    avatar: str = ""

class OrchestrateRequest(BaseModel):
    prompt: str
    workers: List[WorkerSchema]

class IntentSchema(BaseModel):
    service: str
    location: str
    time: str
    urgency: str
    budget: str = ""

class MatchSchema(BaseModel):
    workerId: str
    score: float
    reasoning: str

class AgentLogSchema(BaseModel):
    agentName: str
    action: str
    reasoning: str
    type: str

class OrchestrateResponse(BaseModel):
    intent: IntentSchema
    topMatches: List[MatchSchema]
    rankingLogic: str
    agentLogs: List[AgentLogSchema]
