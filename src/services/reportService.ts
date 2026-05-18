import { api } from './constant/axiosInstance';
import { PaginatedResult } from './constant/apiConfig';

export interface Report {
  reportId: number;
  reportName: string;
  reportType: string;
  description?: string;
  generatedBy: number;
  generatedByName?: string;
  fileUrl?: string;
  fileFormat: string;
  parameters?: string;
  generatedAt: string;
}

export interface CreateReportRequest {
  reportName: string;
  reportType: string;
  description?: string;
  fileFormat?: string;
  parameters?: string;
}

export interface ReportFilter {
  reportType?: string;
  generatedBy?: number;
}

export const reportService = {
  getReports: async (params?: { page?: number; pageSize?: number } & ReportFilter): Promise<PaginatedResult<Report>> => {
    const response = await api.get('/api/reports', { params });
    return response.data;
  },

  getReport: async (id: number): Promise<Report> => {
    const response = await api.get(`/api/reports/${id}`);
    return response.data;
  },

  createReport: async (data: CreateReportRequest): Promise<Report> => {
    const response = await api.post('/api/reports', data);
    return response.data;
  },

  deleteReport: async (id: number): Promise<void> => {
    await api.delete(`/api/reports/${id}`);
  },

  // Analytics endpoints
  getInternStats: async () => {
    const response = await api.get('/api/reports/analytics/interns');
    return response.data;
  },

  getApplicationStats: async () => {
    const response = await api.get('/api/reports/analytics/applications');
    return response.data;
  },

  getAttendanceStats: async () => {
    const response = await api.get('/api/reports/analytics/attendance');
    return response.data;
  },

  getTaskCompletionStats: async () => {
    const response = await api.get('/api/reports/analytics/tasks');
    return response.data;
  },

  getPerformanceStats: async (internId?: number) => {
    const response = await api.get('/api/reports/analytics/performance', { params: { internId } });
    return response.data;
  },
};
