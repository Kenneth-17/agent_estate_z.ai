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

### Tool 4: get_nearby_amenities
- Status: Complete
- API used: Google Places API (New) — Nearby Search (POST)
- Changes:
  - Created `tools/amenities.py` — searches 4 categories (supermarket, gym, restaurant, park) within 1.5km radius
  - Supermarkets and gyms returned as name lists (capped at 5)
  - Restaurants and parks returned as counts
  - Requires GOOGLE_PLACES_API_KEY env var
  - Created `tests/test_amenities.py` — 8 tests: all categories, 5-result cap (supermarkets, gyms), count types, timeout, API error, missing key, empty results
- Test result: 8/8 passed (full suite 30/30)
- Issues encountered: Test mock needed `client.post` since Google Places API (New) uses POST requests
- Next: Tool 5 (`get_area_stats`)

### Tool 5: get_area_stats
- Status: Complete
- API used: Static JSON (data/ons_rental_stats.json)
- Changes:
  - Created `tools/area_stats.py` — extracts outward code from postcode, longest-prefix match against ONS data
  - Created `data/ons_rental_stats.json` — seeded with 50 UK postcode areas with realistic avg rent and demand
  - Demo postcodes: M14 5RQ -> 950/Medium, E1 6RF -> 1800/Very High
  - Created `tests/test_area_stats.py` — 8 tests: Manchester, London E, SE, Edinburgh EH, output structure, unknown postcode, missing file, case insensitivity
- Test result: 8/8 passed (full suite 38/38)
- Issues encountered: None
- Next: All 5 tools complete. Build server.py to wire up MCP endpoints.

## User Profile Update — 2026-04-18

### get_transport_options: work_postcode parameter added
- Status: Complete
- Changes:
  - Added optional `work_postcode: str = None` parameter
  - Without work_postcode: returns original flat `{ journey_time_mins, modes, provider }` (backward compatible)
  - With work_postcode: returns `{ university_journey: {...}, work_journey: {...} }`
  - Extracted `_fetch_journey()` helper to avoid duplication
  - Added 3 new tests: backward compat, both journeys, different durations
- Test result: 9/9 passed (was 6/6)
- Issues encountered: Mixed-provider test needed realistic scenario — routing is origin-based
- Next: Update get_nearby_amenities

### get_nearby_amenities: has_children parameter added
- Status: Complete
- Changes:
  - Added optional `has_children: bool = False` parameter
  - Without has_children: returns original structure (backward compatible)
  - With has_children=True: adds `schools` list (capped at 5) and `child_friendly_score` (0-10)
  - Score formula: min(parks_count, 5) + min(schools_count, 5), capped at 10
  - Schools fetched via Google Places `primary_school` type
  - Added 5 new tests: backward compat, schools+score, high score, zero score, cap at 5
- Test result: 13/13 passed (was 8/8)
- Issues encountered: None
- Next: Full suite 46/46 green. Push and commit.
