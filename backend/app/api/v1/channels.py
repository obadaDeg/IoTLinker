from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from typing import List, Optional
from supabase import create_client, Client
import os

router = APIRouter(prefix="/api/v1/channels", tags=["channels"])

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

class Channel(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    is_public: bool = False

class ChannelCreate(BaseModel):
    name: str
    description: Optional[str] = None
    is_public: bool = False

class ChannelUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_public: Optional[bool] = None

@router.get("/", response_model=List[Channel])
async def list_channels():
    response = supabase.table("channels").select("*").execute()
    if response.error:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=response.error.message)
    return response.data

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=Channel)
async def create_channel(channel: ChannelCreate):
    response = supabase.table("channels").insert(channel.dict()).execute()
    if response.error:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=response.error.message)
    return response.data[0]

@router.get("/{channel_id}", response_model=Channel)
async def get_channel(channel_id: int):
    response = supabase.table("channels").select("*").eq("id", channel_id).execute()
    if response.error:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=response.error.message)
    if not response.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Channel not found")
    return response.data[0]

@router.put("/{channel_id}", response_model=Channel)
async def update_channel(channel_id: int, channel_update: ChannelUpdate):
    response = supabase.table("channels").update(channel_update.dict(exclude_unset=True)).eq("id", channel_id).execute()
    if response.error:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=response.error.message)
    if not response.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Channel not found")
    return response.data[0]

@router.delete("/{channel_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_channel(channel_id: int):
    response = supabase.table("channels").delete().eq("id", channel_id).execute()
    if response.error:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=response.error.message)
    return