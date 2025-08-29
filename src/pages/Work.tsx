import React from 'react';
import { Card, Table, Tag, Progress, Row, Col, Statistic } from 'antd';
import { 
  CalendarOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  UserOutlined 
} from '@ant-design/icons';
import './Work.less';

const Work: React.FC = () => {
  // 工作任务数据
  const workData = [
    {
      key: '1',
      title: '社区卫生环境整治',
      type: '环境整治',
      assignee: '张明',
      startDate: '2025-08-01',
      endDate: '2025-08-15',
      progress: 80,
      status: '进行中',
    },
    {
      key: '2',
      title: '老旧小区改造调研',
      type: '调研走访',
      assignee: '李华',
      startDate: '2025-08-05',
      endDate: '2025-08-20',
      progress: 50,
      status: '进行中',
    },
    {
      key: '3',
      title: '社区文化活动策划',
      type: '文化活动',
      assignee: '王强',
      startDate: '2025-05-25',
      endDate: '2025-08-10',
      progress: 100,
      status: '已完成',
    },
    {
      key: '4',
      title: '防汛安全排查',
      type: '安全排查',
      assignee: '刘勇',
      startDate: '2025-08-08',
      endDate: '2025-08-12',
      progress: 30,
      status: '进行中',
    },
    {
      key: '5',
      title: '志愿服务活动组织',
      type: '志愿服务',
      assignee: '张华',
      startDate: '2025-08-15',
      endDate: '2025-08-18',
      progress: 0,
      status: '待开始',
    },
  ];

  // 表格列定义
  const columns = [
    {
      title: '任务名称',
      dataIndex: 'title',
      key: 'title',
      width: '25%',
    },
    {
      title: '任务类型',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: '环境整治', value: '环境整治' },
        { text: '调研走访', value: '调研走访' },
        { text: '文化活动', value: '文化活动' },
        { text: '安全排查', value: '安全排查' },
        { text: '志愿服务', value: '志愿服务' },
      ],
      onFilter: (value: boolean | React.Key, record: any) => record.type === value,
    },
    {
      title: '负责人',
      dataIndex: 'assignee',
      key: 'assignee',
    },
    {
      title: '开始日期',
      dataIndex: 'startDate',
      key: 'startDate',
      sorter: (a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    },
    {
      title: '结束日期',
      dataIndex: 'endDate',
      key: 'endDate',
      sorter: (a: any, b: any) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: any) => (
        <Progress 
          percent={progress} 
          size="small" 
          status={progress === 100 ? 'success' : 'active'}
        />
      ),
      sorter: (a: any, b: any) => a.progress - b.progress,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: any) => {
        let color = '';
        let icon = null;
        
        switch (status) {
          case '已完成':
            color = 'success';
            icon = <CheckCircleOutlined />;
            break;
          case '进行中':
            color = 'processing';
            icon = <ClockCircleOutlined />;
            break;
          case '待开始':
            color = 'default';
            icon = <CalendarOutlined />;
            break;
          default:
            color = 'default';
        }
        
        return (
          <Tag color={color} icon={icon}>
            {status}
          </Tag>
        );
      },
      filters: [
        { text: '已完成', value: '已完成' },
        { text: '进行中', value: '进行中' },
        { text: '待开始', value: '待开始' },
      ],
      onFilter: (value: boolean | React.Key, record: any) => record.status === value,
    },
  ];

  return (
    <div className="work-container">
      <h1>工作管理</h1>
      
      <Row gutter={[16, 16]} className="stat-overview">
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="总任务数" 
              value={36} 
              prefix={<CalendarOutlined />} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="已完成" 
              value={21} 
              prefix={<CheckCircleOutlined />} 
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic 
              title="参与人员" 
              value={15} 
              prefix={<UserOutlined />} 
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="任务管理" className="work-table-card">
        <Table 
          columns={columns} 
          dataSource={workData} 
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default Work; 