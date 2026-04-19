# Agent Estate Z

> Rental platforms treat you like a search query. We treat you like a person.

**Agent Estate Z** is an AI-powered London rental property finder that builds a **Rental Passport** — a digital identity that understands your life, constraints, and preferences — then uses live data to score and rank properties that actually fit your life.

Built for **Hackathon Track 3: The Invisible Tube — AI x Agentic Workflows**.

## How It Works

1. **Build your Rental Passport** — A short conversational onboarding where you pick your persona, set your budget, bedrooms, commute destination, and priorities
2. **AI matches properties** — Our LangGraph agent reasons over your constraints (not static filters) and enriches listings with 6+ live data sources
3. **Scored results** — Every property gets a match score with transparent breakdowns: commute time, safety, amenities, air quality, transport links, and more
4. **Refine with chat** — Tell the agent what you liked or didn't like, and it re-ranks results

## Architecture

```
agent_estate_z.ai/
├── app/                         # Next.js 16 frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx         # Onboarding + chat
│   │   │   ├── login/page.tsx   # Supabase auth
│   │   │   ├── results/page.tsx # Property results grid
│   │   │   └── property/[id]/   # Property detail view
│   │   ├── components/ui/       # shadcn/ui components
│   │   ├── lib/
│   │   │   ├── api.ts           # Backend API client
│   │   │   ├── auth-context.tsx # Supabase auth provider
│   │   │   └── supabase/        # Supabase client utilities
│   │   └── middleware.ts        # Auth middleware
│   └── package.json
│
├── backend/                     # Python + FastAPI + LangGraph
│   ├── main.py                  # FastAPI endpoints
│   ├── agent/
│   │   ├── graph.py             # LangGraph StateGraph
│   │   ├── state.py             # AgentState TypedDict
│   │   ├── llm.py               # LLM client (Z.AI API)
│   │   ├── nodes/               # Graph nodes
│   │   │   ├── onboard.py       # Conversational onboarding
│   │   │   ├── discover.py      # Persona → weights mapping
│   │   │   ├── filter.py        # Budget/bedrooms filtering
│   │   │   ├── enrich.py        # Live API enrichment (6 sources)
│   │   │   ├── reason.py        # Weighted scoring + ranking
│   │   │   ├── present.py       # LLM summary generation
│   │   │   └── refine.py        # Chat-based refinement
│   │   └── tools/               # API tool functions
│   ├── passport/
│   │   └── models.py            # Passport data model
│   ├── data/
│   │   └── london-rent-properties.json
│   └── requirements.txt
└── .env                         # (not tracked — see setup below)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui |
| **Backend** | Python, FastAPI, LangGraph (StateGraph agent) |
| **AI/LLM** | Z.AI API (OpenAI-compatible), LangChain, LangSmith |
| **Auth** | Supabase Auth (Google OAuth + email/password) |
| **Data Sources** | Google Maps, TfL, Police.uk, OSM Overpass, London Air, Postcodes.io |
| **Hosting** | Vercel (frontend), Railway (backend) |

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- A [Supabase](https://supabase.com) project
- API keys for Z.AI, Google Maps, and TfL

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your API keys
```

### 2. Frontend Setup

```bash
cd app

# Install dependencies
npm install

# Configure environment
# Edit .env.local with your Supabase credentials:
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Authentication → Providers** and enable Email (and optionally Google)
3. Add `http://localhost:3000` to **Authentication → URL Configuration → Redirect URLs**

### 4. Run

```bash
# Terminal 1 — Backend
cd backend
source .venv/bin/activate
uvicorn main:app --reload

# Terminal 2 — Frontend
cd app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/onboard` | Send a chat message during onboarding |
| `POST` | `/api/search` | Run the full search pipeline |
| `POST` | `/api/refine` | Refine results with feedback |
| `GET` | `/api/property/{id}` | Get enriched property details |
| `GET` | `/api/passport` | Get the current rental passport |
| `GET` | `/api/health` | Health check |

## Environment Variables

### Backend (`.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `ZAI_API_KEY` | Z.AI API key | Yes |
| `ZAI_BASE_URL` | Z.AI API base URL | Yes |
| `ZAI_MODEL` | Model name (default: `glm-5.1`) | No |
| `GOOGLE_MAPS_API_KEY` | Google Maps Distance Matrix API | Yes |
| `TFL_API_KEY` | Transport for London API | Yes |
| `LANGSMITH_API_KEY` | LangSmith tracing key | No |
| `LANGSMITH_TRACING` | Enable LangSmith tracing | No |
| `LANGSMITH_PROJECT` | LangSmith project name | No |

### Frontend (`.env.local`)

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon public key | Yes |
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |

## License

MIT
