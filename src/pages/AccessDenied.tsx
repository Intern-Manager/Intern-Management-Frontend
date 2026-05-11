import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex items-center justify-center p-8 bg-white/30 backdrop-blur-xl rounded-[32px] border border-white/50 shadow-xl">
      <Result
        status="403"
        title="Access Denied"
        subTitle={
          <div className="text-gray-500">
            <p className="text-lg mb-2">Sorry, your current role does not have permission to access this page.</p>
            <p className="text-sm">Please contact your administrator if you believe this is an error.</p>
          </div>
        }
        extra={
          <Button
            type="primary"
            size="large"
            className="rounded-xl primary-gradient border-none px-8"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        }
      />
    </div>
  );
};

export default AccessDenied;
