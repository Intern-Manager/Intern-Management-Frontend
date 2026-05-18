import React, { useState, useEffect } from 'react';
import {
  Card, Row, Col, Form, Input, Button, Select, DatePicker,
  Upload, Typography, Divider, Tag, message, Space, Progress,
  Alert, Tabs, Tooltip, Spin, Modal
} from 'antd';
import type { UploadFile, RcFile } from 'antd/es/upload';
import {
  UserOutlined, SaveOutlined, EditOutlined, MailOutlined,
  PhoneOutlined, EnvironmentOutlined, BookOutlined, BankOutlined,
  CalendarOutlined, FileTextOutlined, LinkedinOutlined, GithubOutlined,
  UploadOutlined, CheckCircleOutlined, CloudUploadOutlined,
  GlobalOutlined, LockOutlined, EyeOutlined, LoadingOutlined,
  WarningOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAuth } from '../contexts/AuthContext';
import { internProfileService, InternProfileDetailDto, UpdateInternProfileRequest } from '../services/internProfileService';
import { uploadService } from '../services/uploadService';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const YEARS = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + 3 - i);

const SKILL_SUGGESTIONS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python',
  'Java', 'C#', 'Go', 'Rust', 'SQL', 'MongoDB',
  'Docker', 'AWS', 'Git', 'Figma', 'UI/UX Design',
  'Agile', 'Communication', 'Problem Solving', 'Leadership',
];

const completenessScore = (profile: Partial<InternProfileDetailDto>): number => {
  const fields = [
    !!profile.university,
    !!profile.major,
    !!profile.graduationYear,
    !!profile.educationalBackground,
    !!profile.workHistory,
    !!profile.skills,
    !!profile.cvUrl,
    !!profile.linkedinUrl,
    !!profile.githubUrl,
    !!profile.address,
  ];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
};

const completenessLabel = (score: number): { label: string; color: string } => {
  if (score >= 90) return { label: 'Excellent', color: '#10b981' };
  if (score >= 70) return { label: 'Good', color: '#f59e0b' };
  if (score >= 40) return { label: 'Incomplete', color: '#ef4444' };
  return { label: 'Get Started', color: '#6366f1' };
};

const InternProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<InternProfileDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [form] = Form.useForm();
  const [cvFileList, setCvFileList] = useState<UploadFile[]>([]);
  const [cvModalVisible, setCvModalVisible] = useState(false);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await internProfileService.getProfile(user.userId);
      setProfile(data);
      form.setFieldsValue({
        ...data,
        dateOfBirth: data.dateOfBirth ? dayjs(data.dateOfBirth) : undefined,
        graduationYear: data.graduationYear,
        skills: data.skills ? data.skills.split(',').map((s: string) => s.trim()) : undefined,
      });
      if (data.cvUrl) {
        setCvFileList([{
          uid: '-1',
          name: data.cvUrl.split('/').pop() ?? 'CV.pdf',
          status: 'done',
          url: data.cvUrl,
        }]);
      }
    } catch {
      // Profile doesn't exist yet — that's OK for new interns
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values: any) => {
    if (!user) return;
    setSaving(true);
    try {
      const payload: UpdateInternProfileRequest = {
        dateOfBirth: values.dateOfBirth?.format('YYYY-MM-DD'),
        address: values.address,
        university: values.university,
        major: values.major,
        graduationYear: values.graduationYear,
        educationalBackground: values.educationalBackground,
        workHistory: values.workHistory,
        skills: Array.isArray(values.skills) ? values.skills.join(',') : values.skills,
        cvUrl: profile?.cvUrl,
        linkedinUrl: values.linkedinUrl,
        githubUrl: values.githubUrl,
      };

      if (profile) {
        await internProfileService.update(user.userId, payload);
      } else {
        await internProfileService.create(payload);
      }

      message.success('Profile saved successfully!');
      setEditing(false);
      fetchProfile();
    } catch {
      message.error('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCvUpload = async (file: RcFile): Promise<boolean> => {
    if (!user) return false;

    const allowedTypes = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.pdf')) {
      message.error('Only PDF and Word documents are allowed');
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      message.error('File must be smaller than 10MB');
      return false;
    }

    setUploadingCv(true);
    try {
      const url = await uploadService.uploadFile(file, 'cvs');
      setProfile(prev => prev ? { ...prev, cvUrl: url } : null);
      message.success('CV uploaded successfully!');
    } catch {
      message.error('Failed to upload CV. Please try again.');
    } finally {
      setUploadingCv(false);
    }
    return false;
  };

  const handleCvRemove = () => {
    setProfile(prev => prev ? { ...prev, cvUrl: undefined } : null);
    setCvFileList([]);
  };

  const score = profile ? completenessScore(profile) : 0;
  const label = completenessLabel(score);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  const isNewProfile = !profile;

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="primary-gradient rounded-2xl p-5 text-white flex justify-between items-center shadow-lg">
        <div>
          <h1 className="text-xl font-bold mb-1 text-white">My Profile</h1>
          <p className="text-sm opacity-80">Manage your intern profile and application materials</p>
        </div>
        {!editing ? (
          <Button
            icon={<EditOutlined />}
            onClick={() => setEditing(true)}
            className="h-10 px-5 rounded-xl bg-white text-primary border-none font-bold shadow hover:scale-[1.02] transition-transform"
          >
            {isNewProfile ? 'Complete Profile' : 'Edit Profile'}
          </Button>
        ) : (
          <Space>
            <Button
              onClick={() => { setEditing(false); fetchProfile(); }}
              className="h-10 px-5 rounded-xl bg-white/20 text-white border-white/30 font-bold hover:bg-white/30"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => form.submit()}
              loading={saving}
              className="h-10 px-5 rounded-xl font-bold shadow"
            >
              Save Changes
            </Button>
          </Space>
        )}
      </div>

      {/* Profile Completion Banner */}
      <Card className="rounded-2xl shadow-sm" styles={{ body: { padding: 0 } }}>
        <div className="flex items-center gap-5 p-5">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Text strong>Profile Completeness</Text>
                <Tag color={label.color === '#10b981' ? 'success' : label.color === '#f59e0b' ? 'warning' : 'error'} className="rounded-full">
                  {label.label}
                </Tag>
              </div>
              <Text strong className="text-primary">{score}%</Text>
            </div>
            <Progress
              percent={score}
              showInfo={false}
              strokeColor={label.color}
              railColor="#f1f5f9"
              size={10}
              className="rounded-full [&_.ant-progress-inner]:!rounded-full"
            />
            {score < 70 && (
              <Text type="secondary" className="text-xs mt-1 block">
                Complete your profile to increase visibility with mentors and coordinators
              </Text>
            )}
          </div>
          {score === 100 && (
            <div className="text-center px-6 border-l border-gray-100">
              <CheckCircleOutlined style={{ fontSize: 32, color: '#10b981' }} />
              <div className="text-green-600 font-bold text-sm mt-1">All Done!</div>
            </div>
          )}
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        {/* Left Column */}
        <Col xs={24} lg={16}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className="glass-card rounded-2xl [&_.ant-tabs-nav]:px-6"
            tabBarStyle={{ marginBottom: 0 }}
            size="large"
            items={[
              {
                key: 'personal',
                label: <span className="flex items-center gap-1"><UserOutlined />Personal</span>,
                children: (
                  <div className="px-6 pb-6">
                    <Form form={form} layout="vertical" onFinish={handleSave} disabled={!editing}>
                      <Row gutter={16}>
                        <Col xs={24} sm={12}>
                          <Form.Item name="address" label="Address">
                            <Input prefix={<EnvironmentOutlined className="text-gray-400" />} placeholder="123 Nguyen Hue, District 1, HCMC" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Form.Item name="dateOfBirth" label="Date of Birth">
                            <DatePicker className="w-full" placeholder="Select date" />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Divider>Professional Links</Divider>

                      <Row gutter={16}>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            name="githubUrl"
                            label={<><GithubOutlined /> GitHub URL</>}
                            rules={[
                              {
                                type: 'url',
                                message: 'Please enter a valid URL',
                              }
                            ]}
                          >
                            <Input
                              prefix={<GithubOutlined className="text-gray-400" />}
                              placeholder="https://github.com/yourusername"
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            name="linkedinUrl"
                            label={<><LinkedinOutlined /> LinkedIn URL</>}
                            rules={[
                              {
                                type: 'url',
                                message: 'Please enter a valid URL',
                              }
                            ]}
                          >
                            <Input
                              prefix={<LinkedinOutlined className="text-gray-400" />}
                              placeholder="https://linkedin.com/in/yourprofile"
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                ),
              },
              {
                key: 'education',
                label: <span className="flex items-center gap-1"><BookOutlined />Education</span>,
                children: (
                  <div className="px-6 pb-6">
                    <Form form={form} layout="vertical" onFinish={handleSave} disabled={!editing}>
                      <Row gutter={16}>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            name="university"
                            label={<><BankOutlined /> University</>}
                            rules={[{ required: activeTab === 'education', message: 'University is required' }]}
                          >
                            <Input prefix={<GlobalOutlined className="text-gray-400" />} placeholder="University of Science" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Form.Item name="major" label="Major / Field of Study">
                            <Input prefix={<BookOutlined className="text-gray-400" />} placeholder="Computer Science" />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={16}>
                        <Col xs={24} sm={12}>
                          <Form.Item name="graduationYear" label="Expected Graduation Year">
                            <Select placeholder="Select year" allowClear>
                              {YEARS.map(y => <Option key={y} value={y}>{y}</Option>)}
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>

                      <Form.Item name="educationalBackground" label="Educational Background">
                        <TextArea
                          rows={4}
                          placeholder="Describe your academic background, notable projects, coursework..."
                          showCount maxLength={1024}
                        />
                      </Form.Item>
                    </Form>
                  </div>
                ),
              },
              {
                key: 'experience',
                label: <span className="flex items-center gap-1"><FileTextOutlined />Experience</span>,
                children: (
                  <div className="px-6 pb-6">
                    <Form form={form} layout="vertical" onFinish={handleSave} disabled={!editing}>
                      <Form.Item name="workHistory" label="Work History">
                        <TextArea
                          rows={5}
                          placeholder="Describe your previous work experience, internships, projects..."
                          showCount maxLength={2048}
                        />
                      </Form.Item>

                      <Form.Item
                        name="skills"
                        label="Skills & Technologies"
                        extra="Separate skills with commas. Examples: React, Python, Figma, Communication"
                      >
                        <Select
                          mode="tags"
                          placeholder="Type skills and press Enter..."
                          tokenSeparators={[',']}
                          notFoundContent={null}
                          options={SKILL_SUGGESTIONS.filter(s =>
                            !form.getFieldValue('skills')?.includes(s)
                          ).map(s => ({ label: s, value: s }))}
                        />
                      </Form.Item>
                    </Form>
                  </div>
                ),
              },
              {
                key: 'documents',
                label: <span className="flex items-center gap-1"><FileTextOutlined />Documents</span>,
                children: (
                  <div className="px-6 pb-6">
                    <Form form={form} layout="vertical" onFinish={handleSave} disabled={!editing}>
                      <Form.Item label="Resume / CV">
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center bg-gray-50/50 hover:bg-gray-50 transition-colors">
                          {profile?.cvUrl ? (
                            <div className="space-y-3">
                              <div className="flex items-center justify-center gap-3">
                                <CheckCircleOutlined style={{ fontSize: 32 }} />
                                <div>
                                  <Text strong className="block text-green-700">CV Uploaded</Text>
                                  <Space size="small">
                                    <Button
                                      type="link"
                                      onClick={() => setCvModalVisible(true)}
                                      className="text-xs text-primary hover:underline p-0 h-auto"
                                    >
                                      View
                                    </Button>
                                    <Button
                                      type="link"
                                      onClick={() => {
                                        const downloadUrl = profile.cvUrl!.replace('/upload/', '/upload/fl_attachment/');
                                        window.open(downloadUrl, '_blank');
                                      }}
                                      className="text-xs text-primary hover:underline p-0 h-auto"
                                    >
                                      Download
                                    </Button>
                                  </Space>
                                </div>
                              </div>
                              <Button
                                danger
                                size="small"
                                onClick={handleCvRemove}
                                disabled={!editing}
                              >
                                Remove CV
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <CloudUploadOutlined style={{ fontSize: 40, color: '#6366f1' }} />
                              <Text strong className="block">Upload your resume</Text>
                              <Text type="secondary" className="block text-xs">
                                PDF or Word document, max 10MB
                              </Text>
                              <Upload
                                fileList={[]}
                                beforeUpload={handleCvUpload}
                                showUploadList={false}
                                disabled={!editing || uploadingCv}
                                accept=".pdf,.doc,.docx"
                              >
                                <Button
                                  type="primary"
                                  icon={uploadingCv ? <LoadingOutlined /> : <UploadOutlined />}
                                  loading={uploadingCv}
                                  className="rounded-xl mt-2 font-bold"
                                >
                                  {uploadingCv ? 'Uploading...' : 'Choose File'}
                                </Button>
                              </Upload>
                            </div>
                          )}
                        </div>
                      </Form.Item>

                      {profile?.cvUrl && editing && (
                        <Form.Item>
                          <Upload
                            fileList={cvFileList}
                            beforeUpload={handleCvUpload}
                            onRemove={handleCvRemove}
                            disabled={uploadingCv}
                            accept=".pdf,.doc,.docx"
                          >
                            <Button icon={<UploadOutlined />} loading={uploadingCv}>
                              Replace CV
                            </Button>
                          </Upload>
                        </Form.Item>
                      )}

                      <Alert
                        title="Your CV helps mentors and coordinators learn more about your background. Only PDF and Word documents are accepted."
                        type="info"
                        showIcon
                        className="rounded-xl mt-2"
                      />
                    </Form>
                  </div>
                ),
              },
            ]}
          />
        </Col>

        {/* Right Column - Profile Summary */}
        <Col xs={24} lg={8}>
          <Card className="rounded-2xl shadow-sm mb-4" styles={{ body: { padding: '20px' } }}>
            <div className="text-center mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
                <UserOutlined style={{ fontSize: 36, color: 'white' }} />
              </div>
              <Title level={4} className="!mb-1">{user?.fullName}</Title>
              <Text type="secondary">{user?.email}</Text>
            </div>

            <Divider className="!my-4" />

            <div className="space-y-3">
              {[
                { icon: <MailOutlined />, label: 'Email', value: user?.email, show: true },
                { icon: <EnvironmentOutlined />, label: 'Address', value: profile?.address, show: !!profile?.address },
                { icon: <BookOutlined />, label: 'University', value: profile?.university, show: !!profile?.university },
                { icon: <BankOutlined />, label: 'Major', value: profile?.major, show: !!profile?.major },
                { icon: <GithubOutlined />, label: 'GitHub', value: profile?.githubUrl, show: !!profile?.githubUrl, href: profile?.githubUrl },
                { icon: <LinkedinOutlined />, label: 'LinkedIn', value: profile?.linkedinUrl, show: !!profile?.linkedinUrl, href: profile?.linkedinUrl },
              ].map((item, i) => (
                item.show ? (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-primary">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Text type="secondary" className="text-xs block">{item.label}</Text>
                      {item.href ? (
                        <a href={item.href} target="_blank" rel="noreferrer"
                          className="text-sm text-primary hover:underline truncate block">
                          {item.value}
                        </a>
                      ) : (
                        <Text className="text-sm truncate block">{item.value ?? '—'}</Text>
                      )}
                    </div>
                  </div>
                ) : null
              ))}
            </div>

            {profile?.skills && (
              <>
                <Divider className="!my-4" />
                <Text type="secondary" className="text-xs font-bold uppercase tracking-wider">Skills</Text>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {profile.skills.split(',').map((skill, i) => (
                    <Tag key={i} color="blue" className="rounded-full text-xs">{skill.trim()}</Tag>
                  ))}
                </div>
              </>
            )}
          </Card>

          {/* Quick Checklist */}
          <Card
            title={<Text strong className="text-sm">Profile Checklist</Text>}
            className="rounded-2xl shadow-sm"
            styles={{ body: { padding: '16px' } }}
          >
            <div className="space-y-2.5">
              {[
                { label: 'Personal information', done: !!profile?.address },
                { label: 'University & Major', done: !!(profile?.university && profile?.major) },
                { label: 'Graduation year', done: !!profile?.graduationYear },
                { label: 'Educational background', done: !!profile?.educationalBackground },
                { label: 'Work history', done: !!profile?.workHistory },
                { label: 'Skills listed', done: !!profile?.skills },
                { label: 'CV uploaded', done: !!profile?.cvUrl },
                { label: 'GitHub linked', done: !!profile?.githubUrl },
                { label: 'LinkedIn linked', done: !!profile?.linkedinUrl },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  {item.done ? (
                    <CheckCircleOutlined style={{ color: '#10b981', fontSize: 14 }} />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300" />
                  )}
                  <Text type={item.done ? undefined : 'secondary'} className={`text-xs ${item.done ? '' : 'opacity-60'}`}>
                    {item.label}
                  </Text>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* CV Viewer Modal */}
      <Modal
        title="CV Preview"
        open={cvModalVisible}
        onCancel={() => setCvModalVisible(false)}
        footer={null}
        width={800}
        bodyStyle={{ height: '70vh', padding: 0 }}
      >
        {profile?.cvUrl && (
          <iframe
            src={profile.cvUrl}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="CV Preview"
          />
        )}
      </Modal>
    </div>
  );
};

export default InternProfilePage;
