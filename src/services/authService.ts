import axiosInstance from './constant/axiosInstance';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
}

export interface LoginResponse {
  userId: number;
  fullName: string;
  email: string;
  roleId: number;
  status: string;
  emailVerified: boolean;
  tokens: AuthTokens;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  roleId?: number;
}

export const authService = {
  login: (email: string, password: string) =>
    axiosInstance.post<LoginResponse>('/auth/login', { email, password }),

  register: (data: RegisterRequest) =>
    axiosInstance.post('/auth/register', data),

  refreshToken: (refreshToken: string) =>
    axiosInstance.post('/auth/refresh', { refreshToken }),

  logout: (refreshToken: string) =>
    axiosInstance.post('/auth/logout', { refreshToken }),
};
