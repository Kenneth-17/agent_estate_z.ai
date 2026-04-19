from langgraph.graph import StateGraph, START, END
from agent.state import AgentState
from agent.nodes.onboard import onboard_node
from agent.nodes.discover import discover_node
from agent.nodes.filter import filter_node
from agent.nodes.enrich import enrich_node
from agent.nodes.reason import reason_node
from agent.nodes.present import present_node
from agent.nodes.refine import refine_node


def should_continue_onboarding(state: AgentState) -> str:
    if state.get("onboarding_complete"):
        return "discover"
    return END


def should_refine(state: AgentState) -> str:
    if state.get("current_step") == "refine":
        return "refine"
    return END


def build_agent():
    graph = StateGraph(AgentState)

    # Nodes
    graph.add_node("onboard", onboard_node)
    graph.add_node("discover", discover_node)
    graph.add_node("filter", filter_node)
    graph.add_node("enrich", enrich_node)
    graph.add_node("reason", reason_node)
    graph.add_node("present", present_node)
    graph.add_node("refine", refine_node)

    # Edges
    graph.add_edge(START, "onboard")
    graph.add_conditional_edges("onboard", should_continue_onboarding, {"discover": "discover", END: END})
    graph.add_edge("discover", "filter")
    graph.add_edge("filter", "enrich")
    graph.add_edge("enrich", "reason")
    graph.add_edge("reason", "present")
    graph.add_conditional_edges("present", should_refine, {"refine": "refine", END: END})
    graph.add_edge("refine", "filter")

    return graph.compile()
