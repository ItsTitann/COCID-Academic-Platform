import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "COCID AI Services"
    app_env: str = os.getenv("APP_ENV", "development")
    port: int = int(os.getenv("PORT", "8000"))
    host: str = os.getenv("HOST", "0.0.0.0")
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://localhost:5000",
    ]

    class Config:
        env_file = ".env"

settings = Settings()
