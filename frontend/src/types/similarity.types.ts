export type AnalysisStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface MatchedFragment {
  originalText: string;
  matchedText: string;
  sourceUrl?: string;
  sourceTitle?: string;
  similarityScore: number;
  startIndex: number;
  endIndex: number;
}

export interface SimilarityMatch {
  sourceId: string;
  sourceTitle: string;
  similarityPercentage: number;
  matchedFragments: MatchedFragment[];
}

export interface SimilarityAnalysisReport {
  id: string;
  documentTitle: string;
  uploadedAt: string;
  overallScore: number;
  status: AnalysisStatus;
  totalWords: number;
  matches: SimilarityMatch[];
}
