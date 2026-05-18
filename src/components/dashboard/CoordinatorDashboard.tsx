import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Tag, Button, Table, Modal, Form, Input, Select, DatePicker, message, Popconfirm, Space, Tabs } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, UserAddOutlined, BookOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { trainingService, TrainingProgram } from '../../services/trainingService';
import { learningResourceService, LearningResource } from '../../services/learningResourceService';
import { mentorshipService, Mentorship } from '../../services/mentorshipService';
import { userService } from '../../services/userService';
import dayjs from 'dayjs';

const { TextArea } = Input;

const CoordinatorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [mentorships, setMentorships] = useState<Mentorship[]>([]);
  const [interns, setInterns] = useState<{ userId: number; fullName: string }[]>([]);
  const [mentors, setMentors] = useState<{ userId: number; fullName: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('programs');

  // Modals
  const [programModal, setProgramModal] = useState(false);
  const [resourceModal, setResourceModal] = useState(false);
  const [assignModal, setAssignModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);

  const [form] = Form.useForm();
  const [resourceForm] = Form.useForm();
  const [assignForm] = Form.useForm();

  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    if (selectedProgram) {
      fetchResources(selectedProgram);
      fetchMentorships(selectedProgram);
    }
  }, [selectedProgram]);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const data = await trainingService.getPrograms();
      setPrograms(data.items);
    } catch (error) {
      message.error('Failed to load programs');
    } finally {
      setLoading(false);
    }
  };

  const fetchResources = async (programId: number) => {
    try {
      const data = await learningResourceService.getResourcesByProgram(programId);
      setResources(data);
    } catch (error) {
      message.error('Failed to load resources');
    }
  };

  const fetchMentorships = async (programId: number) => {
    try {
      const data = await mentorshipService.getMentorships({ programId });
      setMentorships(data);
    } catch (error) {
      message.error('Failed to load mentorships');
    }
  };

  const fetchUsersByRole = async (roleId: number, setter: (data: { userId: number; fullName: string }[]) => void) => {
    try {
      const response = await userService.getUsers({ page: 1, pageSize: 100, roleId });
      setter(response.data.items.map((u: { userId: number; fullName: string }) => ({ userId: u.userId, fullName: u.fullName })));
    } catch (error) {
      message.error('Failed to load users');
    }
  };

  const handleCreateProgram = async (values: any) => {
    try {
      if (values.startDate) values.startDate = values.startDate.format('YYYY-MM-DD');
      if (values.endDate) values.endDate = values.endDate.format('YYYY-MM-DD');
      await trainingService.createProgram(values);
      message.success('Program created successfully');
      setProgramModal(false);
      form.resetFields();
      fetchPrograms();
    } catch (error) {
      message.error('Failed to create program');
    }
  };

  const handleUpdateProgram = async (id: number, values: any) => {
    try {
      if (values.startDate) values.startDate = values.startDate.format('YYYY-MM-DD');
      if (values.endDate) values.endDate = values.endDate.format('YYYY-MM-DD');
      await trainingService.updateProgram(id, values);
      message.success('Program updated successfully');
      setProgramModal(false);
      form.resetFields();
      fetchPrograms();
    } catch (error) {
      message.error('Failed to update program');
    }
  };

  const handleDeleteProgram = async (id: number) => {
    try {
      await trainingService.deleteProgram(id);
      message.success('Program deleted successfully');
      fetchPrograms();
    } catch (error) {
      message.error('Failed to delete program');
    }
  };

  const handleUploadResource = async (values: any) => {
    try {
      await learningResourceService.createResource({
        ...values,
        programId: selectedProgram!,
      });
      message.success('Resource uploaded successfully');
      setResourceModal(false);
      resourceForm.resetFields();
      fetchResources(selectedProgram!);
    } catch (error) {
      message.error('Failed to upload resource');
    }
  };

  const handleDeleteResource = async (id: number) => {
    try {
      await learningResourceService.deleteResource(id);
      message.success('Resource deleted successfully');
      fetchResources(selectedProgram!);
    } catch (error) {
      message.error('Failed to delete resource');
    }
  };

  const handleAssignMentor = async (values: any) => {
    try {
      await mentorshipService.createMentorship({
        mentorId: values.mentorId,
        internId: values.internId,
        programId: selectedProgram!,
        startDate: values.startDate?.format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD'),
      });
      message.success('Mentor assigned successfully');
      setAssignModal(false);
      assignForm.resetFields();
      fetchMentorships(selectedProgram!);
    } catch (error) {
      message.error('Failed to assign mentor');
    }
  };

  const handleDeleteMentorship = async (id: number) => {
    try {
      await mentorshipService.deleteMentorship(id);
      message.success('Assignment removed successfully');
      fetchMentorships(selectedProgram!);
    } catch (error) {
      message.error('Failed to remove assignment');
    }
  };

  const programColumns = [
    {
      title: 'Program Name',
      dataIndex: 'programName',
      key: 'programName',
      render: (text: string, record: TrainingProgram) => (
        <a onClick={() => { setSelectedProgram(record.programId); setActiveTab('details'); }}>{text}</a>
      ),
    },
    { title: 'Duration (weeks)', dataIndex: 'durationWeeks', key: 'durationWeeks' },
    { title: 'Start Date', dataIndex: 'startDate', key: 'startDate', render: (d: string) => d || '-' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => (
      <Tag color={s === 'Active' ? 'green' : s === 'Completed' ? 'gray' : 'blue'}>{s}</Tag>
    )},
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: TrainingProgram) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => { form.setFieldsValue(record); setProgramModal(true); }} />
          <Popconfirm title="Delete?" onConfirm={() => handleDeleteProgram(record.programId)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const resourceColumns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Type', dataIndex: 'resourceType', key: 'resourceType', render: (t: string) => <Tag>{t}</Tag> },
    { title: 'Uploaded By', dataIndex: 'uploadedByName', key: 'uploadedByName' },
    { title: 'Date', dataIndex: 'uploadedAt', key: 'uploadedAt', render: (d: string) => dayjs(d).format('YYYY-MM-DD') },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: LearningResource) => (
        <Space>
          {record.resourceUrl && <a href={record.resourceUrl} target="_blank" rel="noopener">View</a>}
          <Popconfirm title="Delete?" onConfirm={() => handleDeleteResource(record.resourceId)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const mentorshipColumns = [
    { title: 'Mentor', dataIndex: 'mentorName', key: 'mentorName' },
    { title: 'Intern', dataIndex: 'internName', key: 'internName' },
    { title: 'Start Date', dataIndex: 'startDate', key: 'startDate' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'Active' ? 'green' : 'red'}>{s}</Tag> },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Mentorship) => (
        <Popconfirm title="Remove?" onConfirm={() => handleDeleteMentorship(record.mentorshipId)}>
          <Button size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  const tabItems = [
    {
      key: 'programs',
      label: 'Training Programs',
      children: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">All Programs</h3>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setProgramModal(true); }}>
              New Program
            </Button>
          </div>
          <Table columns={programColumns} dataSource={programs} rowKey="programId" loading={loading} pagination={{ pageSize: 10 }} />
        </div>
      ),
    },
    {
      key: 'details',
      label: 'Program Details',
      disabled: !selectedProgram,
      children: selectedProgram ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Program #{selectedProgram}</h3>
            <Space>
              <Button icon={<BookOutlined />} onClick={() => { resourceForm.resetFields(); setResourceModal(true); }}>
                Add Resource
              </Button>
              <Button icon={<UserAddOutlined />} onClick={() => { assignForm.resetFields(); fetchUsersByRole(4, setMentors); fetchUsersByRole(5, setInterns); setAssignModal(true); }}>
                Assign Intern
              </Button>
            </Space>
          </div>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card title="Learning Resources" size="small">
                <Table columns={resourceColumns} dataSource={resources} rowKey="resourceId" pagination={false} size="small" />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Mentor-Intern Assignments" size="small">
                <Table columns={mentorshipColumns} dataSource={mentorships} rowKey="mentorshipId" pagination={false} size="small" />
              </Card>
            </Col>
          </Row>
        </div>
      ) : <div>Select a program first</div>,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Program Coordination</h1>
          <p className="text-gray-500 text-sm">Manage training programs and assignments</p>
        </div>
      </div>

      <Card>
        <Tabs activeKey={activeTab} onChange={(key) => { setActiveTab(key); if (key === 'programs') setSelectedProgram(null); }} items={tabItems} />
      </Card>

      {/* Program Modal */}
      <Modal title={form.getFieldValue('programId') ? 'Edit Program' : 'Create Program'} open={programModal} onCancel={() => { setProgramModal(false); form.resetFields(); }} footer={null}>
        <Form form={form} layout="vertical" onFinish={(values) => {
          const id = form.getFieldValue('programId');
          if (id) handleUpdateProgram(id, values);
          else handleCreateProgram(values);
        }}>
          <Form.Item name="programId" hidden><Input /></Form.Item>
          <Form.Item name="programName" label="Program Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item name="objectives" label="Objectives">
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item name="durationWeeks" label="Duration (weeks)">
            <Input type="number" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="startDate" label="Start Date">
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endDate" label="End Date">
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="status" label="Status" initialValue="Planning">
            <Select>
              <Select.Option value="Planning">Planning</Select.Option>
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="Completed">Completed</Select.Option>
              <Select.Option value="Cancelled">Cancelled</Select.Option>
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit" block>Save</Button>
        </Form>
      </Modal>

      {/* Resource Modal */}
      <Modal title="Add Learning Resource" open={resourceModal} onCancel={() => { setResourceModal(false); resourceForm.resetFields(); }} footer={null}>
        <Form form={resourceForm} layout="vertical" onFinish={handleUploadResource}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item name="resourceType" label="Type" initialValue="Document">
            <Select>
              <Select.Option value="Document">Document</Select.Option>
              <Select.Option value="Video">Video</Select.Option>
              <Select.Option value="Link">Link</Select.Option>
              <Select.Option value="Quiz">Quiz</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="resourceUrl" label="URL">
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>Add Resource</Button>
        </Form>
      </Modal>

      {/* Assign Modal */}
      <Modal title="Assign Intern to Mentor" open={assignModal} onCancel={() => { setAssignModal(false); assignForm.resetFields(); }} footer={null}>
        <Form form={assignForm} layout="vertical" onFinish={handleAssignMentor}>
          <Form.Item name="mentorId" label="Mentor" rules={[{ required: true }]}>
            <Select placeholder="Select mentor" showSearch optionFilterProp="children">
              {mentors.map(m => <Select.Option key={m.userId} value={m.userId}>{m.fullName}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="internId" label="Intern" rules={[{ required: true }]}>
            <Select placeholder="Select intern" showSearch optionFilterProp="children">
              {interns.map(i => <Select.Option key={i.userId} value={i.userId}>{i.fullName}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="startDate" label="Start Date">
            <DatePicker className="w-full" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>Assign</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default CoordinatorDashboard;
