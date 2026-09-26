from .models import LsmPredictRequest, LsmPredictionResponse

class LsmService:
    def __init__(self):
        # Computer vision & landmark detection models will be initialized here
        pass

    async def predict_frame(self, request: LsmPredictRequest) -> LsmPredictionResponse:
        # Base architecture response ready for MediaPipe / PyTorch / ONNX model
        return LsmPredictionResponse(
            sign="A",
            confidence=0.0,
            category="alphabet",
            landmarks_detected=False
        )

lsm_service = LsmService()
