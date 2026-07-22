import httpx
from typing import Dict, Any, List
from app.core.config import settings

class ComfyUIClient:
    def __init__(self):
        self.base_url = settings.COMFYUI_BASE_URL.rstrip("/")
        self.client_id = settings.COMFYUI_CLIENT_ID
        self.headers = {
            "ngrok-skip-browser-warning": "69420"
        }
        if settings.COMFYUI_API_KEY:
            self.headers["Authorization"] = f"Bearer {settings.COMFYUI_API_KEY}"

    async def upload_logo(self, file_bytes: bytes, filename: str, content_type: str) -> Dict[str, Any]:
        url = f"{self.base_url}/upload/image"
        files = {
            "image": (filename, file_bytes, content_type)
        }
        data = {
            "type": "input",
            "overwrite": "true"
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, headers=self.headers, files=files, data=data)
            response.raise_for_status()
            return response.json()

    async def submit_prompt(self, workflow: Dict[str, Any]) -> Dict[str, Any]:
        url = f"{self.base_url}/prompt"
        payload = {
            "prompt": workflow,
            "client_id": self.client_id
        }
        headers = self.headers.copy()
        headers["Content-Type"] = "application/json"
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status()
            return response.json()

    async def get_history(self, prompt_id: str) -> Dict[str, Any]:
        url = f"{self.base_url}/history/{prompt_id}"
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(url, headers=self.headers)
            if response.status_code == 404:
                return {} # Not completed yet or invalid
            response.raise_for_status()
            return response.json()

    def get_image_url(self, filename: str, subfolder: str, folder_type: str) -> str:
        # Use relative Next.js proxy route to bypass ngrok warnings and HTTPS mixed content issues
        return f"/api/image?filename={filename}&subfolder={subfolder}&type={folder_type}"

comfy_client = ComfyUIClient()
