from fastapi import APIRouter, HTTPException
from .models import RecommendationRequest, RecommendationResponse
from .service import recommendation_service

router = APIRouter(prefix="/recommendations", tags=["Recomendación de Becas y Posgrados"])

@router.post("/match", response_model=RecommendationResponse)
async def get_matches(request: RecommendationRequest):
    try:
        return await recommendation_service.match_opportunities(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
