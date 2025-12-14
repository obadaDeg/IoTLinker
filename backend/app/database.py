"""
Database Connection and Utilities
Provides Supabase client and database connection helpers
"""

from supabase import create_client, Client
from app.config import settings
from typing import Optional
import asyncpg
from contextlib import asynccontextmanager


# Supabase Client (singleton)
_supabase_client: Optional[Client] = None


def get_supabase() -> Client:
    """
    Get Supabase client instance (singleton pattern)

    Returns:
        Client: Supabase client
    """
    global _supabase_client

    if _supabase_client is None:
        # Create Supabase client without options to avoid proxy issues
        _supabase_client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_KEY
        )

    return _supabase_client


# AsyncPG Connection Pool
_db_pool: Optional[asyncpg.Pool] = None


async def init_db_pool():
    """Initialize database connection pool"""
    global _db_pool

    if _db_pool is None:
        _db_pool = await asyncpg.create_pool(
            dsn=settings.DATABASE_URL,
            min_size=2,
            max_size=10,
            command_timeout=60
        )

    return _db_pool


async def close_db_pool():
    """Close database connection pool"""
    global _db_pool

    if _db_pool is not None:
        await _db_pool.close()
        _db_pool = None


@asynccontextmanager
async def get_db_connection():
    """
    Get database connection from pool (async context manager)

    Usage:
        async with get_db_connection() as conn:
            result = await conn.fetch("SELECT * FROM devices")
    """
    pool = await init_db_pool()
    async with pool.acquire() as connection:
        yield connection


async def execute_query(query: str, *args):
    """
    Execute a query and return results

    Args:
        query: SQL query string
        *args: Query parameters

    Returns:
        List of records
    """
    async with get_db_connection() as conn:
        return await conn.fetch(query, *args)


async def execute_one(query: str, *args):
    """
    Execute a query and return single result

    Args:
        query: SQL query string
        *args: Query parameters

    Returns:
        Single record or None
    """
    async with get_db_connection() as conn:
        return await conn.fetchrow(query, *args)


async def execute_write(query: str, *args):
    """
    Execute a write query (INSERT, UPDATE, DELETE)

    Args:
        query: SQL query string
        *args: Query parameters

    Returns:
        Status message
    """
    async with get_db_connection() as conn:
        return await conn.execute(query, *args)
