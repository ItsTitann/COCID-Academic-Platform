from fastapi import APIRouter, HTTPException
from .models import SimilarityRequest, SimilarityResponse
from .service import similarity_service

router = APIRouter(prefix="/similarity", tags=["Similitud Académica"])

@router.post("/analyze", response_model=SimilarityResponse)
async def analyze_text(request: SimilarityRequest):
    try:
        return await similarity_service.analyze_document(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
