import React, { useState } from 'react';
import './SimpleMap.less';

// 点位类型定义
interface PointData {
  id: number;
  name: string;
  x: number;
  y: number;
  type: string;
  gridId: number;
}

// 警报事件类型定义
interface AlertEvent {
  id: number;
  name: string;
  x: number;
  y: number;
  type: string;
  gridId: number;
}

// 模拟的社区坐标点
const communityPoints: PointData[] = [
  { id: 1, name: '中都小区A区', x: 30, y: 50, type: 'residence', gridId: 1 },
  { id: 2, name: '中都小区B区', x: 80, y: 40, type: 'residence', gridId: 2 },
  { id: 3, name: '中都小区C区', x: 130, y: 60, type: 'residence', gridId: 3 },
  { id: 4, name: '中都社区服务中心', x: 70, y: 120, type: 'service', gridId: 2 },
  { id: 5, name: '中都街道办事处', x: 150, y: 100, type: 'government', gridId: 3 },
  { id: 6, name: '社区公园', x: 200, y: 150, type: 'park', gridId: 4 },
  { id: 7, name: '中都社区卫生站', x: 110, y: 180, type: 'medical', gridId: 3 },
  { id: 8, name: '便民超市', x: 50, y: 160, type: 'market', gridId: 1 },
  { id: 9, name: '党员中心户', x: 90, y: 90, type: 'party', gridId: 2 },
  { id: 10, name: '老年活动中心', x: 170, y: 70, type: 'elderly', gridId: 4 },
  { id: 11, name: '监控点位1', x: 40, y: 100, type: 'camera', gridId: 1 },
  { id: 12, name: '监控点位2', x: 140, y: 140, type: 'camera', gridId: 3 },
  { id: 13, name: '监控点位3', x: 200, y: 40, type: 'camera', gridId: 4 },
];

// 模拟的道路
const roads = [
  { id: 1, name: '中都大道', points: '30,70 220,70' },
  { id: 2, name: '文化路', points: '60,20 60,200' },
  { id: 3, name: '幸福街', points: '120,30 120,190' },
  { id: 4, name: '和谐路', points: '30,130 220,130' },
  { id: 5, name: '团结巷', points: '180,70 180,190' },
];

// 模拟的网格区域
const grids = [
  { id: 1, name: '网格一', points: '0,0 60,0 60,130 0,130', color: 'rgba(24, 144, 255, 0.1)' },
  { id: 2, name: '网格二', points: '60,0 120,0 120,130 60,130', color: 'rgba(82, 196, 26, 0.1)' },
  { id: 3, name: '网格三', points: '120,0 220,0 220,130 120,130', color: 'rgba(250, 140, 22, 0.1)' },
  { id: 4, name: '网格四', points: '0,130 220,130 220,220 0,220', color: 'rgba(114, 46, 209, 0.1)' },
];

// 警报事件
const alertEvents: AlertEvent[] = [
  { id: 1, name: '消防通道占用', x: 175, y: 95, type: 'fire_block', gridId: 3 },
  { id: 2, name: '垃圾堆放', x: 45, y: 145, type: 'garbage', gridId: 1 },
  { id: 3, name: '高空抛物', x: 135, y: 45, type: 'dropping', gridId: 3 }
];

interface SimpleMapProps {
  height?: number;
}

const SimpleMap: React.FC<SimpleMapProps> = ({ height = 300 }) => {
  const [activeGridId, setActiveGridId] = useState<number | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<PointData | AlertEvent | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // 处理网格点击事件
  const handleGridClick = (gridId: number) => {
    setActiveGridId(activeGridId === gridId ? null : gridId);
  };
  
  // 处理点位悬停事件
  const handlePointHover = (point: PointData | AlertEvent, event: React.MouseEvent) => {
    setHoveredPoint(point);
    setShowTooltip(true);
    setTooltipPos({ x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY });
  };
  
  // 处理点位离开事件
  const handlePointLeave = () => {
    setShowTooltip(false);
  };
  
  // 处理筛选变化
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilter(event.target.value);
  };
  
  // 根据筛选条件过滤点位
  const filteredPoints = selectedFilter === 'all' 
    ? communityPoints 
    : communityPoints.filter(point => {
        if (selectedFilter === 'party') return point.type === 'party';
        if (selectedFilter === 'camera') return point.type === 'camera';
        if (selectedFilter === 'residence') return point.type === 'residence';
        if (selectedFilter === 'service') return ['service', 'medical', 'market', 'elderly'].includes(point.type);
        return true;
    });

  return (
    <div className="simple-map-container" style={{ height: `${height}px` }}>
      <div className="map-filter">
        <label htmlFor="map-filter">筛选: </label>
        <select id="map-filter" value={selectedFilter} onChange={handleFilterChange}>
          <option value="all">全部</option>
          <option value="residence">居住区</option>
          <option value="service">服务设施</option>
          <option value="party">党建设施</option>
          <option value="camera">监控点位</option>
        </select>
      </div>
      
      <svg width="100%" height="100%" viewBox="0 0 250 220">
        {/* 背景 */}
        <rect x="0" y="0" width="250" height="220" fill="#E8F4FC" />
        
        {/* 网格区域 */}
        {grids.map((grid) => (
          <g key={grid.id} onClick={() => handleGridClick(grid.id)} style={{ cursor: 'pointer' }}>
            <polygon
              points={grid.points}
              fill={activeGridId === grid.id ? grid.color.replace('0.1', '0.3') : grid.color}
              stroke="#CCCCCC"
              strokeWidth="1"
              strokeDasharray={activeGridId === grid.id ? "none" : "2,2"}
            />
            <text
              x={grid.id <= 3 ? 30 + ((grid.id - 1) * 60) : 110}
              y={grid.id <= 3 ? 20 : 170}
              fontSize="8"
              fill="rgba(0,0,0,0.6)"
            >
              {grid.name}
            </text>
          </g>
        ))}
        
        {/* 道路 */}
        {roads.map((road) => (
          <g key={road.id}>
            <polyline
              points={road.points}
              stroke="#CCCCCC"
              strokeWidth="6"
              fill="none"
            />
            <polyline
              points={road.points}
              stroke="#FFFFFF"
              strokeWidth="4"
              fill="none"
            />
            <text
              x={road.id % 2 === 0 ? parseInt(road.points.split(' ')[0].split(',')[0]) - 20 : parseInt(road.points.split(' ')[0].split(',')[0]) + 5}
              y={road.id % 2 === 0 ? parseInt(road.points.split(' ')[0].split(',')[1]) + 10 : parseInt(road.points.split(' ')[0].split(',')[1]) - 5}
              fontSize="6"
              fill="rgba(0,0,0,0.6)"
            >
              {road.name}
            </text>
          </g>
        ))}
        
        {/* 兴趣点 */}
        {filteredPoints.map((point) => (
          <g 
            key={point.id} 
            onMouseOver={(e) => handlePointHover(point, e)}
            onMouseLeave={handlePointLeave}
            className="map-point"
            style={{ 
              opacity: activeGridId ? (point.gridId === activeGridId ? 1 : 0.4) : 1,
              transition: 'all 0.3s'
            }}
          >
            {point.type === 'residence' && (
              <rect
                x={point.x - 7}
                y={point.y - 7}
                width="14"
                height="14"
                rx="2"
                fill="#1890FF"
                stroke="#FFFFFF"
                strokeWidth="1"
              />
            )}
            {point.type === 'service' && (
              <rect
                x={point.x - 7}
                y={point.y - 7}
                width="14"
                height="14"
                rx="2"
                fill="#52C41A"
                stroke="#FFFFFF"
                strokeWidth="1"
              />
            )}
            {point.type === 'government' && (
              <rect
                x={point.x - 8}
                y={point.y - 8}
                width="16"
                height="16"
                rx="2"
                fill="#722ED1"
                stroke="#FFFFFF"
                strokeWidth="1"
              />
            )}
            {point.type === 'party' && (
              <polygon
                points={`${point.x},${point.y-8} ${point.x+7},${point.y+4} ${point.x-7},${point.y+4}`}
                fill="#FF4D4F"
                stroke="#FFFFFF"
                strokeWidth="1"
              />
            )}
            {point.type === 'camera' && (
              <polygon
                points={`${point.x-3},${point.y-5} ${point.x+5},${point.y} ${point.x-3},${point.y+5}`}
                fill="#000000"
                stroke="#FFFFFF"
                strokeWidth="1"
              />
            )}
            {(point.type === 'park' || point.type === 'medical' || point.type === 'market' || point.type === 'elderly') && (
              <circle
                cx={point.x}
                cy={point.y}
                r="7"
                fill={
                  point.type === 'park' ? '#52C41A' : 
                  point.type === 'medical' ? '#FF4D4F' : 
                  point.type === 'elderly' ? '#FAAD14' : 
                  '#FA8C16'
                }
                stroke="#FFFFFF"
                strokeWidth="1"
              />
            )}
          </g>
        ))}
        
        {/* 警报事件 */}
        {alertEvents.map((event) => (
          <g 
            key={event.id}
            onMouseOver={(e) => handlePointHover(event, e)}
            onMouseLeave={handlePointLeave}
            className="map-alert"
            style={{ 
              opacity: activeGridId ? (event.gridId === activeGridId ? 1 : 0.4) : 1,
              animation: 'pulse 1.5s infinite'
            }}
          >
            <circle
              cx={event.x}
              cy={event.y}
              r="8"
              fill="rgba(255, 77, 79, 0.4)"
              stroke="#FF4D4F"
              strokeWidth="1"
            />
            <circle
              cx={event.x}
              cy={event.y}
              r="4"
              fill="#FF4D4F"
              stroke="#FFFFFF"
              strokeWidth="1"
            />
            <text
              x={event.x + 10}
              y={event.y - 5}
              fontSize="7"
              fill="#FF4D4F"
            >
              {event.name}
            </text>
          </g>
        ))}
        
        {/* 比例尺 */}
        <g transform="translate(20, 200)">
          <line x1="0" y1="0" x2="50" y2="0" stroke="#000000" strokeWidth="2" />
          <text x="55" y="5" fontSize="8" fill="#000000">500米</text>
        </g>
        
        {/* 指北针 */}
        <g transform="translate(220, 20)">
          <circle cx="0" cy="0" r="10" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
          <line x1="0" y1="0" x2="0" y2="-8" stroke="#D9363E" strokeWidth="2" />
          <line x1="0" y1="0" x2="0" y2="8" stroke="#000000" strokeWidth="1" />
          <text x="-3" y="-12" fontSize="10" fill="#000000">N</text>
        </g>
      </svg>
      
      {/* 悬浮提示 */}
      {showTooltip && hoveredPoint && (
        <div 
          className="map-tooltip"
          style={{
            left: `${tooltipPos.x + 10}px`,
            top: `${tooltipPos.y - 30}px`
          }}
        >
          <strong>{hoveredPoint.name}</strong>
          <div className="tooltip-detail">
            {hoveredPoint.type === 'residence' && '居住区 - 点击查看居民详情'}
            {hoveredPoint.type === 'party' && '党建设施 - 点击查看党员详情'}
            {hoveredPoint.type === 'camera' && '监控点位 - 点击查看监控画面'}
            {hoveredPoint.type === 'service' && '服务设施 - 点击查看详情'}
            {hoveredPoint.type === 'medical' && '医疗设施 - 点击查看详情'}
            {hoveredPoint.type === 'market' && '商业设施 - 点击查看详情'}
            {hoveredPoint.type === 'government' && '行政设施 - 点击查看详情'}
            {hoveredPoint.type === 'park' && '公共设施 - 点击查看详情'}
            {hoveredPoint.type === 'elderly' && '养老设施 - 点击查看详情'}
            {hoveredPoint.type === 'fire_block' && '消防通道占用警报 - 点击处理'}
            {hoveredPoint.type === 'garbage' && '垃圾堆放警报 - 点击处理'}
            {hoveredPoint.type === 'dropping' && '高空抛物警报 - 点击处理'}
          </div>
          <div className="tooltip-grid">所属区域: {grids.find(g => g.id === hoveredPoint.gridId)?.name}</div>
        </div>
      )}
      
      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#1890FF' }}></span>
          <span className="legend-label">居住区</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#52C41A' }}></span>
          <span className="legend-label">服务设施</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#722ED1' }}></span>
          <span className="legend-label">行政设施</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#FF4D4F' }}></span>
          <span className="legend-label">党建/警报</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#000000' }}></span>
          <span className="legend-label">监控点位</span>
        </div>
      </div>
      
      <div className="map-instructions">
        点击网格可以聚焦该区域数据，再次点击可取消聚焦
      </div>
    </div>
  );
};

export default SimpleMap; 