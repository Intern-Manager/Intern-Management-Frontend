import React, { useState, useEffect } from 'react';
import { Badge, Popover, List, Button, Empty, Spin } from 'antd';
import { BellOutlined, CheckOutlined } from '@ant-design/icons';
import { useNotifications, Notification } from '../../hooks/useNotifications';
import { notificationService } from '../../services/notificationService';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const NotificationBell: React.FC = () => {
  const { notifications, isConnected, markAsRead, markAllAsRead } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [notificationsList, setNotificationsList] = useState<Notification[]>([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    setNotificationsList(notifications);
  }, [notifications]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getNotifications({ page: 1, pageSize: 20 });
      setNotificationsList(data.items);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    await markAsRead(id);
    await notificationService.markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    await notificationService.markAllAsRead(0);
  };

  const unreadCount = notificationsList.filter(n => !n.isRead).length;

  const content = (
    <div className="w-80 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-2 pb-2 border-b">
        <span className="font-semibold">Notifications</span>
        {unreadCount > 0 && (
          <Button type="link" size="small" onClick={handleMarkAllAsRead}>
            Mark all read
          </Button>
        )}
      </div>
      {loading ? (
        <div className="flex justify-center py-8"><Spin /></div>
      ) : notificationsList.length === 0 ? (
        <Empty description="No notifications" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <List
          dataSource={notificationsList}
          renderItem={(item) => (
            <List.Item
              className={`cursor-pointer hover:bg-gray-50 ${!item.isRead ? 'bg-blue-50' : ''}`}
              onClick={() => !item.isRead && handleMarkAsRead(item.notificationId!)}
            >
              <div className="w-full">
                <div className="flex justify-between items-start">
                  <span className={`font-medium ${!item.isRead ? 'text-blue-600' : 'text-gray-700'}`}>
                    {item.title}
                  </span>
                  {!item.isRead && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                </div>
                <p className="text-sm text-gray-500 mt-1">{item.message}</p>
                <span className="text-xs text-gray-400">
                  {item.timestamp ? dayjs(item.timestamp).fromNow() : 'Just now'}
                </span>
              </div>
            </List.Item>
          )}
        />
      )}
    </div>
  );

  return (
    <Popover content={content} trigger="click" placement="bottomRight">
      <Button type="text" className="relative">
        <Badge count={unreadCount} size="small">
          <BellOutlined style={{ fontSize: 20 }} />
        </Badge>
      </Button>
    </Popover>
  );
};

export default NotificationBell;
