import React from 'react';
import { Row, Col, Card, Statistic, Table, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './Party.less';

const Party: React.FC = () => {
  // 党员数据
  const partyMembers = [
    { 
      key: '1', 
      name: '李明', 
      gender: '男', 
      age: 45, 
      joinDate: '2005-07-01', 
      position: '党支部书记',
      status: '正常',
      grid: '第一网格' 
    },
    { 
      key: '2', 
      name: '王红', 
      gender: '女', 
      age: 42, 
      joinDate: '2007-05-01', 
      position: '组织委员',
      status: '正常',
      grid: '第二网格' 
    },
    { 
      key: '3', 
      name: '张建国', 
      gender: '男', 
      age: 55, 
      joinDate: '1998-06-01', 
      position: '普通党员',
      status: '正常',
      grid: '第三网格' 
    },
    { 
      key: '4', 
      name: '刘华', 
      gender: '男', 
      age: 38, 
      joinDate: '2010-07-01', 
      position: '宣传委员',
      status: '正常',
      grid: '第一网格' 
    },
  ];

  // 表格列定义
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '入党时间',
      dataIndex: 'joinDate',
      key: 'joinDate',
    },
    {
      title: '职务',
      dataIndex: 'position',
      key: 'position',
      render: (text: string) => (
        text === '党支部书记' ? <Tag color="red">{text}</Tag> : text
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '所属网格',
      dataIndex: 'grid',
      key: 'grid',
    },
  ];

  // 党组织活动数据
  const partyActivities = [
    { title: '党支部组织生活会', date: '2025-08-15', location: '社区党群活动中心' },
    { title: '学习贯彻十九届六中全会精神', date: '2025-05-20', location: '社区会议室' },
    { title: '主题党日活动', date: '2025-08-25', location: '社区广场' },
    { title: '党风廉政建设专题会', date: '2025-08-10', location: '社区党群活动中心' },
  ];

  return (
    <div className="party-container">
      <h1>党建管理</h1>
      
      <Row gutter={[16, 16]} className="stat-overview">
        <Col xs={24} md={8}>
          <Card>
            <Statistic 
              title="党员总数" 
              value={124} 
              prefix={<UserOutlined />} 
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic 
              title="党组织数" 
              value={8} 
              prefix={<UserOutlined />} 
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic 
              title="本月活动数" 
              value={12} 
              prefix={<UserOutlined />} 
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="content-section">
        <Col span={24}>
          <Card title="党员信息管理" className="member-table">
            <Table 
              columns={columns} 
              dataSource={partyMembers} 
              pagination={false} 
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="近期党组织活动" className="activity-list">
            <ul>
              {partyActivities.map((activity, index) => (
                <li key={index}>
                  <span className="activity-title">{activity.title}</span>
                  <span className="activity-info">
                    {activity.date} | {activity.location}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Party; 