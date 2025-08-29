import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Row, Col, Statistic, Modal, Form, Input, Select, message, Popconfirm, Tooltip } from 'antd';
import { 
  AlertOutlined, 
  SafetyOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  UploadOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import './Event.less';

const { Option } = Select;
const { TextArea } = Input;

// 事件数据类型
interface EventData {
  key: number;
  id: number;
  title: string;
  type: string;
  location: string;
  reporter: string;
  phone: string;
  date: string;
  status: string;
  priority: string;
  description?: string;
  handler?: string;
  handleTime?: string;
  result?: string;
  gridId?: number;
}

const Event: React.FC = () => {
  // 弹窗状态
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [handleModalVisible, setHandleModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  
  // 表单数据
  const [eventForm] = Form.useForm();
  const [handleForm] = Form.useForm();
  
  // 当前操作的数据
  const [currentEvent, setCurrentEvent] = useState<EventData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EventData | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  // 模拟事件数据 - 基于大型社区实际规模
  const eventData: EventData[] = [
    // 安全隐患类事件
    { id: 1, key: 1, title: '消防通道被电动车占用', type: '安全隐患', location: '中都花园A区3栋', reporter: '张伟', phone: '138****1234', date: '2025-08-15', status: '已处理', priority: '高', description: 'A区3栋消防通道被多辆电动车占用，存在严重安全隐患，影响消防车辆通行', handler: '张建国', handleTime: '2025-08-15 14:30', result: '已清理完毕，张贴禁止占用标识', gridId: 1 },
    { id: 2, key: 2, title: '外墙脱落安全隐患', type: '安全隐患', location: '中都花园B区1栋', reporter: '李敏', phone: '139****5678', date: '2025-08-14', status: '处理中', priority: '紧急', description: 'B区1栋外墙出现脱落现象，存在严重安全隐患，需要立即处理', handler: '李明', handleTime: '2025-08-14 16:00', result: '已设置警戒线，联系施工单位处理', gridId: 2 },
    { id: 3, key: 3, title: '井盖损坏安全隐患', type: '安全隐患', location: '中都花园C区道路', reporter: '王强', phone: '136****9012', date: '2025-08-13', status: '已处理', priority: '紧急', description: 'C区道路井盖损坏，存在安全隐患，影响车辆和行人安全', handler: '王华', handleTime: '2025-08-13 10:30', result: '已更换新井盖，安全隐患消除', gridId: 3 },
    { id: 4, key: 4, title: '违规停车堵塞道路', type: '安全隐患', location: '中都花园A区主干道', reporter: '赵华', phone: '137****3456', date: '2025-08-12', status: '处理中', priority: '中', description: 'A区主干道被违规停车堵塞，影响车辆通行和紧急救援', handler: '张建国', handleTime: '2025-08-12 09:15', result: '已联系车主移车，加强巡逻管理', gridId: 1 },
    { id: 5, key: 5, title: '电动车违规充电', type: '安全隐患', location: '中都花园D区楼道', reporter: '刘芳', phone: '135****7890', date: '2025-08-11', status: '已处理', priority: '高', description: 'D区楼道发现电动车违规充电现象，存在火灾隐患', handler: '赵红', handleTime: '2025-08-11 15:45', result: '已制止违规充电，安装充电桩引导规范充电', gridId: 4 },
    
    // 环境卫生类事件
    { id: 6, key: 6, title: '垃圾箱周边垃圾散落', type: '环境卫生', location: '中都花园A区垃圾站', reporter: '陈阿姨', phone: '134****2345', date: '2025-08-15', status: '处理中', priority: '中', description: 'A区垃圾箱周边垃圾散落，影响环境卫生，需要及时清理', handler: '李秀英', handleTime: '2025-08-15 08:30', result: '已安排清洁人员清理，加强垃圾投放管理', gridId: 1 },
    { id: 7, key: 7, title: '绿化带被破坏', type: '环境卫生', location: '中都花园B区绿化带', reporter: '孙大爷', phone: '133****6789', date: '2025-08-14', status: '已处理', priority: '低', description: 'B区绿化带被踩踏破坏，影响小区美观', handler: '王丽娜', handleTime: '2025-08-14 14:20', result: '已补种绿植，设置温馨提示牌', gridId: 2 },
    { id: 8, key: 8, title: '垃圾分类不规范', type: '环境卫生', location: '中都花园C区垃圾站', reporter: '周女士', phone: '132****0123', date: '2025-08-13', status: '处理中', priority: '中', description: 'C区垃圾分类投放不规范，影响环保工作推进', handler: '赵秀英', handleTime: '2025-08-13 11:00', result: '已张贴分类指南，加强宣传教育', gridId: 3 },
    { id: 9, key: 9, title: '宠物粪便未清理', type: '环境卫生', location: '中都花园C区公共区域', reporter: '吴先生', phone: '131****4567', date: '2025-08-12', status: '已处理', priority: '低', description: 'C区公共区域宠物粪便未及时清理，影响环境卫生', handler: '刘德明', handleTime: '2025-08-12 16:30', result: '已清理完毕，设置宠物便便箱', gridId: 3 },
    { id: 10, key: 10, title: '楼道小广告乱贴', type: '环境卫生', location: '中都花园D区楼道', reporter: '郑女士', phone: '130****8901', date: '2025-08-11', status: '处理中', priority: '低', description: 'D区楼道小广告乱贴现象严重，影响楼道美观', handler: '刘丽娜', handleTime: '2025-08-11 13:15', result: '已清理部分小广告，加强门禁管理', gridId: 4 },
    
    // 设施维护类事件
    { id: 11, key: 11, title: '楼道照明灯损坏', type: '设施维护', location: '中都花园A区2栋', reporter: '马大爷', phone: '129****2345', date: '2025-08-15', status: '已处理', priority: '中', description: 'A区2栋楼道照明灯损坏，影响夜间出行安全', handler: '赵丽华', handleTime: '2025-08-15 17:00', result: '已更换新灯泡，照明恢复正常', gridId: 1 },
    { id: 12, key: 12, title: '电梯故障报修', type: '设施维护', location: '中都花园B区2栋', reporter: '朱女士', phone: '128****6789', date: '2025-08-14', status: '已处理', priority: '高', description: 'B区2栋电梯出现故障，影响居民正常出行', handler: '刘美华', handleTime: '2025-08-14 12:30', result: '已联系维保单位修复，电梯正常运行', gridId: 2 },
    { id: 13, key: 13, title: '健身器材损坏', type: '设施维护', location: '中都花园C区健身区', reporter: '胡先生', phone: '127****0123', date: '2025-08-13', status: '已处理', priority: '中', description: 'C区健身器材出现损坏，影响居民健身活动', handler: '陈丽华', handleTime: '2025-08-13 15:45', result: '已维修完毕，器材可正常使用', gridId: 3 },
    { id: 14, key: 14, title: '路灯不亮影响出行', type: '设施维护', location: '中都花园D区道路', reporter: '林女士', phone: '126****4567', date: '2025-08-12', status: '已处理', priority: '中', description: 'D区路灯不亮，影响夜间出行安全', handler: '陈国强', handleTime: '2025-08-12 18:00', result: '已修复电路问题，路灯恢复正常', gridId: 4 },
    { id: 15, key: 15, title: '公共座椅损坏', type: '设施维护', location: '中都花园D区休闲区', reporter: '何先生', phone: '125****8901', date: '2025-08-11', status: '已处理', priority: '低', description: 'D区公共座椅出现损坏，影响居民休息', handler: '孙美华', handleTime: '2025-08-11 14:20', result: '已更换新座椅，休闲区恢复正常', gridId: 4 },
    
    // 邻里纠纷类事件
    { id: 16, key: 16, title: '高空抛物投诉', type: '邻里纠纷', location: '中都花园A区5栋', reporter: '郭女士', phone: '124****2345', date: '2025-08-15', status: '已处理', priority: '高', description: 'A区5栋居民投诉高空抛物问题，存在安全隐患', handler: '王德明', handleTime: '2025-08-15 10:15', result: '已上门劝导，张贴禁止高空抛物标识', gridId: 1 },
    { id: 17, key: 17, title: '噪音扰民投诉', type: '邻里纠纷', location: '中都花园B区3栋', reporter: '高先生', phone: '123****6789', date: '2025-08-14', status: '处理中', priority: '中', description: 'B区3栋居民投诉装修噪音扰民，影响正常生活', handler: '王丽娜', handleTime: '2025-08-14 09:30', result: '已协调装修时间，减少噪音影响', gridId: 2 },
    { id: 18, key: 18, title: '车辆刮蹭纠纷', type: '邻里纠纷', location: '中都花园C区停车场', reporter: '罗先生', phone: '122****0123', date: '2025-08-13', status: '处理中', priority: '中', description: 'C区停车场车辆刮蹭纠纷，需要调解处理', handler: '孙志强', handleTime: '2025-08-13 16:45', result: '已联系双方协商，提供监控录像证据', gridId: 3 },
    { id: 19, key: 19, title: '装修垃圾乱堆放', type: '环境卫生', location: '中都花园D区装修现场', reporter: '梁女士', phone: '121****4567', date: '2025-08-12', status: '处理中', priority: '中', description: 'D区装修垃圾乱堆放，影响环境卫生和通行', handler: '周志明', handleTime: '2025-08-12 11:30', result: '已要求装修方及时清理，规范垃圾堆放', gridId: 4 },
    { id: 20, key: 20, title: '公共区域晾晒衣物', type: '环境卫生', location: '中都花园E区公共区域', reporter: '宋先生', phone: '120****8901', date: '2025-08-11', status: '处理中', priority: '低', description: 'E区公共区域晾晒衣物，影响小区美观', handler: '周丽华', handleTime: '2025-08-11 15:00', result: '已劝导居民规范晾晒，设置晾晒区域', gridId: 5 },
    
    // 更多事件数据...
    { id: 21, key: 21, title: '儿童游乐设施损坏', type: '设施维护', location: '中都花园E区儿童游乐区', reporter: '谢女士', phone: '119****2345', date: '2025-08-10', status: '已处理', priority: '中', description: 'E区儿童游乐设施出现损坏，影响儿童安全', handler: '陈秀英', handleTime: '2025-08-10 14:30', result: '已维修完毕，设施安全可用', gridId: 5 },
    { id: 22, key: 22, title: '绿化浇水不及时', type: '环境卫生', location: '中都花园E区绿化带', reporter: '韩先生', phone: '118****6789', date: '2025-08-10', status: '处理中', priority: '低', description: 'E区绿化浇水不及时，影响植物生长', handler: '陈秀英', handleTime: '2025-08-10 10:00', result: '已安排定期浇水，绿化恢复正常', gridId: 5 },
    { id: 23, key: 23, title: '楼道感应灯故障', type: '设施维护', location: '中都花园E区楼道', reporter: '曹女士', phone: '117****0123', date: '2025-08-09', status: '已处理', priority: '中', description: 'E区楼道感应灯出现故障，影响夜间出行', handler: '孙德明', handleTime: '2025-08-09 16:15', result: '已修复感应器，感应灯正常工作', gridId: 5 },
    { id: 24, key: 24, title: '车辆乱停乱放', type: '安全隐患', location: '中都花园E区道路', reporter: '许先生', phone: '116****4567', date: '2025-08-09', status: '已处理', priority: '中', description: 'E区车辆乱停乱放现象，影响道路通行', handler: '张志强', handleTime: '2025-08-09 12:30', result: '已规范停车秩序，加强管理', gridId: 5 },
    { id: 25, key: 25, title: '电梯按键损坏', type: '设施维护', location: '中都花园F区电梯', reporter: '邓女士', phone: '115****8901', date: '2025-08-08', status: '已处理', priority: '中', description: 'F区电梯按键出现损坏，影响正常使用', handler: '孙丽娜', handleTime: '2025-08-08 17:45', result: '已更换新按键，电梯正常使用', gridId: 6 },
    { id: 26, key: 26, title: '楼道卫生不清洁', type: '环境卫生', location: '中都花园F区楼道', reporter: '萧先生', phone: '114****2345', date: '2025-08-08', status: '处理中', priority: '中', description: 'F区楼道卫生清洁不及时，影响居住环境', handler: '孙丽娜', handleTime: '2025-08-08 09:00', result: '已安排清洁人员，加强卫生管理', gridId: 6 },
    { id: 27, key: 27, title: '公共区域吸烟', type: '环境卫生', location: '中都花园F区公共区域', reporter: '冯女士', phone: '113****6789', date: '2025-08-07', status: '已处理', priority: '低', description: 'F区公共区域吸烟现象，影响他人健康', handler: '周国强', handleTime: '2025-08-07 15:30', result: '已劝导吸烟者，设置吸烟区', gridId: 6 },
    { id: 28, key: 28, title: '健身器材维护不及时', type: '设施维护', location: '中都花园F区健身区', reporter: '曾先生', phone: '112****0123', date: '2025-08-07', status: '处理中', priority: '中', description: 'F区健身器材维护不及时，影响使用安全', handler: '张美华', handleTime: '2025-08-07 11:15', result: '已联系维保单位，安排定期维护', gridId: 6 },
    { id: 29, key: 29, title: '楼道堆放自行车', type: '安全隐患', location: '中都花园F区楼道', reporter: '程女士', phone: '111****4567', date: '2025-08-06', status: '已处理', priority: '中', description: 'F区楼道堆放自行车，影响通行和消防安全', handler: '李志明', handleTime: '2025-08-06 14:00', result: '已清理楼道，设置自行车停放区', gridId: 6 },
    { id: 30, key: 30, title: '垃圾箱满溢未清理', type: '环境卫生', location: '中都花园G区垃圾站', reporter: '蔡先生', phone: '110****8901', date: '2025-08-06', status: '已处理', priority: '中', description: 'G区垃圾箱满溢未及时清理，影响环境卫生', handler: '周秀英', handleTime: '2025-08-06 08:30', result: '已清理完毕，加强垃圾清运管理', gridId: 7 },
    { id: 31, key: 31, title: '楼道照明不足', type: '设施维护', location: '中都花园G区楼道', reporter: '彭女士', phone: '109****2345', date: '2025-08-05', status: '处理中', priority: '中', description: 'G区楼道照明不足，影响夜间出行安全', handler: '周秀英', handleTime: '2025-08-05 16:45', result: '已增加照明设备，改善照明效果', gridId: 7 },
    { id: 32, key: 32, title: '公共区域乱扔垃圾', type: '环境卫生', location: '中都花园G区公共区域', reporter: '潘先生', phone: '108****6789', date: '2025-08-05', status: '已处理', priority: '低', description: 'G区公共区域乱扔垃圾，影响环境卫生', handler: '张德明', handleTime: '2025-08-05 13:20', result: '已清理垃圾，加强宣传教育', gridId: 7 },
    { id: 33, key: 33, title: '电梯故障频发', type: '设施维护', location: '中都花园G区电梯', reporter: '袁女士', phone: '107****0123', date: '2025-08-04', status: '处理中', priority: '高', description: 'G区电梯故障频发，影响居民正常出行', handler: '李丽华', handleTime: '2025-08-04 10:30', result: '已联系专业维保，进行全面检修', gridId: 7 },
    { id: 34, key: 34, title: '楼道感应门故障', type: '设施维护', location: '中都花园G区楼道', reporter: '于先生', phone: '106****4567', date: '2025-08-04', status: '已处理', priority: '中', description: 'G区楼道感应门出现故障，影响安全', handler: '刘志强', handleTime: '2025-08-04 17:15', result: '已修复感应器，感应门正常工作', gridId: 7 },
    { id: 35, key: 35, title: '外墙渗水问题', type: '设施维护', location: '中都花园H区外墙', reporter: '董女士', phone: '105****8901', date: '2025-08-03', status: '已处理', priority: '中', description: 'H区外墙出现渗水问题，需要及时处理', handler: '张丽娜', handleTime: '2025-08-03 14:45', result: '已联系施工单位，进行防水处理', gridId: 8 },
    { id: 36, key: 36, title: '绿化带被踩踏', type: '环境卫生', location: '中都花园H区绿化带', reporter: '余先生', phone: '104****2345', date: '2025-08-03', status: '处理中', priority: '低', description: 'H区绿化带被踩踏破坏，影响小区美观', handler: '张丽娜', handleTime: '2025-08-03 11:00', result: '已补种绿植，设置保护标识', gridId: 8 },
    { id: 37, key: 37, title: '楼道小广告清理', type: '环境卫生', location: '中都花园H区楼道', reporter: '苏女士', phone: '103****6789', date: '2025-08-02', status: '已处理', priority: '低', description: 'H区楼道小广告清理工作', handler: '李国强', handleTime: '2025-08-02 15:30', result: '已清理完毕，楼道恢复整洁', gridId: 8 },
    { id: 38, key: 38, title: '公共座椅维护', type: '设施维护', location: '中都花园H区休闲区', reporter: '叶先生', phone: '102****0123', date: '2025-08-02', status: '处理中', priority: '低', description: 'H区公共座椅需要维护，影响居民休息', handler: '刘美华', handleTime: '2025-08-02 09:15', result: '已安排维护人员，进行座椅维修', gridId: 8 },
    { id: 39, key: 39, title: '车辆刮蹭纠纷调解', type: '邻里纠纷', location: '中都花园H区停车场', reporter: '吕女士', phone: '101****4567', date: '2025-08-01', status: '已处理', priority: '中', description: 'H区停车场车辆刮蹭纠纷调解', handler: '陈志明', handleTime: '2025-08-01 16:00', result: '已成功调解，双方达成和解', gridId: 8 },
    { id: 40, key: 40, title: '楼道感应灯维修', type: '设施维护', location: '中都花园A区楼道', reporter: '魏先生', phone: '100****8901', date: '2025-08-01', status: '已处理', priority: '中', description: 'A区楼道感应灯维修完成', handler: '赵丽华', handleTime: '2025-08-01 12:30', result: '维修完成，感应灯正常工作', gridId: 1 },
    { id: 41, key: 41, title: '绿化带修剪', type: '环境卫生', location: '中都花园B区绿化带', reporter: '蒋女士', phone: '099****2345', date: '2025-05-31', status: '已处理', priority: '低', description: 'B区绿化带修剪完成', handler: '王丽娜', handleTime: '2025-05-31 14:00', result: '修剪完成，绿化带整齐美观', gridId: 2 },
    { id: 42, key: 42, title: '健身器材检查', type: '设施维护', location: '中都花园C区健身区', reporter: '田先生', phone: '098****6789', date: '2025-05-31', status: '已处理', priority: '中', description: 'C区健身器材安全检查完成', handler: '陈丽华', handleTime: '2025-05-31 10:30', result: '检查完成，器材安全可用', gridId: 3 },
    { id: 43, key: 43, title: '楼道卫生清洁', type: '环境卫生', location: '中都花园D区楼道', reporter: '杜女士', phone: '097****0123', date: '2025-05-30', status: '已处理', priority: '中', description: 'D区楼道卫生清洁完成', handler: '刘丽娜', handleTime: '2025-05-30 16:45', result: '清洁完成，楼道整洁卫生', gridId: 4 },
    { id: 44, key: 44, title: '儿童游乐设施检查', type: '设施维护', location: '中都花园E区儿童游乐区', reporter: '丁先生', phone: '096****4567', date: '2025-05-30', status: '已处理', priority: '中', description: 'E区儿童游乐设施安全检查完成', handler: '陈秀英', handleTime: '2025-05-30 13:15', result: '检查完成，设施安全可用', gridId: 5 },
    { id: 45, key: 45, title: '电梯维护保养', type: '设施维护', location: '中都花园F区电梯', reporter: '沈女士', phone: '095****8901', date: '2025-05-29', status: '已处理', priority: '中', description: 'F区电梯维护保养完成', handler: '张美华', handleTime: '2025-05-29 11:00', result: '保养完成，电梯运行稳定', gridId: 6 },
    { id: 46, key: 46, title: '垃圾站清洁消毒', type: '环境卫生', location: '中都花园G区垃圾站', reporter: '姜先生', phone: '094****2345', date: '2025-05-29', status: '已处理', priority: '中', description: 'G区垃圾站清洁消毒完成', handler: '周秀英', handleTime: '2025-05-29 15:30', result: '清洁消毒完成，环境改善', gridId: 7 },
    { id: 47, key: 47, title: '外墙维修施工', type: '设施维护', location: '中都花园H区外墙', reporter: '范女士', phone: '093****6789', date: '2025-05-28', status: '处理中', priority: '中', description: 'H区外墙维修施工进行中', handler: '张丽娜', handleTime: '2025-05-28 09:00', result: '施工进行中，预计一周完成', gridId: 8 },
    { id: 48, key: 48, title: '楼道感应门维修', type: '设施维护', location: '中都花园A区楼道', reporter: '方先生', phone: '092****0123', date: '2025-05-28', status: '已处理', priority: '中', description: 'A区楼道感应门维修完成', handler: '刘志强', handleTime: '2025-05-28 17:30', result: '维修完成，感应门正常工作', gridId: 1 },
    { id: 49, key: 49, title: '绿化浇水作业', type: '环境卫生', location: '中都花园B区绿化带', reporter: '石女士', phone: '091****4567', date: '2025-05-27', status: '已处理', priority: '低', description: 'B区绿化浇水作业完成', handler: '赵国强', handleTime: '2025-05-27 14:15', result: '浇水完成，绿化生长良好', gridId: 2 },
    { id: 50, key: 50, title: '健身器材维护', type: '设施维护', location: '中都花园C区健身区', reporter: '姚先生', phone: '090****8901', date: '2025-05-27', status: '已处理', priority: '中', description: 'C区健身器材维护完成', handler: '孙志强', handleTime: '2025-05-27 10:45', result: '维护完成，器材性能良好', gridId: 3 }
  ];

  // 筛选数据
  const getFilteredData = () => {
    let filtered = [...eventData];
    
    // 搜索筛选
    if (searchText) {
      const text = searchText.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(text) || 
        event.location.toLowerCase().includes(text) || 
        event.reporter.toLowerCase().includes(text) ||
        event.id.toString().includes(text)
      );
    }
    
    // 类型筛选
    if (filterType !== 'all') {
      filtered = filtered.filter(event => event.type === filterType);
    }
    
    // 状态筛选
    if (filterStatus !== 'all') {
      filtered = filtered.filter(event => event.status === filterStatus);
    }
    
    // 优先级筛选
    if (filterPriority !== 'all') {
      filtered = filtered.filter(event => event.priority === filterPriority);
    }
    
    return filtered;
  };

  // 新增事件
  const handleAddEvent = () => {
    setCurrentEvent(null);
    eventForm.resetFields();
    setEventModalVisible(true);
  };

  // 编辑事件
  const handleEditEvent = (record: EventData) => {
    setCurrentEvent(record);
    eventForm.setFieldsValue(record);
    setEventModalVisible(true);
  };

  // 保存事件
  const handleSaveEvent = async () => {
    try {
      await eventForm.validateFields();
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
  const handleViewDetail = (record: EventData) => {
    setCurrentEvent(record);
    setDetailModalVisible(true);
  };

  // 处理事件
  const handleProcessEvent = (record: EventData) => {
    setCurrentEvent(record);
    handleForm.setFieldsValue({
      handler: record.handler || '',
      result: record.result || ''
    });
    setHandleModalVisible(true);
  };

  // 保存处理结果
  const handleSaveProcess = async () => {
    try {
      await handleForm.validateFields();
      message.success('事件处理结果保存成功');
      setHandleModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 删除确认
  const handleDelete = (record: EventData) => {
    setDeleteTarget(record);
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

  // 表格列定义
  const columns = [
    {
      title: '事件编号',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: '事件标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    {
      title: '事件类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => {
        const color = 
          type === '基础设施' ? 'blue' : 
          type === '安全隐患' ? 'red' : 
          type === '矛盾纠纷' ? 'orange' : 'green';
        return <Tag color={color}>{type}</Tag>;
      }
    },
    {
      title: '地点',
      dataIndex: 'location',
      key: 'location',
      width: 200,
      ellipsis: true,
    },
    {
      title: '报告人',
      dataIndex: 'reporter',
      key: 'reporter',
      width: 120,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
    },
    {
      title: '报告时间',
      dataIndex: 'date',
      key: 'date',
      width: 150,
      sorter: (a: EventData, b: EventData) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        let color = 'default';
        let icon = null;
        if (status === '待处理') {
          color = 'red';
          icon = <ExclamationCircleOutlined />;
        } else if (status === '处理中') {
          color = 'processing';
          icon = <ClockCircleOutlined />;
        } else if (status === '已处理') {
          color = 'success';
          icon = <CheckCircleOutlined />;
        }
        
        return <Tag color={color} icon={icon}>{status}</Tag>;
      }
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      render: (priority: string) => {
        let color = 'default';
        if (priority === '高') color = 'red';
        if (priority === '中') color = 'orange';
        if (priority === '低') color = 'green';
        
        return <Tag color={color}>{priority}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: unknown, record: EventData) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>查看</Button>
          </Tooltip>
          <Tooltip title="编辑事件">
            <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEditEvent(record)}>编辑</Button>
          </Tooltip>
          {record.status !== '已处理' && (
            <Tooltip title="处理事件">
              <Button type="text" size="small" icon={<CheckCircleOutlined />} onClick={() => handleProcessEvent(record)}>处理</Button>
            </Tooltip>
          )}
          <Tooltip title="删除事件">
            <Popconfirm
              title="确定要删除这个事件吗？"
              onConfirm={() => handleDelete(record)}
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

  // 统计数据
  const totalEvents = eventData.length;
  const pendingEvents = eventData.filter(e => e.status === '待处理').length;
  const processingEvents = eventData.filter(e => e.status === '处理中').length;
  const completedEvents = eventData.filter(e => e.status === '已处理').length;
  const highPriorityEvents = eventData.filter(e => e.priority === '高').length;

  return (
    <div className="event-container">
      <h1>事件管理</h1>
      
      <Row gutter={[16, 16]} className="stat-overview">
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic 
              title="事件总数" 
              value={totalEvents} 
              prefix={<AlertOutlined />} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic 
              title="待处理事件" 
              value={pendingEvents} 
              prefix={<ExclamationCircleOutlined />} 
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic 
              title="处理中事件" 
              value={processingEvents} 
              prefix={<ClockCircleOutlined />} 
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic 
              title="已完成事件" 
              value={completedEvents} 
              prefix={<CheckCircleOutlined />} 
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="stat-overview">
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic 
              title="高优先级事件" 
              value={highPriorityEvents} 
              prefix={<SafetyOutlined />} 
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic 
              title="基础设施类" 
              value={eventData.filter(e => e.type === '基础设施').length} 
              prefix={<FileTextOutlined />} 
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic 
              title="安全隐患类" 
              value={eventData.filter(e => e.type === '安全隐患').length} 
              prefix={<SafetyOutlined />} 
              valueStyle={{ color: '#fa541c' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic 
              title="矛盾纠纷类" 
              value={eventData.filter(e => e.type === '矛盾纠纷').length} 
              prefix={<AlertOutlined />} 
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
      </Row>

      <Card className="table-card">
        <div className="table-actions" style={{ marginBottom: 16 }}>
          <Input.Group compact>
            <Input 
              placeholder="搜索事件标题、地点、报告人..." 
              onChange={e => setSearchText(e.target.value)} 
              style={{ width: 250 }}
              prefix={<AlertOutlined />}
            />
            <Select 
              defaultValue="all" 
              style={{ width: 120 }} 
              onChange={value => setFilterType(value)}
            >
              <Option value="all">全部类型</Option>
              <Option value="基础设施">基础设施</Option>
              <Option value="安全隐患">安全隐患</Option>
              <Option value="矛盾纠纷">矛盾纠纷</Option>
            </Select>
            <Select 
              defaultValue="all" 
              style={{ width: 120 }} 
              onChange={value => setFilterStatus(value)}
            >
              <Option value="all">全部状态</Option>
              <Option value="待处理">待处理</Option>
              <Option value="处理中">处理中</Option>
              <Option value="已处理">已处理</Option>
            </Select>
            <Select 
              defaultValue="all" 
              style={{ width: 100 }} 
              onChange={value => setFilterPriority(value)}
            >
              <Option value="all">全部优先级</Option>
              <Option value="高">高</Option>
              <Option value="中">中</Option>
              <Option value="低">低</Option>
            </Select>
          </Input.Group>
          <div>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddEvent}>新增事件</Button>
            <Button icon={<UploadOutlined />} onClick={handleImport}>批量导入</Button>
            <Button icon={<DownloadOutlined />} onClick={handleExport}>导出数据</Button>
          </div>
        </div>
        
        <Table 
          columns={columns} 
          dataSource={getFilteredData()}
          rowKey="key"
          pagination={{
            pageSize: 20,
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 事件弹窗 */}
      <Modal
        title={currentEvent ? '编辑事件' : '新增事件'}
        open={eventModalVisible}
        onOk={handleSaveEvent}
        onCancel={() => setEventModalVisible(false)}
        width={800}
      >
        <Form form={eventForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="title" label="事件标题" rules={[{ required: true, message: '请输入事件标题' }]}>
                <Input placeholder="请输入事件标题" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="type" label="事件类型" rules={[{ required: true, message: '请选择事件类型' }]}>
                <Select placeholder="请选择事件类型">
                  <Option value="基础设施">基础设施</Option>
                  <Option value="安全隐患">安全隐患</Option>
                  <Option value="矛盾纠纷">矛盾纠纷</Option>
                  <Option value="环境卫生">环境卫生</Option>
                  <Option value="其他">其他</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="location" label="事件地点" rules={[{ required: true, message: '请输入事件地点' }]}>
                <Input placeholder="请输入事件地点" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="priority" label="优先级" rules={[{ required: true, message: '请选择优先级' }]}>
                <Select placeholder="请选择优先级">
                  <Option value="高">高</Option>
                  <Option value="中">中</Option>
                  <Option value="低">低</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="reporter" label="报告人" rules={[{ required: true, message: '请输入报告人姓名' }]}>
                <Input placeholder="请输入报告人姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="联系电话" rules={[{ required: true, message: '请输入联系电话' }]}>
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="事件描述">
            <TextArea rows={3} placeholder="请输入事件详细描述" />
          </Form.Item>
          <Form.Item name="gridId" label="所属网格">
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
        title="事件详细信息"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>关闭</Button>
        ]}
        width={600}
      >
        {currentEvent && (
          <div>
            <h3>基本信息</h3>
            <Row gutter={16}>
              <Col span={12}>
                <p><strong>事件编号：</strong>{currentEvent.id}</p>
                <p><strong>事件标题：</strong>{currentEvent.title}</p>
                <p><strong>事件类型：</strong>{currentEvent.type}</p>
                <p><strong>事件地点：</strong>{currentEvent.location}</p>
                <p><strong>报告人：</strong>{currentEvent.reporter}</p>
                <p><strong>联系电话：</strong>{currentEvent.phone}</p>
              </Col>
              <Col span={12}>
                <p><strong>报告时间：</strong>{currentEvent.date}</p>
                <p><strong>事件状态：</strong>{currentEvent.status}</p>
                <p><strong>优先级：</strong>{currentEvent.priority}</p>
                {currentEvent.handler && <p><strong>处理人：</strong>{currentEvent.handler}</p>}
                {currentEvent.handleTime && <p><strong>处理时间：</strong>{currentEvent.handleTime}</p>}
                {currentEvent.gridId && <p><strong>所属网格：</strong>网格{currentEvent.gridId}</p>}
              </Col>
            </Row>
            {currentEvent.description && (
              <div>
                <h4>事件描述</h4>
                <p>{currentEvent.description}</p>
              </div>
            )}
            {currentEvent.result && (
              <div>
                <h4>处理结果</h4>
                <p>{currentEvent.result}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 处理事件弹窗 */}
      <Modal
        title="处理事件"
        open={handleModalVisible}
        onOk={handleSaveProcess}
        onCancel={() => setHandleModalVisible(false)}
        width={600}
      >
        <Form form={handleForm} layout="vertical">
          <Form.Item name="handler" label="处理人" rules={[{ required: true, message: '请输入处理人姓名' }]}>
            <Input placeholder="请输入处理人姓名" />
          </Form.Item>
          <Form.Item name="result" label="处理结果" rules={[{ required: true, message: '请输入处理结果' }]}>
            <TextArea rows={4} placeholder="请输入事件处理结果" />
          </Form.Item>
        </Form>
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
        <p>确定要删除事件 "{deleteTarget?.title}" 吗？</p>
        <p>删除后将无法恢复，请谨慎操作。</p>
      </Modal>
    </div>
  );
};

export default Event; 