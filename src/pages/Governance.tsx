import React from 'react';
import { Card, Table, Tabs, Statistic, Row, Col, Tag } from 'antd';
import { SafetyOutlined, AlertOutlined, TeamOutlined, CheckCircleOutlined } from '@ant-design/icons';
import './Governance.less';
import { desensitizePhoneNumber } from '../utils/desensitization';

const { TabPane } = Tabs;

const Governance: React.FC = () => {
  // 网格管理数据
  const gridData = [
    {
      key: '1',
      name: '第一网格',
      area: '康乐小区、幸福小区北区',
      manager: '张明',
      phone: '13812345678',
      population: 1245,
      houses: 456,
      events: 28
    },
    {
      key: '2',
      name: '第二网格',
      area: '幸福小区南区、阳光小区东区',
      manager: '李华',
      phone: '13987654321',
      population: 1653,
      houses: 589,
      events: 36
    },
    {
      key: '3',
      name: '第三网格',
      area: '阳光小区西区、和谐小区',
      manager: '王强',
      phone: '13612345678',
      population: 1824,
      houses: 630,
      events: 42
    },
    {
      key: '4',
      name: '第四网格',
      area: '丰泽园、龙湖花园',
      manager: '刘勇',
      phone: '13712345678',
      population: 1452,
      houses: 512,
      events: 25
    },
  ];

  // 表格列定义
  const gridColumns = [
    {
      title: '网格名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '管辖区域',
      dataIndex: 'area',
      key: 'area',
    },
    {
      title: '网格长',
      dataIndex: 'manager',
      key: 'manager',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      render: (text: string) => desensitizePhoneNumber(text)
    },
    {
      title: '人口数',
      dataIndex: 'population',
      key: 'population',
      sorter: (a, b) => a.population - b.population,
    },
    {
      title: '房屋数',
      dataIndex: 'houses',
      key: 'houses',
      sorter: (a, b) => a.houses - b.houses,
    },
    {
      title: '事件数',
      dataIndex: 'events',
      key: 'events',
      sorter: (a, b) => a.events - b.events,
    },
  ];

  // 安全隐患数据
  const safetyData = [
    {
      key: '1',
      type: '消防安全',
      location: '幸福小区3栋2单元',
      description: '楼道堆放杂物，影响疏散通道',
      reporter: '张明',
      date: '2024-06-10',
      status: '已解决',
    },
    {
      key: '2',
      type: '建筑安全',
      location: '阳光小区5栋外墙',
      description: '外墙瓷砖脱落，存在安全隐患',
      reporter: '李华',
      date: '2024-06-08',
      status: '处理中',
    },
    {
      key: '3',
      type: '交通安全',
      location: '康乐小区南门路口',
      description: '路灯损坏，夜间存在安全隐患',
      reporter: '王强',
      date: '2024-06-06',
      status: '已解决',
    },
    {
      key: '4',
      type: '电气安全',
      location: '和谐小区变电箱',
      description: '变电箱锁损坏，存在触电风险',
      reporter: '刘勇',
      date: '2024-06-02',
      status: '已解决',
    },
  ];

  // 安全隐患列定义
  const safetyColumns = [
    {
      title: '隐患类型',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: '消防安全', value: '消防安全' },
        { text: '建筑安全', value: '建筑安全' },
        { text: '交通安全', value: '交通安全' },
        { text: '电气安全', value: '电气安全' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: '隐患位置',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '隐患描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '上报人',
      dataIndex: 'reporter',
      key: 'reporter',
    },
    {
      title: '上报时间',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: '处理状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = status === '已解决' ? 'success' : 'processing';
        return <Tag color={color}>{status}</Tag>;
      },
      filters: [
        { text: '已解决', value: '已解决' },
        { text: '处理中', value: '处理中' },
      ],
      onFilter: (value, record) => record.status === value,
    },
  ];

  return (
    <div className="governance-container">
      <h1>综合治理</h1>
      
      <Row gutter={[16, 16]} className="stat-overview">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="网格总数" 
              value={12} 
              prefix={<TeamOutlined />} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="网格员数量" 
              value={24} 
              prefix={<TeamOutlined />} 
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="隐患排查" 
              value={152} 
              prefix={<AlertOutlined />} 
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="隐患整改" 
              value={138} 
              prefix={<CheckCircleOutlined />} 
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Card className="governance-content">
        <Tabs defaultActiveKey="1">
          <TabPane 
            tab={<span><TeamOutlined /> 网格管理</span>}
            key="1"
          >
            <Table 
              columns={gridColumns} 
              dataSource={gridData} 
              pagination={false} 
            />
          </TabPane>
          
          <TabPane 
            tab={<span><SafetyOutlined /> 安全隐患排查</span>}
            key="2"
          >
            <Table 
              columns={safetyColumns} 
              dataSource={safetyData} 
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Governance; 