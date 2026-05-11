import React from 'react';
import { Row, Col, Progress, Avatar, Tag, Button, Typography } from 'antd';
import {
  ArrowRightOutlined,
  CheckCircleFilled,
  BookOutlined,
  VideoCameraOutlined,
  BulbOutlined,
  AudioOutlined,
  FilterOutlined,
  StarFilled,
} from '@ant-design/icons';

const { Paragraph } = Typography;

const learningResources = [
  { title: 'Design Systems 101', desc: 'Master the art of building scalable UI components and tokens.', icon: <BookOutlined />, color: 'blue' },
  { title: 'Advanced Figma Prototypes', desc: 'Complex animations and logic-based transitions.', icon: <VideoCameraOutlined />, color: 'cyan' },
  { title: 'Cognitive Load in UI', desc: 'Understand how users process visual information.', icon: <BulbOutlined />, color: 'purple' },
  { title: 'Future of Enterprise AI', desc: 'Interview with leading industry experts on AI UX.', icon: <AudioOutlined />, color: 'red' },
];

const events = [
  { day: '24', month: 'OCT', title: 'Weekly Sync', time: '10:00 AM - 11:00 AM', type: 'Zoom' },
  { day: '25', month: 'OCT', title: '1-on-1 Sarah', time: '02:30 PM - 03:00 PM', type: 'Office Room B' },
  { day: '27', month: 'OCT', title: 'Hackathon Kickoff', time: 'All Day Event', type: 'Main Hall' },
];

const InternDashboard = () => {
  return (
    <div className="space-y-6">
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <div className="primary-gradient rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl min-h-[240px] flex flex-col justify-center">
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-2 text-white">Welcome back, Alex!</h1>
              <p className="text-lg opacity-90 max-w-lg mb-8">
                You are making incredible progress in your UI/UX Design internship. Only 4 weeks left until your final evaluation!
              </p>
              <div className="flex gap-4">
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 flex-1">
                  <p className="text-[10px] uppercase tracking-widest opacity-70 mb-1">Current Week</p>
                  <p className="text-xl font-bold">Week 8 of 12</p>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 flex-1">
                  <p className="text-[10px] uppercase tracking-widest opacity-70 mb-1">Completed Tasks</p>
                  <p className="text-xl font-bold">42 / 50</p>
                </div>
              </div>
            </div>
            <div className="absolute right-[-20px] bottom-[-40px] opacity-10 transform rotate-12">
              <StarFilled style={{ fontSize: '200px' }} />
            </div>
          </div>
        </Col>

        <Col xs={24} lg={8}>
          <div className="glass-card rounded-[32px] p-6 h-full flex flex-col gap-4 border border-white/50">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-primary">Mentor Feedback</h3>
              <CheckCircleFilled className="text-primary text-xl" />
            </div>
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <Avatar
                size={48}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4DiXdFZwXfbqdYUqrQ3_a1kO7MY9Wvf9Qm9cGFzfsA5r44xqWsoZP-g5DNNlWmtAItQF6FXVaR7MCHT8iuhM4F0I0UAd3ZzGqgL8vw6VG7COvkjhRYb9ss6KM_MYUDAs768HRqmP5iH_cbC3-GjVYY6YSLBLWtxGfVr6ydZvjeenkv23-haRh4D8HuCBHfUJAkjcuRCyv-E1Mv6H-NvHWDX04R5vtmbB2IgcHh6t0cgzo4Tc0e67hq6u4hBpkPdHgGRNK7V9uwq4"
                className="border-2 border-white"
              />
              <div>
                <p className="font-bold text-gray-800 leading-none mb-1">Sarah Chen</p>
                <p className="text-xs text-gray-500">Senior Product Designer</p>
              </div>
            </div>
            <Paragraph className="italic text-gray-600 text-sm leading-relaxed mb-0">
              "Your latest wireframe iteration showed a deep understanding of user accessibility. Keep refining the interaction states!"
            </Paragraph>
            <Button
              type="text"
              className="mt-auto text-primary p-0 h-auto font-bold flex items-center gap-2 hover:translate-x-1 transition-all w-fit"
            >
              View Full Report <ArrowRightOutlined />
            </Button>
          </div>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <div className="glass-card rounded-[32px] p-8 h-full border border-white/50">
            <h3 className="text-xl font-bold mb-8">Skill Growth</h3>
            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-3">
                  <span className="font-semibold text-gray-700">Visual Design</span>
                  <span className="text-primary font-bold">85%</span>
                </div>
                <Progress percent={85} showInfo={false} strokeColor="#3525cd" railColor="#eceef0" size={12} />
              </div>
              <div>
                <div className="flex justify-between mb-3">
                  <span className="font-semibold text-gray-700">User Research</span>
                  <span className="text-secondary font-bold">60%</span>
                </div>
                <Progress percent={60} showInfo={false} strokeColor="#00687a" railColor="#eceef0" size={12} />
              </div>
              <div>
                <div className="flex justify-between mb-3">
                  <span className="font-semibold text-gray-700">Prototyping</span>
                  <span className="text-primary font-bold">92%</span>
                </div>
                <Progress percent={92} showInfo={false} strokeColor="#3525cd" railColor="#eceef0" size={12} />
              </div>
              <div>
                <div className="flex justify-between mb-3">
                  <span className="font-semibold text-gray-700">Collaboration</span>
                  <span className="text-gray-400 font-bold">78%</span>
                </div>
                <Progress percent={78} showInfo={false} strokeColor="#41485e" railColor="#eceef0" size={12} />
              </div>
            </div>
          </div>
        </Col>

        <Col xs={24} lg={16}>
          <div className="glass-card rounded-[32px] p-8 h-full border border-white/50 overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold">Task Management</h3>
              <Button type="text" icon={<FilterOutlined />} className="bg-gray-100 rounded-xl" />
            </div>
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              <div className="min-w-[280px] flex-1 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 bg-gray-400 rounded-full"></span>
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">To Do</span>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 hover:shadow-md transition-shadow cursor-pointer">
                  <p className="font-bold text-gray-800 mb-3">Iterate Mobile Navigation</p>
                  <div className="flex items-center justify-between">
                    <Tag color="error" className="rounded-full font-bold text-[10px]">HIGH</Tag>
                    <span className="text-[10px] text-gray-400">Due: Oct 24</span>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 hover:shadow-md transition-shadow cursor-pointer">
                  <p className="font-bold text-gray-800 mb-3">User Interview Prep</p>
                  <div className="flex items-center justify-between">
                    <Tag className="rounded-full font-bold text-[10px] bg-gray-100 border-none">MEDIUM</Tag>
                    <span className="text-[10px] text-gray-400">Due: Oct 26</span>
                  </div>
                </div>
              </div>

              <div className="min-w-[280px] flex-1 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 bg-primary rounded-full"></span>
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">Active</span>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-primary/20 ring-1 ring-primary/5 hover:shadow-md transition-shadow cursor-pointer">
                  <p className="font-bold text-gray-800 mb-3">Component Library Audit</p>
                  <div className="flex items-center justify-between mb-4">
                    <Tag color="processing" className="rounded-full font-bold text-[10px]">DEV</Tag>
                    <span className="text-[10px] text-gray-400">Due: Today</span>
                  </div>
                  <Avatar.Group size="small">
                    <Avatar src="https://i.pravatar.cc/150?u=1" />
                    <Avatar src="https://i.pravatar.cc/150?u=2" />
                  </Avatar.Group>
                </div>
              </div>

              <div className="min-w-[280px] flex-1 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                  <span className="text-xs font-bold uppercase tracking-widest text-green-500">Completed</span>
                </div>
                <div className="bg-white/50 p-5 rounded-2xl border border-gray-50 opacity-70">
                  <p className="font-bold text-gray-400 mb-3 line-through">Brand Styleguide V1</p>
                  <div className="flex items-center gap-1 text-green-500">
                    <CheckCircleFilled style={{ fontSize: '12px' }} />
                    <span className="text-[10px] font-bold">DONE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <div className="glass-card rounded-[32px] p-8 h-full border border-white/50">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold">Learning Hub</h3>
              <Button type="link" className="font-bold p-0">Browse All</Button>
            </div>
            <Row gutter={[16, 16]}>
              {learningResources.map((res, index) => (
                <Col xs={24} md={12} key={index}>
                  <div className="flex gap-4 p-4 rounded-[20px] hover:bg-gray-50 transition-colors cursor-pointer group border border-transparent hover:border-gray-100">
                    <div className={`w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-primary-container group-hover:text-white transition-colors`}>
                      {React.cloneElement(res.icon as React.ReactElement<{ style?: React.CSSProperties }>, { style: { fontSize: '24px' } })}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1 group-hover:text-primary transition-colors">{res.title}</h4>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{res.desc}</p>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </Col>

        <Col xs={24} lg={8}>
          <div className="glass-card rounded-[32px] p-8 h-full flex flex-col border border-white/50">
            <h3 className="text-xl font-bold mb-8">Upcoming Events</h3>
            <div className="space-y-6 flex-1">
              {events.map((event, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex flex-col items-center bg-gray-100 rounded-xl p-2 min-w-[56px] border border-gray-50">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{event.month}</span>
                    <span className="text-2xl font-black text-gray-800 leading-none">{event.day}</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 mb-0.5">{event.title}</p>
                    <p className="text-xs text-gray-500 mb-2">{event.time}</p>
                    <Tag className="rounded-full text-[10px] bg-blue-50 text-blue-600 border-none font-bold px-3">
                      {event.type}
                    </Tag>
                  </div>
                </div>
              ))}
            </div>
            <Button block className="mt-8 h-12 rounded-xl font-bold border-gray-200 hover:border-primary hover:text-primary transition-all">
              Open Calendar
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default InternDashboard;
