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
        
    prompt_id = list(hist.keys())[-1]
    last_entry = hist[prompt_id]
    outputs = last_entry.get("outputs", {})
    
    print(f"Prompt ID: {prompt_id}")
    print("Outputs keys:", list(outputs.keys()))
    print("Node 120:", outputs.get("120"))
    print("Node 207:", outputs.get("207"))
    
    # Let's print all image filenames
    for node_id, node_output in outputs.items():
        if "images" in node_output:
            for img in node_output["images"]:
                print(f"Node {node_id} image: {img['filename']}")

if __name__ == "__main__":
    asyncio.run(run())
