import { api } from './constant/axiosInstance';
import { PaginatedResult } from './constant/apiConfig';

export interface Notification {
  notificationId: number;
  userId: number;
  notificationType: string;
  category: string;
  subject: string;
  content: string;
  relatedId?: number;
  relatedType?: string;
  isRead: boolean;
  sentAt: string;
  readAt?: string;
}

export interface CreateNotificationRequest {
  userId: number;
  subject: string;
  content: string;
  category?: string;
  notificationType?: string;
  relatedId?: number;
  relatedType?: string;
}

export interface NotificationFilter {
  userId?: number;
  category?: string;
  isRead?: boolean;
}

export const notificationService = {
  getNotifications: async (params?: { page?: number; pageSize?: number } & NotificationFilter): Promise<PaginatedResult<Notification>> => {
    const response = await api.get('/api/notifications', { params });
    return response.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await api.get('/api/notifications/unread-count');
    return response.data;
  },

  getNotification: async (id: number): Promise<Notification> => {
    const response = await api.get(`/api/notifications/${id}`);
    return response.data;
  },

  markAsRead: async (id: number): Promise<void> => {
    await api.put(`/api/notifications/${id}/read`);
  },

  markAllAsRead: async (userId: number): Promise<void> => {
    await api.put(`/api/notifications/mark-all-read/${userId}`);
  },

  deleteNotification: async (id: number): Promise<void> => {
    await api.delete(`/api/notifications/${id}`);
  },
};
