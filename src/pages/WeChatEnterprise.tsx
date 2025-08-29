import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Button, message, Table, Tag, Space, Modal, Form, Input, Select, DatePicker, Tabs } from 'antd';
import { 
  WechatOutlined, 
  SyncOutlined, 
  MessageOutlined, 
  UserOutlined, 
  SettingOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  ApiOutlined
} from '@ant-design/icons';
import WeChatUserManagement from './WeChatUserManagement';
import GovernmentSystem from './GovernmentSystem';
import './WeChatEnterprise.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

interface SystemStatus {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'error';
  lastSync: string;
  syncStatus: 'success' | 'pending' | 'failed';
}

interface MessageRecord {
  id: string;
  type: 'notification' | 'reminder' | 'alert';
  content: string;
  target: string;
  status: 'sent' | 'pending' | 'failed';
  sendTime: string;
}

const WeChatEnterprise: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([
    {
      id: '1',
      name: '人口管理系统',
      status: 'online',
      lastSync: '2025-08-15 14:30:00',
      syncStatus: 'success'
    },
    {
      id: '2',
      name: '房屋管理系统',
      status: 'online',
      lastSync: '2025-08-15 14:25:00',
      syncStatus: 'success'
    },
    {
      id: '3',
      name: '事件管理系统',
      status: 'online',
      lastSync: '2025-08-15 14:20:00',
      syncStatus: 'success'
    },
    {
      id: '4',
      name: '网格管理系统',
      status: 'online',
      lastSync: '2025-08-15 14:15:00',
      syncStatus: 'success'
    }
  ]);

  const [messageRecords, setMessageRecords] = useState<MessageRecord[]>([
    {
      id: '1',
      type: 'notification',
      content: '社区停电通知：本周六上午9点到10点，停电一小时',
      target: '全体居民',
      status: 'sent',
      sendTime: '2025-08-15 14:00:00'
    },
    {
      id: '2',
      type: 'reminder',
      content: '提醒：请及时缴纳物业费',
      target: '业主群',
      status: 'sent',
      sendTime: '2025-08-15 13:30:00'
    },
    {
      id: '3',
      type: 'alert',
      content: '紧急通知：小区内发现可疑人员，请注意安全',
      target: '安全群',
      status: 'pending',
      sendTime: '2025-08-15 13:00:00'
    }
  ]);

  const [syncModalVisible, setSyncModalVisible] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [syncForm] = Form.useForm();
  const [messageForm] = Form.useForm();

  // 系统状态列定义
  const systemColumns = [
    {
      title: '系统名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '运行状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          online: { color: 'green', text: '在线', icon: <CheckCircleOutlined /> },
          offline: { color: 'red', text: '离线', icon: <ExclamationCircleOutlined /> },
          error: { color: 'orange', text: '异常', icon: <ExclamationCircleOutlined /> }
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
      title: '最后同步时间',
      dataIndex: 'lastSync',
      key: 'lastSync',
    },
    {
      title: '同步状态',
      dataIndex: 'syncStatus',
      key: 'syncStatus',
      render: (status: string) => {
        const statusConfig = {
          success: { color: 'green', text: '成功', icon: <CheckCircleOutlined /> },
          pending: { color: 'blue', text: '进行中', icon: <ClockCircleOutlined /> },
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
      title: '操作',
      key: 'action',
      render: (_: unknown, record: SystemStatus) => (
        <Space size="middle">
          <Button 
            type="primary" 
            size="small" 
            icon={<SyncOutlined />}
            onClick={() => handleManualSync(record)}
          >
            手动同步
          </Button>
          <Button 
            size="small" 
            icon={<SettingOutlined />}
            onClick={() => handleSystemConfig(record)}
          >
            配置
          </Button>
        </Space>
      ),
    },
  ];

  // 消息记录列定义
  const messageColumns = [
    {
      title: '消息类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeConfig = {
          notification: { color: 'blue', text: '通知' },
          reminder: { color: 'orange', text: '提醒' },
          alert: { color: 'red', text: '警报' }
        };
        const config = typeConfig[type as keyof typeof typeConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '消息内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: '发送目标',
      dataIndex: 'target',
      key: 'target',
    },
    {
      title: '发送状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          sent: { color: 'green', text: '已发送' },
          pending: { color: 'blue', text: '发送中' },
          failed: { color: 'red', text: '发送失败' }
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '发送时间',
      dataIndex: 'sendTime',
      key: 'sendTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: MessageRecord) => (
        <Space size="middle">
          {record.status === 'failed' && (
            <Button 
              type="primary" 
              size="small" 
              onClick={() => handleResendMessage(record)}
            >
              重新发送
            </Button>
          )}
          <Button 
            size="small" 
            onClick={() => handleViewMessage(record)}
          >
            查看详情
          </Button>
        </Space>
      ),
    },
  ];

  // 手动同步系统
  const handleManualSync = (system: SystemStatus) => {
    message.loading(`正在同步 ${system.name}...`, 2);
    setTimeout(() => {
      message.success(`${system.name} 同步完成`);
      // 更新同步状态
      setSystemStatus(prev => prev.map(item => 
        item.id === system.id 
          ? { ...item, lastSync: new Date().toLocaleString(), syncStatus: 'success' }
          : item
      ));
    }, 2000);
  };

  // 系统配置
  const handleSystemConfig = (system: SystemStatus) => {
    message.info(`打开 ${system.name} 配置页面`);
  };

  // 重新发送消息
  const handleResendMessage = (messageRecord: MessageRecord) => {
    message.loading('正在重新发送...', 1);
    setTimeout(() => {
      message.success('消息重新发送成功');
      // 更新消息状态
      setMessageRecords(prev => prev.map(item => 
        item.id === messageRecord.id 
          ? { ...item, status: 'sent' }
          : item
      ));
    }, 1000);
  };

  // 查看消息详情
  const handleViewMessage = (message: MessageRecord) => {
    Modal.info({
      title: '消息详情',
      content: (
        <div>
          <p><strong>消息类型：</strong>{message.type}</p>
          <p><strong>消息内容：</strong>{message.content}</p>
          <p><strong>发送目标：</strong>{message.target}</p>
          <p><strong>发送状态：</strong>{message.status}</p>
          <p><strong>发送时间：</strong>{message.sendTime}</p>
        </div>
      ),
    });
  };

  // 批量同步
  const handleBatchSync = () => {
    setSyncModalVisible(true);
  };

  // 发送新消息
  const handleSendMessage = () => {
    setMessageModalVisible(true);
  };

  // 执行批量同步
  const onSyncSubmit = async () => {
    try {
      message.loading('正在执行批量同步...', 2);
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success('批量同步完成');
      setSyncModalVisible(false);
      syncForm.resetFields();
    } catch {
      message.error('同步失败');
    }
  };

  // 发送消息
  const onMessageSubmit = async (values: { type: 'notification' | 'reminder' | 'alert'; content: string; target: string }) => {
    try {
      message.loading('正在发送消息...', 1);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newMessage: MessageRecord = {
        id: Date.now().toString(),
        type: values.type,
        content: values.content,
        target: values.target,
        status: 'sent',
        sendTime: new Date().toLocaleString()
      };
      
      setMessageRecords(prev => [newMessage, ...prev]);
      message.success('消息发送成功');
      setMessageModalVisible(false);
      messageForm.resetFields();
    } catch {
      message.error('发送失败');
    }
  };

  return (
    <div className="wechat-enterprise">
      <div className="page-header">
        <h1><WechatOutlined /> 微信企业端管理</h1>
        <p>政务系统对接与微信企业端应用管理</p>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} className="stats-row">
        <Col span={6}>
          <Card>
            <Statistic
              title="在线系统"
              value={systemStatus.filter(s => s.status === 'online').length}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              suffix={`/ ${systemStatus.length}`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日消息"
              value={messageRecords.filter(m => m.status === 'sent').length}
              prefix={<MessageOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="同步成功率"
              value={((systemStatus.filter(s => s.syncStatus === 'success').length / systemStatus.length) * 100).toFixed(1)}
              prefix={<SyncOutlined style={{ color: '#722ed1' }} />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃用户"
              value={1250}
              prefix={<UserOutlined style={{ color: '#fa8c16' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容 */}
      <Tabs defaultActiveKey="1" className="main-tabs">
        <TabPane tab={<span><WechatOutlined />系统概览</span>} key="1">
          {/* 操作按钮 */}
          <Row gutter={16} className="action-row">
            <Col span={24}>
              <Space>
                <Button 
                  type="primary" 
                  icon={<SyncOutlined />} 
                  onClick={handleBatchSync}
                >
                  批量同步
                </Button>
                <Button 
                  type="primary" 
                  icon={<MessageOutlined />} 
                  onClick={handleSendMessage}
                >
                  发送消息
                </Button>
                <Button icon={<SettingOutlined />}>
                  系统配置
                </Button>
              </Space>
            </Col>
          </Row>

          {/* 系统状态 */}
          <Card title="政务系统对接状态" className="system-status-card">
            <Table 
              columns={systemColumns} 
              dataSource={systemStatus} 
              rowKey="id"
              pagination={false}
            />
          </Card>

          {/* 消息记录 */}
          <Card title="消息发送记录" className="message-record-card">
            <Table 
              columns={messageColumns} 
              dataSource={messageRecords} 
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane tab={<span><TeamOutlined />用户管理</span>} key="2">
          <WeChatUserManagement />
        </TabPane>

        <TabPane tab={<span><ApiOutlined />政务系统对接</span>} key="3">
          <GovernmentSystem />
        </TabPane>
      </Tabs>

      {/* 批量同步弹窗 */}
      <Modal
        title="批量同步配置"
        open={syncModalVisible}
        onCancel={() => setSyncModalVisible(false)}
        footer={null}
      >
        <Form form={syncForm} onFinish={onSyncSubmit} layout="vertical">
          <Form.Item
            name="systems"
            label="选择系统"
            rules={[{ required: true, message: '请选择要同步的系统' }]}
          >
            <Select mode="multiple" placeholder="选择要同步的系统">
              {systemStatus.map(system => (
                <Option key={system.id} value={system.id}>{system.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="syncType"
            label="同步类型"
            rules={[{ required: true, message: '请选择同步类型' }]}
          >
            <Select placeholder="选择同步类型">
              <Option value="full">全量同步</Option>
              <Option value="incremental">增量同步</Option>
              <Option value="differential">差异同步</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="timeRange"
            label="时间范围"
          >
            <RangePicker showTime />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                开始同步
              </Button>
              <Button onClick={() => setSyncModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 发送消息弹窗 */}
      <Modal
        title="发送消息"
        open={messageModalVisible}
        onCancel={() => setMessageModalVisible(false)}
        footer={null}
      >
        <Form form={messageForm} onFinish={onMessageSubmit} layout="vertical">
          <Form.Item
            name="type"
            label="消息类型"
            rules={[{ required: true, message: '请选择消息类型' }]}
          >
            <Select placeholder="选择消息类型">
              <Option value="notification">通知</Option>
              <Option value="reminder">提醒</Option>
              <Option value="alert">警报</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="target"
            label="发送目标"
            rules={[{ required: true, message: '请输入发送目标' }]}
          >
            <Select placeholder="选择发送目标">
              <Option value="全体居民">全体居民</Option>
              <Option value="业主群">业主群</Option>
              <Option value="安全群">安全群</Option>
              <Option value="网格员">网格员</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="content"
            label="消息内容"
            rules={[{ required: true, message: '请输入消息内容' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入消息内容" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                发送
              </Button>
              <Button onClick={() => setMessageModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WeChatEnterprise;
