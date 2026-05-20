import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(express.json());

// Set up CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

const bookingsDb: Record<string, any> = {};

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: "ok", service: "Helper AI Backend" });
});

// Create booking
app.post('/api/bookings', (req: Request, res: Response) => {
  const { workerId, userId, title, date, time, address, category, price, paymentMethod } = req.body;
  const booking_id = "H-" + Math.random().toString(36).substr(2, 6).toUpperCase();
  
  let reminder = date;
  let completion = date;
  try {
    const dt = new Date(`${date} ${time}`);
    const rDt = new Date(dt.getTime() - 60 * 60 * 1000);
    const cDt = new Date(dt.getTime() + 2 * 60 * 60 * 1000);
    reminder = rDt.toISOString().slice(0, 16).replace('T', ' ');
    completion = cDt.toISOString().slice(0, 16).replace('T', ' ');
  } catch (e) {}

  const booking = {
    booking_id,
    status: "confirmed",
    workerId,
    userId,
    title,
    date,
    time,
    address,
    category,
    price_estimate: price,
    paymentMethod: paymentMethod || "Cash After Service",
    created_at: new Date().toISOString(),
    confirmation_message: "Aapki booking confirm ho gayi!",
    followups: [
      { type: "reminder", time: reminder, message: "Aapka helper 1 ghante mein aa raha hai!" },
      { type: "on_the_way", time, message: "Helper raaste mein hai, ETA 15 mins." },
      { type: "completion", time: completion, message: "Service complete! Please rate your experience." }
    ]
  };

  bookingsDb[booking_id] = booking;
  res.json(booking);
});

// Get booking
app.get('/api/bookings/:id', (req: Request, res: Response) => {
  const booking = bookingsDb[req.params.id];
  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }
  res.json(booking);
});

// Update booking status
app.put('/api/bookings/:id', (req: Request, res: Response) => {
  const booking = bookingsDb[req.params.id];
  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }
  booking.status = req.body.status || req.query.status || booking.status;
  res.json(booking);
});

// Schedule follow-up reminders
app.post('/api/followup/:id', (req: Request, res: Response) => {
  const booking = bookingsDb[req.params.id];
  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }
  res.json({
    status: "scheduled",
    booking_id: req.params.id,
    followups: booking.followups
  });
});

// AI Orchestrate using Gemini 1.5-flash with proper SDK syntax
app.post('/api/ai/orchestrate', async (req: Request, res: Response) => {
  const { prompt, workers } = req.body;
  
  if (!process.env.GEMINI_API_KEY) {
    res.status(500).json({ error: "GEMINI_API_KEY not configured" });
    return;
  }

  const SYSTEM_PROMPT = `
  You are an AI Service Orchestrator for Helper app in Pakistan.
  Accept Urdu, Roman Urdu, or English input.
  Run 5-agent pipeline: Intent → Discovery → Ranking → Decision → Trace.
  Score formula: (rating/5×40) + (1/(distance+0.1)×30) + (availability×20) + (jobs/500×10)
  Return ONLY valid JSON. No markdown. No extra text.
  Always return agentLogs showing each agent's reasoning step.
  If service unclear, best-guess from available workers.
  urgency values: low | medium | high
  log type values: info | success | warning | error
  `;

  const fullPrompt = `
  ${SYSTEM_PROMPT}

  USER REQUEST: "${prompt}"
  AVAILABLE WORKERS: ${JSON.stringify(workers)}

  Return JSON with:
  {
    "intent": { "service": "", "location": "", "time": "", "urgency": "", "budget": "" },
    "topMatches": [{ "workerId": "", "score": 0, "reasoning": "" }],
    "rankingLogic": "",
    "agentLogs": [{ "agentName": "", "action": "", "reasoning": "", "type": "" }]
  }
  `;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });
    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();
    const data = JSON.parse(text);
    res.json(data);
  } catch (error: any) {
    console.error("AI Error:", error);
    res.status(500).json({ error: error.message || "AI Error" });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});
