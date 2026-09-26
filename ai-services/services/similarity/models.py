from pydantic import BaseModel, Field
from typing import List, Optional

class SimilarityRequest(BaseModel):
    title: str
    text_content: str

class MatchedFragment(BaseModel):
    original_text: str
    matched_text: str
    similarity_score: float
    start_index: int
    end_index: int

class SimilarityMatch(BaseModel):
    source_id: str
    source_title: str
    similarity_percentage: float
    matched_fragments: List[MatchedFragment] = []

class SimilarityResponse(BaseModel):
    overall_score: float
    total_words: int
    status: str
    matches: List[SimilarityMatch] = []
