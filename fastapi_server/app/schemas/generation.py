from pydantic import BaseModel
from typing import Optional

class GenerateResponse(BaseModel):
    success: bool
    job_id: str
    status: str
    prompt_id: Optional[str] = None

class StatusResponseData(BaseModel):
    jobId: str
    status: str
    currentStep: Optional[str] = None
    master_wrapper_url: Optional[str] = None
    front_mockup_url: Optional[str] = None
    errorMessage: Optional[str] = None

class StatusResponse(BaseModel):
    success: bool
    data: StatusResponseData

class UpscaleResponse(BaseModel):
    success: bool
    job_id: str
    status: str
    prompt_id: Optional[str] = None
