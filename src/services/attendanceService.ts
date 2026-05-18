import { api } from './constant/axiosInstance';
import { PaginatedResult } from './constant/apiConfig';

export interface Attendance {
  attendanceId: number;
  internId: number;
  internName?: string;
  attendanceDate: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: string;
  notes?: string;
  approvedBy?: number;
  approvedByName?: string;
  createdAt: string;
}

export interface CheckInRequest {
  internId: number;
  attendanceDate: string;
  checkInTime: string;
  status?: string;
}

export interface CheckOutRequest {
  attendanceId: number;
  checkOutTime: string;
}

export interface AttendanceFilter {
  internId?: number;
  status?: string;
  fromDate?: string;
  toDate?: string;
}

export const attendanceService = {
  getAttendance: async (params?: { page?: number; pageSize?: number } & AttendanceFilter): Promise<PaginatedResult<Attendance>> => {
    const response = await api.get('/api/attendance', { params });
    return response.data;
  },

  getAttendanceByIntern: async (internId: number, params?: { page?: number; pageSize?: number }): Promise<PaginatedResult<Attendance>> => {
    const response = await api.get('/api/attendance', { params: { ...params, internId } });
    return response.data;
  },

  getAttendanceByDate: async (internId: number, date: string): Promise<Attendance | null> => {
    const response = await api.get('/api/attendance', { params: { internId } });
    const items = response.data?.items || [];
    const today = items.find((a: Attendance) => a.attendanceDate === date);
    return today || null;
  },

  getAttendance: async (id: number): Promise<Attendance> => {
    const response = await api.get(`/api/attendance/${id}`);
    return response.data;
  },

  checkIn: async (data: CheckInRequest): Promise<Attendance> => {
    const response = await api.post('/api/attendance', data);
    return response.data;
  },

  checkOut: async (data: CheckOutRequest): Promise<Attendance> => {
    const response = await api.put(`/api/attendance/${data.attendanceId}`, { checkOutTime: data.checkOutTime });
    return response.data;
  },

  updateAttendance: async (id: number, data: Partial<Attendance>): Promise<Attendance> => {
    const response = await api.put(`/api/attendance/${id}`, data);
    return response.data;
  },

  deleteAttendance: async (id: number): Promise<void> => {
    await api.delete(`/api/attendance/${id}`);
  },
};
