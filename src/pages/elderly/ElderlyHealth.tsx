import React, { useState, useEffect } from 'react';
import { Card, Table, Input, Button, Space, Modal, Form, Select, DatePicker, Tag, Row, Col, Tabs, Typography, Descriptions } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, FileTextOutlined, EyeOutlined } from '@ant-design/icons';
import './ElderlyHealth.less';
import dayjs from 'dayjs';

const { Option } = Select;
const { TabPane } = Tabs;
const { Title, Paragraph } = Typography;

interface HealthRecord {
  id: string;
  elderlyId: string;
  elderlyName: string;
  recordDate: string;
  recordType: string;
  bloodPressure: string;
  bloodSugar: string;
  heartRate: string;
  temperature: string;
  weight: string;
  height: string;
  bmi: string;
  diagnosis: string;
  medication: string;
  doctorAdvice: string;
  nextCheckDate: string;
  doctorName: string;
  hospitalName: string;
}

const ElderlyHealth: React.FC = () => {
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<HealthRecord | null>(null);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);

  // 模拟数据 - 基于大型社区实际规模
  useEffect(() => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      // 生成更真实的健康记录数据
      const mockData: HealthRecord[] = Array(3750) // 基于1250位老人，平均每人3次健康记录
        .fill(0)
        .map((_, index) => {
          // 生成真实的老人姓名
          const familyNames = ['张', '李', '王', '赵', '刘', '陈', '孙', '周', '吴', '郑', '马', '朱', '胡', '林', '何', '郭', '高', '罗', '梁', '宋', '韩', '冯', '于', '董', '萧', '程', '曹', '袁', '邓', '许', '傅', '沈', '曾', '彭', '吕', '苏', '卢', '蒋', '蔡', '贾', '丁', '魏', '薛', '叶', '阎', '余', '潘', '杜', '戴', '夏', '钟', '汪', '田', '任', '姜', '范', '方', '石', '姚', '谭', '廖', '邹', '熊', '金', '陆', '郝', '孔', '白', '崔', '康', '毛', '邱', '秦', '江', '史', '顾', '侯', '邵', '孟', '龙', '万', '段', '雷', '钱', '汤', '尹', '黎', '易', '常', '武', '乔', '贺', '赖', '龚', '文'];
          const givenNames = ['建国', '建军', '建华', '建平', '建强', '建明', '建文', '建武', '国强', '国华', '国平', '国明', '国文', '国武', '志强', '志华', '志平', '志明', '志文', '志武', '德明', '德华', '德平', '德强', '德文', '德武', '秀英', '秀华', '秀平', '秀明', '秀文', '秀武', '丽娜', '丽华', '丽平', '丽明', '丽文', '丽武', '美华', '美平', '美明', '美文', '美武', '建华', '建平', '建明', '建文', '建武', '芳', '娜', '婷', '玲', '静', '敏', '文', '丽', '霞', '芬', '燕', '红', '梅', '兰', '菊', '竹', '英', '华', '秀', '珍', '珠', '玉', '琴', '香', '春', '夏', '秋', '冬', '月', '星', '云', '雨', '雪', '风', '花', '草', '树', '山', '水', '火', '土', '金', '木'];
          
          const familyName = familyNames[Math.floor(Math.random() * familyNames.length)];
          const givenName = givenNames[Math.floor(Math.random() * givenNames.length)];
          const elderlyName = familyName + givenName;
          
          // 生成记录类型
          const recordTypes = ['常规体检', '慢病随访', '专项检查', '住院记录', '康复治疗', '中医调理', '营养咨询', '心理评估'];
          const recordType = recordTypes[Math.floor(Math.random() * recordTypes.length)];
          
          // 生成真实的血压数据
          const systolic = Math.floor(100 + Math.random() * 60); // 100-160mmHg
          const diastolic = Math.floor(60 + Math.random() * 40); // 60-100mmHg
          const bloodPressure = `${systolic}/${diastolic}mmHg`;
          
          // 生成真实的血糖数据
          const bloodSugar = (4 + Math.random() * 4).toFixed(1); // 4-8mmol/L
          
          // 生成真实的心率数据
          const heartRate = Math.floor(55 + Math.random() * 35); // 55-90次/分
          
          // 生成真实的体温数据
          const temperature = (36.2 + Math.random() * 1.6).toFixed(1); // 36.2-37.8℃
          
          // 生成真实的体重和身高数据
          const height = Math.floor(150 + Math.random() * 30); // 150-180cm
          const weight = Math.floor(45 + Math.random() * 35); // 45-80kg
          const bmi = (weight / Math.pow(height / 100, 2)).toFixed(1);
          
          // 生成诊断结果
          const diagnoses = [
            '高血压', '糖尿病', '冠心病', '关节炎', '骨质疏松', '慢性支气管炎', 
            '脑梗塞后遗症', '帕金森病', '老年性白内障', '前列腺增生', '正常'
          ];
          const diagnosis = diagnoses[Math.floor(Math.random() * diagnoses.length)];
          
          // 生成用药信息
          let medication = '无';
          if (diagnosis === '高血压') {
            const antihypertensiveDrugs = [
              '苯磺酸氨氯地平片 5mg 每日一次',
              '缬沙坦胶囊 80mg 每日一次',
              '氢氯噻嗪片 25mg 每日一次',
              '美托洛尔片 25mg 每日两次'
            ];
            medication = `降压药物：${antihypertensiveDrugs[Math.floor(Math.random() * antihypertensiveDrugs.length)]}`;
          } else if (diagnosis === '糖尿病') {
            const antidiabeticDrugs = [
              '格列美脲片 2mg 每日两次',
              '二甲双胍片 0.5g 每日三次',
              '阿卡波糖片 50mg 每日三次',
              '胰岛素注射液 10单位 每日两次'
            ];
            medication = `降糖药物：${antidiabeticDrugs[Math.floor(Math.random() * antidiabeticDrugs.length)]}`;
          } else if (diagnosis === '冠心病') {
            const cardiacDrugs = [
              '硝酸甘油片 0.5mg 舌下含服',
              '阿司匹林肠溶片 100mg 每日一次',
              '辛伐他汀片 20mg 每日一次',
              '美托洛尔片 25mg 每日两次'
            ];
            medication = `心血管药物：${cardiacDrugs[Math.floor(Math.random() * cardiacDrugs.length)]}`;
          }
          
          // 生成医生建议
          const doctorAdvices = [
            '注意饮食，控制盐分摄入，多运动，保持心情舒畅，按时服药。',
            '定期监测血压，避免剧烈运动，保持规律作息，戒烟限酒。',
            '控制饮食，适量运动，定期检查血糖，注意足部护理。',
            '保持关节活动，避免受凉，适当按摩，必要时热敷。',
            '多晒太阳，补充钙质，适量运动，预防跌倒。',
            '注意保暖，避免感冒，戒烟，保持室内空气清新。',
            '坚持康复训练，定期复查，保持乐观心态。',
            '按时服药，定期复查，保持良好生活习惯。',
            '定期眼科检查，避免强光刺激，保持眼部卫生。',
            '多饮水，避免久坐，定期检查前列腺。'
          ];
          const doctorAdvice = doctorAdvices[Math.floor(Math.random() * doctorAdvices.length)];
          
          // 生成下次检查日期
          const nextCheckDate = dayjs().add(Math.floor(1 + Math.random() * 90), 'day').format('YYYY-MM-DD');
          
          // 生成医生姓名
          const doctorFamilyNames = ['李', '王', '张', '刘', '陈', '赵', '孙', '周', '吴', '郑'];
          const doctorGivenNames = ['伟', '强', '军', '杰', '明', '华', '建', '勇', '刚', '超', '芳', '娜', '婷', '玲', '静', '敏', '文', '丽', '霞', '芬'];
          const doctorFamilyName = doctorFamilyNames[Math.floor(Math.random() * doctorFamilyNames.length)];
          const doctorGivenName = doctorGivenNames[Math.floor(Math.random() * doctorGivenNames.length)];
          const doctorName = doctorFamilyName + doctorGivenName + '医生';
          
          // 生成医院名称
          const hospitals = [
            '汶上县人民医院', '汶上县中医院', '汶上县妇幼保健院', 
            '中都街道社区卫生服务中心', '汶上县康复医院', '汶上县老年病医院'
          ];
          const hospitalName = hospitals[Math.floor(Math.random() * hospitals.length)];
          
          // 生成记录日期（最近6个月）
          const recordDate = dayjs().subtract(Math.floor(Math.random() * 180), 'day').format('YYYY-MM-DD');
          
          return {
          id: `${index + 1}`,
            elderlyId: `${Math.floor(1 + Math.random() * 1250)}`,
            elderlyName,
            recordDate,
            recordType,
            bloodPressure,
            bloodSugar: bloodSugar + 'mmol/L',
            heartRate: heartRate + '次/分',
            temperature: temperature + '℃',
            weight: weight + 'kg',
            height: height + 'cm',
            bmi,
            diagnosis,
            medication,
            doctorAdvice,
            nextCheckDate,
            doctorName,
            hospitalName,
          };
        });
      setHealthRecords(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const handleSearch = () => {
    // 实际项目中这里应该调用API进行搜索
    if (!searchText) {
      // 如果搜索框为空，重新加载所有数据
      return;
    }
    
    const filteredData = healthRecords.filter(
      item => 
        item.elderlyName.includes(searchText) || 
        item.diagnosis.includes(searchText)
    );
    setHealthRecords(filteredData);
  };

  const resetSearch = () => {
    setSearchText('');
    // 重新加载所有数据
  };

  const showModal = (record?: HealthRecord) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue({
        ...record,
        recordDate: dayjs(record.recordDate),
        nextCheckDate: dayjs(record.nextCheckDate),
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
        recordDate: values.recordDate.format('YYYY-MM-DD'),
        nextCheckDate: values.nextCheckDate.format('YYYY-MM-DD'),
      };
      
      if (editingId) {
        // 编辑现有记录
        const updatedList = healthRecords.map(item => 
          item.id === editingId ? { ...formData, id: editingId } : item
        );
        setHealthRecords(updatedList);
      } else {
        // 添加新记录
        const newRecord = {
          ...formData,
          id: `${healthRecords.length + 1}`,
        };
        setHealthRecords([...healthRecords, newRecord]);
      }
      
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const viewRecord = (record: HealthRecord) => {
    setCurrentRecord(record);
    setIsViewModalVisible(true);
  };

  const getRecordTypeTag = (type: string) => {
    const colorMap: Record<string, string> = {
      '常规体检': 'green',
      '慢病随访': 'blue',
      '专项检查': 'orange',
      '住院记录': 'red',
    };
    
    return <Tag color={colorMap[type]}>{type}</Tag>;
  };

  const columns = [
    {
      title: '老人姓名',
      dataIndex: 'elderlyName',
      key: 'elderlyName',
      width: 100,
    },
    {
      title: '检查日期',
      dataIndex: 'recordDate',
      key: 'recordDate',
      width: 120,
      sorter: (a: HealthRecord, b: HealthRecord) => 
        dayjs(a.recordDate).unix() - dayjs(b.recordDate).unix(),
    },
    {
      title: '记录类型',
      dataIndex: 'recordType',
      key: 'recordType',
      width: 120,
      render: (text: string) => getRecordTypeTag(text),
    },
    {
      title: '血压',
      dataIndex: 'bloodPressure',
      key: 'bloodPressure',
      width: 120,
    },
    {
      title: '血糖',
      dataIndex: 'bloodSugar',
      key: 'bloodSugar',
      width: 100,
    },
    {
      title: '诊断结果',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
      width: 120,
    },
    {
      title: '下次随访',
      dataIndex: 'nextCheckDate',
      key: 'nextCheckDate',
      width: 120,
    },
    {
      title: '医生',
      dataIndex: 'doctorName',
      key: 'doctorName',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: unknown, record: HealthRecord) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => viewRecord(record)}
          />
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => showModal(record)}
          />
          <Button 
            type="text" 
            icon={<FileTextOutlined />} 
            onClick={() => window.print()}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="elderly-health-container">
      <Card
        title="老人健康档案管理"
        className="elderly-health-card"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showModal()}
          >
            添加健康记录
          </Button>
        }
      >
        <div className="search-container">
          <Input
            placeholder="请输入老人姓名或诊断结果搜索"
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
          dataSource={healthRecords}
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

      {/* 添加/编辑健康记录表单 */}
      <Modal
        title={editingId ? '编辑健康记录' : '添加健康记录'}
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
                name="elderlyName"
                label="老人姓名"
                rules={[{ required: true, message: '请输入老人姓名' }]}
              >
                <Input placeholder="请输入老人姓名" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="recordDate"
                label="检查日期"
                rules={[{ required: true, message: '请选择检查日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="recordType"
                label="记录类型"
                rules={[{ required: true, message: '请选择记录类型' }]}
              >
                <Select placeholder="请选择记录类型">
                  <Option value="常规体检">常规体检</Option>
                  <Option value="慢病随访">慢病随访</Option>
                  <Option value="专项检查">专项检查</Option>
                  <Option value="住院记录">住院记录</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="bloodPressure"
                label="血压"
              >
                <Input placeholder="如: 120/80mmHg" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="bloodSugar"
                label="血糖"
              >
                <Input placeholder="如: 5.6mmol/L" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="heartRate"
                label="心率"
              >
                <Input placeholder="如: 75次/分" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="temperature"
                label="体温"
              >
                <Input placeholder="如: 36.5℃" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="weight"
                label="体重"
              >
                <Input placeholder="如: 65kg" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="height"
                label="身高"
              >
                <Input placeholder="如: 170cm" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="bmi"
                label="BMI"
              >
                <Input placeholder="如: 22.5" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="diagnosis"
            label="诊断结果"
            rules={[{ required: true, message: '请输入诊断结果' }]}
          >
            <Input placeholder="请输入诊断结果" />
          </Form.Item>

          <Form.Item
            name="medication"
            label="用药情况"
          >
            <Input.TextArea rows={3} placeholder="请输入用药情况" />
          </Form.Item>

          <Form.Item
            name="doctorAdvice"
            label="医嘱"
          >
            <Input.TextArea rows={3} placeholder="请输入医嘱" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="nextCheckDate"
                label="下次随访日期"
                rules={[{ required: true, message: '请选择下次随访日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="doctorName"
                label="医生姓名"
                rules={[{ required: true, message: '请输入医生姓名' }]}
              >
                <Input placeholder="请输入医生姓名" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="hospitalName"
                label="医院名称"
                rules={[{ required: true, message: '请输入医院名称' }]}
              >
                <Input placeholder="请输入医院名称" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 查看健康记录详情 */}
      <Modal
        title="健康档案详情"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="print" type="primary" icon={<FileTextOutlined />} onClick={() => window.print()}>
            打印档案
          </Button>,
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        {currentRecord && (
          <div className="health-record-detail">
            <Tabs defaultActiveKey="1">
              <TabPane tab="基本信息" key="1">
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="老人姓名">{currentRecord.elderlyName}</Descriptions.Item>
                  <Descriptions.Item label="检查日期">{currentRecord.recordDate}</Descriptions.Item>
                  <Descriptions.Item label="记录类型">{getRecordTypeTag(currentRecord.recordType)}</Descriptions.Item>
                  <Descriptions.Item label="医院名称">{currentRecord.hospitalName}</Descriptions.Item>
                  <Descriptions.Item label="医生姓名">{currentRecord.doctorName}</Descriptions.Item>
                  <Descriptions.Item label="下次随访日期">{currentRecord.nextCheckDate}</Descriptions.Item>
                </Descriptions>
              </TabPane>
              <TabPane tab="体检数据" key="2">
                <Descriptions bordered column={3}>
                  <Descriptions.Item label="血压">{currentRecord.bloodPressure}</Descriptions.Item>
                  <Descriptions.Item label="血糖">{currentRecord.bloodSugar}</Descriptions.Item>
                  <Descriptions.Item label="心率">{currentRecord.heartRate}</Descriptions.Item>
                  <Descriptions.Item label="体温">{currentRecord.temperature}</Descriptions.Item>
                  <Descriptions.Item label="体重">{currentRecord.weight}</Descriptions.Item>
                  <Descriptions.Item label="身高">{currentRecord.height}</Descriptions.Item>
                  <Descriptions.Item label="BMI">{currentRecord.bmi}</Descriptions.Item>
                </Descriptions>
              </TabPane>
              <TabPane tab="诊断与医嘱" key="3">
                <div className="diagnosis-section">
                  <Title level={5}>诊断结果</Title>
                  <Paragraph>{currentRecord.diagnosis}</Paragraph>
                  
                  <Title level={5}>用药情况</Title>
                  <Paragraph>
                    {currentRecord.medication.split('\n').map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                  </Paragraph>
                  
                  <Title level={5}>医嘱</Title>
                  <Paragraph>{currentRecord.doctorAdvice}</Paragraph>
                </div>
              </TabPane>
            </Tabs>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ElderlyHealth; 