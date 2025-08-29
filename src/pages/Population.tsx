import React, { useState } from 'react';
import { Card, Tabs, Table, Tag, Button, Input, Select, Row, Col, Statistic, Badge, Modal, Form, message, Popconfirm, Tooltip, Space, Avatar, Upload } from 'antd';
import { SearchOutlined, DownloadOutlined, UserAddOutlined, UserOutlined, TeamOutlined, HomeOutlined, EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import './Population.less';
import { desensitizeIdCard, desensitizePhoneNumber } from '../utils/desensitization';

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

// 定义人口数据类型
interface Person {
  id: number;
  name: string;
  gender: string;
  age: number;
  idCard: string;
  phone: string;
  address: string;
  houseType: string;
  household: string;
  specialTags: string[];
  gridId: number;
  occupation?: string;
  education?: string;
  avatar?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  healthStatus?: string;
  notes?: string;
}

// 区域名称 - 基于实际社区结构
const areaNames = ['中都花园A区', '中都花园B区', '中都花园C区', '中都花园D区', '中都花园E区', '中都花园F区', '中都花园G区', '中都花园H区'];
// 楼栋名称 - 更真实的楼栋命名
const buildingNames = ['中都花园1栋', '中都花园2栋', '中都花园3栋', '中都花园4栋', '中都花园5栋', '中都花园6栋', '中都花园7栋', '中都花园8栋', '中都花园9栋', '中都花园10栋', '中都花园11栋', '中都花园12栋', '中都花园13栋', '中都花园14栋', '中都花园15栋', '中都花园16栋', '中都花园17栋', '中都花园18栋', '中都花园19栋', '中都花园20栋'];

// 姓氏 - 更真实的姓氏分布
const familyNames = ['张', '李', '王', '赵', '刘', '陈', '杨', '黄', '周', '吴', '郑', '孙', '马', '朱', '胡', '林', '何', '郭', '高', '罗', '梁', '宋', '谢', '唐', '韩', '曹', '许', '邓', '萧', '冯', '曾', '程', '蔡', '彭', '潘', '袁', '于', '董', '余', '苏', '叶', '吕', '魏', '蒋', '田', '杜', '丁', '沈', '姜', '范'];

// 模拟人口数据 - 基于大型社区实际规模
const populationData: Person[] = Array(25000).fill(null).map((_, index) => {
  const gender = index % 3 === 0 ? '女' : '男';
  const age = Math.floor(Math.random() * 85) + 1;
  const areaIndex = Math.floor(Math.random() * areaNames.length);
  const buildingIndex = Math.floor(Math.random() * buildingNames.length);
  const familyNameIndex = Math.floor(Math.random() * familyNames.length);
  
  // 生成姓名 - 更真实的姓名组合
  const firstName = familyNames[familyNameIndex];
  const lastName = gender === '女' ? 
    ['芳', '娜', '婷', '玲', '静', '敏', '文', '丽', '霞', '芬', '燕', '红', '梅', '兰', '菊', '竹', '英', '华', '秀', '珍', '珠', '玉', '琴', '香', '春', '夏', '秋', '冬', '月', '星', '云', '雨', '雪', '风', '花', '草', '树', '山', '水', '火', '土', '金', '木', '火', '土', '金', '木', '火', '土', '金'][Math.floor(Math.random() * 50)] :
    ['伟', '强', '军', '杰', '明', '华', '建', '勇', '刚', '超', '斌', '波', '涛', '磊', '雷', '峰', '山', '川', '河', '海', '天', '地', '日', '月', '星', '云', '风', '雨', '雪', '霜', '露', '雾', '霞', '虹', '光', '影', '声', '色', '味', '香', '甜', '苦', '辣', '酸', '咸', '淡', '浓', '厚', '薄', '深'][Math.floor(Math.random() * 50)];
  const name = firstName + (Math.random() > 0.2 ? lastName : lastName + ['国', '民', '文', '安', '平', '和', '顺', '康', '泰', '福', '寿', '喜', '乐', '欢', '笑', '歌', '舞', '诗', '书', '画', '琴', '棋', '剑', '刀', '枪', '炮', '车', '马', '象', '士', '将', '帅', '兵', '卒', '炮', '车', '马', '象', '士', '将', '帅', '兵', '卒', '炮', '车', '马', '象', '士', '将'][Math.floor(Math.random() * 50)]);
  
  // 生成住址 - 更真实的地址结构
  const area = areaNames[areaIndex];
  const building = buildingNames[buildingIndex];
  const unit = Math.floor(Math.random() * 8) + 1;
  const room = Math.floor(Math.random() * 20) + 1;
  const floor = Math.floor(Math.random() * 18) + 1;
  const roomNumber = `${floor}0${room}`; 
  const address = `汶上县中都街道${area}${building}${unit}单元${roomNumber}`;
  
  // 根据年龄生成合适的职业 - 更真实的职业分布
  let occupation;
  if (age < 6) {
    occupation = '学龄前';
  } else if (age < 18) {
    occupation = age < 12 ? '小学生' : '中学生';
  } else if (age > 60) {
    occupation = '退休';
  } else {
    occupation = ['公务员', '教师', '医生', '护士', '工程师', '技术员', '工人', '农民', '个体户', '企业员工', '销售员', '司机', '服务员', '厨师', '保安', '清洁工', '快递员', '外卖员', '网约车司机', '自由职业', '无业', '学生'][Math.floor(Math.random() * 22)];
  }
  
  // 根据年龄生成合适的教育程度 - 更真实的教育分布
  let education;
  if (age < 6) {
    education = '无';
  } else if (age < 12) {
    education = '小学';
  } else if (age < 16) {
    education = '初中';
  } else if (age < 19) {
    education = '高中';
  } else {
    education = ['高中', '中专', '大专', '本科', '硕士', '博士'][Math.floor(Math.random() * (age > 35 ? 4 : 6))];
  }
  
  // 生成特殊标签 - 更真实的特殊人群分布
  const specialTags: string[] = [];
  if (index % 200 === 0) specialTags.push('精神病患者');
  if (index % 300 === 0) specialTags.push('刑满释放人员');
  if (index % 400 === 0) specialTags.push('社区矫正人员');
  if (index % 500 === 0) specialTags.push('吸毒人员');
  if (age < 18 && index % 100 === 0) specialTags.push('重点青少年');
  if (age > 60 && index % 50 === 0) specialTags.push('孤寡老人');
  if (age > 80) specialTags.push('高龄老人');
  if (index % 150 === 0) specialTags.push('优抚对象');
  if (index % 200 === 0) specialTags.push('低保户');
  if (index % 100 === 0) specialTags.push('残疾人');
  if (index % 120 === 0) specialTags.push('慢性病患者');
  if (index % 80 === 0) specialTags.push('独居老人');
  if (index % 90 === 0) specialTags.push('留守儿童');
  if (index % 110 === 0) specialTags.push('流动人口');
  
  return {
    id: index + 1,
    name,
    gender,
    age,
    idCard: `3708${gender === '男' ? '22' : '23'}${String(1980 - 60 + age).slice(2)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(100 + Math.random() * 900)}`,
    phone: `1${Math.floor(Math.random() * 9) + 1}${Math.floor(10000000 + Math.random() * 90000000)}`,
    address,
    houseType: ['自有住房', '租赁住房', '集体宿舍', '其他'][Math.floor(Math.random() * 4)],
    household: ['本地户籍', '省内户籍', '省外户籍'][Math.floor(Math.random() * 3)],
    specialTags,
    gridId: Math.floor(index / 3125) % 8 + 1,
    occupation,
    education,
    avatar: `https://xsgames.co/randomusers/assets/avatars/${gender === '女' ? 'female' : 'male'}/${index % 70}.jpg`,
    emergencyContact: familyNames[Math.floor(Math.random() * familyNames.length)] + '某',
    emergencyPhone: `1${Math.floor(Math.random() * 9) + 1}${Math.floor(10000000 + Math.random() * 90000000)}`,
    healthStatus: ['健康', '一般', '慢性病', '残疾'][Math.floor(Math.random() * 4)],
    notes: index % 100 === 0 ? '需要特别关注' : ''
  };
});

const Population: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchText, setSearchText] = useState('');
  const [filterArea, setFilterArea] = useState('all');
  const [filterAge, setFilterAge] = useState('all');
  const [filterGender, setFilterGender] = useState('all');
  
  // 弹窗状态
  const [personModalVisible, setPersonModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  
  // 表单数据
  const [personForm] = Form.useForm();
  
  // 当前操作的数据
  const [currentPerson, setCurrentPerson] = useState<Person | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Person | null>(null);

  // 筛选数据
  const getFilteredData = () => {
    let filtered = [...populationData];
    
    // 搜索筛选
    if (searchText) {
      const text = searchText.toLowerCase();
      filtered = filtered.filter(person => 
        person.name.toLowerCase().includes(text) || 
        person.idCard.includes(text) ||
        person.phone.includes(text) ||
        person.address.toLowerCase().includes(text)
      );
    }
    
    // 区域筛选
    if (filterArea !== 'all') {
      filtered = filtered.filter(person => person.address.includes(filterArea));
    }
    
    // 年龄筛选
    if (filterAge !== 'all') {
      switch (filterAge) {
        case 'child':
          filtered = filtered.filter(person => person.age < 18);
          break;
        case 'adult':
          filtered = filtered.filter(person => person.age >= 18 && person.age < 60);
          break;
        case 'elderly':
          filtered = filtered.filter(person => person.age >= 60);
          break;
      }
    }
    
    // 性别筛选
    if (filterGender !== 'all') {
      filtered = filtered.filter(person => person.gender === filterGender);
    }
    
    return filtered;
  };

  // 新增人口
  const handleAddPerson = () => {
    setCurrentPerson(null);
    personForm.resetFields();
    setPersonModalVisible(true);
  };

  // 编辑人口
  const handleEditPerson = (record: Person) => {
    setCurrentPerson(record);
    personForm.setFieldsValue(record);
    setPersonModalVisible(true);
  };

  // 保存人口信息
  const handleSavePerson = async () => {
    try {
      const values = await personForm.validateFields();
      if (currentPerson) {
        message.success('人口信息更新成功');
      } else {
        message.success('人口信息添加成功');
      }
      setPersonModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 查看详情
  const handleViewDetail = (record: Person) => {
    setCurrentPerson(record);
    setDetailModalVisible(true);
  };

  // 删除确认
  const handleDelete = (record: Person) => {
    setDeleteTarget(record);
    setDeleteModalVisible(true);
  };

  // 执行删除
  const confirmDelete = () => {
    if (deleteTarget) {
      message.success('删除成功');
      setDeleteModalVisible(false);
      setDeleteTarget(null);
    }
  };

  // 导出数据
  const handleExport = () => {
    message.success('数据导出成功');
  };

  // 批量导入
  const handleImport = () => {
    message.success('数据导入成功');
  };

  // 表格列定义
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Person) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={record.avatar} style={{ marginRight: 8 }} />
          {text}
        </div>
      )
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender: string) => (
        <Tag color={gender === '男' ? 'blue' : 'pink'}>{gender}</Tag>
      )
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      sorter: (a: Person, b: Person) => a.age - b.age,
    },
    {
      title: '身份证号',
      dataIndex: 'idCard',
      key: 'idCard',
      render: (text: string) => desensitizeIdCard(text)
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      render: (text: string) => desensitizePhoneNumber(text)
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: '房屋类型',
      dataIndex: 'houseType',
      key: 'houseType',
      render: (type: string) => {
        const color = 
          type === '自有住房' ? 'green' : 
          type === '租赁住房' ? 'blue' : 
          type === '集体宿舍' ? 'orange' : 'default';
        return <Tag color={color}>{type}</Tag>;
      }
    },
    {
      title: '户籍类型',
      dataIndex: 'household',
      key: 'household',
      render: (type: string) => {
        const color = 
          type === '本地户籍' ? 'green' : 
          type === '省内户籍' ? 'blue' : 'orange';
        return <Tag color={color}>{type}</Tag>;
      }
    },
    {
      title: '特殊标签',
      dataIndex: 'specialTags',
      key: 'specialTags',
      render: (tags: string[]) => (
        <div>
          {tags.map(tag => (
            <Tag key={tag} color="red" style={{ marginBottom: 4 }}>{tag}</Tag>
          ))}
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: Person) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>查看</Button>
          </Tooltip>
          <Tooltip title="编辑信息">
            <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEditPerson(record)}>编辑</Button>
          </Tooltip>
          <Tooltip title="删除记录">
            <Popconfirm
              title="确定要删除这条人口记录吗？"
              onConfirm={() => handleDelete(record)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="text" size="small" icon={<DeleteOutlined />} danger>删除</Button>
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 统计数据
  const totalPopulation = populationData.length;
  const maleCount = populationData.filter(p => p.gender === '男').length;
  const femaleCount = populationData.filter(p => p.gender === '女').length;
  const childCount = populationData.filter(p => p.age < 18).length;
  const adultCount = populationData.filter(p => p.age >= 18 && p.age < 60).length;
  const elderlyCount = populationData.filter(p => p.age >= 60).length;
  const localHouseholdCount = populationData.filter(p => p.household === '本地户籍').length;
  const specialPersonCount = populationData.filter(p => p.specialTags.length > 0).length;

  return (
    <div className="population-container">
      <h1>人口管理</h1>
      
      <Row gutter={[16, 16]} className="stat-overview">
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic 
              title="总人口数" 
              value={totalPopulation} 
              prefix={<UserOutlined />} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic 
              title="男性人口" 
              value={maleCount} 
              prefix={<TeamOutlined />} 
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic 
              title="女性人口" 
              value={femaleCount} 
              prefix={<TeamOutlined />} 
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic 
              title="本地户籍" 
              value={localHouseholdCount} 
              prefix={<HomeOutlined />} 
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="stat-overview">
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic 
              title="未成年人口" 
              value={childCount} 
              prefix={<UserOutlined />} 
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic 
              title="成年人口" 
              value={adultCount} 
              prefix={<UserOutlined />} 
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic 
              title="老年人口" 
              value={elderlyCount} 
              prefix={<UserOutlined />} 
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic 
              title="重点人员" 
              value={specialPersonCount} 
              prefix={<UserOutlined />} 
              valueStyle={{ color: '#fa541c' }}
            />
          </Card>
        </Col>
      </Row>

      <Card className="table-card">
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          tabBarExtraContent={
            <div className="table-actions">
              <Input.Group compact>
                <Input 
                  placeholder="搜索姓名、身份证、电话..." 
                  onChange={e => setSearchText(e.target.value)} 
                  style={{ width: 250 }}
                  prefix={<SearchOutlined />}
                />
                <Select 
                  defaultValue="all" 
                  style={{ width: 120 }} 
                  onChange={value => setFilterArea(value)}
                >
                  <Option value="all">全部区域</Option>
                  {areaNames.map(area => (
                    <Option key={area} value={area}>{area}</Option>
                  ))}
                </Select>
                <Select 
                  defaultValue="all" 
                  style={{ width: 100 }} 
                  onChange={value => setFilterAge(value)}
                >
                  <Option value="all">全部年龄</Option>
                  <Option value="child">未成年</Option>
                  <Option value="adult">成年</Option>
                  <Option value="elderly">老年</Option>
                </Select>
                <Select 
                  defaultValue="all" 
                  style={{ width: 80 }} 
                  onChange={value => setFilterGender(value)}
                >
                  <Option value="all">全部</Option>
                  <Option value="男">男</Option>
                  <Option value="女">女</Option>
                </Select>
              </Input.Group>
              <Button type="primary" icon={<UserAddOutlined />} onClick={handleAddPerson}>新增人口</Button>
              <Button icon={<UploadOutlined />} onClick={handleImport}>批量导入</Button>
              <Button icon={<DownloadOutlined />} onClick={handleExport}>导出数据</Button>
            </div>
          }
        >
          <TabPane tab="人口概览" key="overview">
            <div className="population-overview">
              <div className="age-distribution">
                <h3>年龄分布</h3>
                <Row gutter={[16, 16]}>
                  <Col span={6}>
                    <Card title="0-17岁" bordered={false} size="small">
                      <Statistic value={childCount} suffix="人" />
                      <div style={{ color: '#999', fontSize: '12px' }}>
                        占比 {((childCount / totalPopulation) * 100).toFixed(1)}%
                      </div>
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card title="18-59岁" bordered={false} size="small">
                      <Statistic value={adultCount} suffix="人" />
                      <div style={{ color: '#999', fontSize: '12px' }}>
                        占比 {((adultCount / totalPopulation) * 100).toFixed(1)}%
                      </div>
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card title="60-79岁" bordered={false} size="small">
                      <Statistic value={elderlyCount - populationData.filter(p => p.age >= 80).length} suffix="人" />
                      <div style={{ color: '#999', fontSize: '12px' }}>
                        占比 {(((elderlyCount - populationData.filter(p => p.age >= 80).length) / totalPopulation) * 100).toFixed(1)}%
                      </div>
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card title="80岁以上" bordered={false} size="small">
                      <Statistic value={populationData.filter(p => p.age >= 80).length} suffix="人" />
                      <div style={{ color: '#999', fontSize: '12px' }}>
                        占比 {((populationData.filter(p => p.age >= 80).length / totalPopulation) * 100).toFixed(1)}%
                      </div>
                    </Card>
                  </Col>
                </Row>
              </div>
              
              <div className="household-distribution">
                <h3>户籍分布</h3>
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Card title="本地户籍" bordered={false} size="small">
                      <Statistic value={localHouseholdCount} suffix="人" />
                      <div style={{ color: '#999', fontSize: '12px' }}>
                        占比 {((localHouseholdCount / totalPopulation) * 100).toFixed(1)}%
                      </div>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card title="省内户籍" bordered={false} size="small">
                      <Statistic value={populationData.filter(p => p.household === '省内户籍').length} suffix="人" />
                      <div style={{ color: '#999', fontSize: '12px' }}>
                        占比 {((populationData.filter(p => p.household === '省内户籍').length / totalPopulation) * 100).toFixed(1)}%
                      </div>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card title="省外户籍" bordered={false} size="small">
                      <Statistic value={populationData.filter(p => p.household === '省外户籍').length} suffix="人" />
                      <div style={{ color: '#999', fontSize: '12px' }}>
                        占比 {((populationData.filter(p => p.household === '省外户籍').length / totalPopulation) * 100).toFixed(1)}%
                      </div>
                    </Card>
                  </Col>
                </Row>
              </div>
            </div>
          </TabPane>
          <TabPane tab="人口列表" key="list">
            <Table 
              columns={columns} 
              dataSource={getFilteredData()}
              rowKey="id"
              pagination={{
                pageSize: 20,
                showQuickJumper: true,
                showSizeChanger: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
              }}
              scroll={{ x: 1200 }}
            />
          </TabPane>
          <TabPane tab="重点人员" key="special">
            <Table 
              columns={columns.filter(col => col.key !== 'specialTags')} 
              dataSource={getFilteredData().filter(p => p.specialTags.length > 0)}
              rowKey="id"
              pagination={{
                pageSize: 20,
                showQuickJumper: true,
                showSizeChanger: true,
              }}
              scroll={{ x: 1200 }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 人口信息弹窗 */}
      <Modal
        title={currentPerson ? '编辑人口信息' : '新增人口信息'}
        open={personModalVisible}
        onOk={handleSavePerson}
        onCancel={() => setPersonModalVisible(false)}
        width={800}
      >
        <Form form={personForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
                <Input placeholder="请输入姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="gender" label="性别" rules={[{ required: true, message: '请选择性别' }]}>
                <Select placeholder="请选择性别">
                  <Option value="男">男</Option>
                  <Option value="女">女</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="age" label="年龄" rules={[{ required: true, message: '请输入年龄' }]}>
                <Input type="number" placeholder="请输入年龄" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="idCard" label="身份证号" rules={[{ required: true, message: '请输入身份证号' }]}>
                <Input placeholder="请输入身份证号" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="phone" label="联系电话" rules={[{ required: true, message: '请输入联系电话' }]}>
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="emergencyPhone" label="紧急联系人电话">
                <Input placeholder="请输入紧急联系人电话" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="houseType" label="房屋类型" rules={[{ required: true, message: '请选择房屋类型' }]}>
                <Select placeholder="请选择房屋类型">
                  <Option value="自有住房">自有住房</Option>
                  <Option value="租赁住房">租赁住房</Option>
                  <Option value="集体宿舍">集体宿舍</Option>
                  <Option value="其他">其他</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="household" label="户籍类型" rules={[{ required: true, message: '请选择户籍类型' }]}>
                <Select placeholder="请选择户籍类型">
                  <Option value="本地户籍">本地户籍</Option>
                  <Option value="省内户籍">省内户籍</Option>
                  <Option value="省外户籍">省外户籍</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="occupation" label="职业">
                <Input placeholder="请输入职业" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="education" label="教育程度">
                <Select placeholder="请选择教育程度">
                  <Option value="无">无</Option>
                  <Option value="小学">小学</Option>
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
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="emergencyContact" label="紧急联系人">
                <Input placeholder="请输入紧急联系人姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="healthStatus" label="健康状况">
                <Select placeholder="请选择健康状况">
                  <Option value="健康">健康</Option>
                  <Option value="一般">一般</Option>
                  <Option value="慢性病">慢性病</Option>
                  <Option value="残疾">残疾</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="address" label="详细地址" rules={[{ required: true, message: '请输入详细地址' }]}>
            <TextArea rows={2} placeholder="请输入详细地址" />
          </Form.Item>
          <Form.Item name="notes" label="备注">
            <TextArea rows={2} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 详情弹窗 */}
      <Modal
        title="人口详细信息"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>关闭</Button>
        ]}
        width={600}
      >
        {currentPerson && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <Avatar size={80} src={currentPerson.avatar} />
              <h2 style={{ marginTop: 10 }}>{currentPerson.name}</h2>
            </div>
            <Row gutter={16}>
              <Col span={12}>
                <p><strong>性别：</strong>{currentPerson.gender}</p>
                <p><strong>年龄：</strong>{currentPerson.age}岁</p>
                <p><strong>身份证号：</strong>{desensitizeIdCard(currentPerson.idCard)}</p>
                <p><strong>联系电话：</strong>{desensitizePhoneNumber(currentPerson.phone)}</p>
                <p><strong>房屋类型：</strong>{currentPerson.houseType}</p>
                <p><strong>户籍类型：</strong>{currentPerson.household}</p>
              </Col>
              <Col span={12}>
                <p><strong>职业：</strong>{currentPerson.occupation}</p>
                <p><strong>教育程度：</strong>{currentPerson.education}</p>
                <p><strong>紧急联系人：</strong>{currentPerson.emergencyContact}</p>
                <p><strong>紧急联系人电话：</strong>{currentPerson.emergencyPhone ? desensitizePhoneNumber(currentPerson.emergencyPhone) : '-'}</p>
                <p><strong>健康状况：</strong>{currentPerson.healthStatus}</p>
                <p><strong>所属网格：</strong>网格{currentPerson.gridId}</p>
              </Col>
            </Row>
            <p><strong>详细地址：</strong>{currentPerson.address}</p>
            {currentPerson.specialTags.length > 0 && (
              <div>
                <strong>特殊标签：</strong>
                <div style={{ marginTop: 8 }}>
                  {currentPerson.specialTags.map(tag => (
                    <Tag key={tag} color="red" style={{ marginBottom: 4 }}>{tag}</Tag>
                  ))}
                </div>
              </div>
            )}
            {currentPerson.notes && (
              <p><strong>备注：</strong>{currentPerson.notes}</p>
            )}
          </div>
        )}
      </Modal>

      {/* 删除确认弹窗 */}
      <Modal
        title="确认删除"
        open={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okText="确定"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <p>确定要删除 {deleteTarget?.name} 的人口记录吗？</p>
        <p>删除后将无法恢复，请谨慎操作。</p>
      </Modal>
    </div>
  );
};

export default Population; 