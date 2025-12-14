from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings, CORS_ORIGINS
from app.database import init_db_pool, close_db_pool
from app.api.v1.channels import router as channels_router
from app.api.v1.alerts import router as alerts_router
from app.api.v1.insights import router as insights_router
from app.api.v1.devices import router as devices_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup: Initialize database connection pool
    await init_db_pool()
    yield
    # Shutdown: Close database connection pool
    await close_db_pool()


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="IoTLinker Enterprise - IoT Device Management Platform",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {
        "message": "Welcome to IoTLinker Backend!",
        "version": settings.APP_VERSION,
        "status": "running"
    }

from fastapi import Request
from fastapi.responses import JSONResponse
import traceback

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    error_msg = f"GLOBAL HANDLER CAUGHT: {str(exc)}\n{traceback.format_exc()}"
    print(error_msg)
    return JSONResponse(
        status_code=500,
        content={"detail": error_msg},
    )


@app.get("/health")
def health_check():
    return {"status": "healthy"}


# Include API routers
app.include_router(devices_router)
app.include_router(channels_router)
app.include_router(alerts_router)
app.include_router(insights_router)