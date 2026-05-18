import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Tag, Button, Table, Modal, Form, Input, Select, DatePicker, Space, Avatar, Badge, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, UserOutlined, StarOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { taskService, TaskItem, TaskSubmission } from '../../services/taskService';
import { dailyLogService, DailyLog } from '../../services/dailyLogService';
import { assessmentService, Assessment } from '../../services/assessmentService';
import { userService } from '../../services/userService';
import { interviewService, InterviewDto } from '../../services/interviewService';
import { App } from 'antd';
import dayjs from 'dayjs';

const { TextArea } = Input;

const MentorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { message: messageApi } = App.useApp();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [submissions, setSubmissions] = useState<{ taskId: number; items: TaskSubmission[] }[]>([]);
  const [interns, setInterns] = useState<{ userId: number; fullName: string }[]>([]);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [interviews, setInterviews] = useState<InterviewDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [taskModal, setTaskModal] = useState(false);
  const [gradeModal, setGradeModal] = useState(false);
  const [assessmentModal, setAssessmentModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<TaskSubmission | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [selectedIntern, setSelectedIntern] = useState<{ userId: number; fullName: string } | null>(null);

  const [form] = Form.useForm();
  const [gradeForm] = Form.useForm();
  const [assessmentForm] = Form.useForm();

  useEffect(() => {
    if (user) {
      fetchTasks();
      fetchInterns();
      fetchDailyLogs();
      fetchAssessments();
      fetchInterviews();
    }
  }, [user]);

  const fetchInterviews = async () => {
    if (!user) return;
    try {
      const { data } = await interviewService.getAll({ page: 1, pageSize: 50, interviewerId: user.userId });
      setInterviews(data.items);
    } catch { console.error('Failed to fetch interviews'); }
  };

  const fetchTasks = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await taskService.getTasksByMentor(user.userId);
      setTasks(data.items);
      // Fetch submissions for each task
      for (const task of data.items) {
        fetchSubmissions(task.taskId);
      }
    } catch {
      messageApi.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async (taskId: number) => {
    try {
      const data = await taskService.getSubmissions(taskId);
      setSubmissions(prev => [...prev.filter(s => s.taskId !== taskId), { taskId, items: data }]);
    } catch {
      // ignore
    }
  };

  const fetchInterns = async () => {
    try {
      const { data } = await userService.getUsers({ page: 1, pageSize: 100, roleId: 3 });
      setInterns(data.items.map(u => ({ userId: u.userId, fullName: u.fullName })));
    } catch {
      messageApi.error('Failed to load interns');
    }
  };

  const fetchDailyLogs = async () => {
    if (!user) return;
    try {
      const data = await dailyLogService.getLogs({ page: 1, pageSize: 50, mentorId: user.userId });
      setDailyLogs(data.items);
    } catch {
      messageApi.error('Failed to load daily logs');
    }
  };

  const fetchAssessments = async () => {
    if (!user) return;
    try {
      const data = await assessmentService.getAssessmentsByMentor(user.userId);
      setAssessments(data.items);
    } catch {
      messageApi.error('Failed to load assessments');
    }
  };

  const handleGiveFeedback = async (logId: number, feedback: string, kpiScore?: number) => {
    try {
      await dailyLogService.updateLog(logId, { mentorFeedback: feedback, kpiScore });
      messageApi.success('Feedback submitted');
      fetchDailyLogs();
    } catch {
      messageApi.error('Failed to submit feedback');
    }
  };

  const handleCreateAssessment = async (values: any) => {
    if (!user) return;
    try {
      await assessmentService.createAssessment({
        internId: values.internId,
        mentorId: user.userId,
        assessmentDate: values.assessmentDate?.format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD'),
        assessmentType: values.assessmentType,
        technicalSkillsScore: values.technicalSkillsScore,
        softSkillsScore: values.softSkillsScore,
        communicationScore: values.communicationScore,
        teamworkScore: values.teamworkScore,
        overallRating: values.overallRating,
        strengths: values.strengths,
        areasForImprovement: values.areasForImprovement,
        comments: values.comments,
      });
      messageApi.success('Assessment created');
      setAssessmentModal(false);
      assessmentForm.resetFields();
      fetchAssessments();
    } catch {
      messageApi.error('Failed to create assessment');
    }
  };

  const handleCreateTask = async (values: any) => {
    try {
      await taskService.createTask({
        internId: values.internId,
        assignedBy: user!.userId,
        title: values.title,
        description: values.description,
        priority: values.priority,
        dueDate: values.dueDate?.format('YYYY-MM-DD'),
      });
      messageApi.success('Task created successfully');
      setTaskModal(false);
      form.resetFields();
      fetchTasks();
    } catch {
      messageApi.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (id: number, values: any) => {
    try {
      await taskService.updateTask(id, values);
      messageApi.success('Task updated successfully');
      setTaskModal(false);
      form.resetFields();
      fetchTasks();
    } catch {
      messageApi.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await taskService.deleteTask(id);
      messageApi.success('Task deleted successfully');
      fetchTasks();
    } catch {
      messageApi.error('Failed to delete task');
    }
  };

  const handleGradeSubmission = async (values: { score: number; feedback?: string }) => {
    if (!selectedSubmission) return;
    try {
      await taskService.gradeSubmission(selectedSubmission.submissionId, values);
      messageApi.success('Submission graded successfully');
      setGradeModal(false);
      gradeForm.resetFields();
      fetchTasks();
    } catch {
      messageApi.error('Failed to grade submission');
    }
  };

  const taskColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: TaskItem) => (
        <div>
          <p className="font-semibold">{text}</p>
          <p className="text-xs text-gray-400">Intern: {record.internName || 'Unknown'}</p>
        </div>
      ),
    },
    { title: 'Priority', dataIndex: 'priority', key: 'priority', render: (p: string) => (
      <Tag color={p === 'High' ? 'red' : p === 'Medium' ? 'orange' : 'blue'}>{p}</Tag>
    )},
    { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate', render: (d: string) => d || '-' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => (
      <Tag color={s === 'Completed' ? 'green' : s === 'InProgress' ? 'processing' : 'default'}>{s}</Tag>
    )},
    {
      title: 'Submissions',
      key: 'submissions',
      render: (_: any, record: TaskItem) => {
        const taskSubmissions = submissions.find(s => s.taskId === record.taskId)?.items || [];
        const pending = taskSubmissions.filter(sub => sub.status === 'Submitted').length;
        return pending > 0 ? (
          <Badge count={pending}><Button size="small">Review</Button></Badge>
        ) : <span className="text-gray-400 text-sm">-</span>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: TaskItem) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => { form.setFieldsValue(record); setSelectedTask(record); setTaskModal(true); }} />
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDeleteTask(record.taskId)} />
        </Space>
      ),
    },
  ];

  // Flatten all pending submissions for review
  const pendingSubmissions = submissions.flatMap(s => s.items.filter(item => item.status === 'Submitted'));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Mentor Dashboard</h1>
          <p className="text-gray-500 text-sm">Manage tasks and review intern submissions</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setSelectedTask(null); setTaskModal(true); }}>
          Create Task
        </Button>
      </div>

      <Card>
        <Tabs
          items={[
            {
              key: 'tasks',
              label: `Tasks (${tasks.length})`,
              children: (
                <Table columns={taskColumns} dataSource={tasks} rowKey="taskId" loading={loading} pagination={{ pageSize: 10 }} />
              ),
            },
            {
              key: 'submissions',
              label: `Reviews (${pendingSubmissions.length})`,
              children: (
                <Table
                  columns={[
                    { title: 'Task', dataIndex: ['taskId'], key: 'task', render: (id: number) => tasks.find(t => t.taskId === id)?.title || '-' },
                    { title: 'Intern', dataIndex: 'internName', key: 'internName' },
                    { title: 'Submitted', dataIndex: 'submittedAt', key: 'submittedAt', render: (d: string) => dayjs(d).format('YYYY-MM-DD HH:mm') },
                    {
                      title: 'Actions',
                      key: 'actions',
                      render: (_: any, record: TaskSubmission) => (
                        <Button type="primary" size="small" onClick={() => { setSelectedSubmission(record); setGradeModal(true); }}>
                          Grade
                        </Button>
                      ),
                    },
                  ]}
                  dataSource={pendingSubmissions}
                  rowKey="submissionId"
                  pagination={{ pageSize: 10 }}
                />
              ),
            },
            {
              key: 'logs',
              label: `Daily Logs (${dailyLogs.length})`,
              children: (
                <Table
                  columns={[
                    { title: 'Date', dataIndex: 'logDate', key: 'logDate' },
                    { title: 'Intern', dataIndex: 'internName', key: 'internName' },
                    { title: 'Activity', dataIndex: 'activityDescription', key: 'activityDescription', ellipsis: true },
                    { title: 'Hours', dataIndex: 'hoursWorked', key: 'hoursWorked' },
                    { title: 'KPI', dataIndex: 'kpiScore', key: 'kpiScore', render: (s: number) => s ? `${s}/10` : '-' },
                    {
                      title: 'Actions',
                      key: 'actions',
                      render: (_: any, record: DailyLog) => (
                        <Button size="small" onClick={() => {
                          Modal.confirm({
                            title: 'Give Feedback',
                            content: <TextArea rows={3} id={`feedback-${record.logId}`} placeholder="Enter feedback..." />,
                            onOk: () => {
                              const feedback = (document.getElementById(`feedback-${record.logId}`) as HTMLTextAreaElement)?.value;
                              if (feedback) handleGiveFeedback(record.logId, feedback);
                            },
                          });
                        }}>
                          Feedback
                        </Button>
                      ),
                    },
                  ]}
                  dataSource={dailyLogs}
                  rowKey="logId"
                  pagination={{ pageSize: 10 }}
                />
              ),
            },
            {
              key: 'assessments',
              label: `Assessments (${assessments.length})`,
              children: (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button type="primary" icon={<StarOutlined />} onClick={() => { assessmentForm.resetFields(); setAssessmentModal(true); }}>
                      New Assessment
                    </Button>
                  </div>
                  <Table
                    columns={[
                      { title: 'Date', dataIndex: 'assessmentDate', key: 'assessmentDate' },
                      { title: 'Intern', dataIndex: 'internName', key: 'internName' },
                      { title: 'Type', dataIndex: 'assessmentType', key: 'assessmentType', render: (t: string) => <Tag>{t}</Tag> },
                      { title: 'Overall', dataIndex: 'overallRating', key: 'overallRating', render: (r: number) => r ? <Tag color="blue">{r}/10</Tag> : '-' },
                      { title: 'Technical', dataIndex: 'technicalSkillsScore', key: 'technicalSkillsScore', render: (s: number) => s || '-' },
                      { title: 'Comments', dataIndex: 'comments', key: 'comments', ellipsis: true },
                    ]}
                    dataSource={assessments}
                    rowKey="assessmentId"
                    pagination={{ pageSize: 10 }}
                  />
                </div>
              ),
            },
            {
              key: 'interviews',
              label: `Interviews (${interviews.length})`,
              children: (
                <Table
                  columns={[
                    { title: 'Date & Time', dataIndex: 'scheduledTime', key: 'scheduledTime', render: (d: string) => dayjs(d).format('MMM D, YYYY - HH:mm') },
                    { title: 'Type', dataIndex: 'interviewType', key: 'interviewType', render: (t: string) => <Tag>{t}</Tag> },
                    { title: 'Duration', dataIndex: 'durationMinutes', key: 'durationMinutes', render: (d: number) => `${d} min` },
                    { title: 'Location', dataIndex: 'location', key: 'location', ellipsis: true },
                    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => (
                      <Tag color={s === 'Scheduled' ? 'blue' : s === 'Completed' ? 'green' : 'default'}>{s}</Tag>
                    )},
                    {
                      title: 'Action',
                      key: 'action',
                      render: (_: any, record: InterviewDto) => (
                        record.meetingLink ? (
                          <Button type="link" href={record.meetingLink} target="_blank">Join</Button>
                        ) : '-'
                      ),
                    },
                  ]}
                  dataSource={interviews}
                  rowKey="interviewId"
                  pagination={{ pageSize: 10 }}
                />
              ),
            },
          ]}
        />
      </Card>

      {/* Create/Edit Task Modal */}
      <Modal
        title={selectedTask ? 'Edit Task' : 'Create Task'}
        open={taskModal}
        onCancel={() => { setTaskModal(false); form.resetFields(); }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={(values) => {
          if (selectedTask) {
            handleUpdateTask(selectedTask.taskId, values);
          } else {
            handleCreateTask(values);
          }
        }}>
          {!selectedTask && (
            <Form.Item name="internId" label="Assign to Intern" rules={[{ required: true }]}>
              <Select placeholder="Select intern" showSearch optionFilterProp="children">
                {interns.map(i => <Select.Option key={i.userId} value={i.userId}>{i.fullName}</Select.Option>)}
              </Select>
            </Form.Item>
          )}
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item name="priority" label="Priority" initialValue="Medium">
            <Select>
              <Select.Option value="High">High</Select.Option>
              <Select.Option value="Medium">Medium</Select.Option>
              <Select.Option value="Low">Low</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="dueDate" label="Due Date">
            <DatePicker className="w-full" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>{selectedTask ? 'Update' : 'Create'}</Button>
        </Form>
      </Modal>

      {/* Grade Submission Modal */}
      <Modal
        title="Grade Submission"
        open={gradeModal}
        onCancel={() => { setGradeModal(false); gradeForm.resetFields(); }}
        footer={null}
      >
        {selectedSubmission && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-semibold mb-2">Intern: {selectedSubmission.internName}</p>
              {selectedSubmission.submissionText && <p className="text-sm text-gray-600">{selectedSubmission.submissionText}</p>}
              {selectedSubmission.submissionUrl && <a href={selectedSubmission.submissionUrl} target="_blank" rel="noopener" className="text-blue-500 text-sm">View Submission</a>}
            </div>
            <Form form={gradeForm} layout="vertical" onFinish={handleGradeSubmission}>
              <Form.Item name="score" label="Score (0-100)" rules={[{ required: true, type: 'number', min: 0, max: 100 }]}>
                <Input type="number" min={0} max={100} />
              </Form.Item>
              <Form.Item name="feedback" label="Feedback">
                <TextArea rows={3} />
              </Form.Item>
              <Button type="primary" htmlType="submit" block>Submit Grade</Button>
            </Form>
          </div>
        )}
      </Modal>

      {/* Create Assessment Modal */}
      <Modal
        title="Create Assessment"
        open={assessmentModal}
        onCancel={() => { setAssessmentModal(false); assessmentForm.resetFields(); }}
        footer={null}
        width={600}
      >
        <Form form={assessmentForm} layout="vertical" onFinish={handleCreateAssessment}>
          <Form.Item name="internId" label="Select Intern" rules={[{ required: true }]}>
            <Select placeholder="Select intern" showSearch optionFilterProp="children">
              {interns.map(i => <Select.Option key={i.userId} value={i.userId}>{i.fullName}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="assessmentType" label="Assessment Type" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Weekly">Weekly</Select.Option>
              <Select.Option value="Monthly">Monthly</Select.Option>
              <Select.Option value="Mid-term">Mid-term</Select.Option>
              <Select.Option value="Final">Final</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="assessmentDate" label="Date">
            <DatePicker className="w-full" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="technicalSkillsScore" label="Technical Skills (0-10)">
                <Input type="number" min={0} max={10} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="softSkillsScore" label="Soft Skills (0-10)">
                <Input type="number" min={0} max={10} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="communicationScore" label="Communication (0-10)">
                <Input type="number" min={0} max={10} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="teamworkScore" label="Teamwork (0-10)">
                <Input type="number" min={0} max={10} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="overallRating" label="Overall Rating (0-10)">
            <Input type="number" min={0} max={10} />
          </Form.Item>
          <Form.Item name="strengths" label="Strengths">
            <TextArea rows={2} placeholder="What did the intern do well?" />
          </Form.Item>
          <Form.Item name="areasForImprovement" label="Areas for Improvement">
            <TextArea rows={2} placeholder="What can be improved?" />
          </Form.Item>
          <Form.Item name="comments" label="Comments">
            <TextArea rows={3} placeholder="Additional comments..." />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>Create Assessment</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default MentorDashboard;
