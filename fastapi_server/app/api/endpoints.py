from fastapi import APIRouter, BackgroundTasks, Form, UploadFile, File, HTTPException
from typing import Optional
from app.schemas.generation import GenerateResponse, StatusResponse, StatusResponseData
from app.services.workflow import build_workflow
from app.clients.comfyui import comfy_client
from app.services.orchestrator import process_generation_job, get_job_status, init_job

router = APIRouter()

@router.get("/health")
async def health_check():
    return {"status": "ok", "service": "kemas-fastapi-orchestrator"}

from fastapi.responses import StreamingResponse
import httpx

@router.get("/view")
async def view_image(filename: str, subfolder: str = "", type: str = "output"):
    url = f"{comfy_client.base_url}/view"
    params = {"filename": filename, "subfolder": subfolder, "type": type}
    headers = comfy_client.headers.copy()
    
    async def stream_image():
        async with httpx.AsyncClient() as client:
            async with client.stream("GET", url, params=params, headers=headers) as response:
                if response.status_code != 200:
                    yield b""
                    return
                async for chunk in response.aiter_bytes():
                    yield chunk

    return StreamingResponse(stream_image(), media_type="image/png")

@router.post("/generate", response_model=GenerateResponse)
async def generate_packaging(
    background_tasks: BackgroundTasks,
    job_id: str = Form(...),
    prompt: str = Form(...),
    product_name: str = Form(...),
    brand_category: str = Form(...),
    packaging_type: str = Form(...),
    ingredients: str = Form(...),
    nutrition_fact: str = Form(...),
    brand_message: str = Form(...),
    manufacturer_info: str = Form(...),
    text_color_hex: str = Form(...),
    seed: Optional[int] = Form(None),
    logo: Optional[UploadFile] = File(None),
    barcode: Optional[UploadFile] = File(None),
    mask: Optional[UploadFile] = File(None),
    test_mode: Optional[str] = Form(None)
):
    try:
        if test_mode == "true":
            # Bypassing ComfyUI completely for Load Testing demo
            import asyncio
            await asyncio.sleep(0.5) # Simulate slight processing delay
            return GenerateResponse(success=True, job_id=job_id, status="QUEUED", prompt_id="test_prompt_123")

        import base64
        # 1x1 transparent PNG
        empty_png_bytes = base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==")
        
        async def get_or_upload_fallback(file_obj, default_filename: str):
            if file_obj and getattr(file_obj, "filename", ""):
                file_bytes = await file_obj.read()
                if len(file_bytes) > 0:
                    upload_res = await comfy_client.upload_logo(file_bytes, file_obj.filename, file_obj.content_type or "image/png")
                    return upload_res.get("name") or upload_res.get("filename")
            
            # Fallback if no valid file was uploaded
            upload_res = await comfy_client.upload_logo(empty_png_bytes, default_filename, "image/png")
            return upload_res.get("name") or upload_res.get("filename")

        logo_filename = await get_or_upload_fallback(logo, "empty_logo.png")
        barcode_filename = await get_or_upload_fallback(barcode, "empty_barcode.png")
        mask_filename = await get_or_upload_fallback(mask, "empty_mask.png")

        workflow = build_workflow(
            prompt=prompt,
            product_name=product_name,
            brand_category=brand_category,
            packaging_type=packaging_type,
            ingredients=ingredients,
            nutrition_fact=nutrition_fact,
            brand_message=brand_message,
            manufacturer_info=manufacturer_info,
            text_color_hex=text_color_hex,
            seed=seed,
            logo_filename=logo_filename,
            barcode_filename=barcode_filename,
            mask_filename=mask_filename
        )
        
        submit_res = await comfy_client.submit_prompt(workflow)
        print("=== DEBUG POST /prompt ===")
        print(f"Response: {submit_res}")
        print("==========================")
        
        prompt_id = submit_res.get("prompt_id")
        
        if not prompt_id:
            raise HTTPException(status_code=500, detail="Failed to retrieve prompt_id from ComfyUI")
            
        # Init in-memory store job
        init_job(job_id, prompt_id)

        # Trigger background polling
        background_tasks.add_task(process_generation_job, job_id, prompt_id)

        return GenerateResponse(success=True, job_id=job_id, status="QUEUED", prompt_id=prompt_id)
        
    except Exception as e:
        print(f"Exception in generate_packaging: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status/{job_id}", response_model=StatusResponse)
async def get_status(job_id: str):
    job_state = get_job_status(job_id)
    
    if not job_state:
        raise HTTPException(status_code=404, detail="Job not found")
        
    return StatusResponse(
        success=True,
        data=StatusResponseData(
            jobId=job_id,
            status=job_state["status"],
            currentStep=job_state.get("currentStep"),
            master_wrapper_url=job_state.get("master_wrapper_url"),
            front_mockup_url=job_state.get("front_mockup_url"),
            errorMessage=job_state.get("errorMessage")
        )
    )

from pydantic import BaseModel
class UpscaleRequest(BaseModel):
    job_id: str
    filename: str
    subfolder: str = ""
    folder_type: str = "output"

from app.schemas.generation import UpscaleResponse
from app.services.upscale_workflow import build_upscale_workflow

@router.post("/upscale", response_model=UpscaleResponse)
async def upscale_image(
    req: UpscaleRequest,
    background_tasks: BackgroundTasks
):
    try:
        # 1. Download image from comfy output
        img_url = f"{comfy_client.base_url}/view"
        params = {"filename": req.filename, "subfolder": req.subfolder, "type": req.folder_type}
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.get(img_url, params=params, headers=comfy_client.headers)
            resp.raise_for_status()
            img_bytes = resp.content

        # 2. Upload to comfy input
        upload_res = await comfy_client.upload_logo(img_bytes, f"to_upscale_{req.filename}", "image/png")
        new_filename = upload_res.get("name") or upload_res.get("filename")

        # 3. Build upscale workflow
        workflow = build_upscale_workflow(new_filename)

        # 4. Submit prompt
        submit_res = await comfy_client.submit_prompt(workflow)
        prompt_id = submit_res.get("prompt_id")
        
        if not prompt_id:
            raise HTTPException(status_code=500, detail="Failed to retrieve prompt_id for upscale")

        # 5. Initialize job for orchestrator polling
        init_job(req.job_id, prompt_id)
        background_tasks.add_task(process_generation_job, req.job_id, prompt_id)

        return UpscaleResponse(success=True, job_id=req.job_id, status="QUEUED", prompt_id=prompt_id)
        
    except Exception as e:
        print(f"Exception in upscale_image: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
