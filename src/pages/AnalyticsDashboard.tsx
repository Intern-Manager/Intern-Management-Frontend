import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Button, Space, message } from 'antd';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { UserOutlined, FileTextOutlined, CheckCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import { reportService } from '../services/reportService';
import { assessmentService } from '../services/assessmentService';

const COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1'];

const AnalyticsDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [internStats, setInternStats] = useState<any>(null);
  const [applicationStats, setApplicationStats] = useState<any>(null);
  const [attendanceStats, setAttendanceStats] = useState<any>(null);
  const [taskStats, setTaskStats] = useState<any>(null);
  const [performanceStats, setPerformanceStats] = useState<any>(null);
  const [recentAssessments, setRecentAssessments] = useState<any[]>([]);

  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async () => {
    setLoading(true);
    try {
      const [intern, app, attendance, task, performance] = await Promise.all([
        reportService.getInternStats().catch(() => null),
        reportService.getApplicationStats().catch(() => null),
        reportService.getAttendanceStats().catch(() => null),
        reportService.getTaskCompletionStats().catch(() => null),
        reportService.getPerformanceStats().catch(() => null),
      ]);

      setInternStats(intern);
      setApplicationStats(app);
      setAttendanceStats(attendance);
      setTaskStats(task);
      setPerformanceStats(performance);

      // Fetch recent assessments
      const assessments = await assessmentService.getAssessments({ page: 1, pageSize: 10 });
      setRecentAssessments(assessments.items);
    } catch (error) {
      message.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const applicationChartData = applicationStats ? [
    { name: 'Pending', value: applicationStats.byStatus?.pending || 0 },
    { name: 'Reviewing', value: applicationStats.byStatus?.reviewing || 0 },
    { name: 'Approved', value: applicationStats.byStatus?.approved || 0 },
    { name: 'Rejected', value: applicationStats.byStatus?.rejected || 0 },
  ] : [];

  const taskChartData = taskStats ? [
    { name: 'Pending', value: taskStats.pending || 0 },
    { name: 'In Progress', value: taskStats.inProgress || 0 },
    { name: 'Completed', value: taskStats.completed || 0 },
  ] : [];

  const performanceChartData = performanceStats ? [
    { name: 'Excellent (9-10)', value: performanceStats.byRating?.excellent || 0, fill: '#52c41a' },
    { name: 'Good (7-8)', value: performanceStats.byRating?.good || 0, fill: '#1890ff' },
    { name: 'Average (5-6)', value: performanceStats.byRating?.average || 0, fill: '#faad14' },
    { name: 'Below (0-4)', value: performanceStats.byRating?.belowAverage || 0, fill: '#f5222d' },
  ] : [];

  const assessmentColumns = [
    { title: 'Intern', dataIndex: 'internName', key: 'internName' },
    { title: 'Type', dataIndex: 'assessmentType', key: 'assessmentType', render: (t: string) => <Tag>{t}</Tag> },
    { title: 'Date', dataIndex: 'assessmentDate', key: 'assessmentDate' },
    { title: 'Overall', dataIndex: 'overallRating', key: 'overallRating', render: (r: number) => r ? <Tag color={r >= 8 ? 'green' : r >= 5 ? 'orange' : 'red'}>{r}/10</Tag> : '-' },
    { title: 'Technical', dataIndex: 'technicalSkillsScore', key: 'technicalSkillsScore', render: (s: number) => s || '-' },
    { title: 'Soft Skills', dataIndex: 'softSkillsScore', key: 'softSkillsScore', render: (s: number) => s || '-' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Analytics Dashboard</h1>
          <p className="text-gray-500 text-sm">Overview of intern management statistics</p>
        </div>
        <Space>
          <Button onClick={fetchAllStats} loading={loading}>Refresh</Button>
        </Space>
      </div>

      {/* Summary Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Total Interns"
              value={internStats?.totalInterns || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Applications"
              value={applicationStats?.total || 0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Attendance Rate"
              value={attendanceStats?.attendanceRate || 0}
              suffix="%"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Task Completion"
              value={taskStats?.completionRate || 0}
              suffix="%"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row 1 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Applications by Status" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={applicationChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {applicationChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Task Progress" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taskChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#1890ff" name="Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Charts Row 2 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Performance Distribution" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Count" fill="#722ed1" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Average Scores" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: 'Overall', score: performanceStats?.averageOverall || 0 },
                { name: 'Technical', score: performanceStats?.averageTechnical || 0 },
                { name: 'Soft Skills', score: performanceStats?.averageSoftSkills || 0 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#52c41a" name="Score (0-10)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Recent Assessments Table */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Recent Assessments" loading={loading}>
            <Table
              columns={assessmentColumns}
              dataSource={recentAssessments}
              rowKey="assessmentId"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AnalyticsDashboard;
