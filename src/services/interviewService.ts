import axiosInstance from './constant/axiosInstance';

export interface InterviewDto {
  interviewId: number;
  campaignId?: number;
  applicationId?: number;
  internId?: number;
  interviewerId: number;
  scheduledTime: string;
  durationMinutes: number;
  interviewType: string;
  meetingLink?: string;
  location?: string;
  status: string;
  feedback?: string;
  rating?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface InterviewDetailDto extends InterviewDto {
  campaignTitle?: string;
  internName?: string;
  interviewerName?: string;
}

export interface CreateInterviewRequest {
  campaignId?: number;
  applicationId?: number;
  internId?: number;
  interviewerId: number;
  scheduledTime: string;
  durationMinutes: number;
  interviewType: string;
  meetingLink?: string;
  location?: string;
  feedback?: string;
  rating?: number;
}

export interface UpdateInterviewRequest {
  campaignId?: number;
  applicationId?: number;
  interviewerId?: number;
  scheduledTime?: string;
  durationMinutes?: number;
  interviewType?: string;
  meetingLink?: string;
  location?: string;
  status?: string;
  feedback?: string;
  rating?: number;
}

export interface InterviewListResponse {
  items: InterviewDto[];
  total: number;
  page: number;
  pageSize: number;
}

export const interviewService = {
  getAll: (params: {
    page: number;
    pageSize: number;
    status?: string;
    campaignId?: number;
    internId?: number;
    interviewerId?: number;
    fromDate?: string;
    toDate?: string;
  }) =>
    axiosInstance.get<InterviewListResponse>('/api/interviews', { params }),

  getById: (id: number) =>
    axiosInstance.get<InterviewDetailDto>(`/api/interviews/${id}`),

  create: (data: CreateInterviewRequest) =>
    axiosInstance.post<InterviewDto>('/api/interviews', data),

  update: (id: number, data: UpdateInterviewRequest) =>
    axiosInstance.put<InterviewDto>(`/api/interviews/${id}`, data),

  delete: (id: number) =>
    axiosInstance.delete(`/api/interviews/${id}`),
};
