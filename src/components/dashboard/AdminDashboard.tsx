import React from 'react';
import { Row, Col, Card, Statistic, Avatar, Tag, Button, Typography, Progress } from 'antd';
import {
  UserOutlined,
  SafetyCertificateOutlined,
  GlobalOutlined,
  LineChartOutlined,
  TeamOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  SettingOutlined,
  BellOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const stats = [
  { title: 'Total Users', value: 1250, icon: <TeamOutlined />, color: '#3525cd', trend: '+12%', isUp: true },
  { title: 'System Health', value: '98.2%', icon: <SafetyCertificateOutlined />, color: '#00687a', trend: 'Stable', isUp: true },
  { title: 'Global Reach', value: 24, icon: <GlobalOutlined />, color: '#41485e', trend: '+2 countries', isUp: true },
  { title: 'Active Sessions', value: 482, icon: <LineChartOutlined />, color: '#ba1a1a', trend: '-5%', isUp: false },
];

const recentLogs = [
  { id: 1, user: 'Admin_Root', action: 'Modified System Policy', time: '2 mins ago', type: 'Security' },
  { id: 2, user: 'HR_Director', action: 'Bulk Uploaded 50 Interns', time: '15 mins ago', type: 'Data' },
  { id: 3, user: 'System', action: 'Auto-backup Completed', time: '1 hour ago', type: 'System' },
  { id: 4, user: 'Mentor_02', action: 'Updated Evaluation Rubric', time: '3 hours ago', type: 'Update' },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-8 rounded-[32px] shadow-sm border border-gray-50">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">System Overview</h1>
          <p className="text-gray-500">Welcome back to the Admin Command Center.</p>
        </div>
        <div className="flex gap-3">
          <Button icon={<SettingOutlined />} size="large" className="rounded-xl">Settings</Button>
          <Button type="primary" icon={<BellOutlined />} size="large" className="rounded-xl primary-gradient border-none">Notifications</Button>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <div className="glass-card p-6 rounded-[32px] border border-white/50 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                  {React.cloneElement(stat.icon as React.ReactElement<{ style?: React.CSSProperties }>, { style: { fontSize: '24px' } })}
                </div>
                <Tag color={stat.isUp ? 'success' : 'error'} className="rounded-full border-none font-bold">
                  {stat.isUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {stat.trend}
                </Tag>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
                <h2 className="text-3xl font-bold text-gray-800">{stat.value}</h2>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <div className="glass-card p-8 rounded-[32px] border border-white/50 h-full">
            <h3 className="text-xl font-bold mb-6">User Distribution</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-700">Interns</span>
                  <span className="font-bold">850 / 1250</span>
                </div>
                <Progress percent={68} showInfo={false} strokeColor="#3525cd" size={12} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-700">Mentors</span>
                  <span className="font-bold">240 / 1250</span>
                </div>
                <Progress percent={19} showInfo={false} strokeColor="#00687a" size={12} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-700">HR Managers</span>
                  <span className="font-bold">120 / 1250</span>
                </div>
                <Progress percent={10} showInfo={false} strokeColor="#41485e" size={12} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-700">Coordinators</span>
                  <span className="font-bold">40 / 1250</span>
                </div>
                <Progress percent={3} showInfo={false} strokeColor="#ba1a1a" size={12} />
              </div>
            </div>
          </div>
        </Col>

        <Col xs={24} lg={12}>
          <div className="glass-card p-8 rounded-[32px] border border-white/50 h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Recent Audit Logs</h3>
              <Button type="link" className="p-0 font-bold">View Full Logs</Button>
            </div>
              <div className="space-y-3">
                {recentLogs.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 py-3">
                    <Avatar icon={<UserOutlined />} className="bg-gray-100 text-gray-400" />
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 mb-0">{item.user}</p>
                      <p className="text-xs text-gray-500">{item.action}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-medium mb-1">{item.time}</p>
                      <Tag className="rounded-full text-[10px] m-0 border-none bg-gray-100 font-bold">{item.type}</Tag>
                    </div>
                  </div>
                ))}
              </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
