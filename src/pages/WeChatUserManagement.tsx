import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Table, 
  Button, 
  Input, 
  Select, 
  Tag, 
  Space, 
  message, 
  Modal, 
  Form, 
  Avatar, 
  // Switch, 
  // Tree, 
  Badge,
  // Tooltip,
  Popconfirm
} from 'antd';
import { 
  // UserOutlined, 
  TeamOutlined, 
  SyncOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  // LockOutlined,
  // UnlockOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  // SearchOutlined,
  // FilterOutlined
} from '@ant-design/icons';
import './WeChatUserManagement.less';

const { Option } = Select;
const { Search } = Input;

interface WeChatUser {
  id: string;
  name: string;
  avatar: string;
  mobile: string;
  email: string;
  department: string;
  position: string;
  status: 'active' | 'inactive' | 'pending';
  syncStatus: 'synced' | 'pending' | 'failed';
  lastSync: string;
  permissions: string[];
}

interface Department {
  id: string;
  name: string;
  parentId?: string;
  level: number;
  children?: Department[];
}

const WeChatUserManagement: React.FC = () => {
  const [users, setUsers] = useState<WeChatUser[]>([
    {
      id: '1',
      name: '赵磊',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      mobile: '138****8021',
      email: 'zhaolei@company.com',
      department: '技术部',
      position: '前端工程师',
      status: 'active',
      syncStatus: 'synced',
      lastSync: '2025-08-15 14:30:00',
      permissions: ['read', 'write', 'admin']
    },
    {
      id: '2',
      name: '李铭',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      mobile: '138****3654',
      email: 'liming@company.com',
      department: '产品部',
      position: '产品经理',
      status: 'active',
      syncStatus: 'synced',
      lastSync: '2025-08-15 14:25:00',
      permissions: ['read', 'write']
    },
    {
      id: '3',
      name: '汪立森',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      mobile: '158***8023',
      email: 'wanglishen@company.com',
      department: '运营部',
      position: '运营专员',
      status: 'inactive',
      syncStatus: 'failed',
      lastSync: '2025-08-15 14:20:00',
      permissions: ['read']
    },
    {
      id: '4',
      name: '赵铭',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      mobile: '138****8956',
      email: 'zhaoming@company.com',
      department: '技术部',
      position: '后端工程师',
      status: 'pending',
      syncStatus: 'pending',
      lastSync: '2025-08-15 14:15:00',
      permissions: ['read', 'write']
    }
  ]);

  const [departments, setDepartments] = useState<Department[]>([
    {
      id: '1',
      name: '技术部',
      level: 1,
      children: [
        { id: '1-1', name: '前端组', parentId: '1', level: 2 },
        { id: '1-2', name: '后端组', parentId: '1', level: 2 },
        { id: '1-3', name: '测试组', parentId: '1', level: 2 }
      ]
    },
    {
      id: '2',
      name: '产品部',
      level: 1,
      children: [
        { id: '2-1', name: '产品设计组', parentId: '2', level: 2 },
        { id: '2-2', name: '用户体验组', parentId: '2', level: 2 }
      ]
    },
    {
      id: '3',
      name: '运营部',
      level: 1,
      children: [
        { id: '3-1', name: '市场运营组', parentId: '3', level: 2 },
        { id: '3-2', name: '用户运营组', parentId: '3', level: 2 }
      ]
    }
  ]);

  const [userModalVisible, setUserModalVisible] = useState(false);
  const [deptModalVisible, setDeptModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<WeChatUser | null>(null);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [userForm] = Form.useForm();
  const [deptForm] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDept, setFilterDept] = useState<string>('all');

  // 用户列定义
  const userColumns = [
    {
      title: '用户信息',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: WeChatUser) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={record.avatar} size={40} style={{ marginRight: 12 }}>
            {record.name.charAt(0)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.position}</div>
          </div>
        </div>
      )
    },
    {
      title: '联系方式',
      key: 'contact',
      render: (_: unknown, record: WeChatUser) => (
        <div>
          <div style={{ marginBottom: 4 }}>{record.mobile}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.email}</div>
        </div>
      )
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      render: (dept: string) => <Tag color="blue">{dept}</Tag>
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          active: { color: 'green', text: '正常', icon: <CheckCircleOutlined /> },
          inactive: { color: 'red', text: '停用', icon: <ExclamationCircleOutlined /> },
          pending: { color: 'orange', text: '待审核', icon: <ClockCircleOutlined /> }
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
      title: '同步状态',
      dataIndex: 'syncStatus',
      key: 'syncStatus',
      render: (status: string) => {
        const statusConfig = {
          synced: { color: 'green', text: '已同步', icon: <CheckCircleOutlined /> },
          pending: { color: 'blue', text: '同步中', icon: <ClockCircleOutlined /> },
          failed: { color: 'red', text: '同步失败', icon: <ExclamationCircleOutlined /> }
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
      title: '权限',
      key: 'permissions',
      render: (_: unknown, record: WeChatUser) => (
        <Space size={4}>
          {record.permissions.map(perm => (
            <Tag key={perm} color={perm === 'admin' ? 'red' : perm === 'write' ? 'blue' : 'green'}>
              {perm === 'admin' ? '管理员' : perm === 'write' ? '编辑' : '查看'}
            </Tag>
          ))}
        </Space>
      )
    },
    {
      title: '最后同步',
      dataIndex: 'lastSync',
      key: 'lastSync',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: WeChatUser) => (
        <Space size="middle">
          <Button 
            type="primary" 
            size="small" 
            icon={<SyncOutlined />}
            onClick={() => handleSyncUser(record)}
          >
            同步
          </Button>
          <Button 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个用户吗？"
            onConfirm={() => handleDeleteUser(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              size="small" 
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 部门列定义
  const deptColumns = [
    {
      title: '部门名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Department) => (
        <span style={{ paddingLeft: (record.level - 1) * 20 }}>
          {text}
        </span>
      )
    },
    {
      title: '层级',
      dataIndex: 'level',
      key: 'level',
      render: (level: number) => <Tag color="blue">第{level}级</Tag>
    },
    {
      title: '用户数量',
      key: 'userCount',
      render: (_: unknown, record: Department) => {
        const count = users.filter(u => u.department === record.name).length;
        return <Badge count={count} showZero style={{ backgroundColor: count > 0 ? '#52c41a' : '#d9d9d9' }} />;
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: Department) => (
        <Space size="middle">
          <Button 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEditDept(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个部门吗？"
            onConfirm={() => handleDeleteDept(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              size="small" 
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 同步用户
  const handleSyncUser = (user: WeChatUser) => {
    message.loading(`正在同步用户 ${user.name}...`, 2);
    setTimeout(() => {
      message.success(`用户 ${user.name} 同步成功`);
      // 更新同步状态
      setUsers(prev => prev.map(item => 
        item.id === user.id 
          ? { ...item, syncStatus: 'synced', lastSync: new Date().toLocaleString() }
          : item
      ));
    }, 2000);
  };

  // 编辑用户
  const handleEditUser = (user: WeChatUser) => {
    setSelectedUser(user);
    setUserModalVisible(true);
    userForm.setFieldsValue(user);
  };

  // 删除用户
  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(item => item.id !== userId));
    message.success('用户删除成功');
  };

  // 编辑部门
  const handleEditDept = (dept: Department) => {
    setSelectedDept(dept);
    setDeptModalVisible(true);
    deptForm.setFieldsValue(dept);
  };

  // 删除部门
  const handleDeleteDept = (deptId: string) => {
    setDepartments(prev => prev.filter(item => item.id !== deptId));
    message.success('部门删除成功');
  };

  // 批量同步
  const handleBatchSync = () => {
    message.loading('正在批量同步用户...', 2);
    setTimeout(() => {
      message.success('批量同步完成');
      // 更新所有用户的同步状态
      setUsers(prev => prev.map(item => ({
        ...item,
        syncStatus: 'synced',
        lastSync: new Date().toLocaleString()
      })));
    }, 3000);
  };

  // 保存用户
  const onUserSubmit = async (values: Omit<WeChatUser, 'id' | 'syncStatus' | 'lastSync'>) => {
    try {
      message.loading('正在保存用户...', 1);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (selectedUser) {
        setUsers(prev => prev.map(item => 
          item.id === selectedUser.id 
            ? { ...item, ...values }
            : item
        ));
      } else {
        const newUser: WeChatUser = {
          id: Date.now().toString(),
          ...values,
          syncStatus: 'pending',
          lastSync: new Date().toLocaleString()
        };
        setUsers(prev => [newUser, ...prev]);
      }
      
      message.success('用户保存成功');
      setUserModalVisible(false);
      userForm.resetFields();
      setSelectedUser(null);
    } catch {
      message.error('保存失败');
    }
  };

  // 保存部门
  const onDeptSubmit = async (values: Omit<Department, 'id' | 'level'>) => {
    try {
      message.loading('正在保存部门...', 1);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (selectedDept) {
        setDepartments(prev => prev.map(item => 
          item.id === selectedDept.id 
            ? { ...item, ...values }
            : item
        ));
      } else {
        const newDept: Department = {
          id: Date.now().toString(),
          ...values,
          level: 1
        };
        setDepartments(prev => [newDept, ...prev]);
      }
      
      message.success('部门保存成功');
      setDeptModalVisible(false);
      deptForm.resetFields();
      setSelectedDept(null);
    } catch {
      message.error('保存失败');
    }
  };

  // 过滤用户
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         user.mobile.includes(searchText) ||
                         user.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesDept = filterDept === 'all' || user.department === filterDept;
    
    return matchesSearch && matchesStatus && matchesDept;
  });

  return (
    <div className="wechat-user-management">
      <div className="page-header">
        <h1><TeamOutlined /> 微信企业端用户管理</h1>
        <p>管理企业微信用户、部门和权限</p>
      </div>

      {/* 操作栏 */}
      <Row gutter={16} className="action-row">
        <Col span={16}>
          <Space>
            <Search
              placeholder="搜索用户姓名、手机号或邮箱"
              allowClear
              style={{ width: 300 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              placeholder="状态筛选"
              style={{ width: 120 }}
              value={filterStatus}
              onChange={setFilterStatus}
            >
              <Option value="all">全部状态</Option>
              <Option value="active">正常</Option>
              <Option value="inactive">停用</Option>
              <Option value="pending">待审核</Option>
            </Select>
            <Select
              placeholder="部门筛选"
              style={{ width: 120 }}
              value={filterDept}
              onChange={setFilterDept}
            >
              <Option value="all">全部部门</Option>
              {departments.map(dept => (
                <Option key={dept.id} value={dept.name}>{dept.name}</Option>
              ))}
            </Select>
          </Space>
        </Col>
        <Col span={8} style={{ textAlign: 'right' }}>
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
              icon={<PlusOutlined />} 
              onClick={() => {
                setSelectedUser(null);
                setUserModalVisible(true);
                userForm.resetFields();
              }}
            >
              添加用户
            </Button>
            <Button 
              icon={<PlusOutlined />} 
              onClick={() => {
                setSelectedDept(null);
                setDeptModalVisible(true);
                deptForm.resetFields();
              }}
            >
              添加部门
            </Button>
          </Space>
        </Col>
      </Row>

      {/* 用户列表 */}
      <Card title="用户列表" className="user-list-card">
        <Table 
          columns={userColumns} 
          dataSource={filteredUsers} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* 部门管理 */}
      <Card title="部门管理" className="dept-management-card">
        <Table 
          columns={deptColumns} 
          dataSource={departments} 
          rowKey="id"
          pagination={false}
        />
      </Card>

      {/* 用户编辑弹窗 */}
      <Modal
        title={selectedUser ? '编辑用户' : '添加用户'}
        open={userModalVisible}
        onCancel={() => setUserModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={userForm} onFinish={onUserSubmit} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="姓名"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input placeholder="请输入姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="mobile"
                label="手机号"
                rules={[{ required: true, message: '请输入手机号' }]}
              >
                <Input placeholder="请输入手机号" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="邮箱"
                rules={[{ required: true, message: '请输入邮箱' }]}
              >
                <Input placeholder="请输入邮箱" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="department"
                label="部门"
                rules={[{ required: true, message: '请选择部门' }]}
              >
                <Select placeholder="选择部门">
                  {departments.map(dept => (
                    <Option key={dept.id} value={dept.name}>{dept.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="position"
                label="职位"
                rules={[{ required: true, message: '请输入职位' }]}
              >
                <Input placeholder="请输入职位" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="选择状态">
                  <Option value="active">正常</Option>
                  <Option value="inactive">停用</Option>
                  <Option value="pending">待审核</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="permissions"
            label="权限"
            rules={[{ required: true, message: '请选择权限' }]}
          >
            <Select mode="multiple" placeholder="选择权限">
              <Option value="read">查看权限</Option>
              <Option value="write">编辑权限</Option>
              <Option value="admin">管理员权限</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button onClick={() => setUserModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 部门编辑弹窗 */}
      <Modal
        title={selectedDept ? '编辑部门' : '添加部门'}
        open={deptModalVisible}
        onCancel={() => setDeptModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form form={deptForm} onFinish={onDeptSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="部门名称"
            rules={[{ required: true, message: '请输入部门名称' }]}
          >
            <Input placeholder="请输入部门名称" />
          </Form.Item>
          <Form.Item
            name="parentId"
            label="上级部门"
          >
            <Select placeholder="选择上级部门" allowClear>
              {departments.filter(dept => dept.level === 1).map(dept => (
                <Option key={dept.id} value={dept.id}>{dept.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button onClick={() => setDeptModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WeChatUserManagement;
