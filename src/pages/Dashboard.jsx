import React, { useState } from 'react';
import { Select, Space, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';

// Import Role Dashboards
import InternDashboard from '../components/dashboard/InternDashboard';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import HRDashboard from '../components/dashboard/HRDashboard';
import CoordinatorDashboard from '../components/dashboard/CoordinatorDashboard';
import MentorDashboard from '../components/dashboard/MentorDashboard';

const { Text } = Typography;

const Dashboard = () => {
  const [currentRole, setCurrentRole] = useState('Intern');

  const roles = [
    { label: 'Admin', value: 'Admin' },
    { label: 'HR Manager', value: 'HR Manager' },
    { label: 'Internship Coordinator', value: 'Coordinator' },
    { label: 'Mentor', value: 'Mentor' },
    { label: 'Intern', value: 'Intern' },
  ];

  const renderDashboard = () => {
    switch (currentRole) {
      case 'Admin':
        return <AdminDashboard />;
      case 'HR Manager':
        return <HRDashboard />;
      case 'Coordinator':
        return <CoordinatorDashboard />;
      case 'Mentor':
        return <MentorDashboard />;
      case 'Intern':
      default:
        return <InternDashboard />;
    }
  };

  return (
    <div className="space-y-5 pb-10">
      {/* Role Switcher (For Demo Purposes) */}
      <div className="flex justify-between items-center bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-sm">
        <Space>
          <div className="p-2 bg-primary/10 text-primary rounded-lg">
            <UserOutlined />
          </div>
          <div>
            <Text className="text-xs text-gray-400 block leading-none">VIEWING AS</Text>
            <Text className="font-bold text-gray-800">{currentRole}</Text>
          </div>
        </Space>
        
        <div className="flex items-center gap-3">
          <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest hidden sm:block">Switch Role:</Text>
          <Select
            defaultValue="Intern"
            style={{ width: 200 }}
            onChange={(value) => setCurrentRole(value)}
            options={roles}
            className="role-select"
            popupClassName="role-select-popup"
          />
        </div>
      </div>

      {/* Dynamic Dashboard Content */}
      <div className="animate-fadeIn">
        {renderDashboard()}
      </div>

      <style jsx>{`
        .role-select :global(.ant-select-selector) {
          border-radius: 12px !important;
          border: 1px solid rgba(0,0,0,0.05) !important;
          height: 40px !important;
          display: flex !important;
          align-items: center !important;
          font-weight: 600 !important;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;

