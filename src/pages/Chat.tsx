import React from 'react';
import { Card, Typography } from 'antd';
import { MessageOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Chat = () => {
  return (
    <div className="h-full">
      <Card className="h-full shadow-md rounded-2xl flex flex-col">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <MessageOutlined style={{ fontSize: 64, color: '#d1d5db' }} />
            <Title level={3} className="mt-4 text-gray-400">Chat Feature</Title>
            <p className="text-gray-400">Coming soon...</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Chat;
