# Kemas.ai — ComfyUI Generation Implementation

**Date:** May 2026  
**Build:** ✅ PASS (30 routes)

---

## Files Created

| File | Purpose |
|------|---------|
| `lib/comfyui.ts` | ComfyUI HTTP client — submitPrompt, getHistory, getImageUrl, getQueueStatus |
| `lib/workflow.ts` | Workflow loader + input injector (prompt, packagingType, business context) |
| `workflows/kemas-packaging-api.json` | ComfyUI API-format workflow template (replace with real export) |
| `app/api/generate/route.ts` | POST /api/generate — auth, credit check, create Design+Job, submit to ComfyUI |
| `app/api/generate/[designId]/status/route.ts` | GET /api/generate/[designId]/status — poll ComfyUI, deduct credits on completion |

## Files Modified

| File | Change |
|------|--------|
| `app/(user)/generate/page.tsx` | Real POST /api/generate submission, loading state, redirect to /preview/[designId] |
| `app/(user)/preview/[id]/page.tsx` | Polls /api/generate/[designId]/status every 4s, shows real image, processing/failed states |
| `app/(user)/history/page.tsx` | Real status badges (COMPLETED/PROCESSING/FAILED), shows thumbnailUrl if available |
| `components/generation/recent-history-panel.tsx` | Shows latest 3 real designs from useDesigns() hook with status icons |
| `.env.example` | Added COMFYUI_BASE_URL, COMFYUI_CLIENT_ID, COMFYUI_API_KEY |

---

## Environment Variables

```env
COMFYUI_BASE_URL="https://your-kaggle-tunnel.ngrok-free.app"
COMFYUI_CLIENT_ID="kemas-ai-server"
COMFYUI_API_KEY=""   # optional Bearer token
```

---

## ComfyUI Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/prompt` | POST | Submit workflow, get prompt_id |
| `/history/{promptId}` | GET | Poll job status + get output filenames |
| `/view?filename=&subfolder=&type=output` | GET | Download/proxy output image |
| `/queue` | GET | Optional: check queue depth |

---

## Workflow Node IDs (update after real export)

| Variable | Default | Description |
|----------|---------|-------------|
| `PROMPT_NODE_ID` | `"6"` | CLIPTextEncode node for positive prompt |
| `SEED_NODE_ID` | `"3"` | KSampler node (randomised per generation) |

**To update:** Export your workflow from ComfyUI using "Save (API Format)" in Dev Mode, replace `workflows/kemas-packaging-api.json`, then update `PROMPT_NODE_ID` and `SEED_NODE_ID` in `lib/workflow.ts`.

---

## Credit Deduction Behavior

| Event | Credits |
|-------|---------|
| POST /api/generate (submit) | ❌ Not deducted |
| ComfyUI QUEUED / RUNNING | ❌ Not deducted |
| ComfyUI COMPLETED | ✅ -10 credits (idempotent — checks for existing CreditTransaction) |
| ComfyUI FAILED | ❌ Not deducted |
| Server unavailable | ❌ Not deducted |

**Idempotency:** Before deducting, the status route checks for an existing `CreditTransaction` with `referenceId = designId` and `type = GENERATION_USAGE`. If found, skips deduction. This prevents double-charging if the status endpoint is called multiple times after completion.

---

## Generation Flow

```
User clicks Generate
  → POST /api/generate
    → Auth check (session.user.id)
    → Validate prompt (≥10 chars) + packagingType
    → Check CreditWallet.balance ≥ 10
    → Create Design (PROCESSING) + GenerationJob (QUEUED)
    → buildWorkflow() — inject prompt + packagingType + business context
    → submitPrompt() → ComfyUI /prompt
    → Store prompt_id in GenerationJob.runpodJobId
    → Update job to RUNNING
    → Return { designId, jobId, promptId }
  → Redirect to /preview/[designId]

Preview page polls every 4 seconds:
  → GET /api/generate/[designId]/status
    → If COMPLETED/FAILED in DB → return immediately
    → Else → getHistory(promptId) from ComfyUI
      → QUEUED/RUNNING → return PROCESSING
      → FAILED → update DB, return FAILED (no credit deduction)
      → COMPLETED → save imageUrl, deduct 10 credits (idempotent), return COMPLETED
```

---

## Known Kaggle Limitations

1. **Session timeout:** Kaggle notebooks shut down after ~12 hours of inactivity. The tunnel URL changes each session — update `COMFYUI_BASE_URL` in `.env` each time.

2. **Cold start:** First request after idle may take 30–60 seconds while ComfyUI loads the model.

3. **No persistent storage:** Generated images are stored in ComfyUI's output folder on the Kaggle VM. If the session restarts, old image URLs become invalid. For production, download images and store in S3/Cloudinary.

4. **Queue depth:** Kaggle runs on a single GPU. Concurrent requests queue up. The status polling handles this correctly (QUEUED → RUNNING → COMPLETED).

5. **HTTPS:** ngrok/cloudflared tunnels provide HTTPS automatically. Ensure `COMFYUI_BASE_URL` uses `https://`.

6. **Rate limits:** Kaggle free tier has GPU quota limits. Monitor usage.

---

## How to Set Up Kaggle ComfyUI

1. Create a Kaggle notebook with GPU accelerator enabled.
2. Install ComfyUI: `!git clone https://github.com/comfyanonymous/ComfyUI && pip install -r ComfyUI/requirements.txt`
3. Start ComfyUI: `!python ComfyUI/main.py --listen 0.0.0.0 --port 8188 &`
4. Expose with ngrok: `!ngrok http 8188` (requires ngrok authtoken)
5. Copy the ngrok URL to `COMFYUI_BASE_URL` in `.env`.
6. Export your workflow in API format and replace `workflows/kemas-packaging-api.json`.
7. Update node IDs in `lib/workflow.ts`.

---

## Build Status

✅ `npm run build` — PASS (30 routes, 0 TypeScript errors)
