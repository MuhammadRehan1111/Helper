# 🔧 Helper — AI Service Orchestrator
AI‑Powered Home Services for Pakistan's Informal Economy

---

![Badges](https://img.shields.io/badge/React%20%2B%20Vite-✅-blue) ![TypeScript-✅-blue] ![Firebase-✅-orange) ![Google%20Maps-✅-green) ![Gemini%20AI-✅-purple) ![PWA%20Ready-✅-teal)

## Overview

Helper is an **Agentic AI System** that automates the complete lifecycle of home‑service requests in Pakistan’s informal economy. It supports **Urdu, Roman Urdu, and English** inputs.

## Problem Statement

- Informal‑economy workers (plumbers, electricians, AC technicians, beauticians, tutors) rely on WhatsApp and phone calls.
- No proper booking system exists.
- Users struggle to find reliable services.
- Real‑time availability is missing.

## Solution

An AI‑powered platform that:
- Understands natural‑language requests.
- Finds nearby providers.
- Ranks and recommends the best match.
- Simulates booking and confirmation.
- Sends follow‑up reminders.

## Demo Example

**User Input:**
```
Mujhe kal subah G-13 mein AC technician chahiye
```

**System Output:**
- Service: **AC Technician**
- Location: **G‑13, Islamabad**
- Time: **Tomorrow Morning**
- Provider: **Ali AC Services** (2.1 km away)
- Booking ID: **H‑A1B2C3**
- Status: **Confirmed**
- Reminder: **Scheduled 1 hour before**

## Tech Stack
| Layer | Technology |
|-------|-------------|
| Frontend | React + TypeScript + Vite |
| Styling | TailwindCSS + Shadcn UI |
| AI | Google Gemini 1.5 Flash |
| Agents | Google Antigravity |
| Maps | Google Maps JavaScript API |
| Database | Firebase Firestore |
| Notifications | Firebase Cloud Messaging |
| PWA | vite‑plugin‑pwa |

## AI Agent Pipeline
1. **Intent Extraction Agent** – parses Urdu/Roman Urdu/English, extracts service, location, time, urgency.
2. **Provider Discovery Agent** – searches nearby providers, filters by category & location.
3. **Matching & Ranking Agent** – scores providers: `score = rating×40 + (1/distance)×30 + availability×20` and selects top 3.
4. **Booking Simulation Agent** – generates booking ID (`H‑XXXXXX`), confirms slot, stores in Firestore.
5. **Follow‑Up Automation Agent** – schedules reminder 1 hour before, sends status updates, requests rating after completion.

## Features
- ✅ Natural Language Understanding (Urdu/Roman Urdu/English)
- ✅ AI‑Powered Provider Matching
- ✅ Real‑time Live Tracking with Google Maps
- ✅ Booking Simulation with receipt
- ✅ Push Notifications (FCM)
- ✅ Agent Trace Logs
- ✅ Installable PWA (Android & iOS)
- ✅ Offline support
- ✅ Multi‑role: User, Worker, Admin
- ✅ Firebase Firestore backend
- ✅ Voice Input support

## How Antigravity Is Used
Google Antigravity orchestrates the **5‑agent pipeline**, handling multi‑step reasoning, integrating Google Maps & Gemini APIs, executing booking & notification actions, and providing traceable logs.

## Installation
```bash
# Clone repo
git clone https://github.com/MuhammadRehan1111/Helper.git
cd Helper

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env   # edit with your keys

# Run development server
npm run dev

# Build for production
npm run build
```

## Environment Variables
```
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_GOOGLE_MAPS_API_KEY=your_maps_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=helper-33e75
VITE_FIREBASE_MESSAGING_SENDER_ID=74329062596
VITE_FIREBASE_APP_ID=your_app_id
```

## APIs Used
| API | Purpose |
|-----|---------|
| Google Gemini 1.5 Flash | AI intent understanding & agent reasoning |
| Google Antigravity | Agent orchestration & workflow management |
| Google Maps JavaScript API | Live tracking & map UI |
| Google Places API | Nearby provider discovery |
| Google Directions API | Route calculation |
| Google Distance Matrix API | Distance calculation |
| Firebase Firestore | Booking & worker data storage |
| Firebase Cloud Messaging | Push notifications |

## Project Structure
```
src/
  lib/          # utilities (notifications, context, types)
  pages/        # React pages (Tracking, Jobs, etc.)
  components/   # UI components (Shadcn UI wrappers)
public/
  firebase-messaging-sw.js   # Service worker for FCM
backend/
  main.py       # FastAPI server exposing Gemini & booking APIs
  models/       # Pydantic schemas
.env            # environment variables (keys, secrets)
package.json    # npm scripts & dependencies
vite.config.ts  # Vite configuration (including PWA plugin)
README.md        # **this file**
```

## Assumptions & Limitations
- Mock provider data is used for demonstration.
- Worker location is simulated (not real GPS).
- Notifications require browser permission.
- Firebase free‑tier limits apply.
- Gemini free tier: 1500 requests/day.

## Team
Built for **Google Hackathon – Challenge 2**
*AI Service Orchestrator for the Informal Economy*

## License
MIT License

---
*Happy hacking! 🚀*
