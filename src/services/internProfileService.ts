import axiosInstance from './constant/axiosInstance';

export interface InternProfileDto {
  internId: number;
  dateOfBirth?: string;
  address?: string;
  university?: string;
  major?: string;
  graduationYear?: number;
  educationalBackground?: string;
  workHistory?: string;
  skills?: string;
  cvUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface InternProfileDetailDto extends InternProfileDto {
  fullName: string;
  email: string;
}

export interface CreateInternProfileRequest {
  dateOfBirth?: string;
  address?: string;
  university?: string;
  major?: string;
  graduationYear?: number;
  educationalBackground?: string;
  workHistory?: string;
  skills?: string;
  cvUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

export interface UpdateInternProfileRequest extends CreateInternProfileRequest {}

export const internProfileService = {
  getProfile: (userId: number) =>
    axiosInstance.get<InternProfileDetailDto>(`/api/intern-profiles/${userId}`),

  getMyProfile: () =>
    axiosInstance.get<InternProfileDetailDto>('/api/intern-profiles/0'),

  create: (data: CreateInternProfileRequest) =>
    axiosInstance.post<InternProfileDto>('/api/intern-profiles', data),

  update: (userId: number, data: UpdateInternProfileRequest) =>
    axiosInstance.put<InternProfileDto>(`/api/intern-profiles/${userId}`, data),
};
