import React from 'react';
import { Row, Col, Progress, Avatar, Tag, Button, List, Badge } from 'antd';
import {
  UserAddOutlined,
  SendOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  FileSearchOutlined,
  FilterOutlined,
} from '@ant-design/icons';

const HRDashboard = () => {
  const stats = [
    { title: 'Open Roles', value: '12', subtitle: '4 Urgent', icon: <UserAddOutlined />, color: '#3525cd' },
    { title: 'Total Applications', value: '458', subtitle: '+48 this week', icon: <FileSearchOutlined />, color: '#00687a' },
    { title: 'Interviews', value: '24', subtitle: 'Scheduled Today', icon: <ClockCircleOutlined />, color: '#41485e' },
    { title: 'Offer Acceptance', value: '85%', subtitle: '+5% vs Last Month', icon: <CheckCircleOutlined />, color: '#10b981' },
  ];

  const pipelineStages = [
    { stage: 'Application Received', count: 180, percent: 100, color: '#eceef0' },
    { stage: 'Phone Screen', count: 85, percent: 47, color: '#3525cd' },
    { stage: 'Technical Assessment', count: 42, percent: 23, color: '#00687a' },
    { stage: 'Final Interview', count: 18, percent: 10, color: '#41485e' },
  ];

  const recentApplicants = [
    { name: 'John Doe', role: 'Frontend Intern', status: 'In Review', date: 'Oct 20', avatar: 'https://i.pravatar.cc/150?u=1' },
    { name: 'Jane Smith', role: 'Backend Intern', status: 'Interview', date: 'Oct 21', avatar: 'https://i.pravatar.cc/150?u=2' },
    { name: 'Mike Ross', role: 'UI/UX Intern', status: 'Offered', date: 'Oct 22', avatar: 'https://i.pravatar.cc/150?u=3' },
  ];

  return (
    <div className="space-y-8">
      {/* Recruitment Overview Header */}
      <div className="primary-gradient rounded-[32px] p-10 text-white flex justify-between items-center shadow-xl">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-white">Recruitment Pipeline</h1>
          <p className="text-lg opacity-80">You have 12 open roles and 458 active applications.</p>
        </div>
        <Button size="large" icon={<UserAddOutlined />} className="h-14 px-8 rounded-2xl bg-white text-primary border-none font-bold shadow-lg hover:scale-105 transition-transform">
          Create Job Posting
        </Button>
      </div>

      {/* Quick Stats */}
      <Row gutter={[24, 24]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <div className="glass-card p-6 rounded-[32px] border border-white/50 h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-2xl bg-gray-50 text-xl" style={{ color: stat.color }}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-0">{stat.title}</p>
                  <p className="text-gray-400 text-[10px]">{stat.subtitle}</p>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">{stat.value}</h2>
            </div>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        {/* Pipeline Breakdown */}
        <Col xs={24} lg={14}>
          <div className="glass-card p-8 rounded-[32px] border border-white/50 h-full">
            <h3 className="text-xl font-bold mb-8">Pipeline Breakdown</h3>
            <div className="space-y-8">
              {pipelineStages.map((stage, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-700">{stage.stage}</span>
                    <span className="font-bold text-primary">{stage.count}</span>
                  </div>
                  <Progress 
                    percent={stage.percent} 
                    showInfo={false} 
                    strokeColor={stage.color === '#eceef0' ? '#e5e7eb' : stage.color} 
                    size={14}
                    className="rounded-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </Col>

        {/* Recent Applicants */}
        <Col xs={24} lg={10}>
          <div className="glass-card p-8 rounded-[32px] border border-white/50 h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Recent Applicants</h3>
              <Button type="text" icon={<FilterOutlined />} className="bg-gray-100 rounded-xl" />
            </div>
            <List
              dataSource={recentApplicants}
              renderItem={(item) => (
                <List.Item className="border-none px-0 py-4">
                  <div className="flex items-center gap-4 w-full group cursor-pointer">
                    <Avatar size={48} src={item.avatar} className="border-2 border-white shadow-sm" />
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 mb-0 group-hover:text-primary transition-colors">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.role}</p>
                    </div>
                    <div className="text-right">
                      <Tag className={`rounded-full border-none font-bold text-[10px] px-3 ${
                        item.status === 'Offered' ? 'bg-green-100 text-green-600' : 
                        item.status === 'Interview' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {item.status.toUpperCase()}
                      </Tag>
                      <p className="text-[10px] text-gray-400 mt-1">{item.date}</p>
                    </div>
                  </div>
                </List.Item>
              )}
            />
            <Button block size="large" className="mt-4 rounded-xl font-bold border-gray-200">View All Applications</Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default HRDashboard;
