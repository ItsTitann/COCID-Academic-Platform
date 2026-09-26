from fastapi import APIRouter, HTTPException
from .models import LsmPredictRequest, LsmPredictionResponse
from .service import lsm_service

router = APIRouter(prefix="/lsm", tags=["Lengua de Señas Mexicana"])

@router.post("/predict", response_model=LsmPredictionResponse)
async def predict_sign(request: LsmPredictRequest):
    try:
        return await lsm_service.predict_frame(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
