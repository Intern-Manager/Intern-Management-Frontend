import React from 'react';
import { Form, Input, Button, Checkbox, Divider, message } from 'antd';
import { MailOutlined, LockOutlined, LoginOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log('Success:', values);
    message.success('Login successful!');
    navigate('/dashboard');
  };

  return (
    <div className="bg-login-gradient min-h-screen flex flex-col justify-between overflow-hidden">
      {/* Header / Brand Section */}
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

      {/* Main Login Content */}
      <main className="flex-grow flex items-center justify-center px-6">
        <div className="glass-card w-full max-w-[480px] p-10 rounded-2xl relative overflow-hidden">
          {/* Subtle background accent inside card */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#3525cd]/10 blur-3xl rounded-full"></div>

          <div className="relative z-10">
            <div className="mb-10 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              {/* <p className="text-gray-500">
                Access your dashboard to manage mentorship and recruitment operations.
              </p> */}
            </div>

            <Form
              name="login"
              layout="vertical"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              requiredMark={false}
              size="large"
            >
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
                label={
                  <div className="flex justify-between w-full items-center">
                    <span>Password  </span>
                    <br></br>
                    <a className="text-xs text-primary hover:underline font-medium" href="#">
                      Forgot password?
                    </a>
                  </div>
                }
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="••••••••"
                  className="rounded-xl py-3"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <Form.Item name="remember" valuePropName="checked">
                <Checkbox className="text-gray-500">Stay signed in for 30 days</Checkbox>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full h-[54px] rounded-xl text-lg font-bold shadow-lg shadow-[#3525cd]/20"
                  icon={<LoginOutlined />}
                >
                  Sign In
                </Button>
              </Form.Item>
            </Form>

            <Divider plain className="text-gray-400 text-[10px] uppercase tracking-widest my-8">
              Or login with
            </Divider>

            <div className="grid grid-cols-2 gap-4">
              <Button
                className="h-[50px] rounded-xl flex items-center justify-center gap-2 hover:border-primary transition-all"
                icon={<img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlmuNmIs4PoznjLNGea-t6jKVOs0FuWCxPDmgbdg4je-Z5yJRSHPARyqqhbE5BkE_HMv6KxMB7Wxbqi4WsIFNiGLac6b4lFXabuqUwpirdEHHD976l44IZYJcFu9an0xAyLBmXBNxwXDB664OhvuYxvF7XStMhK47XUz6DZ9p32qcyoXUMsilO63NLRsb3iROPNtLpyJg8k33ZdmFDMAKS_U_yWDK81QSX8ihROO9uc4a_bsS3MkimxLPwVb8L0LRZOF8z9JskqEY" className="w-4 h-4" alt="MS" />}
              >
                Microsoft
              </Button>
              <Button
                className="h-[50px] rounded-xl flex items-center justify-center gap-2 hover:border-primary transition-all"
                icon={<img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFxz8H_RF1AAmYWLjLwMsKjW-tinWiYSpSYh6ZWAZF37BxytzfeQW4GXRANsnDHdnJ0WAIleR8TdBAPWy9lu-TmvkpiiJc04csVnRMxL276ujE_5olaEiMZpmE9DwBOmThWX8uCmfedL59YSjcCQrovezySQ40hooGQ21LRrOqlk4YcD3mnKaOqNVlyISZgEwV80Gk1EoVlB4vJrURVFBveyvQFy7usn2NEZX-7WuUzn4szup0If1Zg0WIISnU9vGKERGYQioYFMA" className="w-4 h-4" alt="Google" />}
              >
                Google
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Content */}
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

      {/* Decorative background elements */}
      <div className="fixed top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-[#3525cd]/5 blur-[120px] -z-10"></div>
      <div className="fixed bottom-[-10%] left-[-5%] w-[30vw] h-[30vw] rounded-full bg-[#acedff]/5 blur-[120px] -z-10"></div>
    </div>
  );
};

export default Login;