import { api } from './constant/axiosInstance';
import { PaginatedResult } from './constant/apiConfig';

export interface TaskItem {
  taskId: number;
  internId: number;
  internName?: string;
  assignedBy: number;
  assignedByName?: string;
  programId?: number;
  programName?: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: string;
  status: string;
  completionDate?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TaskSubmission {
  submissionId: number;
  taskId: number;
  internId: number;
  internName?: string;
  submissionUrl?: string;
  submissionText?: string;
  comments?: string;
  status: string;
  gradedBy?: number;
  gradedByName?: string;
  score?: number;
  feedback?: string;
  submittedAt: string;
  gradedAt?: string;
}

export interface CreateTaskRequest {
  internId: number;
  assignedBy: number;
  programId?: number;
  title: string;
  description?: string;
  dueDate?: string;
  priority?: string;
  status?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: string;
  status?: string;
}

export interface SubmitTaskRequest {
  submissionUrl?: string;
  submissionText?: string;
  comments?: string;
}

export interface GradeSubmissionRequest {
  score: number;
  feedback?: string;
}

export interface TaskFilter {
  status?: string;
  priority?: string;
  internId?: number;
  programId?: number;
}

export const taskService = {
  getTasks: async (params?: { page?: number; pageSize?: number } & TaskFilter): Promise<PaginatedResult<TaskItem>> => {
    const response = await api.get('/api/tasks', { params });
    return response.data;
  },

  getTasksByIntern: async (internId: number, params?: { page?: number; pageSize?: number } & TaskFilter): Promise<PaginatedResult<TaskItem>> => {
    const response = await api.get(`/api/tasks/intern/${internId}`, { params });
    return response.data;
  },

  getTasksByMentor: async (mentorId: number, params?: { page?: number; pageSize?: number } & TaskFilter): Promise<PaginatedResult<TaskItem>> => {
    const response = await api.get(`/api/tasks/mentor/${mentorId}`, { params });
    return response.data;
  },

  getTask: async (id: number): Promise<TaskItem> => {
    const response = await api.get(`/api/tasks/${id}`);
    return response.data;
  },

  createTask: async (data: CreateTaskRequest): Promise<TaskItem> => {
    const response = await api.post('/api/tasks', data);
    return response.data;
  },

  updateTask: async (id: number, data: UpdateTaskRequest): Promise<TaskItem> => {
    const response = await api.put(`/api/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: number): Promise<void> => {
    await api.delete(`/api/tasks/${id}`);
  },

  // Submissions
  getSubmissions: async (taskId: number): Promise<TaskSubmission[]> => {
    const response = await api.get(`/api/tasks/${taskId}/submissions`);
    return response.data;
  },

  submitTask: async (taskId: number, data: SubmitTaskRequest): Promise<TaskSubmission> => {
    const response = await api.post(`/api/tasks/${taskId}/submit`, data);
    return response.data;
  },

  gradeSubmission: async (submissionId: number, data: GradeSubmissionRequest): Promise<TaskSubmission> => {
    const response = await api.put(`/api/tasks/submissions/${submissionId}/grade`, data);
    return response.data;
  },
};
