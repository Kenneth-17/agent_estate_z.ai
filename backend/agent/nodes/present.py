from agent.state import AgentState
from agent.llm import llm_with_backoff

PRESENT_SYSTEM = """You are a London rental agent presenting property results to the user.
Given the top 3 scored properties and the user's passport, generate a friendly summary explaining why each property matches.

For each property, mention:
- The match score percentage
- Top 2-3 reasons it fits (using checkmark-style positives)
- 1 trade-off or warning if applicable

Keep it concise and warm. Format as a summary the frontend can parse.
"""


async def present_node(state: AgentState) -> dict:
    top_picks = state.get("top_picks", [])
    weights = state.get("weights", {})

    # Generate natural language explanations for each property
    properties_text = ""
    for i, prop in enumerate(top_picks):
        e = prop.get("enrichment", {})
        scores = prop.get("scores", {})
        properties_text += f"""
Property {i+1}: {prop.get('listing_title', prop.get('location', 'Unknown'))}
Price: £{prop.get('price', '?')}/mo | {prop.get('bedrooms', '?')} bed | {prop.get('property_type', '?')}
Scores: {scores}
Overall: {prop.get('overall_score', 0)}%
Commute: {e.get('commute', {}).get('commute_text', 'Unknown')}
Crime: {e.get('crime', {}).get('crime_category', 'Unknown')} ({e.get('crime', {}).get('crime_count', '?')} incidents)
Amenities: {e.get('amenities', {})}
Transport: {e.get('transport', {})}
Borough: {e.get('borough', {})}
"""

    response = await llm_with_backoff([
        {"role": "system", "content": PRESENT_SYSTEM},
        {"role": "user", "content": f"""User weights: {weights}
Properties:
{properties_text}

Summarize the top 3 matches with reasons."""},
    ])

    return {
        "messages": [response],
        "current_step": "present",
    }
