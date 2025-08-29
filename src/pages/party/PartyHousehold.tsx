import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Modal, Form, Select, Input, Tag, Row, Col, DatePicker, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import './PartyHousehold.less';
import dayjs from 'dayjs';

const { Option } = Select;
const { TabPane } = Tabs;

interface PartyHousehold {
  id: string;
  partyMemberId: string;
  partyMemberName: string;
  householdCount: number;
  householdType: string;
  gridName: string;
  buildingInfo: string;
  startDate: string;
  endDate: string | null;
  status: string;
  households: Household[];
  partyBranch: string;
}

interface Household {
  id: string;
  householdName: string;
  householdType: string;
  address: string;
  memberCount: number;
  contactPhone: string;
  specialNeeds: string[];
}

const PartyHouseholdPage: React.FC = () => {
  const [households, setHouseholds] = useState<PartyHousehold[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [members, setMembers] = useState<{id: string, name: string}[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');

  // 模拟数据 - 基于大型社区实际规模
  useEffect(() => {
    setLoading(true);
    
    // 生成更真实的党员数据
    const familyNames = ['张', '李', '王', '赵', '刘', '陈', '孙', '周', '吴', '郑', '马', '朱', '胡', '林', '何', '郭', '高', '罗', '梁', '宋', '韩', '冯', '于', '董', '萧', '程', '曹', '袁', '邓', '许', '傅', '沈', '曾', '彭', '吕', '苏', '卢', '蒋', '蔡', '贾', '丁', '魏', '薛', '叶', '阎', '余', '潘', '杜', '戴', '夏', '钟', '汪', '田', '任', '姜', '范', '方', '石', '姚', '谭', '廖', '邹', '熊', '金', '陆', '郝', '孔', '白', '崔', '康', '毛', '邱', '秦', '江', '史', '顾', '侯', '邵', '孟', '龙', '万', '段', '雷', '钱', '汤', '尹', '黎', '易', '常', '武', '乔', '贺', '赖', '龚', '文'];
    const givenNames = ['建国', '建军', '建华', '建平', '建强', '建明', '建文', '建武', '国强', '国华', '国平', '国明', '国文', '国武', '志强', '志华', '志平', '志明', '志文', '志武', '德明', '德华', '德平', '德强', '德文', '德武', '秀英', '秀华', '秀平', '秀明', '秀文', '秀武', '丽娜', '丽华', '丽平', '丽明', '丽文', '丽武', '美华', '美平', '美明', '美文', '美武', '建华', '建平', '建明', '建文', '建武', '芳', '娜', '婷', '玲', '静', '敏', '文', '丽', '霞', '芬', '燕', '红', '梅', '兰', '菊', '竹', '英', '华', '秀', '珍', '珠', '玉', '琴', '香', '春', '夏', '秋', '冬', '月', '星', '云', '雨', '雪', '风', '花', '草', '树', '山', '水', '火', '土', '金', '木'];
    
    const mockMembers = Array(150)
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
      // 生成更真实的联户数据
      const mockData: PartyHousehold[] = Array(150) // 基于大型社区党员规模
        .fill(0)
        .map((_, index) => {
          // 生成真实的党员姓名
          const familyName = familyNames[Math.floor(Math.random() * familyNames.length)];
          const givenName = givenNames[Math.floor(Math.random() * givenNames.length)];
          const partyMemberName = familyName + givenName;
          
          // 联系家庭数量 - 更合理的分布（1-8户）
          const householdCount = Math.floor(1 + Math.random() * 8);
          
          // 生成联系的家庭详情
          const households: Household[] = Array(householdCount)
            .fill(0)
            .map((_, hIndex) => {
              // 生成真实的家庭姓氏
              const householdFamilyName = familyNames[Math.floor(Math.random() * familyNames.length)];
              const householdGivenNames = ['伟', '强', '军', '杰', '明', '华', '建', '勇', '刚', '超', '芳', '娜', '婷', '玲', '静', '敏', '文', '丽', '霞', '芬', '燕', '红', '梅', '兰', '菊', '竹', '英', '华', '秀', '珍', '珠', '玉', '琴', '香', '春', '夏', '秋', '冬', '月', '星', '云', '雨', '雪', '风', '花', '草', '树', '山', '水', '火', '土', '金', '木'];
              const householdGivenName = householdGivenNames[Math.floor(Math.random() * householdGivenNames.length)];
              const householdName = householdFamilyName + householdGivenName + '家庭';
              
              // 家庭类型 - 更丰富的分类
              const householdTypes = ['普通家庭', '低保家庭', '特困家庭', '残疾人家庭', '空巢老人家庭', '单亲家庭', '留守儿童家庭', '优抚对象家庭', '退役军人家庭', '困难职工家庭'];
              const householdType = householdTypes[Math.floor(Math.random() * householdTypes.length)];
              
              // 生成真实的地址（基于中都花园8个区域）
              const areas = ['中都花园A区', '中都花园B区', '中都花园C区', '中都花园D区', '中都花园E区', '中都花园F区', '中都花园G区', '中都花园H区'];
              const area = areas[Math.floor(Math.random() * areas.length)];
              const building = Math.floor(Math.random() * 20) + 1;
              const unit = Math.floor(Math.random() * 8) + 1;
              const room = Math.floor(Math.random() * 20) + 1;
              const floor = Math.floor(Math.random() * 18) + 1;
              const address = `汶上县中都街道${area}${building}栋${unit}单元${floor}0${room}`;
              
              // 家庭成员数量 - 更合理的分布（1-6人）
              const memberCount = Math.floor(1 + Math.random() * 6);
              
              // 生成真实的联系电话
              const contactPhone = `1${[3, 5, 6, 7, 8, 9][Math.floor(Math.random() * 6)]}${Math.floor(100000000 + Math.random() * 900000000)}`;
              
              // 特殊需求 - 基于家庭类型生成
              const allSpecialNeeds = [
                '医疗帮扶', '就业帮扶', '教育帮扶', '精神慰藉', '生活照料', '法律援助', 
                '心理疏导', '技能培训', '资金援助', '住房保障', '子女教育', '养老护理',
                '康复训练', '社会融入', '政策咨询', '权益维护', '文化娱乐', '志愿服务'
              ];
              
              let specialNeeds: string[] = [];
              if (householdType !== '普通家庭') {
                // 特殊家庭有70%的概率需要帮扶
                if (Math.random() > 0.3) {
                  const needCount = Math.floor(1 + Math.random() * 4);
                  const shuffled = allSpecialNeeds.sort(() => 0.5 - Math.random());
                  specialNeeds = shuffled.slice(0, needCount);
                }
              } else {
                // 普通家庭有20%的概率需要帮扶
                if (Math.random() > 0.8) {
                  const needCount = Math.floor(1 + Math.random() * 2);
                  const shuffled = allSpecialNeeds.sort(() => 0.5 - Math.random());
                  specialNeeds = shuffled.slice(0, needCount);
                }
              }
              
              return {
              id: `${index}-${hIndex}`,
                householdName,
                householdType,
                address,
                memberCount,
                contactPhone,
                specialNeeds,
              };
            });
          
          // 家庭类型 - 基于联系的家庭类型判断
          const hasSpecialFamily = households.some(h => h.householdType !== '普通家庭');
          const householdType = hasSpecialFamily ? '特殊家庭' : '普通家庭';
          
          // 所属网格 - 基于实际的8个网格区域
          const gridNames = [
            '中都花园A区网格', '中都花园B区网格', '中都花园C区网格', '中都花园D区网格',
            '中都花园E区网格', '中都花园F区网格', '中都花园G区网格', '中都花园H区网格'
          ];
          const gridName = gridNames[Math.floor(Math.random() * gridNames.length)];
          
          // 楼栋信息 - 更真实的楼栋描述
          const building = Math.floor(Math.random() * 20) + 1;
          const unit = Math.floor(Math.random() * 8) + 1;
          const buildingInfo = `${building}号楼${unit}单元`;
          
          // 开始日期 - 更合理的时间分布
          const startDate = dayjs().subtract(Math.floor(Math.random() * 1825), 'day').format('YYYY-MM-DD'); // 最近5年
          
          // 结束日期 - 大部分是长期联系
          let endDate = null;
          if (Math.random() > 0.85) { // 15%的联系有结束日期
            endDate = dayjs().add(Math.floor(1 + Math.random() * 1095), 'day').format('YYYY-MM-DD'); // 未来1-3年
          }
          
          // 状态 - 大部分在联系中
          const status = Math.random() > 0.92 ? '已解除' : '联系中'; // 8%解除率
          
          // 党支部 - 基于实际区域
          const partyBranches = [
            '第一党支部', '第二党支部', '第三党支部', '第四党支部', '第五党支部', '第六党支部', '第七党支部', '第八党支部',
            'A区党支部', 'B区党支部', 'C区党支部', 'D区党支部', 'E区党支部', 'F区党支部', 'G区党支部', 'H区党支部'
          ];
          const partyBranch = partyBranches[Math.floor(Math.random() * partyBranches.length)];
          
          return {
            id: `${index + 1}`,
            partyMemberId: `${Math.floor(1 + Math.random() * 150)}`,
            partyMemberName,
            householdCount,
            householdType,
            gridName,
            buildingInfo,
            startDate,
            endDate,
            status,
            households,
            partyBranch,
          };
        });
      setHouseholds(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const handleSearch = () => {
    // 实际项目中这里应该调用API进行搜索
    if (!searchText) {
      // 如果搜索框为空，重新加载所有数据
      return;
    }
    
    const filteredData = households.filter(
      item => 
        item.partyMemberName.includes(searchText) || 
        item.gridName.includes(searchText) || 
        item.buildingInfo.includes(searchText) ||
        item.partyBranch.includes(searchText)
    );
    setHouseholds(filteredData);
  };

  const resetSearch = () => {
    setSearchText('');
    // 重新加载所有数据 - 重新生成模拟数据
    setLoading(true);
    setTimeout(() => {
      // 重新生成数据
      const familyNames = ['张', '李', '王', '赵', '刘', '陈', '孙', '周', '吴', '郑', '马', '朱', '胡', '林', '何', '郭', '高', '罗', '梁', '宋', '韩', '冯', '于', '董', '萧', '程', '曹', '袁', '邓', '许', '傅', '沈', '曾', '彭', '吕', '苏', '卢', '蒋', '蔡', '贾', '丁', '魏', '薛', '叶', '阎', '余', '潘', '杜', '戴', '夏', '钟', '汪', '田', '任', '姜', '范', '方', '石', '姚', '谭', '廖', '邹', '熊', '金', '陆', '郝', '孔', '白', '崔', '康', '毛', '邱', '秦', '江', '史', '顾', '侯', '邵', '孟', '龙', '万', '段', '雷', '钱', '汤', '尹', '黎', '易', '常', '武', '乔', '贺', '赖', '龚', '文'];
    const givenNames = ['建国', '建军', '建华', '建平', '建强', '建明', '建文', '建武', '国强', '国华', '国平', '国明', '国文', '国武', '志强', '志华', '志平', '志明', '志文', '志武', '德明', '德华', '德平', '德强', '德文', '德武', '秀英', '秀华', '秀平', '秀明', '秀文', '秀武', '丽娜', '丽华', '丽平', '丽明', '丽文', '丽武', '美华', '美平', '美明', '美文', '美武', '建华', '建平', '建明', '建文', '建武', '芳', '娜', '婷', '玲', '静', '敏', '文', '丽', '霞', '芬', '燕', '红', '梅', '兰', '菊', '竹', '英', '华', '秀', '珍', '珠', '玉', '琴', '香', '春', '夏', '秋', '冬', '月', '星', '云', '雨', '雪', '风', '花', '草', '树', '山', '水', '火', '土', '金', '木'];
    
    // 重新生成联户数据
    const mockData: PartyHousehold[] = Array(150)
      .fill(0)
      .map((_, index) => {
        // 生成真实的党员姓名
        const familyName = familyNames[Math.floor(Math.random() * familyNames.length)];
        const givenName = givenNames[Math.floor(Math.random() * givenNames.length)];
        const partyMemberName = familyName + givenName;
        
        // 联系家庭数量 - 更合理的分布（1-8户）
        const householdCount = Math.floor(1 + Math.random() * 8);
        
        // 生成联系的家庭详情
        const households: Household[] = Array(householdCount)
          .fill(0)
          .map((_, hIndex) => {
            // 生成真实的家庭姓氏
            const householdFamilyName = familyNames[Math.floor(Math.random() * familyNames.length)];
            const householdGivenNames = ['伟', '强', '军', '杰', '明', '华', '建', '勇', '刚', '超', '芳', '娜', '婷', '玲', '静', '敏', '文', '丽', '霞', '芬', '燕', '红', '梅', '兰', '菊', '竹', '英', '华', '秀', '珍', '珠', '玉', '琴', '香', '春', '夏', '秋', '冬', '月', '星', '云', '雨', '雪', '风', '花', '草', '树', '山', '水', '火', '土', '金', '木'];
            const householdGivenName = householdGivenNames[Math.floor(Math.random() * householdGivenNames.length)];
            const householdName = householdFamilyName + householdGivenName + '家庭';
            
            // 家庭类型 - 更丰富的分类
            const householdTypes = ['普通家庭', '低保家庭', '特困家庭', '残疾人家庭', '空巢老人家庭', '单亲家庭', '留守儿童家庭', '优抚对象家庭', '退役军人家庭', '困难职工家庭'];
            const householdType = householdTypes[Math.floor(Math.random() * householdTypes.length)];
            
            // 生成真实的地址（基于中都花园8个区域）
            const areas = ['中都花园A区', '中都花园B区', '中都花园C区', '中都花园D区', '中都花园E区', '中都花园F区', '中都花园G区', '中都花园H区'];
            const area = areas[Math.floor(Math.random() * areas.length)];
            const building = Math.floor(Math.random() * 20) + 1;
            const unit = Math.floor(Math.random() * 8) + 1;
            const room = Math.floor(Math.random() * 20) + 1;
            const floor = Math.floor(Math.random() * 18) + 1;
            const address = `汶上县中都街道${area}${building}栋${unit}单元${floor}0${room}`;
            
            // 家庭成员数量 - 更合理的分布（1-6人）
            const memberCount = Math.floor(1 + Math.random() * 6);
            
            // 生成真实的联系电话
            const contactPhone = `1${[3, 5, 6, 7, 8, 9][Math.floor(Math.random() * 6)]}${Math.floor(100000000 + Math.random() * 900000000)}`;
            
            // 特殊需求 - 基于家庭类型生成
            const allSpecialNeeds = [
              '医疗帮扶', '就业帮扶', '教育帮扶', '精神慰藉', '生活照料', '法律援助', 
              '心理疏导', '技能培训', '资金援助', '住房保障', '子女教育', '养老护理',
              '康复训练', '社会融入', '政策咨询', '权益维护', '文化娱乐', '志愿服务'
            ];
            
            let specialNeeds: string[] = [];
            if (householdType !== '普通家庭') {
              // 特殊家庭有70%的概率需要帮扶
              if (Math.random() > 0.3) {
                const needCount = Math.floor(1 + Math.random() * 4);
                const shuffled = allSpecialNeeds.sort(() => 0.5 - Math.random());
                specialNeeds = shuffled.slice(0, needCount);
              }
            } else {
              // 普通家庭有20%的概率需要帮扶
              if (Math.random() > 0.8) {
                const needCount = Math.floor(1 + Math.random() * 2);
                const shuffled = allSpecialNeeds.sort(() => 0.5 - Math.random());
                specialNeeds = shuffled.slice(0, needCount);
              }
            }
            
            return {
              id: `${index}-${hIndex}`,
              householdName,
              householdType,
              address,
              memberCount,
              contactPhone,
              specialNeeds,
            };
          });
        
        // 家庭类型 - 基于联系的家庭类型判断
        const hasSpecialFamily = households.some(h => h.householdType !== '普通家庭');
        const householdType = hasSpecialFamily ? '特殊家庭' : '普通家庭';
        
        // 所属网格 - 基于实际的8个网格区域
        const gridNames = [
          '中都花园A区网格', '中都花园B区网格', '中都花园C区网格', '中都花园D区网格',
          '中都花园E区网格', '中都花园F区网格', '中都花园G区网格', '中都花园H区网格'
        ];
        const gridName = gridNames[Math.floor(Math.random() * gridNames.length)];
        
        // 楼栋信息 - 更真实的楼栋描述
        const building = Math.floor(Math.random() * 20) + 1;
        const unit = Math.floor(Math.random() * 8) + 1;
        const buildingInfo = `${building}号楼${unit}单元`;
        
        // 开始日期 - 更合理的时间分布
        const startDate = dayjs().subtract(Math.floor(Math.random() * 1825), 'day').format('YYYY-MM-DD'); // 最近5年
        
        // 结束日期 - 大部分是长期联系
        let endDate = null;
        if (Math.random() > 0.85) { // 15%的联系有结束日期
          endDate = dayjs().add(Math.floor(1 + Math.random() * 1095), 'day').format('YYYY-MM-DD'); // 未来1-3年
        }
        
        // 状态 - 大部分在联系中
        const status = Math.random() > 0.92 ? '已解除' : '联系中'; // 8%解除率
        
        // 党支部 - 基于实际区域
        const partyBranches = [
          '第一党支部', '第二党支部', '第三党支部', '第四党支部', '第五党支部', '第六党支部', '第七党支部', '第八党支部',
          'A区党支部', 'B区党支部', 'C区党支部', 'D区党支部', 'E区党支部', 'F区党支部', 'G区党支部', 'H区党支部'
        ];
        const partyBranch = partyBranches[Math.floor(Math.random() * partyBranches.length)];
        
        return {
          id: `${index + 1}`,
          partyMemberId: `${Math.floor(1 + Math.random() * 150)}`,
          partyMemberName,
          householdCount,
          householdType,
          gridName,
          buildingInfo,
          startDate,
          endDate,
          status,
          households,
          partyBranch,
        };
      });
    setHouseholds(mockData);
    setLoading(false);
  }, 500);
  };

  const showModal = (record?: PartyHousehold) => {
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
        // 编辑现有联户信息
        const updatedList = households.map(item => 
          item.id === editingId ? { ...formData, id: editingId } : item
        );
        setHouseholds(updatedList);
      } else {
        // 添加新联户信息
        const selectedMember = members.find(m => m.id === values.partyMemberId);
        const newHousehold = {
          ...formData,
          id: `${households.length + 1}`,
          partyMemberName: selectedMember?.name || '',
          households: [], // 新建时默认为空，后续可以添加
          householdCount: 0,
        };
        setHouseholds([...households, newHousehold]);
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
      content: '确定要删除这条联户信息吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const updatedList = households.filter(item => item.id !== id);
        setHouseholds(updatedList);
      },
    });
  };

  const getStatusTag = (status: string) => {
    return <Tag color={status === '联系中' ? 'green' : 'red'}>{status}</Tag>;
  };

  const getHouseholdTypeTag = (type: string) => {
    const colorMap: Record<string, string> = {
      '普通家庭': 'blue',
      '特殊家庭': 'orange',
    };
    
    return <Tag color={colorMap[type]}>{type}</Tag>;
  };

  const columns = [
    {
      title: '党员姓名',
      dataIndex: 'partyMemberName',
      key: 'partyMemberName',
      width: 100,
    },
    {
      title: '所属支部',
      dataIndex: 'partyBranch',
      key: 'partyBranch',
      width: 120,
    },
    {
      title: '所属网格',
      dataIndex: 'gridName',
      key: 'gridName',
      width: 120,
    },
    {
      title: '楼栋信息',
      dataIndex: 'buildingInfo',
      key: 'buildingInfo',
      width: 120,
    },
    {
      title: '家庭类型',
      dataIndex: 'householdType',
      key: 'householdType',
      width: 100,
      render: (text: string) => getHouseholdTypeTag(text),
    },
    {
      title: '联系家庭数',
      dataIndex: 'householdCount',
      key: 'householdCount',
      width: 100,
      sorter: (a: PartyHousehold, b: PartyHousehold) => a.householdCount - b.householdCount,
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
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: unknown, record: PartyHousehold) => (
        <Space size="middle">
          <Button 
            type="primary" 
            size="small"
            onClick={() => showHouseholdDetails(record)}
          >
            家庭详情
          </Button>
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

  // 展示家庭详情的模态框
  const [householdDetailsVisible, setHouseholdDetailsVisible] = useState(false);
  const [currentHouseholds, setCurrentHouseholds] = useState<Household[]>([]);
  const [currentPartyMember, setCurrentPartyMember] = useState('');

  const showHouseholdDetails = (record: PartyHousehold) => {
    setCurrentHouseholds(record.households);
    setCurrentPartyMember(record.partyMemberName);
    setHouseholdDetailsVisible(true);
  };

  const householdColumns = [
    {
      title: '家庭名称',
      dataIndex: 'householdName',
      key: 'householdName',
    },
    {
      title: '家庭类型',
      dataIndex: 'householdType',
      key: 'householdType',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '家庭住址',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: '家庭人数',
      dataIndex: 'memberCount',
      key: 'memberCount',
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
    },
    {
      title: '特殊需求',
      key: 'specialNeeds',
      render: (_: unknown, record: Household) => (
        <>
          {record.specialNeeds.length > 0 ? (
            record.specialNeeds.map(need => (
              <Tag color="orange" key={need} style={{ marginBottom: 4 }}>
                {need}
              </Tag>
            ))
          ) : (
            '无'
          )}
        </>
      ),
    },
  ];

  // 根据不同的tab筛选数据
  const getFilteredData = () => {
    if (activeTab === 'all') {
      return households;
    } else if (activeTab === 'normal') {
      return households.filter(household => household.householdType === '普通家庭');
    } else if (activeTab === 'special') {
      return households.filter(household => household.householdType === '特殊家庭');
    }
    return households;
  };

  return (
    <div className="party-household-container">
      <Card
        title="党员联户管理"
        className="party-household-card"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showModal()}
          >
            添加联户
          </Button>
        }
      >
        <div className="search-container">
          <Input
            placeholder="请输入党员姓名/网格/楼栋/支部搜索"
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

        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          className="household-tabs"
        >
          <TabPane tab="全部联户" key="all">
            <Table
              columns={columns}
              dataSource={getFilteredData()}
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
          <TabPane tab="普通家庭" key="normal">
            <Table
              columns={columns}
              dataSource={getFilteredData()}
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
          <TabPane tab="特殊家庭" key="special">
            <Table
              columns={columns}
              dataSource={getFilteredData()}
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
        title={editingId ? '编辑联户信息' : '添加联户信息'}
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
            householdType: '普通家庭',
            status: '联系中',
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="partyMemberId"
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
                name="householdType"
                label="家庭类型"
                rules={[{ required: true, message: '请选择家庭类型' }]}
              >
                <Select placeholder="请选择家庭类型">
                  <Option value="普通家庭">普通家庭</Option>
                  <Option value="特殊家庭">特殊家庭</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="partyBranch"
                label="所属支部"
                rules={[{ required: true, message: '请选择所属支部' }]}
              >
                <Select placeholder="请选择所属支部">
                  <Option value="第一党支部">第一党支部</Option>
                  <Option value="第二党支部">第二党支部</Option>
                  <Option value="第三党支部">第三党支部</Option>
                  <Option value="第四党支部">第四党支部</Option>
                  <Option value="第五党支部">第五党支部</Option>
                  <Option value="第六党支部">第六党支部</Option>
                  <Option value="第七党支部">第七党支部</Option>
                  <Option value="第八党支部">第八党支部</Option>
                  <Option value="A区党支部">A区党支部</Option>
                  <Option value="B区党支部">B区党支部</Option>
                  <Option value="C区党支部">C区党支部</Option>
                  <Option value="D区党支部">D区党支部</Option>
                  <Option value="E区党支部">E区党支部</Option>
                  <Option value="F区党支部">F区党支部</Option>
                  <Option value="G区党支部">G区党支部</Option>
                  <Option value="H区党支部">H区党支部</Option>
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

          <Form.Item
            name="buildingInfo"
            label="楼栋信息"
            rules={[{ required: true, message: '请输入楼栋信息' }]}
          >
            <Input placeholder="请输入楼栋信息，例如：1号楼2单元" />
          </Form.Item>

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
                tooltip="如果是长期联系，可不填"
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="联系中">联系中</Option>
              <Option value="已解除">已解除</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`${currentPartyMember}联系的家庭详情`}
        open={householdDetailsVisible}
        onCancel={() => setHouseholdDetailsVisible(false)}
        footer={[
          <Button key="back" onClick={() => setHouseholdDetailsVisible(false)}>
            关闭
          </Button>,
        ]}
        width={1000}
      >
        <Table
          columns={householdColumns}
          dataSource={currentHouseholds}
          rowKey="id"
          pagination={false}
        />
      </Modal>
    </div>
  );
};

export default PartyHouseholdPage; 