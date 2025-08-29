import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Modal, Form, Select, Input, Tag, Row, Col, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import './PartyPosition.less';
import dayjs from 'dayjs';

const { Option } = Select;

interface PartyMemberPosition {
  id: string;
  memberId: string;
  memberName: string;
  gender: string;
  age: number;
  positionName: string;
  positionType: string;
  positionLevel: string;
  department: string;
  startDate: string;
  endDate: string | null;
  status: string;
  responsibilities: string[];
  gridName: string;
  partyBranch: string;
}

const PartyPositionPage: React.FC = () => {
  const [positions, setPositions] = useState<PartyMemberPosition[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [members, setMembers] = useState<{id: string, name: string}[]>([]);

  // 模拟数据 - 基于大型社区实际规模
  useEffect(() => {
    setLoading(true);
    
    // 生成更真实的党员数据
    const familyNames = ['张', '李', '王', '赵', '刘', '陈', '孙', '周', '吴', '郑', '马', '朱', '胡', '林', '何', '郭', '高', '罗', '梁', '宋', '韩', '冯', '于', '董', '萧', '程', '曹', '袁', '邓', '许', '傅', '沈', '曾', '彭', '吕', '苏', '卢', '蒋', '蔡', '贾', '丁', '魏', '薛', '叶', '阎', '余', '潘', '杜', '戴', '夏', '钟', '汪', '田', '任', '姜', '范', '方', '石', '姚', '谭', '廖', '邹', '熊', '金', '陆', '郝', '孔', '白', '崔', '康', '毛', '邱', '秦', '江', '史', '顾', '侯', '邵', '孟', '龙', '万', '段', '雷', '钱', '汤', '尹', '黎', '易', '常', '武', '乔', '贺', '赖', '龚', '文'];
    const givenNames = ['建国', '建军', '建华', '建平', '建强', '建明', '建文', '建武', '国强', '国华', '国平', '国明', '国文', '国武', '志强', '志华', '志平', '志明', '志文', '志武', '德明', '德华', '德平', '德强', '德文', '德武', '秀英', '秀华', '秀平', '秀明', '秀文', '秀武', '丽娜', '丽华', '丽平', '丽明', '丽文', '丽武', '美华', '美平', '美明', '美文', '美武', '建华', '建平', '建明', '建文', '建武', '芳', '娜', '婷', '玲', '静', '敏', '文', '丽', '霞', '芬', '燕', '红', '梅', '兰', '菊', '竹', '英', '华', '秀', '珍', '珠', '玉', '琴', '香', '春', '夏', '秋', '冬', '月', '星', '云', '雨', '雪', '风', '花', '草', '树', '山', '水', '火', '土', '金', '木'];
    
    const mockMembers = Array(200)
      .fill(0)
      .map((_, index) => {
        const familyName = familyNames[Math.floor(Math.random() * familyNames.length)];
        const givenName = givenNames[Math.floor(Math.random() * givenNames.length)];
        return {
          id: `${index + 1}`,
          name: familyName + givenName,
        };
      });
    setMembers(mockMembers);
    
    // 模拟API调用
    setTimeout(() => {
      // 生成更真实的认岗数据
      const mockData: PartyMemberPosition[] = Array(200) // 基于大型社区党员规模
        .fill(0)
        .map((_, index) => {
          // 生成真实的党员姓名
          const familyName = familyNames[Math.floor(Math.random() * familyNames.length)];
          const givenName = givenNames[Math.floor(Math.random() * givenNames.length)];
          const memberName = familyName + givenName;
          
          // 生成合理的年龄分布（25-70岁）
          const age = Math.floor(Math.random() * 46) + 25;
          
          // 根据年龄生成性别（年龄越大，男性比例越高）
          const gender = age > 50 ? (Math.random() > 0.3 ? '男' : '女') : (Math.random() > 0.5 ? '男' : '女');
          
          // 岗位名称 - 更丰富的岗位类型
          const positionNames = [
            '网格党建联络员', '社区党建指导员', '党建宣传员', '党员服务专员', '党建信息员',
            '党员发展联络员', '党费收缴员', '组织生活会记录员', '党建活动组织员', '党员教育管理员',
            '网格党支部书记', '楼栋党小组长', '党员志愿者队长', '党建文化宣传员', '党员帮扶联络员',
            '党建档案管理员', '党员积分管理员', '党建阵地管理员', '党员先锋岗负责人', '党建品牌创建员'
          ];
          const positionName = positionNames[Math.floor(Math.random() * positionNames.length)];
          
          // 岗位类型 - 更合理的分布
          const positionTypes = ['专职', '兼职', '志愿'];
          const positionType = positionTypes[Math.floor(Math.random() * positionTypes.length)];
          
          // 岗位级别 - 基于实际层级
          const positionLevels = ['社区级', '网格级', '楼栋级', '单元级'];
          const positionLevel = positionLevels[Math.floor(Math.random() * positionLevels.length)];
          
          // 所属部门 - 基于实际党支部结构
          const departments = [
            '社区党委', '第一党支部', '第二党支部', '第三党支部', '第四党支部', '第五党支部', '第六党支部', '第七党支部', '第八党支部',
            '网格联合党支部', '楼栋党小组', '党员先锋队', '党建工作室', '党群服务中心'
          ];
          const department = departments[Math.floor(Math.random() * departments.length)];
          
          // 开始日期 - 更合理的时间分布
          const startDate = dayjs().subtract(Math.floor(Math.random() * 1825), 'day').format('YYYY-MM-DD'); // 最近5年
          
          // 结束日期 - 大部分是长期岗位
          let endDate = null;
          if (Math.random() > 0.8) { // 20%的岗位有结束日期
            endDate = dayjs().add(Math.floor(1 + Math.random() * 1095), 'day').format('YYYY-MM-DD'); // 未来1-3年
          }
          
          // 状态 - 大部分在职
          const status = Math.random() > 0.95 ? '已离职' : '在职'; // 5%离职率
          
          // 岗位职责 - 更丰富的职责描述
          const allResponsibilities = [
            '负责网格内党员日常管理', '组织党员活动', '收集党员意见建议', '传达上级党组织精神', '协助做好党员发展工作',
            '党员信息采集与维护', '党费收缴管理', '组织生活会记录', '党建宣传工作', '党员积分管理',
            '党建阵地日常维护', '党员先锋岗创建', '党建品牌建设', '党员帮扶工作', '党建文化活动组织',
            '党员教育培训', '党建档案整理', '党群关系协调', '党建项目推进', '党员志愿服务组织',
            '党建信息报送', '党员先进事迹宣传', '党建理论研究', '党员权益维护', '党建考核评估'
          ];
          
          // 每个岗位随机分配3-6个职责
          const responsibilityCount = Math.floor(3 + Math.random() * 4);
          const shuffled = allResponsibilities.sort(() => 0.5 - Math.random());
          const responsibilities = shuffled.slice(0, responsibilityCount);
          
          // 所属网格 - 基于实际的8个网格区域
          const gridNames = [
            '中都花园A区网格', '中都花园B区网格', '中都花园C区网格', '中都花园D区网格',
            '中都花园E区网格', '中都花园F区网格', '中都花园G区网格', '中都花园H区网格'
          ];
          const gridName = gridNames[Math.floor(Math.random() * gridNames.length)];
          
          // 党支部 - 基于实际区域
          const partyBranches = [
            '第一党支部', '第二党支部', '第三党支部', '第四党支部', '第五党支部', '第六党支部', '第七党支部', '第八党支部',
            'A区党支部', 'B区党支部', 'C区党支部', 'D区党支部', 'E区党支部', 'F区党支部', 'G区党支部', 'H区党支部'
          ];
          const partyBranch = partyBranches[Math.floor(Math.random() * partyBranches.length)];
          
          return {
            id: `${index + 1}`,
            memberId: `${Math.floor(1 + Math.random() * 200)}`,
            memberName,
            gender,
            age,
            positionName,
            positionType,
            positionLevel,
            department,
            startDate,
            endDate,
            status,
            responsibilities,
            gridName,
            partyBranch,
          };
        });
      setPositions(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const handleSearch = () => {
    // 实际项目中这里应该调用API进行搜索
    if (!searchText) {
      // 如果搜索框为空，重新加载所有数据
      return;
    }
    
    const filteredData = positions.filter(
      item => 
        item.memberName.includes(searchText) || 
        item.positionName.includes(searchText) || 
        item.department.includes(searchText) ||
        item.gridName.includes(searchText)
    );
    setPositions(filteredData);
  };

  const resetSearch = () => {
    setSearchText('');
    // 重新加载所有数据
  };

  const showModal = (record?: PartyMemberPosition) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue({
        ...record,
        startDate: record.startDate ? dayjs(record.startDate) : null,
        endDate: record.endDate ? dayjs(record.endDate) : null,
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
      
      // 处理日期
      const formData = {
        ...values,
        startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : null,
        endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : null,
      };
      
      if (editingId) {
        // 编辑现有认岗信息
        const updatedList = positions.map(item => 
          item.id === editingId ? { ...formData, id: editingId } : item
        );
        setPositions(updatedList);
      } else {
        // 添加新认岗信息
        const selectedMember = members.find(m => m.id === values.memberId);
        const newPosition = {
          ...formData,
          id: `${positions.length + 1}`,
          memberName: selectedMember?.name || '',
        };
        setPositions([...positions, newPosition]);
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
      content: '确定要删除这条认岗信息吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const updatedList = positions.filter(item => item.id !== id);
        setPositions(updatedList);
      },
    });
  };

  const getStatusTag = (status: string) => {
    return <Tag color={status === '在职' ? 'green' : 'red'}>{status}</Tag>;
  };

  const getPositionTypeTag = (type: string) => {
    const colorMap: Record<string, string> = {
      '专职': 'blue',
      '兼职': 'orange',
      '志愿': 'green',
    };
    
    return <Tag color={colorMap[type]}>{type}</Tag>;
  };

  const columns = [
    {
      title: '党员姓名',
      dataIndex: 'memberName',
      key: 'memberName',
      width: 100,
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
    },
    {
      title: '岗位名称',
      dataIndex: 'positionName',
      key: 'positionName',
      width: 150,
    },
    {
      title: '岗位类型',
      dataIndex: 'positionType',
      key: 'positionType',
      width: 100,
      render: (text: string) => getPositionTypeTag(text),
    },
    {
      title: '岗位级别',
      dataIndex: 'positionLevel',
      key: 'positionLevel',
      width: 100,
    },
    {
      title: '所属部门',
      dataIndex: 'department',
      key: 'department',
      width: 120,
    },
    {
      title: '所属网格',
      dataIndex: 'gridName',
      key: 'gridName',
      width: 120,
    },
    {
      title: '开始日期',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 120,
    },
    {
      title: '结束日期',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 120,
      render: (text: string) => text || '长期',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (text: string) => getStatusTag(text),
    },
    {
      title: '岗位职责',
      key: 'responsibilities',
      width: 200,
      render: (_: unknown, record: PartyMemberPosition) => (
        <>
          {record.responsibilities.map(resp => (
            <Tag color="blue" key={resp} style={{ marginBottom: 4 }}>
              {resp}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: unknown, record: PartyMemberPosition) => (
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
    <div className="party-position-container">
      <Card
        title="党员认岗管理"
        className="party-position-card"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showModal()}
          >
            添加认岗
          </Button>
        }
      >
        <div className="search-container">
          <Input
            placeholder="请输入党员姓名/岗位名称/部门/网格搜索"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 300 }}
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
          dataSource={positions}
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
        title={editingId ? '编辑认岗信息' : '添加认岗信息'}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ 
            positionType: '专职',
            positionLevel: '网格级',
            status: '在职',
            responsibilities: [],
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="memberId"
                label="选择党员"
                rules={[{ required: true, message: '请选择党员' }]}
              >
                <Select placeholder="请选择党员">
                  {members.map(member => (
                    <Option key={member.id} value={member.id}>{member.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="positionName"
                label="岗位名称"
                rules={[{ required: true, message: '请输入岗位名称' }]}
              >
                <Input placeholder="请输入岗位名称" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="positionType"
                label="岗位类型"
                rules={[{ required: true, message: '请选择岗位类型' }]}
              >
                <Select placeholder="请选择岗位类型">
                  <Option value="专职">专职</Option>
                  <Option value="兼职">兼职</Option>
                  <Option value="志愿">志愿</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="positionLevel"
                label="岗位级别"
                rules={[{ required: true, message: '请选择岗位级别' }]}
              >
                <Select placeholder="请选择岗位级别">
                  <Option value="社区级">社区级</Option>
                  <Option value="网格级">网格级</Option>
                  <Option value="楼栋级">楼栋级</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  <Option value="在职">在职</Option>
                  <Option value="已离职">已离职</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="department"
                label="所属部门"
                rules={[{ required: true, message: '请选择所属部门' }]}
              >
                <Select placeholder="请选择所属部门">
                  <Option value="社区党委">社区党委</Option>
                  <Option value="第一党支部">第一党支部</Option>
                  <Option value="第二党支部">第二党支部</Option>
                  <Option value="第三党支部">第三党支部</Option>
                  <Option value="第四党支部">第四党支部</Option>
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
                  <Option value="中都花园A区网格">中都花园A区网格</Option>
                  <Option value="中都花园B区网格">中都花园B区网格</Option>
                  <Option value="中都花园C区网格">中都花园C区网格</Option>
                  <Option value="中都花园D区网格">中都花园D区网格</Option>
                  <Option value="中都花园E区网格">中都花园E区网格</Option>
                  <Option value="中都花园F区网格">中都花园F区网格</Option>
                  <Option value="中都花园G区网格">中都花园G区网格</Option>
                  <Option value="中都花园H区网格">中都花园H区网格</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="开始日期"
                rules={[{ required: true, message: '请选择开始日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label="结束日期"
                tooltip="如果是长期岗位，可不填"
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="responsibilities"
            label="岗位职责"
            rules={[{ required: true, message: '请选择岗位职责' }]}
          >
            <Select mode="multiple" placeholder="请选择岗位职责">
              <Option value="负责网格内党员日常管理">负责网格内党员日常管理</Option>
              <Option value="组织党员活动">组织党员活动</Option>
              <Option value="收集党员意见建议">收集党员意见建议</Option>
              <Option value="传达上级党组织精神">传达上级党组织精神</Option>
              <Option value="协助做好党员发展工作">协助做好党员发展工作</Option>
              <Option value="党员信息采集与维护">党员信息采集与维护</Option>
              <Option value="党费收缴管理">党费收缴管理</Option>
              <Option value="组织生活会记录">组织生活会记录</Option>
              <Option value="党建宣传工作">党建宣传工作</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PartyPositionPage; 