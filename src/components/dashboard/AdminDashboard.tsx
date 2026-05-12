import React, { useState } from 'react';
import {
  Row, Col, Avatar, Tag, Button, Typography, Progress,
  Table, Input, Select, Form, Switch, Drawer, Timeline
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useLocation } from 'react-router-dom';
import {
  UserOutlined, SafetyCertificateOutlined,
  TeamOutlined, ArrowUpOutlined, ArrowDownOutlined,
  PlusOutlined, SearchOutlined, EditOutlined,
  LockOutlined, UnlockOutlined, KeyOutlined,
  TeamOutlined as DepartmentOutlined, TrophyOutlined,
  CheckCircleOutlined, ClockCircleOutlined, WarningOutlined, FilterOutlined,
  ReloadOutlined, EyeOutlined, MoreOutlined, UserAddOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

// Types
interface AdminDashboardProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

interface User {
  key: string;
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'locked';
  joinDate: string;
  avatar?: string;
}

interface Department {
  key: string;
  name: string;
  head: string;
  memberCount: number;
  internCount: number;
  status: 'active' | 'inactive';
}

interface AuditLog {
  key: string;
  user: string;
  action: string;
  target: string;
  time: string;
  type: 'security' | 'data' | 'system' | 'update';
  ip: string;
}

interface EvaluationCriteria {
  key: string;
  name: string;
  weight: number;
  category: string;
  status: 'active' | 'inactive';
}

// Mock Data
const mockUsers: User[] = [
  { key: '1', id: 'USR001', name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'Admin', department: 'IT', status: 'active', joinDate: '2024-01-15', avatar: 'https://i.pravatar.cc/150?u=sarah' },
  { key: '2', id: 'USR002', name: 'Michael Park', email: 'michael.p@company.com', role: 'HR Manager', department: 'HR', status: 'active', joinDate: '2024-03-20', avatar: 'https://i.pravatar.cc/150?u=michael' },
  { key: '3', id: 'USR003', name: 'Emily Wong', email: 'emily.w@company.com', role: 'Mentor', department: 'Design', status: 'active', joinDate: '2024-02-10', avatar: 'https://i.pravatar.cc/150?u=emily' },
  { key: '4', id: 'USR004', name: 'David Kim', email: 'david.k@company.com', role: 'Coordinator', department: 'Operations', status: 'inactive', joinDate: '2024-05-01', avatar: 'https://i.pravatar.cc/150?u=david' },
  { key: '5', id: 'USR005', name: 'Lisa Tran', email: 'lisa.t@company.com', role: 'Intern', department: 'Marketing', status: 'locked', joinDate: '2024-06-15', avatar: 'https://i.pravatar.cc/150?u=lisa' },
  { key: '6', id: 'USR006', name: 'James Lee', email: 'james.l@company.com', role: 'Intern', department: 'Design', status: 'active', joinDate: '2024-07-01', avatar: 'https://i.pravatar.cc/150?u=james' },
];

const mockDepartments: Department[] = [
  { key: '1', name: 'Engineering', head: 'John Smith', memberCount: 45, internCount: 12, status: 'active' },
  { key: '2', name: 'Design', head: 'Sarah Chen', memberCount: 18, internCount: 8, status: 'active' },
  { key: '3', name: 'Marketing', head: 'Mike Johnson', memberCount: 22, internCount: 6, status: 'active' },
  { key: '4', name: 'HR', head: 'Lisa Brown', memberCount: 8, internCount: 2, status: 'active' },
  { key: '5', name: 'Operations', head: 'Tom Wilson', memberCount: 15, internCount: 4, status: 'inactive' },
];

const mockAuditLogs: AuditLog[] = [
  { key: '1', user: 'Admin_Root', action: 'Modified User Role', target: 'user:david.k@company.com', time: '2 mins ago', type: 'security', ip: '192.168.1.105' },
  { key: '2', user: 'HR_Director', action: 'Bulk Uploaded Interns', target: 'batch:#2024-089', time: '15 mins ago', type: 'data', ip: '192.168.1.110' },
  { key: '3', user: 'System', action: 'Auto-backup Completed', target: 'database:prod_01', time: '1 hour ago', type: 'system', ip: 'localhost' },
  { key: '4', user: 'Mentor_02', action: 'Updated Evaluation Rubric', target: 'criteria:design_review', time: '3 hours ago', type: 'update', ip: '192.168.1.125' },
  { key: '5', user: 'Admin_Root', action: 'Locked Account', target: 'user:lisa.t@company.com', time: '5 hours ago', type: 'security', ip: '192.168.1.105' },
  { key: '6', user: 'HR_Manager', action: 'Created Department', target: 'dept:new_team', time: '1 day ago', type: 'data', ip: '192.168.1.112' },
];

const mockCriteria: EvaluationCriteria[] = [
  { key: '1', name: 'Technical Skills', weight: 25, category: 'Performance', status: 'active' },
  { key: '2', name: 'Communication', weight: 20, category: 'Soft Skills', status: 'active' },
  { key: '3', name: 'Teamwork', weight: 15, category: 'Soft Skills', status: 'active' },
  { key: '4', name: 'Problem Solving', weight: 20, category: 'Performance', status: 'active' },
  { key: '5', name: 'Punctuality', weight: 10, category: 'General', status: 'active' },
  { key: '6', name: 'Initiative', weight: 10, category: 'Performance', status: 'inactive' },
];

const roleOptions = [
  { label: 'Admin', value: 'Admin', color: '#dc2626' },
  { label: 'HR Manager', value: 'HR Manager', color: '#7c3aed' },
  { label: 'Mentor', value: 'Mentor', color: '#2563eb' },
  { label: 'Coordinator', value: 'Coordinator', color: '#0891b2' },
  { label: 'Intern', value: 'Intern', color: '#059669' },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeTab: activeTabProp }) => {
  const location = useLocation();
  const [userDrawerVisible, setUserDrawerVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userForm] = Form.useForm();

  // Determine active tab based on current path or props
  const getActiveTab = () => {
    if (activeTabProp) return activeTabProp;
    const path = location.pathname;
    if (path.includes('/users')) return 'users';
    if (path.includes('/departments')) return 'departments';
    if (path.includes('/config')) return 'config';
    if (path.includes('/logs')) return 'logs';
    return 'dashboard';
  };
  const activeTab = getActiveTab();

  // Stats
  const stats = [
    { title: 'Total Users', value: 1250, icon: <TeamOutlined />, color: '#4f46e5', trend: '+12%', isUp: true },
    { title: 'System Health', value: '98.2%', icon: <SafetyCertificateOutlined />, color: '#059669', trend: 'Stable', isUp: true },
    { title: 'Active Interns', value: 487, icon: <UserOutlined />, color: '#0891b2', trend: '+8%', isUp: true },
    { title: 'Completion Rate', value: '76%', icon: <TrophyOutlined />, color: '#d97706', trend: '+3%', isUp: true },
  ];

  const completionData = [
    { label: 'Completed', value: 76, color: '#059669' },
    { label: 'In Progress', value: 18, color: '#0891b2' },
    { label: 'Not Started', value: 6, color: '#94a3b8' },
  ];

  // User Table Columns
  const userColumns: ColumnsType<User> = [
    {
      title: 'User',
      key: 'user',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <div>
            <Text strong className="block">{record.name}</Text>
            <Text type="secondary" className="text-xs">{record.email}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <Text code className="text-xs">{text}</Text>,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const roleData = roleOptions.find(r => r.value === role);
        return <Tag color={roleData?.color} className="rounded-full font-medium">{role}</Tag>;
      },
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig: Record<string, { color: string; icon: React.ReactNode; text: string }> = {
          active: { color: 'success', icon: <CheckCircleOutlined />, text: 'Active' },
          inactive: { color: 'default', icon: <ClockCircleOutlined />, text: 'Inactive' },
          locked: { color: 'error', icon: <LockOutlined />, text: 'Locked' },
        };
        const config = statusConfig[status];
        return <Tag color={config.color} icon={config.icon} className="rounded-full">{config.text}</Tag>;
      },
    },
    {
      title: 'Join Date',
      dataIndex: 'joinDate',
      key: 'joinDate',
      render: (date) => <Text type="secondary" className="text-sm">{date}</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex gap-1">
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => {
              setSelectedUser(record);
              userForm.setFieldsValue(record);
              setUserDrawerVisible(true);
            }}
          />
          <Button type="text" icon={<EditOutlined />} size="small" />
          {record.status === 'locked' ? (
            <Button type="text" icon={<UnlockOutlined />} size="small" danger />
          ) : (
            <Button type="text" icon={<LockOutlined />} size="small" />
          )}
          <Button type="text" icon={<KeyOutlined />} size="small" />
        </div>
      ),
    },
  ];

  // Render Dashboard Tab
  const renderDashboard = () => (
    <div className="space-y-4">
      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col xs={12} lg={6} key={index}>
            <div className="glass-card p-4 rounded-2xl border border-white/50 h-full">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                  {React.cloneElement(stat.icon as React.ReactElement<{ style?: React.CSSProperties }>, { style: { fontSize: '20px' } })}
                </div>
                <Tag color={stat.isUp ? 'success' : 'error'} className="rounded-full border-none text-xs font-bold">
                  {stat.isUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {stat.trend}
                </Tag>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-0.5">{stat.title}</p>
                <h2 className="text-2xl font-bold text-gray-800">{stat.value}</h2>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <div className="glass-card p-4 rounded-2xl border border-white/50 h-full">
            <h3 className="text-base font-bold mb-4">Completion Rate</h3>
            <div className="flex items-center justify-center py-4">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                  <circle cx="80" cy="80" r="70" stroke="#059669" strokeWidth="12" fill="none"
                    strokeDasharray={`${2 * Math.PI * 70 * 0.76} ${2 * Math.PI * 70}`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-gray-800">76%</span>
                  <span className="text-xs text-gray-500">Completed</span>
                </div>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              {completionData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-gray-600">{item.label}</span>
                  </div>
                  <span className="font-bold text-sm">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Col>

        <Col xs={24} lg={8}>
          <div className="glass-card p-4 rounded-2xl border border-white/50 h-full">
            <h3 className="text-base font-bold mb-4">Intern Status</h3>
            <div className="space-y-4 py-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-700 text-sm">Active Interns</span>
                  <span className="font-bold text-primary">487</span>
                </div>
                <Progress percent={85} showInfo={false} strokeColor="#4f46e5" size="small" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-700 text-sm">On Leave</span>
                  <span className="font-bold text-amber-500">32</span>
                </div>
                <Progress percent={6} showInfo={false} strokeColor="#d97706" size="small" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-700 text-sm">Inactive</span>
                  <span className="font-bold text-gray-400">56</span>
                </div>
                <Progress percent={9} showInfo={false} strokeColor="#94a3b8" size="small" />
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 mt-4">
              <div className="flex items-center gap-2">
                <WarningOutlined className="text-blue-500" />
                <Text className="text-sm text-blue-700">15 interns need evaluation this week</Text>
              </div>
            </div>
          </div>
        </Col>

        <Col xs={24} lg={8}>
          <div className="glass-card p-4 rounded-2xl border border-white/50 h-full">
            <h3 className="text-base font-bold mb-4">Recent Audit Logs</h3>
            <div className="space-y-3 max-h-[280px] overflow-y-auto">
              {mockAuditLogs.slice(0, 5).map((log) => (
                <div key={log.key} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                  <Avatar size="small" icon={<UserOutlined />} className="bg-gray-100 text-gray-400 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm mb-0 truncate">{log.user}</p>
                    <p className="text-xs text-gray-500 truncate">{log.action}</p>
                  </div>
                  <Text type="secondary" className="text-[10px] whitespace-nowrap">{log.time}</Text>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );

  // Render User Management Tab
  const renderUserManagement = () => (
    <div className="space-y-4">
      <div className="glass-card p-4 rounded-2xl border border-white/50">
        <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Input
              placeholder="Search users..."
              prefix={<SearchOutlined className="text-gray-400" />}
              className="w-64 rounded-xl"
            />
            <Select placeholder="Filter by Role" className="w-40" allowClear>
              {roleOptions.map(role => (
                <Select.Option key={role.value} value={role.value}>{role.label}</Select.Option>
              ))}
            </Select>
            <Select placeholder="Filter by Status" className="w-36" allowClear>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
              <Select.Option value="locked">Locked</Select.Option>
            </Select>
          </div>
          <Button type="primary" icon={<UserAddOutlined />} className="primary-gradient border-none rounded-xl">
            Add User
          </Button>
        </div>

        <Table
          columns={userColumns}
          dataSource={mockUsers}
          pagination={{ pageSize: 5 }}
          className="admin-table"
        />
      </div>
    </div>
  );

  // Render Department Management Tab
  const renderDepartmentManagement = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <Title level={4} className="mb-1">Department Management</Title>
          <Text type="secondary">Manage departments and teams</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} className="primary-gradient border-none rounded-xl">
          Add Department
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {mockDepartments.map((dept) => (
          <Col xs={24} sm={12} lg={8} key={dept.key}>
            <div className="glass-card p-5 rounded-2xl border border-white/50 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <DepartmentOutlined className="text-primary text-xl" />
                  </div>
                  <div>
                    <Title level={5} className="mb-0">{dept.name}</Title>
                    <Text type="secondary" className="text-xs">Head: {dept.head}</Text>
                  </div>
                </div>
                <Tag color={dept.status === 'active' ? 'success' : 'default'} className="rounded-full">
                  {dept.status === 'active' ? 'Active' : 'Inactive'}
                </Tag>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-100">
                <div className="text-center">
                  <Text strong className="text-xl block">{dept.memberCount}</Text>
                  <Text type="secondary" className="text-xs">Members</Text>
                </div>
                <div className="text-center">
                  <Text strong className="text-xl text-primary block">{dept.internCount}</Text>
                  <Text type="secondary" className="text-xs">Interns</Text>
                </div>
                <div className="flex gap-1">
                  <Button type="text" size="small" icon={<EditOutlined />} />
                  <Button type="text" size="small" icon={<MoreOutlined />} />
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );

  // Render System Configuration Tab
  const renderSystemConfig = () => (
    <div className="space-y-4">
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <div className="glass-card p-5 rounded-2xl border border-white/50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Internship Program Configuration</h3>
              <Button type="link" icon={<EditOutlined />} className="font-bold p-0">Edit</Button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <Text className="text-gray-600">Program Duration</Text>
                <Text strong>12 Weeks</Text>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <Text className="text-gray-600">Max Interns per Batch</Text>
                <Text strong>50</Text>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <Text className="text-gray-600">Evaluation Frequency</Text>
                <Text strong>Weekly</Text>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <Text className="text-gray-600">Auto-archive after</Text>
                <Text strong>6 Months</Text>
              </div>
              <div className="flex justify-between items-center py-2">
                <Text className="text-gray-600">Require Mentor Approval</Text>
                <Switch defaultChecked disabled />
              </div>
            </div>
          </div>
        </Col>

        <Col xs={24} lg={12}>
          <div className="glass-card p-5 rounded-2xl border border-white/50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Evaluation Criteria</h3>
              <Button type="primary" size="small" icon={<PlusOutlined />} className="primary-gradient border-none rounded-lg">
                Add Criteria
              </Button>
            </div>
            <div className="space-y-3">
              {mockCriteria.map((criteria) => (
                <div key={criteria.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Tag color={criteria.status === 'active' ? 'success' : 'default'} className="rounded-full text-xs">
                      {criteria.weight}%
                    </Tag>
                    <div>
                      <Text strong className="block text-sm">{criteria.name}</Text>
                      <Text type="secondary" className="text-xs">{criteria.category}</Text>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch size="small" defaultChecked={criteria.status === 'active'} />
                    <Button type="text" size="small" icon={<EditOutlined />} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );

  // Render Audit Log Tab
  const renderAuditLog = () => (
    <div className="space-y-4">
      <div className="glass-card p-4 rounded-2xl border border-white/50">
        <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Input
              placeholder="Search logs..."
              prefix={<SearchOutlined className="text-gray-400" />}
              className="w-64 rounded-xl"
            />
            <Select placeholder="Filter by Type" className="w-36" allowClear>
              <Select.Option value="security">Security</Select.Option>
              <Select.Option value="data">Data</Select.Option>
              <Select.Option value="system">System</Select.Option>
              <Select.Option value="update">Update</Select.Option>
            </Select>
            <Select placeholder="Filter by User" className="w-40" allowClear>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="hr">HR Manager</Select.Option>
              <Select.Option value="mentor">Mentor</Select.Option>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button icon={<FilterOutlined />}>More Filters</Button>
            <Button icon={<ReloadOutlined />}>Refresh</Button>
          </div>
        </div>

        <Timeline
          items={mockAuditLogs.map((log) => ({
            color: log.type === 'security' ? 'red' : log.type === 'data' ? 'blue' : log.type === 'system' ? 'gray' : 'green',
            content: (
              <div className="flex items-start justify-between py-2 px-3 bg-gray-50 rounded-xl">
                <div className="flex items-start gap-3">
                  <Avatar size="small" icon={<UserOutlined />} className="bg-gray-200 text-gray-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm mb-0">
                      <span className="text-primary">{log.user}</span>
                      <span className="text-gray-500 font-normal"> {log.action}</span>
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-md">{log.target}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Tag color={
                    log.type === 'security' ? 'red' :
                    log.type === 'data' ? 'blue' :
                    log.type === 'system' ? 'default' : 'green'
                  } className="rounded-full text-xs mb-1">
                    {log.type.toUpperCase()}
                  </Tag>
                  <p className="text-[10px] text-gray-400">{log.time}</p>
                  <p className="text-[10px] text-gray-400">IP: {log.ip}</p>
                </div>
              </div>
            ),
          }))}
        />
      </div>
    </div>
  );

  return (
    <div className="pb-10">
      {/* Role Quick Access Bar */}
      {/* <div className="flex flex-wrap gap-2 p-3 bg-white rounded-2xl shadow-sm border border-gray-100 mb-4">
        <span className="text-sm font-semibold text-gray-500 mr-2 self-center">Quick Access:</span>
        {['Admin', 'HR Manager', 'Mentor', 'Coordinator', 'Intern'].map((role) => (
          <Button
            key={role}
            size="small"
            className="rounded-lg"
            type="default"
          >
            {role}
          </Button>
        ))}
      </div> */}

      {/* Tabs - Now rendered in Header */}
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'users' && renderUserManagement()}
      {activeTab === 'departments' && renderDepartmentManagement()}
      {activeTab === 'config' && renderSystemConfig()}
      {activeTab === 'logs' && renderAuditLog()}

      {/* User Detail Drawer */}
      <Drawer
        title="User Details"
        placement="right"
        size="default"
        onClose={() => setUserDrawerVisible(false)}
        open={userDrawerVisible}
      >
        {selectedUser && (
          <Form form={userForm} layout="vertical">
            <div className="flex justify-center mb-6">
              <Avatar size={80} src={selectedUser.avatar} icon={<UserOutlined />} />
            </div>
            <Form.Item label="Full Name" name="name">
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input />
            </Form.Item>
            <Form.Item label="Role" name="role">
              <Select options={roleOptions} />
            </Form.Item>
            <Form.Item label="Department" name="department">
              <Select options={mockDepartments.map(d => ({ label: d.name, value: d.name }))} />
            </Form.Item>
            <Form.Item label="Status" name="status">
              <Select>
                <Select.Option value="active">Active</Select.Option>
                <Select.Option value="inactive">Inactive</Select.Option>
                <Select.Option value="locked">Locked</Select.Option>
              </Select>
            </Form.Item>
            <div className="flex gap-2 mt-6">
              <Button icon={<KeyOutlined />} block>Reset Password</Button>
              <Button type="primary" icon={<EditOutlined />} block>Update</Button>
            </div>
          </Form>
        )}
      </Drawer>
    </div>
  );
};

export default AdminDashboard;
