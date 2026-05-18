import axiosInstance from './constant/axiosInstance';

// Types
export interface UserProfile {
  userId: number;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string | null;
  roleId: number;
  roleName?: string;
  status: string;
  emailVerified: boolean;
  emailVerifiedAt?: string | null;
  lastLogin?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface UserListItem {
  userId: number;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string | null;
  roleId: number;
  status: string;
  emailVerified: boolean;
  emailVerifiedAt?: string | null;
  lastLogin?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface UserFilter {
  search?: string;
  status?: string;
  roleId?: number;
}

export interface PaginatedUsers {
  items: UserListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateUserData {
  fullName: string;
  email: string;
  password: string;
  roleId: number;
  phone?: string;
}

export interface UpdateUserData {
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
  roleId?: number;
  status?: string;
}

// API Functions
export const userService = {
  // List users with pagination and filters
  getUsers: (params: { page?: number; pageSize?: number; search?: string; status?: string; roleId?: number }) =>
    axiosInstance.get<PaginatedUsers>('/api/users', { params }),

  // Get single user by ID
  getProfile: (id: number) =>
    axiosInstance.get<UserProfile>(`/api/users/${id}`),

  // Create new user
  createUser: (data: CreateUserData) =>
    axiosInstance.post<UserProfile>('/api/users', data),

  // Update user
  updateProfile: (id: number, data: UpdateUserData) =>
    axiosInstance.put<UserProfile>(`/api/users/${id}`, data),

  // Update avatar
  updateAvatar: (id: number, base64Image: string) =>
    axiosInstance.patch(`/api/users/${id}/avatar`, { base64Image }),

  // Delete user
  deleteUser: (id: number) =>
    axiosInstance.delete(`/api/users/${id}`),
};
