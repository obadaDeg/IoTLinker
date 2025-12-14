"""
Device Models
Pydantic models for device-related requests and responses
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from enum import Enum


class DeviceStatus(str, Enum):
    """Device status enumeration"""
    ONLINE = "online"
    OFFLINE = "offline"
    WARNING = "warning"
    ERROR = "error"
    MAINTENANCE = "maintenance"


class LocationModel(BaseModel):
    """Device location"""
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None


class DeviceBase(BaseModel):
    """Base device model"""
    name: str = Field(..., min_length=1, max_length=255, description="Device name")
    description: Optional[str] = Field(None, max_length=1000, description="Device description")
    device_type_id: Optional[str] = Field(None, description="Device type ID (UUID as string)")
    channel_id: Optional[str] = Field(None, description="Channel ID (UUID as string) - devices belong to a channel")
    location: Optional[LocationModel] = Field(None, description="Device location")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Additional metadata")
    configuration: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Device configuration")
    firmware_version: Optional[str] = Field(None, max_length=50, description="Firmware version")


class DeviceCreate(DeviceBase):
    """Model for creating a new device"""
    tenant_id: str  # UUID as string = Field(..., description="Tenant ID (required for creation)")
    channel_id: str = Field(..., description="Channel ID (required) - every device must belong to a channel")


class DeviceUpdate(BaseModel):
    """Model for updating a device"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    device_type_id: Optional[str] = None  # UUID as string
    location: Optional[LocationModel] = None
    metadata: Optional[Dict[str, Any]] = None
    configuration: Optional[Dict[str, Any]] = None
    status: Optional[DeviceStatus] = None
    firmware_version: Optional[str] = Field(None, max_length=50)


class DeviceResponse(DeviceBase):
    """Model for device response"""
    id: str  # UUID as string to allow non-v4 UUIDs from database
    tenant_id: str  # UUID as string
    device_key: str
    status: DeviceStatus
    last_seen: Optional[datetime] = None
    last_ip_address: Optional[str] = None
    created_by: Optional[str] = None  # UUID as string
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DeviceCredentials(BaseModel):
    """Device credentials (returned after creation)"""
    device_id: str  # UUID as string
    device_key: str
    device_secret: str
    mqtt_endpoint: Optional[str] = "mqtt://localhost:1883"


class DeviceListResponse(BaseModel):
    """Paginated list of devices"""
    devices: List[DeviceResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


# =====================================================
# DEVICE DATA MODELS
# =====================================================

class DeviceDataPoint(BaseModel):
    """Single device data point"""
    metric_name: str = Field(..., min_length=1, max_length=100)
    value: float
    unit: Optional[str] = Field(None, max_length=50)
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)
    quality_score: Optional[int] = Field(100, ge=0, le=100)


class DeviceDataBatch(BaseModel):
    """Batch of device data points"""
    device_id: str  # UUID as string
    device_key: str  # For authentication
    data: List[DeviceDataPoint]
    timestamp: Optional[datetime] = None  # If not provided, use server time


class DeviceDataResponse(BaseModel):
    """Device data response"""
    device_id: str  # UUID as string
    metric_name: str
    value: float
    unit: Optional[str]
    time: datetime
    quality_score: int


class DeviceDataQuery(BaseModel):
    """Query parameters for device data"""
    device_id: str  # UUID as string
    metric_name: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    aggregation: Optional[str] = Field(None, pattern="^(none|1m|5m|1h|1d)$")
    limit: Optional[int] = Field(100, ge=1, le=10000)


# =====================================================
# DEVICE TYPES
# =====================================================

class DeviceTypeResponse(BaseModel):
    """Device type response"""
    id: str  # UUID as string
    name: str
    description: Optional[str]
    icon: Optional[str]
    default_configuration: Dict[str, Any]
    sensor_schema: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
