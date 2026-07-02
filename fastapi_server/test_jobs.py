import json
from app.services.orchestrator import in_memory_jobs

if __name__ == "__main__":
    for jid, job in in_memory_jobs.items():
        print(f"Job: {jid}")
        print(f"Status: {job.get('status')}")
        print(f"Master: {job.get('master_wrapper_url')}")
        print(f"Mockup: {job.get('front_mockup_url')}")
        print("-----")
