export type User = {
  id: string;
  name: string;
  email: string;
};

export type Advisory = {
  id: string;
  crop: string;
  location: string;
  riskLevel: 'low' | 'medium' | 'high';
  summary: string;
  createdAt?: string;
};

export type AdvisoryListResponse = {
  items: Advisory[];
  page: number;
  pageSize: number;
  total: number;
};

export type AdvisoryStats = {
  totalAdvisories: number;
  byRiskLevel: {
    low: number;
    medium: number;
    high: number;
  };
  topCrop: string;
  lastFiveAdvisories: Advisory[];
};

export type Profile = {
  id: string;
  name: string;
  defaultLocation?: string;
  preferredLanguage?: 'English' | 'Kannada' | 'Hindi';
};
