import os
import json
import google.generativeai as genai
from backend.models.schemas import OrchestrateRequest, OrchestrateResponse
from backend.core.db import add_booking

def process_orchestration(request: OrchestrateRequest) -> dict:
    # Ensure API Key is available
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not set")

    genai.configure(api_key=api_key)
    
    workers_data = [w.dict() for w in request.workers]
    
    system_prompt = f"""
    You are an Autonomous AI Service Orchestrator for the "Helper" platform.
    
    USER INPUT: "{request.prompt}"
    
    AVAILABLE WORKERS: {json.dumps(workers_data)}
    
    YOUR ORCHESTRATION PIPELINE:
    1. Intent Understanding Agent: Analyze semantics. Extract service type, location, time, and urgency.
    2. Discovery Agent: Filter workers matching the requested service.
    3. Ranking Agent: Calculate a score (0-100) for each worker.
    4. Decision Agent: Select the top matches. *AUTONOMOUS ACTION*: If the urgency is "high" or the user explicitly asks to book/send someone immediately, your Decision Agent must autonomously decide to "book" the top worker immediately.
    
    RULES:
    - If "emergency", "now", "urgent", or "leaking" is mentioned, set urgency high and trigger an autonomous booking action in the logs.
    - Provide transparent reasoning for the score.
    - agentLogs should show this multi-step reasoning:
      - Intent Understanding
      - Provider Discovery
      - Helper IQ Ranking
      - Decision Engine (including "Booking created automatically due to high urgency" if applicable)
    
    Return JSON format only matching this schema exactly:
    {{
      "intent": {{"service": "...", "location": "...", "time": "...", "urgency": "low/medium/high", "budget": "..."}},
      "topMatches": [{{"workerId": "...", "score": 95, "reasoning": "..."}}],
      "rankingLogic": "...",
      "agentLogs": [{{"agentName": "...", "action": "...", "reasoning": "...", "type": "info/success/warning/error"}}],
      "autonomousBookingTriggered": true/false
    }}
    """
    
    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(
        system_prompt,
        generation_config=genai.types.GenerationConfig(
            response_mime_type="application/json"
        )
    )
    
    result_text = response.text
    if not result_text:
        raise ValueError("Failed to generate content")
        
    data = json.loads(result_text)
    
    # Simulate System State Change if Autonomous Booking was triggered
    if data.get("autonomousBookingTriggered") and data.get("topMatches"):
        top_worker_id = data["topMatches"][0]["workerId"]
        add_booking({
            "workerId": top_worker_id,
            "status": "provider_assigned",
            "trigger": "autonomous_agent"
        })
        # Inject an extra log to confirm system state change
        if "agentLogs" not in data: data["agentLogs"] = []
        data["agentLogs"].append({
            "agentName": "System State Controller",
            "action": "State Mutated",
            "reasoning": f"Booking inserted into Database for worker {{top_worker_id}}.",
            "type": "success"
        })
        
    return data

