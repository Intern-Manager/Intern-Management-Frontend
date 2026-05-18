import axiosInstance from './constant/axiosInstance';

export interface Department {
  departmentId: number;
  departmentName: string;
  description?: string;
  headUserId?: number;
  headUserName?: string;
  memberCount: number;
  internCount: number;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DepartmentDetail {
  departmentId: number;
  departmentName: string;
  description?: string;
  headUserId?: number;
  headUserName?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DepartmentFilter {
  search?: string;
  status?: string;
}

export interface PaginatedDepartments {
  items: Department[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateDepartmentData {
  departmentName: string;
  description?: string;
  headUserId?: number;
}

export interface UpdateDepartmentData {
  departmentName?: string;
  description?: string;
  headUserId?: number;
  status?: string;
}

export const departmentService = {
  getDepartments: (params: { page?: number; pageSize?: number; search?: string; status?: string }) =>
    axiosInstance.get<PaginatedDepartments>('/api/departments', { params }),

  getDepartment: (id: number) =>
    axiosInstance.get<DepartmentDetail>(`/api/departments/${id}`),

  createDepartment: (data: CreateDepartmentData) =>
    axiosInstance.post<Department>('/api/departments', data),

  updateDepartment: (id: number, data: UpdateDepartmentData) =>
    axiosInstance.put<Department>(`/api/departments/${id}`, data),

  deleteDepartment: (id: number) =>
    axiosInstance.delete(`/api/departments/${id}`),
};
