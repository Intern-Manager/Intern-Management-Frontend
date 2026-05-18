import { api } from './constant/axiosInstance';
import { PaginatedResult } from './constant/apiConfig';

export interface TrainingProgram {
  programId: number;
  programName: string;
  description?: string;
  objectives?: string;
  durationWeeks?: number;
  startDate?: string;
  endDate?: string;
  coordinatorId: number;
  coordinatorName?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateProgramRequest {
  programName: string;
  description?: string;
  objectives?: string;
  durationWeeks?: number;
  startDate?: string;
  endDate?: string;
}

export interface UpdateProgramRequest {
  programName?: string;
  description?: string;
  objectives?: string;
  durationWeeks?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export interface ProgramFilter {
  status?: string;
  search?: string;
}

export const trainingService = {
  getPrograms: async (params?: { page?: number; pageSize?: number } & ProgramFilter): Promise<PaginatedResult<TrainingProgram>> => {
    const response = await api.get('/api/training-programs', { params });
    return response.data;
  },

  getProgram: async (id: number): Promise<TrainingProgram> => {
    const response = await api.get(`/api/training-programs/${id}`);
    return response.data;
  },

  createProgram: async (data: CreateProgramRequest): Promise<TrainingProgram> => {
    const response = await api.post('/api/training-programs', data);
    return response.data;
  },

  updateProgram: async (id: number, data: UpdateProgramRequest): Promise<TrainingProgram> => {
    const response = await api.put(`/api/training-programs/${id}`, data);
    return response.data;
  },

  deleteProgram: async (id: number): Promise<void> => {
    await api.delete(`/api/training-programs/${id}`);
  },
};
