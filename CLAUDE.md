# Property Search MCP Server — CLAUDE.md

## Project Overview
A Python MCP server that enriches UK rental property listings with contextual data for a student rental chatbot. The orchestrator calls this server's tools to answer student queries about safety, transport, proximity to university, and local amenities.

## Required Skills
Before writing any code, load and follow these skills from `.claude/skills/`:

- **`mcp-builder`** — read this FIRST before touching server.py or any tool file. Follow its patterns exactly for MCP server structure, tool registration, and stdio transport.
- **`varlock-claude-skill`** — read this before handling any environment variables. All secret loading must follow its patterns.
- **`executing-plans`** — read this before starting each new tool. Follow its step-by-step execution pattern — one tool at a time, verify before proceeding.
- **`modern-python`** — read this before setting up the project. Use uv, ruff, and pytest as specified.
- **`test-driven-development`** — read this before writing any tool implementation. Write the test first, then the implementation.

If a skill file is missing, stop and ask the user to install it before proceeding.

## Stack
- Language: Python 3.12+
- MCP framework: `mcp` Python SDK (stdio transport)
- Agent framework: OpenAI Agents SDK
- Environment: `.env` file via `python-dotenv`

## Environment Variables
NEVER hardcode keys. NEVER print them. NEVER screenshot them. Load only from `.env`:
```
GOOGLE_PLACES_API_KEY=
TRANSPORT_API_ID=
TRANSPORT_API_KEY=
```
`.env` must be in `.gitignore`. If a key is missing, raise a clear `EnvironmentError` on startup.

## MCP Tools to Build
Build these tools in this exact order. Do not skip ahead.

### 1. `get_crime_data`
- Source: data.police.uk (no key required)
- Input: `lat: float`, `lng: float`
- Output: `{ total_crimes: int, categories: dict, safety_rating: str }`
- Endpoint: `https://data.police.uk/api/crimes-street/all-crime?lat={lat}&lng={lng}`
- Aggregate last 3 months. Derive safety_rating: <50=Low, 50-100=Medium, >100=High

### 2. `get_transport_options`
- Source: TfL API (London postcodes: E, N, S, W, SE, SW, NW, WC, EC prefix) OR TransportAPI (all other UK postcodes)
- Input: `postcode: str`, `destination_postcode: str`
- Output: `{ journey_time_mins: int, modes: list, provider: str }`
- Route logic: detect London postcode → TfL, else → TransportAPI
- TfL endpoint: `https://api.tfl.gov.uk/Journey/JourneyResults/{from}/to/{to}`
- TransportAPI endpoint: `https://transportapi.com/v3/uk/public/journey/from/postcode:{from}/to/postcode:{to}.json`

### 3. `get_nearby_universities`
- Source: static JSON file `data/universities.json`
- Input: `lat: float`, `lng: float`, `radius_km: float = 10`
- Output: list of `{ name, distance_km, postcode }`
- Use Haversine formula for distance calculation
- Seed file with top 50 UK universities with coordinates

### 4. `get_nearby_amenities`
- Source: Google Places API (New)
- Input: `lat: float`, `lng: float`
- Output: `{ supermarkets: list, gyms: list, restaurants: int, parks: int }`
- Use Places Nearby Search endpoint
- Limit to 5 results per category

### 5. `get_area_stats`
- Source: ONS (static data snapshot)
- Input: `postcode: str`
- Output: `{ avg_rent_region: int, rental_demand: str }`
- Load from `data/ons_rental_stats.json` seeded from ONS data
- This is mock-enhanced — no live API call needed

## Input/Output Contract
Every tool call from the orchestrator passes:
```json
{ "postcode": "M1 1AE", "university": "University of Manchester", "budget": 900, "bedrooms": 2 }
```
Each tool returns a clean dict. No raw API responses passed upstream.

## Project Structure
```
property-search-mcp/
├── CLAUDE.md
├── .env                  # never commit
├── .gitignore
├── requirements.txt
├── server.py             # MCP server entry point
├── tools/
│   ├── crime.py          # get_crime_data
│   ├── transport.py      # get_transport_options
│   ├── universities.py   # get_nearby_universities
│   ├── amenities.py      # get_nearby_amenities
│   └── area_stats.py     # get_area_stats
├── data/
│   ├── universities.json
│   └── ons_rental_stats.json
└── build_log.md          # updated after every tool is completed
```

## Build Rules
1. Build and test ONE tool at a time before moving to the next
2. Each tool must have a standalone test function that calls it directly
3. After each tool is working, update `build_log.md` immediately
4. Never move to the next tool if the current one is failing
5. If an API returns no data, return an empty list — never crash
6. All API calls must have a 10-second timeout
7. Log errors to stderr, never stdout (MCP uses stdout for protocol)

## build_log.md Format
After completing each tool, append to build_log.md:
```markdown
## [TOOL NAME] — [DATE]
- Status: ✅ Complete / ❌ Failed
- API used: [name]
- Test result: [what the test returned]
- Issues encountered: [any]
- Next: [next tool to build]
```

## Error Handling
- Missing env var → raise `EnvironmentError` with clear message on startup
- API timeout → return `{ "error": "timeout", "data": [] }`
- API 4xx → return `{ "error": "api_error", "status": code, "data": [] }`
- Never let an exception bubble up to the MCP protocol layer

## What NOT to Build
- No database — all state is stateless per request
- No authentication layer — handled by orchestrator
- No UI — this is a pure MCP server
- No caching — not needed for hackathon demo

## Demo Postcode
Primary demo: `M14 5RQ` (Manchester, near University of Manchester)
Secondary demo: `E1 6RF` (London, near Queen Mary University)
All dummy data in ONS stats must be realistic for these postcodes.

## Pending Tools
- **search_rental_listings** — to be added later. Must follow output contract: `{ title, price, bedrooms, lat, lng, listing_url }` using Nestoria API. See original CLAUDE.md for full spec.