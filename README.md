# 🌾 AgriAdvisor AI - Agriculture Crop Advisory Assistant

A production-grade, end-to-end full-stack web application empowering farmers with instant, structured agronomic guidance powered by Google Gemini (`@google/genai` SDK with `gemini-2.5-flash`) and Supabase PostgreSQL.

---

## 🌟 Key Features

1. **Authentication & Farmer Profiles**: Supabase Auth integration with automatic `profiles` bootstrapping.
2. **Farm Management (CRUD)**: Manage farm acreage, region, soil type, irrigation sources, and primary crop lists.
3. **Dynamic AI Advisory Flow**: Dynamic form rendering across 7 distinct agronomy domains:
   - `disease_pest_diagnosis`: Multi-photo upload + visual diagnosis & step-by-step treatment plan.
   - `crop_selection`: Profitability & seasonal suitability scoring.
   - `fertilizer_nutrition`: Exact product dosage, application method, and timing.
   - `irrigation_water_management`: Optimal watering schedules & method recommendations.
   - `soil_health`: pH balance interpretation & organic soil improvement plans.
   - `weather_risk_advisory`: Short-term weather risk mitigation (frost, flood, heatwave).
   - `market_post_harvest`: Market price grounded sell vs. hold guidance & storage tips.
4. **Zero-Prose JSON Schema Enforcement**: Server-side Gemini integration with `responseSchema` and Zod output re-validation.
5. **Weather-Aware Advisory Context**: Weather snapshot cache per farm region automatically injected into AI context.
6. **Market Prices Grounding**: Queryable reference table for crop market prices.
7. **Multi-Language Output Support**: Toggle AI output language between English, Hindi, Telugu, Tamil, Marathi, Punjabi, Bengali, or Spanish.
8. **Dark Emerald Glassmorphic UI**: Built with Tailwind CSS, Lucide Icons, and mobile-first responsive layout.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React.js (Vite + TypeScript), Tailwind CSS, TanStack React Query, React Hook Form + Zod, Lucide Icons, React Router v6.
- **Backend**: Node.js + Express.js (TypeScript), `@google/genai` SDK (`gemini-2.5-flash`), Supabase JS SDK, Zod, Helmet, Cors, Express Rate Limit, Multer.
- **Database & Auth**: Supabase PostgreSQL with strict Row Level Security (RLS) policies.

---

## 🚀 Quick Start Guide

### 1. Database Setup
Execute `server/sql/001_schema.sql` and `server/sql/002_rls.sql` in your Supabase SQL Editor.

### 2. Environment Variables
Copy `.env.example` to `.env` in both `server/` and `client/` directories and fill in your credentials.

### 3. Installation
```bash
# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### 4. Running Locally
```bash
# Start Backend Express Server (Port 4000)
cd server
npm run dev

# In a second terminal, start Frontend Vite Dev Server (Port 5173)
cd client
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🔒 Security
- All backend routes verify Supabase JWTs server-side.
- Gemini API key & Supabase Service Role Key are strictly kept server-side.
- Rate limiting enforced on advisory submission endpoints.
