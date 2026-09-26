export interface LsmGesturePrediction {
  sign: string;
  confidence: number;
  category?: 'alphabet' | 'numbers' | 'common_words' | 'phrases';
  timestamp: number;
}

export interface LsmGlossaryItem {
  id: string;
  name: string;
  category: string;
  description: string;
  videoUrl?: string;
  imageUrl?: string;
}

export interface LsmSessionState {
  isActive: boolean;
  isCameraReady: boolean;
  currentPrediction: LsmGesturePrediction | null;
  history: LsmGesturePrediction[];
}
