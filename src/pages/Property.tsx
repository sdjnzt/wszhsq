import React, { useState } from 'react';
import { 
  Card, 
  Tabs, 
  Table, 
  Button, 
  Badge, 
  Tag, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  InputNumber, 
  Space, 
  message,
  Row,
  Col,
  Statistic,

} from 'antd';
import { 
  HomeOutlined, 
  TeamOutlined, 
  FileTextOutlined, 
  SettingOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,

  ExportOutlined,
  ImportOutlined,
  ApiOutlined,
  WechatOutlined,
  ToolOutlined
} from '@ant-design/icons';
import './Property.less';
import { desensitizePhoneNumber } from '../utils/desensitization';

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

interface PropertyCompany {
  key: string;
  companyCode: string;
  name: string;
  gridId: string;
  area: string;
  manager: string;
  contact: string;
  email: string;
  address: string;
  rating: string;
  status: string;
  contractStart: string;
  contractEnd: string;
  serviceLevel: string;
  staffCount: number;
  apiStatus: string;
  wechatStatus: string;
  hardwareStatus: string;
  businessLicense: string;
  legalPerson: string;
  registeredCapital: string;
  establishmentDate: string;
  serviceArea: number;
  propertyFee: number;
  complaintCount: number;
  satisfactionRate: number;
}

interface GridInfo {
  key: string;
  gridName: string;
  gridManager: string;
  companyCount: number;
  buildingCount: number;
  householdCount: number;
  population: number;
  status: string;
  lastUpdate: string;
}

interface ContractInfo {
  key: string;
  contractNo: string;
  companyName: string;
  gridName: string;
  contractType: string;
  startDate: string;
  endDate: string;
  amount: number;
  status: string;
  signDate: string;
  responsible: string;
}

const Property: React.FC = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add');

  const [form] = Form.useForm();

  // 物业公司数据
  const propertyCompanies: PropertyCompany[] = [
    { 
      key: '1', 
      companyCode: 'WSAJ001',
      name: '汶上安居物业服务有限公司', 
      gridId: '中都花园A区网格',
      area: '文昌社区文景花园、中都社区中都家园', 
      manager: '张伟', 
      contact: '13912345678',
      email: 'wsaj001@example.com',
      address: '汶上县中都街道文昌社区文景花园物业服务中心',
      rating: '4.5分',
      status: '正常',
      contractStart: '2023-01-01',
      contractEnd: '2025-08-31',
      serviceLevel: '一级',
      staffCount: 45,
      apiStatus: '已对接',
      wechatStatus: '已开通',
      hardwareStatus: '已接入',
      businessLicense: '91370832MA3C123456',
      legalPerson: '张伟',
      registeredCapital: '500万元',
      establishmentDate: '2018-03-15',
      serviceArea: 125000,
      propertyFee: 2.8,
      complaintCount: 12,
      satisfactionRate: 92
    },
    { 
      key: '2', 
      companyCode: 'WSYJ002',
      name: '汶上宜家物业管理公司', 
      gridId: '中都花园B区网格',
      area: '汶河社区汶河小区、幸福社区和谐嘉园', 
      manager: '李强', 
      contact: '13887654321',
      email: 'wsyj002@example.com',
      address: '汶上县中都街道汶河社区汶河小区物业服务中心',
      rating: '4.2分',
      status: '正常',
      contractStart: '2023-03-01',
      contractEnd: '2026-02-28',
      serviceLevel: '二级',
      staffCount: 38,
      apiStatus: '已对接',
      wechatStatus: '已开通',
      hardwareStatus: '已接入',
      businessLicense: '91370832MA3C789012',
      legalPerson: '李强',
      registeredCapital: '300万元',
      establishmentDate: '2019-06-20',
      serviceArea: 98000,
      propertyFee: 2.5,
      complaintCount: 18,
      satisfactionRate: 88
    },
    { 
      key: '3', 
      companyCode: 'ZDJY003',
      name: '中都家园物业服务中心', 
      gridId: '中都花园C区网格',
      area: '望嵩社区望嵩雅居、文庙社区文馨雅苑', 
      manager: '王芳', 
      contact: '13798765432',
      email: 'zdjy003@example.com',
      address: '汶上县中都街道望嵩社区望嵩雅居物业服务中心',
      rating: '4.7分',
      status: '正常',
      contractStart: '2022-12-01',
      contractEnd: '2025-08-30',
      serviceLevel: '一级',
      staffCount: 52,
      apiStatus: '已对接',
      wechatStatus: '已开通',
      hardwareStatus: '已接入',
      businessLicense: '91370832MA3C345678',
      legalPerson: '王芳',
      registeredCapital: '600万元',
      establishmentDate: '2017-09-10',
      serviceArea: 156000,
      propertyFee: 3.0,
      complaintCount: 8,
      satisfactionRate: 95
    },
    { 
      key: '4', 
      companyCode: 'WSXW004',
      name: '汶上县兴旺物业管理有限公司', 
      gridId: '中都花园D区网格',
      area: '汶河社区汶兴小区', 
      manager: '刘超', 
      contact: '13998765432',
      email: 'wsxw004@example.com',
      address: '汶上县中都街道汶河社区汶兴小区物业服务中心',
      rating: '4.0分',
      status: '整改中',
      contractStart: '2023-06-01',
      contractEnd: '2026-05-31',
      serviceLevel: '三级',
      staffCount: 28,
      apiStatus: '对接中',
      wechatStatus: '未开通',
      hardwareStatus: '未接入',
      businessLicense: '91370832MA3C901234',
      legalPerson: '刘超',
      registeredCapital: '200万元',
      establishmentDate: '2020-01-15',
      serviceArea: 68000,
      propertyFee: 2.2,
      complaintCount: 35,
      satisfactionRate: 78
    },
    { 
      key: '5', 
      companyCode: 'HXWY005',
      name: '和信物业服务有限公司', 
      gridId: '中都花园E区网格',
      area: '幸福社区幸福小区、康乐小区', 
      manager: '赵国强', 
      contact: '13687654321',
      email: 'hxwy005@example.com',
      address: '汶上县中都街道幸福社区幸福小区物业服务中心',
      rating: '4.6分',
      status: '正常',
      contractStart: '2023-02-01',
      contractEnd: '2026-01-31',
      serviceLevel: '一级',
      staffCount: 48,
      apiStatus: '已对接',
      wechatStatus: '已开通',
      hardwareStatus: '已接入',
      businessLicense: '91370832MA3C567890',
      legalPerson: '赵国强',
      registeredCapital: '450万元',
      establishmentDate: '2018-11-25',
      serviceArea: 112000,
      propertyFee: 2.6,
      complaintCount: 15,
      satisfactionRate: 90
    },
    { 
      key: '6', 
      companyCode: 'ZDZH006',
      name: '中都智慧物业服务有限公司', 
      gridId: '中都花园F区网格',
      area: '中都花园F区、G区、H区', 
      manager: '陈明', 
      contact: '13587654321',
      email: 'zdzh006@example.com',
      address: '汶上县中都街道中都花园F区智慧物业服务中心',
      rating: '4.8分',
      status: '正常',
      contractStart: '2023-01-15',
      contractEnd: '2026-01-14',
      serviceLevel: '特级',
      staffCount: 65,
      apiStatus: '已对接',
      wechatStatus: '已开通',
      hardwareStatus: '已接入',
      businessLicense: '91370832MA3C678901',
      legalPerson: '陈明',
      registeredCapital: '800万元',
      establishmentDate: '2016-05-18',
      serviceArea: 189000,
      propertyFee: 3.5,
      complaintCount: 6,
      satisfactionRate: 97
    },
  ];

  // 网格信息数据
  const gridInfo: GridInfo[] = [
    {
      key: '1',
      gridName: '中都花园A区网格',
      gridManager: '张伟',
      companyCount: 1,
      buildingCount: 25,
      householdCount: 1200,
      population: 3600,
      status: '正常',
      lastUpdate: '2025-08-15'
    },
    {
      key: '2',
      gridName: '中都花园B区网格',
      gridManager: '李强',
      companyCount: 1,
      buildingCount: 20,
      householdCount: 980,
      population: 2940,
      status: '正常',
      lastUpdate: '2025-08-15'
    },
    {
      key: '3',
      gridName: '中都花园C区网格',
      gridManager: '王芳',
      companyCount: 1,
      buildingCount: 30,
      householdCount: 1500,
      population: 4500,
      status: '正常',
      lastUpdate: '2025-08-15'
    },
    {
      key: '4',
      gridName: '中都花园D区网格',
      gridManager: '刘超',
      companyCount: 1,
      buildingCount: 18,
      householdCount: 850,
      population: 2550,
      status: '整改中',
      lastUpdate: '2025-08-15'
    },
    {
      key: '5',
      gridName: '中都花园E区网格',
      gridManager: '赵国强',
      companyCount: 1,
      buildingCount: 22,
      householdCount: 1100,
      population: 3300,
      status: '正常',
      lastUpdate: '2025-08-15'
    },
    {
      key: '6',
      gridName: '中都花园F区网格',
      gridManager: '陈明',
      companyCount: 1,
      buildingCount: 35,
      householdCount: 1750,
      population: 5250,
      status: '正常',
      lastUpdate: '2025-08-15'
    },
  ];

  // 合同信息数据
  const contractInfo: ContractInfo[] = [
    {
      key: '1',
      contractNo: 'HT2023001',
      companyName: '汶上安居物业服务有限公司',
      gridName: '中都花园A区网格',
      contractType: '物业服务合同',
      startDate: '2023-01-01',
      endDate: '2025-08-31',
      amount: 1250000,
      status: '执行中',
      signDate: '2022-12-15',
      responsible: '张伟'
    },
    {
      key: '2',
      contractNo: 'HT2023002',
      companyName: '汶上宜家物业管理公司',
      gridName: '中都花园B区网格',
      contractType: '物业服务合同',
      startDate: '2023-03-01',
      endDate: '2026-02-28',
      amount: 980000,
      status: '执行中',
      signDate: '2023-02-15',
      responsible: '李强'
    },
    {
      key: '3',
      contractNo: 'HT2022001',
      companyName: '中都家园物业服务中心',
      gridName: '中都花园C区网格',
      contractType: '物业服务合同',
      startDate: '2022-12-01',
      endDate: '2025-08-30',
      amount: 1560000,
      status: '执行中',
      signDate: '2022-11-15',
      responsible: '王芳'
    },
    {
      key: '4',
      contractNo: 'HT2023003',
      companyName: '汶上县兴旺物业管理有限公司',
      gridName: '中都花园D区网格',
      contractType: '物业服务合同',
      startDate: '2023-06-01',
      endDate: '2026-05-31',
      amount: 680000,
      status: '执行中',
      signDate: '2023-05-15',
      responsible: '刘超'
    },
    {
      key: '5',
      contractNo: 'HT2023004',
      companyName: '和信物业服务有限公司',
      gridName: '中都花园E区网格',
      contractType: '物业服务合同',
      startDate: '2023-02-01',
      endDate: '2026-01-31',
      amount: 1120000,
      status: '执行中',
      signDate: '2023-01-15',
      responsible: '赵国强'
    },
    {
      key: '6',
      contractNo: 'HT2023005',
      companyName: '中都智慧物业服务有限公司',
      gridName: '中都花园F区网格',
      contractType: '物业服务合同',
      startDate: '2023-01-15',
      endDate: '2026-01-14',
      amount: 1890000,
      status: '执行中',
      signDate: '2023-01-01',
      responsible: '陈明'
    },
  ];

  // 物业公司表格列定义
  const propertyColumns = [
    {
      title: '公司编码',
      dataIndex: 'companyCode',
      key: 'companyCode',
      width: 100,
    },
    {
      title: '公司名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '所属网格',
      dataIndex: 'gridId',
      key: 'gridId',
      width: 120,
    },
    {
      title: '管理区域',
      dataIndex: 'area',
      key: 'area',
      width: 250,
      ellipsis: true,
    },
    {
      title: '负责人',
      dataIndex: 'manager',
      key: 'manager',
      width: 80,
    },
    {
      title: '联系方式',
      dataIndex: 'contact',
      key: 'contact',
      width: 120,
      render: (text: string) => desensitizePhoneNumber(text),
    },
    {
      title: '服务等级',
      dataIndex: 'serviceLevel',
      key: 'serviceLevel',
      width: 80,
      render: (level: string) => {
        const color = level === '特级' ? 'red' : 
                      level === '一级' ? 'blue' : 
                      level === '二级' ? 'green' : 'orange';
        return <Tag color={color}>{level}</Tag>;
      }
    },
    {
      title: '员工数量',
      dataIndex: 'staffCount',
      key: 'staffCount',
      width: 80,
    },
    {
      title: '评级',
      dataIndex: 'rating',
      key: 'rating',
      width: 80,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Badge status={status === '正常' ? 'success' : 'warning'} text={status} />
      )
    },
    {
      title: '接口状态',
      dataIndex: 'apiStatus',
      key: 'apiStatus',
      width: 80,
      render: (status: string) => {
        const color = status === '已对接' ? 'green' : 
                      status === '对接中' ? 'orange' : 'red';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: '微信状态',
      dataIndex: 'wechatStatus',
      key: 'wechatStatus',
      width: 80,
      render: (status: string) => {
        const color = status === '已开通' ? 'green' : 'red';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: '硬件状态',
      dataIndex: 'hardwareStatus',
      key: 'hardwareStatus',
      width: 80,
      render: (status: string) => {
        const color = status === '已接入' ? 'green' : 'red';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      fixed: 'right' as const,
      render: (_: unknown, record: PropertyCompany) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            详情
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" size="small" icon={<ApiOutlined />} onClick={() => handleApi(record)}>
            接口
          </Button>
          <Button type="link" size="small" icon={<WechatOutlined />} onClick={() => handleWechat(record)}>
            微信
          </Button>
          <Button type="link" size="small" icon={<ToolOutlined />} onClick={() => handleHardware(record)}>
            硬件
          </Button>
        </Space>
      ),
    },
  ];

  // 网格信息表格列定义
  const gridColumns = [
    {
      title: '网格名称',
      dataIndex: 'gridName',
      key: 'gridName',
      width: 150,
    },
    {
      title: '网格管理员',
      dataIndex: 'gridManager',
      key: 'gridManager',
      width: 100,
    },
    {
      title: '物业公司数量',
      dataIndex: 'companyCount',
      key: 'companyCount',
      width: 100,
    },
    {
      title: '楼栋数量',
      dataIndex: 'buildingCount',
      key: 'buildingCount',
      width: 100,
    },
    {
      title: '住户数量',
      dataIndex: 'householdCount',
      key: 'householdCount',
      width: 100,
    },
    {
      title: '人口数量',
      dataIndex: 'population',
      key: 'population',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Badge status={status === '正常' ? 'success' : 'warning'} text={status} />
      )
    },
    {
      title: '最后更新',
      dataIndex: 'lastUpdate',
      key: 'lastUpdate',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />}>
            详情
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />}>
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  // 合同信息表格列定义
  const contractColumns = [
    {
      title: '合同编号',
      dataIndex: 'contractNo',
      key: 'contractNo',
      width: 120,
    },
    {
      title: '物业公司',
      dataIndex: 'companyName',
      key: 'companyName',
      width: 200,
    },
    {
      title: '服务网格',
      dataIndex: 'gridName',
      key: 'gridName',
      width: 150,
    },
    {
      title: '合同类型',
      dataIndex: 'contractType',
      key: 'contractType',
      width: 120,
    },
    {
      title: '开始日期',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 100,
    },
    {
      title: '结束日期',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 100,
    },
    {
      title: '合同金额(元)',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount: number) => amount.toLocaleString(),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={status === '执行中' ? 'green' : 'orange'}>{status}</Tag>
      )
    },
    {
      title: '签订日期',
      dataIndex: 'signDate',
      key: 'signDate',
      width: 100,
    },
    {
      title: '负责人',
      dataIndex: 'responsible',
      key: 'responsible',
      width: 80,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />}>
            详情
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />}>
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  // 处理查看详情
  const handleView = (record: PropertyCompany) => {
    setModalType('view');
    setIsModalVisible(true);
    form.setFieldsValue(record);
  };

  // 处理编辑
  const handleEdit = (record: PropertyCompany) => {
    setModalType('edit');
    setIsModalVisible(true);
    form.setFieldsValue(record);
  };

  // 处理添加
  const handleAdd = () => {
    setModalType('add');
    setIsModalVisible(true);
    form.resetFields();
  };

  // 处理接口对接
  const handleApi = (record: PropertyCompany) => {
    message.info(`正在配置 ${record.name} 的接口对接...`);
  };

  // 处理微信企业端
  const handleWechat = (record: PropertyCompany) => {
    message.info(`正在配置 ${record.name} 的微信企业端...`);
  };

  // 处理硬件接入
  const handleHardware = (record: PropertyCompany) => {
    message.info(`正在配置 ${record.name} 的硬件接入...`);
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      await form.validateFields();
      if (modalType === 'add') {
        message.success('物业公司添加成功！');
      } else if (modalType === 'edit') {
        message.success('物业公司信息更新成功！');
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 统计信息
  const totalCompanies = propertyCompanies.length;
  const activeCompanies = propertyCompanies.filter(c => c.status === '正常').length;
  const totalStaff = propertyCompanies.reduce((sum, c) => sum + c.staffCount, 0);
  const avgSatisfaction = propertyCompanies.reduce((sum, c) => sum + c.satisfactionRate, 0) / totalCompanies;

  return (
    <div className="property-container">
      <h1>物业管理</h1>
      
      {/* 统计概览 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="物业公司总数"
              value={totalCompanies}
              prefix={<HomeOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="正常运营公司"
              value={activeCompanies}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总员工数"
              value={totalStaff}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均满意度"
              value={avgSatisfaction.toFixed(1)}
              suffix="%"
              prefix={<SettingOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane 
          tab={<span><HomeOutlined /> 物业公司管理</span>}
          key="1"
        >
          <Card title="物业公司管理" className="table-card">
            <div className="table-operations">
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                添加物业公司
              </Button>
              <Button icon={<ImportOutlined />}>批量导入</Button>
              <Button icon={<ExportOutlined />}>导出数据</Button>
            </div>
            <Table 
              columns={propertyColumns} 
              dataSource={propertyCompanies} 
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1500 }}
              rowKey="key"
            />
          </Card>
        </TabPane>
        
        <TabPane 
          tab={<span><TeamOutlined /> 网格管理</span>}
          key="2"
        >
          <Card title="网格信息管理" className="table-card">
            <div className="table-operations">
              <Button type="primary" icon={<PlusOutlined />}>添加网格</Button>
              <Button icon={<EditOutlined />}>编辑网格</Button>
              <Button icon={<ExportOutlined />}>导出数据</Button>
            </div>
            <Table 
              columns={gridColumns} 
              dataSource={gridInfo} 
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1200 }}
              rowKey="key"
            />
          </Card>
        </TabPane>
        
        <TabPane 
          tab={<span><FileTextOutlined /> 合同管理</span>}
          key="3"
        >
          <Card title="合同信息管理" className="table-card">
            <div className="table-operations">
              <Button type="primary" icon={<PlusOutlined />}>新增合同</Button>
              <Button icon={<EditOutlined />}>编辑合同</Button>
              <Button icon={<ExportOutlined />}>导出数据</Button>
            </div>
            <Table 
              columns={contractColumns} 
              dataSource={contractInfo} 
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1400 }}
              rowKey="key"
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* 物业公司详情/编辑模态框 */}
      <Modal
        title={modalType === 'add' ? '添加物业公司' : modalType === 'edit' ? '编辑物业公司' : '物业公司详情'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        okText={modalType === 'view' ? '关闭' : '确定'}
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          disabled={modalType === 'view'}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="companyCode"
                label="公司编码"
                rules={[{ required: true, message: '请输入公司编码' }]}
              >
                <Input placeholder="请输入公司编码" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="公司名称"
                rules={[{ required: true, message: '请输入公司名称' }]}
              >
                <Input placeholder="请输入公司名称" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="gridId"
                label="所属网格"
                rules={[{ required: true, message: '请选择所属网格' }]}
              >
                <Select placeholder="请选择所属网格">
                  {gridInfo.map(grid => (
                    <Option key={grid.key} value={grid.gridName}>{grid.gridName}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="serviceLevel"
                label="服务等级"
                rules={[{ required: true, message: '请选择服务等级' }]}
              >
                <Select placeholder="请选择服务等级">
                  <Option value="特级">特级</Option>
                  <Option value="一级">一级</Option>
                  <Option value="二级">二级</Option>
                  <Option value="三级">三级</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="manager"
                label="负责人"
                rules={[{ required: true, message: '请输入负责人姓名' }]}
              >
                <Input placeholder="请输入负责人姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contact"
                label="联系方式"
                rules={[{ required: true, message: '请输入联系方式' }]}
              >
                <Input placeholder="请输入联系方式" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="邮箱地址"
                rules={[
                  { required: true, message: '请输入邮箱地址' },
                  { type: 'email', message: '请输入正确的邮箱格式' }
                ]}
              >
                <Input placeholder="请输入邮箱地址" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="staffCount"
                label="员工数量"
                rules={[{ required: true, message: '请输入员工数量' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入员工数量" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="contractStart"
                label="合同开始日期"
                rules={[{ required: true, message: '请选择合同开始日期' }]}
              >
                <DatePicker style={{ width: '100%' }} placeholder="请选择合同开始日期" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contractEnd"
                label="合同结束日期"
                rules={[{ required: true, message: '请选择合同结束日期' }]}
              >
                <DatePicker style={{ width: '100%' }} placeholder="请选择合同结束日期" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="area"
            label="管理区域"
            rules={[{ required: true, message: '请输入管理区域' }]}
          >
            <TextArea rows={3} placeholder="请输入管理区域描述" />
          </Form.Item>

          <Form.Item
            name="address"
            label="公司地址"
            rules={[{ required: true, message: '请输入公司地址' }]}
          >
            <Input placeholder="请输入公司地址" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="businessLicense"
                label="营业执照号"
                rules={[{ required: true, message: '请输入营业执照号' }]}
              >
                <Input placeholder="请输入营业执照号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="legalPerson"
                label="法人代表"
                rules={[{ required: true, message: '请输入法人代表姓名' }]}
              >
                <Input placeholder="请输入法人代表姓名" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="registeredCapital"
                label="注册资本"
                rules={[{ required: true, message: '请输入注册资本' }]}
              >
                <Input placeholder="请输入注册资本" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="establishmentDate"
                label="成立日期"
                rules={[{ required: true, message: '请选择成立日期' }]}
              >
                <DatePicker style={{ width: '100%' }} placeholder="请选择成立日期" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="serviceArea"
                label="服务面积(㎡)"
                rules={[{ required: true, message: '请输入服务面积' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入服务面积" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="propertyFee"
                label="物业费(元/㎡)"
                rules={[{ required: true, message: '请输入物业费标准' }]}
              >
                <InputNumber min={0} step={0.1} style={{ width: '100%' }} placeholder="请输入物业费标准" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default Property;
