import { apiRequest } from './apiClient';
import type { Advisory, AdvisoryListResponse, AdvisoryStats } from '../types';
import type { AdvisoryFormData } from '../schemas/advisory.schema';

export interface CreateAdvisoryResult {
  inScope: boolean;
  message?: string;
  advisory?: Advisory;
}

export async function createAdvisory(data: AdvisoryFormData): Promise<CreateAdvisoryResult> {
  const result = await apiRequest<Advisory | { inScope: false; message: string }>('/api/advisories', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if ('inScope' in result && result.inScope === false) {
    return {
      inScope: false,
      message: result.message,
    };
  }

  return {
    inScope: true,
    advisory: result as Advisory,
  };
}

export async function listAdvisories(params: {
  page?: number;
  pageSize?: number;
  crop?: string;
  risk?: string;
  q?: string;
} = {}): Promise<AdvisoryListResponse> {
  const query = new URLSearchParams();
  if (params.page) query.append('page', String(params.page));
  if (params.pageSize) query.append('pageSize', String(params.pageSize));
  if (params.crop) query.append('crop', params.crop);
  if (params.risk) query.append('risk', params.risk);
  if (params.q) query.append('q', params.q);

  const qs = query.toString();
  return apiRequest<AdvisoryListResponse>(`/api/advisories${qs ? `?${qs}` : ''}`);
}

export async function getAdvisoryStats(): Promise<AdvisoryStats> {
  return apiRequest<AdvisoryStats>('/api/advisories/stats');
}

export async function getAdvisoryById(id: string): Promise<Advisory> {
  return apiRequest<Advisory>(`/api/advisories/${id}`);
}

export async function deleteAdvisory(id: string): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/api/advisories/${id}`, {
    method: 'DELETE',
  });
}
