import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Button, Space, Modal, Form, Select, DatePicker, Tag, Row, Col, Rate, Divider } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons';
import './ElderlyService.less';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

interface ServiceRecord {
  id: string;
  elderlyId: string;
  elderlyName: string;
  serviceType: string;
  serviceContent: string;
  serviceDate: string;
  serviceDuration: number;
  serviceStaff: string;
  serviceStatus: string;
  feedback: string;
  satisfaction: number;
  remarks: string;
}

const ElderlyService: React.FC = () => {
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [feedbackForm] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentRecord, setCurrentRecord] = useState<ServiceRecord | null>(null);

  // 模拟数据 - 基于大型社区实际规模
  useEffect(() => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      // 生成更真实的服务记录数据
      const mockData: ServiceRecord[] = Array(2500) // 基于1250位老人，平均每人2次服务记录
        .fill(0)
        .map((_, index) => {
          // 生成真实的老人姓名
          const familyNames = ['张', '李', '王', '赵', '刘', '陈', '孙', '周', '吴', '郑', '马', '朱', '胡', '林', '何', '郭', '高', '罗', '梁', '宋', '韩', '冯', '于', '董', '萧', '程', '曹', '袁', '邓', '许', '傅', '沈', '曾', '彭', '吕', '苏', '卢', '蒋', '蔡', '贾', '丁', '魏', '薛', '叶', '阎', '余', '潘', '杜', '戴', '夏', '钟', '汪', '田', '任', '姜', '范', '方', '石', '姚', '谭', '廖', '邹', '熊', '金', '陆', '郝', '孔', '白', '崔', '康', '毛', '邱', '秦', '江', '史', '顾', '侯', '邵', '孟', '龙', '万', '段', '雷', '钱', '汤', '尹', '黎', '易', '常', '武', '乔', '贺', '赖', '龚', '文'];
          const givenNames = ['建国', '建军', '建华', '建平', '建强', '建明', '建文', '建武', '国强', '国华', '国平', '国明', '国文', '国武', '志强', '志华', '志平', '志明', '志文', '志武', '德明', '德华', '德平', '德强', '德文', '德武', '秀英', '秀华', '秀平', '秀明', '秀文', '秀武', '丽娜', '丽华', '丽平', '丽明', '丽文', '丽武', '美华', '美平', '美明', '美文', '美武', '建华', '建平', '建明', '建文', '建武', '芳', '娜', '婷', '玲', '静', '敏', '文', '丽', '霞', '芬', '燕', '红', '梅', '兰', '菊', '竹', '英', '华', '秀', '珍', '珠', '玉', '琴', '香', '春', '夏', '秋', '冬', '月', '星', '云', '雨', '雪', '风', '花', '草', '树', '山', '水', '火', '土', '金', '木'];
          
          const familyName = familyNames[Math.floor(Math.random() * familyNames.length)];
          const givenName = givenNames[Math.floor(Math.random() * givenNames.length)];
          const elderlyName = familyName + givenName;
          
          // 生成服务类型和内容
          const serviceTypes = [
            { type: '日常照料', content: '上门打扫卫生、整理房间、洗衣做饭' },
            { type: '助医服务', content: '陪同看病、取药、健康监测、康复指导' },
            { type: '助餐服务', content: '送餐上门、营养配餐、饮食指导' },
            { type: '精神慰藉', content: '心理疏导、情感陪伴、聊天解闷' },
            { type: '文化娱乐', content: '组织棋牌活动、读书看报、听戏唱歌' },
            { type: '康复训练', content: '肢体康复、语言康复、认知训练' },
            { type: '安全监护', content: '24小时监护、紧急救助、安全巡查' },
            { type: '社交活动', content: '组织集体活动、外出游玩、节日庆祝' }
          ];
          
          const selectedService = serviceTypes[Math.floor(Math.random() * serviceTypes.length)];
          const serviceType = selectedService.type;
          const serviceContent = selectedService.content;
          
          // 生成服务日期（最近3个月）
          const serviceDate = dayjs().subtract(Math.floor(Math.random() * 90), 'day').format('YYYY-MM-DD');
          
          // 生成服务时长（1-6小时）
          const serviceDuration = Math.floor(1 + Math.random() * 6);
          
          // 生成服务人员姓名
          const staffFamilyNames = ['王', '李', '张', '刘', '陈', '赵', '孙', '周', '吴', '郑'];
          const staffGivenNames = ['丽', '华', '英', '芳', '娜', '敏', '静', '秀', '美', '玲', '伟', '强', '军', '杰', '明', '华', '建', '勇', '刚', '超'];
          const staffFamilyName = staffFamilyNames[Math.floor(Math.random() * staffFamilyNames.length)];
          const staffGivenName = staffGivenNames[Math.floor(Math.random() * staffGivenNames.length)];
          const serviceStaff = staffFamilyName + staffGivenName;
          
          // 生成服务状态
          const serviceStatuses = ['已完成', '进行中', '已取消', '已预约'];
          const serviceStatus = serviceStatuses[Math.floor(Math.random() * serviceStatuses.length)];
          
          // 生成反馈和满意度
          let feedback = '';
          let satisfaction = 0;
          if (serviceStatus === '已完成') {
            const feedbackTemplates = [
              '服务态度很好，非常满意',
              '工作人员很专业，服务周到',
              '老人很喜欢，希望继续服务',
              '服务及时，质量很高',
              '工作人员很有耐心，值得表扬',
              '服务很贴心，老人很感动',
              '专业水平高，服务效果好',
              '工作人员很负责任，服务到位'
            ];
            feedback = feedbackTemplates[Math.floor(Math.random() * feedbackTemplates.length)];
            satisfaction = Math.floor(4 + Math.random() * 2); // 4-5分
          } else if (serviceStatus === '进行中') {
            satisfaction = Math.floor(3 + Math.random() * 2); // 3-4分
          }
          
          // 生成备注
          const remarksTemplates = [
            '老人行动不便，需要特别关注',
            '听力不好，需要大声说话',
            '有糖尿病，饮食需要控制',
            '喜欢安静，避免噪音',
            '需要定期复查，关注病情变化',
            '子女不在身边，需要更多陪伴',
            '有轻度认知障碍，需要耐心',
            '喜欢户外活动，天气好时可以外出',
            '有高血压，需要监测血压',
            '喜欢下棋，可以多组织棋类活动'
          ];
          const remarks = Math.random() > 0.7 ? remarksTemplates[Math.floor(Math.random() * remarksTemplates.length)] : '';
          
          return {
            id: `${index + 1}`,
            elderlyId: `${Math.floor(1 + Math.random() * 1250)}`,
            elderlyName,
            serviceType,
            serviceContent,
            serviceDate,
            serviceDuration,
            serviceStaff,
            serviceStatus,
            feedback,
            satisfaction,
            remarks,
          };
        });
      setServiceRecords(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const handleSearch = () => {
    // 实际项目中这里应该调用API进行搜索
    if (!searchText) {
      // 如果搜索框为空，重新加载所有数据
      return;
    }
    
    const filteredData = serviceRecords.filter(
      item => 
        item.elderlyName.includes(searchText) || 
        item.serviceType.includes(searchText) ||
        item.serviceContent.includes(searchText)
    );
    setServiceRecords(filteredData);
  };

  const resetSearch = () => {
    setSearchText('');
    // 重新加载所有数据
  };

  const showModal = (record?: ServiceRecord) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue({
        ...record,
        serviceDate: dayjs(record.serviceDate),
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
        serviceDate: values.serviceDate.format('YYYY-MM-DD'),
      };
      
      if (editingId) {
        // 编辑现有记录
        const updatedList = serviceRecords.map(item => 
          item.id === editingId ? { ...formData, id: editingId } : item
        );
        setServiceRecords(updatedList);
      } else {
        // 添加新记录
        const newRecord = {
          ...formData,
          id: `${serviceRecords.length + 1}`,
          feedback: '',
          satisfaction: 0,
        };
        setServiceRecords([...serviceRecords, newRecord]);
      }
      
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const showFeedbackModal = (record: ServiceRecord) => {
    setCurrentRecord(record);
    feedbackForm.setFieldsValue({
      feedback: record.feedback,
      satisfaction: record.satisfaction,
    });
    setIsFeedbackModalVisible(true);
  };

  const handleFeedbackCancel = () => {
    setIsFeedbackModalVisible(false);
    feedbackForm.resetFields();
  };

  const handleFeedbackSubmit = async () => {
    try {
      const values = await feedbackForm.validateFields();
      
      if (currentRecord) {
        // 更新服务记录的反馈信息
        const updatedList = serviceRecords.map(item => 
          item.id === currentRecord.id ? { ...item, ...values } : item
        );
        setServiceRecords(updatedList);
      }
      
      setIsFeedbackModalVisible(false);
      feedbackForm.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条服务记录吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const updatedList = serviceRecords.filter(item => item.id !== id);
        setServiceRecords(updatedList);
      },
    });
  };

  const getServiceStatusTag = (status: string) => {
    const colorMap: Record<string, string> = {
      '已完成': 'green',
      '进行中': 'blue',
      '已取消': 'red',
      '已预约': 'orange',
    };
    
    return <Tag color={colorMap[status]}>{status}</Tag>;
  };

  const columns = [
    {
      title: '老人姓名',
      dataIndex: 'elderlyName',
      key: 'elderlyName',
      width: 100,
    },
    {
      title: '服务类型',
      dataIndex: 'serviceType',
      key: 'serviceType',
      width: 100,
    },
    {
      title: '服务内容',
      dataIndex: 'serviceContent',
      key: 'serviceContent',
      width: 120,
    },
    {
      title: '服务日期',
      dataIndex: 'serviceDate',
      key: 'serviceDate',
      width: 120,
      sorter: (a: ServiceRecord, b: ServiceRecord) => 
        dayjs(a.serviceDate).unix() - dayjs(b.serviceDate).unix(),
    },
    {
      title: '服务时长(小时)',
      dataIndex: 'serviceDuration',
      key: 'serviceDuration',
      width: 120,
    },
    {
      title: '服务人员',
      dataIndex: 'serviceStaff',
      key: 'serviceStaff',
      width: 120,
    },
    {
      title: '服务状态',
      dataIndex: 'serviceStatus',
      key: 'serviceStatus',
      width: 100,
      render: (text: string) => getServiceStatusTag(text),
    },
    {
      title: '满意度',
      dataIndex: 'satisfaction',
      key: 'satisfaction',
      width: 120,
      render: (rating: number) => rating ? <Rate disabled defaultValue={rating} /> : '未评价',
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: unknown, record: ServiceRecord) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => showModal(record)}
          />
          <Button 
            type="text" 
            icon={<FileTextOutlined />} 
            onClick={() => showFeedbackModal(record)}
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
    <div className="elderly-service-container">
      <Card
        title="老人服务档案管理"
        className="elderly-service-card"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showModal()}
          >
            添加服务记录
          </Button>
        }
      >
        <div className="search-container">
          <Input
            placeholder="请输入老人姓名或服务类型搜索"
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
          dataSource={serviceRecords}
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

      {/* 添加/编辑服务记录表单 */}
      <Modal
        title={editingId ? '编辑服务记录' : '添加服务记录'}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        width={700}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ serviceStatus: '已预约' }}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="elderlyName"
                label="老人姓名"
                rules={[{ required: true, message: '请输入老人姓名' }]}
              >
                <Input placeholder="请输入老人姓名" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="serviceDate"
                label="服务日期"
                rules={[{ required: true, message: '请选择服务日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="serviceType"
                label="服务类型"
                rules={[{ required: true, message: '请选择服务类型' }]}
              >
                <Select placeholder="请选择服务类型">
                  <Option value="日常照料">日常照料</Option>
                  <Option value="助医服务">助医服务</Option>
                  <Option value="助餐服务">助餐服务</Option>
                  <Option value="精神慰藉">精神慰藉</Option>
                  <Option value="文化娱乐">文化娱乐</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="serviceContent"
                label="服务内容"
                rules={[{ required: true, message: '请输入服务内容' }]}
              >
                <Input placeholder="请输入服务内容" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="serviceDuration"
                label="服务时长(小时)"
                rules={[{ required: true, message: '请输入服务时长' }]}
              >
                <Input type="number" placeholder="请输入服务时长" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="serviceStatus"
                label="服务状态"
                rules={[{ required: true, message: '请选择服务状态' }]}
              >
                <Select placeholder="请选择服务状态">
                  <Option value="已预约">已预约</Option>
                  <Option value="进行中">进行中</Option>
                  <Option value="已完成">已完成</Option>
                  <Option value="已取消">已取消</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="serviceStaff"
                label="服务人员"
                rules={[{ required: true, message: '请输入服务人员' }]}
              >
                <Input placeholder="请输入服务人员" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="remarks"
            label="备注"
          >
            <TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 服务反馈表单 */}
      <Modal
        title="服务反馈"
        open={isFeedbackModalVisible}
        onCancel={handleFeedbackCancel}
        onOk={handleFeedbackSubmit}
        width={500}
        destroyOnClose
      >
        {currentRecord && (
          <div className="service-info">
            <Divider orientation="left">服务信息</Divider>
            <Row gutter={16}>
              <Col span={12}>
                <p><strong>老人姓名：</strong>{currentRecord.elderlyName}</p>
                <p><strong>服务类型：</strong>{currentRecord.serviceType}</p>
                <p><strong>服务内容：</strong>{currentRecord.serviceContent}</p>
              </Col>
              <Col span={12}>
                <p><strong>服务日期：</strong>{currentRecord.serviceDate}</p>
                <p><strong>服务人员：</strong>{currentRecord.serviceStaff}</p>
                <p><strong>服务状态：</strong>{getServiceStatusTag(currentRecord.serviceStatus)}</p>
              </Col>
            </Row>
          </div>
        )}
        <Divider orientation="left">服务评价</Divider>
        <Form
          form={feedbackForm}
          layout="vertical"
        >
          <Form.Item
            name="satisfaction"
            label="服务满意度"
            rules={[{ required: true, message: '请评价服务满意度' }]}
          >
            <Rate />
          </Form.Item>

          <Form.Item
            name="feedback"
            label="反馈意见"
            rules={[{ required: true, message: '请输入反馈意见' }]}
          >
            <TextArea rows={4} placeholder="请输入您对本次服务的意见或建议" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ElderlyService; 