import { useState, useEffect, useCallback, useRef } from 'react';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { authService } from '../services/authService';
import { api } from '../services/constant/axiosInstance';

export interface Notification {
  notificationId?: number;
  title: string;
  message: string;
  category?: string;
  timestamp?: string;
  data?: any;
  isRead?: boolean;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const hubConnection = new HubConnectionBuilder()
        .withUrl(`${import.meta.env.VITE_API_URL || 'http://localhost:5131'}/hubs/notifications`, {
          accessTokenFactory: () => token,
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            if (retryContext.previousRetryCount < 3) return 2000;
            if (retryContext.previousRetryCount < 10) return 10000;
            return null;
          },
        })
        .build();

      hubConnection.on('ReceiveNotification', (notification: Notification) => {
        setNotifications(prev => [notification, ...prev]);
        // Play sound or show toast if needed
        if (Notification.permission === 'granted') {
          new Notification(notification.title, { body: notification.message });
        }
      });

      hubConnection.onclose(() => {
        setIsConnected(false);
      });

      hubConnection.onreconnecting(() => {
        setIsConnected(false);
      });

      hubConnection.onreconnected(() => {
        setIsConnected(true);
      });

      await hubConnection.start();
      setConnection(hubConnection);
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect to notification hub:', error);
      // Retry after 5 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, 5000);
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (connection) {
      await connection.stop();
      setConnection(null);
      setIsConnected(false);
    }
  }, [connection]);

  const markAsRead = async (notificationId: number) => {
    try {
      await api.put(`/api/notifications/${notificationId}`, { isRead: true });
      setNotifications(prev =>
        prev.map(n =>
          n.notificationId === notificationId ? { ...n, isRead: true } : n
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/api/notifications/mark-all-read');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    notifications,
    isConnected,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    reconnect: connect,
  };
}
