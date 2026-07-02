import asyncio
import httpx
from app.core.config import settings
import json

async def run():
    url = f"{settings.COMFYUI_BASE_URL.rstrip('/')}/history"
    async with httpx.AsyncClient() as client:
        res = await client.get(url)
        hist = res.json()
        
    pid = "2e7901d5-3146-4e9f-af81-f39faacf545f"
    if pid in hist:
        entry = hist[pid]
        print(f"Prompt JSON for {pid}:")
        print(json.dumps(entry.get("prompt", {}), indent=2))

if __name__ == "__main__":
    asyncio.run(run())
