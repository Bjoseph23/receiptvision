# ReceiptVision

![Dashboard screenshot](assets/dashboard.png)

AI Financial Document Processing System

Team: Bill Mageni & Tulley Mutea

---

## One-line
ReceiptVision is an AI-driven financial document processing app that captures receipts and invoices, extracts key fields with Google Gemini (Gemini 3 via AI Studio) and stores files and structured data in Supabase for fast analytics and reporting.

## Table of contents
- Overview
- Key features
- Minimum Viable Product (MVP)
- How it works (architecture & flow)
- Technology stack
- Setup & configuration
  - Requirements
  - Environment variables
  - Google Gemini (Gemini 3) via AI Studio — quick setup
  - Supabase setup
- Database schema (suggested)
- Run locally
- Deployment notes
- Hackathon & award
- Lessons learned
- Contributing
- License

---

## Overview

Problem statement

Businesses often struggle with manually processing large volumes of financial documents (receipts, invoices, etc.). Manual entry is slow, error-prone, and costly. ReceiptVision automates capture, extraction, organization, and visualization so business owners can focus on growth instead of paperwork.

Solution

ReceiptVision uses Google Gemini (via AI Studio) to extract key financial fields (date, vendor, total, tax, line items) from photos or uploads, stores originals and structured results in Supabase, and renders dashboards and reports (Chart.js) for insights.

---

## Key features
- Secure user authentication and personalized dashboards
- Capture receipts from device camera or upload files
- Automatic extraction of date, vendor, totals, taxes, and line items using Gemini
- Document storage in Supabase storage buckets and structured data in Supabase DB
- Interactive analytics: bar charts, pie charts, line graphs (Chart.js)
- Exportable reports (CSV / PDF)
- Basic predictive insights and personalized spending tips

---

## Minimum Viable Product (MVP)
- Capture & upload receipts
- Gemini-powered extraction of key fields
- Personalized dashboard with charts
- Basic authentication and per-user data
- Export summary reports (CSV / PDF)

---

## How it works (architecture & flow)
1. User captures photo or uploads a file from the dashboard.
2. Frontend uploads the image to Supabase Storage (private bucket).
3. Backend (Flask) receives a storage webhook or a request to process the file and sends it to Gemini via Google Generative AI / AI Studio for document understanding / OCR and structured extraction.
4. Backend parses Gemini's structured response into fields (date, amount, vendor, line items) and stores the result in Supabase tables (documents, transactions, line_items).
5. Dashboard queries Supabase for the user’s processed data and renders visualizations (Chart.js).

Security & privacy: images and processed data are stored in secure Supabase storage; access is controlled by authentication and row-level security (RLS).

---

## Technology stack
- Frontend: React, Tailwind CSS, Material UI, Chart.js
- Backend: Flask (Python) + optional serverless functions
- AI: Google Gemini (Gemini 3) via AI Studio / Generative API
- Storage & DB: Supabase (Storage + Postgres); optionally MySQL for legacy persistence
- Authentication: Supabase Auth (email / Google) and Google OAuth where needed

---

## Setup & configuration

### Requirements
- Node.js (16+), npm or yarn
- Python 3.10+
- Supabase account
- Google Cloud account with access to AI Studio / Generative AI API

### Environment variables (.env)
Create a `.env` (backend) and `.env.local` (frontend) with these variables:

```
# Google / Gemini
GEMINI_API_KEY=your_gemini_api_key_or_service_account_json_base64
GOOGLE_CLOUD_PROJECT=your-google-project-id

# Supabase
SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_ANON_KEY=public-anon-key (used by frontend, if applicable)
SUPABASE_SERVICE_ROLE_KEY=service-role-key (used server-side only)

# App
FLASK_ENV=development
SECRET_KEY=your_flask_secret

# Optional DB
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

Important: never commit service role keys or GEMINI API keys — store them in CI/CD secrets or your deployment environment.

### Google Gemini (Gemini 3) via AI Studio — quick setup
1. Sign in to Google Cloud Console and create/select a project.
2. Open AI Studio (studio.google.com or via console -> AI -> Studio) and enable the Generative AI / Vertex AI / Generative Models API for your project.
3. Create credentials:
   - For simple testing, create an API key (if available). For production or server-side calls, create a service account with the appropriate AI/Generative Model permissions and download the JSON key.
4. Store the JSON key securely and set GEMINI_API_KEY to the JSON contents (or set GOOGLE_APPLICATION_CREDENTIALS to point at the JSON file path on your server). Many deployments put the JSON base64-encoded in an environment variable and decode it at runtime.
5. In your backend, call the Generative AI endpoint or the client library and specify the Gemini 3 model (model name may differ — check AI Studio docs). Send the receipt image or extracted text to the model, requesting structured extraction (JSON schema output) to reliably get fields like date, vendor, total, tax, and line items.

Notes:
- Prefer server-side calls using a service account so you can keep keys secret.
- Refer to Google AI Studio docs for exact client usage and model names.

### Supabase setup
1. Create a new Supabase project.
2. Create a Storage bucket (e.g., `documents`) with private access.
3. Create database tables (example SQL below).
4. Configure Supabase Auth providers (email, Google) if you want OAuth.
5. Add your Supabase URL and service role key to your backend env. Add the anon key to the frontend env only if direct uploads from the client are allowed (but use RLS and bucket security carefully).

---

## Suggested database schema (Postgres / Supabase)

Example SQL:

```sql
-- Users are managed by Supabase Auth; link with auth.users using uid
CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  file_path text NOT NULL,
  uploaded_at timestamptz DEFAULT now(),
  processed boolean DEFAULT false,
  processed_at timestamptz,
  raw_text text,
  metadata jsonb
);

CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id uuid REFERENCES documents(id) ON DELETE SET NULL,
  vendor text,
  date date,
  amount numeric,
  tax numeric,
  currency text,
  category text,
  created_at timestamptz DEFAULT now(),
  raw jsonb
);

CREATE TABLE line_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid REFERENCES transactions(id) ON DELETE CASCADE,
  description text,
  quantity integer,
  price numeric
);
```

Add Row Level Security (RLS) so users only access their rows. Example:

```sql
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their docs" ON documents
  FOR ALL USING (auth.uid() = user_id);
```

---

## Run locally (example)

Backend (Flask):

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export FLASK_APP=app.py
# set environment variables from .env
flask run
```

Frontend (React):

```bash
cd frontend
npm install
npm run dev
```

---

## Deployment notes
- Keep GEMINI keys server-side and never expose the service role key to the client.
- For production, use a managed platform (Cloud Run, Vercel, or similar) and store secrets in the platform secret manager.
- In CI (GitHub Actions), add secrets: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_KEY (or service account JSON base64).

---

## Hackathon & award
This project was built for the "Design Thinking Hackathon". ReceiptVision placed 4th in the competition.

Event context (brief): Day One: pitches and team formation; Day Two: building and iteration; Day Three: final pitch and judging.

---

## Lessons learned
- Start with a strict problem definition and a narrow MVP — it lets you iterate quickly under time constraints.
- Keep AI prompts and expected output schema strict. Asking the model for JSON with explicit keys dramatically reduces post-processing errors.
- Secure storage and secrets management matter from day one. Avoid client-side secrets and prefer server-side processing for sensitive operations.
- UX for capture (camera + quick crop) significantly improves extraction accuracy.
- Test on a variety of receipt layouts and lighting conditions; real-world variance is wide.

---

## Contributing
Contributions welcome. Open an issue to discuss features or submit a PR. Please do not commit secrets.

---

## License
MIT
