import os
import asyncio
from langchain_openai import ChatOpenAI


def get_llm():
    return ChatOpenAI(
        api_key=os.getenv("ZAI_API_KEY"),
        base_url=os.getenv("ZAI_BASE_URL", "https://api.z.ai/api/coding/paas/v4"),
        model=os.getenv("ZAI_MODEL", "glm-5.1"),
        temperature=0.3,
        max_retries=3,
        timeout=90,
    )


async def llm_with_backoff(messages, max_retries=3):
    llm = get_llm()
    for attempt in range(max_retries):
        try:
            return await llm.ainvoke(messages)
        except Exception as e:
            err = str(e)
            if ("429" in err or "1302" in err or "Rate limit" in err or "Timeout" in err) and attempt < max_retries - 1:
                wait = 2 ** (attempt + 1)
                await asyncio.sleep(wait)
            else:
                raise
