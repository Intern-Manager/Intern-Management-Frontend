import React, { useState, useEffect } from 'react';
import { Card, Avatar, Descriptions, Tag, Button, Upload, Spin, Input, Form } from 'antd';
import { CameraOutlined, MailOutlined, PhoneOutlined, CalendarOutlined, SafetyCertificateOutlined, EditOutlined, SaveOutlined, UserOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { userService, UserProfile } from '../services/userService';
import { message } from 'antd';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();
  const [avatarKey, setAvatarKey] = useState(0);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await userService.getProfile(parseInt(id));
      // Update state first
      setProfile(response.data);
      // Update auth context with new avatar URL (this persists to localStorage too)
      updateUser({ avatarUrl: response.data.avatarUrl });
      // Force avatar key change to trigger re-render
      setAvatarKey(Date.now());
    } catch (error) {
      message.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const getAvatarSrc = () => {
    if (!profile?.avatarUrl) return undefined;
    // Add cache buster to force refresh after upload
    return `${profile.avatarUrl}${profile.avatarUrl.includes('?') ? '&' : '?'}_t=${Date.now()}`;
  };

  const handleAvatarChange = async (file: File) => {
    if (!id) return false;
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        await userService.updateAvatar(parseInt(id), base64);
        message.success('Avatar updated successfully');
        // Refetch profile to get the actual Cloudinary URL
        await fetchProfile();
        setUploading(false);
      };
      reader.onerror = () => {
        message.error('Failed to read file');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
        message.error('Failed to update avatar');
      setUploading(false);
    }
    return false;
  };

  const handleUpdateProfile = async (values: Partial<UserProfile>) => {
    if (!id) return;
    try {
      await userService.updateProfile(parseInt(id), values);
      message.success('Profile updated successfully');
      setEditing(false);
      fetchProfile();
    } catch (error) {
      message.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-10">Profile not found</div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-100px)]">
      {/* Profile Header Background */}
      <div
        className="rounded-2xl p-8 mb-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-2xl font-bold text-white">My Profile</h1>
          <p className="text-white/70 mt-1">Manage your personal information</p>
        </div>
      </div>

      <Card className="shadow-md rounded-2xl -mt-12 relative z-20">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center md:w-1/3">
            <div className="relative">
              <div className="w-[150px] h-[150px] rounded-full overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
                {getAvatarSrc() ? (
                  <img
                    src={getAvatarSrc()}
                    alt={profile.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserOutlined style={{ fontSize: 64, color: '#6366f1' }} />
                )}
              </div>
              <Upload
                showUploadList={false}
                beforeUpload={handleAvatarChange}
                accept="image/*"
              >
                <Button
                  type="primary"
                  shape="circle"
                  icon={<CameraOutlined />}
                  className="absolute bottom-2 right-2 shadow-md"
                  loading={uploading}
                />
              </Upload>
            </div>
            <h2 className="mt-4 mb-1 text-xl font-bold">{profile.fullName}</h2>
            <Tag color="blue" className="text-sm px-3 py-1 rounded-full">
              {profile.roleName}
            </Tag>
          </div>

          {/* Profile Info Section */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Profile Information</h3>
              {!editing ? (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => setEditing(true)}
                  className="rounded-lg"
                >
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={() => setEditing(false)} className="rounded-lg">
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={() => form.submit()}
                    className="rounded-lg"
                  >
                    Save
                  </Button>
                </div>
              )}
            </div>

            {editing ? (
              <Form
                key={profile.id}
                form={form}
                layout="vertical"
                onFinish={handleUpdateProfile}
                initialValues={profile}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item
                    label="Full Name"
                    name="fullName"
                    rules={[
                      { required: true, message: 'Please enter full name' },
                      { min: 2, message: 'Full name must be at least 2 characters' },
                      { max: 100, message: 'Full name must not exceed 100 characters' },
                      { pattern: /^[a-zA-ZÀ-ỹ\s]+$/, message: 'Full name can only contain letters and spaces' }
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item label="Email" name="email">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[
                      { pattern: /^[0-9]+$/, message: 'Phone must contain only numbers' },
                      { min: 10, message: 'Phone must be at least 10 digits' },
                      { max: 20, message: 'Phone must not exceed 20 digits' }
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </div>
              </Form>
            ) : (
              <Descriptions column={1} bordered size="small" className="bg-gray-50 rounded-xl p-4">
                <Descriptions.Item label={<><MailOutlined /> Email</>}>
                  {profile.email}
                </Descriptions.Item>
                <Descriptions.Item label={<><PhoneOutlined /> Phone</>}>
                  {profile.phone || 'Not provided'}
                </Descriptions.Item>
                <Descriptions.Item label={<><SafetyCertificateOutlined /> Status</>}>
                  <Tag color={profile.status === 'Active' ? 'success' : 'default'}>
                    {profile.status}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label={<><SafetyCertificateOutlined /> Email Verified</>}>
                  {profile.emailVerified ? (
                    <Tag color="success">Verified</Tag>
                  ) : (
                    <Tag color="warning">Not Verified</Tag>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label={<><CalendarOutlined /> Joined</>}>
                  {new Date(profile.createdAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Descriptions.Item>
                {profile.lastLogin && (
                  <Descriptions.Item label="Last Login">
                    {new Date(profile.lastLogin).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Descriptions.Item>
                )}
              </Descriptions>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
