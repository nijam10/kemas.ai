import asyncio
import httpx
from app.core.config import settings

async def run():
    url = f"{settings.COMFYUI_BASE_URL.rstrip('/')}/history"
    async with httpx.AsyncClient() as client:
        res = await client.get(url)
        hist = res.json()
        
    if not hist:
        print("No history")
        return
        
    prompt_ids = list(hist.keys())[-5:]
    
    for pid in prompt_ids:
        entry = hist[pid]
        outputs = entry.get("outputs", {})
        print(f"Prompt ID: {pid}")
        print("Outputs keys:", list(outputs.keys()))
        for k in outputs.keys():
            if "images" in outputs[k]:
                for img in outputs[k]["images"]:
                    print(f"  Node {k} image: {img.get('filename')}")
        print("-" * 20)

if __name__ == "__main__":
    asyncio.run(run())
