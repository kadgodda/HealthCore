"""Main FastAPI application for HealthCore Backend."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

# Import routers
from routers import missions, game, receptors

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifecycle."""
    logger.info("Starting HealthCore Backend...")
    yield
    logger.info("Shutting down HealthCore Backend...")


app = FastAPI(
    title="HealthCore API",
    description="Body Systems Nutrition Intelligence - Molecular receptor mapping for optimal nutrition",
    version="0.1.0",
    lifespan=lifespan
)

# Configure CORS - Allow all localhost ports for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to HealthCore API",
        "version": "0.1.0",
        "systems": ["intestinal", "hepatic", "circulatory", "cellular"]
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


# Include routers
app.include_router(missions.router)
app.include_router(game.router)
app.include_router(receptors.router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)