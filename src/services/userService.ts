import axiosInstance from './constant/axiosInstance';

export interface UserProfile {
  userId: number;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string | null;
  roleId: number;
  roleName: string;
  status: string;
  emailVerified: boolean;
  emailVerifiedAt?: string | null;
  lastLogin?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export const userService = {
  getProfile: (id: number) =>
    axiosInstance.get<UserProfile>(`/api/users/${id}`),

  updateProfile: (id: number, data: Partial<UserProfile>) =>
    axiosInstance.put(`/api/users/${id}`, data),

  updateAvatar: (id: number, avatarUrl: string) =>
    axiosInstance.patch(`/api/users/${id}/avatar`, { avatarUrl }),
};
