import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Select, 
  Button, 
  Input, 
  Table, 
  Tag, 
  Space, 
  Modal, 
  Form, 
  Tabs, 
  Tooltip,
  Dropdown,
  Slider,
  Switch,
  Divider,
  Badge
} from 'antd';
import { 
  PlayCircleOutlined, 
  PauseCircleOutlined, 
  FullscreenOutlined, 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ExclamationCircleOutlined, 
  VideoCameraOutlined,
  SettingOutlined,
  ReloadOutlined,
  CameraOutlined,
  EyeOutlined,
  SoundOutlined
} from '@ant-design/icons';
import './VideoSurveillance.less';

const { Option } = Select;
// TabPane is deprecated in newer Antd versions, using items prop instead



interface VideoCamera {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'malfunction' | 'recording' | 'motion';
  type: string;
  ip: string;
  installDate: string;
  lastMaintenance: string;
  area: string;
  building: string;
  floor: string;
  responsible: string;
  videoUrl: string;
  resolution: string;
  fps: number;
  bitrate: number;
  storage: number;
  motionDetection: boolean;
  recording: boolean;
  audio: boolean;
  ptz: boolean;
  nightVision: boolean;
  lastMotion: string;
  recordingTime: number;
}

interface MatrixLayout {
  id: string;
  name: string;
  rows: number;
  cols: number;
  cameras: string[];
}

const VideoSurveillancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('matrix');
  const [cameras, setCameras] = useState<VideoCamera[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<VideoCamera | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [fullscreenCamera, setFullscreenCamera] = useState<VideoCamera | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set());
  const [videoLoadingStates, setVideoLoadingStates] = useState<Record<string, boolean>>({});
  const [videoErrorStates, setVideoErrorStates] = useState<Record<string, string>>({});
  const [currentLayout, setCurrentLayout] = useState<MatrixLayout>({
    id: '1x1',
    name: '单屏',
    rows: 1,
    cols: 1,
    cameras: []
  });
  const matrixLayouts: MatrixLayout[] = [
    { id: '1x1', name: '单屏', rows: 1, cols: 1, cameras: [] },
    { id: '2x2', name: '2x2矩阵', rows: 2, cols: 2, cameras: [] },
    { id: '3x3', name: '3x3矩阵', rows: 3, cols: 3, cameras: [] },
    { id: '4x4', name: '4x4矩阵', rows: 4, cols: 4, cameras: [] },
    { id: '2x3', name: '2x3矩阵', rows: 2, cols: 3, cameras: [] },
    { id: '3x4', name: '3x4矩阵', rows: 3, cols: 4, cameras: [] },
  ];
  const [autoSwitch, setAutoSwitch] = useState(false);
  const [switchInterval, setSwitchInterval] = useState(10);
  const [showStatus, setShowStatus] = useState(true);
  const [showInfo, setShowInfo] = useState(true);

  // 区域列表
  const areas = ['东区', '西区', '南区', '北区', '中央区'];
  
  // 楼栋列表
  const buildings = ['1号楼', '2号楼', '3号楼', '4号楼', '5号楼', '6号楼', '7号楼', '8号楼'];

  // 模拟数据
  useEffect(() => {
    setLoading(true);
    
    // 测试视频文件是否可访问
    const testVideo = document.createElement('video');
    testVideo.onloadeddata = () => console.log('✅ 视频文件可访问');
    testVideo.onerror = () => console.error('❌ 视频文件无法访问，请检查路径: /wszhsq/img/1.mp4');
    testVideo.onloadstart = () => console.log('🔄 开始加载视频文件');
    testVideo.oncanplay = () => console.log('✅ 视频可以播放');
    testVideo.onwaiting = () => console.log('⏳ 视频缓冲中...');
    testVideo.onstalled = () => console.log('⚠️ 视频加载停滞');
    
    // 添加更多调试信息
    console.log('📍 当前页面URL:', window.location.href);
    console.log('📁 视频文件路径:', '/wszhsq/img/1.mp4');
    console.log('🔗 完整视频URL:', new URL('/wszhsq/img/1.mp4', window.location.href).href);
    
    // 检查视频文件是否存在
    fetch('/wszhsq/img/1.mp4', { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          console.log('✅ 视频文件存在，状态码:', response.status);
        } else {
          console.error('❌ 视频文件不存在，状态码:', response.status);
        }
      })
      .catch(error => {
        console.error('❌ 无法访问视频文件:', error);
      });
    
    testVideo.src = 'https://sdjnzt.github.io/wszhsq/img/11.mp4';
    
    // 模拟API调用
    setTimeout(() => {
      const mockData: VideoCamera[] = Array(32)
        .fill(0)
        .map((_, index) => {
          const area = areas[index % areas.length];
          const building = buildings[index % buildings.length];
          const statuses: Array<VideoCamera['status']> = ['online', 'online', 'online', 'recording', 'motion', 'offline', 'malfunction'];
          const status = statuses[index % statuses.length];
          
          return {
            id: `cam-${index + 1}`,
            name: `摄像头${index + 1}`,
            location: `${area}${building}${index % 3 + 1}单元${index % 10 + 1}层`,
            status,
            type: index % 4 === 0 ? '球机' : index % 3 === 0 ? '枪机' : index % 2 === 0 ? '半球' : '红外',
            ip: `192.168.1.${100 + index}`,
            installDate: `2023-${(index % 12) + 1}-${(index % 28) + 1}`,
            lastMaintenance: `2023-${((index + 3) % 12) + 1}-${((index + 5) % 28) + 1}`,
            area,
            building,
            floor: `${index % 10 + 1}层`,
            responsible: `管理员${index % 5 + 1}`,
            videoUrl: 'https://sdjnzt.github.io/wszhsq/img/11.mp4',
            resolution: index % 3 === 0 ? '4K' : index % 2 === 0 ? '1080P' : '720P',
            fps: index % 2 === 0 ? 30 : 25,
            bitrate: 2000 + (index % 1000),
            storage: 1000 + (index % 500),
            motionDetection: index % 3 !== 0,
            recording: status === 'recording',
            audio: index % 2 === 0,
            ptz: index % 4 === 0,
            nightVision: index % 3 !== 0,
            lastMotion: status === 'motion' ? `2024-01-15 ${14 + (index % 10)}:${30 + (index % 30)}:00` : '',
            recordingTime: status === 'recording' ? 120 + (index % 60) : 0,
          };
        });
      setCameras(mockData);
      
             // 初始化单屏布局的摄像头
       const initialCameras = mockData.slice(0, 1).map(cam => cam.id);
       setCurrentLayout(prev => ({ ...prev, cameras: initialCameras }));
      
      setLoading(false);
    }, 500);
  }, []);

  // 自动切换布局
  useEffect(() => {
    if (!autoSwitch) return;
    
    const interval = setInterval(() => {
      const randomLayout = matrixLayouts[Math.floor(Math.random() * matrixLayouts.length)];
      const randomCameras = cameras
        .filter(cam => cam.status === 'online')
        .sort(() => 0.5 - Math.random())
        .slice(0, randomLayout.rows * randomLayout.cols)
        .map(cam => cam.id);
      
      setCurrentLayout({
        ...randomLayout,
        cameras: randomCameras
      });
    }, switchInterval * 1000);

    return () => clearInterval(interval);
  }, [autoSwitch, switchInterval, matrixLayouts, cameras]);

  const handleSearch = () => {
    // 实际项目中这里应该调用API进行搜索
  };

  const resetSearch = () => {
    setSearchText('');
    setSelectedArea('all');
    setSelectedBuilding('all');
  };

  const showModal = (record?: VideoCamera) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue(record);
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
        const updatedList = cameras.map(item => 
          item.id === editingId ? { ...item, ...values } : item
        );
        setCameras(updatedList);
      } else {
        const newCamera = {
          ...values,
          id: `cam-${cameras.length + 1}`,
                      videoUrl: 'https://sdjnzt.github.io/wszhsq/img/11.mp4',
          status: 'online' as const,
        };
        setCameras([...cameras, newCamera]);
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
      icon: <ExclamationCircleOutlined />,
      content: '确定要删除这个摄像头吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const updatedList = cameras.filter(item => item.id !== id);
        setCameras(updatedList);
      },
    });
  };

  const toggleVideoPlay = (cameraId: string) => {
    const videoElement = document.querySelector(`video[data-camera-id="${cameraId}"]`) as HTMLVideoElement;
    
    if (videoElement) {
      if (playingVideos.has(cameraId)) {
        // 暂停视频
        videoElement.pause();
        setPlayingVideos(prev => {
          const newSet = new Set(prev);
          newSet.delete(cameraId);
          return newSet;
        });
      } else {
        // 播放视频（现在会自动播放）
        videoElement.play().then(() => {
          console.log(`摄像头 ${cameraId} 开始播放`);
          setPlayingVideos(prev => new Set([...prev, cameraId]));
        }).catch((error) => {
          console.error(`摄像头 ${cameraId} 播放失败:`, error);
          // 如果自动播放失败，显示错误信息
          handleVideoError(cameraId, '自动播放被阻止，请手动点击播放');
        });
        
        // 设置加载状态
        setVideoLoadingStates(prev => ({ ...prev, [cameraId]: true }));
        setVideoErrorStates(prev => ({ ...prev, [cameraId]: '' }));
      }
    }
  };

  // 视频加载完成处理
  const handleVideoLoaded = (cameraId: string) => {
    setVideoLoadingStates(prev => ({ ...prev, [cameraId]: false }));
    console.log(`摄像头 ${cameraId} 视频加载完成`);
  };

  // 视频错误处理
  const handleVideoError = (cameraId: string, error: string) => {
    setVideoLoadingStates(prev => ({ ...prev, [cameraId]: false }));
    setVideoErrorStates(prev => ({ ...prev, [cameraId]: error }));
    console.error(`摄像头 ${cameraId} 视频加载失败:`, error);
  };

  const enterFullscreen = (camera: VideoCamera) => {
    setFullscreenCamera(camera);
    setIsFullscreen(true);
  };

  const exitFullscreen = () => {
    setIsFullscreen(false);
    setFullscreenCamera(null);
  };

  const changeLayout = (layout: MatrixLayout) => {
    setCurrentLayout(layout);
    // 为新布局分配摄像头
    const availableCameras = cameras
      .filter(cam => cam.status === 'online')
      .slice(0, layout.rows * layout.cols)
      .map(cam => cam.id);
    
    setCurrentLayout(prev => ({ ...prev, cameras: availableCameras }));
  };

  const getStatusTag = (status: string) => {
    const colorMap: Record<string, string> = {
      online: 'green',
      offline: 'orange',
      malfunction: 'red',
      recording: 'blue',
      motion: 'purple',
    };
    
    const textMap: Record<string, string> = {
      online: '在线',
      offline: '离线',
      malfunction: '故障',
      recording: '录制中',
      motion: '移动侦测',
    };
    
    return <Tag color={colorMap[status]}>{textMap[status]}</Tag>;
  };



  const columns = [
    {
      title: '摄像头名称',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      width: 180,
    },
    {
      title: '区域',
      dataIndex: 'area',
      key: 'area',
      width: 100,
    },
    {
      title: '楼栋',
      dataIndex: 'building',
      key: 'building',
      width: 100,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 80,
    },
    {
      title: '分辨率',
      dataIndex: 'resolution',
      key: 'resolution',
      width: 80,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text: string) => getStatusTag(text),
    },
    {
      title: '负责人',
      dataIndex: 'responsible',
      key: 'responsible',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: unknown, record: VideoCamera) => (
        <Space size="middle">
          <Button 
            type="primary" 
            size="small"
            icon={<VideoCameraOutlined />}
            onClick={() => setSelectedCamera(record)}
          >
            查看
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

  // 根据筛选条件过滤摄像头
  const getFilteredCameras = () => {
    return cameras.filter(camera => {
      const areaMatch = selectedArea === 'all' || camera.area === selectedArea;
      const buildingMatch = selectedBuilding === 'all' || camera.building === selectedBuilding;
      const searchMatch = !searchText || 
        camera.name.includes(searchText) || 
        camera.location.includes(searchText) ||
        camera.ip.includes(searchText);
      return areaMatch && buildingMatch && searchMatch;
    });
  };

  // 获取摄像头网格布局
  const getCameraGrid = () => {
    const { rows, cols, cameras: layoutCameras } = currentLayout;
    const gridCameras = layoutCameras.map(camId => 
      cameras.find(cam => cam.id === camId)
    ).filter(Boolean) as VideoCamera[];

    // 填充空位
    const totalSlots = rows * cols;
    const filledCameras: (VideoCamera | null)[] = [...gridCameras];
    while (filledCameras.length < totalSlots) {
      filledCameras.push(null);
    }

    return (
      <div className="matrix-container">
        <div 
          className="matrix-grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
          }}
        >
          {filledCameras.map((camera, index) => (
            <div key={index} className="matrix-cell">
              {camera ? (
                <Card 
                  className="camera-card matrix-card"
                  title={
                    <div className="camera-title">
                      <span>{camera.name}</span>
                      {showStatus && getStatusTag(camera.status)}
                    </div>
                  }
                  extra={
                    <Space>
                      <Tooltip title={playingVideos.has(camera.id) ? "暂停" : "播放"}>
                        <Button 
                          type="text" 
                          size="small"
                          icon={playingVideos.has(camera.id) ? <PauseCircleOutlined /> : <PlayCircleOutlined />} 
                          onClick={() => toggleVideoPlay(camera.id)}
                        />
                      </Tooltip>
                      <Tooltip title="全屏">
                        <Button 
                          type="text" 
                          size="small"
                          icon={<FullscreenOutlined />} 
                          onClick={() => enterFullscreen(camera)}
                        />
                      </Tooltip>
                    </Space>
                  }
                >
                  <div className="video-container">
                    {camera.status === 'online' || camera.status === 'recording' || camera.status === 'motion' ? (
                      <>
                        {/* 视频加载状态 */}
                        {videoLoadingStates[camera.id] && (
                          <div className="video-loading">
                            <div className="loading-spinner"></div>
                            <p>视频加载中...</p>
                          </div>
                        )}
                        
                        {/* 视频错误状态 */}
                        {videoErrorStates[camera.id] && (
                          <div className="video-error">
                            <ExclamationCircleOutlined />
                            <p>{videoErrorStates[camera.id]}</p>
                            <Button 
                              size="small" 
                              onClick={() => {
                                setVideoErrorStates(prev => ({ ...prev, [camera.id]: '' }));
                                setVideoLoadingStates(prev => ({ ...prev, [camera.id]: true }));
                              }}
                            >
                              重试
                            </Button>
                          </div>
                        )}
                        
                                                 {/* 视频元素 */}
                         {!videoErrorStates[camera.id] && (
                           <video 
                             src={camera.videoUrl} 
                             data-camera-id={camera.id}
                             controls={false}
                             autoPlay={true}
                             muted={true}
                             loop={true}
                             playsInline={true}
                             preload="metadata"
                             className="camera-video"
                             style={{ 
                               width: '100%', 
                               height: '100%', 
                               objectFit: 'cover',
                               display: videoLoadingStates[camera.id] ? 'none' : 'block'
                             }}
                             onError={(e) => {
                               const videoElement = e.target as HTMLVideoElement;
                               const errorCode = videoElement.error?.code;
                               let errorMessage = '未知错误';
                               
                               switch(errorCode) {
                                 case 1: errorMessage = '视频加载被中断'; break;
                                 case 2: errorMessage = '网络错误'; break;
                                 case 3: errorMessage = '视频解码失败'; break;
                                 case 4: errorMessage = '视频格式不支持'; break;
                               }
                               
                               console.error(`摄像头 ${camera.id} 视频错误:`, errorMessage, errorCode);
                               handleVideoError(camera.id, errorMessage);
                             }}
                             onLoadStart={() => {
                               console.log('开始加载视频:', camera.videoUrl);
                               setVideoLoadingStates(prev => ({ ...prev, [camera.id]: true }));
                             }}
                                                           onCanPlay={() => {
                                console.log('视频可以播放:', camera.videoUrl);
                                handleVideoLoaded(camera.id);
                                // 自动播放的视频，设置播放状态
                                setPlayingVideos(prev => new Set([...prev, camera.id]));
                              }}
                              onLoadedData={() => console.log('视频数据加载完成:', camera.videoUrl)}
                              onPlay={() => {
                                console.log('视频开始播放:', camera.id);
                                // 更新播放状态
                                setPlayingVideos(prev => new Set([...prev, camera.id]));
                              }}
                             onPause={() => {
                               console.log('视频暂停:', camera.id);
                               // 更新播放状态
                               setPlayingVideos(prev => {
                                 const newSet = new Set(prev);
                                 newSet.delete(camera.id);
                                 return newSet;
                               });
                             }}
                             onWaiting={() => console.log('视频缓冲中:', camera.id)}
                             onStalled={() => console.log('视频加载停滞:', camera.id)}
                             onAbort={() => console.log('视频加载中断:', camera.id)}
                           />
                         )}
                      </>
                    ) : (
                      <div className="video-offline">
                        <ExclamationCircleOutlined />
                        <p>{camera.status === 'offline' ? '摄像头离线' : '摄像头故障'}</p>
                      </div>
                    )}
                    
                                         {/* 状态指示器 */}
                     <div className="status-indicators">
                       {playingVideos.has(camera.id) && <Badge status="success" text="播放中" />}
                       {camera.recording && <Badge status="processing" text="录制" />}
                       {camera.motionDetection && camera.status === 'motion' && <Badge status="warning" text="移动" />}
                       {camera.audio && <SoundOutlined />}
                       {camera.ptz && <CameraOutlined />}
                       {camera.nightVision && <EyeOutlined />}
                     </div>
                  </div>
                  
                  {showInfo && (
                    <div className="camera-info">
                      <p>位置: {camera.location}</p>
                      <p>IP: {camera.ip}</p>
                      <p>分辨率: {camera.resolution}</p>
                      <p>FPS: {camera.fps}</p>
                    </div>
                  )}
                </Card>
              ) : (
                <div className="empty-cell">
                  <CameraOutlined />
                  <p>空位</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };



  return (
    <div className="video-surveillance-container">
      {isFullscreen && fullscreenCamera && (
        <div className="fullscreen-overlay">
          <div className="fullscreen-header">
            <div className="fullscreen-title">
              <h2>{fullscreenCamera.name}</h2>
              <p>{fullscreenCamera.location}</p>
              {getStatusTag(fullscreenCamera.status)}
            </div>
            <Space>
              <Button 
                type={playingVideos.has(fullscreenCamera.id) ? "default" : "primary"}
                icon={playingVideos.has(fullscreenCamera.id) ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                onClick={() => toggleVideoPlay(fullscreenCamera.id)}
              >
                {playingVideos.has(fullscreenCamera.id) ? "暂停" : "播放"}
              </Button>
              <Button type="primary" onClick={exitFullscreen}>退出全屏</Button>
            </Space>
          </div>
          <div className="fullscreen-video-container">
            {fullscreenCamera.status === 'online' || fullscreenCamera.status === 'recording' || fullscreenCamera.status === 'motion' ? (
                             <video 
                 src={fullscreenCamera.videoUrl} 
                 controls={false}
                 autoPlay={true}
                 muted
                 loop
                 className="fullscreen-video"
               />
            ) : (
              <div className="video-offline fullscreen-offline">
                <ExclamationCircleOutlined />
                <p>{fullscreenCamera.status === 'offline' ? '摄像头离线' : '摄像头故障'}</p>
              </div>
            )}
          </div>
        </div>
      )}

             {/* 视频测试区域 */}
       {/* <Card title="视频播放测试" style={{ marginBottom: 16 }}>
         <div style={{ padding: '16px', background: '#f5f5f5', borderRadius: '6px' }}>
           <h4>测试视频播放功能</h4>
           <p>如果下面的视频能正常播放，说明视频文件路径正确</p>
                       <video 
              src="/wszhsq/img/1.mp4" 
              controls={false}
              autoPlay={true}
              muted={true}
              loop={true}
              style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
             onError={(e) => {
               const videoElement = e.target as HTMLVideoElement;
               console.error('测试视频播放失败:', videoElement.error);
             }}
             onLoadStart={() => console.log('测试视频开始加载')}
             onCanPlay={() => console.log('测试视频可以播放')}
             onPlay={() => console.log('测试视频开始播放')}
           />
           <div style={{ marginTop: '8px' }}>
             <Button 
               onClick={() => {
                 const testVideo = document.querySelector('video') as HTMLVideoElement;
                 if (testVideo) {
                   testVideo.play().then(() => {
                     console.log('测试视频播放成功');
                   }).catch(error => {
                     console.error('测试视频播放失败:', error);
                   });
                 }
               }}
             >
               测试播放
             </Button>
           </div>
         </div>
       </Card> */}

       <Card title="视频监控系统 - 矩阵模式">
        <div className="search-container">
          <Input
            placeholder="请输入摄像头名称/位置/IP搜索"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 250 }}
            prefix={<SearchOutlined />}
            allowClear
          />
          <Select
            placeholder="选择区域"
            style={{ width: 120, marginLeft: 8 }}
            value={selectedArea}
            onChange={value => setSelectedArea(value)}
          >
            <Option value="all">全部区域</Option>
            {areas.map(area => (
              <Option key={area} value={area}>{area}</Option>
            ))}
          </Select>
          <Select
            placeholder="选择楼栋"
            style={{ width: 120, marginLeft: 8 }}
            value={selectedBuilding}
            onChange={value => setSelectedBuilding(value)}
          >
            <Option value="all">全部楼栋</Option>
            {buildings.map(building => (
              <Option key={building} value={building}>{building}</Option>
            ))}
          </Select>
          <Button type="primary" onClick={handleSearch} style={{ marginLeft: 8 }}>
            搜索
          </Button>
          <Button onClick={resetSearch} style={{ marginLeft: 8 }}>
            重置
          </Button>
          
          <Divider type="vertical" />
          
          {/* 矩阵控制 */}
                     <Dropdown menu={{ items: matrixLayouts.map(layout => ({
             key: layout.id,
             label: `${layout.name} (${layout.rows}x${layout.cols})`,
             onClick: () => changeLayout(layout)
           }))}} trigger={['click']}>
             <Button icon={<SettingOutlined />}>
               {currentLayout.name}
             </Button>
           </Dropdown>
          
          <Button 
            icon={<ReloadOutlined />} 
            onClick={() => {
              const availableCameras = cameras
                .filter(cam => cam.status === 'online')
                .slice(0, currentLayout.rows * currentLayout.cols)
                .map(cam => cam.id);
              setCurrentLayout(prev => ({ ...prev, cameras: availableCameras }));
            }}
          >
            刷新
          </Button>
          
                     <Button 
             type={autoSwitch ? "primary" : "default"}
             onClick={() => setAutoSwitch(!autoSwitch)}
           >
             自动切换
           </Button>
           
                       <Button 
              type="primary"
              onClick={() => {
                const onlineCameras = cameras.filter(cam => cam.status === 'online');
                const newPlayingVideos = new Set(onlineCameras.map(cam => cam.id));
                setPlayingVideos(newPlayingVideos);
                // 视频会自动播放，这里只是更新状态
                console.log('已设置所有在线摄像头为播放状态');
              }}
            >
              播放所有
            </Button>
          
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showModal()}
            style={{ marginLeft: 'auto' }}
          >
            添加摄像头
          </Button>
        </div>

                 {/* 矩阵设置面板 */}
         <div className="matrix-settings">
           <Row gutter={16} align="middle">
             <Col span={6}>
               <span>切换间隔: {switchInterval}秒</span>
               <Slider 
                 min={5} 
                 max={60} 
                 value={switchInterval} 
                 onChange={setSwitchInterval}
                 style={{ width: 120, marginLeft: 8 }}
               />
             </Col>
             <Col span={4}>
               <Switch 
                 checked={showStatus} 
                 onChange={setShowStatus}
                 checkedChildren="显示状态"
                 unCheckedChildren="隐藏状态"
               />
             </Col>
             <Col span={4}>
               <Switch 
                 checked={showInfo} 
                 onChange={setShowInfo}
                 checkedChildren="显示信息"
                 unCheckedChildren="隐藏信息"
               />
             </Col>
             <Col span={10}>
               <Space>
                 <span>当前布局: {currentLayout.name}</span>
                 <span>摄像头数量: {currentLayout.cameras.length}</span>
                 <span>在线摄像头: {cameras.filter(cam => cam.status === 'online').length}</span>
                 <span>录制中: {cameras.filter(cam => cam.status === 'recording').length}</span>
                 <span>播放中: {playingVideos.size}</span>
               </Space>
             </Col>
           </Row>
         </div>

                 <Tabs 
           activeKey={activeTab} 
           onChange={setActiveTab} 
           className="camera-tabs"
           items={[
             {
               key: 'matrix',
               label: '矩阵监控',
               children: getCameraGrid()
             },
             {
               key: 'manage',
               label: '摄像头管理',
               children: (
                 <Table
                   columns={columns}
                   dataSource={getFilteredCameras()}
                   rowKey="id"
                   loading={loading}
                   pagination={{
                     pageSize: 10,
                     showQuickJumper: true,
                     showTotal: total => `共 ${total} 条记录`,
                   }}
                   scroll={{ x: 'max-content' }}
                 />
               )
             }
           ]}
         />
      </Card>

      {selectedCamera && (
        <Modal
          title={`${selectedCamera.name} - ${selectedCamera.location}`}
          open={!!selectedCamera}
          onCancel={() => setSelectedCamera(null)}
          footer={[
            <Button key="back" onClick={() => setSelectedCamera(null)}>
              关闭
            </Button>,
            <Button 
              key="fullscreen" 
              type="primary" 
              onClick={() => enterFullscreen(selectedCamera)}
            >
              全屏查看
            </Button>,
          ]}
          width={800}
        >
          <div className="modal-video-container">
            {selectedCamera.status === 'online' || selectedCamera.status === 'recording' || selectedCamera.status === 'motion' ? (
                             <video 
                 src={selectedCamera.videoUrl} 
                 controls={false}
                 autoPlay={true}
                 muted
                 loop
                 className="modal-video"
               />
            ) : (
              <div className="video-offline modal-offline">
                <ExclamationCircleOutlined />
                <p>{selectedCamera.status === 'offline' ? '摄像头离线' : '摄像头故障'}</p>
              </div>
            )}
          </div>
          <div className="camera-details">
            <Row gutter={16}>
              <Col span={8}><strong>摄像头类型:</strong> {selectedCamera.type}</Col>
              <Col span={8}><strong>IP地址:</strong> {selectedCamera.ip}</Col>
              <Col span={8}><strong>状态:</strong> {getStatusTag(selectedCamera.status)}</Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={8}><strong>分辨率:</strong> {selectedCamera.resolution}</Col>
              <Col span={8}><strong>帧率:</strong> {selectedCamera.fps}fps</Col>
              <Col span={8}><strong>码率:</strong> {selectedCamera.bitrate}kbps</Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={8}><strong>安装日期:</strong> {selectedCamera.installDate}</Col>
              <Col span={8}><strong>最近维护:</strong> {selectedCamera.lastMaintenance}</Col>
              <Col span={8}><strong>负责人:</strong> {selectedCamera.responsible}</Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={24}>
                <strong>功能特性:</strong>
                <Space style={{ marginLeft: 8 }}>
                  {selectedCamera.motionDetection && <Tag color="blue">移动侦测</Tag>}
                  {selectedCamera.recording && <Tag color="green">录像</Tag>}
                  {selectedCamera.audio && <Tag color="purple">音频</Tag>}
                  {selectedCamera.ptz && <Tag color="orange">云台</Tag>}
                  {selectedCamera.nightVision && <Tag color="cyan">夜视</Tag>}
                </Space>
              </Col>
            </Row>
          </div>
        </Modal>
      )}

      <Modal
        title={editingId ? '编辑摄像头' : '添加摄像头'}
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
                name="name"
                label="摄像头名称"
                rules={[{ required: true, message: '请输入摄像头名称' }]}
              >
                <Input placeholder="请输入摄像头名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="摄像头类型"
                rules={[{ required: true, message: '请选择摄像头类型' }]}
              >
                <Select placeholder="请选择摄像头类型">
                  <Option value="球机">球机</Option>
                  <Option value="枪机">枪机</Option>
                  <Option value="半球">半球</Option>
                  <Option value="红外">红外</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="area"
                label="所属区域"
                rules={[{ required: true, message: '请选择所属区域' }]}
              >
                <Select placeholder="请选择所属区域">
                  {areas.map(area => (
                    <Option key={area} value={area}>{area}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="building"
                label="所属楼栋"
                rules={[{ required: true, message: '请选择所属楼栋' }]}
              >
                <Select placeholder="请选择所属楼栋">
                  {buildings.map(building => (
                    <Option key={building} value={building}>{building}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="floor"
                label="所在楼层"
                rules={[{ required: true, message: '请输入所在楼层' }]}
              >
                <Input placeholder="请输入所在楼层" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="location"
            label="详细位置"
            rules={[{ required: true, message: '请输入详细位置' }]}
          >
            <Input placeholder="请输入详细位置" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="ip"
                label="IP地址"
                rules={[
                  { required: true, message: '请输入IP地址' },
                  { pattern: /^(\d{1,3}\.){3}\d{1,3}$/, message: '请输入正确的IP地址格式' }
                ]}
              >
                <Input placeholder="请输入IP地址" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="responsible"
                label="负责人"
                rules={[{ required: true, message: '请输入负责人' }]}
              >
                <Input placeholder="请输入负责人" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="installDate"
                label="安装日期"
                rules={[{ required: true, message: '请输入安装日期' }]}
              >
                <Input placeholder="请输入安装日期" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastMaintenance"
                label="最近维护日期"
                rules={[{ required: true, message: '请输入最近维护日期' }]}
              >
                <Input placeholder="请输入最近维护日期" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default VideoSurveillancePage; 