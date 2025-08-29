import React, { useState } from 'react';
import { Card, Table, Tabs, Button, Input, Select, Row, Col, Statistic, Tag, Tooltip, Space, Modal, Form, message, Popconfirm } from 'antd';
import { SearchOutlined, DownloadOutlined, PlusOutlined, HomeOutlined, BuildOutlined, ApartmentOutlined, TeamOutlined, EyeOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import './Housing.less';
import { desensitizeIdCard } from '../utils/desensitization';

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

// 定义房屋数据类型
interface HouseData {
  key: number;
  id: number;
  address: string;
  area: number;
  price: number;
  rent: number;
  owner: string;
  tenant: string;
  status: string;
  type: string;
  structure: string;
  decoration: string;
  orientation: string;
  buildYear: number;
  propertyCompany: string;
  ownerIdCard: string;
  purchaseDate: string;
  propertyFee: number;
  notes: string;
}

// 定义楼栋数据类型
interface BuildingData {
  key: number;
  id: number;
  name: string;
  area: string;
  floors: number;
  units: number;
  households: number;
  residents: number;
  buildYear: number;
  structure: string;
  propertyCompany: string;
  notes: string;
}

// 定义社区数据类型
interface CommunityData {
  key: number;
  id: number;
  name: string;
  address: string;
  area: number;
  households: number;
  residents: number;
  buildYear: number;
  propertyCompany: string;
  propertyFee: number;
  greenRate: number;
  parkingSpaces: number;
  facilities: string[];
  notes: string;
}

// 模拟房屋数据 - 基于大型社区实际规模
const housingData: HouseData[] = Array.from({ length: 10000 }, (_, index) => {
  const areaIndex = Math.floor(index / 1250) % 8; // 8个区域
  const buildingIndex = Math.floor(index / 62) % 20; // 每个区域20栋楼
  const unitIndex = Math.floor(index / 5) % 8; // 每栋楼8个单元
  const floorIndex = Math.floor(index % 5) + 1; // 每单元5层
  
  const area = ['中都花园A区', '中都花园B区', '中都花园C区', '中都花园D区', '中都花园E区', '中都花园F区', '中都花园G区', '中都花园H区'][areaIndex];
  const building = `中都花园${buildingIndex + 1}栋`;
  const unit = unitIndex + 1;
  const floor = floorIndex;
  const room = Math.floor(Math.random() * 4) + 1; // 1-4室
  const roomNumber = `${floor}0${room}`;
  
  // 根据房间数生成合理的面积
  let areaSize;
  if (room === 1) areaSize = Math.floor(Math.random() * 20) + 40; // 40-60㎡
  else if (room === 2) areaSize = Math.floor(Math.random() * 30) + 70; // 70-100㎡
  else if (room === 3) areaSize = Math.floor(Math.random() * 40) + 100; // 100-140㎡
  else areaSize = Math.floor(Math.random() * 50) + 140; // 140-190㎡
  
  // 根据面积和位置生成合理的价格
  const basePrice = 8000; // 基础价格8000元/㎡
  const areaBonus = areaIndex < 4 ? 500 : 0; // 前4个区域位置较好，价格略高
  const floorBonus = floor === 1 ? -200 : floor === 5 ? 300 : 0; // 1楼便宜，5楼贵
  const price = Math.floor((basePrice + areaBonus + floorBonus) * areaSize);
  
  // 根据房间数生成合理的租金
  const rent = Math.floor(price * 0.003 * (1 + Math.random() * 0.2)); // 月租金约为房价的0.3%
  
  // 生成业主信息 - 更真实的姓名组合
  const ownerFamilyNames = ['张', '李', '王', '赵', '刘', '陈', '孙', '周', '吴', '郑', '马', '朱', '胡', '林', '何', '郭', '高', '罗', '梁', '宋', '韩', '冯', '于', '董', '萧', '程', '曹', '袁', '邓', '许', '傅', '沈', '曾', '彭', '吕', '苏', '卢', '蒋', '蔡', '贾', '丁', '魏', '薛', '叶', '阎', '余', '潘', '杜', '戴', '夏', '钟', '汪', '田', '任', '姜', '范', '方', '石', '姚', '谭', '廖', '邹', '熊', '金', '陆', '郝', '孔', '白', '崔', '康', '毛', '邱', '秦', '江', '史', '顾', '侯', '邵', '孟', '龙', '万', '段', '雷', '钱', '汤', '尹', '黎', '易', '常', '武', '乔', '贺', '赖', '龚', '文'];
  const ownerGivenNames = ['建国', '建军', '建华', '建平', '建强', '建明', '建文', '建武', '建国', '建军', '建华', '建平', '建强', '建明', '建文', '建武', '国强', '国华', '国平', '国明', '国文', '国武', '志强', '志华', '志平', '志明', '志文', '志武', '德明', '德华', '德平', '德强', '德文', '德武', '秀英', '秀华', '秀平', '秀明', '秀文', '秀武', '丽娜', '丽华', '丽平', '丽明', '丽文', '丽武', '美华', '美平', '美明', '美文', '美武', '建华', '建平', '建明', '建文', '建武'];
  
  const owner = ownerFamilyNames[Math.floor(Math.random() * ownerFamilyNames.length)] + ownerGivenNames[Math.floor(Math.random() * ownerGivenNames.length)];
  
  // 生成租户信息 - 更真实的姓名组合
  const tenantFamilyNames = ['张', '李', '王', '赵', '刘', '陈', '孙', '周', '吴', '郑', '马', '朱', '胡', '林', '何', '郭', '高', '罗', '梁', '宋', '韩', '冯', '于', '董', '萧', '程', '曹', '袁', '邓', '许', '傅', '沈', '曾', '彭', '吕', '苏', '卢', '蒋', '蔡', '贾', '丁', '魏', '薛', '叶', '阎', '余', '潘', '杜', '戴', '夏', '钟', '汪', '田', '任', '姜', '范', '方', '石', '姚', '谭', '廖', '邹', '熊', '金', '陆', '郝', '孔', '白', '崔', '康', '毛', '邱', '秦', '江', '史', '顾', '侯', '邵', '孟', '龙', '万', '段', '雷', '钱', '汤', '尹', '黎', '易', '常', '武', '乔', '贺', '赖', '龚', '文'];
  const tenantGivenNames = ['伟', '强', '军', '杰', '明', '华', '建', '勇', '刚', '超', '斌', '波', '涛', '磊', '雷', '峰', '山', '川', '河', '海', '天', '地', '日', '月', '星', '云', '风', '雨', '雪', '霜', '露', '雾', '霞', '虹', '光', '影', '声', '色', '味', '香', '甜', '苦', '辣', '酸', '咸', '淡', '浓', '厚', '薄', '深', '芳', '娜', '婷', '玲', '静', '敏', '文', '丽', '霞', '芬', '燕', '红', '梅', '兰', '菊', '竹', '英', '华', '秀', '珍', '珠', '玉', '琴', '香', '春', '夏', '秋', '冬', '月', '星', '云', '雨', '雪', '风', '花', '草', '树', '山', '水', '火', '土', '金', '木'];
  
  let tenant = '';
  if (Math.random() > 0.3) { // 70%的房屋有租户
    const familyName = tenantFamilyNames[Math.floor(Math.random() * tenantFamilyNames.length)];
    const givenName = tenantGivenNames[Math.floor(Math.random() * tenantGivenNames.length)];
    tenant = familyName + givenName;
  }
  
  // 生成房屋状态
  const status = Math.random() > 0.2 ? '已出租' : '空置';
  
  // 生成房屋类型
  const type = room === 1 ? '一室一厅' : room === 2 ? '两室一厅' : room === 3 ? '三室两厅' : '四室两厅';
  
  // 生成建筑结构
  const structure = ['砖混结构', '框架结构', '剪力墙结构'][Math.floor(Math.random() * 3)];
  
  // 生成装修程度
  const decoration = ['毛坯', '简装', '精装', '豪装'][Math.floor(Math.random() * 4)];
  
  // 生成朝向
  const orientation = ['南北通透', '南向', '东向', '西向', '北向'][Math.floor(Math.random() * 5)];
  
  // 生成建造年份
  const buildYear = Math.floor(Math.random() * 15) + 2008; // 2008-2023年建造
  
  // 生成物业公司
  const propertyCompany = ['中都物业', '和谐物业', '幸福物业', '平安物业'][Math.floor(Math.random() * 4)];
  
  // 生成物业费
  const propertyFee = Math.floor(Math.random() * 2) + 2; // 2-4元/㎡/月
  
  // 生成购买日期
  const purchaseYear = buildYear + Math.floor(Math.random() * 3); // 建造后1-3年购买
  const purchaseMonth = Math.floor(Math.random() * 12) + 1;
  const purchaseDay = Math.floor(Math.random() * 28) + 1;
  const purchaseDate = `${purchaseYear}-${purchaseMonth.toString().padStart(2, '0')}-${purchaseDay.toString().padStart(2, '0')}`;
  
  // 生成备注
  const notes = [];
  if (Math.random() > 0.8) notes.push('需要维修');
  if (Math.random() > 0.9) notes.push('业主长期不在');
  if (Math.random() > 0.95) notes.push('有纠纷');
  
  return {
    key: index,
    id: index + 1,
    address: `汶上县中都街道${area}${building}${unit}单元${roomNumber}`,
    area: areaSize,
    price,
    rent,
    owner,
    tenant,
    status,
    type,
    structure,
    decoration,
    orientation,
    buildYear,
    propertyCompany,
    ownerIdCard: `3708${Math.floor(Math.random() * 1000000000000000).toString().padStart(15, '0')}`,
    purchaseDate,
    propertyFee,
    notes: notes.join('; ')
  };
});

// 模拟楼栋数据 - 更真实的楼栋信息
const buildingData: BuildingData[] = Array.from({ length: 160 }, (_, index) => {
  const areaIndex = Math.floor(index / 20) % 8; // 8个区域
  const buildingIndex = index % 20; // 每个区域20栋楼
  
  const area = ['中都花园A区', '中都花园B区', '中都花园C区', '中都花园D区', '中都花园E区', '中都花园F区', '中都花园G区', '中都花园H区'][areaIndex];
  const building = `中都花园${buildingIndex + 1}栋`;
  
  // 根据区域和楼栋位置生成合理的楼层数和单元数
  const floors = Math.floor(Math.random() * 6) + 15; // 15-20层
  const units = Math.floor(Math.random() * 2) + 7; // 7-8单元
  
  // 根据楼层数和单元数生成合理的户数
  const households = floors * units * 4; // 每层每单元4户
  
  // 根据户数生成合理的入住率
  const occupancyRate = Math.floor(Math.random() * 20) + 80; // 80%-100%
  const residents = Math.floor(households * occupancyRate / 100);
  
  // 生成建造年份
  const buildYear = Math.floor(Math.random() * 15) + 2008; // 2008-2023年建造
  
  // 生成建筑结构
  const structure = ['砖混结构', '框架结构', '剪力墙结构'][Math.floor(Math.random() * 3)];
  
  // 生成物业公司
  const propertyCompany = ['中都物业', '和谐物业', '幸福物业', '平安物业'][Math.floor(Math.random() * 4)];
  
  // 生成备注
  const notes = [];
  if (Math.random() > 0.8) notes.push('电梯需要维护');
  if (Math.random() > 0.9) notes.push('外墙需要粉刷');
  if (Math.random() > 0.95) notes.push('消防设施检查');
  
  return {
    key: index,
    id: index + 1,
    name: building,
    area: area,
    floors,
    units,
    households,
    residents,
    buildYear,
    structure,
    propertyCompany,
    notes: notes.join('; ')
  };
});

// 模拟社区数据 - 更真实的社区信息
const communityData: CommunityData[] = [
  {
    key: 1,
    id: 1,
    name: '中都花园A区',
    address: '汶上县中都街道中都路1号',
    area: 125000, // 12.5万平方米
    households: 1286,
    residents: 3247,
    buildYear: 2008,
    propertyCompany: '中都物业',
    propertyFee: 2.5,
    greenRate: 35,
    parkingSpaces: 800,
    facilities: ['儿童游乐场', '健身器材', '休闲广场', '地下车库', '监控系统', '门禁系统'],
    notes: 'A区是中都花园最早建成的区域，配套设施完善'
  },
  {
    key: 2,
    id: 2,
    name: '中都花园B区',
    address: '汶上县中都街道中都路2号',
    area: 118000, // 11.8万平方米
    households: 1192,
    residents: 2986,
    buildYear: 2009,
    propertyCompany: '和谐物业',
    propertyFee: 2.3,
    greenRate: 32,
    parkingSpaces: 750,
    facilities: ['儿童游乐场', '健身器材', '休闲广场', '地下车库', '监控系统', '门禁系统'],
    notes: 'B区环境优美，绿化覆盖率高'
  },
  {
    key: 3,
    id: 3,
    name: '中都花园C区',
    address: '汶上县中都街道中都路3号',
    area: 122000, // 12.2万平方米
    households: 1258,
    residents: 3156,
    buildYear: 2010,
    propertyCompany: '幸福物业',
    propertyFee: 2.4,
    greenRate: 34,
    parkingSpaces: 780,
    facilities: ['儿童游乐场', '健身器材', '休闲广场', '地下车库', '监控系统', '门禁系统', '篮球场'],
    notes: 'C区设施齐全，有篮球场等运动设施'
  },
  {
    key: 4,
    id: 4,
    name: '中都花园D区',
    address: '汶上县中都街道中都路4号',
    area: 120000, // 12万平方米
    households: 1156,
    residents: 2892,
    buildYear: 2011,
    propertyCompany: '平安物业',
    propertyFee: 2.6,
    greenRate: 33,
    parkingSpaces: 720,
    facilities: ['儿童游乐场', '健身器材', '休闲广场', '地下车库', '监控系统', '门禁系统'],
    notes: 'D区交通便利，靠近商业区'
  },
  {
    key: 5,
    id: 5,
    name: '中都花园E区',
    address: '汶上县中都街道中都路5号',
    area: 115000, // 11.5万平方米
    households: 1102,
    residents: 2765,
    buildYear: 2012,
    propertyCompany: '中都物业',
    propertyFee: 2.4,
    greenRate: 31,
    parkingSpaces: 680,
    facilities: ['儿童游乐场', '健身器材', '休闲广场', '地下车库', '监控系统', '门禁系统'],
    notes: 'E区相对安静，适合居住'
  },
  {
    key: 6,
    id: 6,
    name: '中都花园F区',
    address: '汶上县中都街道中都路6号',
    area: 119000, // 11.9万平方米
    households: 1204,
    residents: 3012,
    buildYear: 2013,
    propertyCompany: '和谐物业',
    propertyFee: 2.5,
    greenRate: 33,
    parkingSpaces: 750,
    facilities: ['儿童游乐场', '健身器材', '休闲广场', '地下车库', '监控系统', '门禁系统', '乒乓球台'],
    notes: 'F区有乒乓球台等运动设施'
  },
  {
    key: 7,
    id: 7,
    name: '中都花园G区',
    address: '汶上县中都街道中都路7号',
    area: 116000, // 11.6万平方米
    households: 1138,
    residents: 2847,
    buildYear: 2014,
    propertyCompany: '幸福物业',
    propertyFee: 2.7,
    greenRate: 32,
    parkingSpaces: 700,
    facilities: ['儿童游乐场', '健身器材', '休闲广场', '地下车库', '监控系统', '门禁系统'],
    notes: 'G区是较新的区域，建筑质量好'
  },
  {
    key: 8,
    id: 8,
    name: '中都花园H区',
    address: '汶上县中都街道中都路8号',
    area: 121000, // 12.1万平方米
    households: 1248,
    residents: 3123,
    buildYear: 2015,
    propertyCompany: '平安物业',
    propertyFee: 2.8,
    greenRate: 35,
    parkingSpaces: 780,
    facilities: ['儿童游乐场', '健身器材', '休闲广场', '地下车库', '监控系统', '门禁系统', '羽毛球场'],
    notes: 'H区是最新的区域，有羽毛球场等高端设施'
  }
];

const Housing: React.FC = () => {
  const [activeTab, setActiveTab] = useState('houses');
  const [searchText, setSearchText] = useState('');
  
  // 弹窗状态
  const [houseModalVisible, setHouseModalVisible] = useState(false);
  const [buildingModalVisible, setBuildingModalVisible] = useState(false);
  const [communityModalVisible, setCommunityModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  
  // 表单数据
  const [houseForm] = Form.useForm();
  const [buildingForm] = Form.useForm();
  const [communityForm] = Form.useForm();
  
  // 当前操作的数据
  const [currentHouse, setCurrentHouse] = useState<HouseData | null>(null);
  const [currentBuilding, setCurrentBuilding] = useState<any>(null);
  const [currentCommunity, setCurrentCommunity] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; data: any } | null>(null);
  
  // 获取过滤后的房屋数据
  const getFilteredHousingData = () => {
    let filtered = [...housingData];
    
    // 搜索筛选
    if (searchText) {
      const text = searchText.toLowerCase();
      filtered = filtered.filter(house => 
        house.address.toLowerCase().includes(text) || 
        house.owner.toLowerCase().includes(text) || 
        house.tenant.toLowerCase().includes(text)
      );
    }
    
    return filtered;
  };
  
  // 新增房屋
  const handleAddHouse = () => {
    setCurrentHouse(null);
    houseForm.resetFields();
    setHouseModalVisible(true);
  };

  // 编辑房屋
  const handleEditHouse = (record: HouseData) => {
    setCurrentHouse(record);
    houseForm.setFieldsValue(record);
    setHouseModalVisible(true);
  };

  // 保存房屋信息
  const handleSaveHouse = async () => {
    try {
      await houseForm.validateFields();
      if (currentHouse) {
        message.success('房屋信息更新成功');
      } else {
        message.success('房屋信息添加成功');
      }
      setHouseModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 新增楼房
  const handleAddBuilding = () => {
    setCurrentBuilding(null);
    buildingForm.resetFields();
    setBuildingModalVisible(true);
  };

  // 编辑楼房
  const handleEditBuilding = (record: any) => {
    setCurrentBuilding(record);
    buildingForm.setFieldsValue(record);
    setBuildingModalVisible(true);
  };

  // 保存楼房信息
  const handleSaveBuilding = async () => {
    try {
      await buildingForm.validateFields();
      if (currentBuilding) {
        message.success('楼房信息更新成功');
      } else {
        message.success('楼房信息添加成功');
      }
      setBuildingModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 新增社区
  const handleAddCommunity = () => {
    setCurrentCommunity(null);
    communityForm.resetFields();
    setCommunityModalVisible(true);
  };

  // 编辑社区
  const handleEditCommunity = (record: any) => {
    setCurrentCommunity(record);
    communityForm.setFieldsValue(record);
    setCommunityModalVisible(true);
  };

  // 保存社区信息
  const handleSaveCommunity = async () => {
    try {
      await communityForm.validateFields();
      if (currentCommunity) {
        message.success('社区信息更新成功');
      } else {
        message.success('社区信息添加成功');
      }
      setCommunityModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 查看详情
  const handleViewDetail = (record: any, type: string) => {
    if (type === 'house') {
      setCurrentHouse(record);
    } else if (type === 'building') {
      setCurrentBuilding(record);
    } else if (type === 'community') {
      setCurrentCommunity(record);
    }
    setDetailModalVisible(true);
  };

  // 删除确认
  const handleDelete = (record: any, type: string) => {
    setDeleteTarget({ type, data: record });
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

  // 房屋表格列
  const houseColumns = [
    {
      title: '房屋地址',
      dataIndex: 'address',
      key: 'address',
      width: 300,
      ellipsis: true,
    },
    {
      title: '面积',
      dataIndex: 'area',
      key: 'area',
      width: 80,
      render: (area: number) => `${area}㎡`,
      sorter: (a: HouseData, b: HouseData) => a.area - b.area,
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price: number) => `${(price / 10000).toFixed(1)}万`,
      sorter: (a: HouseData, b: HouseData) => a.price - b.price,
    },
    {
      title: '租金',
      dataIndex: 'rent',
      key: 'rent',
      width: 100,
      render: (rent: number) => `${rent}元/月`,
    },
    {
      title: '房屋类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => {
        const color = 
          type === '一室一厅' ? 'blue' : 
          type === '两室一厅' ? 'green' : 
          type === '三室两厅' ? 'orange' : 'purple';
        return <Tag color={color}>{type}</Tag>;
      }
    },
    {
      title: '使用状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const color = 
          status === '已出租' ? 'green' : 'orange';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: '业主',
      dataIndex: 'owner',
      key: 'owner',
      width: 100,
    },
    {
      title: '租户',
      dataIndex: 'tenant',
      key: 'tenant',
      width: 100,
      render: (tenant: string) => tenant || '-',
    },
    {
      title: '建筑结构',
      dataIndex: 'structure',
      key: 'structure',
      width: 120,
      render: (structure: string) => <Tag color="blue">{structure}</Tag>
    },
    {
      title: '装修程度',
      dataIndex: 'decoration',
      key: 'decoration',
      width: 100,
      render: (decoration: string) => <Tag color="cyan">{decoration}</Tag>
    },
    {
      title: '朝向',
      dataIndex: 'orientation',
      key: 'orientation',
      width: 100,
    },
    {
      title: '建造年份',
      dataIndex: 'buildYear',
      key: 'buildYear',
      width: 100,
    },
    {
      title: '物业公司',
      dataIndex: 'propertyCompany',
      key: 'propertyCompany',
      width: 120,
      render: (company: string) => <Tag color="green">{company}</Tag>
    },
    {
      title: '物业费',
      dataIndex: 'propertyFee',
      key: 'propertyFee',
      width: 100,
      render: (fee: number) => `${fee}元/㎡/月`,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: HouseData) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record, 'house')}>查看</Button>
          </Tooltip>
          <Tooltip title="编辑信息">
            <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEditHouse(record)}>编辑</Button>
          </Tooltip>
          <Tooltip title="删除房屋">
            <Popconfirm
              title="确定要删除这个房屋记录吗？"
              onConfirm={() => handleDelete(record, 'house')}
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

  // 楼房表格列
  const buildingColumns = [
    {
      title: '楼栋名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '所属社区',
      dataIndex: 'area',
      key: 'area',
      width: 200,
    },
    {
      title: '单元数',
      dataIndex: 'units',
      key: 'units',
      width: 100,
      render: (units: number) => `${units}个单元`
    },
    {
      title: '楼层数',
      dataIndex: 'floors',
      key: 'floors',
      width: 100,
      render: (floors: number) => `${floors}层`
    },
    {
      title: '户数',
      dataIndex: 'households',
      key: 'households',
      width: 100,
    },
    {
      title: '居住人数',
      dataIndex: 'residents',
      key: 'residents',
      width: 100,
    },
    {
      title: '建造年份',
      dataIndex: 'buildYear',
      key: 'buildYear',
      width: 100,
    },
    {
      title: '建筑结构',
      dataIndex: 'structure',
      key: 'structure',
      width: 120,
      render: (structure: string) => <Tag color="blue">{structure}</Tag>
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: any) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record, 'building')}>查看</Button>
          </Tooltip>
          <Tooltip title="编辑信息">
            <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEditBuilding(record)}>编辑</Button>
          </Tooltip>
          <Tooltip title="删除楼栋">
            <Popconfirm
              title="确定要删除这个楼栋记录吗？"
              onConfirm={() => handleDelete(record, 'building')}
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

  // 社区表格列
  const communityColumns = [
    {
      title: '社区名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      width: 250,
      ellipsis: true,
    },
    {
      title: '面积',
      dataIndex: 'area',
      key: 'area',
      width: 120,
      render: (area: number) => `${(area / 10000).toFixed(1)}万㎡`,
    },
    {
      title: '户数',
      dataIndex: 'households',
      key: 'households',
      width: 100,
    },
    {
      title: '居住人数',
      dataIndex: 'residents',
      key: 'residents',
      width: 100,
    },
    {
      title: '建造年份',
      dataIndex: 'buildYear',
      key: 'buildYear',
      width: 100,
    },
    {
      title: '物业公司',
      dataIndex: 'propertyCompany',
      key: 'propertyCompany',
      width: 120,
      render: (company: string) => <Tag color="green">{company}</Tag>
    },
    {
      title: '物业费',
      dataIndex: 'propertyFee',
      key: 'propertyFee',
      width: 100,
      render: (fee: number) => `${fee}元/㎡/月`,
    },
    {
      title: '绿化率',
      dataIndex: 'greenRate',
      key: 'greenRate',
      width: 100,
      render: (rate: number) => `${rate}%`,
    },
    {
      title: '停车位',
      dataIndex: 'parkingSpaces',
      key: 'parkingSpaces',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: any) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record, 'community')}>查看</Button>
          </Tooltip>
          <Tooltip title="编辑信息">
            <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEditCommunity(record)}>编辑</Button>
          </Tooltip>
          <Tooltip title="删除社区">
            <Popconfirm
              title="确定要删除这个社区记录吗？"
              onConfirm={() => handleDelete(record, 'community')}
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

  return (
    <div className="housing-container">
      <h1>房屋管理</h1>
      
      <Row gutter={[16, 16]} className="stat-overview">
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic 
              title="房屋总数" 
              value={housingData.length} 
              prefix={<HomeOutlined />} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic 
              title="楼栋总数" 
              value={buildingData.length} 
              prefix={<BuildOutlined />} 
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic 
              title="社区总数" 
              value={communityData.length} 
              prefix={<ApartmentOutlined />} 
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
                 <Col xs={24} sm={12} md={6}>
           <Card className="stat-card">
             <Statistic 
               title="总房屋价值" 
               value={housingData.reduce((sum, h) => sum + h.price, 0) / 100000000} 
               suffix="亿元" 
               prefix={<TeamOutlined />} 
              valueStyle={{ color: '#722ed1' }}
               precision={1}
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
                   placeholder="搜索地址、业主、租户..." 
                  onChange={e => setSearchText(e.target.value)} 
                   style={{ width: 300 }}
                  prefix={<SearchOutlined />}
                />
              </Input.Group>
              {activeTab === 'houses' && (
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddHouse}>新增房屋</Button>
              )}
              {activeTab === 'buildings' && (
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddBuilding}>新增楼栋</Button>
              )}
              {activeTab === 'communities' && (
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCommunity}>新增社区</Button>
              )}
              <Button icon={<UploadOutlined />} onClick={handleImport}>批量导入</Button>
              <Button icon={<DownloadOutlined />} onClick={handleExport}>导出数据</Button>
            </div>
          }
        >
          <TabPane tab="房屋管理" key="houses">
            <Table 
              columns={houseColumns} 
              dataSource={getFilteredHousingData()}
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
          <TabPane tab="楼栋管理" key="buildings">
            <Table 
              columns={buildingColumns} 
              dataSource={buildingData}
              rowKey="id"
              pagination={{
                pageSize: 20,
                showQuickJumper: true,
                showSizeChanger: true,
              }}
            />
          </TabPane>
          <TabPane tab="社区管理" key="communities">
            <Table 
              columns={communityColumns} 
              dataSource={communityData}
              rowKey="id"
              pagination={{
                pageSize: 20,
                showQuickJumper: true,
                showSizeChanger: true,
              }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 房屋弹窗 */}
      <Modal
        title={currentHouse ? '编辑房屋信息' : '新增房屋信息'}
        open={houseModalVisible}
        onOk={handleSaveHouse}
        onCancel={() => setHouseModalVisible(false)}
        width={800}
      >
        <Form form={houseForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="communityName" label="社区名称" rules={[{ required: true, message: '请输入社区名称' }]}>
                <Input placeholder="请输入社区名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="buildingId" label="楼栋编号" rules={[{ required: true, message: '请输入楼栋编号' }]}>
                <Input type="number" placeholder="请输入楼栋编号" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="unitNumber" label="单元号" rules={[{ required: true, message: '请输入单元号' }]}>
                <Input placeholder="请输入单元号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="roomNumber" label="房间号" rules={[{ required: true, message: '请输入房间号' }]}>
                <Input placeholder="请输入房间号" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="area" label="房屋面积" rules={[{ required: true, message: '请输入房屋面积' }]}>
                <Input type="number" placeholder="请输入房屋面积" suffix="㎡" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="type" label="房屋类型" rules={[{ required: true, message: '请选择房屋类型' }]}>
                <Select placeholder="请选择房屋类型">
                  <Option value="商品房">商品房</Option>
                  <Option value="经济适用房">经济适用房</Option>
                  <Option value="公租房">公租房</Option>
                  <Option value="自建房">自建房</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="status" label="使用状态" rules={[{ required: true, message: '请选择使用状态' }]}>
                <Select placeholder="请选择使用状态">
                  <Option value="自住">自住</Option>
                  <Option value="出租">出租</Option>
                  <Option value="空置">空置</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="residents" label="居住人数" rules={[{ required: true, message: '请输入居住人数' }]}>
                <Input type="number" placeholder="请输入居住人数" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="owner" label="产权人" rules={[{ required: true, message: '请输入产权人姓名' }]}>
                <Input placeholder="请输入产权人姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="联系电话" rules={[{ required: true, message: '请输入联系电话' }]}>
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="ownerIdCard" label="产权人身份证">
                <Input placeholder="请输入产权人身份证号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="purchaseDate" label="购买日期">
                <Input placeholder="请输入购买日期" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="propertyFee" label="物业费">
                <Input type="number" placeholder="请输入物业费" suffix="元/月" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="gridId" label="所属网格" rules={[{ required: true, message: '请选择所属网格' }]}>
                <Select placeholder="请选择所属网格">
                  <Option value={1}>网格1</Option>
                  <Option value={2}>网格2</Option>
                  <Option value={3}>网格3</Option>
                  <Option value={4}>网格4</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="notes" label="备注">
            <TextArea rows={2} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 楼栋弹窗 */}
      <Modal
        title={currentBuilding ? '编辑楼栋信息' : '新增楼栋信息'}
        open={buildingModalVisible}
        onOk={handleSaveBuilding}
        onCancel={() => setBuildingModalVisible(false)}
        width={600}
      >
        <Form form={buildingForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="楼栋名称" rules={[{ required: true, message: '请输入楼栋名称' }]}>
                <Input placeholder="请输入楼栋名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="community" label="所属社区" rules={[{ required: true, message: '请输入所属社区' }]}>
                <Input placeholder="请输入所属社区" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="units" label="单元数" rules={[{ required: true, message: '请输入单元数' }]}>
                <Input type="number" placeholder="请输入单元数" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="floors" label="楼层数" rules={[{ required: true, message: '请输入楼层数' }]}>
                <Input type="number" placeholder="请输入楼层数" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="buildYear" label="建造年份" rules={[{ required: true, message: '请输入建造年份' }]}>
                <Input type="number" placeholder="请输入建造年份" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="structure" label="建筑结构" rules={[{ required: true, message: '请选择建筑结构' }]}>
                <Select placeholder="请选择建筑结构">
                  <Option value="砖混结构">砖混结构</Option>
                  <Option value="框架结构">框架结构</Option>
                  <Option value="剪力墙结构">剪力墙结构</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="gridId" label="所属网格" rules={[{ required: true, message: '请选择所属网格' }]}>
            <Select placeholder="请选择所属网格">
              <Option value={1}>网格1</Option>
              <Option value={2}>网格2</Option>
              <Option value={3}>网格3</Option>
              <Option value={4}>网格4</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 社区弹窗 */}
      <Modal
        title={currentCommunity ? '编辑社区信息' : '新增社区信息'}
        open={communityModalVisible}
        onOk={handleSaveCommunity}
        onCancel={() => setCommunityModalVisible(false)}
        width={600}
      >
        <Form form={communityForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="社区名称" rules={[{ required: true, message: '请输入社区名称' }]}>
                <Input placeholder="请输入社区名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="type" label="社区类型" rules={[{ required: true, message: '请选择社区类型' }]}>
                <Select placeholder="请选择社区类型">
                  <Option value="无物业">无物业</Option>
                  <Option value="单位家属院">单位家属院</Option>
                  <Option value="第三方物业">第三方物业</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="buildingCount" label="楼栋数量" rules={[{ required: true, message: '请输入楼栋数量' }]}>
                <Input type="number" placeholder="请输入楼栋数量" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="propertyCompany" label="物业公司">
                <Input placeholder="请输入物业公司名称" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="gridId" label="所属网格" rules={[{ required: true, message: '请选择所属网格' }]}>
            <Select placeholder="请选择所属网格">
              <Option value={1}>网格1</Option>
              <Option value={2}>网格2</Option>
              <Option value={3}>网格3</Option>
              <Option value={4}>网格4</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 详情弹窗 */}
      <Modal
        title="详细信息"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>关闭</Button>
        ]}
        width={600}
      >
                 {currentHouse && (
           <div>
             <h3>房屋信息</h3>
             <p><strong>房屋地址：</strong>{currentHouse.address}</p>
             <p><strong>房屋面积：</strong>{currentHouse.area}㎡</p>
             <p><strong>房屋价格：</strong>{(currentHouse.price / 10000).toFixed(1)}万元</p>
             <p><strong>月租金：</strong>{currentHouse.rent}元/月</p>
             <p><strong>房屋类型：</strong>{currentHouse.type}</p>
             <p><strong>使用状态：</strong>{currentHouse.status}</p>
             <p><strong>业主：</strong>{currentHouse.owner}</p>
             <p><strong>租户：</strong>{currentHouse.tenant || '无'}</p>
             <p><strong>建筑结构：</strong>{currentHouse.structure}</p>
             <p><strong>装修程度：</strong>{currentHouse.decoration}</p>
             <p><strong>朝向：</strong>{currentHouse.orientation}</p>
             <p><strong>建造年份：</strong>{currentHouse.buildYear}年</p>
             <p><strong>物业公司：</strong>{currentHouse.propertyCompany}</p>
             <p><strong>物业费：</strong>{currentHouse.propertyFee}元/㎡/月</p>
             {currentHouse.ownerIdCard && <p><strong>产权人身份证：</strong>{desensitizeIdCard(currentHouse.ownerIdCard)}</p>}
             {currentHouse.purchaseDate && <p><strong>购买日期：</strong>{currentHouse.purchaseDate}</p>}
             {currentHouse.notes && <p><strong>备注：</strong>{currentHouse.notes}</p>}
           </div>
         )}
                 {currentBuilding && (
           <div>
             <h3>楼栋信息</h3>
             <p><strong>楼栋名称：</strong>{currentBuilding.name}</p>
             <p><strong>所属社区：</strong>{currentBuilding.area}</p>
             <p><strong>单元数：</strong>{currentBuilding.units}个单元</p>
             <p><strong>楼层数：</strong>{currentBuilding.floors}层</p>
             <p><strong>户数：</strong>{currentBuilding.households}户</p>
             <p><strong>居住人数：</strong>{currentBuilding.residents}人</p>
             <p><strong>建造年份：</strong>{currentBuilding.buildYear}年</p>
             <p><strong>建筑结构：</strong>{currentBuilding.structure}</p>
             <p><strong>物业公司：</strong>{currentBuilding.propertyCompany}</p>
             {currentBuilding.notes && <p><strong>备注：</strong>{currentBuilding.notes}</p>}
           </div>
         )}
                 {currentCommunity && (
           <div>
             <h3>社区信息</h3>
             <p><strong>社区名称：</strong>{currentCommunity.name}</p>
             <p><strong>地址：</strong>{currentCommunity.address}</p>
             <p><strong>面积：</strong>{(currentCommunity.area / 10000).toFixed(1)}万平方米</p>
             <p><strong>户数：</strong>{currentCommunity.households}户</p>
             <p><strong>居住人数：</strong>{currentCommunity.residents}人</p>
             <p><strong>建造年份：</strong>{currentCommunity.buildYear}年</p>
             <p><strong>物业公司：</strong>{currentCommunity.propertyCompany}</p>
             <p><strong>物业费：</strong>{currentCommunity.propertyFee}元/㎡/月</p>
             <p><strong>绿化率：</strong>{currentCommunity.greenRate}%</p>
             <p><strong>停车位：</strong>{currentCommunity.parkingSpaces}个</p>
             <p><strong>配套设施：</strong>{currentCommunity.facilities.join('、')}</p>
             {currentCommunity.notes && <p><strong>备注：</strong>{currentCommunity.notes}</p>}
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
        <p>确定要删除这个{deleteTarget?.type === 'house' ? '房屋' : deleteTarget?.type === 'building' ? '楼栋' : '社区'}记录吗？</p>
        <p>删除后将无法恢复，请谨慎操作。</p>
      </Modal>
    </div>
  );
};

export default Housing; 