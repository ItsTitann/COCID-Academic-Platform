from pydantic import BaseModel
from typing import Optional, List

class LsmPredictRequest(BaseModel):
    image_base64: str

class LsmPredictionResponse(BaseModel):
    sign: str
    confidence: float
    category: Optional[str] = "alphabet"
    landmarks_detected: bool = False
