from fastapi import FastAPI
from app.api.v1.channels import router as channels_router
from app.api.v1.alerts import router as alerts_router
from app.api.v1.insights import router as insights_router

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to IoTLinker Backend!"}

app.include_router(channels_router)
app.include_router(alerts_router)
app.include_router(insights_router)