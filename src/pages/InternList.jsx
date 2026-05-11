import React, { useState } from 'react';
import { Table, Tag, Space, Button, Input, Card, Typography, Breadcrumb, Avatar } from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  FilterOutlined, 
  MoreOutlined,
  UserOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;

const InternList = () => {
  const [searchText, setSearchText] = useState('');

  const columns = [
    {
      title: 'Intern',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} className="bg-primary/10 text-primary" />
          <div className="flex flex-col">
            <Text strong>{text}</Text>
            <Text type="secondary" className="text-xs">{record.email}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Mentor',
      dataIndex: 'mentor',
      key: 'mentor',
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (status) => {
        let color = status === 'Active' ? 'success' : 'processing';
        if (status === 'Completed') color = 'default';
        if (status === 'Paused') color = 'warning';
        return (
          <Tag color={color} className="rounded-full px-3">
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<MoreOutlined />} />
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      department: 'Engineering',
      mentor: 'Alex Johnson',
      duration: '3 Months',
      status: 'Active',
    },
    {
      key: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      department: 'Design',
      mentor: 'Sarah Parker',
      duration: '6 Months',
      status: 'Active',
    },
    {
      key: '3',
      name: 'Michael Brown',
      email: 'michael.b@example.com',
      department: 'Marketing',
      mentor: 'David Lee',
      duration: '3 Months',
      status: 'Completed',
    },
    {
      key: '4',
      name: 'Alice Wilson',
      email: 'alice.w@example.com',
      department: 'Engineering',
      mentor: 'Alex Johnson',
      duration: '3 Months',
      status: 'Paused',
    },
    {
      key: '5',
      name: 'Robert Miller',
      email: 'robert.m@example.com',
      department: 'Sales',
      mentor: 'Chris Evans',
      duration: '6 Months',
      status: 'Active',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <Breadcrumb 
            items={[
              { title: 'Dashboard' },
              { title: 'Interns' },
            ]} 
          />
          <Title level={2} className="m-0 mt-1">Manage Interns</Title>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large" className="rounded-lg">
          Add New Intern
        </Button>
      </div>

      <Card className="shadow-sm border-none">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <Input
            placeholder="Search interns by name or email..."
            prefix={<SearchOutlined className="text-gray-400" />}
            className="max-w-md rounded-lg"
            size="large"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Space>
            <Button icon={<FilterOutlined />}>Filters</Button>
            <Button>Export CSV</Button>
          </Space>
        </div>

        <Table 
          columns={columns} 
          dataSource={data.filter(item => 
            item.name.toLowerCase().includes(searchText.toLowerCase()) || 
            item.email.toLowerCase().includes(searchText.toLowerCase())
          )} 
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default InternList;
