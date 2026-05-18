import { useState, useEffect } from 'react';
import {
  Row, Col, Card, Table, Button, Tag, Drawer, Form,
  Input, Select, DatePicker, InputNumber, Space, message,
  Popconfirm, Tooltip, Typography, Avatar,
  Tabs, Divider, Rate, Pagination
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  UserAddOutlined, CheckCircleOutlined,
  FileSearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined,
  EyeOutlined, CalendarOutlined, MailOutlined, PhoneOutlined,
  EnvironmentOutlined, ReloadOutlined,
  VideoCameraOutlined, CloseCircleOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { campaignService, InternshipCampaignDto } from '../../services/campaignService';
import { applicationService, CampaignApplicationDto } from '../../services/applicationService';
import { interviewService, InterviewDto } from '../../services/interviewService';
import { userService, PaginatedUsers } from '../../services/userService';

const { Text } = Typography;
const { TextArea } = Input;

const CAMPAIGN_STATUSES = ['Draft', 'Open', 'Closed', 'On Hold'];
const APPLICATION_STATUSES = ['Pending', 'Under Review', 'Shortlisted', 'Interview', 'Offered', 'Rejected', 'Withdrawn'];
const INTERVIEW_TYPES = ['Video', 'Phone', 'On-site', 'Technical', 'Behavioral'];
const INTERVIEW_STATUSES = ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled', 'No Show'];

const statusColor: Record<string, string> = {
  Draft: 'default', Open: 'processing', Closed: 'default', 'On Hold': 'warning',
  Pending: 'default', 'Under Review': 'processing', Shortlisted: 'cyan', Interview: 'blue',
  Offered: 'green', Rejected: 'red', Withdrawn: 'default',
  Scheduled: 'processing', Completed: 'success', Cancelled: 'error', Rescheduled: 'warning', 'No Show': 'error',
};

// ─────────────────────────────────────────────────────
// CAMPAIGNS TAB
// ─────────────────────────────────────────────────────
const CampaignsTab = () => {
  const [campaigns, setCampaigns] = useState<InternshipCampaignDto[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const { data } = await campaignService.getAll({ page, pageSize, search: search || undefined, status: statusFilter });
      setCampaigns(data.items);
      setTotal(data.total);
    } catch {
      message.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCampaigns(); }, [page, pageSize, search, statusFilter]);

  const openDrawer = (campaign?: InternshipCampaignDto) => {
    if (campaign) {
      setEditingId(campaign.campaignId);
      form.setFieldsValue({
        ...campaign,
        startDate: campaign.startDate ? dayjs(campaign.startDate) : null,
        endDate: campaign.endDate ? dayjs(campaign.endDate) : null,
        applicationDeadline: campaign.applicationDeadline ? dayjs(campaign.applicationDeadline) : null,
      });
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setDrawerOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        startDate: values.startDate?.format('YYYY-MM-DD'),
        endDate: values.endDate?.format('YYYY-MM-DD'),
        applicationDeadline: values.applicationDeadline?.format('YYYY-MM-DD'),
      };
      if (editingId) {
        await campaignService.update(editingId, payload);
        message.success('Campaign updated');
      } else {
        await campaignService.create(payload);
        message.success('Campaign created');
      }
      setDrawerOpen(false);
      fetchCampaigns();
    } catch (err: any) {
      if (err.errorFields) return;
      message.error('Failed to save campaign');
    }
  };

  const handleDelete = async (id: number) => {
    await campaignService.delete(id);
    message.success('Campaign deleted');
    fetchCampaigns();
  };

  const columns: ColumnsType<InternshipCampaignDto> = [
    {
      title: 'Title', dataIndex: 'title', key: 'title',
      render: (text, r) => (
        <div>
          <div className="font-semibold">{text}</div>
          <Text type="secondary" className="text-xs">{r.department}</Text>
        </div>
      )
    },
    { title: 'Positions', dataIndex: 'numberOfPositions', key: 'positions', width: 100, render: (v) => <span className="font-bold">{v}</span> },
    { title: 'Location', dataIndex: 'location', key: 'location', render: (v) => v || '-' },
    {
      title: 'Deadline', dataIndex: 'applicationDeadline', key: 'deadline', width: 120,
      render: (v) => v ? dayjs(v).format('MMM D, YYYY') : '-'
    },
    {
      title: 'Status', dataIndex: 'status', key: 'status', width: 110,
      render: (v) => <Tag color={statusColor[v] ?? 'default'}>{v?.toUpperCase()}</Tag>
    },
    {
      title: 'Created', dataIndex: 'createdAt', key: 'createdAt', width: 120,
      render: (v) => dayjs(v).format('MMM D, YYYY')
    },
    {
      title: 'Actions', key: 'actions', width: 120,
      render: (_, r) => (
        <Space>
          <Tooltip title="Edit"><Button size="small" icon={<EditOutlined />} onClick={() => openDrawer(r)} /></Tooltip>
          <Popconfirm title="Delete this campaign?" onConfirm={() => handleDelete(r.campaignId)}>
            <Tooltip title="Delete"><Button size="small" danger icon={<DeleteOutlined />} /></Tooltip>
          </Popconfirm>
        </Space>
      )
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Input.Search placeholder="Search campaigns..." allowClear onSearch={setSearch} style={{ width: 240 }} />
          <Select allowClear placeholder="Filter by status" style={{ width: 140 }} onChange={setStatusFilter}>
            {CAMPAIGN_STATUSES.map(s => <Select.Option key={s} value={s}>{s}</Select.Option>)}
          </Select>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openDrawer()}>New Campaign</Button>
      </div>
      <Table columns={columns} dataSource={campaigns} rowKey="campaignId" loading={loading} pagination={false}
        className="glass-card [&_.ant-table]:!bg-transparent" />
      <div className="mt-4 flex justify-end">
        <Pagination total={total} current={page} pageSize={pageSize} onChange={(p, ps) => { setPage(p); setPageSize(ps); }} showSizeChanger />
      </div>

      <Drawer title={editingId ? 'Edit Campaign' : 'New Campaign'} open={drawerOpen} onClose={() => setDrawerOpen(false)} size="large"
        extra={<Button type="primary" onClick={handleSave}>{editingId ? 'Update' : 'Create'}</Button>}>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input placeholder="e.g. Summer Frontend Internship 2026" />
          </Form.Item>
          <Form.Item name="department" label="Department">
            <Input placeholder="e.g. Engineering" />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="location" label="Location">
                <Input placeholder="e.g. Ho Chi Minh City" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="numberOfPositions" label="Positions" rules={[{ required: true }]}>
                <InputNumber min={1} className="w-full" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="Description">
            <TextArea rows={3} placeholder="Describe the internship role..." />
          </Form.Item>
          <Form.Item name="requirements" label="Requirements">
            <TextArea rows={3} placeholder="List requirements..." />
          </Form.Item>
          <Row gutter={12}>
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
          <Form.Item name="applicationDeadline" label="Application Deadline">
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]} initialValue="Draft">
            <Select>
              {CAMPAIGN_STATUSES.map(s => <Select.Option key={s} value={s}>{s}</Select.Option>)}
            </Select>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

// ─────────────────────────────────────────────────────
// APPLICATIONS TAB
// ─────────────────────────────────────────────────────
const ApplicationsTab = () => {
  const [applications, setApplications] = useState<CampaignApplicationDto[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>();
  const [campaignFilter, setCampaignFilter] = useState<number>();
  const [campaigns, setCampaigns] = useState<InternshipCampaignDto[]>([]);
  const [reviewDrawer, setReviewDrawer] = useState(false);
  const [selectedApp, setSelectedApp] = useState<CampaignApplicationDto | null>(null);
  const [reviewForm] = Form.useForm();

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data } = await applicationService.getAll({
        page, pageSize, search: search || undefined, status: statusFilter, campaignId: campaignFilter
      });
      setApplications(data.items);
      setTotal(data.total);
    } catch {
      message.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    const { data } = await campaignService.getAll({ page: 1, pageSize: 100, status: 'Open' });
    setCampaigns(data.items);
  };

  useEffect(() => { fetchApplications(); }, [page, pageSize, search, statusFilter, campaignFilter]);
  useEffect(() => { fetchCampaigns(); }, []);

  const openReview = (app: CampaignApplicationDto) => {
    setSelectedApp(app);
    reviewForm.setFieldsValue({ status: app.status, notes: app.notes });
    setReviewDrawer(true);
  };

  const handleReview = async () => {
    try {
      const values = await reviewForm.validateFields();
      if (selectedApp) {
        await applicationService.update(selectedApp.applicationId, values);
        message.success('Application reviewed');
        setReviewDrawer(false);
        fetchApplications();
      }
    } catch {}
  };

  const columns: ColumnsType<CampaignApplicationDto> = [
    {
      title: 'Applicant', key: 'applicant',
      render: (_, r) => (
        <div className="flex items-center gap-2">
          <Avatar size={36} className="bg-primary">{r.applicantName[0]?.toUpperCase()}</Avatar>
          <div>
            <div className="font-semibold text-sm">{r.applicantName}</div>
            <Text type="secondary" className="text-xs">{r.applicantEmail}</Text>
          </div>
        </div>
      )
    },
    { title: 'Campaign', dataIndex: 'campaignId', key: 'campaignId', width: 80, render: (v) => campaigns.find(c => c.campaignId === v)?.title || `#${v}` },
    {
      title: 'Applied', dataIndex: 'appliedDate', key: 'appliedDate', width: 110,
      render: (v) => dayjs(v).format('MMM D, YYYY')
    },
    {
      title: 'Status', dataIndex: 'status', key: 'status', width: 130,
      render: (v) => <Tag color={statusColor[v] ?? 'default'} className="rounded-full">{v}</Tag>
    },
    {
      title: 'Actions', key: 'actions', width: 120,
      render: (_, r) => (
        <Space>
          <Tooltip title="Review"><Button size="small" type="primary" ghost icon={<EyeOutlined />} onClick={() => openReview(r)} /></Tooltip>
        </Space>
      )
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Input.Search placeholder="Search applicant..." allowClear onSearch={setSearch} style={{ width: 220 }} />
          <Select allowClear placeholder="All Status" style={{ width: 140 }} onChange={setStatusFilter}>
            {APPLICATION_STATUSES.map(s => <Select.Option key={s} value={s}>{s}</Select.Option>)}
          </Select>
          <Select allowClear placeholder="All Campaigns" style={{ width: 180 }} onChange={setCampaignFilter}>
            {campaigns.map(c => <Select.Option key={c.campaignId} value={c.campaignId}>{c.title}</Select.Option>)}
          </Select>
        </div>
        <Button icon={<ReloadOutlined />} onClick={fetchApplications}>Refresh</Button>
      </div>
      <Table columns={columns} dataSource={applications} rowKey="applicationId" loading={loading} pagination={false}
        className="glass-card [&_.ant-table]:!bg-transparent" />
      <div className="mt-4 flex justify-end">
        <Pagination total={total} current={page} pageSize={pageSize} onChange={(p, ps) => { setPage(p); setPageSize(ps); }} showSizeChanger />
      </div>

      <Drawer title={`Review Application — ${selectedApp?.applicantName}`} open={reviewDrawer} onClose={() => setReviewDrawer(false)} size="default"
        extra={<Button type="primary" onClick={handleReview}>Save Review</Button>}>
        {selectedApp && (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2"><MailOutlined className="text-primary" /> <Text>{selectedApp.applicantEmail}</Text></div>
              {selectedApp.applicantPhone && <div className="flex items-center gap-2"><PhoneOutlined className="text-primary" /> <Text>{selectedApp.applicantPhone}</Text></div>}
              {selectedApp.cvUrl && <div className="flex items-center gap-2"><FileSearchOutlined className="text-primary" /> <a href={selectedApp.cvUrl} target="_blank" rel="noreferrer">View CV</a></div>}
              {selectedApp.coverLetter && <>
                <Divider className="my-2" />
                <Text strong>Cover Letter</Text>
                <p className="text-sm text-gray-600">{selectedApp.coverLetter}</p>
              </>}
            </div>
            <Form form={reviewForm} layout="vertical">
              <Form.Item name="status" label="Update Status" rules={[{ required: true }]}>
                <Select>
                  {APPLICATION_STATUSES.map(s => <Select.Option key={s} value={s}>{s}</Select.Option>)}
                </Select>
              </Form.Item>
              <Form.Item name="notes" label="Internal Notes">
                <TextArea rows={4} placeholder="Add notes about this application..." />
              </Form.Item>
            </Form>
          </div>
        )}
      </Drawer>
    </div>
  );
};

// ─────────────────────────────────────────────────────
// INTERVIEWS TAB
// ─────────────────────────────────────────────────────
const InterviewsTab = () => {
  const [interviews, setInterviews] = useState<InterviewDto[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>();
  const [campaignFilter, setCampaignFilter] = useState<number>();
  const [campaigns, setCampaigns] = useState<InternshipCampaignDto[]>([]);
  const [interviewers, setInterviewers] = useState<{userId: number, fullName: string, email: string}[]>([]);
  const [shortlistedApps, setShortlistedApps] = useState<CampaignApplicationDto[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const { data } = await interviewService.getAll({
        page, pageSize, status: statusFilter, campaignId: campaignFilter
      });
      setInterviews(data.items);
      setTotal(data.total);
    } catch {
      message.error('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    const { data } = await campaignService.getAll({ page: 1, pageSize: 100 });
    setCampaigns(data.items);
  };

  const fetchInterviewers = async () => {
    // Get all HR and Mentor users
    try {
      const hrRes = await userService.getUsers({ page: 1, pageSize: 100, roleId: 2 }); // HR
      const mentorRes = await userService.getUsers({ page: 1, pageSize: 100, roleId: 3 }); // Mentor
      const combined = [...(hrRes.data.items || []), ...(mentorRes.data.items || [])];
      setInterviewers(combined.map(u => ({ userId: u.userId, fullName: u.fullName, email: u.email })));
    } catch { console.error('Failed to fetch interviewers'); }
  };

  const fetchApplications = async (campaignId?: number) => {
    try {
      const { data } = await applicationService.getAll({ page: 1, pageSize: 100, campaignId });
      setShortlistedApps(data.items);
    } catch { console.error('Failed to fetch applications'); }
  };

  useEffect(() => { fetchInterviews(); }, [page, pageSize, statusFilter, campaignFilter]);
  useEffect(() => { fetchCampaigns(); fetchInterviewers(); }, []);

  const openDrawer = (interview?: InterviewDto) => {
    if (interview) {
      setEditingId(interview.interviewId);
      form.setFieldsValue({
        ...interview,
        scheduledTime: dayjs(interview.scheduledTime),
        campaignId: interview.campaignId,
        interviewType: interview.interviewType,
        durationMinutes: interview.durationMinutes,
        status: interview.status,
        interviewerId: interview.interviewerId,
        applicationId: interview.applicationId,
      });
      fetchApplications(interview.campaignId);
    } else {
      setEditingId(null);
      form.resetFields();
      form.setFieldsValue({ scheduledTime: dayjs().add(1, 'day'), durationMinutes: 60, interviewType: 'Video', status: 'Scheduled' });
      fetchApplications();
    }
    setDrawerOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        scheduledTime: values.scheduledTime.format('YYYY-MM-DDTHH:mm:ss'),
        campaignId: values.campaignId,
      };
      if (editingId) {
        await interviewService.update(editingId, payload);
        message.success('Interview updated');
      } else {
        await interviewService.create(payload);
        message.success('Interview scheduled');
      }
      setDrawerOpen(false);
      fetchInterviews();
    } catch (err: any) {
      if (err.errorFields) return;
      message.error('Failed to save interview');
    }
  };

  const handleDelete = async (id: number) => {
    await interviewService.delete(id);
    message.success('Interview cancelled');
    fetchInterviews();
  };

  const getInterviewIcon = (type: string) => {
    switch (type) {
      case 'Video': return <VideoCameraOutlined />;
      case 'Phone': return <PhoneOutlined />;
      case 'On-site': return <EnvironmentOutlined />;
      default: return <CalendarOutlined />;
    }
  };

  const columns: ColumnsType<InterviewDto> = [
    {
      title: 'Scheduled Time', dataIndex: 'scheduledTime', key: 'scheduledTime',
      render: (v) => (
        <div>
          <div className="font-semibold text-sm">{dayjs(v).format('MMM D, YYYY')}</div>
          <Text type="secondary" className="text-xs">{dayjs(v).format('h:mm A')}</Text>
        </div>
      )
    },
    {
      title: 'Type', dataIndex: 'interviewType', key: 'type', width: 110,
      render: (v) => <Tag icon={getInterviewIcon(v)} color="blue" className="rounded-full">{v}</Tag>
    },
    { title: 'Duration', dataIndex: 'durationMinutes', key: 'duration', width: 90, render: (v) => `${v} min` },
    { title: 'Campaign', dataIndex: 'campaignId', key: 'campaign', width: 150, render: (v) => campaigns.find(c => c.campaignId === v)?.title || '-' },
    {
      title: 'Status', dataIndex: 'status', key: 'status', width: 120,
      render: (v) => <Tag color={statusColor[v] ?? 'default'} className="rounded-full">{v}</Tag>
    },
    {
      title: 'Rating', dataIndex: 'rating', key: 'rating', width: 100,
      render: (v) => v ? <Rate disabled defaultValue={v} style={{ fontSize: 12 }} /> : <Text type="secondary" className="text-xs">—</Text>
    },
    {
      title: 'Actions', key: 'actions', width: 100,
      render: (_, r) => (
        <Space>
          <Tooltip title="Edit"><Button size="small" icon={<EditOutlined />} onClick={() => openDrawer(r)} /></Tooltip>
          <Popconfirm title="Cancel this interview?" onConfirm={() => handleDelete(r.interviewId)}>
            <Tooltip title="Cancel"><Button size="small" danger icon={<CloseCircleOutlined />} /></Tooltip>
          </Popconfirm>
        </Space>
      )
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Select allowClear placeholder="All Status" style={{ width: 140 }} onChange={setStatusFilter}>
            {INTERVIEW_STATUSES.map(s => <Select.Option key={s} value={s}>{s}</Select.Option>)}
          </Select>
          <Select allowClear placeholder="All Campaigns" style={{ width: 180 }} onChange={setCampaignFilter}>
            {campaigns.map(c => <Select.Option key={c.campaignId} value={c.campaignId}>{c.title}</Select.Option>)}
          </Select>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openDrawer()}>Schedule Interview</Button>
      </div>
      <Table columns={columns} dataSource={interviews} rowKey="interviewId" loading={loading} pagination={false}
        className="glass-card [&_.ant-table]:!bg-transparent" />
      <div className="mt-4 flex justify-end">
        <Pagination total={total} current={page} pageSize={pageSize} onChange={(p, ps) => { setPage(p); setPageSize(ps); }} showSizeChanger />
      </div>

      <Drawer title={editingId ? 'Edit Interview' : 'Schedule Interview'} open={drawerOpen} onClose={() => setDrawerOpen(false)} size="default"
        extra={<Button type="primary" onClick={handleSave}>{editingId ? 'Update' : 'Schedule'}</Button>}>
        <Form form={form} layout="vertical">
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="applicationId" label="Applicant" rules={[{ required: true }]}>
                <Select showSearch placeholder="Select applicant" filterOption={(input, option) =>
                  (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                }>
                  {shortlistedApps.map(a => (
                    <Select.Option key={a.applicationId} value={a.applicationId}>
                      {a.applicantName} - {a.applicantEmail}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="interviewerId" label="Interviewer" rules={[{ required: true }]}>
                <Select showSearch placeholder="Select interviewer" filterOption={(input, option) =>
                  (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                }>
                  {interviewers.map(i => (
                    <Select.Option key={i.userId} value={i.userId}>
                      {i.fullName} ({i.email})
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="campaignId" label="Campaign">
            <Select onChange={(val) => fetchApplications(val)}>
              {campaigns.map(c => <Select.Option key={c.campaignId} value={c.campaignId}>{c.title}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="scheduledTime" label="Date & Time" rules={[{ required: true }]}>
            <DatePicker showTime className="w-full" format="YYYY-MM-DD HH:mm" />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="interviewType" label="Interview Type" rules={[{ required: true }]}>
                <Select>
                  {INTERVIEW_TYPES.map(t => <Select.Option key={t} value={t}>{t}</Select.Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="durationMinutes" label="Duration (min)" rules={[{ required: true }]}>
                <InputNumber min={15} max={240} step={15} className="w-full" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="meetingLink" label="Meeting Link">
            <Input placeholder="https://meet.google.com/..." />
          </Form.Item>
          <Form.Item name="location" label="Location">
            <Input placeholder="Room 302 or address..." />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              {INTERVIEW_STATUSES.map(s => <Select.Option key={s} value={s}>{s}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="feedback" label="Feedback">
            <TextArea rows={3} placeholder="Post-interview feedback..." />
          </Form.Item>
          <Form.Item name="rating" label="Rating">
            <Rate />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

// ─────────────────────────────────────────────────────
// MAIN HR DASHBOARD
// ─────────────────────────────────────────────────────
const HRDashboard = () => {
  const [stats, setStats] = useState({ open: 0, applications: 0, interviews: 0, shortlisted: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [openC, apps, ints] = await Promise.all([
          campaignService.getAll({ page: 1, pageSize: 1, status: 'Open' }),
          applicationService.getAll({ page: 1, pageSize: 1 }),
          interviewService.getAll({ page: 1, pageSize: 1, status: 'Scheduled' }),
        ]);
        const short = await applicationService.getAll({ page: 1, pageSize: 1, status: 'Shortlisted' });
        setStats({
          open: openC.data.total,
          applications: apps.data.total,
          interviews: ints.data.total,
          shortlisted: short.data.total,
        });
      } catch { /* silent */ }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Open Campaigns', value: stats.open, subtitle: 'Active now', icon: <UserAddOutlined />, color: '#3525cd', bg: 'bg-blue-50' },
    { title: 'Total Applications', value: stats.applications, subtitle: 'All time', icon: <FileSearchOutlined />, color: '#00687a', bg: 'bg-cyan-50' },
    { title: 'Interviews Scheduled', value: stats.interviews, subtitle: 'Upcoming', icon: <CalendarOutlined />, color: '#41485e', bg: 'bg-slate-100' },
    { title: 'Shortlisted', value: stats.shortlisted, subtitle: 'Ready to hire', icon: <CheckCircleOutlined />, color: '#10b981', bg: 'bg-green-50' },
  ];

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="primary-gradient rounded-2xl p-5 text-white flex justify-between items-center shadow-lg">
        <div>
          <h1 className="text-xl font-bold mb-1 text-white">Recruitment Pipeline</h1>
          <p className="text-sm opacity-80">
            {stats.open} open campaign{stats.open !== 1 ? 's' : ''} · {stats.applications} total applications
          </p>
        </div>
      </div>

      {/* Stats */}
      <Row gutter={[10, 10]}>
        {statCards.map((s, i) => (
          <Col xs={12} sm={12} lg={6} key={i}>
            <div className="glass-card p-4 rounded-xl border border-white/50 h-full">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-xl text-lg ${s.bg}`} style={{ color: s.color }}>{s.icon}</div>
                <div>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-0">{s.title}</p>
                  <p className="text-gray-400 text-[10px]">{s.subtitle}</p>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{s.value}</h2>
            </div>
          </Col>
        ))}
      </Row>

      {/* Main Tabbed Content */}
      <Card
        className="glass-card shadow-sm"
        styles={{ body: { padding: 0 } }}
      >
        <Tabs defaultActiveKey="campaigns" size="large" className="px-4 pt-2"
          style={{ padding: '0 16px', borderBottom: '1px solid #f0f0f0' }}
          items={[
            { key: 'campaigns', label: <span className="flex items-center gap-1"><AppstoreOutlined />Campaigns</span>, children: <div className="p-4"><CampaignsTab /></div> },
            { key: 'applications', label: <span className="flex items-center gap-1"><FileSearchOutlined />Applications</span>, children: <div className="p-4"><ApplicationsTab /></div> },
            { key: 'interviews', label: <span className="flex items-center gap-1"><CalendarOutlined />Interviews</span>, children: <div className="p-4"><InterviewsTab /></div> },
          ]}
        />
      </Card>
    </div>
  );
};

export default HRDashboard;
