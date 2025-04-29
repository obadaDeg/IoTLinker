from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/api/v1/alerts", tags=["alerts"])

class AlertCreate(BaseModel):
    channel_id: int
    threshold: float
    condition: str  # e.g., "greater_than", "less_than"
    notification_type: str  # e.g., "email", "sms", "webhook"
    is_active: bool = True

class Alert(BaseModel):
    id: int
    channel_id: int
    threshold: float
    condition: str
    notification_type: str
    is_active: bool

# Mock database
alerts_db = []

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=Alert)
async def create_alert(alert: AlertCreate):
    new_alert = {
        "id": len(alerts_db) + 1,
        **alert.dict()
    }
    alerts_db.append(new_alert)
    return new_alert

@router.get("/", response_model=List[Alert])
async def list_alerts():
    return alerts_db

@router.put("/{alert_id}", response_model=Alert)
async def update_alert(alert_id: int, alert_update: AlertCreate):
    for alert in alerts_db:
        if alert["id"] == alert_id:
            alert.update(alert_update.dict())
            return alert
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Alert not found")

@router.delete("/{alert_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_alert(alert_id: int):
    global alerts_db
    alerts_db = [alert for alert in alerts_db if alert["id"] != alert_id]
    return