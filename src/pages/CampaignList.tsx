import React, { useState, useEffect } from 'react';
import {
  Row, Col, Card, Tag, Button, Input, Select, Empty, Spin,
  Typography, Divider, Badge, Avatar, Tooltip, message
} from 'antd';
import {
  SearchOutlined, EnvironmentOutlined, CalendarOutlined,
  TeamOutlined, ClockCircleOutlined, FilterOutlined,
  AimOutlined, FileTextOutlined, RightOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { campaignService, InternshipCampaignDto } from '../services/campaignService';

const { Title, Text, Paragraph } = Typography;

const statusBadge: Record<string, { color: string; label: string }> = {
  Open: { color: 'success', label: 'Accepting Applications' },
  Draft: { color: 'default', label: 'Coming Soon' },
  Closed: { color: 'error', label: 'Closed' },
  'On Hold': { color: 'warning', label: 'On Hold' },
};

const CampaignCard = ({ campaign, onApply }: { campaign: InternshipCampaignDto; onApply: () => void }) => {
  const badge = statusBadge[campaign.status] ?? statusBadge.Draft;
  const deadline = campaign.applicationDeadline
    ? dayjs(campaign.applicationDeadline)
    : null;
  const isPast = deadline?.isBefore(dayjs());
  const daysLeft = deadline ? deadline.diff(dayjs(), 'day') : null;

  return (
    <Card
      className="h-full rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
      styles={{ body: { padding: '20px' } }}
      extra={
        <Tooltip title={badge.label}>
          <Tag color={badge.color} className="rounded-full font-bold">{campaign.status}</Tag>
        </Tooltip>
      }
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="mb-3">
          <Text type="secondary" className="text-xs font-medium uppercase tracking-wider">
            {campaign.department ?? 'General'}
          </Text>
          <Title level={4} className="!mb-1 mt-1">{campaign.title}</Title>
          <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
            {campaign.location && (
              <span className="flex items-center gap-1">
                <EnvironmentOutlined /> {campaign.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <TeamOutlined /> {campaign.numberOfPositions} position{campaign.numberOfPositions !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <Divider className="!my-3" />

        {/* Description */}
        {campaign.description && (
          <Paragraph type="secondary" ellipsis={{ rows: 2 }} className="text-sm flex-1">
            {campaign.description}
          </Paragraph>
        )}

        {/* Requirements */}
        {campaign.requirements && (
          <div className="mb-3">
            <Text type="secondary" className="text-xs font-bold uppercase tracking-wider">Requirements</Text>
            <Paragraph ellipsis={{ rows: 2 }} className="text-sm text-gray-600 mt-1">
              {campaign.requirements}
            </Paragraph>
          </div>
        )}

        {/* Timeline */}
        <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-4">
          {campaign.startDate && (
            <div className="flex items-center gap-1">
              <CalendarOutlined />
              <span>Starts {dayjs(campaign.startDate).format('MMM D, YYYY')}</span>
            </div>
          )}
          {campaign.endDate && (
            <div className="flex items-center gap-1">
              <ClockCircleOutlined />
              <span>Ends {dayjs(campaign.endDate).format('MMM D, YYYY')}</span>
            </div>
          )}
          {deadline && campaign.status === 'Open' && (
            <div className={`flex items-center gap-1 font-medium ${isPast ? 'text-red-500' : daysLeft !== null && daysLeft <= 7 ? 'text-orange-500' : 'text-gray-500'}`}>
              <ClockCircleOutlined />
              <span>
                {isPast ? 'Deadline passed' :
                  daysLeft === 0 ? 'Deadline today!' :
                    daysLeft !== null ? `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left` : ''}
              </span>
            </div>
          )}
        </div>

        {/* Action */}
        <div className="mt-auto">
          {campaign.status === 'Open' ? (
            <Button
              type="primary"
              block
              size="large"
              className="rounded-xl font-bold"
              onClick={onApply}
            >
              Apply Now <RightOutlined />
            </Button>
          ) : (
            <Button block size="large" className="rounded-xl" disabled>
              {campaign.status === 'Closed' ? 'Applications Closed' : 'Not Yet Open'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

const CampaignList = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<InternshipCampaignDto[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(9);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Open');
  const [deptFilter, setDeptFilter] = useState<string>();
  const [departments, setDepartments] = useState<string[]>([]);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const { data } = await campaignService.getAll({
        page, pageSize, search: search || undefined,
        status: statusFilter === 'All' ? undefined : statusFilter,
        department: deptFilter,
      });
      setCampaigns(data.items);
      setTotal(data.total);
    } catch {
      message.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCampaigns(); }, [page, statusFilter, deptFilter, search]);

  useEffect(() => {
    const uniqueDepts = [...new Set(campaigns.map(c => c.department).filter(Boolean))] as string[];
    setDepartments(uniqueDepts);
  }, [campaigns]);

  const handleApply = (campaign: InternshipCampaignDto) => {
    navigate(`/campaigns/${campaign.campaignId}/apply`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero */}
      <div className="bg-primary text-white py-16 px-6 text-center">
        <Title level={1} className="!text-white !mb-3">Join Our Team</Title>
        <Paragraph className="text-white/80 text-lg max-w-xl mx-auto">
          Discover exciting internship opportunities and kickstart your career with hands-on experience.
        </Paragraph>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="glass-card p-4 rounded-2xl mb-6">
          <div className="flex flex-wrap gap-3 items-center">
            <Input.Search
              placeholder="Search by title or keyword..."
              allowClear
              size="large"
              className="flex-1 min-w-[200px]"
              onSearch={(v) => { setSearch(v); setPage(1); }}
              prefix={<SearchOutlined className="text-gray-400" />}
            />
            <Select
              value={statusFilter}
              size="large"
              style={{ width: 180 }}
              onChange={(v) => { setStatusFilter(v); setPage(1); }}
              options={[
                { value: 'Open', label: 'Open Positions' },
                { value: 'All', label: 'All Campaigns' },
                { value: 'Draft', label: 'Coming Soon' },
                { value: 'Closed', label: 'Closed' },
              ]}
            />
            <Select
              allowClear
              placeholder="All Departments"
              size="large"
              style={{ width: 180 }}
              onChange={(v) => { setDeptFilter(v); setPage(1); }}
              options={departments.map(d => ({ value: d, label: d }))}
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex justify-between items-center mb-4">
          <Text type="secondary">{total} campaign{total !== 1 ? 's' : ''} found</Text>
        </div>

        <Spin spinning={loading}>
          {campaigns.length === 0 && !loading ? (
            <Empty description="No campaigns match your criteria" className="my-16" />
          ) : (
            <Row gutter={[16, 16]}>
              {campaigns.map(c => (
                <Col xs={24} sm={12} lg={8} key={c.campaignId}>
                  <CampaignCard campaign={c} onApply={() => handleApply(c)} />
                </Col>
              ))}
            </Row>
          )}
        </Spin>

        {/* Pagination */}
        {total > pageSize && (
          <div className="flex justify-center mt-8">
            <Pagination
              total={total}
              pageSize={pageSize}
              current={page}
              onChange={setPage}
              showSizeChanger={false}
              size="large"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignList;
