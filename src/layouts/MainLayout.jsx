import React, { useState } from 'react';
import { Layout, Button, Badge, Dropdown, Avatar, Input } from 'antd';
import {
  DashboardOutlined,
  UserAddOutlined,
  TeamOutlined,
  UserOutlined,
  FileTextOutlined,
  BarChartOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
  SearchOutlined,
  BellOutlined,
  SettingOutlined,
  PlusCircleOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/recruitment',
      icon: <UserAddOutlined />,
      label: 'Recruitment',
    },
    {
      key: '/interns',
      icon: <TeamOutlined />,
      label: 'Interns',
    },
    {
      key: '/mentors',
      icon: <UserOutlined />,
      label: 'Mentors',
    },
    {
      key: '/evaluations',
      icon: <FileTextOutlined />,
      label: 'Evaluations',
    },
    {
      key: '/reports',
      icon: <BarChartOutlined />,
      label: 'Reports',
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => navigate('/login'),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={220}
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        className="hidden md:block fixed left-0 top-0 h-screen bg-white/70 backdrop-blur-[40px] border-r border-white/20 z-50 transition-all duration-300"
        style={{ padding: collapsed ? '24px 0' : '24px' }}
      >
        <div className="flex flex-col mb-8 px-4 overflow-hidden">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                <span className="text-white font-black text-xl">I</span>
             </div>
             {!collapsed && (
               <div className="animate-fadeIn">
                 <h1 className="text-xl font-black text-primary leading-none">IMS System</h1>
                 <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Enterprise Admin</p>
               </div>
             )}
          </div>
        </div>

        <nav className="flex flex-col gap-2 mb-6 px-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.key;
            return (
              <div
                key={item.key}
                onClick={() => navigate(item.key)}
                className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3 px-4'} py-3 cursor-pointer rounded-xl transition-all duration-200 ${isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-gray-500 hover:text-primary hover:bg-gray-50'
                  }`}
              >
                {React.cloneElement(item.icon, { style: { fontSize: '20px' } })}
                {!collapsed && <span className="font-semibold whitespace-nowrap">{item.label}</span>}
              </div>
            );
          })}
        </nav>

        {!collapsed && (
          <div className="px-2 mb-8">
            <Button
              type="primary"
              size="large"
              className="w-full h-12 rounded-xl primary-gradient border-none flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              icon={<PlusCircleOutlined />}
            >
              Post New Role
            </Button>
          </div>
        )}

        <div className="mt-4 border-t border-gray-100 pt-4 flex flex-col gap-2 px-2">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3 px-4'} py-2 text-gray-500 hover:text-primary cursor-pointer transition-colors`}>
            <QuestionCircleOutlined style={{ fontSize: '20px' }} />
            {!collapsed && <span className="text-sm font-medium">Support</span>}
          </div>
          <div
            onClick={() => navigate('/login')}
            className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3 px-4'} py-2 text-gray-500 hover:text-red-500 cursor-pointer transition-colors`}
          >
            <LogoutOutlined style={{ fontSize: '20px' }} />
            {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
          </div>
        </div>
      </Sider>

      <Layout className={collapsed ? 'md:ml-[80px]' : 'md:ml-[220px]'} style={{ transition: 'all 0.2s' }}>
        <Header
          style={{
            padding: '0 24px',
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(40px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
            position: 'sticky',
            top: 0,
            zIndex: 40,
            height: '64px',
          }}
        >
          <div className="flex items-center gap-4">
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="md:hidden"
            />
            <div className="hidden sm:block">
              <Input
                placeholder="Search internships..."
                prefix={<SearchOutlined className="text-gray-400" />}
                className="w-72 rounded-full bg-gray-100/80 border-none h-10 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex gap-2">
              <Badge dot color="#ba1a1a" offset={[-2, 2]}>
                <Button type="text" icon={<BellOutlined />} className="text-gray-500 text-lg hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center" />
              </Badge>
              <Button type="text" icon={<SettingOutlined />} className="text-gray-500 text-lg hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center" />
              <Button type="text" icon={<QuestionCircleOutlined />} className="text-gray-500 text-lg hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center" />
            </div>
            <div className="h-8 w-[1px] bg-gray-100 mx-2 hidden sm:block"></div>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
              <Avatar
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQ8YZQJW_B1YcOEvsZsTJZ8wP3IVeXX53I0OytNVaizwym4OoQHzolqUdgTHPvZ5PC6GXg0Eqij1niDo27dO6TuPr_yv7Dg1TGhE5-Jx43MCnibGVman0Idj7_QPhd74hc3mPLqVTb71moBojriLUOLqM1fbCE-rmRumBE4JdnJpBdK38WRzj_pooDPe3ukt4KDoYtTzKKyu_Yc77duEuJygdEmlyCBFsxOux6jeiAirWdAhqGSDiJOwma5qOETrYN20z0UimeTdI"
                size={40}
                className="border-2 border-primary cursor-pointer hover:opacity-80 transition-opacity shadow-sm"
              />
            </Dropdown>
          </div>
        </Header>

        <Content className="p-5 overflow-x-hidden">
          <Outlet />
        </Content>
      </Layout>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/70 backdrop-blur-[40px] flex justify-around items-center z-50 border-t border-gray-100 px-4">
        <div className="flex flex-col items-center text-gray-400">
          <DashboardOutlined style={{ fontSize: '20px' }} />
          <span className="text-[10px] mt-1">Home</span>
        </div>
        <div className="flex flex-col items-center text-primary font-bold">
          <TeamOutlined style={{ fontSize: '20px' }} />
          <span className="text-[10px] mt-1">Interns</span>
        </div>
        <div className="flex flex-col items-center text-gray-400">
          <BarChartOutlined style={{ fontSize: '20px' }} />
          <span className="text-[10px] mt-1">Reports</span>
        </div>
        <div className="flex flex-col items-center text-gray-400">
          <SettingOutlined style={{ fontSize: '20px' }} />
          <span className="text-[10px] mt-1">Settings</span>
        </div>
      </nav>

      {/* FAB */}
      <button className="fixed bottom-20 right-6 md:bottom-10 md:right-10 w-14 h-14 primary-gradient rounded-full shadow-2xl flex items-center justify-center text-white active:scale-95 duration-200 z-40">
        <PlusCircleOutlined style={{ fontSize: '24px' }} />
      </button>
    </Layout>
  );
};

export default MainLayout;
