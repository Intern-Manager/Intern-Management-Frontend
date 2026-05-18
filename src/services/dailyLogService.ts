import { api } from './constant/axiosInstance';
import { PaginatedResult } from './constant/apiConfig';

export interface DailyLog {
  logId: number;
  internId: number;
  internName?: string;
  mentorId?: number;
  mentorName?: string;
  logDate: string;
  activityDescription: string;
  hoursWorked?: number;
  challengesFaced?: string;
  mentorFeedback?: string;
  kpiScore?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateDailyLogRequest {
  internId: number;
  mentorId?: number;
  logDate: string;
  activityDescription: string;
  hoursWorked?: number;
  challengesFaced?: string;
}

export interface UpdateDailyLogRequest {
  activityDescription?: string;
  hoursWorked?: number;
  challengesFaced?: string;
  mentorFeedback?: string;
  kpiScore?: number;
}

export interface DailyLogFilter {
  internId?: number;
  mentorId?: number;
  fromDate?: string;
  toDate?: string;
}

export const dailyLogService = {
  getLogs: async (params?: { page?: number; pageSize?: number } & DailyLogFilter): Promise<PaginatedResult<DailyLog>> => {
    const response = await api.get('/api/daily-logs', { params });
    return response.data;
  },

  getLogsByIntern: async (internId: number, params?: { page?: number; pageSize?: number }): Promise<PaginatedResult<DailyLog>> => {
    const response = await api.get('/api/daily-logs', { params: { ...params, internId } });
    return response.data;
  },

  getLog: async (id: number): Promise<DailyLog> => {
    const response = await api.get(`/api/daily-logs/${id}`);
    return response.data;
  },

  createLog: async (data: CreateDailyLogRequest): Promise<DailyLog> => {
    const response = await api.post('/api/daily-logs', data);
    return response.data;
  },

  updateLog: async (id: number, data: UpdateDailyLogRequest): Promise<DailyLog> => {
    const response = await api.put(`/api/daily-logs/${id}`, data);
    return response.data;
  },

  deleteLog: async (id: number): Promise<void> => {
    await api.delete(`/api/daily-logs/${id}`);
  },
};
