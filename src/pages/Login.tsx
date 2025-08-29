import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import './Login.less';

interface LoginForm {
  username: string;
  password: string;
  remember: boolean;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login } = useUser();

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    try {
      // 模拟登录请求
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 这里可以添加实际的登录逻辑
      if (values.username === 'admin' && values.password === 'admin123') {
        // 模拟用户数据
        const userData = {
          id: '1',
          name: '管理员',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
          role: '系统管理员',
          email: 'admin@example.com'
        };
        
        login(userData);
        message.success('登录成功！');
        // 登录成功后的跳转逻辑
        navigate('/dashboard');
      } else {
        message.error('用户名或密码错误！');
      }
    } catch {
      message.error('登录失败，请重试！');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-overlay"></div>
      </div>
      
      <div className="login-content">
        <div className="login-header">
          <div className="logo-container">
            <SafetyCertificateOutlined className="logo-icon" />
            <h1 className="platform-title">智慧社区平台</h1>
          </div>
          <p className="platform-subtitle">汶上县中都街道办事处</p>
        </div>

        <Card className="login-card" bordered={false}>
          <div className="login-form-header">
            <h2>用户登录</h2>
            <p>请输入您的账号信息</p>
          </div>

          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
            initialValues={{ remember: true }}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: '请输入用户名！' },
                { min: 3, message: '用户名至少3个字符！' }
              ]}
            >
              <Input
                prefix={<UserOutlined className="input-icon" />}
                placeholder="请输入用户名"
                className="login-input"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码！' },
                { min: 6, message: '密码至少6个字符！' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="input-icon" />}
                placeholder="请输入密码"
                className="login-input"
              />
            </Form.Item>

            <Form.Item>
              <div className="login-options">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>记住我</Checkbox>
                </Form.Item>
                <a className="forgot-password" href="#forgot">
                  忘记密码？
                </a>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-button"
                loading={loading}
                block
              >
                {loading ? '登录中...' : '登录'}
              </Button>
            </Form.Item>


          </Form>
        </Card>

        <div className="login-footer">
          <p>© 2025 汶上县中都街道办事处智慧社区平台. All rights reserved.</p>
          <p>技术支持：智慧社区建设团队</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
