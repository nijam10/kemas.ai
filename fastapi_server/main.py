import uvicorn
from fastapi import FastAPI
from contextlib import asynccontextmanager

from app.core.database import db
from app.api.endpoints import router as api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await db.connect()
    yield
    # Shutdown
    await db.disconnect()

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Kemas.AI Orchestrator",
    description="FastAPI service for ComfyUI generation orchestration",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
