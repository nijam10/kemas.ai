import asyncio
import httpx
from app.core.config import settings

async def run():
    url = f"{settings.COMFYUI_BASE_URL.rstrip('/')}/history"
    async with httpx.AsyncClient() as client:
        res = await client.get(url)
        hist = res.json()
        
    pid = "2e7901d5-3146-4e9f-af81-f39faacf545f"
    if pid in hist:
        prompt_data = hist[pid]["prompt"]
        workflow = prompt_data[2] # The prompt dictionary is usually index 2
        print(f"Node 28 seed: {workflow.get('28', {}).get('inputs', {}).get('seed')}")
        print(f"Node 204 seed: {workflow.get('204', {}).get('inputs', {}).get('seed')}")

if __name__ == "__main__":
    asyncio.run(run())
