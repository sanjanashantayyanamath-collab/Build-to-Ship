export type Likelihood = 'low' | 'medium' | 'high';

export interface PossibleCause {
  cause: string;
  likelihood: Likelihood;
  howToCheck: string;
}

export interface RecommendedAction {
  priority: number;
  action: string;
  reason: string;
}

export interface PestDiseasePossibility {
  name: string;
  likelihood: Likelihood;
  signsToLookFor: string;
}

export interface AIAdvisoryResponse {
  inScope: boolean;
  primaryCategory: string;
  summary: string;
  riskLevel: Likelihood;
  riskExplanation: string;
  possibleCauses: PossibleCause[];
  recommendedActions: RecommendedAction[];
  irrigationAdvice: string;
  nutrientAdvice: string;
  pestDiseasePossibilities: PestDiseasePossibility[];
  preventiveMeasures: string[];
  weatherConsiderations: string[];
  followUpQuestions: string[];
  expertConsultationRecommended: boolean;
  expertConsultationReason: string;
  confidence: Likelihood;
  limitations: string;
  disclaimer: string;
}

export interface Advisory {
  id: string;
  userId: string;
  crop: string;
  location: string;
  soilType: string;
  season: string;
  growthStage: string | null;
  irrigation: string;
  irrigationMethod: string | null;
  temperatureC: number | null;
  rainfallMm: number | null;
  farmSizeAcres: number | null;
  problem: string;
  language: string;
  primaryCategory: string;
  riskLevel: Likelihood;
  expertConsultationRecommended: boolean;
  aiResponse: AIAdvisoryResponse;
  model: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  name: string;
  defaultLocation: string | null;
  preferredLanguage: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdvisoryStats {
  total: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  topCrop: string;
  recent: Array<{
    id: string;
    crop: string;
    location: string;
    riskLevel: Likelihood;
    primaryCategory: string;
    expertConsultationRecommended: boolean;
    createdAt: string;
  }>;
}

export interface AdvisoryListResponse {
  items: Advisory[];
  page: number;
  pageSize: number;
  total: number;
}

export interface ApiErrorDetail {
  path: string;
  message: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[];
  };
}
