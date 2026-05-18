import React, { useState, useEffect } from 'react';
import {
  Row, Col, Avatar, Tag, Button, Typography, Progress,
  Table, Input, Select, Form, Switch, Drawer, Timeline,
  Modal, message, Popconfirm, Pagination
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useLocation } from 'react-router-dom';
import {
  UserOutlined, SafetyCertificateOutlined,
  TeamOutlined, ArrowUpOutlined, ArrowDownOutlined,
  PlusOutlined, SearchOutlined, EditOutlined,
  LockOutlined, KeyOutlined,
  TeamOutlined as DepartmentOutlined, TrophyOutlined,
  CheckCircleOutlined, ClockCircleOutlined, WarningOutlined, FilterOutlined,
  ReloadOutlined, EyeOutlined, UserAddOutlined, DeleteOutlined
} from '@ant-design/icons';
import { userService, UserListItem } from '../../services/userService';
import { roleService, Role } from '../../services/roleService';
import { departmentService, Department, CreateDepartmentData, UpdateDepartmentData } from '../../services/departmentService';

const { Title, Text } = Typography;

// Types
interface AdminDashboardProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
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

const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeTab: activeTabProp }) => {
  const location = useLocation();
  const [userDrawerVisible, setUserDrawerVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const [userForm] = Form.useForm();
  const [createForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  // User Management State
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>();
  const [filterRoleId, setFilterRoleId] = useState<number>();
  const [loading, setLoading] = useState(false);

  // Department Management State
  const [departments, setDepartments] = useState<Department[]>([]);
  const [deptSearchText, setDeptSearchText] = useState('');
  const [deptFilterStatus, setDeptFilterStatus] = useState<string>();
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [deptDrawerVisible, setDeptDrawerVisible] = useState(false);
  const [deptModalVisible, setDeptModalVisible] = useState(false);
  const [deptForm] = Form.useForm();

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await userService.getUsers({
        page: currentPage,
        pageSize,
        search: searchText || undefined,
        status: filterStatus,
        roleId: filterRoleId,
      });
      setUsers(data.items);
      setTotalUsers(data.totalCount);
    } catch {
      messageApi.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Fetch departments from API
  const fetchDepartments = async () => {
    try {
      const { data } = await departmentService.getDepartments({
        page: 1,
        pageSize: 100,
        search: deptSearchText || undefined,
        status: deptFilterStatus,
      });
      setDepartments(data.items);
    } catch {
      messageApi.error('Failed to load departments');
    }
  };

  // Fetch roles for dropdown
  const fetchRoles = async () => {
    try {
      const { data } = await roleService.getRoles();
      setRoles(data);
    } catch {
      messageApi.error('Failed to load roles');
    }
  };

  // Department CRUD handlers
  const handleCreateDepartment = async (values: CreateDepartmentData) => {
    try {
      await departmentService.createDepartment(values);
      messageApi.success('Department created successfully');
      setDeptModalVisible(false);
      deptForm.resetFields();
      fetchDepartments();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      messageApi.error(error.response?.data?.message || 'Failed to create department');
    }
  };

  const handleUpdateDepartment = async (values: UpdateDepartmentData) => {
    if (!selectedDepartment) return;
    
    // Pre-check: verify department still exists before update
    try {
      await departmentService.getDepartment(selectedDepartment.departmentId);
    } catch {
      messageApi.error('Department no longer exists. Refreshing list...');
      fetchDepartments();
      setDeptDrawerVisible(false);
      return;
    }
    
    try {
      const response = await departmentService.updateDepartment(selectedDepartment.departmentId, values);
      if (response.status === 200 || response.status === 204) {
        messageApi.success('Department updated successfully');
        setDeptDrawerVisible(false);
        fetchDepartments();
      }
    } catch (err: unknown) {
      const error = err as { response?: { status?: number; data?: { message?: string } } };
      if (error.response?.status === 404) {
        messageApi.error('Department not found. Refreshing list...');
        fetchDepartments();
        setDeptDrawerVisible(false);
      } else {
        messageApi.error(error.response?.data?.message || 'Failed to update department');
      }
    }
  };

  const handleDeleteDepartment = async (id: number) => {
    try {
      await departmentService.deleteDepartment(id);
      messageApi.success('Department deleted successfully');
      fetchDepartments();
    } catch {
      messageApi.error('Failed to delete department');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize, searchText, filterStatus, filterRoleId]);

  useEffect(() => {
    fetchDepartments();
  }, [deptSearchText, deptFilterStatus]);

  useEffect(() => {
    fetchRoles();
  }, []);

  // CRUD Handlers
  const handleCreateUser = async (values: { fullName: string; email: string; password: string; roleId: number; phone?: string }) => {
    try {
      await userService.createUser(values);
      messageApi.success('User created successfully');
      setCreateModalVisible(false);
      createForm.resetFields();
      fetchUsers();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      messageApi.error(error.response?.data?.message || 'Failed to create user');
    }
  };

  const handleUpdateUser = async (values: { fullName?: string; phone?: string; roleId?: number; status?: string }) => {
    if (!selectedUser) return;
    try {
      await userService.updateProfile(selectedUser.userId, values);
      messageApi.success('User updated successfully');
      setUserDrawerVisible(false);
      fetchUsers();
    } catch {
      messageApi.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await userService.deleteUser(userId);
      messageApi.success('User deleted successfully');
      fetchUsers();
    } catch {
      messageApi.error('Failed to delete user');
    }
  };

  // Convert roleId to roleName for display
  const getRoleName = (roleId: number) => {
    const role = roles.find(r => r.roleId === roleId);
    return role?.roleName || `Role ${roleId}`;
  };

  // Table columns for real API data
  const userColumns: ColumnsType<UserListItem> = [
    {
      title: 'User',
      key: 'user',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.avatarUrl} icon={<UserOutlined />} />
          <div>
            <Text strong className="block">{record.fullName}</Text>
            <Text type="secondary" className="text-xs">{record.email}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      key: 'role',
      render: (_, record) => {
        const roleName = getRoleName(record.roleId);
        const roleColors: Record<string, string> = {
          'Admin': '#dc2626', 'HR Manager': '#7c3aed', 'Mentor': '#2563eb',
          'Coordinator': '#0891b2', 'Intern': '#059669',
        };
        return <Tag color={roleColors[roleName]} className="rounded-full font-medium">{roleName}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig: Record<string, { color: string; icon: React.ReactNode; text: string }> = {
          Active: { color: 'success', icon: <CheckCircleOutlined />, text: 'Active' },
          Inactive: { color: 'default', icon: <ClockCircleOutlined />, text: 'Inactive' },
          Locked: { color: 'error', icon: <LockOutlined />, text: 'Locked' },
        };
        const config = statusConfig[status] || statusConfig.Inactive;
        return <Tag color={config.color} icon={config.icon} className="rounded-full">{config.text}</Tag>;
      },
    },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => <Text type="secondary" className="text-sm">{new Date(date).toLocaleDateString()}</Text>,
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
              userForm.setFieldsValue({
                fullName: record.fullName,
                email: record.email,
                phone: record.phone,
                roleId: record.roleId,
                status: record.status,
              });
              setUserDrawerVisible(true);
            }}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setSelectedUser(record);
              userForm.setFieldsValue({
                fullName: record.fullName,
                email: record.email,
                phone: record.phone,
                roleId: record.roleId,
                status: record.status,
              });
              setUserDrawerVisible(true);
            }}
          />
          <Popconfirm
            title="Delete this user?"
            description="This action cannot be undone."
            onConfirm={() => handleDeleteUser(record.userId)}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

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
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              placeholder="Filter by Role"
              className="w-40"
              allowClear
              onChange={(value) => setFilterRoleId(value as number | undefined)}
              value={filterRoleId}
            >
              {roles.map(role => (
                <Select.Option key={role.roleId} value={role.roleId}>{role.roleName}</Select.Option>
              ))}
            </Select>
            <Select
              placeholder="Filter by Status"
              className="w-36"
              allowClear
              onChange={(value) => setFilterStatus(value as string | undefined)}
              value={filterStatus}
            >
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="Inactive">Inactive</Select.Option>
            </Select>
          </div>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            className="primary-gradient border-none rounded-xl"
            onClick={() => setCreateModalVisible(true)}
          >
            Add User
          </Button>
        </div>

        <Table
          columns={userColumns}
          dataSource={users}
          loading={loading}
          pagination={false}
          rowKey="userId"
          className="admin-table"
        />

        {totalUsers > pageSize && (
          <div className="flex justify-center mt-4">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalUsers}
              onChange={(page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              }}
              showSizeChanger
              showTotal={(total) => `Total ${total} users`}
            />
          </div>
        )}
      </div>

      {/* Create User Modal */}
      <Modal
        title="Create New User"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          createForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreateUser}
        >
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter full name' }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please enter password' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
          <Form.Item
            name="roleId"
            label="Role"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select placeholder="Select role">
              {roles.map(role => (
                <Select.Option key={role.roleId} value={role.roleId}>{role.roleName}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input placeholder="Enter phone number (optional)" />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setCreateModalVisible(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" className="primary-gradient border-none">
              Create User
            </Button>
          </div>
        </Form>
      </Modal>

      {/* User Detail Drawer */}
      <Drawer
        title="User Details"
        placement="right"
        size="default"
        onClose={() => setUserDrawerVisible(false)}
        open={userDrawerVisible}
      >
        {selectedUser && (
          <Form
            form={userForm}
            layout="vertical"
            onFinish={handleUpdateUser}
          >
            <div className="flex justify-center mb-6">
              <Avatar size={80} src={selectedUser.avatarUrl} icon={<UserOutlined />} />
            </div>
            <Form.Item label="Full Name" name="fullName">
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Phone" name="phone">
              <Input />
            </Form.Item>
            <Form.Item label="Role" name="roleId">
              <Select>
                {roles.map(role => (
                  <Select.Option key={role.roleId} value={role.roleId}>{role.roleName}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Status" name="status">
              <Select>
                <Select.Option value="Active">Active</Select.Option>
                <Select.Option value="Inactive">Inactive</Select.Option>
              </Select>
            </Form.Item>
            <div className="flex gap-2 mt-6">
              <Button
                icon={<KeyOutlined />}
                block
                onClick={() => messageApi.info('Password reset feature coming soon')}
              >
                Reset Password
              </Button>
              <Button type="primary" htmlType="submit" icon={<EditOutlined />} block className="primary-gradient border-none">
                Update
              </Button>
            </div>
          </Form>
        )}
      </Drawer>
    </div>
  );
  const renderDepartmentManagement = () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div>
          <Title level={4} className="mb-1">Department Management</Title>
          <Text type="secondary">Manage departments and teams</Text>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Input
            placeholder="Search departments..."
            prefix={<SearchOutlined className="text-gray-400" />}
            className="w-56 rounded-xl"
            value={deptSearchText}
            onChange={(e) => setDeptSearchText(e.target.value)}
            allowClear
          />
          <Select
            placeholder="Filter by Status"
            className="w-36"
            allowClear
            value={deptFilterStatus}
            onChange={setDeptFilterStatus}
          >
            <Select.Option value="Active">Active</Select.Option>
            <Select.Option value="Inactive">Inactive</Select.Option>
          </Select>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="primary-gradient border-none rounded-xl"
            onClick={() => {
              deptForm.resetFields();
              setSelectedDepartment(null);
              setDeptModalVisible(true);
            }}
          >
            Add Department
          </Button>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        {departments.map((dept) => (
          <Col xs={24} sm={12} lg={8} key={dept.departmentId}>
            <div className="glass-card p-5 rounded-2xl border border-white/50 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <DepartmentOutlined className="text-primary text-xl" />
                  </div>
                  <div>
                    <Title level={5} className="mb-0">{dept.departmentName}</Title>
                    <Text type="secondary" className="text-xs">Head: {dept.headUserName || 'N/A'}</Text>
                  </div>
                </div>
                <Tag color={dept.status === 'Active' ? 'success' : 'default'} className="rounded-full">
                  {dept.status}
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
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setSelectedDepartment(dept);
                      deptForm.setFieldsValue({
                        departmentName: dept.departmentName,
                        description: dept.description,
                        headUserId: dept.headUserId,
                        status: dept.status,
                      });
                      setDeptDrawerVisible(true);
                    }}
                  />
                  <Popconfirm
                    title="Delete this department?"
                    description="This action cannot be undone."
                    onConfirm={() => handleDeleteDepartment(dept.departmentId)}
                    okText="Delete"
                    okButtonProps={{ danger: true }}
                  >
                    <Button type="text" size="small" icon={<DeleteOutlined />} danger />
                  </Popconfirm>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Create Department Modal */}
      <Modal
        title="Add New Department"
        open={deptModalVisible}
        onCancel={() => setDeptModalVisible(false)}
        footer={null}
        className="rounded-2xl"
      >
        <Form
          form={deptForm}
          layout="vertical"
          onFinish={handleCreateDepartment}
          className="mt-4"
        >
          <Form.Item
            label="Department Name"
            name="departmentName"
            rules={[{ required: true, message: 'Please enter department name' }]}
          >
            <Input placeholder="e.g., Engineering" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} placeholder="Department description..." />
          </Form.Item>
          <Form.Item label="Status" name="status" initialValue="Active">
            <Select>
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="Inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>
          <div className="flex gap-2 mt-6">
            <Button block onClick={() => setDeptModalVisible(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" className="primary-gradient border-none" block>
              Create
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Edit Department Drawer */}
      <Drawer
        title="Edit Department"
        open={deptDrawerVisible}
        onClose={() => setDeptDrawerVisible(false)}
        size="default"
      >
        {selectedDepartment && (
          <Form
            form={deptForm}
            layout="vertical"
            onFinish={handleUpdateDepartment}
            className="mt-4"
          >
            <Form.Item
              label="Department Name"
              name="departmentName"
              rules={[{ required: true, message: 'Please enter department name' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item label="Status" name="status">
              <Select>
                <Select.Option value="Active">Active</Select.Option>
                <Select.Option value="Inactive">Inactive</Select.Option>
              </Select>
            </Form.Item>
            <Button type="primary" htmlType="submit" className="primary-gradient border-none mt-4" block>
              Update
            </Button>
          </Form>
        )}
      </Drawer>
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
      {contextHolder}
      {/* Tabs - Now rendered in Header */}
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'users' && renderUserManagement()}
      {activeTab === 'departments' && renderDepartmentManagement()}
      {activeTab === 'config' && renderSystemConfig()}
      {activeTab === 'logs' && renderAuditLog()}
    </div>
  );
};

export default AdminDashboard;
