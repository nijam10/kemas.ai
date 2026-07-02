import asyncio
from app.clients.comfyui import comfy_client

async def run():
    hist = await comfy_client.get_history("")
    if not hist:
        print("No history")
        return
    
    last_entry = list(hist.values())[-1]
    outputs = last_entry.get("outputs", {})
    print("Outputs keys:", list(outputs.keys()))
    print("Node 120 in outputs?", "120" in outputs)
    print("Node 207 in outputs?", "207" in outputs)
    if "120" in outputs:
        print("Node 120:", outputs["120"])
    if "207" in outputs:
        print("Node 207:", outputs["207"])

if __name__ == "__main__":
    asyncio.run(run())
