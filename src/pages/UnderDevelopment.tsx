import React from 'react';
import { Result, Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { RocketOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const UnderDevelopment = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex items-center justify-center p-8 bg-white/30 backdrop-blur-xl rounded-[32px] border border-white/50 shadow-xl overflow-hidden relative">
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>

      <Result
        icon={<RocketOutlined className="text-6xl text-primary animate-bounce" />}
        title={<span className="text-3xl font-black text-gray-800">Feature Coming Soon!</span>}
        subTitle={
          <div className="text-gray-500 max-w-md mx-auto mt-4">
            <p className="text-lg font-medium leading-relaxed">
              We're currently building something amazing here. Our engineers are working hard to deliver this module to you.
            </p>
            <div className="flex justify-center gap-2 mt-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:0.4s]"></span>
            </div>
          </div>
        }
        extra={
          <Space size="middle" className="mt-8">
            <Button
              icon={<ArrowLeftOutlined />}
              size="large"
              className="rounded-xl border-gray-200 hover:border-primary hover:text-primary transition-all font-bold px-6"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
            <Button
              type="primary"
              size="large"
              className="rounded-xl primary-gradient border-none px-8 font-bold shadow-lg shadow-primary/20"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Button>
          </Space>
        }
      />
    </div>
  );
};

export default UnderDevelopment;
