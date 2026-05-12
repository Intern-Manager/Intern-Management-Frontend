import React from 'react';
import { Row, Col, Avatar, Tag, Button, Timeline, Progress } from 'antd';
import {
  CalendarOutlined,
  TeamOutlined,
  SolutionOutlined,
  PlusOutlined,
} from '@ant-design/icons';

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

const CoordinatorDashboard = () => {
  return (
    <div className="space-y-3">
      <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Program Coordination</h1>
          <p className="text-gray-500 text-sm">Managing 3 active batches and 69 interns.</p>
        </div>
        <div className="flex gap-2">
          <Button icon={<CalendarOutlined />} className="rounded-lg h-10">Schedule</Button>
          <Button type="primary" icon={<PlusOutlined />} className="rounded-lg h-10 primary-gradient border-none shadow">New Batch</Button>
        </div>
      </div>

      <Row gutter={[10, 10]}>
        <Col xs={24} lg={16}>
          <div className="glass-card p-4 rounded-xl border border-white/50 h-full">
            <h3 className="text-base font-bold mb-4">Active Batches</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeBatches.map((batch, index) => (
                <div key={index} className="bg-white p-4 rounded-xl border border-gray-50 shadow-sm hover:shadow transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-gray-800 text-sm leading-tight">{batch.name}</h4>
                    <Tag className={`rounded-full border-none font-bold text-[10px] ${batch.progress === 100 ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                      {batch.progress === 100 ? 'COMPLETED' : 'ACTIVE'}
                    </Tag>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Progression</span>
                      <span className="font-bold text-gray-800">{batch.progress}%</span>
                    </div>
                    <Progress percent={batch.progress} showInfo={false} strokeColor={batch.progress === 100 ? '#10b981' : '#4f46e5'} size={6} />
                    <div className="flex gap-3 pt-1">
                      <div className="flex items-center gap-1">
                        <TeamOutlined className="text-gray-400 text-xs" />
                        <span className="text-xs font-medium text-gray-600">{batch.interns} Interns</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <SolutionOutlined className="text-gray-400 text-xs" />
                        <span className="text-xs font-medium text-gray-600">{batch.mentors} Mentors</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>

        <Col xs={24} lg={8}>
          <div className="glass-card p-4 rounded-xl border border-white/50 h-full">
            <h3 className="text-base font-bold mb-3">Priority Tasks</h3>
            <div className="space-y-2">
              {pendingTasks.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 rounded-lg bg-gray-50/50 border border-transparent hover:border-gray-100 transition-all cursor-pointer">
                  <div className={`w-1.5 h-10 rounded-full ${item.priority === 'High' ? 'bg-error' : 'bg-blue-400'}`}></div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm mb-1">{item.task}</p>
                    <div className="flex items-center gap-2">
                      <Tag className="rounded-full border-none text-[10px] m-0 bg-white font-medium text-gray-400">{item.priority}</Tag>
                      <span className="text-[10px] text-gray-400">Due {item.due}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button block className="mt-3 rounded-lg font-medium h-10">See All Tasks</Button>
          </div>
        </Col>
      </Row>

      <Row gutter={[10, 10]}>
        <Col xs={24}>
          <div className="glass-card p-4 rounded-xl border border-white/50">
            <h3 className="text-base font-bold mb-4">Program Timeline</h3>
            <Timeline
              mode="left"
              items={[
                { label: '2024-10-20', content: 'Mid-term evaluation starts for Batch A', color: 'blue' },
                { label: '2024-10-25', content: 'Orientation for new Winter Batch', color: 'green' },
                { label: '2024-11-01', content: 'Final project presentations Batch C', color: 'gray' },
                { label: '2024-11-15', content: 'Mentor recruitment phase begins', color: 'blue' },
              ]}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CoordinatorDashboard;
