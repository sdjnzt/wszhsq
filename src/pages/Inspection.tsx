import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, DatePicker, Select, Row, Col, Statistic } from 'antd';
import { FileSearchOutlined, CheckCircleOutlined, ClockCircleOutlined, WarningOutlined } from '@ant-design/icons';
import './Inspection.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface InspectionItem {
  key: string;
  id: string;
  type: string;
  location: string;
  description: string;
  inspector: string;
  date: string;
  status: string;
}

const Inspection: React.FC = () => {
  const [inspectionType, setInspectionType] = useState('all');
  
  // 巡查数据
  const inspectionData: InspectionItem[] = [
    {
      key: '1',
      id: 'XC20240612001',
      type: '安全隐患',
      location: '幸福小区3栋旁绿化带',
      description: '绿化带内发现垃圾堆放，存在安全隐患',
      inspector: '张明',
      date: '2024-06-12 09:15',
      status: '已处理',
    },
    {
      key: '2',
      id: 'XC20240610002',
      type: '环境卫生',
      location: '康乐小区垃圾站',
      description: '垃圾未及时清运，产生异味',
      inspector: '李华',
      date: '2024-06-10 15:30',
      status: '处理中',
    },
    {
      key: '3',
      id: 'XC20240608003',
      type: '基础设施',
      location: '阳光小区5栋楼下路面',
      description: '路面多处破损，影响出行安全',
      inspector: '王强',
      date: '2024-06-08 11:20',
      status: '待处理',
    },
    {
      key: '4',
      id: 'XC20240605004',
      type: '消防安全',
      location: '和谐小区2栋楼道',
      description: '楼道堆放杂物，阻碍消防通道',
      inspector: '刘勇',
      date: '2024-06-05 14:45',
      status: '已处理',
    },
  ];

  // 表格列定义
  const columns = [
    {
      title: '巡查编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '问题描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '巡查员',
      dataIndex: 'inspector',
      key: 'inspector',
    },
    {
      title: '巡查时间',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: InspectionItem, b: InspectionItem) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateA - dateB;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = '';
        let icon = null;
        
        switch (status) {
          case '已处理':
            color = 'success';
            icon = <CheckCircleOutlined />;
            break;
          case '处理中':
            color = 'processing';
            icon = <ClockCircleOutlined />;
            break;
          case '待处理':
            color = 'warning';
            icon = <WarningOutlined />;
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
        { text: '已处理', value: '已处理' },
        { text: '处理中', value: '处理中' },
        { text: '待处理', value: '待处理' },
      ],
      onFilter: (value: boolean | React.Key, record: InspectionItem) => record.status === value,
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="small">
          <Button type="link" size="small">查看</Button>
          <Button type="link" size="small">更新</Button>
        </Space>
      ),
    },
  ];

  const handleTypeChange = (value: string) => {
    setInspectionType(value);
  };

  // 统计数据
  const stats = {
    total: 568,
    completed: 432,
    processing: 87,
    pending: 49
  };

  return (
    <div className="inspection-container">
      <h1>巡查管理</h1>
      
      <Row gutter={[16, 16]} className="stat-overview">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="巡查总数" 
              value={stats.total} 
              prefix={<FileSearchOutlined />} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="已处理" 
              value={stats.completed} 
              prefix={<CheckCircleOutlined />} 
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="处理中" 
              value={stats.processing} 
              prefix={<ClockCircleOutlined />} 
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="待处理" 
              value={stats.pending} 
              prefix={<WarningOutlined />} 
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>
      
      <Card className="inspection-table-card">
        <div className="table-header">
          <div className="filter-group">
            <Space size="middle">
              <Select 
                defaultValue="all" 
                style={{ width: 120 }} 
                onChange={handleTypeChange}
                value={inspectionType}
              >
                <Option value="all">全部类型</Option>
                <Option value="safety">安全隐患</Option>
                <Option value="environment">环境卫生</Option>
                <Option value="infrastructure">基础设施</Option>
                <Option value="fire">消防安全</Option>
              </Select>
              
              <RangePicker />
            </Space>
          </div>
          
          <div className="action-group">
            <Button type="primary" icon={<FileSearchOutlined />}>新建巡查</Button>
          </div>
        </div>
        
        <Table 
          columns={columns} 
          dataSource={inspectionData} 
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default Inspection; 