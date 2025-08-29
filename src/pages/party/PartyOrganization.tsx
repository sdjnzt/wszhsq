import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Modal, Form, Select, Input, Tag, Row, Col, DatePicker, Tree } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import './PartyOrganization.less';
import dayjs from 'dayjs';

const { Option } = Select;
const { TreeNode } = Tree;

interface PartyOrganization {
  id: string;
  name: string;
  type: string;
  level: string;
  parentId: string | null;
  parentName: string | null;
  leaderName: string;
  leaderPhone: string;
  memberCount: number;
  establishDate: string;
  address: string;
  status: string;
  description: string;
  children?: PartyOrganization[];
}

const PartyOrganizationPage: React.FC = () => {
  const [organizations, setOrganizations] = useState<PartyOrganization[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [treeData, setTreeData] = useState<PartyOrganization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<PartyOrganization | null>(null);

  // 模拟数据
  useEffect(() => {
    setLoading(true);
    
    // 模拟API调用
    setTimeout(() => {
      // 创建党组织层级结构
      const rootOrg: PartyOrganization = {
        id: '1',
        name: '中都街道党工委',
        type: '党工委',
        level: '街道级',
        parentId: null,
        parentName: null,
        leaderName: '张书记',
        leaderPhone: '13800138000',
        memberCount: 120,
        establishDate: '1990-05-01',
        address: '汶上县中都街道办事处',
        status: '正常',
        description: '中都街道党工委负责辖区内党建工作',
        children: []
      };
      
      // 添加社区党委
      const communityOrgs: PartyOrganization[] = Array(2)
        .fill(0)
        .map((_, index) => ({
          id: `2-${index + 1}`,
          name: `${['幸福社区', '和平社区'][index]}党委`,
          type: '党委',
          level: '社区级',
          parentId: '1',
          parentName: '中都街道党工委',
          leaderName: `李${index + 1}书记`,
          leaderPhone: `1380013800${index + 1}`,
          memberCount: 40 + index * 10,
          establishDate: `200${index + 1}-06-01`,
          address: `汶上县中都街道${['幸福社区', '和平社区'][index]}居委会`,
          status: '正常',
          description: `${['幸福社区', '和平社区'][index]}党委负责社区党建工作`,
          children: []
        }));
      
      // 为每个社区党委添加党支部
      communityOrgs.forEach((org, cIndex) => {
        const branchOrgs: PartyOrganization[] = Array(4)
          .fill(0)
          .map((_, index) => ({
            id: `3-${cIndex + 1}-${index + 1}`,
            name: `${org.name.replace('党委', '')}第${index + 1}党支部`,
            type: '党支部',
            level: '支部级',
            parentId: org.id,
            parentName: org.name,
            leaderName: `王${cIndex + 1}${index + 1}`,
            leaderPhone: `1390013900${cIndex}${index}`,
            memberCount: 8 + Math.floor(Math.random() * 10),
            establishDate: `201${index}-07-01`,
            address: `汶上县中都街道${org.name.replace('党委', '')}${index + 1}网格`,
            status: index === 3 ? '筹建中' : '正常',
            description: `${org.name.replace('党委', '')}第${index + 1}党支部负责网格党建工作`,
          }));
        
        org.children = branchOrgs;
      });
      
      rootOrg.children = communityOrgs;
      
      // 扁平化组织列表，用于表格显示
      const flatOrgs: PartyOrganization[] = [
        rootOrg,
        ...communityOrgs,
        ...communityOrgs.flatMap(org => org.children || [])
      ];
      
      setOrganizations(flatOrgs);
      setTreeData([rootOrg]);
      setLoading(false);
    }, 500);
  }, []);

  const handleSearch = () => {
    // 实际项目中这里应该调用API进行搜索
    if (!searchText) {
      // 如果搜索框为空，重新加载所有数据
      return;
    }
    
    const filteredData = organizations.filter(
      item => 
        item.name.includes(searchText) || 
        item.type.includes(searchText) || 
        item.leaderName.includes(searchText)
    );
    setOrganizations(filteredData);
  };

  const resetSearch = () => {
    setSearchText('');
    // 重新加载所有数据
  };

  const showModal = (record?: PartyOrganization) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue({
        ...record,
        establishDate: record.establishDate ? dayjs(record.establishDate) : null,
      });
    } else {
      setEditingId(null);
      form.resetFields();
      
      // 如果当前选中了组织，则设置为父组织
      if (selectedOrg) {
        form.setFieldsValue({
          parentId: selectedOrg.id,
          parentName: selectedOrg.name,
        });
      }
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
        establishDate: values.establishDate ? values.establishDate.format('YYYY-MM-DD') : null,
      };
      
      if (editingId) {
        // 编辑现有组织信息
        const updatedList = organizations.map(item => 
          item.id === editingId ? { ...formData, id: editingId } : item
        );
        setOrganizations(updatedList);
        
        // 更新树结构
        updateTreeData(treeData, editingId, formData);
        setTreeData([...treeData]);
      } else {
        // 添加新组织信息
        const newId = `${organizations.length + 1}`;
        const newOrg = {
          ...formData,
          id: newId,
        };
        setOrganizations([...organizations, newOrg]);
        
        // 更新树结构
        if (formData.parentId) {
          addToTreeData(treeData, formData.parentId, { ...newOrg });
          setTreeData([...treeData]);
        } else {
          // 如果是根节点
          setTreeData([...treeData, newOrg]);
        }
      }
      
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 更新树数据中的节点
  const updateTreeData = (data: PartyOrganization[], id: string, values: PartyOrganization) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        data[i] = { ...data[i], ...values };
        return;
      }
      const children = data[i].children;
      if (children && children.length > 0) {
        updateTreeData(children, id, values);
      }
    }
  };

  // 添加节点到树数据
  const addToTreeData = (data: PartyOrganization[], parentId: string, newNode: PartyOrganization) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === parentId) {
        if (!data[i].children) {
          data[i].children = [];
        }
        data[i].children!.push(newNode);
        return;
      }
      const children = data[i].children;
      if (children && children.length > 0) {
        addToTreeData(children, parentId, newNode);
      }
    }
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个党组织吗？如果有下级组织，将一并删除。',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // 检查是否有下级组织
        const hasChildren = organizations.some(item => item.parentId === id);
        
        if (hasChildren) {
          Modal.error({
            title: '无法删除',
            content: '该组织下有下级组织，请先删除下级组织。'
          });
          return;
        }
        
        const updatedList = organizations.filter(item => item.id !== id);
        setOrganizations(updatedList);
        
        // 更新树结构
        removeFromTreeData(treeData, id);
        setTreeData([...treeData]);
      },
    });
  };

  // 从树数据中移除节点
  const removeFromTreeData = (data: PartyOrganization[], id: string) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        data.splice(i, 1);
        return true;
      }
      const children = data[i].children;
      if (children && children.length > 0) {
        const removed = removeFromTreeData(children, id);
        if (removed && children.length === 0) {
          data[i].children = [];
        }
        if (removed) return true;
      }
    }
    return false;
  };

  const getStatusTag = (status: string) => {
    return <Tag color={status === '正常' ? 'green' : 'orange'}>{status}</Tag>;
  };

  const getTypeTag = (type: string) => {
    const colorMap: Record<string, string> = {
      '党工委': 'red',
      '党委': 'volcano',
      '党支部': 'blue',
      '党小组': 'cyan',
    };
    
    return <Tag color={colorMap[type] || 'blue'}>{type}</Tag>;
  };

  const getLevelTag = (level: string) => {
    const colorMap: Record<string, string> = {
      '街道级': 'purple',
      '社区级': 'geekblue',
      '支部级': 'green',
      '小组级': 'lime',
    };
    
    return <Tag color={colorMap[level] || 'blue'}>{level}</Tag>;
  };

  const columns = [
    {
      title: '组织名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
    },
    {
      title: '组织类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (text: string) => getTypeTag(text),
    },
    {
      title: '组织级别',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      render: (text: string) => getLevelTag(text),
    },
    {
      title: '上级组织',
      dataIndex: 'parentName',
      key: 'parentName',
      width: 180,
      render: (text: string) => text || '无',
    },
    {
      title: '负责人',
      dataIndex: 'leaderName',
      key: 'leaderName',
      width: 100,
    },
    {
      title: '联系电话',
      dataIndex: 'leaderPhone',
      key: 'leaderPhone',
      width: 120,
    },
    {
      title: '党员数量',
      dataIndex: 'memberCount',
      key: 'memberCount',
      width: 100,
      sorter: (a: PartyOrganization, b: PartyOrganization) => a.memberCount - b.memberCount,
    },
    {
      title: '成立日期',
      dataIndex: 'establishDate',
      key: 'establishDate',
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
      render: (_: unknown, record: PartyOrganization) => (
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

  // 处理树节点选择
  const handleTreeSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0) {
      const selectedId = selectedKeys[0].toString();
      const selected = organizations.find(org => org.id === selectedId);
      if (selected) {
        setSelectedOrg(selected);
      }
    } else {
      setSelectedOrg(null);
    }
  };

  // 渲染树节点
  const renderTreeNodes = (data: PartyOrganization[]) => 
    data.map(item => {
      const icon = item.type === '党支部' ? <TeamOutlined /> : <UserOutlined />;
      
      if (item.children) {
        return (
          <TreeNode 
            title={item.name} 
            key={item.id} 
            icon={icon}
          >
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} icon={icon} />;
    });

  return (
    <div className="party-organization-container">
      <Row gutter={16}>
        <Col span={6}>
          <Card title="组织架构" className="organization-tree-card">
            <div className="tree-actions">
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                size="small"
                onClick={() => showModal()}
              >
                添加组织
              </Button>
            </div>
            <Tree
              showIcon
              defaultExpandAll
              onSelect={handleTreeSelect}
              className="organization-tree"
            >
              {renderTreeNodes(treeData)}
            </Tree>
          </Card>
        </Col>
        <Col span={18}>
          <Card
            title="党组织管理"
            className="organization-table-card"
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => showModal()}
              >
                添加组织
              </Button>
            }
          >
            <div className="search-container">
              <Input
                placeholder="请输入组织名称/类型/负责人搜索"
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
              dataSource={organizations}
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
        </Col>
      </Row>

      <Modal
        title={editingId ? '编辑组织信息' : '添加组织信息'}
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
            type: '党支部',
            level: '支部级',
            status: '正常',
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="组织名称"
                rules={[{ required: true, message: '请输入组织名称' }]}
              >
                <Input placeholder="请输入组织名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="组织类型"
                rules={[{ required: true, message: '请选择组织类型' }]}
              >
                <Select placeholder="请选择组织类型">
                  <Option value="党工委">党工委</Option>
                  <Option value="党委">党委</Option>
                  <Option value="党支部">党支部</Option>
                  <Option value="党小组">党小组</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="level"
                label="组织级别"
                rules={[{ required: true, message: '请选择组织级别' }]}
              >
                <Select placeholder="请选择组织级别">
                  <Option value="街道级">街道级</Option>
                  <Option value="社区级">社区级</Option>
                  <Option value="支部级">支部级</Option>
                  <Option value="小组级">小组级</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="组织状态"
                rules={[{ required: true, message: '请选择组织状态' }]}
              >
                <Select placeholder="请选择组织状态">
                  <Option value="正常">正常</Option>
                  <Option value="筹建中">筹建中</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="parentId"
                label="上级组织ID"
                tooltip="如果是顶级组织，可不填"
              >
                <Input placeholder="上级组织ID" disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="parentName"
                label="上级组织名称"
              >
                <Input placeholder="上级组织名称" disabled />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="leaderName"
                label="负责人姓名"
                rules={[{ required: true, message: '请输入负责人姓名' }]}
              >
                <Input placeholder="请输入负责人姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="leaderPhone"
                label="负责人电话"
                rules={[
                  { required: true, message: '请输入负责人电话' },
                  { pattern: /^1\d{10}$/, message: '请输入正确的手机号' },
                ]}
              >
                <Input placeholder="请输入负责人电话" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="memberCount"
                label="党员数量"
                rules={[{ required: true, message: '请输入党员数量' }]}
              >
                <Input type="number" placeholder="请输入党员数量" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="establishDate"
                label="成立日期"
                rules={[{ required: true, message: '请选择成立日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="组织地址"
            rules={[{ required: true, message: '请输入组织地址' }]}
          >
            <Input placeholder="请输入组织地址" />
          </Form.Item>

          <Form.Item
            name="description"
            label="组织描述"
          >
            <Input.TextArea placeholder="请输入组织描述" rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PartyOrganizationPage; 