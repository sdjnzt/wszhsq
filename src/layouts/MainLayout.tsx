import React, { useState } from 'react';
import { Layout, Menu, Dropdown, Avatar, message } from 'antd';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import {
  HomeOutlined,
  TeamOutlined,
  HeartOutlined,
  SafetyOutlined,
  BankOutlined,
  FundOutlined,
  ScheduleOutlined,
  AlertOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  MedicineBoxOutlined,
  IdcardOutlined,
  FileTextOutlined,
  ClusterOutlined,
  UserOutlined,
  UserSwitchOutlined,
  UsergroupAddOutlined,
  ApartmentOutlined,
  VideoCameraOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import './MainLayout.less';

const { Header, Sider, Content, Footer } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const currentPath = location.pathname === '/' ? '/' : '/' + location.pathname.split('/')[1];

  // 退出登录
  const handleLogout = () => {
    logout();
    message.success('已退出登录');
    navigate('/login');
  };

  // 用户菜单项
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  const menuItems = [
    // {
    //   key: '/',
    //   icon: <HomeOutlined />,
    //   label: <Link to="/">首页</Link>,
    // },
    {
      key: '/grid',
      icon: <AppstoreOutlined />,
      label: <Link to="grid">网格管理</Link>,
    },
    {
      key: '/population',
      icon: <TeamOutlined />,
      label: <Link to="population">人口管理</Link>,
    },
    {
      key: '/housing',
      icon: <HomeOutlined />,
      label: <Link to="housing">房屋管理</Link>,
    },
    {
      key: '/elderly',
      icon: <MedicineBoxOutlined />,
      label: '智慧养老',
      children: [
        {
          key: '/elderly/info',
          icon: <UserOutlined />,
          label: <Link to="elderly/info">老人信息</Link>,
        },
        {
          key: '/elderly/health',
          icon: <IdcardOutlined />,
          label: <Link to="elderly/health">健康档案</Link>,
        },
        {
          key: '/elderly/service',
          icon: <FileTextOutlined />,
          label: <Link to="elderly/service">服务档案</Link>,
        },
        {
          key: '/elderly/institution',
          icon: <ClusterOutlined />,
          label: <Link to="elderly/institution">养老机构管理</Link>,
        },
      ],
    },
    {
      key: '/party',
      icon: <BankOutlined />,
      label: '党建引领',
      children: [
        {
          key: '/party/member',
          icon: <UserOutlined />,
          label: <Link to="party/member">党员管理</Link>,
        },
        {
          key: '/party/position',
          icon: <UserSwitchOutlined />,
          label: <Link to="party/position">党员认岗</Link>,
        },
        {
          key: '/party/household',
          icon: <UsergroupAddOutlined />,
          label: <Link to="party/household">党员联户</Link>,
        },
        {
          key: '/party/organization',
          icon: <ApartmentOutlined />,
          label: <Link to="party/organization">党组织管理</Link>,
        },
      ],
    },
    {
      key: '/video',
      icon: <VideoCameraOutlined />,
      label: <Link to="video">视频监控</Link>,
    },
    // {
    //   key: '/vehicle',
    //   icon: <CarOutlined />,
    //   label: <Link to="vehicle">车辆管理</Link>,
    // },
    {
      key: '/service',
      icon: <HeartOutlined />,
      label: <Link to="service">便民服务</Link>,
    },
    {
      key: '/property',
      icon: <HomeOutlined />,
      label: <Link to="property">物业管理</Link>,
    },
    {
      key: '/inspection',
      icon: <SafetyOutlined />,
      label: <Link to="inspection">巡查管理</Link>,
    },
    {
      key: '/governance',
      icon: <FundOutlined />,
      label: <Link to="governance">综治管理</Link>,
    },
    {
      key: '/work',
      icon: <ScheduleOutlined />,
      label: <Link to="work">工作管理</Link>,
    },
    {
      key: '/event',
      icon: <AlertOutlined />,
      label: <Link to="event">事件管理</Link>,
    },
  ];

  return (
    <Layout className="main-layout">
      <Header className="site-layout-header" style={{ width: `calc(100% - ${collapsed ? 80 : 220}px)`, height: '48px', lineHeight: '48px' }}>
        <div className="header-content">
          <div className="header-left">
            <UnorderedListOutlined className="trigger" onClick={() => setCollapsed(!collapsed)} />
            <div className="header-title">汶上县中都街道办事处智慧社区平台</div>
          </div>
          <div className="header-right">
            {user && (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
                <div className="user-info">
                  <Avatar src={user.avatar} size="small" />
                  <span className="user-name">{user.name}</span>
                  <span className="user-role">{user.role}</span>
                </div>
              </Dropdown>
            )}
          </div>
        </div>
      </Header>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        trigger={null}
        theme="dark"
        className="main-sider"
        width={220}
      >
        <div className="logo">
          <h2>{collapsed ? "智社" : "智慧社区平台"}</h2>
        </div>
        <Menu 
          theme="dark" 
          selectedKeys={[currentPath]} 
          mode="inline"
          items={menuItems}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 220, transition: 'all 0.3s' }}>
        <Content className="site-layout-content">
          <div className="content-container">
            <Outlet />
          </div>
        </Content>
        <Footer className="site-footer">
          智慧社区智能化建设项目 ©2024
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 