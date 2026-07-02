import json
import os
import random
from typing import Dict, Any, Optional

def build_workflow(
    prompt: str,
    product_name: str,
    brand_category: str,
    packaging_type: str,
    ingredients: str,
    nutrition_fact: str,
    brand_message: str,
    manufacturer_info: str,
    text_color_hex: str,
    seed: Optional[int] = None,
    logo_filename: Optional[str] = None,
    barcode_filename: Optional[str] = None,
    mask_filename: Optional[str] = None
) -> Dict[str, Any]:
    # Path relative to the main app execution (assuming running from fastapi_server dir)
    workflow_path = os.path.join(os.path.dirname(__file__), "../../../workflows/kemasai_full_workflow_2d_to_seeded_3d_front_api.json")
    
    if not os.path.exists(workflow_path):
        raise FileNotFoundError(f"Workflow JSON not found at {workflow_path}. Please place the file in the workflows directory.")

    with open(workflow_path, "r", encoding="utf-8") as f:
        workflow = json.load(f)

    # 1. Generate random seed if not provided
    actual_seed = seed if seed is not None else random.randint(1, 1000000000000)

    # 2. Build Context Prompt
    # Sanitize the visual prompt for 3D so Flux doesn't get confused by 2D layout instructions
    import re
    sanitized_prompt_3d = re.sub(r'(?i)\b(2d|flat|layout|wrapper|orthographic|seamless|pure 2d|digital art|single-frame)\b', '', prompt)
    sanitized_prompt_3d = re.sub(r'\s+', ' ', sanitized_prompt_3d).strip()

    context_prefix_3d = f"Product: {product_name}, Category: {brand_category}, Packaging: {packaging_type}. Visual theme based on: {sanitized_prompt_3d}. "
    context_prefix_2d = f"Product: {product_name}, Category: {brand_category}. User Visual Prompt: {prompt}. "
    
    actual_text_color = text_color_hex if text_color_hex else "#332211"

    # 4. Inject explicitly by Node ID
    # Clean, generic layout instruction for 2D Wrapper (DO NOT mention pouch or box here, or Flux will draw it in 3D!)
    generic_2d_instruction = (
        f"IMPORTANT: THIS IS A DIGITAL PRINT FILE, NOT A PHYSICAL MOCKUP. DO NOT DRAW A BAG OR POUCH. "
        f"A fully unrolled, continuous flat 2D vector graphic design layout canvas, landscape orientation. "
        f"CENTER FRONT PANEL: large bold title \"{product_name}\" centered prominently. "
        f"LEFT AND RIGHT OUTER AREAS: reserved for back and side information layout. "
        f"Strictly flat orthographic design, pure 2D digital art, NO 3D elements, NO perspective, NO physical objects."
    )
    
    # Node 29: 2D positive prompt
    if "29" in workflow:
        workflow["29"]["inputs"]["text"] = f"{context_prefix_2d}. {generic_2d_instruction}"

    # Node 30: 2D negative prompt
    if "30" in workflow:
        workflow["30"]["inputs"]["text"] = "3D, physical object, product photography, shadow, lighting, perspective, depth, folded bag, standing pouch, glossy plastic bag, wrinkles, watermark, distorted layout, physical wrapper, realistic packaging, crimped edges"

    # Node 28: seed 2D (Use a DIFFERENT seed from 3D to prevent shape/composition bleed)
    if "28" in workflow:
        workflow["28"]["inputs"]["seed"] = actual_seed + 1000
        workflow["28"]["inputs"]["steps"] = 20

    # Node 57: logo image
    if logo_filename and "57" in workflow:
        workflow["57"]["inputs"]["image"] = logo_filename

    # Node 59: mask image
    if mask_filename and "59" in workflow:
        workflow["59"]["inputs"]["image"] = mask_filename

    # Node 100: barcode image
    if barcode_filename and "100" in workflow:
        workflow["100"]["inputs"]["image"] = barcode_filename

    # Node 107: KemasFullLayoutBuilder
    if "107" in workflow:
        workflow["107"]["inputs"]["left_text_1"] = ingredients.replace("\r\n", "\n")
        workflow["107"]["inputs"]["left_text_2"] = nutrition_fact.replace("\r\n", "\n")
        workflow["107"]["inputs"]["right_text_1"] = brand_message.replace("\r\n", "\n")
        workflow["107"]["inputs"]["right_text_2"] = manufacturer_info.replace("\r\n", "\n")
        workflow["107"]["inputs"]["text_color_hex"] = actual_text_color

    # Node 201: 3D Front Mockup positive prompt
    if "201" in workflow:
        workflow["201"]["inputs"]["text"] = (
            f"{context_prefix_3d}. A realistic 3D stand-up {packaging_type} mockup, front-facing, centered composition, "
            f"studio product photography, sharp focus, crisp details, everywhere in focus. The pouch features the same visual identity as the flat front design "
            f"with the large title \"{product_name}\". The bag is a realistic laminated plastic snack pouch with "
            f"subtle natural wrinkles, sealed top and bottom edges, soft studio lighting, soft shadow on a clean "
            f"white background, premium professional packaging mockup. Full body, entire pouch completely visible in frame, zoomed out, very wide margin, plenty of negative space around the object, centered, no cropping. Front design only."
        )

    # Node 202: 3D negative prompt
    if "202" in workflow:
        workflow["202"]["inputs"]["text"] = "cropped, cut off, out of frame, borders, margins, zoomed in, close up, bottom cut off, top cut off, edge of frame, blur, blurry, out of focus, depth of field, bokeh, low resolution, pixelated, soft focus"

    # Node 203: 3D Latent Resolution (Fix Flux blurriness by staying close to 1MP)
    if "203" in workflow:
        workflow["203"]["inputs"]["width"] = 1024
        workflow["203"]["inputs"]["height"] = 1024

    # Node 204: seed 3D and reduce steps for speed, fix CFG to 1.0 for Flux
    if "204" in workflow:
        workflow["204"]["inputs"]["seed"] = actual_seed
        workflow["204"]["inputs"]["steps"] = 35
        workflow["204"]["inputs"]["cfg"] = 1.0

    # Node 54: Logo Opacity and Bypass Upscaler
    if "54" in workflow:
        workflow["54"]["inputs"]["opacity"] = 1.0
        # Re-enabled upscaler (removed bypass) to fix blurry 2D wrapper issue

    # Remove PreviewImage nodes to prevent duplicate temp images
    if "105" in workflow:
        del workflow["105"]
    if "206" in workflow:
        del workflow["206"]

    # Debug: Save the final workflow to a file
    debug_path = os.path.join(os.path.dirname(__file__), "debug_final_workflow.json")
    with open(debug_path, "w", encoding="utf-8") as df:
        json.dump(workflow, df, indent=2)

    return workflow
