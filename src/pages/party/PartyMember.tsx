import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Button, Space, Modal, Form, Select, DatePicker, Tag, Row, Col, Tabs } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './PartyMember.less';
import dayjs from 'dayjs';

const { Option } = Select;
const { TabPane } = Tabs;

interface PartyMember {
  id: string;
  name: string;
  gender: string;
  age: number;
  idCard: string;
  phone: string;
  address: string;
  education: string;
  workUnit: string;
  position: string;
  joinDate: string;
  memberType: string;
  memberStatus: string;
  partyBranch: string;
  gridId: string;
  gridName: string;
  duties: string[];
  awards: string[];
}

// 模拟数据 - 党支部列表
const partyBranches = [
  '汶上县中都街道文昌社区党支部',
  '汶上县中都街道汶河社区党支部',
  '汶上县中都街道幸福社区党支部',
  '汶上县中都街道中都社区党支部',
  '汶上县中都街道望嵩社区党支部',
  '汶上县中都街道文庙社区党支部',
  '汶上县中都街道机关党支部',
  '汶上县中都街道企业联合党支部'
];

// 模拟数据 - 网格列表
const gridNames = [
  '文昌社区东区网格',
  '文昌社区西区网格',
  '汶河社区北区网格',
  '汶河社区南区网格',
  '幸福社区第一网格',
  '幸福社区第二网格',
  '中都社区中心网格',
  '中都社区外围网格',
  '望嵩社区综合网格',
  '文庙社区综合网格'
];

// 模拟数据 - 党员职务
const dutyTypes = [
  '党支部书记',
  '党支部副书记',
  '组织委员',
  '宣传委员',
  '纪检委员',
  '网格长',
  '楼栋长',
  '党小组长',
  '党建指导员'
];

// 模拟数据 - 党员荣誉
const awardTypes = [
  '优秀党员',
  '先进工作者',
  '模范党员',
  '优秀党务工作者',
  '最美志愿者',
  '党建标兵',
  '脱贫攻坚先进个人',
  '抗疫先进个人',
  '社区建设先进个人'
];

const PartyMemberPage: React.FC = () => {
  const [members, setMembers] = useState<PartyMember[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [filterBranch, setFilterBranch] = useState<string>('all');

  // 姓氏列表
  const familyNames = ['张', '李', '王', '赵', '刘', '陈', '杨', '黄', '周', '吴', '郑', '孙', '马', '朱', '胡', '林', '何', '高', '文', '汪'];

  // 模拟数据
  useEffect(() => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      const mockData: PartyMember[] = Array(240)
        .fill(0)
        .map((_, index) => {
          // 生成合理的个人信息
          const gender = index % 5 === 0 ? '女' : '男';
          const age = Math.floor(Math.random() * 50) + 25; // 25-75岁之间
          const branchIndex = Math.floor(Math.random() * partyBranches.length);
          const gridIndex = Math.floor(Math.random() * gridNames.length);
          
          // 生成姓名
          const firstName = familyNames[Math.floor(Math.random() * familyNames.length)];
          const lastName = gender === '女' ? 
            ['芳', '娜', '婷', '玲', '静', '敏', '文', '丽', '霞', '芬'][Math.floor(Math.random() * 10)] :
            ['伟', '强', '军', '杰', '明', '华', '建', '勇', '刚', '超'][Math.floor(Math.random() * 10)];
          const name = firstName + (Math.random() > 0.4 ? lastName : lastName + ['国', '民', '文', '安', '平'][Math.floor(Math.random() * 5)]);
          
          // 党员类型与状态
          const memberType = index % 15 === 0 ? '预备党员' : 
                           index % 25 === 0 ? '入党积极分子' : '正式党员';
          const memberStatus = index % 40 === 0 ? '停止党籍' : 
                             index % 30 === 0 ? '出国保留党籍' : '正常';
          
          // 工作单位与职位根据年龄和指数动态生成
          let workUnit, position, education;
          
          // 生成教育程度
          if (age > 60) {
            education = ['高中', '中专', '大专', '本科'][Math.floor(Math.random() * 4)];
          } else if (age > 40) {
            education = ['大专', '本科', '硕士'][Math.floor(Math.random() * 3)];
          } else {
            education = ['本科', '硕士', '博士'][Math.floor(Math.random() * 3)];
          }
          
          // 生成工作单位和职位
          if (age > 60) {
            workUnit = '退休';
            position = '退休人员';
          } else if (index % 10 === 0) {
            workUnit = '汶上县人民政府';
            position = ['科员', '副科长', '科长', '副局长', '局长'][Math.floor(Math.random() * 5)];
          } else if (index % 9 === 0) {
            workUnit = '汶上县教育局';
            position = ['普通教师', '教研员', '年级组长', '副校长', '校长'][Math.floor(Math.random() * 5)];
          } else if (index % 8 === 0) {
            workUnit = '汶上县卫健局';
            position = ['医生', '护士长', '科室主任', '副院长', '院长'][Math.floor(Math.random() * 5)];
          } else if (index % 7 === 0) {
            workUnit = '汶上县中都街道办事处';
            position = ['工作人员', '科员', '副主任', '主任'][Math.floor(Math.random() * 4)];
          } else if (index % 6 === 0) {
            workUnit = '汶上县公安局';
            position = ['民警', '辅警', '中队长', '副所长', '所长'][Math.floor(Math.random() * 5)];
          } else {
            const companies = ['汶上县农业发展有限公司', '汶上县商贸有限公司', '汶上县建筑工程有限公司', '汶上县交通运输有限公司', '汶上县服务业协会'];
            workUnit = companies[Math.floor(Math.random() * companies.length)];
            position = ['普通员工', '部门经理', '总监', '副总经理', '总经理'][Math.floor(Math.random() * 5)];
          }
          
          // 职务与荣誉
          const dutyCount = Math.floor(Math.random() * 3);
          const duties: string[] = [];
          for (let i = 0; i < dutyCount; i++) {
            const duty = dutyTypes[Math.floor(Math.random() * dutyTypes.length)];
            if (!duties.includes(duty)) {
              duties.push(duty);
            }
          }
          
          const awardCount = Math.floor(Math.random() * 3);
          const awards: string[] = [];
          for (let i = 0; i < awardCount; i++) {
            const award = awardTypes[Math.floor(Math.random() * awardTypes.length)];
            if (!awards.includes(award)) {
              awards.push(award);
            }
          }
          
          // 根据支部生成合适的地址
          const branchName = partyBranches[branchIndex];
          let address;
          if (branchName.includes('文昌社区')) {
            address = `汶上县中都街道文昌社区文景花园${Math.floor(Math.random() * 10) + 1}号楼${Math.floor(Math.random() * 6) + 1}单元${Math.floor(Math.random() * 30) + 101}`;
          } else if (branchName.includes('汶河社区')) {
            address = `汶上县中都街道汶河社区汶河小区${Math.floor(Math.random() * 8) + 1}号楼${Math.floor(Math.random() * 5) + 1}单元${Math.floor(Math.random() * 25) + 101}`;
          } else if (branchName.includes('幸福社区')) {
            address = `汶上县中都街道幸福社区和谐嘉园${Math.floor(Math.random() * 6) + 1}号楼${Math.floor(Math.random() * 4) + 1}单元${Math.floor(Math.random() * 32) + 101}`;
          } else if (branchName.includes('中都社区')) {
            address = `汶上县中都街道中都社区中都家园${Math.floor(Math.random() * 12) + 1}号楼${Math.floor(Math.random() * 6) + 1}单元${Math.floor(Math.random() * 28) + 101}`;
          } else if (branchName.includes('望嵩社区')) {
            address = `汶上县中都街道望嵩社区望嵩雅居${Math.floor(Math.random() * 9) + 1}号楼${Math.floor(Math.random() * 5) + 1}单元${Math.floor(Math.random() * 35) + 101}`;
          } else {
            address = `汶上县中都街道文庙社区文馨雅苑${Math.floor(Math.random() * 7) + 1}号楼${Math.floor(Math.random() * 6) + 1}单元${Math.floor(Math.random() * 30) + 101}`;
          }
          
          // 党龄在1-40年之间，越老党员党龄越长
          const partyAge = Math.min(age - 18, Math.floor(Math.random() * 40) + 1);
          const joinYear = 2023 - partyAge;
          const joinMonth = Math.floor(Math.random() * 12) + 1;
          const joinDay = Math.floor(Math.random() * 28) + 1;
          const joinDate = `${joinYear}-${joinMonth < 10 ? '0' + joinMonth : joinMonth}-${joinDay < 10 ? '0' + joinDay : joinDay}`;
          
          return {
            id: `${index + 1}`,
            name,
            gender,
            age,
            idCard: `3708${gender === '男' ? '22' : '23'}${String(1980 - 60 + age).slice(2)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(100 + Math.random() * 900)}`,
            phone: `1${Math.floor(Math.random() * 9) + 1}${Math.floor(10000000 + Math.random() * 90000000)}`,
            address,
            education,
            workUnit,
            position,
            joinDate,
            memberType,
            memberStatus,
            partyBranch: partyBranches[branchIndex],
            gridId: `G${Math.floor(Math.random() * 10) + 1}`,
            gridName: gridNames[gridIndex],
            duties,
            awards,
          };
        });
      setMembers(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const handleSearch = () => {
    // 实际项目中这里应该调用API进行搜索
  };

  const resetSearch = () => {
    setSearchText('');
    setFilterBranch('all');
    // 重新加载所有数据
  };

  const showModal = (record?: PartyMember) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue({
        ...record,
        joinDate: dayjs(record.joinDate),
      });
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = {
        ...values,
        joinDate: values.joinDate.format('YYYY-MM-DD'),
      };
      
      if (editingId) {
        // 编辑现有党员信息
        const updatedList = members.map(item => 
          item.id === editingId ? { ...formData, id: editingId } : item
        );
        setMembers(updatedList);
      } else {
        // 添加新党员信息
        const newMember = {
          ...formData,
          id: `${members.length + 1}`,
        };
        setMembers([...members, newMember]);
      }
      
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条党员信息吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const updatedList = members.filter(item => item.id !== id);
        setMembers(updatedList);
      },
    });
  };

  const getMemberTypeTag = (type: string) => {
    const colorMap: Record<string, string> = {
      '正式党员': 'red',
      '预备党员': 'orange',
      '入党积极分子': 'blue',
    };
    
    return <Tag color={colorMap[type]}>{type}</Tag>;
  };

  const getMemberStatusTag = (status: string) => {
    const colorMap: Record<string, string> = {
      '正常': 'green',
      '停止党籍': 'red',
      '出国保留党籍': 'orange',
    };
    
    return <Tag color={colorMap[status]}>{status}</Tag>;
  };

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 80,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      width: 60,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 60,
      sorter: (a: PartyMember, b: PartyMember) => a.age - b.age,
    },
    {
      title: '党员类型',
      dataIndex: 'memberType',
      key: 'memberType',
      width: 120,
      render: (text: string) => getMemberTypeTag(text),
    },
    {
      title: '党员状态',
      dataIndex: 'memberStatus',
      key: 'memberStatus',
      width: 120,
      render: (text: string) => getMemberStatusTag(text),
    },
    {
      title: '入党时间',
      dataIndex: 'joinDate',
      key: 'joinDate',
      width: 120,
      sorter: (a: PartyMember, b: PartyMember) => 
        dayjs(a.joinDate).unix() - dayjs(b.joinDate).unix(),
    },
    {
      title: '所属支部',
      dataIndex: 'partyBranch',
      key: 'partyBranch',
      width: 180,
      ellipsis: true,
    },
    {
      title: '所属网格',
      dataIndex: 'gridName',
      key: 'gridName',
      width: 150,
      ellipsis: true,
    },
    {
      title: '工作单位',
      dataIndex: 'workUnit',
      key: 'workUnit',
      width: 150,
      ellipsis: true,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
    },
    {
      title: '党内职务',
      key: 'duties',
      width: 150,
      ellipsis: true,
      render: (_: unknown, record: PartyMember) => (
        <>
          {record.duties.length > 0 ? (
            record.duties.map(duty => (
              <Tag color="blue" key={duty} style={{ marginBottom: 4 }}>
                {duty}
              </Tag>
            ))
          ) : (
            '无'
          )}
        </>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right' as const,
      render: (_: unknown, record: PartyMember) => (
        <Space size="small">
          <Button 
            type="text" 
            size="small" 
            icon={<EditOutlined />} 
            onClick={() => showModal(record)}
          />
          <Button 
            type="text" 
            size="small" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  const getFilteredData = () => {
    let filtered = [...members];
    
    // 根据标签筛选
    if (activeTab !== 'all') {
      filtered = filtered.filter(member => {
        if (activeTab === 'formal') return member.memberType === '正式党员';
        if (activeTab === 'probationary') return member.memberType === '预备党员';
        if (activeTab === 'activist') return member.memberType === '入党积极分子';
        if (activeTab === 'abnormal') return member.memberStatus !== '正常';
        if (activeTab === 'duty') return member.duties.length > 0;
        return true;
      });
    }
    
    // 搜索文本筛选
    if (searchText) {
      const text = searchText.toLowerCase();
      filtered = filtered.filter(member => 
        member.name.includes(text) || 
        member.idCard.includes(text) || 
        member.phone.includes(text) ||
        member.workUnit.includes(text) ||
        member.position.includes(text)
      );
    }
    
    // 党支部筛选
    if (filterBranch !== 'all') {
      filtered = filtered.filter(member => member.partyBranch === filterBranch);
    }
    
    return filtered;
  };

  return (
    <div className="party-member-container">
      <h1>党员管理</h1>
      
      <Card className="statistics-card">
        <Row gutter={[24, 16]}>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div className="stat-item">
              <div className="stat-number">{members.length}</div>
              <div className="stat-title">党员总数</div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div className="stat-item">
              <div className="stat-number">{members.filter(m => m.memberType === '正式党员').length}</div>
              <div className="stat-title">正式党员</div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div className="stat-item">
              <div className="stat-number">{members.filter(m => m.memberType === '预备党员').length}</div>
              <div className="stat-title">预备党员</div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div className="stat-item">
              <div className="stat-number">{members.filter(m => m.memberType === '入党积极分子').length}</div>
              <div className="stat-title">入党积极分子</div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div className="stat-item">
              <div className="stat-number">{members.filter(m => m.duties.length > 0).length}</div>
              <div className="stat-title">有党内职务</div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div className="stat-item">
              <div className="stat-number">{members.filter(m => m.memberStatus !== '正常').length}</div>
              <div className="stat-title">非正常状态</div>
            </div>
          </Col>
        </Row>
      </Card>
      
      <Card className="search-card">
        <div className="search-container">
          <Input.Group compact>
            <Input
              placeholder="姓名/身份证/电话/工作单位"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 220 }}
              prefix={<SearchOutlined />}
            />
            <Select 
              placeholder="选择党支部"
              style={{ width: 220 }}
              value={filterBranch}
              onChange={value => setFilterBranch(value)}
            >
              <Option value="all">全部党支部</Option>
              {partyBranches.map(branch => (
                <Option key={branch} value={branch}>{branch}</Option>
              ))}
            </Select>
          </Input.Group>
          <div className="search-actions">
            <Button type="primary" onClick={handleSearch}>搜索</Button>
            <Button style={{ marginLeft: 8 }} onClick={resetSearch}>重置</Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => showModal()}
              style={{ marginLeft: 16 }}
            >
              添加党员
            </Button>
          </div>
        </div>
      </Card>
      
      <Card className="table-card">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="全部党员" key="all" />
          <TabPane tab="正式党员" key="formal" />
          <TabPane tab="预备党员" key="probationary" />
          <TabPane tab="入党积极分子" key="activist" />
          <TabPane tab="有党内职务" key="duty" />
          <TabPane tab="非正常状态" key="abnormal" />
        </Tabs>
        
        <Table
          columns={columns}
          dataSource={getFilteredData()}
          rowKey="id"
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showQuickJumper: true, 
            showTotal: total => `共 ${total} 条记录` 
          }}
          scroll={{ x: 1500 }}
        />
      </Card>
      
      <Modal
        title={editingId ? '编辑党员信息' : '添加党员信息'}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="name"
                label="姓名"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input placeholder="请输入姓名" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="gender"
                label="性别"
                rules={[{ required: true, message: '请选择性别' }]}
              >
                <Select placeholder="请选择性别">
                  <Option value="男">男</Option>
                  <Option value="女">女</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="age"
                label="年龄"
                rules={[{ required: true, message: '请输入年龄' }]}
              >
                <Input type="number" placeholder="请输入年龄" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="idCard"
                label="身份证号"
                rules={[{ required: true, message: '请输入身份证号' }]}
              >
                <Input placeholder="请输入身份证号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="联系电话"
                rules={[{ required: true, message: '请输入联系电话' }]}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="workUnit"
                label="工作单位"
                rules={[{ required: true, message: '请输入工作单位' }]}
              >
                <Input placeholder="请输入工作单位" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="position"
                label="职务"
                rules={[{ required: true, message: '请输入职务' }]}
              >
                <Input placeholder="请输入职务" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="education"
                label="学历"
                rules={[{ required: true, message: '请选择学历' }]}
              >
                <Select placeholder="请选择学历">
                  <Option value="初中">初中</Option>
                  <Option value="高中">高中</Option>
                  <Option value="中专">中专</Option>
                  <Option value="大专">大专</Option>
                  <Option value="本科">本科</Option>
                  <Option value="硕士">硕士</Option>
                  <Option value="博士">博士</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="memberType"
                label="党员类型"
                rules={[{ required: true, message: '请选择党员类型' }]}
              >
                <Select placeholder="请选择党员类型">
                  <Option value="正式党员">正式党员</Option>
                  <Option value="预备党员">预备党员</Option>
                  <Option value="入党积极分子">入党积极分子</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="memberStatus"
                label="党员状态"
                rules={[{ required: true, message: '请选择党员状态' }]}
              >
                <Select placeholder="请选择党员状态">
                  <Option value="正常">正常</Option>
                  <Option value="停止党籍">停止党籍</Option>
                  <Option value="出国保留党籍">出国保留党籍</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="partyBranch"
                label="所属党支部"
                rules={[{ required: true, message: '请选择所属党支部' }]}
              >
                <Select placeholder="请选择所属党支部">
                  {partyBranches.map(branch => (
                    <Option key={branch} value={branch}>{branch}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="gridName"
                label="所属网格"
                rules={[{ required: true, message: '请选择所属网格' }]}
              >
                <Select placeholder="请选择所属网格">
                  {gridNames.map(grid => (
                    <Option key={grid} value={grid}>{grid}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="joinDate"
                label="入党时间"
                rules={[{ required: true, message: '请选择入党时间' }]}
              >
                <DatePicker style={{ width: '100%' }} placeholder="请选择入党时间" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="address"
                label="家庭住址"
                rules={[{ required: true, message: '请输入家庭住址' }]}
              >
                <Input placeholder="请输入家庭住址" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="duties"
                label="党内职务"
              >
                <Select mode="multiple" placeholder="请选择党内职务">
                  {dutyTypes.map(duty => (
                    <Option key={duty} value={duty}>{duty}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="awards"
                label="所获荣誉"
              >
                <Select mode="multiple" placeholder="请选择所获荣誉">
                  {awardTypes.map(award => (
                    <Option key={award} value={award}>{award}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default PartyMemberPage; 