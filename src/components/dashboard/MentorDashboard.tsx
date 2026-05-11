import React from 'react';
import { Row, Col, Progress, Avatar, Tag, Button, Typography, Badge } from 'antd';
import {
  UserOutlined,
  MessageOutlined,
  EditOutlined,
  StarFilled,
  ArrowRightOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

const mentees = [
  { name: 'Alex Johnson', role: 'UI/UX Design', progress: 85, lastActive: '2h ago', avatar: 'https://i.pravatar.cc/150?u=a' },
  { name: 'Sarah Miller', role: 'Frontend Dev', progress: 62, lastActive: '5h ago', avatar: 'https://i.pravatar.cc/150?u=s' },
  { name: 'David Chen', role: 'Product Management', progress: 45, lastActive: '1d ago', avatar: 'https://i.pravatar.cc/150?u=d' },
];

const pendingReviews = [
  { title: 'Final Prototype Review', intern: 'Alex Johnson', due: 'Today', priority: 'High' },
  { title: 'Code Audit - Auth Module', intern: 'Sarah Miller', due: 'Tomorrow', priority: 'Medium' },
  { title: 'Project Proposal Feedback', intern: 'David Chen', due: 'Oct 28', priority: 'Low' },
];

const MentorDashboard = () => {
  return (
    <div className="space-y-8">
      <div className="main-gradient rounded-[32px] p-8 text-dark relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-dark">Welcome back, Mentor!</h1>
            <p className="text-lg opacity-90 max-w-lg">You have 3 active mentees. 2 reviews are pending for today.</p>
          </div>
          <div className="hidden md:flex gap-4">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-center">
              <p className="text-3xl font-black mb-0">12</p>
              <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">Mentees Guided</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-center">
              <p className="text-3xl font-black mb-0">4.9</p>
              <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">Rating</p>
            </div>
          </div>
        </div>
        <div className="absolute right-[-30px] bottom-[-50px] opacity-10 transform -rotate-12">
          <StarFilled style={{ fontSize: '240px' }} />
        </div>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <div className="glass-card p-8 rounded-[32px] border border-white/50 h-full">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold">Your Mentees</h3>
              <Button type="link" className="font-bold p-0">View All</Button>
            </div>
            <div className="space-y-6">
              {mentees.map((mentee, index) => (
                <div key={index} className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-3xl bg-white border border-gray-50 shadow-sm hover:shadow-md transition-all">
                  <Badge dot color={mentee.lastActive.includes('h') ? '#10b981' : '#d1d5db'} offset={[-5, 40]}>
                    <Avatar size={64} src={mentee.avatar} className="border-2 border-white shadow-sm" />
                  </Badge>
                  <div className="flex-1 text-center md:text-left">
                    <h4 className="font-bold text-lg text-gray-800 mb-0">{mentee.name}</h4>
                    <p className="text-xs text-gray-500 mb-2">{mentee.role} - Active {mentee.lastActive}</p>
                    <Progress percent={mentee.progress} strokeColor="#3525cd" size={8} />
                  </div>
                  <div className="flex gap-2">
                    <Button icon={<MessageOutlined />} className="rounded-xl h-10 w-10 flex items-center justify-center border-gray-100" />
                    <Button icon={<EditOutlined />} className="rounded-xl h-10 w-10 flex items-center justify-center bg-gray-50 border-none" />
                    <Button type="primary" icon={<ArrowRightOutlined />} className="rounded-xl h-10 px-4 flex items-center justify-center primary-gradient border-none" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>

        <Col xs={24} lg={8}>
          <div className="glass-card p-8 rounded-[32px] border border-white/50 h-full flex flex-col">
            <h3 className="text-xl font-bold mb-6">Pending Reviews</h3>
            <div className="space-y-4 flex-1">
              {pendingReviews.map((review, index) => (
                <div key={index} className="p-4 rounded-2xl bg-white border border-gray-50 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <Tag className={`text-[10px] font-bold border-none rounded-full px-2 ${review.priority === 'High' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                      }`}>
                      {review.priority.toUpperCase()}
                    </Tag>
                    <span className="text-[10px] text-gray-400 font-bold">{review.due.toUpperCase()}</span>
                  </div>
                  <h5 className="font-bold text-gray-800 text-sm mb-1">{review.title}</h5>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <UserOutlined className="text-[10px]" /> {review.intern}
                  </p>
                </div>
              ))}
            </div>
            <Button block size="large" className="mt-8 rounded-xl font-bold h-12 bg-gray-50 border-none text-primary hover:bg-primary hover:text-white transition-all">
              Review Dashboard
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default MentorDashboard;
