import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Button, Input, Table, Tag, Space, Modal, Form, Tabs, Upload, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, CarOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import './VehicleManagement.less';
import dayjs from 'dayjs';

const { Option } = Select;
const { TabPane } = Tabs;

interface Vehicle {
  id: string;
  plateNumber: string;
  vehicleType: string;
  brand: string;
  model: string;
  color: string;
  owner: string;
  ownerPhone: string;
  ownerAddress: string;
  parkingArea: string;
  parkingSpot: string;
  registerDate: string;
  lastInspection: string;
  status: 'normal' | 'expired' | 'blacklisted';
  remarks: string;
  image?: string;
}

const VehicleManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedParkingArea, setSelectedParkingArea] = useState<string>('all');
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>('all');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // 停车区域列表
  const parkingAreas = ['A区', 'B区', 'C区', 'D区', '访客区', '员工区'];
  
  // 车辆类型列表
  const vehicleTypes = ['小型轿车', 'SUV', '面包车', '货车', '摩托车', '电动车'];

  // 模拟数据
  useEffect(() => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      const mockData: Vehicle[] = Array(30)
        .fill(0)
        .map((_, index) => {
          const parkingArea = parkingAreas[index % parkingAreas.length];
          const vehicleType = vehicleTypes[index % vehicleTypes.length];
          return {
            id: `veh-${index + 1}`,
            plateNumber: `鲁Q${String.fromCharCode(65 + index % 26)}${Math.floor(1000 + Math.random() * 9000)}`,
            vehicleType,
            brand: ['大众', '丰田', '本田', '现代', '别克', '奥迪', '宝马', '奔驰'][index % 8],
            model: ['朗逸', '卡罗拉', '雅阁', '索纳塔', '英朗', 'A4L', '3系', 'C级'][index % 8],
            color: ['白色', '黑色', '红色', '蓝色', '银色', '灰色'][index % 6],
            owner: `业主${index + 1}`,
            ownerPhone: `1${Math.floor(3 + Math.random() * 6)}${Math.floor(100000000 + Math.random() * 900000000)}`,
            ownerAddress: `${['东区', '西区', '南区', '北区'][index % 4]}${index % 6 + 1}号楼${index % 20 + 1}单元${index % 5 + 1}0${index % 9 + 1}`,
            parkingArea,
            parkingSpot: `${parkingArea}-${Math.floor(100 + Math.random() * 900)}`,
            registerDate: dayjs().subtract(Math.floor(1 + Math.random() * 1000), 'day').format('YYYY-MM-DD'),
            lastInspection: dayjs().subtract(Math.floor(1 + Math.random() * 300), 'day').format('YYYY-MM-DD'),
            status: index % 10 === 0 ? 'blacklisted' : index % 7 === 0 ? 'expired' : 'normal',
            remarks: index % 5 === 0 ? '临时车位' : '',
          };
        });
      setVehicles(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const handleSearch = () => {
    // 实际项目中这里应该调用API进行搜索
  };

  const resetSearch = () => {
    setSearchText('');
    setSelectedParkingArea('all');
    setSelectedVehicleType('all');
    // 重新加载所有数据
  };

  const showModal = (record?: Vehicle) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue(record);
      setImageUrl(record.image || null);
    } else {
      setEditingId(null);
      form.resetFields();
      setImageUrl(null);
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setImageUrl(null);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingId) {
        // 编辑现有车辆
        const updatedList = vehicles.map(item => 
          item.id === editingId ? { ...item, ...values, image: imageUrl } : item
        );
        setVehicles(updatedList);
      } else {
        // 添加新车辆
        const newVehicle = {
          ...values,
          id: `veh-${vehicles.length + 1}`,
          status: 'normal' as const,
          image: imageUrl,
        };
        setVehicles([...vehicles, newVehicle]);
      }
      
      setIsModalVisible(false);
      form.resetFields();
      setImageUrl(null);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: '确定要删除这个车辆记录吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const updatedList = vehicles.filter(item => item.id !== id);
        setVehicles(updatedList);
      },
    });
  };

  const handleImageUpload: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'done') {
      // 这里应该是从服务器返回的URL
      // 但在这个示例中，我们只是使用一个假的URL
      setImageUrl(`https://example.com/vehicle-images/${info.file.name}`);
      message.success(`${info.file.name} 上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  };

  const getStatusTag = (status: string) => {
    const colorMap: Record<string, string> = {
      normal: 'green',
      expired: 'orange',
      blacklisted: 'red',
    };
    
    const textMap: Record<string, string> = {
      normal: '正常',
      expired: '过期',
      blacklisted: '黑名单',
    };
    
    return <Tag color={colorMap[status]}>{textMap[status]}</Tag>;
  };

  const columns = [
    {
      title: '车牌号',
      dataIndex: 'plateNumber',
      key: 'plateNumber',
      width: 120,
    },
    {
      title: '车辆类型',
      dataIndex: 'vehicleType',
      key: 'vehicleType',
      width: 100,
    },
    {
      title: '品牌型号',
      key: 'brandModel',
      width: 150,
      render: (_: unknown, record: Vehicle) => `${record.brand} ${record.model}`,
    },
    {
      title: '颜色',
      dataIndex: 'color',
      key: 'color',
      width: 80,
    },
    {
      title: '车主',
      dataIndex: 'owner',
      key: 'owner',
      width: 100,
    },
    {
      title: '联系电话',
      dataIndex: 'ownerPhone',
      key: 'ownerPhone',
      width: 120,
    },
    {
      title: '停车位',
      key: 'parking',
      width: 120,
      render: (_: unknown, record: Vehicle) => `${record.parkingArea} ${record.parkingSpot}`,
    },
    {
      title: '注册日期',
      dataIndex: 'registerDate',
      key: 'registerDate',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text: string) => getStatusTag(text),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: unknown, record: Vehicle) => (
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

  // 根据筛选条件过滤车辆
  const getFilteredVehicles = () => {
    return vehicles.filter(vehicle => {
      const areaMatch = selectedParkingArea === 'all' || vehicle.parkingArea === selectedParkingArea;
      const typeMatch = selectedVehicleType === 'all' || vehicle.vehicleType === selectedVehicleType;
      const searchMatch = !searchText || 
        vehicle.plateNumber.includes(searchText) || 
        vehicle.owner.includes(searchText) ||
        vehicle.ownerPhone.includes(searchText);
      
      // 根据当前标签页筛选
      let tabMatch = true;
      if (activeTab === 'normal') {
        tabMatch = vehicle.status === 'normal';
      } else if (activeTab === 'expired') {
        tabMatch = vehicle.status === 'expired';
      } else if (activeTab === 'blacklisted') {
        tabMatch = vehicle.status === 'blacklisted';
      }
      
      return areaMatch && typeMatch && searchMatch && tabMatch;
    });
  };

  return (
    <div className="vehicle-management-container">
      <Card title="车辆管理系统">
        <div className="search-container">
          <Input
            placeholder="请输入车牌号/车主/电话搜索"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 250 }}
            prefix={<SearchOutlined />}
            allowClear
          />
          <Select
            placeholder="选择停车区域"
            style={{ width: 120, marginLeft: 8 }}
            value={selectedParkingArea}
            onChange={value => setSelectedParkingArea(value)}
          >
            <Option value="all">全部区域</Option>
            {parkingAreas.map(area => (
              <Option key={area} value={area}>{area}</Option>
            ))}
          </Select>
          <Select
            placeholder="选择车辆类型"
            style={{ width: 120, marginLeft: 8 }}
            value={selectedVehicleType}
            onChange={value => setSelectedVehicleType(value)}
          >
            <Option value="all">全部类型</Option>
            {vehicleTypes.map(type => (
              <Option key={type} value={type}>{type}</Option>
            ))}
          </Select>
          <Button type="primary" onClick={handleSearch} style={{ marginLeft: 8 }}>
            搜索
          </Button>
          <Button onClick={resetSearch} style={{ marginLeft: 8 }}>
            重置
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showModal()}
            style={{ marginLeft: 'auto' }}
          >
            添加车辆
          </Button>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab} className="vehicle-tabs">
          <TabPane tab="全部车辆" key="all">
            <Table
              columns={columns}
              dataSource={getFilteredVehicles()}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showQuickJumper: true,
                showTotal: total => `共 ${total} 条记录`,
              }}
              scroll={{ x: 'max-content' }}
            />
          </TabPane>
          <TabPane tab="正常车辆" key="normal">
            <Table
              columns={columns}
              dataSource={getFilteredVehicles()}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showQuickJumper: true,
                showTotal: total => `共 ${total} 条记录`,
              }}
              scroll={{ x: 'max-content' }}
            />
          </TabPane>
          <TabPane tab="过期车辆" key="expired">
            <Table
              columns={columns}
              dataSource={getFilteredVehicles()}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showQuickJumper: true,
                showTotal: total => `共 ${total} 条记录`,
              }}
              scroll={{ x: 'max-content' }}
            />
          </TabPane>
          <TabPane tab="黑名单车辆" key="blacklisted">
            <Table
              columns={columns}
              dataSource={getFilteredVehicles()}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showQuickJumper: true,
                showTotal: total => `共 ${total} 条记录`,
              }}
              scroll={{ x: 'max-content' }}
            />
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title={editingId ? '编辑车辆信息' : '添加车辆信息'}
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
            <Col span={12}>
              <Form.Item
                name="plateNumber"
                label="车牌号"
                rules={[
                  { required: true, message: '请输入车牌号' },
                  { pattern: /^[\u4e00-\u9fa5][A-Z][A-Z0-9]{5}$/, message: '请输入正确的车牌号格式' }
                ]}
              >
                <Input placeholder="请输入车牌号，如：鲁QA1234" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="vehicleType"
                label="车辆类型"
                rules={[{ required: true, message: '请选择车辆类型' }]}
              >
                <Select placeholder="请选择车辆类型">
                  {vehicleTypes.map(type => (
                    <Option key={type} value={type}>{type}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="brand"
                label="品牌"
                rules={[{ required: true, message: '请输入品牌' }]}
              >
                <Input placeholder="请输入品牌" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="model"
                label="型号"
                rules={[{ required: true, message: '请输入型号' }]}
              >
                <Input placeholder="请输入型号" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="color"
                label="颜色"
                rules={[{ required: true, message: '请输入颜色' }]}
              >
                <Input placeholder="请输入颜色" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="owner"
                label="车主姓名"
                rules={[{ required: true, message: '请输入车主姓名' }]}
              >
                <Input placeholder="请输入车主姓名" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="ownerPhone"
                label="联系电话"
                rules={[
                  { required: true, message: '请输入联系电话' },
                  { pattern: /^1\d{10}$/, message: '请输入正确的手机号格式' }
                ]}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  <Option value="normal">正常</Option>
                  <Option value="expired">过期</Option>
                  <Option value="blacklisted">黑名单</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="ownerAddress"
            label="车主地址"
            rules={[{ required: true, message: '请输入车主地址' }]}
          >
            <Input placeholder="请输入车主地址" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="parkingArea"
                label="停车区域"
                rules={[{ required: true, message: '请选择停车区域' }]}
              >
                <Select placeholder="请选择停车区域">
                  {parkingAreas.map(area => (
                    <Option key={area} value={area}>{area}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="parkingSpot"
                label="停车位编号"
                rules={[{ required: true, message: '请输入停车位编号' }]}
              >
                <Input placeholder="请输入停车位编号" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="registerDate"
                label="注册日期"
                rules={[{ required: true, message: '请输入注册日期' }]}
              >
                <Input placeholder="请输入注册日期，如：2023-01-01" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="lastInspection"
                label="最近检查日期"
                rules={[{ required: true, message: '请输入最近检查日期' }]}
              >
                <Input placeholder="请输入最近检查日期，如：2023-01-01" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="remarks"
                label="备注"
              >
                <Input placeholder="请输入备注信息" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="车辆照片"
          >
            <Upload
              name="vehicleImage"
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76" // 这里应该是实际的上传API
              onChange={handleImageUpload}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>上传照片</Button>
            </Upload>
            {imageUrl && (
              <div className="upload-preview">
                <img src={imageUrl} alt="车辆照片" style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '8px' }} />
              </div>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VehicleManagementPage; 