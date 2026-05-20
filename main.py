from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai
import os, json, random, string
from datetime import datetime, timedelta
import uvicorn

app = FastAPI(title="Helper AI Backend")
app.add_middleware(CORSMiddleware, allow_origins=["*"], 
                   allow_methods=["*"], allow_headers=["*"])

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

bookings_db = {}

SYSTEM_PROMPT = """
You are an AI Service Orchestrator for Helper app in Pakistan.
Accept Urdu, Roman Urdu, or English input.
Run 5-agent pipeline: Intent → Discovery → Ranking → Decision → Trace.
Score formula: (rating/5×40) + (1/(distance+0.1)×30) + (availability×20) + (jobs/500×10)
Return ONLY valid JSON. No markdown. No extra text.
Always return agentLogs showing each agent's reasoning step.
If service unclear, best-guess from available workers.
urgency values: low | medium | high
log type values: info | success | warning | error
"""

class WorkerIn(BaseModel):
    id: str
    name: str
    category: str
    rating: float
    hourlyRate: float
    available: bool
    distance: float
    completedJobs: Optional[int] = 0

class OrchestrateReq(BaseModel):
    prompt: str
    workers: List[WorkerIn]

class BookingReq(BaseModel):
    workerId: str
    userId: str
    title: str
    date: str
    time: str
    address: str
    category: str
    price: float
    paymentMethod: Optional[str] = "Cash After Service"

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "Helper AI Backend"}

@app.post("/api/ai/orchestrate")
async def orchestrate(req: OrchestrateReq):
    if not GEMINI_API_KEY:
        raise HTTPException(500, "GEMINI_API_KEY not configured")
    try:
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            system_instruction=SYSTEM_PROMPT,
            generation_config={"response_mime_type": "application/json"}
        )
        workers_data = [w.dict() for w in req.workers]
        full_prompt = f"""
USER REQUEST: "{req.prompt}"
AVAILABLE WORKERS: {json.dumps(workers_data)}

Return JSON with:
{{
  "intent": {{ "service": "", "location": "", "time": "", "urgency": "", "budget": "" }},
  "topMatches": [{{ "workerId": "", "score": 0, "reasoning": "" }}],
  "rankingLogic": "",
  "agentLogs": [{{ "agentName": "", "action": "", "reasoning": "", "type": "" }}]
}}
        """
        response = model.generate_content(full_prompt)
        return json.loads(response.text)
    except Exception as e:
        raise HTTPException(500, f"AI Error: {str(e)}")

@app.post("/api/bookings")
async def create_booking(req: BookingReq):
    booking_id = "H-" + "".join(random.choices(string.ascii_uppercase + string.digits, k=6))
    try:
        dt = datetime.strptime(f"{req.date} {req.time}", "%Y-%m-%d %H:%M")
        reminder = (dt - timedelta(hours=1)).strftime("%Y-%m-%d %H:%M")
        completion = (dt + timedelta(hours=2)).strftime("%Y-%m-%d %H:%M")
    except:
        reminder = req.date
        completion = req.date

    booking = {
        "booking_id": booking_id,
        "status": "confirmed",
        "workerId": req.workerId,
        "userId": req.userId,
        "title": req.title,
        "date": req.date,
        "time": req.time,
        "address": req.address,
        "category": req.category,
        "price_estimate": req.price,
        "paymentMethod": req.paymentMethod,
        "created_at": datetime.now().isoformat(),
        "confirmation_message": "Aapki booking confirm ho gayi! Helper raaste mein hai.",
        "followups": [
            {"type": "reminder", "time": reminder,
             "message": "Aapka helper 1 ghante mein aa raha hai!"},
            {"type": "on_the_way", "time": req.time,
             "message": "Helper raaste mein hai, ETA 15 mins."},
            {"type": "completion", "time": completion,
             "message": "Service complete! Please rate your experience."}
        ]
    }
    bookings_db[booking_id] = booking
    return booking

@app.get("/api/bookings/{booking_id}")
def get_booking(booking_id: str):
    if booking_id not in bookings_db:
        raise HTTPException(404, "Booking not found")
    return bookings_db[booking_id]

@app.put("/api/bookings/{booking_id}")
def update_booking(booking_id: str, status: str):
    if booking_id not in bookings_db:
        raise HTTPException(404, "Booking not found")
    bookings_db[booking_id]["status"] = status
    return bookings_db[booking_id]

class OtpReq(BaseModel):
    email: str
    otp: str

@app.post("/api/send-otp")
async def send_otp(req: OtpReq):
    email_to = req.email
    otp_code = req.otp
    
    # Check if credentials exist
    smtp_user = os.getenv("SMTP_USER", "")
    smtp_pass = os.getenv("SMTP_PASSWORD", "")
    
    if not smtp_user or not smtp_pass:
        print(f"--- [SIMULATED EMAIL] ---")
        print(f"To: {email_to}")
        print(f"Subject: Antigravity - Your 6-Digit OTP Verification Code")
        print(f"Body: Hello! Your verification code is: {otp_code}")
        print(f"-------------------------")
        print("Tip: Add SMTP_USER and SMTP_PASSWORD to your .env file to send real emails.")
        return {"status": "simulated", "message": "OTP printed to console log."}
        
    try:
        import smtplib
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart
        
        msg = MIMEMultipart()
        msg['From'] = smtp_user
        msg['To'] = email_to
        msg['Subject'] = f"Antigravity OTP Verification: {otp_code}"
        
        body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f5; padding: 20px;">
          <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e4e4e7;">
            <h2 style="color: #2563eb; margin-bottom: 10px;">Antigravity Verification</h2>
            <p style="color: #52525b; font-size: 14px;">Hello! Use the following one-time password (OTP) to sign in to your account. This code is valid for 10 minutes.</p>
            <div style="background-color: #f4f4f5; padding: 15px; text-align: center; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #18181b; margin: 20px 0;">
              {otp_code}
            </div>
            <p style="color: #71717a; font-size: 11px; margin-top: 20px;">If you did not request this code, please ignore this email.</p>
          </div>
        </body>
        </html>
        """
        msg.attach(MIMEText(body, 'html'))
        
        server = smtplib.SMTP(os.getenv("SMTP_HOST", "smtp.gmail.com"), int(os.getenv("SMTP_PORT", "587")))
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.sendmail(smtp_user, email_to, msg.as_string())
        server.close()
        
        return {"status": "sent", "message": f"Real email sent successfully to {email_to}."}
    except Exception as e:
        print(f"SMTP Error occurred: {str(e)}")
        raise HTTPException(500, f"Email sending failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
