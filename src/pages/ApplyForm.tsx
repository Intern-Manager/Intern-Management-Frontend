import React, { useState, useEffect } from 'react';
import {
  Card, Form, Input, Button, Steps, Row, Col, Typography,
  Divider, message, Result, Upload, Select, Alert, Spin
} from 'antd';
import {
  EnvironmentOutlined, CalendarOutlined, TeamOutlined,
  MailOutlined, PhoneOutlined, UserOutlined, FileTextOutlined,
  CheckCircleOutlined, ArrowLeftOutlined, UploadOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { campaignService, InternshipCampaignDetailDto } from '../services/campaignService';
import { applicationService, CreateApplicationRequest } from '../services/applicationService';
import { uploadService } from '../services/uploadService';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

const statusColors: Record<string, string> = {
  Open: 'success', Draft: 'default', Closed: 'error', 'On Hold': 'warning'
};

const ApplyForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<InternshipCampaignDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [cvFile, setCvFile] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await campaignService.getById(Number(id));
        setCampaign(data);
      } catch {
        message.error('Campaign not found');
        navigate('/campaigns');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  const handleSubmit = async (values: any) => {
    if (!campaign) return;
    setSubmitting(true);
    try {
      let cvUrl = values.cvUrl;

      // Upload CV file if selected
      if (cvFile) {
        setUploading(true);
        try {
          cvUrl = await uploadService.uploadFile(cvFile, 'cvs');
        } catch (uploadErr) {
          message.error('Failed to upload CV. Please try again.');
          setSubmitting(false);
          setUploading(false);
          return;
        }
        setUploading(false);
      }

      const payload: CreateApplicationRequest = {
        campaignId: campaign.campaignId,
        applicantEmail: values.email,
        applicantName: values.fullName,
        applicantPhone: values.phone,
        coverLetter: values.coverLetter,
        cvUrl: cvUrl,
      };
      await applicationService.create(payload);
      setSubmitted(true);
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCvChange = (info: any) => {
    const file = info.file;
    if (file.status === 'done') {
      setCvFile(file.originFileObj);
    } else if (file.status === 'error') {
      message.error('Failed to select file');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <Spin size="large" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4">
        <Result
          icon={<CheckCircleOutlined style={{ color: '#10b981' }} />}
          title="Application Submitted!"
          subTitle={`Your application for "${campaign?.title}" has been received. We will review it and get back to you soon.`}
          extra={[
            <Button type="primary" key="home" onClick={() => navigate('/campaigns')}>
              View More Opportunities
            </Button>,
            <Button key="track" onClick={() => navigate('/login')}>
              Track Application
            </Button>,
          ]}
          className="!bg-white rounded-2xl shadow-sm"
        />
      </div>
    );
  }

  if (!campaign) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-primary text-white py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            className="text-white/80 hover:!text-white mb-4"
            onClick={() => navigate('/campaigns')}
          >
            Back to Campaigns
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <Text className="text-white/60 text-xs font-bold uppercase tracking-wider">
                {campaign.department}
              </Text>
              <Title level={2} className="!text-white !mb-2">{campaign.title}</Title>
              <div className="flex flex-wrap gap-4 text-white/80 text-sm">
                {campaign.location && (
                  <span className="flex items-center gap-1"><EnvironmentOutlined /> {campaign.location}</span>
                )}
                <span className="flex items-center gap-1"><TeamOutlined /> {campaign.numberOfPositions} positions</span>
                {campaign.applicationDeadline && (
                  <span className="flex items-center gap-1">
                    <CalendarOutlined />
                    Deadline: {dayjs(campaign.applicationDeadline).format('MMM D, YYYY')}
                  </span>
                )}
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              campaign.status === 'Open' ? 'bg-green-500/20 text-green-200' : 'bg-white/20 text-white/80'
            }`}>
              {campaign.status}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Row gutter={24}>
          {/* Left: Campaign Info */}
          <Col xs={24} lg={7}>
            <Card className="rounded-2xl shadow-sm mb-4 sticky top-4" styles={{ body: { padding: '20px' } }}>
              <Text className="text-xs font-bold uppercase text-gray-400 tracking-wider">About this role</Text>
              <Divider />
              {campaign.description && (
                <div className="mb-4">
                  <Text strong className="text-sm">Description</Text>
                  <Paragraph className="text-sm text-gray-600 mt-1">{campaign.description}</Paragraph>
                </div>
              )}
              {campaign.requirements && (
                <div className="mb-4">
                  <Text strong className="text-sm">Requirements</Text>
                  <Paragraph className="text-sm text-gray-600 mt-1">{campaign.requirements}</Paragraph>
                </div>
              )}
              <Divider />
              <div className="space-y-2 text-sm text-gray-600">
                {campaign.startDate && (
                  <div className="flex gap-2">
                    <CalendarOutlined className="text-primary" />
                    <span>Start: {dayjs(campaign.startDate).format('MMM D, YYYY')}</span>
                  </div>
                )}
                {campaign.endDate && (
                  <div className="flex gap-2">
                    <CalendarOutlined className="text-primary" />
                    <span>End: {dayjs(campaign.endDate).format('MMM D, YYYY')}</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <TeamOutlined className="text-primary" />
                  <span>{campaign.numberOfPositions} position{campaign.numberOfPositions !== 1 ? 's' : ''} available</span>
                </div>
              </div>
            </Card>
          </Col>

          {/* Right: Application Form */}
          <Col xs={24} lg={17}>
            <Card className="rounded-2xl shadow-sm" styles={{ body: { padding: '28px' } }}>
              <Title level={4} className="!mb-1">Apply for this Position</Title>
              <Text type="secondary" className="text-sm">Fill in your details below to submit your application.</Text>
              <Divider />

              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                requiredMark={false}
                className="mt-2"
              >
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="fullName"
                      label="Full Name"
                      rules={[{ required: true, message: 'Full name is required' }]}
                    >
                      <Input size="large" prefix={<UserOutlined className="text-gray-400" />} placeholder="Nguyen Van A" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="email"
                      label="Email Address"
                      rules={[
                        { required: true, message: 'Email is required' },
                        { type: 'email', message: 'Please enter a valid email' }
                      ]}
                    >
                      <Input size="large" prefix={<MailOutlined className="text-gray-400" />} placeholder="your.email@example.com" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="phone"
                  label="Phone Number"
                  rules={[{ required: true, message: 'Phone number is required' }]}
                >
                  <Input size="large" prefix={<PhoneOutlined className="text-gray-400" />} placeholder="+84 123 456 789" />
                </Form.Item>

                <Form.Item
                  name="cvUrl"
                  label="CV / Resume"
                  extra="Upload your CV (PDF, DOC, DOCX - Max 10MB) or paste a link below"
                >
                  <Dragger
                    name="file"
                    maxCount={1}
                    accept=".pdf,.doc,.docx"
                    beforeUpload={() => false}
                    onChange={handleCvChange}
                    className="rounded-xl"
                  >
                    <p className="ant-upload-drag-icon">
                      <UploadOutlined style={{ color: '#4f46e5', fontSize: 40 }} />
                    </p>
                    <p className="ant-upload-text">Click or drag CV file to upload</p>
                    <p className="ant-upload-hint">Support for PDF, DOC, DOCX (Max 10MB)</p>
                  </Dragger>
                  {cvFile && (
                    <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
                      <CheckCircleOutlined /> Selected: {cvFile.name}
                    </div>
                  )}
                  <Input
                    className="mt-3"
                    size="large"
                    prefix={<FileTextOutlined className="text-gray-400" />}
                    placeholder="Or paste a link: https://drive.google.com/..."
                  />
                </Form.Item>

                <Form.Item
                  name="coverLetter"
                  label="Cover Letter"
                  extra="Tell us why you're a great fit for this internship"
                >
                  <TextArea
                    rows={6}
                    placeholder="I am excited to apply for this internship because..."
                    showCount
                    maxLength={2048}
                  />
                </Form.Item>

                <Alert
                  message="Your application will be reviewed by our HR team. You will receive a confirmation email once reviewed."
                  type="info"
                  showIcon
                  className="mb-4 rounded-xl"
                />

                <Form.Item className="!mb-0">
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    loading={submitting || uploading}
                    className="rounded-xl font-bold h-12"
                  >
                    {uploading ? 'Uploading CV...' : submitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ApplyForm;
