import React, { useState } from 'react';
import { Card, Table, Tabs, Button, Input, Select, Row, Col, Statistic, Tag, Progress, Space, Avatar, Modal, Form, message, Popconfirm, Tooltip, Badge } from 'antd';
import { SearchOutlined, DownloadOutlined, PlusOutlined, SafetyCertificateOutlined, AppstoreOutlined, TeamOutlined, UserOutlined, AlertOutlined, EyeOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import SimpleMap from '../components/SimpleMap';
import './GridManagement.less';
import { desensitizePhoneNumber } from '../utils/desensitization';

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

// 网格数据类型
interface GridData {
  id: number;
  name: string;
  area: string;
  population: number;
  houses: number;
  manager: string;
  memberCount: number;
  eventCount: number;
  patrolCount: number;
  color: string;
}

// 网格员数据类型
interface GridMemberData {
  id: number;
  name: string;
  gender: string;
  age: number;
  phone: string;
  role: string;
  gridId: number;
  avatar: string;
  taskCount: number;
  eventCount: number;
}

// 事件数据类型
interface GridEventData {
  id: number;
  name: string;
  type: string;
  gridId: number;
  status: string;
  createTime: string;
  handler: string;
  priority: string;
  description?: string;
  location?: string;
  images?: string[];
}

// 模拟网格数据 - 基于大型社区实际规模
const gridData: GridData[] = [
  { id: 1, name: '网格一', area: '中都花园A区', population: 3247, houses: 1286, manager: '张建国', memberCount: 8, eventCount: 23, patrolCount: 156, color: 'rgba(24, 144, 255, 0.6)' },
  { id: 2, name: '网格二', area: '中都花园B区', population: 2986, houses: 1192, manager: '李明', memberCount: 7, eventCount: 19, patrolCount: 142, color: 'rgba(82, 196, 26, 0.6)' },
  { id: 3, name: '网格三', area: '中都花园C区', population: 3156, houses: 1258, manager: '王华', memberCount: 8, eventCount: 27, patrolCount: 168, color: 'rgba(250, 140, 22, 0.6)' },
  { id: 4, name: '网格四', area: '中都花园D区', population: 2892, houses: 1156, manager: '赵红', memberCount: 7, eventCount: 21, patrolCount: 134, color: 'rgba(114, 46, 209, 0.6)' },
  { id: 5, name: '网格五', area: '中都花园E区', population: 2765, houses: 1102, manager: '刘强', memberCount: 6, eventCount: 18, patrolCount: 128, color: 'rgba(255, 77, 79, 0.6)' },
  { id: 6, name: '网格六', area: '中都花园F区', population: 3012, houses: 1204, manager: '陈明', memberCount: 7, eventCount: 25, patrolCount: 145, color: 'rgba(19, 194, 194, 0.6)' },
  { id: 7, name: '网格七', area: '中都花园G区', population: 2847, houses: 1138, manager: '孙伟', memberCount: 6, eventCount: 20, patrolCount: 132, color: 'rgba(250, 173, 20, 0.6)' },
  { id: 8, name: '网格八', area: '中都花园H区', population: 3123, houses: 1248, manager: '周杰', memberCount: 8, eventCount: 24, patrolCount: 158, color: 'rgba(245, 34, 45, 0.6)' }
];

// 模拟网格员数据 - 更真实的姓名和分布
const gridMemberData: GridMemberData[] = [
  // 网格一
  { id: 1, name: '张建国', gender: '男', age: 45, phone: '138****1234', role: '网格长', gridId: 1, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/1.jpg', taskCount: 89, eventCount: 23 },
  { id: 2, name: '李秀英', gender: '女', age: 38, phone: '139****5678', role: '网格员', gridId: 1, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/2.jpg', taskCount: 67, eventCount: 18 },
  { id: 3, name: '王德明', gender: '男', age: 42, phone: '136****9012', role: '网格员', gridId: 1, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/3.jpg', taskCount: 72, eventCount: 21 },
  { id: 4, name: '赵丽华', gender: '女', age: 35, phone: '137****3456', role: '网格员', gridId: 1, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/4.jpg', taskCount: 58, eventCount: 15 },
  { id: 5, name: '刘志强', gender: '男', age: 39, phone: '135****7890', role: '网格员', gridId: 1, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/5.jpg', taskCount: 63, eventCount: 17 },
  { id: 6, name: '陈美玲', gender: '女', age: 41, phone: '134****2345', role: '网格员', gridId: 1, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/6.jpg', taskCount: 71, eventCount: 19 },
  { id: 7, name: '孙建华', gender: '男', age: 37, phone: '133****6789', role: '网格员', gridId: 1, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/7.jpg', taskCount: 65, eventCount: 16 },
  { id: 8, name: '周小红', gender: '女', age: 33, phone: '132****0123', role: '网格员', gridId: 1, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/8.jpg', taskCount: 54, eventCount: 14 },
  
  // 网格二
  { id: 9, name: '李明', gender: '男', age: 44, phone: '138****4567', role: '网格长', gridId: 2, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/9.jpg', taskCount: 82, eventCount: 19 },
  { id: 10, name: '王丽娜', gender: '女', age: 36, phone: '139****8901', role: '网格员', gridId: 2, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/10.jpg', taskCount: 69, eventCount: 18 },
  { id: 11, name: '赵国强', gender: '男', age: 40, phone: '136****2345', role: '网格员', gridId: 2, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/11.jpg', taskCount: 74, eventCount: 20 },
  { id: 12, name: '刘美华', gender: '女', age: 34, phone: '137****6789', role: '网格员', gridId: 2, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/12.jpg', taskCount: 61, eventCount: 16 },
  { id: 13, name: '陈志明', gender: '男', age: 38, phone: '135****0123', role: '网格员', gridId: 2, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/13.jpg', taskCount: 67, eventCount: 17 },
  { id: 14, name: '孙丽娟', gender: '女', age: 42, phone: '134****4567', role: '网格员', gridId: 2, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/14.jpg', taskCount: 73, eventCount: 19 },
  { id: 15, name: '周建平', gender: '男', age: 35, phone: '133****8901', role: '网格员', gridId: 2, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/15.jpg', taskCount: 59, eventCount: 15 },
  
  // 网格三
  { id: 16, name: '王华', gender: '男', age: 46, phone: '138****7890', role: '网格长', gridId: 3, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/16.jpg', taskCount: 91, eventCount: 27 },
  { id: 17, name: '赵秀英', gender: '女', age: 39, phone: '139****1234', role: '网格员', gridId: 3, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/17.jpg', taskCount: 78, eventCount: 22 },
  { id: 18, name: '刘德明', gender: '男', age: 43, phone: '136****5678', role: '网格员', gridId: 3, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/18.jpg', taskCount: 85, eventCount: 24 },
  { id: 19, name: '陈丽华', gender: '女', age: 37, phone: '137****9012', role: '网格员', gridId: 3, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/19.jpg', taskCount: 72, eventCount: 20 },
  { id: 20, name: '孙志强', gender: '男', age: 41, phone: '135****3456', role: '网格员', gridId: 3, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/20.jpg', taskCount: 79, eventCount: 23 },
  { id: 21, name: '周美玲', gender: '女', age: 35, phone: '134****7890', role: '网格员', gridId: 3, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/21.jpg', taskCount: 66, eventCount: 18 },
  { id: 22, name: '张建华', gender: '男', age: 38, phone: '133****1234', role: '网格员', gridId: 3, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/22.jpg', taskCount: 70, eventCount: 19 },
  { id: 23, name: '李小红', gender: '女', age: 33, phone: '132****5678', role: '网格员', gridId: 3, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/23.jpg', taskCount: 58, eventCount: 16 },
  
  // 网格四
  { id: 24, name: '赵红', gender: '女', age: 45, phone: '138****9012', role: '网格长', gridId: 4, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/24.jpg', taskCount: 84, eventCount: 21 },
  { id: 25, name: '刘丽娜', gender: '女', age: 37, phone: '139****3456', role: '网格员', gridId: 4, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/25.jpg', taskCount: 71, eventCount: 19 },
  { id: 26, name: '陈国强', gender: '男', age: 41, phone: '136****7890', role: '网格员', gridId: 4, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/26.jpg', taskCount: 76, eventCount: 21 },
  { id: 27, name: '孙美华', gender: '女', age: 35, phone: '137****1234', role: '网格员', gridId: 4, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/27.jpg', taskCount: 63, eventCount: 17 },
  { id: 28, name: '周志明', gender: '男', age: 39, phone: '135****5678', role: '网格员', gridId: 4, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/28.jpg', taskCount: 69, eventCount: 18 },
  { id: 29, name: '张丽娟', gender: '女', age: 43, phone: '134****9012', role: '网格员', gridId: 4, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/29.jpg', taskCount: 77, eventCount: 20 },
  { id: 30, name: '李建平', gender: '男', age: 36, phone: '133****3456', role: '网格员', gridId: 4, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/30.jpg', taskCount: 61, eventCount: 16 },
  
  // 网格五
  { id: 31, name: '刘强', gender: '男', age: 44, phone: '138****5678', role: '网格长', gridId: 5, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/31.jpg', taskCount: 78, eventCount: 18 },
  { id: 32, name: '陈秀英', gender: '女', age: 38, phone: '139****9012', role: '网格员', gridId: 5, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/32.jpg', taskCount: 65, eventCount: 17 },
  { id: 33, name: '孙德明', gender: '男', age: 42, phone: '136****3456', role: '网格员', gridId: 5, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/33.jpg', taskCount: 72, eventCount: 19 },
  { id: 34, name: '周丽华', gender: '女', age: 36, phone: '137****7890', role: '网格员', gridId: 5, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/34.jpg', taskCount: 68, eventCount: 18 },
  { id: 35, name: '张志强', gender: '男', age: 40, phone: '135****1234', role: '网格员', gridId: 5, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/35.jpg', taskCount: 74, eventCount: 20 },
  { id: 36, name: '李美玲', gender: '女', age: 34, phone: '134****5678', role: '网格员', gridId: 5, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/36.jpg', taskCount: 60, eventCount: 16 },
  
  // 网格六
  { id: 37, name: '陈明', gender: '男', age: 45, phone: '138****2345', role: '网格长', gridId: 6, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/37.jpg', taskCount: 86, eventCount: 25 },
  { id: 38, name: '孙丽娜', gender: '女', age: 37, phone: '139****6789', role: '网格员', gridId: 6, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/38.jpg', taskCount: 73, eventCount: 21 },
  { id: 39, name: '周国强', gender: '男', age: 41, phone: '136****0123', role: '网格员', gridId: 6, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/39.jpg', taskCount: 79, eventCount: 23 },
  { id: 40, name: '张美华', gender: '女', age: 35, phone: '137****4567', role: '网格员', gridId: 6, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/40.jpg', taskCount: 65, eventCount: 18 },
  { id: 41, name: '李志明', gender: '男', age: 39, phone: '135****8901', role: '网格员', gridId: 6, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/41.jpg', taskCount: 71, eventCount: 20 },
  { id: 42, name: '刘丽娟', gender: '女', age: 43, phone: '134****2345', role: '网格员', gridId: 6, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/42.jpg', taskCount: 78, eventCount: 22 },
  { id: 43, name: '陈建平', gender: '男', age: 36, phone: '133****6789', role: '网格员', gridId: 6, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/43.jpg', taskCount: 64, eventCount: 17 },
  
  // 网格七
  { id: 44, name: '孙伟', gender: '男', age: 43, phone: '138****0123', role: '网格长', gridId: 7, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/44.jpg', taskCount: 80, eventCount: 20 },
  { id: 45, name: '周秀英', gender: '女', age: 38, phone: '139****4567', role: '网格员', gridId: 7, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/45.jpg', taskCount: 67, eventCount: 18 },
  { id: 46, name: '张德明', gender: '男', age: 42, phone: '136****8901', role: '网格员', gridId: 7, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/46.jpg', taskCount: 73, eventCount: 19 },
  { id: 47, name: '李丽华', gender: '女', age: 36, phone: '137****2345', role: '网格员', gridId: 7, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/47.jpg', taskCount: 69, eventCount: 18 },
  { id: 48, name: '刘志强', gender: '男', age: 40, phone: '135****6789', role: '网格员', gridId: 7, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/48.jpg', taskCount: 75, eventCount: 20 },
  { id: 49, name: '陈美玲', gender: '女', age: 34, phone: '134****0123', role: '网格员', gridId: 7, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/49.jpg', taskCount: 62, eventCount: 16 },
  
  // 网格八
  { id: 50, name: '周杰', gender: '男', age: 46, phone: '138****4567', role: '网格长', gridId: 8, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/50.jpg', taskCount: 88, eventCount: 24 },
  { id: 51, name: '张丽娜', gender: '女', age: 39, phone: '139****8901', role: '网格员', gridId: 8, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/51.jpg', taskCount: 76, eventCount: 21 },
  { id: 52, name: '李国强', gender: '男', age: 43, phone: '136****2345', role: '网格员', gridId: 8, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/52.jpg', taskCount: 82, eventCount: 23 },
  { id: 53, name: '刘美华', gender: '女', age: 37, phone: '137****6789', role: '网格员', gridId: 8, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/53.jpg', taskCount: 70, eventCount: 19 },
  { id: 54, name: '陈志明', gender: '男', age: 41, phone: '135****0123', role: '网格员', gridId: 8, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/54.jpg', taskCount: 77, eventCount: 21 },
  { id: 55, name: '孙丽娟', gender: '女', age: 35, phone: '134****4567', role: '网格员', gridId: 8, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/55.jpg', taskCount: 66, eventCount: 17 },
  { id: 56, name: '周建平', gender: '男', age: 38, phone: '133****8901', role: '网格员', gridId: 8, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/56.jpg', taskCount: 71, eventCount: 19 },
  { id: 57, name: '张小红', gender: '女', age: 33, phone: '132****2345', role: '网格员', gridId: 8, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/57.jpg', taskCount: 59, eventCount: 15 }
];

// 模拟事件数据 - 更真实的事件类型和分布
const gridEventData: GridEventData[] = [
  // 网格一事件
  { id: 1, name: '消防通道被电动车占用', type: '安全隐患', gridId: 1, status: '已处理', createTime: '2024-06-15', handler: '张建国', priority: '高', description: 'A区3栋消防通道被多辆电动车占用，存在严重安全隐患', location: '中都花园A区3栋', images: [] },
  { id: 2, name: '垃圾箱周边垃圾散落', type: '环境卫生', gridId: 1, status: '处理中', createTime: '2024-06-14', handler: '李秀英', priority: '中', description: 'A区垃圾箱周边垃圾散落，影响环境卫生', location: '中都花园A区垃圾站', images: [] },
  { id: 3, name: '高空抛物投诉', type: '邻里纠纷', gridId: 1, status: '已处理', createTime: '2024-06-13', handler: '王德明', priority: '高', description: 'A区5栋居民投诉高空抛物问题', location: '中都花园A区5栋', images: [] },
  { id: 4, name: '楼道照明灯损坏', type: '设施维护', gridId: 1, status: '已处理', createTime: '2024-06-12', handler: '赵丽华', priority: '中', description: 'A区2栋楼道照明灯损坏，影响夜间出行', location: '中都花园A区2栋', images: [] },
  { id: 5, name: '违规停车堵塞道路', type: '安全隐患', gridId: 1, status: '处理中', createTime: '2024-06-11', handler: '刘志强', priority: '中', description: 'A区主干道被违规停车堵塞', location: '中都花园A区主干道', images: [] },
  
  // 网格二事件
  { id: 6, name: '外墙脱落安全隐患', type: '安全隐患', gridId: 2, status: '已处理', createTime: '2024-06-15', handler: '李明', priority: '紧急', description: 'B区1栋外墙出现脱落现象，存在严重安全隐患', location: '中都花园B区1栋', images: [] },
  { id: 7, name: '噪音扰民投诉', type: '邻里纠纷', gridId: 2, status: '处理中', createTime: '2024-06-14', handler: '王丽娜', priority: '中', description: 'B区3栋居民投诉装修噪音扰民', location: '中都花园B区3栋', images: [] },
  { id: 8, name: '绿化带被破坏', type: '环境卫生', gridId: 2, status: '已处理', createTime: '2024-06-13', handler: '赵国强', priority: '低', description: 'B区绿化带被踩踏破坏', location: '中都花园B区绿化带', images: [] },
  { id: 9, name: '电梯故障报修', type: '设施维护', gridId: 2, status: '已处理', createTime: '2024-06-12', handler: '刘美华', priority: '高', description: 'B区2栋电梯出现故障', location: '中都花园B区2栋', images: [] },
  { id: 10, name: '楼道杂物堆放', type: '安全隐患', gridId: 2, status: '处理中', createTime: '2024-06-11', handler: '陈志明', priority: '中', description: 'B区4栋楼道杂物堆放严重', location: '中都花园B区4栋', images: [] },
  
  // 网格三事件
  { id: 11, name: '井盖损坏安全隐患', type: '安全隐患', gridId: 3, status: '已处理', createTime: '2024-06-15', handler: '王华', priority: '紧急', description: 'C区道路井盖损坏，存在安全隐患', location: '中都花园C区道路', images: [] },
  { id: 12, name: '垃圾分类不规范', type: '环境卫生', gridId: 3, status: '处理中', createTime: '2024-06-14', handler: '赵秀英', priority: '中', description: 'C区垃圾分类投放不规范', location: '中都花园C区垃圾站', images: [] },
  { id: 13, name: '宠物粪便未清理', type: '环境卫生', gridId: 3, status: '已处理', createTime: '2024-06-13', handler: '刘德明', priority: '低', description: 'C区宠物粪便未及时清理', location: '中都花园C区公共区域', images: [] },
  { id: 14, name: '健身器材损坏', type: '设施维护', gridId: 3, status: '已处理', createTime: '2024-06-12', handler: '陈丽华', priority: '中', description: 'C区健身器材出现损坏', location: '中都花园C区健身区', images: [] },
  { id: 15, name: '车辆刮蹭纠纷', type: '邻里纠纷', gridId: 3, status: '处理中', createTime: '2024-06-11', handler: '孙志强', priority: '中', description: 'C区停车场车辆刮蹭纠纷', location: '中都花园C区停车场', images: [] },
  
  // 网格四事件
  { id: 16, name: '路灯不亮影响出行', type: '设施维护', gridId: 4, status: '已处理', createTime: '2024-06-15', handler: '赵红', priority: '中', description: 'D区路灯不亮，影响夜间出行安全', location: '中都花园D区道路', images: [] },
  { id: 17, name: '楼道小广告乱贴', type: '环境卫生', gridId: 4, status: '处理中', createTime: '2024-06-14', handler: '刘丽娜', priority: '低', description: 'D区楼道小广告乱贴现象严重', location: '中都花园D区楼道', images: [] },
  { id: 18, name: '公共座椅损坏', type: '设施维护', gridId: 4, status: '已处理', createTime: '2024-06-13', handler: '陈国强', priority: '低', description: 'D区公共座椅出现损坏', location: '中都花园D区休闲区', images: [] },
  { id: 19, name: '装修垃圾乱堆放', type: '环境卫生', gridId: 4, status: '处理中', createTime: '2024-06-12', handler: '孙美华', priority: '中', description: 'D区装修垃圾乱堆放', location: '中都花园D区装修现场', images: [] },
  { id: 20, name: '电动车违规充电', type: '安全隐患', gridId: 4, status: '已处理', createTime: '2024-06-11', handler: '周志明', priority: '高', description: 'D区电动车违规充电现象', location: '中都花园D区楼道', images: [] },
  
  // 网格五事件
  { id: 21, name: '儿童游乐设施损坏', type: '设施维护', gridId: 5, status: '已处理', createTime: '2024-06-15', handler: '刘强', priority: '中', description: 'E区儿童游乐设施出现损坏', location: '中都花园E区儿童游乐区', images: [] },
  { id: 22, name: '绿化浇水不及时', type: '环境卫生', gridId: 5, status: '处理中', createTime: '2024-06-14', handler: '陈秀英', priority: '低', description: 'E区绿化浇水不及时', location: '中都花园E区绿化带', images: [] },
  { id: 23, name: '楼道感应灯故障', type: '设施维护', gridId: 5, status: '已处理', createTime: '2024-06-13', handler: '孙德明', priority: '中', description: 'E区楼道感应灯出现故障', location: '中都花园E区楼道', images: [] },
  { id: 24, name: '公共区域晾晒衣物', type: '环境卫生', gridId: 5, status: '处理中', createTime: '2024-06-12', handler: '周丽华', priority: '低', description: 'E区公共区域晾晒衣物', location: '中都花园E区公共区域', images: [] },
  { id: 25, name: '车辆乱停乱放', type: '安全隐患', gridId: 5, status: '已处理', createTime: '2024-06-11', handler: '张志强', priority: '中', description: 'E区车辆乱停乱放现象', location: '中都花园E区道路', images: [] },
  
  // 网格六事件
  { id: 26, name: '电梯按键损坏', type: '设施维护', gridId: 6, status: '已处理', createTime: '2024-06-15', handler: '陈明', priority: '中', description: 'F区电梯按键出现损坏', location: '中都花园F区电梯', images: [] },
  { id: 27, name: '楼道卫生不清洁', type: '环境卫生', gridId: 6, status: '处理中', createTime: '2024-06-14', handler: '孙丽娜', priority: '中', description: 'F区楼道卫生清洁不及时', location: '中都花园F区楼道', images: [] },
  { id: 28, name: '公共区域吸烟', type: '环境卫生', gridId: 6, status: '已处理', createTime: '2024-06-13', handler: '周国强', priority: '低', description: 'F区公共区域吸烟现象', location: '中都花园F区公共区域', images: [] },
  { id: 29, name: '健身器材维护不及时', type: '设施维护', gridId: 6, status: '处理中', createTime: '2024-06-12', handler: '张美华', priority: '中', description: 'F区健身器材维护不及时', location: '中都花园F区健身区', images: [] },
  { id: 30, name: '楼道堆放自行车', type: '安全隐患', gridId: 6, status: '已处理', createTime: '2024-06-11', handler: '李志明', priority: '中', description: 'F区楼道堆放自行车', location: '中都花园F区楼道', images: [] },
  
  // 网格七事件
  { id: 31, name: '垃圾箱满溢未清理', type: '环境卫生', gridId: 7, status: '已处理', createTime: '2024-06-15', handler: '孙伟', priority: '中', description: 'G区垃圾箱满溢未及时清理', location: '中都花园G区垃圾站', images: [] },
  { id: 32, name: '楼道照明不足', type: '设施维护', gridId: 7, status: '处理中', createTime: '2024-06-14', handler: '周秀英', priority: '中', description: 'G区楼道照明不足', location: '中都花园G区楼道', images: [] },
  { id: 33, name: '公共区域乱扔垃圾', type: '环境卫生', gridId: 7, status: '已处理', createTime: '2024-06-13', handler: '张德明', priority: '低', description: 'G区公共区域乱扔垃圾', location: '中都花园G区公共区域', images: [] },
  { id: 34, name: '电梯故障频发', type: '设施维护', gridId: 7, status: '处理中', createTime: '2024-06-12', handler: '李丽华', priority: '高', description: 'G区电梯故障频发', location: '中都花园G区电梯', images: [] },
  { id: 35, name: '楼道感应门故障', type: '设施维护', gridId: 7, status: '已处理', createTime: '2024-06-11', handler: '刘志强', priority: '中', description: 'G区楼道感应门出现故障', location: '中都花园G区楼道', images: [] },
  
  // 网格八事件
  { id: 36, name: '外墙渗水问题', type: '设施维护', gridId: 8, status: '已处理', createTime: '2024-06-15', handler: '周杰', priority: '中', description: 'H区外墙出现渗水问题', location: '中都花园H区外墙', images: [] },
  { id: 37, name: '绿化带被踩踏', type: '环境卫生', gridId: 8, status: '处理中', createTime: '2024-06-14', handler: '张丽娜', priority: '低', description: 'H区绿化带被踩踏破坏', location: '中都花园H区绿化带', images: [] },
  { id: 38, name: '楼道小广告清理', type: '环境卫生', gridId: 8, status: '已处理', createTime: '2024-06-13', handler: '李国强', priority: '低', description: 'H区楼道小广告清理', location: '中都花园H区楼道', images: [] },
  { id: 39, name: '公共座椅维护', type: '设施维护', gridId: 8, status: '处理中', createTime: '2024-06-12', handler: '刘美华', priority: '低', description: 'H区公共座椅需要维护', location: '中都花园H区休闲区', images: [] },
  { id: 40, name: '车辆刮蹭纠纷调解', type: '邻里纠纷', gridId: 8, status: '已处理', createTime: '2024-06-11', handler: '陈志明', priority: '中', description: 'H区停车场车辆刮蹭纠纷调解', location: '中都花园H区停车场', images: [] },
  
  // 更多事件数据...
  { id: 41, name: '楼道感应灯维修', type: '设施维护', gridId: 1, status: '已处理', createTime: '2024-06-10', handler: '赵丽华', priority: '中', description: 'A区楼道感应灯维修完成', location: '中都花园A区楼道', images: [] },
  { id: 42, name: '绿化带修剪', type: '环境卫生', gridId: 2, status: '已处理', createTime: '2024-06-10', handler: '王丽娜', priority: '低', description: 'B区绿化带修剪完成', location: '中都花园B区绿化带', images: [] },
  { id: 43, name: '健身器材检查', type: '设施维护', gridId: 3, status: '已处理', createTime: '2024-06-10', handler: '陈丽华', priority: '中', description: 'C区健身器材安全检查完成', location: '中都花园C区健身区', images: [] },
  { id: 44, name: '楼道卫生清洁', type: '环境卫生', gridId: 4, status: '已处理', createTime: '2024-06-10', handler: '刘丽娜', priority: '中', description: 'D区楼道卫生清洁完成', location: '中都花园D区楼道', images: [] },
  { id: 45, name: '儿童游乐设施检查', type: '设施维护', gridId: 5, status: '已处理', createTime: '2024-06-10', handler: '陈秀英', priority: '中', description: 'E区儿童游乐设施安全检查完成', location: '中都花园E区儿童游乐区', images: [] },
  { id: 46, name: '电梯维护保养', type: '设施维护', gridId: 6, status: '已处理', createTime: '2024-06-10', handler: '张美华', priority: '中', description: 'F区电梯维护保养完成', location: '中都花园F区电梯', images: [] },
  { id: 47, name: '垃圾站清洁消毒', type: '环境卫生', gridId: 7, status: '已处理', createTime: '2024-06-10', handler: '周秀英', priority: '中', description: 'G区垃圾站清洁消毒完成', location: '中都花园G区垃圾站', images: [] },
  { id: 48, name: '外墙维修施工', type: '设施维护', gridId: 8, status: '处理中', createTime: '2024-06-10', handler: '张丽娜', priority: '中', description: 'H区外墙维修施工进行中', location: '中都花园H区外墙', images: [] },
  { id: 49, name: '楼道感应门维修', type: '设施维护', gridId: 1, status: '已处理', createTime: '2024-06-09', handler: '刘志强', priority: '中', description: 'A区楼道感应门维修完成', location: '中都花园A区楼道', images: [] },
  { id: 50, name: '绿化浇水作业', type: '环境卫生', gridId: 2, status: '已处理', createTime: '2024-06-09', handler: '赵国强', priority: '低', description: 'B区绿化浇水作业完成', location: '中都花园B区绿化带', images: [] }
];

const GridManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchText, setSearchText] = useState('');
  const [filterGrid, setFilterGrid] = useState('all');
  
  // 弹窗状态
  const [gridModalVisible, setGridModalVisible] = useState(false);
  const [memberModalVisible, setMemberModalVisible] = useState(false);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  
  // 表单数据
  const [gridForm] = Form.useForm();
  const [memberForm] = Form.useForm();
  const [eventForm] = Form.useForm();
  
  // 当前操作的数据
  const [currentGrid, setCurrentGrid] = useState<GridData | null>(null);
  const [currentMember, setCurrentMember] = useState<GridMemberData | null>(null);
  const [currentEvent, setCurrentEvent] = useState<GridEventData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; data: any } | null>(null);
  
  // 筛选网格员数据
  const getFilteredMemberData = () => {
    let filtered = [...gridMemberData];
    
    // 搜索筛选
    if (searchText) {
      const text = searchText.toLowerCase();
      filtered = filtered.filter(member => 
        member.name.toLowerCase().includes(text) || 
        member.phone.includes(text)
      );
    }
    
    // 网格筛选
    if (filterGrid !== 'all') {
      const gridId = parseInt(filterGrid);
      filtered = filtered.filter(member => member.gridId === gridId);
    }
    
    return filtered;
  };
  
  // 筛选事件数据
  const getFilteredEventData = () => {
    let filtered = [...gridEventData];
    
    // 搜索筛选
    if (searchText) {
      const text = searchText.toLowerCase();
      filtered = filtered.filter(event => 
        event.name.toLowerCase().includes(text) || 
        event.handler.toLowerCase().includes(text) ||
        event.type.toLowerCase().includes(text)
      );
    }
    
    // 网格筛选
    if (filterGrid !== 'all') {
      const gridId = parseInt(filterGrid);
      filtered = filtered.filter(event => event.gridId === gridId);
    }
    
    return filtered;
  };

  // 新增网格
  const handleAddGrid = () => {
    setCurrentGrid(null);
    gridForm.resetFields();
    setGridModalVisible(true);
  };

  // 编辑网格
  const handleEditGrid = (record: GridData) => {
    setCurrentGrid(record);
    gridForm.setFieldsValue(record);
    setGridModalVisible(true);
  };

  // 保存网格
  const handleSaveGrid = async () => {
    try {
      const values = await gridForm.validateFields();
      if (currentGrid) {
        // 编辑模式
        message.success('网格信息更新成功');
      } else {
        // 新增模式
        message.success('网格创建成功');
      }
      setGridModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 新增网格员
  const handleAddMember = () => {
    setCurrentMember(null);
    memberForm.resetFields();
    setMemberModalVisible(true);
  };

  // 编辑网格员
  const handleEditMember = (record: GridMemberData) => {
    setCurrentMember(record);
    memberForm.setFieldsValue(record);
    setMemberModalVisible(true);
  };

  // 保存网格员
  const handleSaveMember = async () => {
    try {
      const values = await memberForm.validateFields();
      if (currentMember) {
        message.success('网格员信息更新成功');
      } else {
        message.success('网格员添加成功');
      }
      setMemberModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 新增事件
  const handleAddEvent = () => {
    setCurrentEvent(null);
    eventForm.resetFields();
    setEventModalVisible(true);
  };

  // 编辑事件
  const handleEditEvent = (record: GridEventData) => {
    setCurrentEvent(record);
    eventForm.setFieldsValue(record);
    setEventModalVisible(true);
  };

  // 保存事件
  const handleSaveEvent = async () => {
    try {
      const values = await eventForm.validateFields();
      if (currentEvent) {
        message.success('事件信息更新成功');
      } else {
        message.success('事件创建成功');
      }
      setEventModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 查看详情
  const handleViewDetail = (record: any, type: string) => {
    if (type === 'grid') {
      setCurrentGrid(record);
    } else if (type === 'member') {
      setCurrentMember(record);
    } else if (type === 'event') {
      setCurrentEvent(record);
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

  // 网格数据表格列
  const gridColumns = [
    {
      title: '网格名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: GridData) => (
        <span>
          <Tag color={record.color} style={{ marginRight: 8 }}>{text}</Tag>
        </span>
      )
    },
    {
      title: '所属区域',
      dataIndex: 'area',
      key: 'area',
    },
    {
      title: '人口数量',
      dataIndex: 'population',
      key: 'population',
      sorter: (a: GridData, b: GridData) => a.population - b.population,
    },
    {
      title: '房屋数量',
      dataIndex: 'houses',
      key: 'houses',
      sorter: (a: GridData, b: GridData) => a.houses - b.houses,
    },
    {
      title: '网格长',
      dataIndex: 'manager',
      key: 'manager',
    },
    {
      title: '网格员数量',
      dataIndex: 'memberCount',
      key: 'memberCount',
    },
    {
      title: '事件数',
      dataIndex: 'eventCount',
      key: 'eventCount',
    },
    {
      title: '巡查次数',
      dataIndex: 'patrolCount',
      key: 'patrolCount',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: GridData) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record, 'grid')}>查看</Button>
          </Tooltip>
          <Tooltip title="编辑网格">
            <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEditGrid(record)}>编辑</Button>
          </Tooltip>
          <Tooltip title="删除网格">
            <Popconfirm
              title="确定要删除这个网格吗？"
              onConfirm={() => handleDelete(record, 'grid')}
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

  // 网格员数据表格列
  const memberColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: GridMemberData) => (
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
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      render: (text: string) => desensitizePhoneNumber(text)
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        const color = role === '网格长' ? 'blue' : 'green';
        return <Tag color={color}>{role}</Tag>;
      }
    },
    {
      title: '所属网格',
      dataIndex: 'gridId',
      key: 'gridId',
      render: (id: number) => `网格${id}`
    },
    {
      title: '任务完成数',
      dataIndex: 'taskCount',
      key: 'taskCount',
    },
    {
      title: '处理事件数',
      dataIndex: 'eventCount',
      key: 'eventCount',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: GridMemberData) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record, 'member')}>查看</Button>
          </Tooltip>
          <Tooltip title="编辑信息">
            <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEditMember(record)}>编辑</Button>
          </Tooltip>
          <Tooltip title="删除网格员">
            <Popconfirm
              title="确定要删除这个网格员吗？"
              onConfirm={() => handleDelete(record, 'member')}
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

  // 事件数据表格列
  const eventColumns = [
    {
      title: '事件名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '事件类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const color = 
          type === '安全隐患' ? 'red' : 
          type === '环境卫生' ? 'green' : 
          type === '邻里纠纷' ? 'orange' : 
          'blue';
        return <Tag color={color}>{type}</Tag>;
      }
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        let color = 'default';
        if (priority === '紧急') color = 'red';
        if (priority === '高') color = 'volcano';
        if (priority === '中') color = 'orange';
        if (priority === '低') color = 'green';
        
        return <Tag color={color}>{priority}</Tag>;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        let icon = null;
        if (status === '待处理') {
          color = 'red';
          icon = <ExclamationCircleOutlined />;
        } else if (status === '处理中') {
          color = 'processing';
          icon = <ClockCircleOutlined />;
        } else if (status === '已完成') {
          color = 'success';
          icon = <CheckCircleOutlined />;
        }
        
        return <Tag color={color} icon={icon}>{status}</Tag>;
      }
    },
    {
      title: '所属网格',
      dataIndex: 'gridId',
      key: 'gridId',
      render: (id: number) => `网格${id}`
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '处理人',
      dataIndex: 'handler',
      key: 'handler',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: GridEventData) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record, 'event')}>查看详情</Button>
          </Tooltip>
          <Tooltip title="更新状态">
            <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEditEvent(record)}>更新状态</Button>
          </Tooltip>
          <Tooltip title="删除事件">
            <Popconfirm
              title="确定要删除这个事件吗？"
              onConfirm={() => handleDelete(record, 'event')}
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
    <div className="grid-management-container">
      <h1>网格管理</h1>
      
      <Row gutter={[16, 16]} className="stat-overview">
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic 
              title="网格总数" 
              value={gridData.length} 
              prefix={<AppstoreOutlined />} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic 
              title="网格员数量" 
              value={gridMemberData.length} 
              prefix={<TeamOutlined />} 
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic 
              title="本月事件" 
              value={gridEventData.filter(e => e.createTime.startsWith('2024-6')).length} 
              prefix={<AlertOutlined />} 
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic 
              title="巡查总次数" 
              value={gridData.reduce((sum, grid) => sum + grid.patrolCount, 0)} 
              prefix={<SafetyCertificateOutlined />} 
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Card className="table-card">
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          tabBarExtraContent={
            activeTab !== 'overview' && (
              <div className="table-actions">
                <Input.Group compact>
                  <Input 
                    placeholder="搜索..." 
                    onChange={e => setSearchText(e.target.value)} 
                    style={{ width: 200 }}
                    prefix={<SearchOutlined />}
                  />
                  <Select 
                    defaultValue="all" 
                    style={{ width: 120 }} 
                    onChange={value => setFilterGrid(value)}
                  >
                    <Option value="all">全部网格</Option>
                    <Option value="1">网格1</Option>
                    <Option value="2">网格2</Option>
                    <Option value="3">网格3</Option>
                    <Option value="4">网格4</Option>
                  </Select>
                </Input.Group>
                {activeTab === 'members' && (
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAddMember}>新增网格员</Button>
                )}
                {activeTab === 'events' && (
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAddEvent}>新增事件</Button>
                )}
                <Button icon={<DownloadOutlined />} onClick={handleExport}>导出</Button>
              </div>
            )
          }
        >
          <TabPane tab="网格概览" key="overview">
            <div className="grid-overview">
              <div className="grid-map">
                <SimpleMap height={400} />
              </div>
              <div className="grid-stats">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3>网格信息</h3>
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAddGrid}>新增网格</Button>
                </div>
                <Table 
                  columns={gridColumns} 
                  dataSource={gridData}
                  rowKey="id"
                  pagination={false}
                  size="small"
                />
                
                <h3>网格事件统计</h3>
                <Row gutter={[16, 16]}>
                  {gridData.map(grid => (
                    <Col key={grid.id} xs={24} sm={12} md={6}>
                      <Card title={grid.name} bordered={false} size="small">
                        <div className="event-progress">
                          <div className="progress-item">
                            <span>已完成</span>
                            <Progress 
                              percent={Math.round(gridEventData.filter(e => e.gridId === grid.id && e.status === '已完成').length / (gridEventData.filter(e => e.gridId === grid.id).length || 1) * 100)} 
                              size="small" 
                              status="success"
                            />
                          </div>
                          <div className="progress-item">
                            <span>处理中</span>
                            <Progress 
                              percent={Math.round(gridEventData.filter(e => e.gridId === grid.id && e.status === '处理中').length / (gridEventData.filter(e => e.gridId === grid.id).length || 1) * 100)} 
                              size="small" 
                              status="active"
                            />
                          </div>
                          <div className="progress-item">
                            <span>待处理</span>
                            <Progress 
                              percent={Math.round(gridEventData.filter(e => e.gridId === grid.id && e.status === '待处理').length / (gridEventData.filter(e => e.gridId === grid.id).length || 1) * 100)} 
                              size="small" 
                              status="exception"
                            />
                          </div>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </div>
          </TabPane>
          <TabPane tab="网格员管理" key="members">
            <Table 
              columns={memberColumns} 
              dataSource={getFilteredMemberData()}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showQuickJumper: true,
                showSizeChanger: true,
              }}
            />
          </TabPane>
          <TabPane tab="网格事件" key="events">
            <Table 
              columns={eventColumns} 
              dataSource={getFilteredEventData()}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showQuickJumper: true,
                showSizeChanger: true,
              }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 网格弹窗 */}
      <Modal
        title={currentGrid ? '编辑网格' : '新增网格'}
        open={gridModalVisible}
        onOk={handleSaveGrid}
        onCancel={() => setGridModalVisible(false)}
        width={600}
      >
        <Form form={gridForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="网格名称" rules={[{ required: true, message: '请输入网格名称' }]}>
                <Input placeholder="请输入网格名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="area" label="所属区域" rules={[{ required: true, message: '请选择所属区域' }]}>
                <Select placeholder="请选择所属区域">
                  <Option value="东部区域">东部区域</Option>
                  <Option value="中部区域">中部区域</Option>
                  <Option value="西部区域">西部区域</Option>
                  <Option value="南部区域">南部区域</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="manager" label="网格长" rules={[{ required: true, message: '请输入网格长姓名' }]}>
                <Input placeholder="请输入网格长姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="color" label="网格颜色">
                <Input type="color" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 网格员弹窗 */}
      <Modal
        title={currentMember ? '编辑网格员' : '新增网格员'}
        open={memberModalVisible}
        onOk={handleSaveMember}
        onCancel={() => setMemberModalVisible(false)}
        width={600}
      >
        <Form form={memberForm} layout="vertical">
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
              <Form.Item name="phone" label="联系电话" rules={[{ required: true, message: '请输入联系电话' }]}>
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="role" label="角色" rules={[{ required: true, message: '请选择角色' }]}>
                <Select placeholder="请选择角色">
                  <Option value="网格长">网格长</Option>
                  <Option value="网格员">网格员</Option>
                  <Option value="专职网格员">专职网格员</Option>
                </Select>
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
        </Form>
      </Modal>

      {/* 事件弹窗 */}
      <Modal
        title={currentEvent ? '编辑事件' : '新增事件'}
        open={eventModalVisible}
        onOk={handleSaveEvent}
        onCancel={() => setEventModalVisible(false)}
        width={600}
      >
        <Form form={eventForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="事件名称" rules={[{ required: true, message: '请输入事件名称' }]}>
                <Input placeholder="请输入事件名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="type" label="事件类型" rules={[{ required: true, message: '请选择事件类型' }]}>
                <Select placeholder="请选择事件类型">
                  <Option value="安全隐患">安全隐患</Option>
                  <Option value="环境卫生">环境卫生</Option>
                  <Option value="邻里纠纷">邻里纠纷</Option>
                  <Option value="设施维护">设施维护</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="priority" label="优先级" rules={[{ required: true, message: '请选择优先级' }]}>
                <Select placeholder="请选择优先级">
                  <Option value="低">低</Option>
                  <Option value="中">中</Option>
                  <Option value="高">高</Option>
                  <Option value="紧急">紧急</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
                <Select placeholder="请选择状态">
                  <Option value="待处理">待处理</Option>
                  <Option value="处理中">处理中</Option>
                  <Option value="已完成">已完成</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
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
            <Col span={12}>
              <Form.Item name="handler" label="处理人" rules={[{ required: true, message: '请输入处理人' }]}>
                <Input placeholder="请输入处理人" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="事件描述">
            <TextArea rows={3} placeholder="请输入事件描述" />
          </Form.Item>
          <Form.Item name="location" label="事件地点">
            <Input placeholder="请输入事件地点" />
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
        {currentGrid && (
          <div>
            <h3>网格信息</h3>
            <p><strong>网格名称：</strong>{currentGrid.name}</p>
            <p><strong>所属区域：</strong>{currentGrid.area}</p>
            <p><strong>人口数量：</strong>{currentGrid.population}</p>
            <p><strong>房屋数量：</strong>{currentGrid.houses}</p>
            <p><strong>网格长：</strong>{currentGrid.manager}</p>
            <p><strong>网格员数量：</strong>{currentGrid.memberCount}</p>
            <p><strong>事件数：</strong>{currentGrid.eventCount}</p>
            <p><strong>巡查次数：</strong>{currentGrid.patrolCount}</p>
          </div>
        )}
        {currentMember && (
          <div>
            <h3>网格员信息</h3>
            <p><strong>姓名：</strong>{currentMember.name}</p>
            <p><strong>性别：</strong>{currentMember.gender}</p>
            <p><strong>年龄：</strong>{currentMember.age}</p>
            <p><strong>联系电话：</strong>{currentMember.phone}</p>
            <p><strong>角色：</strong>{currentMember.role}</p>
            <p><strong>所属网格：</strong>网格{currentMember.gridId}</p>
            <p><strong>任务完成数：</strong>{currentMember.taskCount}</p>
            <p><strong>处理事件数：</strong>{currentMember.eventCount}</p>
          </div>
        )}
        {currentEvent && (
          <div>
            <h3>事件信息</h3>
            <p><strong>事件名称：</strong>{currentEvent.name}</p>
            <p><strong>事件类型：</strong>{currentEvent.type}</p>
            <p><strong>优先级：</strong>{currentEvent.priority}</p>
            <p><strong>状态：</strong>{currentEvent.status}</p>
            <p><strong>所属网格：</strong>网格{currentEvent.gridId}</p>
            <p><strong>创建时间：</strong>{currentEvent.createTime}</p>
            <p><strong>处理人：</strong>{currentEvent.handler}</p>
            <p><strong>事件描述：</strong>{currentEvent.description}</p>
            <p><strong>事件地点：</strong>{currentEvent.location}</p>
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
        <p>确定要删除这个{deleteTarget?.type === 'grid' ? '网格' : deleteTarget?.type === 'member' ? '网格员' : '事件'}吗？</p>
        <p>删除后将无法恢复，请谨慎操作。</p>
      </Modal>
    </div>
  );
};

export default GridManagement; 