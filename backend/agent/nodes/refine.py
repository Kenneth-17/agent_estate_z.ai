from agent.state import AgentState


def refine_node(state: AgentState) -> dict:
    # When user asks to refine (e.g. "show me safer areas", "under £1,500"),
    # adjust the passport and re-run the pipeline from filter
    messages = state.get("messages", [])
    last_user_msg = ""
    for msg in reversed(messages):
        if hasattr(msg, "type") and msg.type == "human":
            last_user_msg = msg.content.lower()
            break

    updates = {"current_step": "refine"}

    # Simple keyword-based refinement
    if "safer" in last_user_msg or "safe" in last_user_msg:
        weights = dict(state.get("weights", {}))
        weights["safety"] = min(weights.get("safety", 0.25) + 0.15, 0.5)
        updates["weights"] = weights

    if "cheaper" in last_user_msg or "under" in last_user_msg or "budget" in last_user_msg:
        import re
        prices = re.findall(r'£?(\d{3,4})', last_user_msg)
        if prices:
            updates["budget_max"] = int(prices[-1])

    if "3 bed" in last_user_msg or "3 bed" in last_user_msg:
        updates["bedrooms_min"] = 3

    return updates
