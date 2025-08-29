import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Button,
  message,
  Table,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Tabs,
  Descriptions,
  Timeline,
  Progress,
  Alert,
  Switch,
  Tree,
  Badge,
  Tooltip,
  Popconfirm,
  Avatar,
  InputNumber,
  Divider,
  Typography
} from 'antd';
import {
  ApiOutlined,
  SettingOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownloadOutlined,
  UploadOutlined,
  DatabaseOutlined,
  CloudOutlined,
  WifiOutlined,
  CameraOutlined,
  LockOutlined,
  UnlockOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import './InterfaceIntegration.less';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

interface HardwareTerminal {
  id: string;
  name: string;
  type: '门禁' | '监控' | '照明' | '消防' | '环境' | '电梯' | '停车' | '访客' | '能源' | '垃圾' | '健身' | '游乐';
  status: 'online' | 'offline' | 'error';
  ip: string;
  port: number;
  protocol: string;
  lastHeartbeat: string;
  version: string;
  location: string;
  description: string;
}

interface ApiInterface {
  id: string;
  name: string;
  endpoint: string;
  method: string;
  status: 'active' | 'inactive' | 'testing';
  responseTime: number;
  successRate: number;
  lastTest: string;
  description: string;
  version: string;
}

interface PropertyPlatform {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'disconnected' | 'error';
  apiCount: number;
  lastSync: string;
  syncStatus: 'success' | 'failed' | 'pending';
  description: string;
}

const InterfaceIntegration: React.FC = () => {
  const [hardwareTerminals, setHardwareTerminals] = useState<HardwareTerminal[]>(() => {
    const terminals: HardwareTerminal[] = [];
    let id = 1;
    
    // 门禁系统 - 50个
    for (let i = 1; i <= 50; i++) {
      terminals.push({
        id: (id++).toString(),
        name: `门禁系统-${i.toString().padStart(2, '0')}`,
        type: '门禁',
        status: Math.random() > 0.1 ? 'online' : (Math.random() > 0.5 ? 'offline' : 'error'),
        ip: `192.168.1.${100 + i}`,
        port: 8080 + i,
        protocol: 'HTTP',
        lastHeartbeat: new Date(Date.now() - Math.random() * 3600000).toLocaleString(),
        version: 'v2.1.0',
        location: `${Math.ceil(i/10)}号楼${i%10 === 0 ? 10 : i%10}单元`,
        description: `${Math.ceil(i/10)}号楼${i%10 === 0 ? 10 : i%10}单元门禁系统`
      });
    }
    
    // 监控摄像头 - 80个
    for (let i = 1; i <= 80; i++) {
      terminals.push({
        id: (id++).toString(),
        name: `监控摄像头-${i.toString().padStart(2, '0')}`,
        type: '监控',
        status: Math.random() > 0.05 ? 'online' : (Math.random() > 0.5 ? 'offline' : 'error'),
        ip: `192.168.2.${100 + i}`,
        port: 9000 + i,
        protocol: 'RTSP',
        lastHeartbeat: new Date(Date.now() - Math.random() * 1800000).toLocaleString(),
        version: 'v1.8.5',
        location: i <= 20 ? '小区广场' : i <= 40 ? '小区主干道' : i <= 60 ? '小区后路' : '小区侧路',
        description: `${i <= 20 ? '小区广场' : i <= 40 ? '小区主干道' : i <= 60 ? '小区后路' : '小区侧路'}监控摄像头`
      });
    }
    
    // 路灯控制器 - 60个
    for (let i = 1; i <= 60; i++) {
      terminals.push({
        id: (id++).toString(),
        name: `路灯控制器-${i.toString().padStart(2, '0')}`,
        type: '照明',
        status: Math.random() > 0.15 ? 'online' : (Math.random() > 0.5 ? 'offline' : 'error'),
        ip: `192.168.3.${100 + i}`,
        port: 10000 + i,
        protocol: 'MQTT',
        lastHeartbeat: new Date(Date.now() - Math.random() * 7200000).toLocaleString(),
        version: 'v1.5.2',
        location: `${Math.ceil(i/15)}号路段`,
        description: `${Math.ceil(i/15)}号路段路灯控制器`
      });
    }
    
    // 消防报警器 - 40个
    for (let i = 1; i <= 40; i++) {
      terminals.push({
        id: (id++).toString(),
        name: `消防报警器-${i.toString().padStart(2, '0')}`,
        type: '消防',
        status: Math.random() > 0.02 ? 'online' : (Math.random() > 0.5 ? 'offline' : 'error'),
        ip: `192.168.4.${100 + i}`,
        port: 11000 + i,
        protocol: 'HTTP',
        lastHeartbeat: new Date(Date.now() - Math.random() * 1800000).toLocaleString(),
        version: 'v1.9.0',
        location: `${Math.ceil(i/8)}号楼${i%8 === 0 ? 8 : i%8}层`,
        description: `${Math.ceil(i/8)}号楼${i%8 === 0 ? 8 : i%8}层消防报警系统`
      });
    }
    
    // 环境监测器 - 30个
    for (let i = 1; i <= 30; i++) {
      terminals.push({
        id: (id++).toString(),
        name: `环境监测器-${i.toString().padStart(2, '0')}`,
        type: '环境',
        status: Math.random() > 0.08 ? 'online' : (Math.random() > 0.5 ? 'offline' : 'error'),
        ip: `192.168.5.${100 + i}`,
        port: 12000 + i,
        protocol: 'MQTT',
        lastHeartbeat: new Date(Date.now() - Math.random() * 3600000).toLocaleString(),
        version: 'v1.6.1',
        location: i <= 10 ? '小区花园' : i <= 20 ? '小区广场' : '小区周边',
        description: `${i <= 10 ? '小区花园' : i <= 20 ? '小区广场' : '小区周边'}环境监测系统`
      });
    }
    
    // 电梯监控 - 25个
    for (let i = 1; i <= 25; i++) {
      terminals.push({
        id: (id++).toString(),
        name: `电梯监控-${i.toString().padStart(2, '0')}`,
        type: '电梯',
        status: Math.random() > 0.03 ? 'online' : (Math.random() > 0.5 ? 'offline' : 'error'),
        ip: `192.168.6.${100 + i}`,
        port: 13000 + i,
        protocol: 'HTTP',
        lastHeartbeat: new Date(Date.now() - Math.random() * 900000).toLocaleString(),
        version: 'v2.0.1',
        location: `${Math.ceil(i/5)}号楼电梯`,
        description: `${Math.ceil(i/5)}号楼电梯监控系统`
      });
    }
    
    // 停车场管理 - 20个
    for (let i = 1; i <= 20; i++) {
      terminals.push({
        id: (id++).toString(),
        name: `停车场管理-${i.toString().padStart(2, '0')}`,
        type: '停车',
        status: Math.random() > 0.05 ? 'online' : (Math.random() > 0.5 ? 'offline' : 'error'),
        ip: `192.168.7.${100 + i}`,
        port: 14000 + i,
        protocol: 'HTTP',
        lastHeartbeat: new Date(Date.now() - Math.random() * 1800000).toLocaleString(),
        version: 'v1.7.3',
        location: `${Math.ceil(i/10)}号停车场`,
        description: `${Math.ceil(i/10)}号停车场管理系统`
      });
    }
    
    // 访客登记 - 15个
    for (let i = 1; i <= 15; i++) {
      terminals.push({
        id: (id++).toString(),
        name: `访客登记-${i.toString().padStart(2, '0')}`,
        type: '访客',
        status: Math.random() > 0.1 ? 'online' : (Math.random() > 0.5 ? 'offline' : 'error'),
        ip: `192.168.8.${100 + i}`,
        port: 15000 + i,
        protocol: 'HTTP',
        lastHeartbeat: new Date(Date.now() - Math.random() * 3600000).toLocaleString(),
        version: 'v1.4.2',
        location: `${Math.ceil(i/5)}号楼大厅`,
        description: `${Math.ceil(i/5)}号楼访客登记系统`
      });
    }
    
    // 能源管理 - 25个
    for (let i = 1; i <= 25; i++) {
      terminals.push({
        id: (id++).toString(),
        name: `能源管理-${i.toString().padStart(2, '0')}`,
        type: '能源',
        status: Math.random() > 0.05 ? 'online' : (Math.random() > 0.5 ? 'offline' : 'error'),
        ip: `192.168.9.${100 + i}`,
        port: 16000 + i,
        protocol: 'MQTT',
        lastHeartbeat: new Date(Date.now() - Math.random() * 7200000).toLocaleString(),
        version: 'v1.8.0',
        location: `${Math.ceil(i/5)}号楼配电室`,
        description: `${Math.ceil(i/5)}号楼能源管理系统`
      });
    }
    
    // 垃圾回收 - 10个
    for (let i = 1; i <= 10; i++) {
      terminals.push({
        id: (id++).toString(),
        name: `垃圾回收-${i.toString().padStart(2, '0')}`,
        type: '垃圾',
        status: Math.random() > 0.1 ? 'online' : (Math.random() > 0.5 ? 'offline' : 'error'),
        ip: `192.168.10.${100 + i}`,
        port: 17000 + i,
        protocol: 'HTTP',
        lastHeartbeat: new Date(Date.now() - Math.random() * 3600000).toLocaleString(),
        version: 'v1.3.1',
        location: `${i}号垃圾回收点`,
        description: `${i}号垃圾回收点管理系统`
      });
    }
    
    // 健身设施 - 8个
    for (let i = 1; i <= 8; i++) {
      terminals.push({
        id: (id++).toString(),
        name: `健身设施-${i.toString().padStart(2, '0')}`,
        type: '健身',
        status: Math.random() > 0.15 ? 'online' : (Math.random() > 0.5 ? 'offline' : 'error'),
        ip: `192.168.11.${100 + i}`,
        port: 18000 + i,
        protocol: 'HTTP',
        lastHeartbeat: new Date(Date.now() - Math.random() * 7200000).toLocaleString(),
        version: 'v1.2.0',
        location: `${i}号健身区`,
        description: `${i}号健身区管理系统`
      });
    }
    
    // 儿童游乐 - 5个
    for (let i = 1; i <= 5; i++) {
      terminals.push({
        id: (id++).toString(),
        name: `儿童游乐-${i.toString().padStart(2, '0')}`,
        type: '游乐',
        status: Math.random() > 0.1 ? 'online' : (Math.random() > 0.5 ? 'offline' : 'error'),
        ip: `192.168.12.${100 + i}`,
        port: 19000 + i,
        protocol: 'HTTP',
        lastHeartbeat: new Date(Date.now() - Math.random() * 7200000).toLocaleString(),
        version: 'v1.1.5',
        location: `${i}号儿童游乐区`,
        description: `${i}号儿童游乐区管理系统`
      });
    }
    
    return terminals;
  });

  const [apiInterfaces, setApiInterfaces] = useState<ApiInterface[]>(() => {
    const interfaces: ApiInterface[] = [];
    let id = 1;
    
    // 门禁相关接口 - 15个
    for (let i = 1; i <= 15; i++) {
      interfaces.push({
        id: (id++).toString(),
        name: `门禁${i === 1 ? '状态查询' : i === 2 ? '权限验证' : i === 3 ? '记录查询' : i === 4 ? '远程开门' : i === 5 ? '访客登记' : i === 6 ? '黑名单管理' : i === 7 ? '时间段设置' : i === 8 ? '报警处理' : i === 9 ? '统计报表' : i === 10 ? '设备配置' : i === 11 ? '用户管理' : i === 12 ? '权限分配' : i === 13 ? '日志查询' : i === 14 ? '系统状态' : '设备监控'}`,
        endpoint: `/api/access/${i === 1 ? 'status' : i === 2 ? 'auth' : i === 3 ? 'records' : i === 4 ? 'open' : i === 5 ? 'visitor' : i === 6 ? 'blacklist' : i === 7 ? 'schedule' : i === 8 ? 'alarm' : i === 9 ? 'stats' : i === 10 ? 'config' : i === 11 ? 'users' : i === 12 ? 'permissions' : i === 13 ? 'logs' : i === 14 ? 'system' : 'monitor'}`,
        method: i === 4 || i === 5 || i === 6 || i === 7 || i === 10 || i === 11 || i === 12 ? 'POST' : 'GET',
        status: Math.random() > 0.1 ? 'active' : (Math.random() > 0.5 ? 'inactive' : 'testing'),
        responseTime: Math.floor(Math.random() * 200) + 50,
        successRate: Math.random() > 0.1 ? 95 + Math.random() * 5 : 80 + Math.random() * 15,
        lastTest: new Date(Date.now() - Math.random() * 7200000).toLocaleString(),
        description: `门禁系统${i === 1 ? '状态查询' : i === 2 ? '权限验证' : i === 3 ? '记录查询' : i === 4 ? '远程开门' : i === 5 ? '访客登记' : i === 6 ? '黑名单管理' : i === 7 ? '时间段设置' : i === 8 ? '报警处理' : i === 9 ? '统计报表' : i === 10 ? '设备配置' : i === 11 ? '用户管理' : i === 12 ? '权限分配' : i === 13 ? '日志查询' : i === 14 ? '系统状态' : '设备监控'}接口`,
        version: 'v1.0'
      });
    }
    
    // 监控相关接口 - 20个
    for (let i = 1; i <= 20; i++) {
      interfaces.push({
        id: (id++).toString(),
        name: `监控${i === 1 ? '视频流' : i === 2 ? '录像回放' : i === 3 ? '云台控制' : i === 4 ? '预置位设置' : i === 5 ? '报警联动' : i === 6 ? '人脸识别' : i === 7 ? '车牌识别' : i === 8 ? '行为分析' : i === 9 ? '设备状态' : i === 10 ? '配置管理' : i === 11 ? '存储管理' : i === 12 ? '网络配置' : i === 13 ? '用户权限' : i === 14 ? '日志查询' : i === 15 ? '统计报表' : i === 16 ? '系统维护' : i === 17 ? '备份恢复' : i === 18 ? '升级管理' : i === 19 ? '性能监控' : '故障诊断'}`,
        endpoint: `/api/camera/${i === 1 ? 'stream' : i === 2 ? 'playback' : i === 3 ? 'ptz' : i === 4 ? 'preset' : i === 5 ? 'alarm' : i === 6 ? 'face' : i === 7 ? 'plate' : i === 8 ? 'behavior' : i === 9 ? 'status' : i === 10 ? 'config' : i === 11 ? 'storage' : i === 12 ? 'network' : i === 13 ? 'permissions' : i === 14 ? 'logs' : i === 15 ? 'stats' : i === 16 ? 'maintenance' : i === 17 ? 'backup' : i === 18 ? 'upgrade' : i === 19 ? 'performance' : 'diagnosis'}`,
        method: i === 3 || i === 4 || i === 5 || i === 10 || i === 12 || i === 16 || i === 17 || i === 18 ? 'POST' : 'GET',
        status: Math.random() > 0.05 ? 'active' : (Math.random() > 0.5 ? 'inactive' : 'testing'),
        responseTime: Math.floor(Math.random() * 300) + 30,
        successRate: Math.random() > 0.05 ? 95 + Math.random() * 5 : 80 + Math.random() * 15,
        lastTest: new Date(Date.now() - Math.random() * 3600000).toLocaleString(),
        description: `监控系统${i === 1 ? '视频流' : i === 2 ? '录像回放' : i === 3 ? '云台控制' : i === 4 ? '预置位设置' : i === 5 ? '报警联动' : i === 6 ? '人脸识别' : i === 7 ? '车牌识别' : i === 8 ? '行为分析' : i === 9 ? '设备状态' : i === 10 ? '配置管理' : i === 11 ? '存储管理' : i === 12 ? '网络配置' : i === 13 ? '用户权限' : i === 14 ? '日志查询' : i === 15 ? '统计报表' : i === 16 ? '系统维护' : i === 17 ? '备份恢复' : i === 18 ? '升级管理' : i === 19 ? '性能监控' : '故障诊断'}接口`,
        version: 'v1.0'
      });
    }
    
    // 照明相关接口 - 12个
    for (let i = 1; i <= 12; i++) {
      interfaces.push({
        id: (id++).toString(),
        name: `照明${i === 1 ? '开关控制' : i === 2 ? '亮度调节' : i === 3 ? '定时设置' : i === 4 ? '场景模式' : i === 5 ? '分组控制' : i === 6 ? '状态查询' : i === 7 ? '能耗统计' : i === 8 ? '故障检测' : i === 9 ? '维护提醒' : i === 10 ? '配置管理' : i === 11 ? '用户权限' : '日志查询'}`,
        endpoint: `/api/lighting/${i === 1 ? 'control' : i === 2 ? 'brightness' : i === 3 ? 'timer' : i === 4 ? 'scene' : i === 5 ? 'group' : i === 6 ? 'status' : i === 7 ? 'energy' : i === 8 ? 'fault' : i === 9 ? 'maintenance' : i === 10 ? 'config' : i === 11 ? 'permissions' : 'logs'}`,
        method: i === 1 || i === 2 || i === 3 || i === 4 || i === 5 || i === 10 || i === 11 ? 'POST' : 'GET',
        status: Math.random() > 0.15 ? 'active' : (Math.random() > 0.5 ? 'inactive' : 'testing'),
        responseTime: Math.floor(Math.random() * 150) + 100,
        successRate: Math.random() > 0.15 ? 95 + Math.random() * 5 : 80 + Math.random() * 15,
        lastTest: new Date(Date.now() - Math.random() * 7200000).toLocaleString(),
        description: `照明系统${i === 1 ? '开关控制' : i === 2 ? '亮度调节' : i === 3 ? '定时设置' : i === 4 ? '场景模式' : i === 5 ? '分组控制' : i === 6 ? '状态查询' : i === 7 ? '能耗统计' : i === 8 ? '故障检测' : i === 9 ? '维护提醒' : i === 10 ? '配置管理' : i === 11 ? '用户权限' : '日志查询'}接口`,
        version: 'v1.0'
      });
    }
    
    // 消防相关接口 - 10个
    for (let i = 1; i <= 10; i++) {
      interfaces.push({
        id: (id++).toString(),
        name: `消防${i === 1 ? '报警查询' : i === 2 ? '设备状态' : i === 3 ? '联动控制' : i === 4 ? '疏散指引' : i === 5 ? '应急预案' : i === 6 ? '统计报表' : i === 7 ? '维护管理' : i === 8 ? '用户权限' : i === 9 ? '日志查询' : '系统配置'}`,
        endpoint: `/api/fire/${i === 1 ? 'alarm' : i === 2 ? 'status' : i === 3 ? 'control' : i === 4 ? 'evacuation' : i === 5 ? 'emergency' : i === 6 ? 'stats' : i === 7 ? 'maintenance' : i === 8 ? 'permissions' : i === 9 ? 'logs' : 'config'}`,
        method: i === 3 || i === 4 || i === 5 || i === 7 || i === 8 ? 'POST' : 'GET',
        status: Math.random() > 0.02 ? 'active' : (Math.random() > 0.5 ? 'inactive' : 'testing'),
        responseTime: Math.floor(Math.random() * 100) + 50,
        successRate: Math.random() > 0.02 ? 98 + Math.random() * 2 : 90 + Math.random() * 8,
        lastTest: new Date(Date.now() - Math.random() * 1800000).toLocaleString(),
        description: `消防系统${i === 1 ? '报警查询' : i === 2 ? '设备状态' : i === 3 ? '联动控制' : i === 4 ? '疏散指引' : i === 5 ? '应急预案' : i === 6 ? '统计报表' : i === 7 ? '维护管理' : i === 8 ? '用户权限' : i === 9 ? '日志查询' : '系统配置'}接口`,
        version: 'v1.0'
      });
    }
    
    // 环境相关接口 - 8个
    for (let i = 1; i <= 8; i++) {
      interfaces.push({
        id: (id++).toString(),
        name: `环境${i === 1 ? '数据获取' : i === 2 ? '阈值设置' : i === 3 ? '报警管理' : i === 4 ? '历史查询' : i === 5 ? '统计分析' : i === 6 ? '设备配置' : i === 7 ? '用户权限' : '日志查询'}`,
        endpoint: `/api/environment/${i === 1 ? 'data' : i === 2 ? 'threshold' : i === 3 ? 'alarm' : i === 4 ? 'history' : i === 5 ? 'analysis' : i === 6 ? 'config' : i === 7 ? 'permissions' : 'logs'}`,
        method: i === 2 || i === 3 || i === 6 || i === 7 ? 'POST' : 'GET',
        status: Math.random() > 0.08 ? 'active' : (Math.random() > 0.5 ? 'inactive' : 'testing'),
        responseTime: Math.floor(Math.random() * 200) + 100,
        successRate: Math.random() > 0.08 ? 95 + Math.random() * 5 : 80 + Math.random() * 15,
        lastTest: new Date(Date.now() - Math.random() * 3600000).toLocaleString(),
        description: `环境监测${i === 1 ? '数据获取' : i === 2 ? '阈值设置' : i === 3 ? '报警管理' : i === 4 ? '历史查询' : i === 5 ? '统计分析' : i === 6 ? '设备配置' : i === 7 ? '用户权限' : '日志查询'}接口`,
        version: 'v1.0'
      });
    }
    
    // 其他系统接口 - 25个
    const otherSystems = [
      { name: '电梯监控', prefix: 'elevator', count: 8 },
      { name: '停车场管理', prefix: 'parking', count: 6 },
      { name: '访客管理', prefix: 'visitor', count: 5 },
      { name: '能源管理', prefix: 'energy', count: 6 }
    ];
    
    otherSystems.forEach(system => {
      for (let i = 1; i <= system.count; i++) {
        interfaces.push({
          id: (id++).toString(),
          name: `${system.name}-${i === 1 ? '状态查询' : i === 2 ? '控制操作' : i === 3 ? '配置管理' : i === 4 ? '统计报表' : i === 5 ? '用户权限' : '日志查询'}`,
          endpoint: `/api/${system.prefix}/${i === 1 ? 'status' : i === 2 ? 'control' : i === 3 ? 'config' : i === 4 ? 'stats' : i === 5 ? 'permissions' : 'logs'}`,
          method: i === 2 || i === 3 || i === 5 ? 'POST' : 'GET',
          status: Math.random() > 0.1 ? 'active' : (Math.random() > 0.5 ? 'inactive' : 'testing'),
          responseTime: Math.floor(Math.random() * 250) + 100,
          successRate: Math.random() > 0.1 ? 95 + Math.random() * 5 : 80 + Math.random() * 15,
          lastTest: new Date(Date.now() - Math.random() * 7200000).toLocaleString(),
          description: `${system.name}系统${i === 1 ? '状态查询' : i === 2 ? '控制操作' : i === 3 ? '配置管理' : i === 4 ? '统计报表' : i === 5 ? '用户权限' : '日志查询'}接口`,
          version: 'v1.0'
        });
      }
    });
    
    return interfaces;
  });

  const [propertyPlatforms, setPropertyPlatforms] = useState<PropertyPlatform[]>(() => {
    const platforms: PropertyPlatform[] = [];
    let id = 1;
    
    // 内部系统 - 25个
    const internalSystems = [
      { name: '物业管理系统', apiCount: 25, description: '物业公司核心管理系统' },
      { name: '财务管理系统', apiCount: 18, description: '物业财务收支管理系统' },
      { name: '维修工单系统', apiCount: 15, description: '维修工单流程管理系统' },
      { name: '安防监控系统', apiCount: 30, description: '安防监控综合管理系统' },
      { name: '人力资源系统', apiCount: 12, description: '员工人事管理系统' },
      { name: '采购管理系统', apiCount: 10, description: '物资采购管理系统' },
      { name: '库存管理系统', apiCount: 8, description: '物资库存管理系统' },
      { name: '合同管理系统', apiCount: 14, description: '合同文档管理系统' },
      { name: '档案管理系统', apiCount: 6, description: '档案资料管理系统' },
      { name: '会议管理系统', apiCount: 5, description: '会议安排管理系统' },
      { name: '通知公告系统', apiCount: 7, description: '通知公告发布系统' },
      { name: '投诉建议系统', apiCount: 9, description: '业主投诉建议系统' },
      { name: '满意度调查系统', apiCount: 4, description: '业主满意度调查系统' },
      { name: '活动管理系统', apiCount: 6, description: '社区活动管理系统' },
      { name: '设备管理系统', apiCount: 20, description: '设备维护管理系统' },
      { name: '绿化管理系统', apiCount: 8, description: '绿化养护管理系统' },
      { name: '清洁管理系统', apiCount: 7, description: '清洁服务管理系统' },
      { name: '安保管理系统', apiCount: 12, description: '安保人员管理系统' },
      { name: '车辆管理系统', apiCount: 10, description: '车辆进出管理系统' },
      { name: '访客管理系统', apiCount: 8, description: '访客登记管理系统' },
      { name: '门禁管理系统', apiCount: 15, description: '门禁权限管理系统' },
      { name: '电梯管理系统', apiCount: 12, description: '电梯运行管理系统' },
      { name: '消防管理系统', apiCount: 16, description: '消防设施管理系统' },
      { name: '能源管理系统', apiCount: 14, description: '水电气暖管理系统' },
      { name: '垃圾管理系统', apiCount: 6, description: '垃圾分类管理系统' },
      { name: '健身管理系统', apiCount: 4, description: '健身设施管理系统' },
      { name: '儿童游乐系统', apiCount: 3, description: '儿童游乐设施系统' }
    ];
    
    internalSystems.forEach((system, index) => {
      platforms.push({
        id: (id++).toString(),
        name: system.name,
        type: '内部系统',
        status: Math.random() > 0.05 ? 'connected' : (Math.random() > 0.5 ? 'disconnected' : 'error'),
        apiCount: system.apiCount,
        lastSync: new Date(Date.now() - Math.random() * 7200000).toLocaleString(),
        syncStatus: Math.random() > 0.05 ? 'success' : (Math.random() > 0.5 ? 'failed' : 'pending'),
        description: system.description
      });
    });
    
    // 外部系统 - 15个
    const externalSystems = [
      { name: '业主服务平台', apiCount: 12, description: '面向业主的移动服务平台' },
      { name: '业主APP系统', apiCount: 8, description: '业主手机应用系统' },
      { name: '微信小程序', apiCount: 6, description: '微信小程序服务平台' },
      { name: '支付宝生活号', apiCount: 5, description: '支付宝生活服务平台' },
      { name: '业主网站系统', apiCount: 10, description: '业主Web服务平台' },
      { name: '业主论坛系统', apiCount: 4, description: '业主交流论坛系统' },
      { name: '业主投票系统', apiCount: 3, description: '业主投票表决系统' },
      { name: '业主投诉系统', apiCount: 7, description: '业主投诉处理系统' },
      { name: '业主建议系统', apiCount: 5, description: '业主建议收集系统' },
      { name: '业主评价系统', apiCount: 4, description: '业主服务评价系统' },
      { name: '业主通知系统', apiCount: 6, description: '业主通知推送系统' },
      { name: '业主缴费系统', apiCount: 8, description: '业主在线缴费系统' },
      { name: '业主报修系统', apiCount: 9, description: '业主在线报修系统' },
      { name: '业主预约系统', apiCount: 5, description: '业主服务预约系统' },
      { name: '业主积分系统', apiCount: 4, description: '业主积分奖励系统' }
    ];
    
    externalSystems.forEach((system, index) => {
      platforms.push({
        id: (id++).toString(),
        name: system.name,
        type: '外部系统',
        status: Math.random() > 0.1 ? 'connected' : (Math.random() > 0.5 ? 'disconnected' : 'error'),
        apiCount: system.apiCount,
        lastSync: new Date(Date.now() - Math.random() * 10800000).toLocaleString(),
        syncStatus: Math.random() > 0.1 ? 'success' : (Math.random() > 0.5 ? 'failed' : 'pending'),
        description: system.description
      });
    });
    
    // 第三方系统 - 20个
    const thirdPartySystems = [
      { name: '停车管理系统', apiCount: 8, description: '第三方停车管理平台' },
      { name: '能源管理平台', apiCount: 12, description: '第三方能源管理平台' },
      { name: '安防监控平台', apiCount: 25, description: '第三方安防监控平台' },
      { name: '门禁管理平台', apiCount: 18, description: '第三方门禁管理平台' },
      { name: '电梯监控平台', apiCount: 15, description: '第三方电梯监控平台' },
      { name: '消防管理平台', apiCount: 20, description: '第三方消防管理平台' },
      { name: '环境监测平台', apiCount: 10, description: '第三方环境监测平台' },
      { name: '照明控制平台', apiCount: 14, description: '第三方照明控制平台' },
      { name: '垃圾回收平台', apiCount: 6, description: '第三方垃圾回收平台' },
      { name: '健身设施平台', apiCount: 5, description: '第三方健身设施平台' },
      { name: '儿童游乐平台', apiCount: 4, description: '第三方儿童游乐平台' },
      { name: '绿化养护平台', apiCount: 8, description: '第三方绿化养护平台' },
      { name: '清洁服务平台', apiCount: 7, description: '第三方清洁服务平台' },
      { name: '安保服务平台', apiCount: 12, description: '第三方安保服务平台' },
      { name: '维修服务平台', apiCount: 16, description: '第三方维修服务平台' },
      { name: '配送服务平台', apiCount: 9, description: '第三方配送服务平台' },
      { name: '家政服务平台', apiCount: 11, description: '第三方家政服务平台' },
      { name: '医疗服务平台', apiCount: 8, description: '第三方医疗服务平台' },
      { name: '教育服务平台', apiCount: 6, description: '第三方教育服务平台' },
      { name: '金融服务平台', apiCount: 10, description: '第三方金融服务平台' }
    ];
    
    thirdPartySystems.forEach((system, index) => {
      platforms.push({
        id: (id++).toString(),
        name: system.name,
        type: '第三方系统',
        status: Math.random() > 0.08 ? 'connected' : (Math.random() > 0.5 ? 'disconnected' : 'error'),
        apiCount: system.apiCount,
        lastSync: new Date(Date.now() - Math.random() * 14400000).toLocaleString(),
        syncStatus: Math.random() > 0.08 ? 'success' : (Math.random() > 0.5 ? 'failed' : 'pending'),
        description: system.description
      });
    });
    
    return platforms;
  });

  const [selectedTerminal, setSelectedTerminal] = useState<HardwareTerminal | null>(null);
  const [selectedInterface, setSelectedInterface] = useState<ApiInterface | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<PropertyPlatform | null>(null);
  const [isTerminalModalVisible, setIsTerminalModalVisible] = useState(false);
  const [isInterfaceModalVisible, setIsInterfaceModalVisible] = useState(false);
  const [isPlatformModalVisible, setIsPlatformModalVisible] = useState(false);
  const [isTestModalVisible, setIsTestModalVisible] = useState(false);
  const [isAddTerminalModalVisible, setIsAddTerminalModalVisible] = useState(false);
  const [isAddInterfaceModalVisible, setIsAddInterfaceModalVisible] = useState(false);
  const [isAddPlatformModalVisible, setIsAddPlatformModalVisible] = useState(false);
  const [isEditTerminalModalVisible, setIsEditTerminalModalVisible] = useState(false);
  const [isEditInterfaceModalVisible, setIsEditInterfaceModalVisible] = useState(false);
  const [isEditPlatformModalVisible, setIsEditPlatformModalVisible] = useState(false);
  const [testForm] = Form.useForm();
  const [terminalForm] = Form.useForm();
  const [interfaceForm] = Form.useForm();
  const [platformForm] = Form.useForm();
  const [addTerminalForm] = Form.useForm();
  const [addInterfaceForm] = Form.useForm();
  const [addPlatformForm] = Form.useForm();

  // 硬件终端列定义
  const terminalColumns = [
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: HardwareTerminal) => (
        <Space>
          <Avatar icon={<CameraOutlined />} />
          <div>
            <div>{text}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.location}
            </Text>
          </div>
        </Space>
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
             render: (type: string) => {
         const colorMap: Record<string, string> = {
           '门禁': 'blue',
           '监控': 'green',
           '照明': 'orange',
           '消防': 'red',
           '环境': 'cyan',
           '电梯': 'purple',
           '停车': 'geekblue',
           '访客': 'magenta',
           '能源': 'volcano',
           '垃圾': 'lime',
           '健身': 'gold',
           '游乐': 'pink'
         };
         return <Tag color={colorMap[type] || 'default'}>{type}</Tag>;
       }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          online: { text: '在线', color: 'success', icon: <CheckCircleOutlined /> },
          offline: { text: '离线', color: 'default', icon: <CloseCircleOutlined /> },
          error: { text: '错误', color: 'error', icon: <ExclamationCircleOutlined /> }
        };
        const { text, color, icon } = statusMap[status as keyof typeof statusMap];
        return <Badge status={color as any} text={text} />;
      }
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
      render: (ip: string, record: HardwareTerminal) => (
        <Text copyable>{`${ip}:${record.port}`}</Text>
      )
    },
    {
      title: '协议',
      dataIndex: 'protocol',
      key: 'protocol',
      render: (protocol: string) => <Tag color="blue">{protocol}</Tag>
    },
    {
      title: '最后心跳',
      dataIndex: 'lastHeartbeat',
      key: 'lastHeartbeat'
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
      render: (version: string) => <Tag color="green">{version}</Tag>
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: HardwareTerminal) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewTerminal(record)}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditTerminal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个设备吗？"
            onConfirm={() => handleDeleteTerminal(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // API接口列定义
  const interfaceColumns = [
    {
      title: '接口名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: ApiInterface) => (
        <Space>
          <ApiOutlined />
          <div>
            <div>{text}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.description}
            </Text>
          </div>
        </Space>
      )
    },
    {
      title: '端点',
      dataIndex: 'endpoint',
      key: 'endpoint',
      render: (endpoint: string, record: ApiInterface) => (
        <Space>
          <Tag color="blue">{record.method}</Tag>
          <Text copyable>{endpoint}</Text>
        </Space>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          active: { text: '活跃', color: 'success', icon: <CheckCircleOutlined /> },
          inactive: { text: '停用', color: 'default', icon: <CloseCircleOutlined /> },
          testing: { text: '测试中', color: 'processing', icon: <SyncOutlined spin /> }
        };
        const { text, color, icon } = statusMap[status as keyof typeof statusMap];
        return <Badge status={color as any} text={text} />;
      }
    },
    {
      title: '响应时间',
      dataIndex: 'responseTime',
      key: 'responseTime',
      render: (time: number) => (
        <Text>{time}ms</Text>
      )
    },
    {
      title: '成功率',
      dataIndex: 'successRate',
      key: 'successRate',
      render: (rate: number) => (
        <Progress
          percent={rate}
          size="small"
          status={rate >= 99 ? 'success' : rate >= 95 ? 'normal' : 'exception'}
          format={(percent) => `${percent}%`}
        />
      )
    },
    {
      title: '最后测试',
      dataIndex: 'lastTest',
      key: 'lastTest'
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
      render: (version: string) => <Tag color="green">{version}</Tag>
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ApiInterface) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewInterface(record)}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<SyncOutlined />}
            onClick={() => handleTestInterface(record)}
          >
            测试
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditInterface(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个接口吗？"
            onConfirm={() => handleDeleteInterface(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 物业平台列定义
  const platformColumns = [
    {
      title: '平台名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: PropertyPlatform) => (
        <Space>
          <Avatar icon={<CloudOutlined />} />
          <div>
            <div>{text}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.description}
            </Text>
          </div>
        </Space>
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          '内部系统': 'blue',
          '外部系统': 'green',
          '第三方系统': 'orange'
        };
        return <Tag color={colorMap[type] || 'default'}>{type}</Tag>;
      }
    },
    {
      title: '连接状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          connected: { text: '已连接', color: 'success', icon: <CheckCircleOutlined /> },
          disconnected: { text: '未连接', color: 'default', icon: <CloseCircleOutlined /> },
          error: { text: '连接错误', color: 'error', icon: <ExclamationCircleOutlined /> }
        };
        const { text, color, icon } = statusMap[status as keyof typeof statusMap];
        return <Badge status={color as any} text={text} />;
      }
    },
    {
      title: 'API数量',
      dataIndex: 'apiCount',
      key: 'apiCount',
      render: (count: number) => <Badge count={count} style={{ backgroundColor: '#52c41a' }} />
    },
    {
      title: '最后同步',
      dataIndex: 'lastSync',
      key: 'lastSync'
    },
    {
      title: '同步状态',
      dataIndex: 'syncStatus',
      key: 'syncStatus',
      render: (status: string) => {
        const statusMap = {
          success: { text: '成功', color: 'success', icon: <CheckCircleOutlined /> },
          failed: { text: '失败', color: 'error', icon: <CloseCircleOutlined /> },
          pending: { text: '进行中', color: 'processing', icon: <ClockCircleOutlined /> }
        };
        const { text, color, icon } = statusMap[status as keyof typeof statusMap];
        return <Badge status={color as any} text={text} />;
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: PropertyPlatform) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewPlatform(record)}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<SyncOutlined />}
            onClick={() => handleSyncPlatform(record)}
          >
            同步
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditPlatform(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个平台吗？"
            onConfirm={() => handleDeletePlatform(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 处理函数
  const handleViewTerminal = (terminal: HardwareTerminal) => {
    setSelectedTerminal(terminal);
    setIsTerminalModalVisible(true);
  };

  const handleEditTerminal = (terminal: HardwareTerminal) => {
    setSelectedTerminal(terminal);
    terminalForm.setFieldsValue(terminal);
    setIsEditTerminalModalVisible(true);
  };

  const handleAddTerminal = () => {
    addTerminalForm.resetFields();
    setIsAddTerminalModalVisible(true);
  };

  const handleAddTerminalSubmit = (values: any) => {
    const newTerminal: HardwareTerminal = {
      id: Date.now().toString(),
      ...values,
      lastHeartbeat: new Date().toLocaleString(),
      status: 'online'
    };
    setHardwareTerminals(prev => [...prev, newTerminal]);
    message.success('设备添加成功');
    setIsAddTerminalModalVisible(false);
  };

  const handleEditTerminalSubmit = (values: any) => {
    if (selectedTerminal) {
      setHardwareTerminals(prev => 
        prev.map(item => 
          item.id === selectedTerminal.id 
            ? { ...item, ...values }
            : item
        )
      );
      message.success('设备更新成功');
      setIsEditTerminalModalVisible(false);
    }
  };

  const handleDeleteTerminal = (id: string) => {
    setHardwareTerminals(prev => prev.filter(item => item.id !== id));
    message.success('设备删除成功');
  };

  const handleViewInterface = (apiInterface: ApiInterface) => {
    setSelectedInterface(apiInterface);
    setIsInterfaceModalVisible(true);
  };

  const handleTestInterface = (apiInterface: ApiInterface) => {
    setSelectedInterface(apiInterface);
    testForm.setFieldsValue({
      endpoint: apiInterface.endpoint,
      method: apiInterface.method
    });
    setIsTestModalVisible(true);
  };

  const handleEditInterface = (apiInterface: ApiInterface) => {
    setSelectedInterface(apiInterface);
    interfaceForm.setFieldsValue(apiInterface);
    setIsEditInterfaceModalVisible(true);
  };

  const handleAddInterface = () => {
    addInterfaceForm.resetFields();
    setIsAddInterfaceModalVisible(true);
  };

  const handleAddInterfaceSubmit = (values: any) => {
    const newInterface: ApiInterface = {
      id: Date.now().toString(),
      ...values,
      lastTest: new Date().toLocaleString(),
      status: 'active',
      responseTime: 0,
      successRate: 100
    };
    setApiInterfaces(prev => [...prev, newInterface]);
    message.success('接口添加成功');
    setIsAddInterfaceModalVisible(false);
  };

  const handleEditInterfaceSubmit = (values: any) => {
    if (selectedInterface) {
      setApiInterfaces(prev => 
        prev.map(item => 
          item.id === selectedInterface.id 
            ? { ...item, ...values }
            : item
        )
      );
      message.success('接口更新成功');
      setIsEditInterfaceModalVisible(false);
    }
  };

  const handleDeleteInterface = (id: string) => {
    setApiInterfaces(prev => prev.filter(item => item.id !== id));
    message.success('接口删除成功');
  };

  const handleViewPlatform = (platform: PropertyPlatform) => {
    setSelectedPlatform(platform);
    setIsPlatformModalVisible(true);
  };

  const handleSyncPlatform = (platform: PropertyPlatform) => {
    message.loading('正在同步数据...', 2);
    setTimeout(() => {
      message.success('数据同步完成');
    }, 2000);
  };

  const handleEditPlatform = (platform: PropertyPlatform) => {
    setSelectedPlatform(platform);
    platformForm.setFieldsValue(platform);
    setIsEditPlatformModalVisible(true);
  };

  const handleAddPlatform = () => {
    addPlatformForm.resetFields();
    setIsAddPlatformModalVisible(true);
  };

  const handleAddPlatformSubmit = (values: any) => {
    const newPlatform: PropertyPlatform = {
      id: Date.now().toString(),
      ...values,
      lastSync: new Date().toLocaleString(),
      status: 'disconnected',
      syncStatus: 'pending'
    };
    setPropertyPlatforms(prev => [...prev, newPlatform]);
    message.success('平台添加成功');
    setIsAddPlatformModalVisible(false);
  };

  const handleEditPlatformSubmit = (values: any) => {
    if (selectedPlatform) {
      setPropertyPlatforms(prev => 
        prev.map(item => 
          item.id === selectedPlatform.id 
            ? { ...item, ...values }
            : item
        )
      );
      message.success('平台更新成功');
      setIsEditPlatformModalVisible(false);
    }
  };

  const handleDeletePlatform = (id: string) => {
    setPropertyPlatforms(prev => prev.filter(item => item.id !== id));
    message.success('平台删除成功');
  };

  const handleTestSubmit = async (values: any) => {
    message.loading('正在测试接口...', 2);
    setTimeout(() => {
      message.success('接口测试完成');
      setIsTestModalVisible(false);
    }, 2000);
  };

  return (
    <div className="interface-integration">
      <div className="page-header">
        <Title level={2}>
          <ApiOutlined /> 接口对接管理
        </Title>
        <Paragraph>
          统一管理小区智能硬件终端接口和物业公司管理平台对接，提供标准化的接口服务
        </Paragraph>
      </div>

             {/* 统计概览 */}
       <Row gutter={[16, 16]} className="stats-row">
         <Col xs={24} sm={12} md={6}>
           <Card>
             <Statistic
               title="在线设备"
               value={hardwareTerminals.filter(t => t.status === 'online').length}
               prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
               suffix={`/ ${hardwareTerminals.length}`}
             />
           </Card>
         </Col>
         <Col xs={24} sm={12} md={6}>
           <Card>
             <Statistic
               title="活跃接口"
               value={apiInterfaces.filter(i => i.status === 'active').length}
               prefix={<ApiOutlined style={{ color: '#1890ff' }} />}
               suffix={`/ ${apiInterfaces.length}`}
             />
           </Card>
         </Col>
         <Col xs={24} sm={12} md={6}>
           <Card>
             <Statistic
               title="已连接平台"
               value={propertyPlatforms.filter(p => p.status === 'connected').length}
               prefix={<CloudOutlined style={{ color: '#722ed1' }} />}
               suffix={`/ ${propertyPlatforms.length}`}
             />
           </Card>
         </Col>
         <Col xs={24} sm={12} md={6}>
           <Card>
             <Statistic
               title="平均响应时间"
               value={Math.round(apiInterfaces.reduce((sum, i) => sum + i.responseTime, 0) / apiInterfaces.length)}
               prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
               suffix="ms"
             />
           </Card>
         </Col>
       </Row>
       
       {/* 详细统计信息
       <Row gutter={[16, 16]} className="stats-row" style={{ marginBottom: '16px' }}>
         <Col xs={24} sm={12} md={8}>
           <Card size="small">
             <Statistic
               title="设备类型分布"
               value=""
               prefix={<WifiOutlined style={{ color: '#1890ff' }} />}
               suffix={
                 <div style={{ fontSize: '12px', color: '#666' }}>
                   <div>门禁: {hardwareTerminals.filter(t => t.type === '门禁').length}台</div>
                   <div>监控: {hardwareTerminals.filter(t => t.type === '监控').length}台</div>
                   <div>照明: {hardwareTerminals.filter(t => t.type === '照明').length}台</div>
                   <div>消防: {hardwareTerminals.filter(t => t.type === '消防').length}台</div>
                   <div>环境: {hardwareTerminals.filter(t => t.type === '环境').length}台</div>
                   <div>其他: {hardwareTerminals.filter(t => !['门禁', '监控', '照明', '消防', '环境'].includes(t.type)).length}台</div>
                 </div>
               }
             />
           </Card>
         </Col>
         <Col xs={24} sm={12} md={8}>
           <Card size="small">
             <Statistic
               title="接口状态分布"
               value=""
               prefix={<ApiOutlined style={{ color: '#52c41a' }} />}
               suffix={
                 <div style={{ fontSize: '12px', color: '#666' }}>
                   <div>活跃: {apiInterfaces.filter(i => i.status === 'active').length}个</div>
                   <div>停用: {apiInterfaces.filter(i => i.status === 'inactive').length}个</div>
                   <div>测试中: {apiInterfaces.filter(i => i.status === 'testing').length}个</div>
                 </div>
               }
             />
           </Card>
         </Col>
         <Col xs={24} sm={12} md={8}>
           <Card size="small">
             <Statistic
               title="平台连接状态"
               value=""
               prefix={<CloudOutlined style={{ color: '#722ed1' }} />}
               suffix={
                 <div style={{ fontSize: '12px', color: '#666' }}>
                   <div>已连接: {propertyPlatforms.filter(p => p.status === 'connected').length}个</div>
                   <div>未连接: {propertyPlatforms.filter(p => p.status === 'disconnected').length}个</div>
                   <div>连接错误: {propertyPlatforms.filter(p => p.status === 'error').length}个</div>
                 </div>
               }
             />
           </Card>
         </Col>
       </Row> */}

      {/* 主要内容区域 */}
      <Tabs defaultActiveKey="hardware" className="main-tabs">
        <TabPane
          tab={
            <span>
              <WifiOutlined />
              智能硬件终端
            </span>
          }
          key="hardware"
        >
          <Card
            title="硬件终端管理"
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddTerminal}>
                添加设备
              </Button>
            }
          >
            <Table
              columns={terminalColumns}
              dataSource={hardwareTerminals}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <ApiOutlined />
              API接口管理
            </span>
          }
          key="api"
        >
          <Card
            title="API接口管理"
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddInterface}>
                添加接口
              </Button>
            }
          >
            <Table
              columns={interfaceColumns}
              dataSource={apiInterfaces}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <CloudOutlined />
              物业平台对接
            </span>
          }
          key="platform"
        >
          <Card
            title="物业平台对接管理"
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddPlatform}>
                添加平台
              </Button>
            }
          >
            <Table
              columns={platformColumns}
              dataSource={propertyPlatforms}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <SettingOutlined />
              接口配置
            </span>
          }
          key="config"
        >
          <Card title="接口配置管理">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="接口标准配置" size="small">
                  <Form layout="vertical">
                    <Form.Item label="接口版本">
                      <Input defaultValue="v1.0" />
                    </Form.Item>
                    <Form.Item label="超时时间">
                      <InputNumber defaultValue={5000} addonAfter="ms" />
                    </Form.Item>
                    <Form.Item label="重试次数">
                      <InputNumber defaultValue={3} />
                    </Form.Item>
                    <Form.Item label="认证方式">
                      <Select defaultValue="token">
                        <Option value="token">Token认证</Option>
                        <Option value="basic">Basic认证</Option>
                        <Option value="oauth">OAuth2.0</Option>
                      </Select>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="数据同步配置" size="small">
                  <Form layout="vertical">
                    <Form.Item label="同步频率">
                      <Select defaultValue="5min">
                        <Option value="1min">1分钟</Option>
                        <Option value="5min">5分钟</Option>
                        <Option value="15min">15分钟</Option>
                        <Option value="1hour">1小时</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item label="批量大小">
                      <InputNumber defaultValue={100} />
                    </Form.Item>
                    <Form.Item label="错误重试">
                      <Switch defaultChecked />
                    </Form.Item>
                    <Form.Item label="日志记录">
                      <Switch defaultChecked />
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
            </Row>
          </Card>
        </TabPane>
      </Tabs>

      {/* 设备详情模态框 */}
      <Modal
        title="设备详情"
        open={isTerminalModalVisible}
        onCancel={() => setIsTerminalModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsTerminalModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={600}
      >
        {selectedTerminal && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="设备名称">{selectedTerminal.name}</Descriptions.Item>
            <Descriptions.Item label="设备类型">{selectedTerminal.type}</Descriptions.Item>
            <Descriptions.Item label="IP地址">{selectedTerminal.ip}</Descriptions.Item>
            <Descriptions.Item label="端口">{selectedTerminal.port}</Descriptions.Item>
            <Descriptions.Item label="协议">{selectedTerminal.protocol}</Descriptions.Item>
            <Descriptions.Item label="版本">{selectedTerminal.version}</Descriptions.Item>
            <Descriptions.Item label="位置">{selectedTerminal.location}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Badge
                status={selectedTerminal.status === 'online' ? 'success' : 'error'}
                text={selectedTerminal.status === 'online' ? '在线' : '离线'}
              />
            </Descriptions.Item>
            <Descriptions.Item label="最后心跳" span={2}>
              {selectedTerminal.lastHeartbeat}
            </Descriptions.Item>
            <Descriptions.Item label="描述" span={2}>
              {selectedTerminal.description}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 接口测试模态框 */}
      <Modal
        title="接口测试"
        open={isTestModalVisible}
        onCancel={() => setIsTestModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsTestModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => testForm.submit()}>
            开始测试
          </Button>
        ]}
        width={500}
      >
        <Form form={testForm} onFinish={handleTestSubmit} layout="vertical">
          <Form.Item label="请求方法" name="method">
            <Select>
              <Option value="GET">GET</Option>
              <Option value="POST">POST</Option>
              <Option value="PUT">PUT</Option>
              <Option value="DELETE">DELETE</Option>
            </Select>
          </Form.Item>
          <Form.Item label="请求地址" name="endpoint">
            <Input placeholder="请输入接口地址" />
          </Form.Item>
          <Form.Item label="请求参数" name="params">
            <TextArea rows={4} placeholder="请输入JSON格式的请求参数" />
          </Form.Item>
          <Form.Item label="请求头" name="headers">
            <TextArea rows={3} placeholder="请输入JSON格式的请求头" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 添加设备模态框 */}
      <Modal
        title="添加设备"
        open={isAddTerminalModalVisible}
        onCancel={() => setIsAddTerminalModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsAddTerminalModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => addTerminalForm.submit()}>
            添加
          </Button>
        ]}
        width={600}
      >
        <Form form={addTerminalForm} onFinish={handleAddTerminalSubmit} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="设备名称" name="name" rules={[{ required: true, message: '请输入设备名称' }]}>
                <Input placeholder="请输入设备名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="设备类型" name="type" rules={[{ required: true, message: '请选择设备类型' }]}>
                <Select placeholder="请选择设备类型">
                  <Option value="门禁">门禁</Option>
                  <Option value="监控">监控</Option>
                  <Option value="照明">照明</Option>
                  <Option value="消防">消防</Option>
                  <Option value="环境">环境</Option>
                  <Option value="电梯">电梯</Option>
                  <Option value="停车">停车</Option>
                  <Option value="访客">访客</Option>
                  <Option value="能源">能源</Option>
                  <Option value="垃圾">垃圾</Option>
                  <Option value="健身">健身</Option>
                  <Option value="游乐">游乐</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="IP地址" name="ip" rules={[{ required: true, message: '请输入IP地址' }]}>
                <Input placeholder="请输入IP地址" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="端口" name="port" rules={[{ required: true, message: '请输入端口' }]}>
                <InputNumber placeholder="请输入端口" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="协议" name="protocol" rules={[{ required: true, message: '请选择协议' }]}>
                <Select placeholder="请选择协议">
                  <Option value="HTTP">HTTP</Option>
                  <Option value="HTTPS">HTTPS</Option>
                  <Option value="RTSP">RTSP</Option>
                  <Option value="MQTT">MQTT</Option>
                  <Option value="TCP">TCP</Option>
                  <Option value="UDP">UDP</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="版本" name="version" rules={[{ required: true, message: '请输入版本' }]}>
                <Input placeholder="请输入版本" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="位置" name="location" rules={[{ required: true, message: '请输入位置' }]}>
                <Input placeholder="请输入位置" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="状态" name="status" rules={[{ required: true, message: '请选择状态' }]}>
                <Select placeholder="请选择状态">
                  <Option value="online">在线</Option>
                  <Option value="offline">离线</Option>
                  <Option value="error">错误</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="描述" name="description">
            <TextArea rows={3} placeholder="请输入设备描述" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑设备模态框 */}
      <Modal
        title="编辑设备"
        open={isEditTerminalModalVisible}
        onCancel={() => setIsEditTerminalModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsEditTerminalModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => terminalForm.submit()}>
            保存
          </Button>
        ]}
        width={600}
      >
        <Form form={terminalForm} onFinish={handleEditTerminalSubmit} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="设备名称" name="name" rules={[{ required: true, message: '请输入设备名称' }]}>
                <Input placeholder="请输入设备名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="设备类型" name="type" rules={[{ required: true, message: '请选择设备类型' }]}>
                <Select placeholder="请选择设备类型">
                  <Option value="门禁">门禁</Option>
                  <Option value="监控">监控</Option>
                  <Option value="照明">照明</Option>
                  <Option value="消防">消防</Option>
                  <Option value="环境">环境</Option>
                  <Option value="电梯">电梯</Option>
                  <Option value="停车">停车</Option>
                  <Option value="访客">访客</Option>
                  <Option value="能源">能源</Option>
                  <Option value="垃圾">垃圾</Option>
                  <Option value="健身">健身</Option>
                  <Option value="游乐">游乐</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="IP地址" name="ip" rules={[{ required: true, message: '请输入IP地址' }]}>
                <Input placeholder="请输入IP地址" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="端口" name="port" rules={[{ required: true, message: '请输入端口' }]}>
                <InputNumber placeholder="请输入端口" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="协议" name="protocol" rules={[{ required: true, message: '请选择协议' }]}>
                <Select placeholder="请选择协议">
                  <Option value="HTTP">HTTP</Option>
                  <Option value="HTTPS">HTTPS</Option>
                  <Option value="RTSP">RTSP</Option>
                  <Option value="MQTT">MQTT</Option>
                  <Option value="TCP">TCP</Option>
                  <Option value="UDP">UDP</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="版本" name="version" rules={[{ required: true, message: '请输入版本' }]}>
                <Input placeholder="请输入版本" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="位置" name="location" rules={[{ required: true, message: '请输入位置' }]}>
                <Input placeholder="请输入位置" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="状态" name="status" rules={[{ required: true, message: '请选择状态' }]}>
                <Select placeholder="请选择状态">
                  <Option value="online">在线</Option>
                  <Option value="offline">离线</Option>
                  <Option value="error">错误</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="描述" name="description">
            <TextArea rows={3} placeholder="请输入设备描述" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 添加接口模态框 */}
      <Modal
        title="添加接口"
        open={isAddInterfaceModalVisible}
        onCancel={() => setIsAddInterfaceModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsAddInterfaceModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => addInterfaceForm.submit()}>
            添加
          </Button>
        ]}
        width={600}
      >
        <Form form={addInterfaceForm} onFinish={handleAddInterfaceSubmit} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="接口名称" name="name" rules={[{ required: true, message: '请输入接口名称' }]}>
                <Input placeholder="请输入接口名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="请求方法" name="method" rules={[{ required: true, message: '请选择请求方法' }]}>
                <Select placeholder="请选择请求方法">
                  <Option value="GET">GET</Option>
                  <Option value="POST">POST</Option>
                  <Option value="PUT">PUT</Option>
                  <Option value="DELETE">DELETE</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="端点" name="endpoint" rules={[{ required: true, message: '请输入端点' }]}>
            <Input placeholder="请输入端点，如：/api/example" />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <TextArea rows={3} placeholder="请输入接口描述" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="版本" name="version" rules={[{ required: true, message: '请输入版本' }]}>
                <Input placeholder="请输入版本" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="状态" name="status" rules={[{ required: true, message: '请选择状态' }]}>
                <Select placeholder="请选择状态">
                  <Option value="active">活跃</Option>
                  <Option value="inactive">停用</Option>
                  <Option value="testing">测试中</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 编辑接口模态框 */}
      <Modal
        title="编辑接口"
        open={isEditInterfaceModalVisible}
        onCancel={() => setIsEditInterfaceModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsEditInterfaceModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => interfaceForm.submit()}>
            保存
          </Button>
        ]}
        width={600}
      >
        <Form form={interfaceForm} onFinish={handleEditInterfaceSubmit} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="接口名称" name="name" rules={[{ required: true, message: '请输入接口名称' }]}>
                <Input placeholder="请输入接口名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="请求方法" name="method" rules={[{ required: true, message: '请选择请求方法' }]}>
                <Select placeholder="请选择请求方法">
                  <Option value="GET">GET</Option>
                  <Option value="POST">POST</Option>
                  <Option value="PUT">PUT</Option>
                  <Option value="DELETE">DELETE</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="端点" name="endpoint" rules={[{ required: true, message: '请输入端点' }]}>
            <Input placeholder="请输入端点，如：/api/example" />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <TextArea rows={3} placeholder="请输入接口描述" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="版本" name="version" rules={[{ required: true, message: '请输入版本' }]}>
                <Input placeholder="请输入版本" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="状态" name="status" rules={[{ required: true, message: '请选择状态' }]}>
                <Select placeholder="请选择状态">
                  <Option value="active">活跃</Option>
                  <Option value="inactive">停用</Option>
                  <Option value="testing">测试中</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 添加平台模态框 */}
      <Modal
        title="添加平台"
        open={isAddPlatformModalVisible}
        onCancel={() => setIsAddPlatformModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsAddPlatformModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => addPlatformForm.submit()}>
            添加
          </Button>
        ]}
        width={600}
      >
        <Form form={addPlatformForm} onFinish={handleAddPlatformSubmit} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="平台名称" name="name" rules={[{ required: true, message: '请输入平台名称' }]}>
                <Input placeholder="请输入平台名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="平台类型" name="type" rules={[{ required: true, message: '请选择平台类型' }]}>
                <Select placeholder="请选择平台类型">
                  <Option value="内部系统">内部系统</Option>
                  <Option value="外部系统">外部系统</Option>
                  <Option value="第三方系统">第三方系统</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="描述" name="description">
            <TextArea rows={3} placeholder="请输入平台描述" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="API数量" name="apiCount" rules={[{ required: true, message: '请输入API数量' }]}>
                <InputNumber placeholder="请输入API数量" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="连接状态" name="status" rules={[{ required: true, message: '请选择连接状态' }]}>
                <Select placeholder="请选择连接状态">
                  <Option value="connected">已连接</Option>
                  <Option value="disconnected">未连接</Option>
                  <Option value="error">连接错误</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 编辑平台模态框 */}
      <Modal
        title="编辑平台"
        open={isEditPlatformModalVisible}
        onCancel={() => setIsEditPlatformModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsEditPlatformModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => platformForm.submit()}>
            保存
          </Button>
        ]}
        width={600}
      >
        <Form form={platformForm} onFinish={handleEditPlatformSubmit} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="平台名称" name="name" rules={[{ required: true, message: '请输入平台名称' }]}>
                <Input placeholder="请输入平台名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="平台类型" name="type" rules={[{ required: true, message: '请选择平台类型' }]}>
                <Select placeholder="请选择平台类型">
                  <Option value="内部系统">内部系统</Option>
                  <Option value="外部系统">外部系统</Option>
                  <Option value="第三方系统">第三方系统</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="描述" name="description">
            <TextArea rows={3} placeholder="请输入平台描述" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="API数量" name="apiCount" rules={[{ required: true, message: '请输入API数量' }]}>
                <InputNumber placeholder="请输入API数量" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="连接状态" name="status" rules={[{ required: true, message: '请选择连接状态' }]}>
                <Select placeholder="请选择连接状态">
                  <Option value="connected">已连接</Option>
                  <Option value="disconnected">未连接</Option>
                  <Option value="error">连接错误</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default InterfaceIntegration;
