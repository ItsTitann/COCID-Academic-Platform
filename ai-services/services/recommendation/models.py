from pydantic import BaseModel
from typing import List

class RecommendationRequest(BaseModel):
    gpa: float
    academic_level: str
    study_field: str
    interests: List[str] = []

class ScholarshipMatch(BaseModel):
    id: str
    title: str
    institution: str
    match_score: float
    reason: str

class RecommendationResponse(BaseModel):
    recommendations: List[ScholarshipMatch] = []
