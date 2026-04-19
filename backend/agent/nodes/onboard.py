from agent.state import AgentState
from agent.llm import llm_with_backoff

ONBOARD_SYSTEM = """You are a friendly London rental agent. The user is starting their rental search.
Your job is to ask ONE question at a time to understand their situation.

Start by asking: "Hey! I'll help you find the perfect place in London. Tell me — what's bringing you to the city?"

Based on their answer, silently detect their persona:
- "job", "work", "new role", company names → professional
- "kids", "family", "children", "school" → family
- "university", "studying", "masters", "UCL", "KCL" → student
- "moving from", "relocating", "never been to London", country names → relocator
- "nurse", "NHS", "teacher", "hospital", "emergency" → key_worker

After detecting the persona, ask the next question naturally:
- Budget: "What's your monthly budget?"
- Bedrooms: "How many bedrooms do you need?"
- Commute: "Where will you be commuting to?"
- Priorities (tailored by persona): "What matters most to you in an area?"
- London familiarity: "Have you lived in London before?"

Keep responses warm, concise, and conversational. One question at a time.
When all info is gathered, say "Got it! Let me build your rental passport..." and set onboarding_complete to true.

Return a JSON with: { "response": "your message", "persona": "detected_persona_or_null", "budget_max": number_or_null, "bedrooms_min": number_or_null, "commute_destination": "string_or_null", "onboarding_complete": false }
"""


async def onboard_node(state: AgentState) -> dict:
    messages = state.get("messages", [])

    response = await llm_with_backoff(
        [{"role": "system", "content": ONBOARD_SYSTEM}] + messages
    )

    # Try to parse structured data from LLM response
    content = response.content
    updates = {
        "messages": [response],
        "current_step": "onboarding",
    }

    # Simple keyword-based extraction as fallback
    last_user_msg = ""
    for msg in reversed(messages):
        if hasattr(msg, "type") and msg.type == "human":
            last_user_msg = msg.content.lower()
            break

    # Detect persona
    if not state.get("persona"):
        if any(w in last_user_msg for w in ["job", "work", "role", "barclays", "startup", "company"]):
            updates["persona"] = "professional"
        elif any(w in last_user_msg for w in ["kids", "family", "children", "wife", "husband"]):
            updates["persona"] = "family"
        elif any(w in last_user_msg for w in ["university", "study", "masters", "ucl", "kcl", "student"]):
            updates["persona"] = "student"
        elif any(w in last_user_msg for w in ["moving from", "relocating", "never been", "from abroad"]):
            updates["persona"] = "relocator"
        elif any(w in last_user_msg for w in ["nurse", "nhs", "teacher", "hospital"]):
            updates["persona"] = "key_worker"

    # Detect budget
    if not state.get("budget_max") and "£" in last_user_msg:
        import re
        prices = re.findall(r'£?(\d{3,4})', last_user_msg)
        if prices:
            updates["budget_max"] = int(prices[-1])

    # Detect bedrooms
    if not state.get("bedrooms_min") and any(w in last_user_msg for w in ["bed", "bedroom"]):
        import re
        nums = re.findall(r'(\d+)\s*bed', last_user_msg)
        if nums:
            updates["bedrooms_min"] = int(nums[0])

    # Detect commute destination
    if not state.get("commute_destination"):
        commute_keywords = ["commut", "work at", "office in", "working in", "going to", "based in", "near "]
        if any(k in last_user_msg for k in commute_keywords):
            import re
            # Try to extract a place name after the keyword
            for kw in commute_keywords:
                if kw in last_user_msg:
                    idx = last_user_msg.index(kw) + len(kw)
                    place = last_user_msg[idx:].strip().strip(".,!?").split()
                    if place:
                        updates["commute_destination"] = " ".join(place[:3]).title()
                    break

    # Check if onboarding is complete
    merged = {**state, **updates}
    has_persona = bool(merged.get("persona"))
    has_budget = merged.get("budget_max") and merged["budget_max"] < 99999
    has_beds = merged.get("bedrooms_min") and merged["bedrooms_min"] > 0
    has_commute = bool(merged.get("commute_destination"))

    if has_persona and has_budget and has_beds and has_commute:
        updates["onboarding_complete"] = True

    return updates
