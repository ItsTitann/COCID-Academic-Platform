export type AnalysisStatus = 'PENDING' | 'UPLOADED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface MatchSource {
  id: string;
  name: string;
  url?: string;
  type: 'Repositorio Institucional' | 'Revista Indexada (SciELO)' | 'Artículo Científico (IEEE)' | 'Publicación Académica (Dialnet)' | 'Base de Datos Redalyc' | string;
  similarity: number;
  matchedPassagesCount: number;
  categoryColor: string; // e.g. '#2563EB', '#D4AF37', '#14B8A6'
}

export interface MatchedFragment {
  id: string;
  pageNumber: number;
  sourceId: string;
  sourceName: string;
  type: 'DIRECT_MATCH' | 'PARAPHRASE' | 'AI_GENERATED';
  originalText: string;
  matchedText: string;
  similarityScore: number;
  tagColor: 'blue' | 'gold' | 'turquoise';
}

export interface DocumentParagraph {
  id: string;
  text: string;
  highlight?: {
    type: 'DIRECT_MATCH' | 'PARAPHRASE' | 'AI_GENERATED';
    fragmentId: string;
    sourceName: string;
    score: number;
  };
}

export interface DocumentPage {
  pageNumber: number;
  title: string;
  paragraphs: DocumentParagraph[];
}

export interface SimilarityMatchesData {
  summary?: {
    riskLevel: 'BAJO' | 'MODERADO' | 'ALTO';
    interpretation: string;
    analyzedAt: string;
    engineVersion: string;
  };
  sources: MatchSource[];
  fragments: MatchedFragment[];
  pages: DocumentPage[];
}

export interface SimilarityReport {
  id: string;
  documentTitle: string;
  filename?: string;
  fileUrl?: string;
  fileSize: number;
  fileType?: string;
  totalPages: number;
  totalWords: number;
  overallScore: number;
  aiProbability: number;
  sourcesCount: number;
  status: AnalysisStatus;
  processingMessage?: string;
  matchesData?: SimilarityMatchesData | null;
  userId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SimilarityUploadResponse {
  success: boolean;
  message: string;
  data: SimilarityReport;
}
