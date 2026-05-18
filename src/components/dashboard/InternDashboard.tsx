import React, { useState, useEffect } from 'react';
import { Row, Col, Progress, Avatar, Tag, Button, Typography, Card, Spin, message, Table, Modal, Form, Input, Select, DatePicker, Tabs, Space } from 'antd';
import {
  ArrowRightOutlined, CheckCircleFilled, BookOutlined,
  VideoCameraOutlined, BulbOutlined, AudioOutlined,
  FilterOutlined, StarFilled, EditOutlined, WarningOutlined,
  CheckCircleOutlined, PlusOutlined, UploadOutlined, LoginOutlined, LogoutOutlined, CalendarOutlined, TeamOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { internProfileService } from '../../services/internProfileService';
import { taskService, TaskItem, TaskSubmission } from '../../services/taskService';
import { learningResourceService, LearningResource } from '../../services/learningResourceService';
import { dailyLogService, DailyLog } from '../../services/dailyLogService';
import { attendanceService, Attendance } from '../../services/attendanceService';
import { interviewService, InterviewDto } from '../../services/interviewService';
import dayjs from 'dayjs';

const { Paragraph, Text } = Typography;
const { TextArea } = Input;

const learningResources = [
  { title: 'Design Systems 101', desc: 'Master the art of building scalable UI components and tokens.', icon: <BookOutlined />, color: 'blue' },
  { title: 'Advanced Figma Prototypes', desc: 'Complex animations and logic-based transitions.', icon: <VideoCameraOutlined />, color: 'cyan' },
  { title: 'Cognitive Load in UI', desc: 'Understand how users process visual information.', icon: <BulbOutlined />, color: 'purple' },
  { title: 'Future of Enterprise AI', desc: 'Interview with leading industry experts on AI UX.', icon: <AudioOutlined />, color: 'red' },
];

const events = [
  { day: '24', month: 'MAY', title: 'Weekly Sync', time: '10:00 AM - 11:00 AM', type: 'Zoom' },
  { day: '25', month: 'MAY', title: '1-on-1 Mentor', time: '02:30 PM - 03:00 PM', type: 'Office Room B' },
  { day: '27', month: 'MAY', title: 'Hackathon Kickoff', time: 'All Day Event', type: 'Main Hall' },
];

const InternDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileLoading, setProfileLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [taskLoading, setTaskLoading] = useState(false);
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [taskModal, setTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([]);
  const [submitForm] = Form.useForm();

  // Daily Logs & Attendance state
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [logModal, setLogModal] = useState(false);
  const [logForm] = Form.useForm();

  // Interviews state
  const [interviews, setInterviews] = useState<InterviewDto[]>([]);
  const [interviewsLoading, setInterviewsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchTasks();
      fetchResources();
      fetchDailyLogs();
      fetchTodayAttendance();
      fetchInterviews();
    }
  }, [user]);

  const fetchInterviews = async () => {
    if (!user) return;
    setInterviewsLoading(true);
    try {
      const { data } = await interviewService.getAll({ page: 1, pageSize: 50 });
      setInterviews(data.items);
    } catch {
      message.error('Failed to load interviews');
    } finally {
      setInterviewsLoading(false);
    }
  };

  const fetchProfile = async () => {
    if (!user) return;
    setProfileLoading(true);
    try {
      const { data } = await internProfileService.getProfile(user.userId);
      setProfile(data);
    } catch {
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchTasks = async () => {
    if (!user) return;
    setTaskLoading(true);
    try {
      const data = await taskService.getTasksByIntern(user.userId);
      setTasks(data.items);
    } catch {
      message.error('Failed to load tasks');
    } finally {
      setTaskLoading(false);
    }
  };

  const fetchResources = async () => {
    try {
      const data = await learningResourceService.getResourcesByProgram(0);
      setResources(data);
    } catch {
      // ignore
    }
  };

  const fetchDailyLogs = async () => {
    if (!user) return;
    setLogsLoading(true);
    try {
      const data = await dailyLogService.getLogsByIntern(user.userId);
      setDailyLogs(data.items);
    } catch {
      message.error('Failed to load daily logs');
    } finally {
      setLogsLoading(false);
    }
  };

  const fetchTodayAttendance = async () => {
    if (!user) return;
    setAttendanceLoading(true);
    try {
      const today = dayjs().format('YYYY-MM-DD');
      const data = await attendanceService.getAttendanceByDate(user.userId, today);
      setTodayAttendance(data);
    } catch {
      setTodayAttendance(null);
    } finally {
      setAttendanceLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!user) return;
    try {
      const now = dayjs();
      const today = now.format('YYYY-MM-DD');
      const time = now.format('HH:mm:ss');
      const result = await attendanceService.checkIn({
        internId: user.userId,
        attendanceDate: today,
        checkInTime: time,
        status: 'Present',
      });
      setTodayAttendance(result);
      message.success('Checked in successfully!');
    } catch {
      message.error('Failed to check in');
    }
  };

  const handleCheckOut = async () => {
    if (!todayAttendance) return;
    try {
      const now = dayjs().format('HH:mm:ss');
      const result = await attendanceService.checkOut({
        attendanceId: todayAttendance.attendanceId,
        checkOutTime: now,
      });
      setTodayAttendance(result);
      message.success('Checked out successfully!');
    } catch {
      message.error('Failed to check out');
    }
  };

  const handleSubmitLog = async (values: { activityDescription: string; hoursWorked?: number; challengesFaced?: string }) => {
    if (!user) return;
    try {
      await dailyLogService.createLog({
        internId: user.userId,
        logDate: dayjs().format('YYYY-MM-DD'),
        activityDescription: values.activityDescription,
        hoursWorked: values.hoursWorked,
        challengesFaced: values.challengesFaced,
      });
      message.success('Daily log submitted successfully!');
      setLogModal(false);
      logForm.resetFields();
      fetchDailyLogs();
    } catch {
      message.error('Failed to submit daily log');
    }
  };

  const handleSubmitTask = async (values: { submissionUrl?: string; submissionText?: string; comments?: string }) => {
    if (!selectedTask) return;
    try {
      await taskService.submitTask(selectedTask.taskId, values);
      message.success('Task submitted successfully');
      setTaskModal(false);
      submitForm.resetFields();
      fetchTasks();
    } catch {
      message.error('Failed to submit task');
    }
  };

  const score = profile ? calculateScore(profile) : 0;
  const isIncomplete = score < 80;

  // Group tasks by status
  const todoTasks = tasks.filter(t => t.status === 'Pending');
  const activeTasks = tasks.filter(t => t.status === 'InProgress');
  const completedTasks = tasks.filter(t => t.status === 'Completed');

  return (
    <div className="space-y-3">
      {/* Welcome Banner */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <div className="primary-gradient rounded-3xl p-6 text-white relative overflow-hidden shadow-xl min-h-[200px] flex flex-col justify-center">
            <div className="relative z-10">
              <h1 className="text-2xl font-bold mb-2 text-white">
                Welcome back{user?.fullName ? `, ${user.fullName.split(' ').pop()}!` : '!'}
              </h1>
              <p className="text-sm opacity-90 max-w-lg mb-6">
                {profile
                  ? 'Your intern profile is looking great. Keep up the good work!'
                  : 'Complete your intern profile to get started. Add your education, skills, and upload your CV.'}
              </p>
              <div className="flex gap-4">
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 flex-1">
                  <p className="text-[10px] uppercase tracking-widest opacity-70 mb-1">Profile</p>
                  <p className="text-xl font-bold">{score}% Complete</p>
                </div>
                {profile?.university && (
                  <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 flex-1">
                    <p className="text-[10px] uppercase tracking-widest opacity-70 mb-1">University</p>
                    <p className="text-sm font-bold truncate">{profile.university}</p>
                  </div>
                )}
                {profile?.major && (
                  <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 flex-1">
                    <p className="text-[10px] uppercase tracking-widest opacity-70 mb-1">Major</p>
                    <p className="text-sm font-bold truncate">{profile.major}</p>
                  </div>
                )}
              </div>

              {/* Campaigns Banner */}
              <div className="mt-4 bg-white/15 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TeamOutlined style={{ fontSize: 24 }} />
                  <div>
                    <p className="font-bold text-sm">Explore Open Internships</p>
                    <p className="text-xs opacity-80">Know someone interested? Share open positions!</p>
                  </div>
                </div>
                <Button
                  type="default"
                  size="small"
                  icon={<TeamOutlined />}
                  onClick={() => navigate('/intern/campaigns')}
                  className="rounded-xl bg-white/20 border-white/30 text-white hover:bg-white/30 hover:border-white/40"
                >
                  View Positions
                </Button>
              </div>
            </div>
            <div className="absolute right-[-20px] bottom-[-40px] opacity-10 transform rotate-12">
              <StarFilled style={{ fontSize: '200px' }} />
            </div>
          </div>
        </Col>

        {/* Profile Completion Alert */}
        <Col xs={24} lg={8}>
          <Card
            className="rounded-3xl h-full shadow-sm border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50"
            styles={{ body: { padding: '20px' } }}
          >
            {profileLoading ? (
              <div className="flex items-center justify-center h-full">
                <Spin size="small" />
              </div>
            ) : isIncomplete ? (
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <WarningOutlined style={{ color: '#f59e0b', fontSize: 18 }} />
                    <Text strong className="text-amber-800">Profile Incomplete</Text>
                  </div>
                  <Paragraph className="text-amber-700 text-sm mb-3">
                    Complete your profile to help mentors and coordinators learn more about you.
                  </Paragraph>
                  <Progress
                    percent={score}
                    strokeColor="#f59e0b"
                    railColor="#fde68a"
                    size="small"
                    className="[&_.ant-progress-inner]:!rounded-full"
                  />
                  <Text type="secondary" className="text-xs mt-1 block">{score}% complete</Text>
                </div>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  className="mt-4 rounded-xl font-bold h-10 bg-amber-500 border-amber-500 hover:bg-amber-600 hover:border-amber-600"
                  onClick={() => navigate('/intern/profile')}
                  block
                >
                  {profile ? 'Complete Profile' : 'Create Profile'}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col h-full justify-between">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircleFilled style={{ color: '#10b981', fontSize: 18 }} />
                  <Text strong className="text-green-800">Profile Complete</Text>
                </div>
                <Paragraph className="text-green-700 text-sm mb-3">
                  Your profile is ready. Keep it updated as you gain new skills and experience.
                </Paragraph>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  className="mt-4 rounded-xl font-bold h-10 bg-green-500 border-green-500 hover:bg-green-600 hover:border-green-600"
                  onClick={() => navigate('/intern/profile')}
                  block
                >
                  Update Profile
                </Button>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Mentor Feedback */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <div className="glass-card rounded-3xl p-5 h-full flex flex-col gap-3 border border-white/50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-primary">Mentor Feedback</h3>
              <CheckCircleFilled className="text-primary text-xl" />
            </div>
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <Avatar
                size={48}
                src="https://i.pravatar.cc/150?u=mentor1"
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

        {/* Skill Growth */}
        <Col xs={24} lg={8}>
          <div className="glass-card rounded-3xl p-6 h-full border border-white/50">
            <h3 className="text-lg font-bold mb-6">Skill Growth</h3>
            <div className="space-y-6">
              <SkillBar label="Visual Design" percent={85} color="#3525cd" />
              <SkillBar label="User Research" percent={60} color="#00687a" />
              <SkillBar label="Prototyping" percent={92} color="#3525cd" />
              <SkillBar label="Collaboration" percent={78} color="#41485e" />
            </div>
          </div>
        </Col>

        {/* Attendance & Daily Logs */}
        <Col xs={24} lg={8}>
          <div className="glass-card rounded-3xl p-5 h-full flex flex-col gap-3 border border-white/50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-primary">Attendance & Daily Log</h3>
              <CalendarOutlined className="text-primary text-xl" />
            </div>
            <div className="flex gap-3">
              <Button
                type="primary"
                icon={<LoginOutlined />}
                onClick={handleCheckIn}
                disabled={!!todayAttendance}
                className="flex-1 bg-green-500 border-green-500 hover:bg-green-600"
              >
                Check In
              </Button>
              <Button
                type="default"
                icon={<LogoutOutlined />}
                onClick={handleCheckOut}
                disabled={!todayAttendance?.checkInTime || !!todayAttendance.checkOutTime}
                className="flex-1"
              >
                Check Out
              </Button>
            </div>
            {todayAttendance && (
              <div className="bg-gray-50 p-3 rounded-lg text-sm">
                <p><strong>Date:</strong> {todayAttendance.attendanceDate}</p>
                <p><strong>Check In:</strong> {todayAttendance.checkInTime || '-'}</p>
                <p><strong>Check Out:</strong> {todayAttendance.checkOutTime || '-'}</p>
              </div>
            )}
            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={() => { logForm.resetFields(); setLogModal(true); }}
              block
            >
              Submit Daily Report
            </Button>
          </div>
        </Col>
      </Row>

      {/* Task Management - Updated with real data */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <div className="glass-card rounded-3xl p-6 border border-white/50 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Task Management</h3>
              <Tag color="blue">{tasks.length} tasks</Tag>
            </div>
            <Tabs
              items={[
                {
                  key: 'todo',
                  label: `To Do (${todoTasks.length})`,
                  children: (
                    <div className="space-y-3">
                      {todoTasks.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">No pending tasks</p>
                      ) : (
                        todoTasks.map(task => (
                          <TaskCard key={task.taskId} task={task} onClick={() => { setSelectedTask(task); setTaskModal(true); }} />
                        ))
                      )}
                    </div>
                  ),
                },
                {
                  key: 'active',
                  label: `In Progress (${activeTasks.length})`,
                  children: (
                    <div className="space-y-3">
                      {activeTasks.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">No active tasks</p>
                      ) : (
                        activeTasks.map(task => (
                          <TaskCard key={task.taskId} task={task} onClick={() => { setSelectedTask(task); setTaskModal(true); }} />
                        ))
                      )}
                    </div>
                  ),
                },
                {
                  key: 'completed',
                  label: `Completed (${completedTasks.length})`,
                  children: (
                    <div className="space-y-3">
                      {completedTasks.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">No completed tasks</p>
                      ) : (
                        completedTasks.map(task => (
                          <TaskCard key={task.taskId} task={task} onClick={() => { setSelectedTask(task); setTaskModal(true); }} />
                        ))
                      )}
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </Col>
      </Row>

      {/* My Interviews */}
      {interviews.length > 0 && (
        <Row gutter={[16, 16]} className="mb-4">
          <Col xs={24}>
            <div className="glass-card rounded-3xl p-6 border border-white/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <VideoCameraOutlined /> My Interviews
                </h3>
              </div>
              <Row gutter={[16, 16]}>
                {interviews.map(interview => (
                  <Col xs={24} md={12} lg={8} key={interview.interviewId}>
                    <Card
                      size="small"
                      className="rounded-xl border border-gray-100 hover:shadow-md transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <Tag color={interview.status === 'Scheduled' ? 'blue' : interview.status === 'Completed' ? 'green' : 'default'}>
                          {interview.status}
                        </Tag>
                        <Tag icon={<VideoCameraOutlined />}>{interview.interviewType}</Tag>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <CalendarOutlined className="text-gray-400" />
                          <span>{dayjs(interview.scheduledTime).format('MMM D, YYYY - HH:mm')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Duration:</span>
                          <span>{interview.durationMinutes} min</span>
                        </div>
                        {interview.meetingLink && (
                          <Button type="link" href={interview.meetingLink} target="_blank" size="small" icon={<VideoCameraOutlined />}>
                            Join Meeting
                          </Button>
                        )}
                        {interview.location && (
                          <div className="flex items-center gap-2">
                            <EnvironmentOutlined className="text-gray-400" />
                            <span>{interview.location}</span>
                          </div>
                        )}
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Col>
        </Row>
      )}

      {/* Learning Hub */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <div className="glass-card rounded-3xl p-6 h-full border border-white/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Learning Hub</h3>
              <Button type="link" className="font-bold p-0">Browse All</Button>
            </div>
            <Row gutter={[16, 16]}>
              {learningResources.map((res, index) => (
                <Col xs={24} md={12} lg={6} key={index}>
                  <div className="flex gap-4 p-4 rounded-[20px] hover:bg-gray-50 transition-colors cursor-pointer group border border-transparent hover:border-gray-100">
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
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
      </Row>

      {/* Submit Task Modal */}
      <Modal
        title={`Task: ${selectedTask?.title || ''}`}
        open={taskModal}
        onCancel={() => { setTaskModal(false); submitForm.resetFields(); }}
        footer={null}
        width={600}
      >
        {selectedTask && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">{selectedTask.description || 'No description'}</p>
              <div className="flex gap-4 text-xs">
                <Tag color={selectedTask.priority === 'High' ? 'red' : selectedTask.priority === 'Medium' ? 'orange' : 'blue'}>
                  {selectedTask.priority}
                </Tag>
                <span className="text-gray-500">Due: {selectedTask.dueDate || 'No due date'}</span>
              </div>
            </div>
            <Form form={submitForm} layout="vertical" onFinish={handleSubmitTask}>
              <Form.Item name="submissionText" label="Submission Notes">
                <TextArea rows={4} placeholder="Describe what you accomplished..." />
              </Form.Item>
              <Form.Item name="submissionUrl" label="Submission URL (optional)">
                <Input placeholder="Link to your work (GitHub, Figma, etc.)" />
              </Form.Item>
              <Form.Item name="comments" label="Comments for Mentor (optional)">
                <TextArea rows={2} placeholder="Any questions or notes..." />
              </Form.Item>
              <Button type="primary" htmlType="submit" block icon={<UploadOutlined />}>
                Submit Task
              </Button>
            </Form>
          </div>
        )}
      </Modal>

      {/* Daily Log Modal */}
      <Modal
        title="Submit Daily Report"
        open={logModal}
        onCancel={() => { setLogModal(false); logForm.resetFields(); }}
        footer={null}
      >
        <Form form={logForm} layout="vertical" onFinish={handleSubmitLog}>
          <Form.Item name="activityDescription" label="What did you work on today?" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="Describe your activities..." />
          </Form.Item>
          <Form.Item name="hoursWorked" label="Hours Worked">
            <Input type="number" min={0} max={24} placeholder="e.g., 8" />
          </Form.Item>
          <Form.Item name="challengesFaced" label="Challenges (optional)">
            <TextArea rows={2} placeholder="Any challenges you faced?" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>Submit Report</Button>
        </Form>
      </Modal>
    </div>
  );
};

function TaskCard({ task, onClick }: { task: TaskItem; onClick: () => void }) {
  const priorityColors: Record<string, string> = {
    High: 'error',
    Medium: 'warning',
    Low: 'blue',
  };

  return (
    <div
      className="bg-white p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-gray-800">{task.title}</h4>
        <Tag color={priorityColors[task.priority] || 'default'} className="rounded-full text-[10px]">
          {task.priority}
        </Tag>
      </div>
      {task.description && (
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{task.description}</p>
      )}
      <div className="flex justify-between items-center text-xs text-gray-400">
        <span>Due: {task.dueDate || 'No deadline'}</span>
        <span>Assigned by: {task.assignedByName || 'Unknown'}</span>
      </div>
    </div>
  );
}

function SkillBar({ label, percent, color }: { label: string; percent: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="font-semibold text-gray-700">{label}</span>
        <span className="font-bold" style={{ color }}>{percent}%</span>
      </div>
      <Progress percent={percent} showInfo={false} strokeColor={color} railColor="#eceef0" size={12}
        className="rounded-full [&_.ant-progress-inner]:!rounded-full" />
    </div>
  );
}

function calculateScore(profile: any): number {
  const fields = [
    !!profile.university,
    !!profile.major,
    !!profile.graduationYear,
    !!profile.educationalBackground,
    !!profile.workHistory,
    !!profile.skills,
    !!profile.cvUrl,
    !!profile.githubUrl,
    !!profile.linkedinUrl,
  ];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}

export default InternDashboard;
