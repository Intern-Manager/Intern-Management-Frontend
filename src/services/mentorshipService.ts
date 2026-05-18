import { api } from './constant/axiosInstance';

export interface Mentorship {
  mentorshipId: number;
  mentorId: number;
  mentorName?: string;
  internId: number;
  internName?: string;
  programId: number;
  programName?: string;
  startDate: string;
  endDate?: string;
  status: string;
  createdAt: string;
}

export interface CreateMentorshipRequest {
  mentorId: number;
  internId: number;
  programId: number;
  startDate: string;
  endDate?: string;
}

export interface UpdateMentorshipRequest {
  mentorId?: number;
  internId?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export const mentorshipService = {
  getMentorships: async (params?: { programId?: number; mentorId?: number; internId?: number }): Promise<Mentorship[]> => {
    const response = await api.get('/api/mentorships', { params });
    return response.data;
  },

  getMentorship: async (id: number): Promise<Mentorship> => {
    const response = await api.get(`/api/mentorships/${id}`);
    return response.data;
  },

  createMentorship: async (data: CreateMentorshipRequest): Promise<Mentorship> => {
    const response = await api.post('/api/mentorships', data);
    return response.data;
  },

  updateMentorship: async (id: number, data: UpdateMentorshipRequest): Promise<Mentorship> => {
    const response = await api.put(`/api/mentorships/${id}`, data);
    return response.data;
  },

  deleteMentorship: async (id: number): Promise<void> => {
    await api.delete(`/api/mentorships/${id}`);
  },

  getMentorsByProgram: async (programId: number): Promise<{ userId: number; fullName: string }[]> => {
    const response = await api.get(`/api/mentorships/mentors/program/${programId}`);
    return response.data;
  },

  getInternsByProgram: async (programId: number): Promise<{ userId: number; fullName: string }[]> => {
    const response = await api.get(`/api/mentorships/interns/program/${programId}`);
    return response.data;
  },
};
