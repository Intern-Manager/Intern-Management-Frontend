import React from 'react';
import { Row, Col, Progress, Avatar, Tag, Button } from 'antd';
import {
  UserAddOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileSearchOutlined,
  FilterOutlined,
} from '@ant-design/icons';

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

const HRDashboard = () => {
  return (
    <div className="space-y-3">
      <div className="primary-gradient rounded-2xl p-5 text-white flex justify-between items-center shadow-lg">
        <div>
          <h1 className="text-xl font-bold mb-1 text-white">Recruitment Pipeline</h1>
          <p className="text-sm opacity-80">You have 12 open roles and 458 active applications.</p>
        </div>
        <Button icon={<UserAddOutlined />} className="h-11 px-5 rounded-xl bg-white text-primary border-none font-bold shadow hover:scale-[1.02] transition-transform">
          Create Job Posting
        </Button>
      </div>

      <Row gutter={[10, 10]}>
        {stats.map((stat, index) => (
          <Col xs={12} sm={12} lg={6} key={index}>
            <div className="glass-card p-4 rounded-xl border border-white/50 h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-gray-50 text-lg" style={{ color: stat.color }}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-0">{stat.title}</p>
                  <p className="text-gray-400 text-[10px]">{stat.subtitle}</p>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{stat.value}</h2>
            </div>
          </Col>
        ))}
      </Row>

      <Row gutter={[10, 10]}>
        <Col xs={24} lg={14}>
          <div className="glass-card p-4 rounded-xl border border-white/50 h-full">
            <h3 className="text-base font-bold mb-4">Pipeline Breakdown</h3>
            <div className="space-y-4">
              {pipelineStages.map((stage, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-gray-700 text-sm">{stage.stage}</span>
                    <span className="font-bold text-primary">{stage.count}</span>
                  </div>
                  <Progress
                    percent={stage.percent}
                    showInfo={false}
                    strokeColor={stage.color === '#eceef0' ? '#e5e7eb' : stage.color}
                    size={8}
                    className="rounded-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </Col>

        <Col xs={24} lg={10}>
          <div className="glass-card p-4 rounded-xl border border-white/50 h-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold">Recent Applicants</h3>
              <Button type="text" icon={<FilterOutlined />} className="bg-gray-100 rounded-lg" />
            </div>
              <div className="space-y-1">
                {recentApplicants.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 py-3 group cursor-pointer">
                    <Avatar size={40} src={item.avatar} className="border-2 border-white shadow-sm" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm mb-0 group-hover:text-primary transition-colors">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.role}</p>
                    </div>
                    <div className="text-right">
                      <Tag className={`rounded-full border-none font-bold text-[10px] px-2 ${
                        item.status === 'Offered' ? 'bg-green-100 text-green-600' :
                        item.status === 'Interview' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {item.status.toUpperCase()}
                      </Tag>
                      <p className="text-[10px] text-gray-400 mt-0.5">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            <Button block className="mt-3 rounded-lg font-bold border-gray-200">View All</Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default HRDashboard;
