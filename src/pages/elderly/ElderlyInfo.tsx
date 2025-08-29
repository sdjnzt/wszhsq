import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Button, Space, Modal, Form, Select, DatePicker, Tag, Row, Col } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './ElderlyInfo.less';
import dayjs from 'dayjs';
import { desensitizeIdCard, desensitizePhoneNumber } from '../../utils/desensitization';

const { Option } = Select;

interface ElderlyPerson {
  id: string;
  name: string;
  gender: string;
  age: number;
  idCard: string;
  phone: string;
  address: string;
  healthStatus: string;
  careLevel: string;
  emergencyContact: string;
  emergencyPhone: string;
  registerDate: string;
}

const ElderlyInfo: React.FC = () => {
  const [elderlyList, setElderlyList] = useState<ElderlyPerson[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);

  // 模拟数据 - 基于大型社区实际规模
  useEffect(() => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      // 生成更真实的老人数据
      const mockData: ElderlyPerson[] = Array(1250) // 基于25,000人口，5%的老人比例
        .fill(0)
        .map((_, index) => {
          // 生成真实的姓名
          const familyNames = ['张', '李', '王', '赵', '刘', '陈', '孙', '周', '吴', '郑', '马', '朱', '胡', '林', '何', '郭', '高', '罗', '梁', '宋', '韩', '冯', '于', '董', '萧', '程', '曹', '袁', '邓', '许', '傅', '沈', '曾', '彭', '吕', '苏', '卢', '蒋', '蔡', '贾', '丁', '魏', '薛', '叶', '阎', '余', '潘', '杜', '戴', '夏', '钟', '汪', '田', '任', '姜', '范', '方', '石', '姚', '谭', '廖', '邹', '熊', '金', '陆', '郝', '孔', '白', '崔', '康', '毛', '邱', '秦', '江', '史', '顾', '侯', '邵', '孟', '龙', '万', '段', '雷', '钱', '汤', '尹', '黎', '易', '常', '武', '乔', '贺', '赖', '龚', '文'];
          const givenNames = ['建国', '建军', '建华', '建平', '建强', '建明', '建文', '建武', '国强', '国华', '国平', '国明', '国文', '国武', '志强', '志华', '志平', '志明', '志文', '志武', '德明', '德华', '德平', '德强', '德文', '德武', '秀英', '秀华', '秀平', '秀明', '秀文', '秀武', '丽娜', '丽华', '丽平', '丽明', '丽文', '丽武', '美华', '美平', '美明', '美文', '美武', '建华', '建平', '建明', '建文', '建武', '芳', '娜', '婷', '玲', '静', '敏', '文', '丽', '霞', '芬', '燕', '红', '梅', '兰', '菊', '竹', '英', '华', '秀', '珍', '珠', '玉', '琴', '香', '春', '夏', '秋', '冬', '月', '星', '云', '雨', '雪', '风', '花', '草', '树', '山', '水', '火', '土', '金', '木'];
          
          const familyName = familyNames[Math.floor(Math.random() * familyNames.length)];
          const givenName = givenNames[Math.floor(Math.random() * givenNames.length)];
          const name = familyName + givenName;
          
          // 生成合理的年龄分布（65-95岁）
          const age = Math.floor(Math.random() * 31) + 65;
          
          // 根据年龄生成性别（年龄越大，女性比例越高）
          const gender = age > 80 ? (Math.random() > 0.3 ? '女' : '男') : (Math.random() > 0.5 ? '男' : '女');
          
          // 生成真实的身份证号
          const birthYear = 2024 - age;
          const birthMonth = Math.floor(Math.random() * 12) + 1;
          const birthDay = Math.floor(Math.random() * 28) + 1;
          const idCard = `370822${birthYear}${birthMonth.toString().padStart(2, '0')}${birthDay.toString().padStart(2, '0')}${Math.floor(1000 + Math.random() * 9000)}`;
          
          // 生成真实的手机号
          const phone = `1${[3, 5, 6, 7, 8, 9][Math.floor(Math.random() * 6)]}${Math.floor(100000000 + Math.random() * 900000000)}`;
          
          // 生成真实的地址（基于中都花园8个区域）
          const areas = ['中都花园A区', '中都花园B区', '中都花园C区', '中都花园D区', '中都花园E区', '中都花园F区', '中都花园G区', '中都花园H区'];
          const area = areas[Math.floor(Math.random() * areas.length)];
          const building = Math.floor(Math.random() * 20) + 1;
          const unit = Math.floor(Math.random() * 8) + 1;
          const room = Math.floor(Math.random() * 20) + 1;
          const floor = Math.floor(Math.random() * 18) + 1;
          const address = `汶上县中都街道${area}${building}栋${unit}单元${floor}0${room}`;
          
          // 根据年龄生成健康状况
          let healthStatus;
          if (age < 70) {
            healthStatus = Math.random() > 0.2 ? '良好' : '一般';
          } else if (age < 80) {
            healthStatus = ['良好', '一般', '需要关注'][Math.floor(Math.random() * 3)];
          } else {
            healthStatus = Math.random() > 0.3 ? '需要关注' : '需要特殊照顾';
          }
          
          // 根据年龄和健康状况生成护理等级
          let careLevel;
          if (healthStatus === '需要特殊照顾') {
            careLevel = Math.random() > 0.5 ? '半自理' : '完全不能自理';
          } else if (healthStatus === '需要关注') {
            careLevel = Math.random() > 0.7 ? '自理' : '半自理';
          } else {
            careLevel = Math.random() > 0.1 ? '自理' : '半自理';
          }
          
          // 生成紧急联系人（通常是子女或配偶）
          const emergencyFamilyNames = ['李', '王', '张', '刘', '陈', '赵', '孙', '周', '吴', '郑'];
          const emergencyGivenNames = ['伟', '强', '军', '杰', '明', '华', '建', '勇', '刚', '超', '芳', '娜', '婷', '玲', '静', '敏', '文', '丽', '霞', '芬'];
          const emergencyFamilyName = emergencyFamilyNames[Math.floor(Math.random() * emergencyFamilyNames.length)];
          const emergencyGivenName = emergencyGivenNames[Math.floor(Math.random() * emergencyGivenNames.length)];
          const emergencyContact = emergencyFamilyName + emergencyGivenName;
          
          // 生成紧急联系人电话
          const emergencyPhone = `1${[3, 5, 6, 7, 8, 9][Math.floor(Math.random() * 6)]}${Math.floor(100000000 + Math.random() * 900000000)}`;
          
          // 生成注册日期（通常是最近1-3年）
          const registerDate = dayjs().subtract(Math.floor(Math.random() * 1095), 'day').format('YYYY-MM-DD');
          
          return {
            id: `${index + 1}`,
            name,
            gender,
            age,
            idCard,
            phone,
            address,
            healthStatus,
            careLevel,
            emergencyContact,
            emergencyPhone,
            registerDate,
          };
        });
      setElderlyList(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const handleSearch = () => {
    // 实际项目中这里应该调用API进行搜索
    if (!searchText) {
      // 如果搜索框为空，重新加载所有数据
      // 这里可以调用加载数据的函数
      return;
    }
    
    const filteredData = elderlyList.filter(
      item => 
        item.name.includes(searchText) || 
        item.idCard.includes(searchText) || 
        item.phone.includes(searchText)
    );
    setElderlyList(filteredData);
  };

  const resetSearch = () => {
    setSearchText('');
    // 重新加载所有数据
    // 这里应该调用加载数据的函数
  };

  const showModal = (record?: ElderlyPerson) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue({
        ...record,
        registerDate: dayjs(record.registerDate),
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
        registerDate: values.registerDate.format('YYYY-MM-DD'),
      };
      
      if (editingId) {
        // 编辑现有老人信息
        const updatedList = elderlyList.map(item => 
          item.id === editingId ? { ...formData, id: editingId } : item
        );
        setElderlyList(updatedList);
      } else {
        // 添加新老人信息
        const newElderly = {
          ...formData,
          id: `${elderlyList.length + 1}`,
        };
        setElderlyList([...elderlyList, newElderly]);
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
      content: '确定要删除这条老人信息吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const updatedList = elderlyList.filter(item => item.id !== id);
        setElderlyList(updatedList);
      },
    });
  };

  const getCareLevelTag = (level: string) => {
    const colorMap: Record<string, string> = {
      '自理': 'green',
      '半自理': 'orange',
      '完全不能自理': 'red',
    };
    
    return <Tag color={colorMap[level]}>{level}</Tag>;
  };

  const getHealthStatusTag = (status: string) => {
    const colorMap: Record<string, string> = {
      '良好': 'green',
      '一般': 'blue',
      '需要关注': 'orange',
      '需要特殊照顾': 'red',
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
      sorter: (a: ElderlyPerson, b: ElderlyPerson) => a.age - b.age,
    },
    {
      title: '身份证号',
      dataIndex: 'idCard',
      key: 'idCard',
      width: 180,
      render: (text: string) => desensitizeIdCard(text),
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
      render: (text: string) => desensitizePhoneNumber(text),
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: '健康状况',
      dataIndex: 'healthStatus',
      key: 'healthStatus',
      width: 120,
      render: (text: string) => getHealthStatusTag(text),
    },
    {
      title: '自理能力',
      dataIndex: 'careLevel',
      key: 'careLevel',
      width: 120,
      render: (text: string) => getCareLevelTag(text),
    },
    {
      title: '紧急联系人',
      dataIndex: 'emergencyContact',
      key: 'emergencyContact',
      width: 100,
    },
    {
      title: '紧急联系电话',
      dataIndex: 'emergencyPhone',
      key: 'emergencyPhone',
      width: 120,
      render: (text: string) => desensitizePhoneNumber(text),
    },
    {
      title: '登记日期',
      dataIndex: 'registerDate',
      key: 'registerDate',
      width: 100,
      sorter: (a: ElderlyPerson, b: ElderlyPerson) => 
        dayjs(a.registerDate).unix() - dayjs(b.registerDate).unix(),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: unknown, record: ElderlyPerson) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => showModal(record)}
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="elderly-info-container">
      <Card
        title="老人信息管理"
        className="elderly-info-card"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showModal()}
          >
            添加老人
          </Button>
        }
      >
        <div className="search-container">
          <Input
            placeholder="请输入姓名/身份证号/电话搜索"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 250 }}
            prefix={<SearchOutlined />}
            allowClear
          />
          <Button type="primary" onClick={handleSearch} style={{ marginLeft: 8 }}>
            搜索
          </Button>
          <Button onClick={resetSearch} style={{ marginLeft: 8 }}>
            重置
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={elderlyList}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条记录`,
          }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      <Modal
        title={editingId ? '编辑老人信息' : '添加老人信息'}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ gender: '男', healthStatus: '良好', careLevel: '自理' }}
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
                rules={[
                  { required: true, message: '请输入年龄' },
                  { type: 'number', min: 60, message: '年龄必须大于等于60岁' },
                ]}
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
                rules={[
                  { required: true, message: '请输入身份证号' },
                  { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证号' },
                ]}
              >
                <Input placeholder="请输入身份证号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="联系电话"
                rules={[
                  { required: true, message: '请输入联系电话' },
                  { pattern: /^1\d{10}$/, message: '请输入正确的手机号' },
                ]}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="住址"
            rules={[{ required: true, message: '请输入住址' }]}
          >
            <Input placeholder="请输入住址" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="healthStatus"
                label="健康状况"
                rules={[{ required: true, message: '请选择健康状况' }]}
              >
                <Select placeholder="请选择健康状况">
                  <Option value="良好">良好</Option>
                  <Option value="一般">一般</Option>
                  <Option value="需要关注">需要关注</Option>
                  <Option value="需要特殊照顾">需要特殊照顾</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="careLevel"
                label="自理能力"
                rules={[{ required: true, message: '请选择自理能力' }]}
              >
                <Select placeholder="请选择自理能力">
                  <Option value="自理">自理</Option>
                  <Option value="半自理">半自理</Option>
                  <Option value="完全不能自理">完全不能自理</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="emergencyContact"
                label="紧急联系人"
                rules={[{ required: true, message: '请输入紧急联系人' }]}
              >
                <Input placeholder="请输入紧急联系人" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="emergencyPhone"
                label="紧急联系电话"
                rules={[
                  { required: true, message: '请输入紧急联系电话' },
                  { pattern: /^1\d{10}$/, message: '请输入正确的手机号' },
                ]}
              >
                <Input placeholder="请输入紧急联系电话" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="registerDate"
                label="登记日期"
                rules={[{ required: true, message: '请选择登记日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ElderlyInfo; 