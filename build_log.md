# Build Log — Property Search MCP Server

## Session — 2026-04-18

### CLAUDE.md Update — search_rental_listings Removed
- Status: Complete
- Changes:
  - Removed `search_rental_listings` from MCP Tools section
  - Renumbered remaining tools 1-5
  - Removed `listings.py` from project structure
  - Added "Pending Tools" section with search_rental_listings spec note
- Issues encountered: None
- Next: Build tool 1 (`get_crime_data`)

### Project Setup
- Status: Complete
- Changes:
  - Created `build_log.md`
  - Created `.claude/skills/` directory for skill files
- Issues encountered: None
- Next: Add skill files, then begin tool 1 (`get_crime_data`)

### Skills Added
- Status: Complete
- Changes:
  - Added `dispatching_parallel_agents.md`
  - Added `executing_plans.md`
  - Added `test_driven_development.md`
  - Added `varlock_claude_skill.md`
- Issues encountered: None
- Next: Begin tool 1 (`get_crime_data`)

### CLAUDE.md Skills Section Updated
- Status: Complete
- Changes:
  - Removed `mcp-builder` and `modern-python` (not present in .claude/skills/)
  - Updated skill names to match actual filenames (underscores instead of hyphens)
  - Added `dispatching_parallel_agents` skill
- Issues encountered: None
- Next: Begin tool 1 (`get_crime_data`)

### Project Skeleton & Tool 1: get_crime_data
- Status: Complete
- API used: data.police.uk
- Changes:
  - Created project skeleton: requirements.txt, .gitignore, tools/__init__.py, tests/ dir
  - Set up Python venv with all dependencies
  - Created `tools/crime.py` — fetches last 3 months of crime data, aggregates by category, derives safety rating
  - Created `tests/test_crime.py` — 6 tests covering: output structure, Low/Medium/High ratings, timeout error, API error
- Test result: 6/6 passed
- Issues encountered: AsyncMock context manager setup required explicit `__aenter__.return_value`
- Next: Tool 2 (`get_transport_options`)

### Tool 2: get_transport_options
- Status: Complete
- API used: TfL API (London postcodes), TransportAPI (all other UK postcodes)
- Changes:
  - Created `tools/transport.py` — routes London postcodes to TfL, others to TransportAPI
  - London postcode detection via prefix check (E, N, S, W, SE, SW, NW, WC, EC)
  - TfL returns journey duration + transport modes from journey legs
  - TransportAPI returns duration + modes from route parts
  - TransportAPI credentials loaded from env vars (TRANSPORT_API_ID, TRANSPORT_API_KEY)
  - Created `tests/test_transport.py` — 6 tests: TfL routing, SE postcode, TransportAPI routing, timeout, API error, empty journeys
- Test result: 6/6 passed (full suite 12/12)
- Issues encountered: None
- Next: Tool 3 (`get_nearby_universities`)

### Tool 3: get_nearby_universities
- Status: Complete
- API used: Static JSON (data/universities.json)
- Changes:
  - Created `tools/universities.py` — Haversine distance calc, filters by radius_km, sorted by distance
  - Created `data/universities.json` — seeded with 50 UK universities (name, lat, lng, postcode)
  - Created `tests/test_universities.py` — 10 tests: haversine (zero, known distance, London-Manchester), nearby search, custom radius, large radius, output structure, sorted order, no results, missing file
- Test result: 10/10 passed (full suite 22/22)
- Issues encountered: None
- Next: Tool 4 (`get_nearby_amenities`)
