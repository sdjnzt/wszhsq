import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Form, 
  Input, 
  Button, 
  Select, 
  Switch, 
  Table, 
  Tag, 
  Space, 
  message, 
  Modal, 
  Descriptions, 
  Timeline, 
  Progress, 
  Alert,
  Tabs,
  Divider,
  Typography
} from 'antd';
import { 
  ApiOutlined, 
  SyncOutlined, 
  CheckCircleOutlined, 
  ExclamationCircleOutlined, 
  SettingOutlined,
  DatabaseOutlined,
  SafetyCertificateOutlined,
  MonitorOutlined,
  HistoryOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import './GovernmentSystem.less';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface ApiConfig {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  status: 'active' | 'inactive' | 'error';
  lastTest: string;
  responseTime: number;
  successRate: number;
}

interface SyncRecord {
  id: string;
  system: string;
  type: 'full' | 'incremental' | 'differential';
  status: 'success' | 'running' | 'failed';
  startTime: string;
  endTime?: string;
  recordsCount: number;
  errorMessage?: string;
}

interface TestResult {
  id: string;
  apiName: string;
  testTime: string;
  status: 'success' | 'failed';
  responseTime: number;
  responseSize: number;
  errorMessage?: string;
}

const GovernmentSystem: React.FC = () => {
  const [apiConfigs, setApiConfigs] = useState<ApiConfig[]>([
    {
      id: '1',
      name: '人口信息查询接口',
      url: 'https://api.gov.cn/population/query',
      method: 'GET',
      status: 'active',
      lastTest: '2025-08-15 14:30:00',
      responseTime: 120,
      successRate: 98.5
    },
    {
      id: '2',
      name: '房屋信息同步接口',
      url: 'https://api.gov.cn/housing/sync',
      method: 'POST',
      status: 'active',
      lastTest: '2025-08-15 14:25:00',
      responseTime: 350,
      successRate: 95.2
    },
    {
      id: '3',
      name: '事件上报接口',
      url: 'https://api.gov.cn/event/report',
      method: 'POST',
      status: 'active',
      lastTest: '2025-08-15 14:20:00',
      responseTime: 200,
      successRate: 99.1
    },
    {
      id: '4',
      name: '网格信息查询接口',
      url: 'https://api.gov.cn/grid/query',
      method: 'GET',
      status: 'inactive',
      lastTest: '2025-08-15 14:15:00',
      responseTime: 0,
      successRate: 0
    }
  ]);

  const [syncRecords, setSyncRecords] = useState<SyncRecord[]>([
    {
      id: '1',
      system: '人口管理系统',
      type: 'incremental',
      status: 'success',
      startTime: '2025-08-15 14:00:00',
      endTime: '2025-08-15 14:05:00',
      recordsCount: 1250
    },
    {
      id: '2',
      system: '房屋管理系统',
      type: 'full',
      status: 'running',
      startTime: '2025-08-15 13:30:00',
      recordsCount: 0
    },
    {
      id: '3',
      system: '事件管理系统',
      type: 'differential',
      status: 'failed',
      startTime: '2025-08-15 13:00:00',
      endTime: '2025-08-15 13:02:00',
      recordsCount: 0,
      errorMessage: '网络连接超时'
    }
  ]);

  const [testResults, setTestResults] = useState<TestResult[]>([
    {
      id: '1',
      apiName: '人口信息查询接口',
      testTime: '2025-08-15 14:30:00',
      status: 'success',
      responseTime: 120,
      responseSize: 2048
    },
    {
      id: '2',
      apiName: '房屋信息同步接口',
      testTime: '2025-08-15 14:25:00',
      status: 'success',
      responseTime: 350,
      responseSize: 5120
    },
    {
      id: '3',
      apiName: '事件上报接口',
      testTime: '2025-08-15 14:20:00',
      status: 'failed',
      responseTime: 5000,
      responseSize: 0,
      errorMessage: '请求超时'
    }
  ]);

  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [testModalVisible, setTestModalVisible] = useState(false);
  const [selectedApi, setSelectedApi] = useState<ApiConfig | null>(null);
  const [configForm] = Form.useForm();
  const [testForm] = Form.useForm();

  // API配置列定义
  const apiColumns = [
    {
      title: '接口名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: ApiConfig) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.url}</div>
        </div>
      )
    },
    {
      title: '请求方法',
      dataIndex: 'method',
      key: 'method',
      render: (method: string) => {
        const colorMap = {
          GET: 'green',
          POST: 'blue',
          PUT: 'orange',
          DELETE: 'red'
        };
        return <Tag color={colorMap[method as keyof typeof colorMap]}>{method}</Tag>;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          active: { color: 'green', text: '正常', icon: <CheckCircleOutlined /> },
          inactive: { color: 'default', text: '停用', icon: <ExclamationCircleOutlined /> },
          error: { color: 'red', text: '异常', icon: <ExclamationCircleOutlined /> }
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      }
    },
    {
      title: '响应时间',
      dataIndex: 'responseTime',
      key: 'responseTime',
      render: (time: number) => (
        <span style={{ color: time < 200 ? '#52c41a' : time < 500 ? '#fa8c16' : '#ff4d4f' }}>
          {time}ms
        </span>
      )
    },
    {
      title: '成功率',
      dataIndex: 'successRate',
      key: 'successRate',
      render: (rate: number) => (
        <Progress 
          percent={rate} 
          size="small" 
          status={rate >= 95 ? 'success' : rate >= 80 ? 'normal' : 'exception'}
          format={(percent) => `${percent}%`}
        />
      )
    },
    {
      title: '最后测试',
      dataIndex: 'lastTest',
      key: 'lastTest',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ApiConfig) => (
        <Space size="middle">
          <Button 
            type="primary" 
            size="small" 
            icon={<MonitorOutlined />}
            onClick={() => handleTestApi(record)}
          >
            测试
          </Button>
          <Button 
            size="small" 
            icon={<SettingOutlined />}
            onClick={() => handleEditConfig(record)}
          >
            配置
          </Button>
        </Space>
      ),
    },
  ];

  // 同步记录列定义
  const syncColumns = [
    {
      title: '系统名称',
      dataIndex: 'system',
      key: 'system',
    },
    {
      title: '同步类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeConfig = {
          full: { color: 'blue', text: '全量同步' },
          incremental: { color: 'green', text: '增量同步' },
          differential: { color: 'orange', text: '差异同步' }
        };
        const config = typeConfig[type as keyof typeof typeConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          success: { color: 'green', text: '成功', icon: <CheckCircleOutlined /> },
          running: { color: 'blue', text: '进行中', icon: <SyncOutlined spin /> },
          failed: { color: 'red', text: '失败', icon: <ExclamationCircleOutlined /> }
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      }
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (time: string | undefined) => time || '-'
    },
    {
      title: '记录数量',
      dataIndex: 'recordsCount',
      key: 'recordsCount',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: SyncRecord) => (
        <Space size="middle">
          {record.status === 'failed' && (
            <Button 
              type="primary" 
              size="small" 
              onClick={() => handleRetrySync(record)}
            >
              重试
            </Button>
          )}
          <Button 
            size="small" 
            onClick={() => handleViewSyncDetail(record)}
          >
            详情
          </Button>
        </Space>
      ),
    },
  ];

  // 测试结果列定义
  const testColumns = [
    {
      title: '接口名称',
      dataIndex: 'apiName',
      key: 'apiName',
    },
    {
      title: '测试时间',
      dataIndex: 'testTime',
      key: 'testTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'success' ? 'green' : 'red'}>
          {status === 'success' ? '成功' : '失败'}
        </Tag>
      )
    },
    {
      title: '响应时间',
      dataIndex: 'responseTime',
      key: 'responseTime',
      render: (time: number) => (
        <span style={{ color: time < 200 ? '#52c41a' : time < 500 ? '#fa8c16' : '#ff4d4f' }}>
          {time}ms
        </span>
      )
    },
    {
      title: '响应大小',
      dataIndex: 'responseSize',
      key: 'responseSize',
      render: (size: number) => `${(size / 1024).toFixed(1)}KB`
    },
    {
      title: '错误信息',
      dataIndex: 'errorMessage',
      key: 'errorMessage',
      render: (error: string | undefined) => error || '-'
    }
  ];

  // 测试API接口
  const handleTestApi = (api: ApiConfig) => {
    setSelectedApi(api);
    setTestModalVisible(true);
    testForm.setFieldsValue({
      apiName: api.name,
      url: api.url,
      method: api.method
    });
  };

  // 编辑API配置
  const handleEditConfig = (api: ApiConfig) => {
    setSelectedApi(api);
    setConfigModalVisible(true);
    configForm.setFieldsValue(api);
  };

  // 重试同步
  const handleRetrySync = (record: SyncRecord) => {
    message.loading(`正在重试 ${record.system} 同步...`, 2);
    setTimeout(() => {
      message.success(`${record.system} 同步重试成功`);
      // 更新同步状态
      setSyncRecords(prev => prev.map(item => 
        item.id === record.id 
          ? { ...item, status: 'success', endTime: new Date().toLocaleString() }
          : item
      ));
    }, 2000);
  };

  // 查看同步详情
  const handleViewSyncDetail = (record: SyncRecord) => {
    Modal.info({
      title: '同步详情',
      width: 600,
      content: (
        <Descriptions column={2} bordered>
          <Descriptions.Item label="系统名称">{record.system}</Descriptions.Item>
          <Descriptions.Item label="同步类型">{record.type}</Descriptions.Item>
          <Descriptions.Item label="开始时间">{record.startTime}</Descriptions.Item>
          <Descriptions.Item label="结束时间">{record.endTime || '-'}</Descriptions.Item>
          <Descriptions.Item label="记录数量">{record.recordsCount}</Descriptions.Item>
          <Descriptions.Item label="状态">{record.status}</Descriptions.Item>
          {record.errorMessage && (
            <Descriptions.Item label="错误信息" span={2}>
              {record.errorMessage}
            </Descriptions.Item>
          )}
        </Descriptions>
      ),
    });
  };

  // 执行API测试
  const onTestSubmit = async (values: any) => {
    try {
      message.loading('正在测试接口...', 2);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const testResult: TestResult = {
        id: Date.now().toString(),
        apiName: values.apiName,
        testTime: new Date().toLocaleString(),
        status: Math.random() > 0.2 ? 'success' : 'failed',
        responseTime: Math.floor(Math.random() * 500) + 100,
        responseSize: Math.floor(Math.random() * 5000) + 1000,
        errorMessage: Math.random() > 0.2 ? undefined : '网络连接超时'
      };
      
      setTestResults(prev => [testResult, ...prev]);
      message.success('接口测试完成');
      setTestModalVisible(false);
      testForm.resetFields();
    } catch (error) {
      message.error('测试失败');
    }
  };

  // 保存API配置
  const onConfigSubmit = async (values: any) => {
    try {
      message.loading('正在保存配置...', 1);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (selectedApi) {
        setApiConfigs(prev => prev.map(item => 
          item.id === selectedApi.id 
            ? { ...item, ...values }
            : item
        ));
      }
      
      message.success('配置保存成功');
      setConfigModalVisible(false);
      configForm.resetFields();
    } catch (error) {
      message.error('保存失败');
    }
  };

  return (
    <div className="government-system">
      <div className="page-header">
        <Title level={2}><ApiOutlined /> 政务系统对接管理</Title>
        <Text type="secondary">管理政务系统API接口配置、数据同步和接口测试</Text>
      </div>

      {/* 系统概览 */}
      <Row gutter={16} className="overview-row">
        <Col span={6}>
          <Card>
            <div className="overview-item">
              <div className="overview-icon active">
                <ApiOutlined />
              </div>
              <div className="overview-content">
                <div className="overview-number">{apiConfigs.filter(a => a.status === 'active').length}</div>
                <div className="overview-label">活跃接口</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className="overview-item">
              <div className="overview-icon success">
                <SyncOutlined />
              </div>
              <div className="overview-content">
                <div className="overview-number">{syncRecords.filter(s => s.status === 'success').length}</div>
                <div className="overview-label">同步成功</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className="overview-item">
              <div className="overview-icon warning">
                <MonitorOutlined />
              </div>
              <div className="overview-content">
                <div className="overview-number">{testResults.filter(t => t.status === 'success').length}</div>
                <div className="overview-label">测试通过</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className="overview-item">
              <div className="overview-icon error">
                <ExclamationCircleOutlined />
              </div>
              <div className="overview-content">
                <div className="overview-number">{apiConfigs.filter(a => a.status === 'error').length}</div>
                <div className="overview-label">异常接口</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 主要内容 */}
      <Tabs defaultActiveKey="1" className="main-tabs">
        <TabPane tab={<span><ApiOutlined />API接口管理</span>} key="1">
          <Card 
            title="接口配置列表" 
            extra={
              <Button type="primary" icon={<ApiOutlined />}>
                添加接口
              </Button>
            }
          >
            <Table 
              columns={apiColumns} 
              dataSource={apiConfigs} 
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane tab={<span><SyncOutlined />数据同步</span>} key="2">
          <Card 
            title="同步记录" 
            extra={
              <Space>
                <Button icon={<SyncOutlined />}>
                  手动同步
                </Button>
                <Button icon={<HistoryOutlined />}>
                  同步历史
                </Button>
              </Space>
            }
          >
            <Table 
              columns={syncColumns} 
              dataSource={syncRecords} 
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane tab={<span><MonitorOutlined />接口测试</span>} key="3">
          <Card 
            title="测试结果" 
            extra={
              <Button type="primary" icon={<MonitorOutlined />}>
                批量测试
              </Button>
            }
          >
            <Table 
              columns={testColumns} 
              dataSource={testResults} 
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane tab={<span><SettingOutlined />系统配置</span>} key="4">
          <Card title="系统配置">
            <Row gutter={24}>
              <Col span={12}>
                <Form layout="vertical">
                  <Form.Item label="政务系统地址" required>
                    <Input placeholder="请输入政务系统基础地址" />
                  </Form.Item>
                  <Form.Item label="认证方式">
                    <Select defaultValue="token">
                      <Option value="token">Token认证</Option>
                      <Option value="oauth">OAuth2.0</Option>
                      <Option value="basic">Basic认证</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="同步频率">
                    <Select defaultValue="hourly">
                      <Option value="realtime">实时同步</Option>
                      <Option value="hourly">每小时</Option>
                      <Option value="daily">每日</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="启用自动同步">
                    <Switch defaultChecked />
                  </Form.Item>
                </Form>
              </Col>
              <Col span={12}>
                <Alert
                  message="配置说明"
                  description="政务系统对接配置说明和注意事项"
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
                <div className="config-tips">
                  <h4>配置要点：</h4>
                  <ul>
                    <li>确保政务系统API接口可访问</li>
                    <li>配置正确的认证信息和权限</li>
                    <li>设置合适的同步频率和策略</li>
                    <li>定期检查接口状态和同步日志</li>
                  </ul>
                </div>
              </Col>
            </Row>
          </Card>
        </TabPane>
      </Tabs>

      {/* API配置弹窗 */}
      <Modal
        title="API接口配置"
        open={configModalVisible}
        onCancel={() => setConfigModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={configForm} onFinish={onConfigSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="接口名称"
            rules={[{ required: true, message: '请输入接口名称' }]}
          >
            <Input placeholder="请输入接口名称" />
          </Form.Item>
          <Form.Item
            name="url"
            label="接口地址"
            rules={[{ required: true, message: '请输入接口地址' }]}
          >
            <Input placeholder="请输入完整的接口URL" />
          </Form.Item>
          <Form.Item
            name="method"
            label="请求方法"
            rules={[{ required: true, message: '请选择请求方法' }]}
          >
            <Select placeholder="选择请求方法">
              <Option value="GET">GET</Option>
              <Option value="POST">POST</Option>
              <Option value="PUT">PUT</Option>
              <Option value="DELETE">DELETE</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="接口状态"
          >
            <Select placeholder="选择接口状态">
              <Option value="active">启用</Option>
              <Option value="inactive">停用</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                保存配置
              </Button>
              <Button onClick={() => setConfigModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 接口测试弹窗 */}
      <Modal
        title="接口测试"
        open={testModalVisible}
        onCancel={() => setTestModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={testForm} onFinish={onTestSubmit} layout="vertical">
          <Form.Item
            name="apiName"
            label="接口名称"
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="url"
            label="接口地址"
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="method"
            label="请求方法"
          >
            <Select disabled>
              <Option value="GET">GET</Option>
              <Option value="POST">POST</Option>
              <Option value="PUT">PUT</Option>
              <Option value="DELETE">DELETE</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="testParams"
            label="测试参数"
          >
            <TextArea rows={4} placeholder="请输入测试参数（JSON格式）" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                开始测试
              </Button>
              <Button onClick={() => setTestModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GovernmentSystem;
