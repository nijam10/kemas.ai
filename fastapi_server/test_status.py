import asyncio
import httpx
from app.core.config import settings

async def run():
    url = f"{settings.COMFYUI_BASE_URL.rstrip('/')}/history"
    async with httpx.AsyncClient() as client:
        res = await client.get(url)
        hist = res.json()
        
    pid = list(hist.keys())[-1]
    entry = hist[pid]
    print("Keys in entry:", list(entry.keys()))
    if "status" in entry:
        print("Status object:", entry["status"])
    else:
        print("NO STATUS KEY!")
        
    print("Outputs keys:", list(entry.get("outputs", {}).keys()))
    executed_nodes = entry.get("prompt", [None, None, None])[2]
    try:
        print("Nodes to execute:", executed_nodes)
    except Exception:
        print("Nodes to execute:", str(executed_nodes).encode('utf-8'))

if __name__ == "__main__":
    asyncio.run(run())
