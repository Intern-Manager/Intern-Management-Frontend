import axiosInstance from './constant/axiosInstance';

export interface InternshipCampaignDto {
  campaignId: number;
  title: string;
  description?: string;
  requirements?: string;
  numberOfPositions: number;
  department?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  applicationDeadline?: string;
  status: string;
  createdBy: number;
  createdAt: string;
  updatedAt?: string;
}

export interface InternshipCampaignDetailDto extends InternshipCampaignDto {
  createdByName?: string;
}

export interface CreateCampaignRequest {
  title: string;
  description?: string;
  requirements?: string;
  numberOfPositions: number;
  department?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  applicationDeadline?: string;
  status: string;
}

export interface UpdateCampaignRequest {
  title?: string;
  description?: string;
  requirements?: string;
  numberOfPositions?: number;
  department?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  applicationDeadline?: string;
  status?: string;
}

export interface CampaignListResponse {
  items: InternshipCampaignDto[];
  total: number;
  page: number;
  pageSize: number;
}

export const campaignService = {
  getAll: (params: {
    page: number;
    pageSize: number;
    search?: string;
    status?: string;
    department?: string;
    location?: string;
  }) =>
    axiosInstance.get<CampaignListResponse>('/api/campaigns', { params }),

  getById: (id: number) =>
    axiosInstance.get<InternshipCampaignDetailDto>(`/api/campaigns/${id}`),

  create: (data: CreateCampaignRequest) =>
    axiosInstance.post<InternshipCampaignDto>('/api/campaigns', data),

  update: (id: number, data: UpdateCampaignRequest) =>
    axiosInstance.put<InternshipCampaignDto>(`/api/campaigns/${id}`, data),

  delete: (id: number) =>
    axiosInstance.delete(`/api/campaigns/${id}`),
};
