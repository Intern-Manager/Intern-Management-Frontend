import { api } from './constant/axiosInstance';
import { PaginatedResult } from './constant/apiConfig';

export interface Assessment {
  assessmentId: number;
  internId: number;
  internName?: string;
  mentorId: number;
  mentorName?: string;
  programId?: number;
  programName?: string;
  assessmentDate: string;
  assessmentType: string;
  technicalSkillsScore?: number;
  softSkillsScore?: number;
  communicationScore?: number;
  teamworkScore?: number;
  overallRating?: number;
  strengths?: string;
  areasForImprovement?: string;
  comments?: string;
  createdAt: string;
}

export interface CreateAssessmentRequest {
  internId: number;
  mentorId: number;
  programId?: number;
  assessmentDate: string;
  assessmentType: string;
  technicalSkillsScore?: number;
  softSkillsScore?: number;
  communicationScore?: number;
  teamworkScore?: number;
  overallRating?: number;
  strengths?: string;
  areasForImprovement?: string;
  comments?: string;
}

export interface UpdateAssessmentRequest {
  technicalSkillsScore?: number;
  softSkillsScore?: number;
  communicationScore?: number;
  teamworkScore?: number;
  overallRating?: number;
  strengths?: string;
  areasForImprovement?: string;
  comments?: string;
}

export interface AssessmentFilter {
  internId?: number;
  mentorId?: number;
  programId?: number;
  assessmentType?: string;
  fromDate?: string;
  toDate?: string;
}

export const assessmentService = {
  getAssessments: async (params?: { page?: number; pageSize?: number } & AssessmentFilter): Promise<PaginatedResult<Assessment>> => {
    const response = await api.get('/api/assessments', { params });
    return response.data;
  },

  getAssessmentsByIntern: async (internId: number, params?: { page?: number; pageSize?: number }): Promise<PaginatedResult<Assessment>> => {
    const response = await api.get('/api/assessments', { params: { ...params, internId } });
    return response.data;
  },

  getAssessmentsByMentor: async (mentorId: number, params?: { page?: number; pageSize?: number }): Promise<PaginatedResult<Assessment>> => {
    const response = await api.get('/api/assessments', { params: { ...params, mentorId } });
    return response.data;
  },

  getAssessment: async (id: number): Promise<Assessment> => {
    const response = await api.get(`/api/assessments/${id}`);
    return response.data;
  },

  createAssessment: async (data: CreateAssessmentRequest): Promise<Assessment> => {
    const response = await api.post('/api/assessments', data);
    return response.data;
  },

  updateAssessment: async (id: number, data: UpdateAssessmentRequest): Promise<Assessment> => {
    const response = await api.put(`/api/assessments/${id}`, data);
    return response.data;
  },

  deleteAssessment: async (id: number): Promise<void> => {
    await api.delete(`/api/assessments/${id}`);
  },
};
