import { api } from './constant/axiosInstance';

export interface LearningResource {
  resourceId: number;
  programId: number;
  programName?: string;
  title: string;
  description?: string;
  resourceUrl?: string;
  resourceType: string;
  fileSizeMb?: number;
  uploadedBy: number;
  uploadedByName?: string;
  uploadedAt: string;
}

export interface CreateResourceRequest {
  programId: number;
  title: string;
  description?: string;
  resourceUrl?: string;
  resourceType?: string;
}

export interface UpdateResourceRequest {
  title?: string;
  description?: string;
  resourceUrl?: string;
  resourceType?: string;
}

export const learningResourceService = {
  getResourcesByProgram: async (programId: number): Promise<LearningResource[]> => {
    const response = await api.get(`/api/learning-resources?programId=${programId}&pageSize=100`);
    return response.data.items || response.data;
  },

  getResource: async (id: number): Promise<LearningResource> => {
    const response = await api.get(`/api/learning-resources/${id}`);
    return response.data;
  },

  createResource: async (data: CreateResourceRequest): Promise<LearningResource> => {
    const response = await api.post('/api/learning-resources', data);
    return response.data;
  },

  updateResource: async (id: number, data: UpdateResourceRequest): Promise<LearningResource> => {
    const response = await api.put(`/api/learning-resources/${id}`, data);
    return response.data;
  },

  deleteResource: async (id: number): Promise<void> => {
    await api.delete(`/api/learning-resources/${id}`);
  },
};
