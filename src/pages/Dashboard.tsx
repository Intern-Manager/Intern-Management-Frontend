import { useState } from 'react';
import { Select, Space, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import InternDashboard from '../components/dashboard/InternDashboard';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import HRDashboard from '../components/dashboard/HRDashboard';
import CoordinatorDashboard from '../components/dashboard/CoordinatorDashboard';
import MentorDashboard from '../components/dashboard/MentorDashboard';

const { Text } = Typography;

const roleOptions = [
  { label: 'Admin', value: 'Admin' },
  { label: 'HR Manager', value: 'HR Manager' },
  { label: 'Internship Coordinator', value: 'Coordinator' },
  { label: 'Mentor', value: 'Mentor' },
  { label: 'Intern', value: 'Intern' },
];

const Dashboard = () => {
  const [currentRole, setCurrentRole] = useState('Intern');
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderDashboard = () => {
    switch (currentRole) {
      case 'Admin':
        return <AdminDashboard activeTab={activeTab} onTabChange={setActiveTab} />;
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
    <div className="pb-10">
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
            options={roleOptions}
            className="role-select"
            popupMatchSelectWidth={false}
          />
        </div>
      </div>

      <div className="animate-fadeIn">
        {renderDashboard()}
      </div>
    </div>
  );
};

export default Dashboard;
