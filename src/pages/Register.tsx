import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Divider, Select } from 'antd';
import useApp from 'antd/es/app/useApp';
import { MailOutlined, LockOutlined, UserOutlined, PhoneOutlined, LoginOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

const Register = () => {
  const { message } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    roleId?: number;
  }) => {
    setLoading(true);
    try {
      await authService.register({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        phone: values.phone,
        roleId: values.roleId ?? 5,
      });
      message.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = error.response?.data?.message ?? error.message ?? 'Registration failed.';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-login-gradient min-h-screen flex flex-col justify-between overflow-hidden">
      <header className="p-[32px]">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-white shadow-lg">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              school
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-2xl text-primary leading-none">
              IMS System
            </span>
            <span className="text-[10px] text-gray-500 tracking-wider uppercase">
              Enterprise Edition
            </span>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-6">
        <div className="glass-card w-full max-w-[520px] p-10 rounded-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#3525cd]/10 blur-3xl rounded-full"></div>

          <div className="relative z-10">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
              <p className="text-gray-500">Join InternHub IMS today</p>
            </div>

            <Form
              name="register"
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
              size="large"
              initialValues={{ roleId: 5 }}
            >
              <Form.Item
                label="Full Name"
                name="fullName"
                rules={[
                  { required: true, message: 'Please input your full name!' },
                  { min: 2, message: 'Name must be at least 2 characters!' },
                  { max: 100, message: 'Name must not exceed 100 characters!' },
                  { pattern: /^[a-zA-ZÀ-ỹ\s]+$/, message: 'Name can only contain letters and spaces!' }
                ]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="John Doe"
                  className="rounded-xl py-3"
                />
              </Form.Item>

              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="name@gmail.com"
                  className="rounded-xl py-3"
                />
              </Form.Item>

              <Form.Item
                label="Phone Number"
                name="phone"
                rules={[
                  { pattern: /^[0-9]{10,20}$/, message: 'Phone must be 10-20 digits, numbers only!' }
                ]}
              >
                <Input
                  prefix={<PhoneOutlined className="text-gray-400" />}
                  placeholder="0123456789"
                  className="rounded-xl py-3"
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: 'Please input your password!' },
                  { min: 6, message: 'Password must be at least 6 characters!' },
                  { max: 100, message: 'Password must not exceed 100 characters!' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="••••••••"
                  className="rounded-xl py-3"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm your password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="••••••••"
                  className="rounded-xl py-3"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <Form.Item
                label="Role"
                name="roleId"
                tooltip="Select your role in the organization"
              >
                <Select
                  size="large"
                  className="rounded-xl"
                  options={[
                    { label: 'Intern', value: 5 },
                    { label: 'Mentor', value: 4 },
                    { label: 'Coordinator', value: 3 },
                    { label: 'HR Manager', value: 2 },
                    { label: 'Admin', value: 1 },
                  ]}
                />
              </Form.Item>

              <Form.Item name="terms" valuePropName="checked">
                <Checkbox>
                  I agree to the{' '}
                  <a href="#" className="text-primary hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </Checkbox>
              </Form.Item>

              <Form.Item valuePropName="checked">
                <Checkbox>I want to receive updates and notifications</Checkbox>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full h-[54px] rounded-xl text-lg font-bold shadow-lg shadow-[#3525cd]/20"
                  icon={<LoginOutlined />}
                  loading={loading}
                >
                  Create Account
                </Button>
              </Form.Item>
            </Form>

            <Divider plain className="text-gray-400 text-[10px] uppercase tracking-widest my-6">
              Already have an account?
            </Divider>

            <div className="text-center">
              <Link to="/login">
                <Button
                  size="large"
                  className="w-full h-[50px] rounded-xl flex items-center justify-center gap-2 border-primary text-primary hover:bg-primary/5 transition-all font-semibold"
                >
                  Sign In Instead
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-[32px] flex flex-col md:flex-row justify-between items-center gap-4 border-t border-gray-100 bg-white/30 backdrop-blur-sm">
        <div className="text-gray-500 text-xs">
          © 2024 IMS Portal Enterprise Edition. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <a className="text-gray-500 text-xs hover:text-primary transition-colors" href="#">
            Privacy Policy
          </a>
          <a className="text-gray-500 text-xs hover:text-primary transition-colors" href="#">
            Terms of Service
          </a>
          <a className="flex items-center gap-1 text-primary text-xs hover:underline" href="#">
            <span className="material-symbols-outlined text-[16px]">help</span>
            Support Center
          </a>
        </div>
      </footer>

      <div className="fixed top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-[#3525cd]/5 blur-[120px] -z-10"></div>
      <div className="fixed bottom-[-10%] left-[-5%] w-[30vw] h-[30vw] rounded-full bg-[#acedff]/5 blur-[120px] -z-10"></div>
    </div>
  );
};

export default Register;
