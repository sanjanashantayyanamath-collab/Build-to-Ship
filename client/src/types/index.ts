export type User = {
  id: string;
  name: string;
  email: string;
};

export type Advisory = {
  id: string;
  userId: string;
  crop: string;
  location: string;
  soilType: string;
  season: string;
  growthStage?: string | null;
  irrigation: string;
  irrigationMethod?: string | null;
  temperatureC?: number | null;
  rainfallMm?: number | null;
  farmSizeAcres?: number | null;
  problem: string;
  language: string;
  primaryCategory: string;
  riskLevel: 'low' | 'medium' | 'high';
  expertConsultationRecommended: boolean;
  aiResponse: unknown;
  model: string;
  createdAt: string;
};

export type AdvisoryListResponse = {
  items: Advisory[];
  page: number;
  pageSize: number;
  total: number;
};

export type AdvisoryStats = {
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
    riskLevel: 'low' | 'medium' | 'high';
    primaryCategory: string;
    expertConsultationRecommended: boolean;
    createdAt: string;
  }>;
};

export type Profile = {
  id: string;
  userId: string;
  name: string;
  defaultLocation?: string | null;
  preferredLanguage?: 'English' | 'Kannada' | 'Hindi' | string;
  createdAt?: string;
  updatedAt?: string;
};
