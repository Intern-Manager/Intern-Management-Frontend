import React from 'react';
import { Row, Col, Card, Avatar, Tag, Button, List, Timeline, Progress } from 'antd';
import {
  CalendarOutlined,
  TeamOutlined,
  SolutionOutlined,
  NotificationOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';

const CoordinatorDashboard = () => {
  const activeBatches = [
    { name: 'Summer 2024 - Batch A', progress: 65, interns: 24, mentors: 8 },
    { name: 'Summer 2024 - Batch B', progress: 40, interns: 30, mentors: 10 },
    { name: 'Winter 2023 - Final', progress: 100, interns: 15, mentors: 5 },
  ];

  const pendingTasks = [
    { id: 1, task: 'Assign Mentors to Batch B', priority: 'High', due: 'Tomorrow' },
    { id: 2, task: 'Review Mid-term Evaluations', priority: 'Medium', due: 'In 2 days' },
    { id: 3, task: 'Onboard 5 New Interns', priority: 'High', due: 'Today' },
  ];

  return (
    <div className="space-y-8">
      {/* Coordinator Header */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-800">Program Coordination</h1>
          <p className="text-gray-500">Managing 3 active batches and 69 interns.</p>
        </div>
        <div className="flex gap-3">
          <Button icon={<CalendarOutlined />} size="large" className="rounded-2xl h-12">Schedule</Button>
          <Button type="primary" icon={<PlusOutlined />} size="large" className="rounded-2xl h-12 primary-gradient border-none shadow-lg">New Batch</Button>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Active Batches */}
        <Col xs={24} lg={16}>
          <div className="glass-card p-8 rounded-[32px] border border-white/50 h-full">
            <h3 className="text-xl font-bold mb-6">Active Batches</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeBatches.map((batch, index) => (
                <div key={index} className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-gray-800 text-lg leading-tight">{batch.name}</h4>
                    <Tag className={`rounded-full border-none font-bold text-[10px] ${batch.progress === 100 ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                      {batch.progress === 100 ? 'COMPLETED' : 'ACTIVE'}
                    </Tag>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Progression</span>
                      <span className="font-bold text-gray-800">{batch.progress}%</span>
                    </div>
                    <Progress percent={batch.progress} showInfo={false} strokeColor={batch.progress === 100 ? '#10b981' : '#3525cd'} size={10} />
                    <div className="flex gap-4 pt-2">
                      <div className="flex items-center gap-1.5">
                        <TeamOutlined className="text-gray-400" />
                        <span className="text-xs font-bold text-gray-600">{batch.interns} Interns</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <SolutionOutlined className="text-gray-400" />
                        <span className="text-xs font-bold text-gray-600">{batch.mentors} Mentors</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>

        {/* Action Items */}
        <Col xs={24} lg={8}>
          <div className="glass-card p-8 rounded-[32px] border border-white/50 h-full">
            <h3 className="text-xl font-bold mb-6">Priority Tasks</h3>
            <div className="space-y-4">
              {pendingTasks.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-gray-50/50 border border-transparent hover:border-gray-100 transition-all cursor-pointer">
                  <div className={`w-2 h-12 rounded-full ${item.priority === 'High' ? 'bg-error' : 'bg-blue-400'}`}></div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm mb-1">{item.task}</p>
                    <div className="flex items-center gap-2">
                      <Tag className="rounded-full border-none text-[10px] m-0 bg-white font-bold text-gray-400">{item.priority.toUpperCase()}</Tag>
                      <span className="text-[10px] text-gray-400 font-medium">Due {item.due}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button block size="large" className="mt-8 rounded-xl font-bold h-12">See All Tasks</Button>
          </div>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* Timeline */}
        <Col xs={24}>
          <div className="glass-card p-8 rounded-[32px] border border-white/50">
            <h3 className="text-xl font-bold mb-8">Program Timeline</h3>
            <Timeline
              mode="left"
              items={[
                { label: '2024-10-20', children: 'Mid-term evaluation starts for Batch A', color: 'blue' },
                { label: '2024-10-25', children: 'Orientation for new Winter Batch', color: 'green' },
                { label: '2024-11-01', children: 'Final project presentations Batch C', color: 'gray' },
                { label: '2024-11-15', children: 'Mentor recruitment phase begins', color: 'blue' },
              ]}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CoordinatorDashboard;
