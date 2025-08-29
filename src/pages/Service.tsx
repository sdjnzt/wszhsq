import React from 'react';
import { Card, Tabs, Table, Button, Badge, Tag } from 'antd';
import { UserOutlined, HeartOutlined, HomeOutlined, BankOutlined, MedicineBoxOutlined, FileTextOutlined, QuestionCircleOutlined, AudioOutlined, ToolOutlined, BellOutlined } from '@ant-design/icons';
import './Service.less';
import { desensitizePhoneNumber } from '../utils/desensitization';

const { TabPane } = Tabs;

const Service: React.FC = () => {
  // 养老服务 - 老人信息数据
  const elderlyData = [
    { 
      key: '1', 
      name: '王长清', 
      gender: '男', 
      age: 78, 
      address: '汶上县中都街道文昌社区文景花园3栋2单元101', 
      healthStatus: '良好',
      careLevel: '普通关怀',
      emergencyContact: '王小明 (儿子) 13812345678' 
    },
    { 
      key: '2', 
      name: '张桂芝', 
      gender: '女', 
      age: 82, 
      address: '汶上县中都街道汶河社区汶河小区1栋3单元203', 
      healthStatus: '高血压',
      careLevel: '重点关怀',
      emergencyContact: '张华 (女儿) 13987654321' 
    },
    { 
      key: '3', 
      name: '李德华', 
      gender: '男', 
      age: 75, 
      address: '汶上县中都街道幸福社区和谐嘉园5栋1单元502', 
      healthStatus: '糖尿病',
      careLevel: '重点关怀',
      emergencyContact: '李明 (儿子) 13765432198' 
    },
    { 
      key: '4', 
      name: '刘秀英', 
      gender: '女', 
      age: 72, 
      address: '汶上县中都街道文昌社区文景花园2栋2单元302', 
      healthStatus: '良好',
      careLevel: '普通关怀',
      emergencyContact: '刘强 (儿子) 13567891234' 
    },
    { 
      key: '5', 
      name: '赵福元', 
      gender: '男', 
      age: 85, 
      address: '汶上县中都街道中都社区中都家园1栋3单元401', 
      healthStatus: '心脏病',
      careLevel: '特别关怀',
      emergencyContact: '赵丽 (女儿) 13387654321' 
    },
    { 
      key: '6', 
      name: '孙玉兰', 
      gender: '女', 
      age: 79, 
      address: '汶上县中都街道望嵩社区望嵩雅居4栋2单元201', 
      healthStatus: '骨质疏松',
      careLevel: '重点关怀',
      emergencyContact: '孙建国 (儿子) 13523456789' 
    },
    { 
      key: '7', 
      name: '陈宝山', 
      gender: '男', 
      age: 90, 
      address: '汶上县中都街道文庙社区文馨雅苑2栋4单元102', 
      healthStatus: '高龄弱视',
      careLevel: '特别关怀',
      emergencyContact: '陈月 (孙女) 13612345678' 
    },
    { 
      key: '8', 
      name: '杨桂香', 
      gender: '女', 
      age: 76, 
      address: '汶上县中都街道汶河社区汶兴小区3栋1单元404', 
      healthStatus: '关节炎',
      careLevel: '普通关怀',
      emergencyContact: '杨国忠 (儿子) 13876543210' 
    },
  ];

  // 表格列定义 - 老人信息
  const elderlyColumns = [
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
      title: '住址',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
      width: 300,
    },
    {
      title: '健康状况',
      dataIndex: 'healthStatus',
      key: 'healthStatus',
      render: (status: string) => {
        const color = status === '良好' ? 'green' : 
                      status === '高龄弱视' || status === '心脏病' ? 'red' : 'orange';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: '关怀级别',
      dataIndex: 'careLevel',
      key: 'careLevel',
      render: (level: string) => {
        const color = level === '普通关怀' ? 'blue' : 
                      level === '重点关怀' ? 'orange' : 'red';
        return <Tag color={color}>{level}</Tag>;
      }
    },
    {
      title: '紧急联系人',
      dataIndex: 'emergencyContact',
      key: 'emergencyContact',
      render: (text: string) => {
        // 提取姓名、关系和电话号码
        const match = text.match(/^(.+?)\s*\((.+?)\)\s*(.+)$/);
        if (match) {
          const [, name, relationship, phone] = match;
          return (
            <span>
              {name} ({relationship}) {desensitizePhoneNumber(phone)}
            </span>
          );
        }
        // 如果没有匹配到标准格式，直接返回原文本
        return text;
      }
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <span>
          <Button type="link" size="small">详情</Button>
          <Button type="link" size="small">编辑</Button>
        </span>
      ),
    },
  ];

  // 物业管理数据 - 基于网格的统一管理
  const propertyCompanies = [
    { 
      key: '1', 
      name: '汶上安居物业服务有限公司', 
      companyCode: 'WSAJ001',
      area: '文昌社区文景花园、中都社区中都家园', 
      gridId: '中都花园A区网格',
      manager: '张伟', 
      contact: '13912345678',
      email: 'wsaij001@example.com',
      address: '汶上县中都街道文昌社区文景花园物业服务中心',
      rating: '4.5分',
      status: '正常',
      contractStart: '2023-01-01',
      contractEnd: '2025-08-31',
      serviceLevel: '一级',
      staffCount: 45,
      apiStatus: '已对接',
      wechatStatus: '已开通',
      hardwareStatus: '已接入'
    },
    { 
      key: '2', 
      name: '汶上宜家物业管理公司', 
      companyCode: 'WSYJ002',
      area: '汶河社区汶河小区、幸福社区和谐嘉园', 
      gridId: '中都花园B区网格',
      manager: '李强', 
      contact: '13887654321',
      email: 'wsyij002@example.com',
      address: '汶上县中都街道汶河社区汶河小区物业服务中心',
      rating: '4.2分',
      status: '正常',
      contractStart: '2023-03-01',
      contractEnd: '2026-02-28',
      serviceLevel: '二级',
      staffCount: 38,
      apiStatus: '已对接',
      wechatStatus: '已开通',
      hardwareStatus: '已接入'
    },
    { 
      key: '3', 
      name: '中都家园物业服务中心', 
      companyCode: 'ZDJY003',
      area: '望嵩社区望嵩雅居、文庙社区文馨雅苑', 
      gridId: '中都花园C区网格',
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
      hardwareStatus: '已接入'
    },
    { 
      key: '4', 
      name: '汶上县兴旺物业管理有限公司', 
      companyCode: 'WSXW004',
      area: '汶河社区汶兴小区', 
      gridId: '中都花园D区网格',
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
      hardwareStatus: '未接入'
    },
    { 
      key: '5', 
      name: '和信物业服务有限公司', 
      companyCode: 'HXWY005',
      area: '幸福社区幸福小区、康乐小区', 
      gridId: '中都花园E区网格',
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
      hardwareStatus: '已接入'
    },
    { 
      key: '6', 
      name: '中都智慧物业服务有限公司', 
      companyCode: 'ZDZH006',
      area: '中都花园F区、G区、H区', 
      gridId: '中都花园F区网格',
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
      hardwareStatus: '已接入'
    },
  ];

  // 物业公司表格列定义 - 增强版
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
      width: 200,
      render: () => (
        <span>
          <Button type="link" size="small">详情</Button>
          <Button type="link" size="small">编辑</Button>
          <Button type="link" size="small">接口</Button>
          <Button type="link" size="small">微信</Button>
        </span>
      ),
    },
  ];

  // 便民服务数据
  const convenienceServices = [
    {
      icon: <BankOutlined />,
      name: '水电气缴费',
      description: '社区提供水费、电费、燃气费代收代缴服务',
      location: '便民服务中心1号窗口',
      time: '每周一至周五 9:00-17:00'
    },
    {
      icon: <FileTextOutlined />,
      name: '证件办理',
      description: '居民身份证、户口本等证件办理和咨询服务',
      location: '便民服务中心2号窗口',
      time: '每周一至周五 9:00-17:00'
    },
    {
      icon: <BellOutlined />,
      name: '社区公告',
      description: '发布社区重要通知、政策宣传、活动信息等',
      location: '各小区公告栏、社区微信群',
      time: '全天'
    },
    {
      icon: <MedicineBoxOutlined />,
      name: '健康咨询',
      description: '提供基础医疗咨询、血压测量等健康服务',
      location: '社区卫生服务站',
      time: '每周一至周五 8:30-17:30'
    },
    {
      icon: <QuestionCircleOutlined />,
      name: '法律援助',
      description: '提供法律咨询、纠纷调解等服务',
      location: '便民服务中心3号窗口',
      time: '每周二、周四 14:00-17:00'
    },
    {
      icon: <AudioOutlined />,
      name: '文化活动',
      description: '组织社区文艺演出、知识讲座、兴趣小组等活动',
      location: '社区文化活动中心',
      time: '每周末 9:00-17:00'
    },
    {
      icon: <ToolOutlined />,
      name: '便民维修',
      description: '提供小型家电维修、水电维修等服务',
      location: '便民服务中心后院',
      time: '每周一、三、五 9:00-16:00'
    },
    {
      icon: <UserOutlined />,
      name: '志愿服务',
      description: '组织社区志愿者活动，关爱特殊群体',
      location: '社区党群服务中心',
      time: '每周六 9:00-12:00'
    }
  ];

  return (
    <div className="service-container">
      <h1>服务管理</h1>
      
      <Tabs defaultActiveKey="1">
        <TabPane 
          tab={<span><HeartOutlined /> 养老服务</span>}
          key="1"
        >
          <Card title="老人信息管理" className="table-card">
            <div className="table-operations">
              <Button type="primary">添加老人</Button>
              <Button>批量导入</Button>
              <Button>导出数据</Button>
            </div>
            <Table 
              columns={elderlyColumns} 
              dataSource={elderlyData} 
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1200 }}
            />
          </Card>
        </TabPane>
        
        <TabPane 
          tab={<span><HomeOutlined /> 物业管理</span>}
          key="2"
        >
          <Card title="物业公司管理" className="table-card">
            <div className="table-operations">
              <Button type="primary">添加物业公司</Button>
              <Button>批量导入</Button>
              <Button>导出数据</Button>
            </div>
            <Table 
              columns={propertyColumns} 
              dataSource={propertyCompanies} 
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1200 }}
            />
          </Card>
        </TabPane>
        
        <TabPane 
          tab={<span><UserOutlined /> 便民服务</span>}
          key="3"
        >
          <Card className="service-card">
            <div className="service-grid">
              {convenienceServices.map((service, index) => (
                <div className="service-item" key={index}>
                  <div className="service-icon">
                    {service.icon}
                  </div>
                  <div className="service-info">
                    <div className="service-name">{service.name}</div>
                    <div className="service-desc">{service.description}</div>
                    <div className="service-meta">
                      <div><strong>地点：</strong>{service.location}</div>
                      <div><strong>时间：</strong>{service.time}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Service; 