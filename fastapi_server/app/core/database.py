import asyncpg
print("<<<<<<<< DATABASE.PY LOADED >>>>>>>>")
from typing import Optional
from app.core.config import settings


class Database:
    def __init__(self):
        self.pool: Optional[asyncpg.Pool] = None

    async def connect(self):
        try:
            # Read database URL from settings
            db_url = settings.DATABASE_URL

            print("\n" + "=" * 80)
            print("DATABASE_URL USED BY FASTAPI:")
            print(db_url)
            print("=" * 80 + "\n")

            # Fix postgres:// URLs if needed
            if db_url.startswith("postgres://"):
                db_url = db_url.replace("postgres://", "postgresql://", 1)

            self.pool = await asyncpg.create_pool(
                dsn=db_url,
                min_size=1,
                max_size=10,
                command_timeout=60,
            )

            print("[SUCCESS] Successfully connected to the PostgreSQL database.")

        except Exception as e:
            print(f"[ERROR] Failed to connect to the database: {e}")
            raise e

    async def disconnect(self):
        if self.pool:
            await self.pool.close()
            print("[INFO] Disconnected from the PostgreSQL database.")

    async def execute(self, query: str, *args):
        if not self.pool:
            raise Exception("Database pool is not initialized")

        async with self.pool.acquire() as connection:
            return await connection.execute(query, *args)

    async def fetchrow(self, query: str, *args):
        if not self.pool:
            raise Exception("Database pool is not initialized")

        async with self.pool.acquire() as connection:
            return await connection.fetchrow(query, *args)

    async def fetch(self, query: str, *args):
        if not self.pool:
            raise Exception("Database pool is not initialized")

        async with self.pool.acquire() as connection:
            return await connection.fetch(query, *args)

    async def fetchval(self, query: str, *args):
        if not self.pool:
            raise Exception("Database pool is not initialized")

        async with self.pool.acquire() as connection:
            return await connection.fetchval(query, *args)


db = Database()