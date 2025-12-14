"""
Channel Models
For organizing devices into channels (similar to ThingSpeak channels)
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional, Dict, Any
from datetime import datetime
from uuid import UUID


class ChannelBase(BaseModel):
    """Base channel model with common fields"""
    name: str = Field(..., min_length=1, max_length=255, description="Channel name")
    description: Optional[str] = Field(None, description="Channel description")
    icon: Optional[str] = Field(None, max_length=50, description="Emoji or icon identifier")
    color: Optional[str] = Field(None, max_length=50, description="Color theme")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Additional metadata")


class ChannelCreate(ChannelBase):
    """Model for creating a new channel"""
    tenant_id: UUID = Field(..., description="Tenant ID for multi-tenancy")


class ChannelUpdate(BaseModel):
    """Model for updating a channel"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    icon: Optional[str] = Field(None, max_length=50)
    color: Optional[str] = Field(None, max_length=50)
    metadata: Optional[Dict[str, Any]] = None


class Channel(ChannelBase):
    """Complete channel model with all fields"""
    id: UUID
    tenant_id: UUID
    created_by: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    # Computed fields (from queries)
    device_count: Optional[int] = Field(None, description="Number of devices in this channel")
    online_count: Optional[int] = Field(None, description="Number of online devices")

    model_config = {
        "from_attributes": True,
        "json_schema_extra": {
            "example": {
                "id": "70000000-0000-0000-0000-000000000001",
                "tenant_id": "10000000-0000-0000-0000-000000000001",
                "name": "Smart Farm",
                "description": "Agricultural IoT devices",
                "icon": "🌾",
                "color": "green",
                "metadata": {},
                "device_count": 5,
                "online_count": 3,
                "created_at": "2024-01-01T00:00:00Z",
                "updated_at": "2024-01-01T00:00:00Z"
            }
        }
    }


class ChannelListResponse(BaseModel):
    """Response model for list of channels"""
    channels: list[Channel]
    total: int
    page: int
    page_size: int
    total_pages: int
