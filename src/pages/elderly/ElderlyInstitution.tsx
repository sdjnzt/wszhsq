import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Button, Space, Modal, Form, Select, Row, Col, Tag, Tooltip, Tabs, Descriptions } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EnvironmentOutlined, PhoneOutlined, HomeOutlined, TeamOutlined, InfoCircleOutlined } from '@ant-design/icons';
import './ElderlyInstitution.less';

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface Institution {
  id: string;
  name: string;
  type: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  phone: string;
  contactPerson: string;
  contactPhone: string;
  bedCount: number;
  currentElderly: number;
  level: string;
  services: string[];
  facilities: string[];
  description: string;
}

const ElderlyInstitution: React.FC = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentInstitution, setCurrentInstitution] = useState<Institution | null>(null);

  // 模拟数据
  useEffect(() => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      // 生成更真实的养老机构数据
      const mockData: Institution[] = [
        {
          id: '1',
          name: '汶上县中都街道养老服务中心',
          type: '公办养老机构',
          address: '汶上县中都街道中都花园A区1栋101室',
          location: { lat: 35.7123, lng: 116.4856 },
          phone: '0537-7212345',
          contactPerson: '张丽华',
          contactPhone: '13812345678',
          bedCount: 120,
          currentElderly: 98,
          level: '一级',
          services: ['生活照料', '膳食服务', '医疗护理', '康复训练', '文化娱乐', '心理疏导', '紧急救援'],
          facilities: ['医务室', '康复室', '阅览室', '餐厅', '活动室', '休息室', '无障碍设施', '监控系统', '紧急呼叫系统'],
          description: '中都街道养老服务中心是汶上县规模最大的公办养老机构，环境优美，设施齐全，服务周到，为老年人提供全方位的养老服务。中心配备专业医护人员，24小时值班，确保老人安全。'
        },
        {
          id: '2',
          name: '汶上县阳光老年公寓',
          type: '民办养老机构',
          address: '汶上县中都街道中都花园B区3栋201室',
          location: { lat: 35.7145, lng: 116.4878 },
          phone: '0537-7213456',
          contactPerson: '李国强',
          contactPhone: '13987654321',
          bedCount: 80,
          currentElderly: 72,
          level: '二级',
          services: ['生活照料', '膳食服务', '医疗护理', '康复训练', '文化娱乐', '心理疏导'],
          facilities: ['医务室', '康复室', '阅览室', '餐厅', '活动室', '休息室', '无障碍设施', '监控系统'],
          description: '阳光老年公寓是一家专业的民办养老机构，注重个性化服务，为每位老人制定专属的护理计划。公寓环境温馨，服务贴心，是老年人安享晚年的理想选择。'
        },
        {
          id: '3',
          name: '汶上县康宁颐养院',
          type: '公建民营养老机构',
          address: '汶上县中都街道中都花园C区5栋301室',
          location: { lat: 35.7167, lng: 116.4890 },
          phone: '0537-7214567',
          contactPerson: '王秀英',
          contactPhone: '13765432109',
          bedCount: 150,
          currentElderly: 135,
          level: '一级',
          services: ['生活照料', '膳食服务', '医疗护理', '康复训练', '文化娱乐', '心理疏导', '紧急救援', '临终关怀'],
          facilities: ['医务室', '康复室', '阅览室', '餐厅', '活动室', '休息室', '无障碍设施', '监控系统', '紧急呼叫系统', '营养配餐室'],
          description: '康宁颐养院采用公建民营模式，由政府提供场地，专业机构运营管理。院内设施先进，服务专业，特别在医疗护理和康复训练方面有突出优势。'
        },
        {
          id: '4',
          name: '汶上县福寿老年之家',
          type: '民办养老机构',
          address: '汶上县中都街道中都花园D区7栋401室',
          location: { lat: 35.7189, lng: 116.4902 },
          phone: '0537-7215678',
          contactPerson: '赵志强',
          contactPhone: '13654321098',
          bedCount: 60,
          currentElderly: 48,
          level: '二级',
          services: ['生活照料', '膳食服务', '医疗护理', '康复训练', '文化娱乐'],
          facilities: ['医务室', '康复室', '阅览室', '餐厅', '活动室', '休息室', '无障碍设施'],
          description: '福寿老年之家是一家温馨的小型养老机构，注重家庭式服务，让老人感受到家的温暖。机构规模适中，服务更加个性化，深受老人和家属好评。'
        },
        {
          id: '5',
          name: '汶上县安康养老院',
          type: '公办养老机构',
          address: '汶上县中都街道中都花园E区9栋501室',
          location: { lat: 35.7201, lng: 116.4914 },
          phone: '0537-7216789',
          contactPerson: '刘美华',
          contactPhone: '13543210987',
          bedCount: 100,
          currentElderly: 85,
          level: '二级',
          services: ['生活照料', '膳食服务', '医疗护理', '康复训练', '文化娱乐', '心理疏导'],
          facilities: ['医务室', '康复室', '阅览室', '餐厅', '活动室', '休息室', '无障碍设施', '监控系统'],
          description: '安康养老院是汶上县较早成立的公办养老机构，有着丰富的养老服务经验。院内环境优美，服务规范，是老年人安享晚年的可靠选择。'
        },
        {
          id: '6',
          name: '汶上县和乐老年公寓',
          type: '民办养老机构',
          address: '汶上县中都街道中都花园F区11栋601室',
          location: { lat: 35.7223, lng: 116.4926 },
          phone: '0537-7217890',
          contactPerson: '陈丽娜',
          contactPhone: '13432109876',
          bedCount: 70,
          currentElderly: 62,
          level: '三级',
          services: ['生活照料', '膳食服务', '医疗护理', '文化娱乐'],
          facilities: ['医务室', '阅览室', '餐厅', '活动室', '休息室', '无障碍设施'],
          description: '和乐老年公寓注重文化娱乐服务，经常组织各种活动丰富老人的精神生活。公寓环境温馨，服务贴心，让老人在这里快乐生活。'
        },
        {
          id: '7',
          name: '汶上县怡心养老院',
          type: '公建民营养老机构',
          address: '汶上县中都街道中都花园G区13栋701室',
          location: { lat: 35.7245, lng: 116.4938 },
          phone: '0537-7218901',
          contactPerson: '孙德明',
          contactPhone: '13321098765',
          bedCount: 90,
          currentElderly: 78,
          level: '二级',
          services: ['生活照料', '膳食服务', '医疗护理', '康复训练', '文化娱乐', '心理疏导'],
          facilities: ['医务室', '康复室', '阅览室', '餐厅', '活动室', '休息室', '无障碍设施', '监控系统'],
          description: '怡心养老院采用先进的养老服务理念，注重老人的心理健康和精神需求。院内环境优雅，服务专业，是老年人安享晚年的理想场所。'
        },
        {
          id: '8',
          name: '汶上县中都街道社区养老服务站',
          type: '公办养老机构',
          address: '汶上县中都街道中都花园H区15栋801室',
          location: { lat: 35.7267, lng: 116.4950 },
          phone: '0537-7219012',
          contactPerson: '周建华',
          contactPhone: '13210987654',
          bedCount: 40,
          currentElderly: 35,
          level: '三级',
          services: ['生活照料', '膳食服务', '医疗护理', '文化娱乐'],
          facilities: ['医务室', '阅览室', '餐厅', '活动室', '休息室', '无障碍设施'],
          description: '中都街道社区养老服务站是面向社区老年人的综合性服务机构，提供日间照料、短期托养等服务。服务站设施完善，服务周到，深受社区老人欢迎。'
        }
      ];
      setInstitutions(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const handleSearch = () => {
    // 实际项目中这里应该调用API进行搜索
    if (!searchText) {
      // 如果搜索框为空，重新加载所有数据
      return;
    }
    
    const filteredData = institutions.filter(
      item => 
        item.name.includes(searchText) || 
        item.address.includes(searchText) ||
        item.type.includes(searchText)
    );
    setInstitutions(filteredData);
  };

  const resetSearch = () => {
    setSearchText('');
    // 重新加载所有数据
  };

  const showModal = (record?: Institution) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue({
        ...record,
        services: record.services,
        facilities: record.facilities,
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
      
      if (editingId) {
        // 编辑现有记录
        const updatedList = institutions.map(item => 
          item.id === editingId ? { ...values, id: editingId } : item
        );
        setInstitutions(updatedList);
      } else {
        // 添加新记录
        const newInstitution = {
          ...values,
          id: `${institutions.length + 1}`,
          location: {
            lat: 35.71 + Math.random() * 0.05,
            lng: 116.48 + Math.random() * 0.05,
          },
        };
        setInstitutions([...institutions, newInstitution]);
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
      content: '确定要删除这个养老机构吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const updatedList = institutions.filter(item => item.id !== id);
        setInstitutions(updatedList);
      },
    });
  };

  const viewInstitution = (record: Institution) => {
    setCurrentInstitution(record);
    setIsViewModalVisible(true);
  };

  const getLevelTag = (level: string) => {
    const colorMap: Record<string, string> = {
      '一级': 'green',
      '二级': 'blue',
      '三级': 'orange',
    };
    
    return <Tag color={colorMap[level]}>{level}</Tag>;
  };

  const getTypeTag = (type: string) => {
    const colorMap: Record<string, string> = {
      '公办养老机构': 'blue',
      '民办养老机构': 'green',
      '公建民营养老机构': 'orange',
    };
    
    return <Tag color={colorMap[type]}>{type}</Tag>;
  };

  const getOccupancyRate = (current: number, total: number) => {
    const rate = Math.round((current / total) * 100);
    let color = 'green';
    
    if (rate > 90) {
      color = 'red';
    } else if (rate > 70) {
      color = 'orange';
    }
    
    return <Tag color={color}>{rate}%</Tag>;
  };

  const columns = [
    {
      title: '机构名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      render: (text: string, record: Institution) => (
        <a onClick={() => viewInstitution(record)}>{text}</a>
      ),
    },
    {
      title: '机构类型',
      dataIndex: 'type',
      key: 'type',
      width: 150,
      render: (text: string) => getTypeTag(text),
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      width: 200,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span><EnvironmentOutlined style={{ marginRight: 4 }} />{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
      render: (text: string) => (
        <span><PhoneOutlined style={{ marginRight: 4 }} />{text}</span>
      ),
    },
    {
      title: '床位数',
      dataIndex: 'bedCount',
      key: 'bedCount',
      width: 80,
      render: (text: number) => (
        <span><HomeOutlined style={{ marginRight: 4 }} />{text}</span>
      ),
    },
    {
      title: '入住人数',
      dataIndex: 'currentElderly',
      key: 'currentElderly',
      width: 80,
      render: (text: number) => (
        <span><TeamOutlined style={{ marginRight: 4 }} />{text}</span>
      ),
    },
    {
      title: '入住率',
      key: 'occupancyRate',
      width: 80,
      render: (_: unknown, record: Institution) => getOccupancyRate(record.currentElderly, record.bedCount),
    },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (text: string) => getLevelTag(text),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: unknown, record: Institution) => (
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
          <Button 
            type="text" 
            icon={<InfoCircleOutlined />} 
            onClick={() => viewInstitution(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="elderly-institution-container">
      <Card
        title="养老机构管理"
        className="elderly-institution-card"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showModal()}
          >
            添加养老机构
          </Button>
        }
      >
        <div className="search-container">
          <Input
            placeholder="请输入机构名称或地址搜索"
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
          dataSource={institutions}
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

      {/* 添加/编辑养老机构表单 */}
      <Modal
        title={editingId ? '编辑养老机构' : '添加养老机构'}
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
            type: '公办养老机构',
            level: '二级',
            services: ['生活照料', '膳食服务'],
            facilities: ['医务室', '活动室', '无障碍设施']
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="机构名称"
                rules={[{ required: true, message: '请输入机构名称' }]}
              >
                <Input placeholder="请输入机构名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="机构类型"
                rules={[{ required: true, message: '请选择机构类型' }]}
              >
                <Select placeholder="请选择机构类型">
                  <Option value="公办养老机构">公办养老机构</Option>
                  <Option value="民办养老机构">民办养老机构</Option>
                  <Option value="公建民营养老机构">公建民营养老机构</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="地址"
            rules={[{ required: true, message: '请输入地址' }]}
          >
            <Input placeholder="请输入地址" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="phone"
                label="联系电话"
                rules={[{ required: true, message: '请输入联系电话' }]}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="contactPerson"
                label="联系人"
                rules={[{ required: true, message: '请输入联系人' }]}
              >
                <Input placeholder="请输入联系人" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="contactPhone"
                label="联系人电话"
                rules={[{ required: true, message: '请输入联系人电话' }]}
              >
                <Input placeholder="请输入联系人电话" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="bedCount"
                label="床位数"
                rules={[{ required: true, message: '请输入床位数' }]}
              >
                <Input type="number" placeholder="请输入床位数" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="currentElderly"
                label="入住人数"
                rules={[{ required: true, message: '请输入入住人数' }]}
              >
                <Input type="number" placeholder="请输入入住人数" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="level"
                label="机构等级"
                rules={[{ required: true, message: '请选择机构等级' }]}
              >
                <Select placeholder="请选择机构等级">
                  <Option value="一级">一级</Option>
                  <Option value="二级">二级</Option>
                  <Option value="三级">三级</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="services"
            label="提供服务"
            rules={[{ required: true, message: '请选择提供的服务' }]}
          >
            <Select mode="multiple" placeholder="请选择提供的服务">
              <Option value="生活照料">生活照料</Option>
              <Option value="膳食服务">膳食服务</Option>
              <Option value="医疗护理">医疗护理</Option>
              <Option value="康复训练">康复训练</Option>
              <Option value="文化娱乐">文化娱乐</Option>
              <Option value="心理疏导">心理疏导</Option>
              <Option value="紧急救援">紧急救援</Option>
              <Option value="临终关怀">临终关怀</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="facilities"
            label="设施设备"
            rules={[{ required: true, message: '请选择设施设备' }]}
          >
            <Select mode="multiple" placeholder="请选择设施设备">
              <Option value="医务室">医务室</Option>
              <Option value="康复室">康复室</Option>
              <Option value="阅览室">阅览室</Option>
              <Option value="餐厅">餐厅</Option>
              <Option value="活动室">活动室</Option>
              <Option value="休息室">休息室</Option>
              <Option value="无障碍设施">无障碍设施</Option>
              <Option value="监控系统">监控系统</Option>
              <Option value="紧急呼叫系统">紧急呼叫系统</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="机构描述"
          >
            <TextArea rows={4} placeholder="请输入机构描述" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 查看养老机构详情 */}
      <Modal
        title="养老机构详情"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="edit" type="primary" onClick={() => {
            setIsViewModalVisible(false);
            if (currentInstitution) {
              showModal(currentInstitution);
            }
          }}>
            编辑
          </Button>,
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        {currentInstitution && (
          <div className="institution-detail">
            <Tabs defaultActiveKey="1">
              <TabPane tab="基本信息" key="1">
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="机构名称">{currentInstitution.name}</Descriptions.Item>
                  <Descriptions.Item label="机构类型">{getTypeTag(currentInstitution.type)}</Descriptions.Item>
                  <Descriptions.Item label="地址">{currentInstitution.address}</Descriptions.Item>
                  <Descriptions.Item label="联系电话">{currentInstitution.phone}</Descriptions.Item>
                  <Descriptions.Item label="联系人">{currentInstitution.contactPerson}</Descriptions.Item>
                  <Descriptions.Item label="联系人电话">{currentInstitution.contactPhone}</Descriptions.Item>
                </Descriptions>
              </TabPane>
              <TabPane tab="入住情况" key="2">
                <Descriptions bordered column={3}>
                  <Descriptions.Item label="床位数">{currentInstitution.bedCount}</Descriptions.Item>
                  <Descriptions.Item label="入住人数">{currentInstitution.currentElderly}</Descriptions.Item>
                  <Descriptions.Item label="入住率">
                    {getOccupancyRate(currentInstitution.currentElderly, currentInstitution.bedCount)}
                  </Descriptions.Item>
                  <Descriptions.Item label="机构等级">{getLevelTag(currentInstitution.level)}</Descriptions.Item>
                </Descriptions>
              </TabPane>
              <TabPane tab="服务与设施" key="3">
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="提供服务">
                    {currentInstitution.services.map(service => (
                      <Tag key={service} color="blue" style={{ margin: '0 4px 4px 0' }}>{service}</Tag>
                    ))}
                  </Descriptions.Item>
                  <Descriptions.Item label="设施设备">
                    {currentInstitution.facilities.map(facility => (
                      <Tag key={facility} color="green" style={{ margin: '0 4px 4px 0' }}>{facility}</Tag>
                    ))}
                  </Descriptions.Item>
                  <Descriptions.Item label="机构描述">
                    {currentInstitution.description}
                  </Descriptions.Item>
                </Descriptions>
              </TabPane>
              <TabPane tab="地理位置" key="4">
                <div className="map-container">
                  <div className="map-placeholder">
                    <p>地图组件将在此显示</p>
                    <p>经度: {currentInstitution.location.lng.toFixed(6)}</p>
                    <p>纬度: {currentInstitution.location.lat.toFixed(6)}</p>
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ElderlyInstitution; 