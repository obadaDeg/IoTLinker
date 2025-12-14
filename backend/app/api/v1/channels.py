"""
Channels API Endpoints
RESTful API for managing device channels
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from uuid import UUID
import math
import json

from app.models.channel import Channel, ChannelCreate, ChannelUpdate, ChannelListResponse
from app.database import get_db_connection

router = APIRouter(prefix="/api/v1/channels", tags=["channels"])


@router.get("/", response_model=ChannelListResponse)
async def list_channels(
    tenant_id: UUID = Query(..., description="Tenant ID for filtering"),
    search: Optional[str] = Query(None, description="Search by name or description"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
):
    """
    List all channels for a tenant with pagination and search
    """
    async with get_db_connection() as conn:
        # Build WHERE clause
        where_conditions = ["c.tenant_id = $1"]
        params = [str(tenant_id)]

        if search:
            where_conditions.append("(c.name ILIKE $2 OR c.description ILIKE $2)")
            params.append(f"%{search}%")

        where_clause = " AND ".join(where_conditions)

        # Get total count
        count_query = f"""
            SELECT COUNT(*)
            FROM channels c
            WHERE {where_clause}
        """
        total = await conn.fetchval(count_query, *params)

        # Get paginated channels with device counts
        offset = (page - 1) * page_size
        query = f"""
            SELECT
                c.*,
                COUNT(DISTINCT d.id) FILTER (WHERE d.id IS NOT NULL) as device_count,
                COUNT(DISTINCT d.id) FILTER (WHERE d.status = 'online') as online_count
            FROM channels c
            LEFT JOIN devices d ON d.channel_id = c.id
            WHERE {where_clause}
            GROUP BY c.id
            ORDER BY c.created_at DESC
            LIMIT ${len(params) + 1} OFFSET ${len(params) + 2}
        """

        channels = await conn.fetch(query, *params, page_size, offset)

        total_pages = math.ceil(total / page_size) if total > 0 else 1

        # Parse JSONB fields
        parsed_channels = []
        for channel in channels:
            channel_dict = dict(channel)
            if isinstance(channel_dict.get('metadata'), str):
                channel_dict['metadata'] = json.loads(channel_dict['metadata'])
            parsed_channels.append(Channel(**channel_dict))

        return ChannelListResponse(
            channels=parsed_channels,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages
        )


@router.get("/{channel_id}", response_model=Channel)
async def get_channel(
    channel_id: UUID,
    tenant_id: UUID = Query(..., description="Tenant ID for verification"),
):
    """
    Get a specific channel by ID
    """
    async with get_db_connection() as conn:
        query = """
            SELECT
                c.*,
                COUNT(DISTINCT d.id) FILTER (WHERE d.id IS NOT NULL) as device_count,
                COUNT(DISTINCT d.id) FILTER (WHERE d.status = 'online') as online_count
            FROM channels c
            LEFT JOIN devices d ON d.channel_id = c.id
            WHERE c.id = $1 AND c.tenant_id = $2
            GROUP BY c.id
        """

        channel = await conn.fetchrow(query, str(channel_id), str(tenant_id))

        if not channel:
            raise HTTPException(
                status_code=404,
                detail=f"Channel {channel_id} not found or does not belong to tenant"
            )

        return parse_channel_record(channel)


def parse_channel_record(record) -> Channel:
    """Helper to parse DB record into Channel model"""
    data = dict(record)
    if isinstance(data.get('metadata'), str):
        try:
            data['metadata'] = json.loads(data['metadata'])
        except:
            data['metadata'] = {}
    return Channel(**data)


@router.post("/", response_model=Channel, status_code=201)
async def create_channel(channel: ChannelCreate):
    """
    Create a new channel
    """
    try:
        async with get_db_connection() as conn:
            # Check for duplicate channel name in tenant
            check_query = """
                SELECT id FROM channels
                WHERE tenant_id = $1 AND name = $2
            """
            existing = await conn.fetchval(check_query, str(channel.tenant_id), channel.name)

            if existing:
                raise HTTPException(
                    status_code=400,
                    detail=f"Channel with name '{channel.name}' already exists in this tenant"
                )

            # Insert new channel
            insert_query = """
                INSERT INTO channels (
                    tenant_id, name, description, icon, color, metadata
                )
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
            """

            new_channel = await conn.fetchrow(
                insert_query,
                str(channel.tenant_id),
                channel.name,
                channel.description,
                channel.icon,
                channel.color,
                json.dumps(channel.metadata or {})
            )

            return parse_channel_record(new_channel)
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"CRITICAL API ERROR: {str(e)}"
        )


@router.put("/{channel_id}", response_model=Channel)
async def update_channel(
    channel_id: UUID,
    channel_update: ChannelUpdate,
    tenant_id: UUID = Query(..., description="Tenant ID for verification"),
):
    """
    Update a channel
    """
    async with get_db_connection() as conn:
        # Verify channel exists and belongs to tenant
        check_query = "SELECT id FROM channels WHERE id = $1 AND tenant_id = $2"
        exists = await conn.fetchval(check_query, str(channel_id), str(tenant_id))

        if not exists:
            raise HTTPException(
                status_code=404,
                detail=f"Channel {channel_id} not found or does not belong to tenant"
            )

        # Build update query dynamically
        updates = []
        params = []
        param_count = 1

        if channel_update.name is not None:
            updates.append(f"name = ${param_count}")
            params.append(channel_update.name)
            param_count += 1

        if channel_update.description is not None:
            updates.append(f"description = ${param_count}")
            params.append(channel_update.description)
            param_count += 1

        if channel_update.icon is not None:
            updates.append(f"icon = ${param_count}")
            params.append(channel_update.icon)
            param_count += 1

        if channel_update.color is not None:
            updates.append(f"color = ${param_count}")
            params.append(channel_update.color)
            param_count += 1

        if channel_update.metadata is not None:
            updates.append(f"metadata = ${param_count}")
            params.append(json.dumps(channel_update.metadata))
            param_count += 1

        if not updates:
            # No updates provided, just return existing channel
            return await get_channel(channel_id, tenant_id)

        updates.append(f"updated_at = NOW()")

        query = f"""
            UPDATE channels
            SET {', '.join(updates)}
            WHERE id = ${param_count}
            RETURNING *
        """
        params.append(str(channel_id))

        updated_channel = await conn.fetchrow(query, *params)

        return parse_channel_record(updated_channel)


@router.delete("/{channel_id}", status_code=204)
async def delete_channel(
    channel_id: UUID,
    tenant_id: UUID = Query(..., description="Tenant ID for verification"),
):
    """
    Delete a channel (devices will be reassigned to Uncategorized, not deleted)
    """
    async with get_db_connection() as conn:
        # Verify channel exists and belongs to tenant
        check_query = "SELECT id FROM channels WHERE id = $1 AND tenant_id = $2"
        exists = await conn.fetchval(check_query, str(channel_id), str(tenant_id))

        if not exists:
            raise HTTPException(
                status_code=404,
                detail=f"Channel {channel_id} not found or does not belong to tenant"
            )

        # Delete channel (CASCADE will handle channel_id in devices table via SET NULL)
        delete_query = "DELETE FROM channels WHERE id = $1"
        await conn.execute(delete_query, str(channel_id))

        return None


@router.get("/{channel_id}/devices")
async def get_channel_devices(
    channel_id: UUID,
    tenant_id: UUID = Query(..., description="Tenant ID for verification"),
    status: Optional[str] = Query(None, description="Filter by device status"),
):
    """
    Get all devices in a channel
    """
    async with get_db_connection() as conn:
        # Verify channel exists
        channel_check = "SELECT id FROM channels WHERE id = $1 AND tenant_id = $2"
        channel_exists = await conn.fetchval(channel_check, str(channel_id), str(tenant_id))

        if not channel_exists:
            raise HTTPException(
                status_code=404,
                detail=f"Channel {channel_id} not found"
            )

        # Build query
        where_conditions = ["channel_id = $1"]
        params = [str(channel_id)]

        if status:
            where_conditions.append(f"status = ${len(params) + 1}")
            params.append(status)

        where_clause = " AND ".join(where_conditions)

        query = f"""
            SELECT * FROM devices
            WHERE {where_clause}
            ORDER BY name
        """

        devices = await conn.fetch(query, *params)

        return {"devices": [dict(device) for device in devices]}
