import uuid
import random
from locust import HttpUser, task, between

class KemasAIUser(HttpUser):
    # Wait time between tasks: 1 to 3 seconds
    wait_time = between(1, 3)

    @task(3)
    def generate_design(self):
        """
        Simulates a user requesting a new AI packaging design.
        Hits the FastAPI /generate endpoint directly (bypassing Next.js credits for load testing).
        """
        job_id = str(uuid.uuid4())
        
        # Payload matched to the FastAPI /generate endpoint
        data = {
            "job_id": job_id,
            "prompt": "A modern, minimalist packaging for organic roasted coffee beans, warm earthy tones",
            "product_name": f"Coffee {random.randint(100, 999)}",
            "brand_category": "Premium Coffee",
            "packaging_type": random.choice(["standing-pouch", "box"]),
            "ingredients": "100% Arabica Coffee Beans",
            "nutrition_fact": "Calories 0, Fat 0g",
            "brand_message": "Sustainable and Organic",
            "manufacturer_info": "Kemas.AI Roasters",
            "text_color_hex": "#FFFFFF"
        }
        
        # Files are optional, but we must send multipart/form-data
        with self.client.post("/generate", data=data, catch_response=True) as response:
            if response.status_code == 200:
                response.success()
                
                # After submitting, simulate the frontend polling for status
                # We do a quick check just to hit the status API as well
                self.client.get(f"/status/{job_id}", name="/status/[job_id]")
            else:
                response.failure(f"Failed to generate: {response.text}")

    @task(1)
    def fetch_3d_texture(self):
        """
        Simulates the WebGL canvas fetching a texture image from the server.
        Hits the /view endpoint.
        """
        # We request a known lightweight fallback image to test connection handling
        params = {
            "filename": "empty_logo.png",
            "subfolder": "",
            "type": "output"
        }
        
        with self.client.get("/view", params=params, catch_response=True, name="/view?filename=...") as response:
            # Note: If ComfyUI is not running, this might 404 or 500 depending on FastAPI proxy setup.
            # For load testing the orchestrator connection queue, even a failing backend validates orchestrator resilience.
            if response.status_code in [200, 404, 500, 502]:
                response.success()
            else:
                response.failure(f"Unexpected status: {response.status_code}")

    def on_start(self):
        """
        Executed when a virtual user starts.
        """
        # Can be used to login if we were hitting Next.js instead of FastAPI directly.
        self.client.get("/health", name="/health")
