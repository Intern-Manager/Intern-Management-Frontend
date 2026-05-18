import axiosInstance from './constant/axiosInstance';

export interface CampaignApplicationDto {
  applicationId: number;
  campaignId: number;
  applicantEmail: string;
  applicantName: string;
  applicantPhone?: string;
  cvUrl?: string;
  coverLetter?: string;
  status: string;
  appliedDate: string;
  reviewedBy?: number;
  reviewedDate?: string;
  notes?: string;
}

export interface CampaignApplicationDetailDto extends CampaignApplicationDto {
  campaignTitle?: string;
  reviewedByName?: string;
}

export interface CreateApplicationRequest {
  campaignId: number;
  applicantEmail: string;
  applicantName: string;
  applicantPhone?: string;
  cvUrl?: string;
  coverLetter?: string;
}

export interface UpdateApplicationRequest {
  status?: string;
  reviewedBy?: number;
  notes?: string;
}

export interface ApplicationListResponse {
  items: CampaignApplicationDto[];
  total: number;
  page: number;
  pageSize: number;
}

export const applicationService = {
  getAll: (params: {
    page: number;
    pageSize: number;
    search?: string;
    status?: string;
    campaignId?: number;
  }) =>
    axiosInstance.get<ApplicationListResponse>('/api/applications', { params }),

  getById: (id: number) =>
    axiosInstance.get<CampaignApplicationDetailDto>(`/api/applications/${id}`),

  create: (data: CreateApplicationRequest) =>
    axiosInstance.post<CampaignApplicationDto>('/api/applications', data),

  update: (id: number, data: UpdateApplicationRequest) =>
    axiosInstance.put<CampaignApplicationDto>(`/api/applications/${id}`, data),

  delete: (id: number) =>
    axiosInstance.delete(`/api/applications/${id}`),
};
