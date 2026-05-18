import axiosInstance from './constant/axiosInstance';

export interface Role {
  roleId: number;
  roleName: string;
  description?: string;
}

export const roleService = {
  getRoles: () => axiosInstance.get<Role[]>('/api/roles'),
};
