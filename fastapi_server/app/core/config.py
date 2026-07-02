from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Will read from DATABASE_URL in .env
    # Format: postgresql://user:password@localhost:5432/db_name
    # Since Prisma uses postgresql, asyncpg uses the same URL format typically,
    # but we might need postgresql+asyncpg for SQLAlchemy. We use raw asyncpg here.
    DATABASE_URL: str = "postgresql://neondb_owner:npg_qV1x5ZPLNfjM@ep-flat-boat-aosg27me.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
    
    # ComfyUI configuration
    COMFYUI_BASE_URL: str = "https://guru-wool-lived.ngrok-free.dev"
    COMFYUI_CLIENT_ID: str = "kemas-fastapi-server"
    COMFYUI_API_KEY: str = ""
    
    class Config:
        env_file = "../.env" # Use the Next.js .env file
        extra = "ignore"

settings = Settings()
