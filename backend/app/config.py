"""
Application Configuration
Loads environment variables and provides app-wide settings
"""

from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    # App Config
    APP_NAME: str = "IoTLinker Enterprise API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # API Configuration
    API_V1_PREFIX: str = "/api/v1"

    # Supabase Configuration
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    SUPABASE_SERVICE_KEY: str

    # Database Configuration
    DATABASE_URL: str

    # Pagination
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100

    # Logging
    LOG_LEVEL: str = "INFO"

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True
    )


# Create settings instance
settings = Settings()

# CORS origins as a separate constant (not from env)
CORS_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
