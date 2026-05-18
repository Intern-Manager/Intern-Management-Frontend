import React, { useState, useEffect } from 'react';
import { Layout, Button, Badge, Dropdown, Avatar } from 'antd';
import {
  DashboardOutlined,
  BellOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
  HistoryOutlined,
  BuildOutlined,
  UserOutlined,
  MessageOutlined,
  TeamOutlined,
  CalendarOutlined,
  FileTextOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const { Header, Content } = Layout;

const adminTabs = [
  { key: '/admin/dashboard', label: 'Dashboard', icon: <DashboardOutlined /> },
  { key: '/admin/users', label: 'User Management', icon: <BuildOutlined /> },
  { key: '/admin/departments', label: 'Departments', icon: <TeamOutlined /> },
  { key: '/admin/config', label: 'System Config', icon: <SettingOutlined /> },
  { key: '/admin/logs', label: 'Audit Log', icon: <HistoryOutlined /> },
];

const hrTabs = [
  { key: '/hr/dashboard', label: 'Overview', icon: <DashboardOutlined /> },
  { key: '/hr/campaigns', label: 'Campaigns', icon: <AppstoreOutlined /> },
  { key: '/hr/applications', label: 'Applications', icon: <FileTextOutlined /> },
  { key: '/hr/interviews', label: 'Interviews', icon: <CalendarOutlined /> },
];

const coordinatorTabs = [
  { key: '/coordinator/dashboard', label: 'Dashboard', icon: <DashboardOutlined /> },
];

const mentorTabs = [
  { key: '/mentor/dashboard', label: 'Dashboard', icon: <DashboardOutlined /> },
];

const internTabs = [
  { key: '/intern/dashboard', label: 'Dashboard', icon: <DashboardOutlined /> },
  { key: '/intern/profile', label: 'My Profile', icon: <UserOutlined /> },
  { key: '/intern/campaigns', label: 'Campaigns', icon: <TeamOutlined /> },
];

const chatTab = { key: '/chat', label: 'Chat', icon: <MessageOutlined /> };

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [avatarRefreshKey, setAvatarRefreshKey] = useState(0);

  // Force re-render when avatar changes
  useEffect(() => {
    if (user?.avatarUrl) {
      setAvatarRefreshKey(k => k + 1);
    }
  }, [user?.avatarUrl]);

  const getRoleTabs = () => {
    if (!user) return adminTabs;
    switch (user.roleId) {
      case 1: return adminTabs;
      case 2: return mentorTabs;
      case 3: return internTabs;
      case 4: return hrTabs;
      case 5: return coordinatorTabs;
      default: return adminTabs;
    }
  };

  // Get dashboard URL based on user role - always navigates to correct dashboard
  const getDashboardUrl = () => {
    if (!user) return '/admin/dashboard';
    switch (user.roleId) {
      case 1: return '/admin/dashboard';
      case 2: return '/mentor/dashboard';
      case 3: return '/intern/dashboard';
      case 4: return '/hr/dashboard';
      case 5: return '/coordinator/dashboard';
      default: return '/admin/dashboard';
    }
  };

  const headerTabs = getRoleTabs();
  const activeTab = headerTabs.find(tab => location.pathname.startsWith(tab.key))?.key ?? headerTabs[0]?.key;

  const showChatTab = user && [2, 3, 5].includes(user.roleId);

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
      onClick: () => {
        if (user) {
          navigate(`/profile/${user.userId}`);
        }
      },
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: logout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          padding: '0 24px',
          background: 'white',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          height: '64px',
        }}
      >
        {/* Logo */}
        <div className="flex items-center">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate(getDashboardUrl())}
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-black text-lg">I</span>
            </div>
            <span className="text-primary font-bold text-lg hidden md:inline">Intern</span>
          </div>
        </div>

        {/* Tabs in Header */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
            {headerTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => navigate(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-slate-500 hover:text-primary'
                }`}
              >
                {React.cloneElement(tab.icon as React.ReactElement<{ style?: React.CSSProperties }>, { style: { fontSize: '16px' } })}
                <span className="hidden lg:inline">{tab.label}</span>
              </button>
            ))}
            {showChatTab && (
              <button
                onClick={() => navigate(chatTab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname.startsWith(chatTab.key)
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-slate-500 hover:text-primary'
                }`}
              >
                {React.cloneElement(chatTab.icon as React.ReactElement<{ style?: React.CSSProperties }>, { style: { fontSize: '16px' } })}
                <span className="hidden lg:inline">{chatTab.label}</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            <Badge dot color="#4f46e5" offset={[-2, 2]}>
              <Button type="text" icon={<BellOutlined />} className="text-slate-500 text-lg hover:bg-slate-100 rounded-full w-10 h-10 flex items-center justify-center" />
            </Badge>
            <Button type="text" icon={<QuestionCircleOutlined />} className="text-slate-500 text-lg hover:bg-slate-100 rounded-full w-10 h-10 flex items-center justify-center" />
          </div>
          <div className="h-8 w-[1px] bg-slate-200"></div>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
            <Avatar
              size={40}
              src={user?.avatarUrl ? `${user.avatarUrl}${user.avatarUrl.includes('?') ? '&' : '?'}_r=${avatarRefreshKey}` : undefined}
              icon={<UserOutlined />}
              className="border-2 border-primary cursor-pointer hover:opacity-80 transition-opacity shadow-sm"
            />
          </Dropdown>
        </div>
      </Header>

      <Content className="p-4 bg-slate-50 overflow-x-hidden min-h-[calc(100vh-64px)]">
        <Outlet />
      </Content>
    </Layout>
  );
};

export default MainLayout;
