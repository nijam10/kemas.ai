import asyncio
from datetime import datetime
from typing import Optional, Dict, Any
from app.clients.comfyui import comfy_client

# In-memory store for jobs
in_memory_jobs: Dict[str, Dict[str, Any]] = {}

def get_job_status(job_id: str) -> Optional[Dict[str, Any]]:
    return in_memory_jobs.get(job_id)

def init_job(job_id: str, prompt_id: str):
    in_memory_jobs[job_id] = {
        "status": "queued",
        "prompt_id": prompt_id,
        "master_wrapper_url": None,
        "front_mockup_url": None,
        "errorMessage": None,
        "currentStep": "QUEUED"
    }

async def process_generation_job(job_id: str, prompt_id: str):
    """
    Background task to poll ComfyUI and update in-memory job store.
    """
    max_retries = 1200 # 1200 * 5s = 100 mins timeout
    
    if job_id not in in_memory_jobs:
        init_job(job_id, prompt_id)
        
    in_memory_jobs[job_id]["status"] = "processing"
    in_memory_jobs[job_id]["currentStep"] = "COMFYUI_PIPELINE"
    
    try:
        for _ in range(max_retries):
            await asyncio.sleep(5)
            
            try:
                history = await comfy_client.get_history(prompt_id)
            except Exception as loop_e:
                print(f"[{job_id}] Transient error during poll: {repr(loop_e)}")
                continue

            if not history:
                print(f"[{job_id}] History empty or 404 for prompt_id {prompt_id}. Still processing...")
                continue
                
            print("=== DEBUG GET /history ===")
            print(f"History Keys: {list(history.keys())}")
            if prompt_id in history:
                entry = history[prompt_id]
                status_obj = entry.get("status", {})
                print(f"Status obj: {status_obj}")
                
                if status_obj.get("status_str") == "error":
                    error_msg = status_obj.get("messages", "Unknown error")
                    raise Exception(f"ComfyUI reported an error: {error_msg}")
                    
                if status_obj.get("completed"):
                    outputs = entry.get("outputs", {})
                    
                    master_wrapper_url = None
                    front_mockup_url = None
                
                    # Attempt to find exactly based on filenames or node IDs
                    for node_id, node_output in outputs.items():
                        if "images" not in node_output:
                            continue
                            
                        for img in node_output["images"]:
                            filename = img.get("filename", "")
                            url = comfy_client.get_image_url(filename, img.get("subfolder", ""), img.get("type", "output"))
                            
                            # Identify by known Node IDs first
                            if node_id in ("120", "105", "4") and not master_wrapper_url:
                                master_wrapper_url = url
                            elif node_id in ("207", "206") and not front_mockup_url:
                                front_mockup_url = url
                            # Identify by filename heuristics if Node IDs changed
                            elif ("master_wrapper" in filename.lower() or "kemas_upscale" in filename.lower()) and not master_wrapper_url:
                                master_wrapper_url = url
                            elif "front_mockup" in filename.lower() and not front_mockup_url:
                                front_mockup_url = url

                    # Generic Fallback: if we STILL couldn't find them by name or ID, fallback to first and last
                    if not master_wrapper_url or not front_mockup_url:
                        all_images = []
                        for node_id, node_output in outputs.items():
                            if "images" in node_output:
                                for img in node_output["images"]:
                                    all_images.append(comfy_client.get_image_url(img["filename"], img.get("subfolder", ""), img.get("type", "output")))
                        
                        if not master_wrapper_url and len(all_images) >= 1:
                            master_wrapper_url = all_images[0] # Take first
                        if not front_mockup_url and len(all_images) >= 2:
                            front_mockup_url = all_images[-1] # Take last

                    in_memory_jobs[job_id]["status"] = "completed"
                    in_memory_jobs[job_id]["currentStep"] = "COMPLETED"
                    in_memory_jobs[job_id]["master_wrapper_url"] = master_wrapper_url
                    in_memory_jobs[job_id]["front_mockup_url"] = front_mockup_url
                    return

        # Timeout
        raise Exception("Generation timed out")
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        in_memory_jobs[job_id]["status"] = "failed"
        in_memory_jobs[job_id]["currentStep"] = "FAILED"
        in_memory_jobs[job_id]["errorMessage"] = repr(e)
