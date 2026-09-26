from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from services.similarity.router import router as similarity_router
from services.lsm.router import router as lsm_router
from services.recommendation.router import router as recommendation_router

app = FastAPI(
    title=settings.app_name,
    description="Microservicios de Inferencia de Inteligencia Artificial para la Plataforma Académica COCID",
    version="1.0.0",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount AI Module Routers
app.include_router(similarity_router, prefix="/api/v1")
app.include_router(lsm_router, prefix="/api/v1")
app.include_router(recommendation_router, prefix="/api/v1")

@app.get("/api/v1/health", tags=["Health"])
async def health_check():
    return {
        "status": "online",
        "service": "COCID AI Services",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.host, port=settings.port, reload=True)
