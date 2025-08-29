import React from 'react';
import { Row, Col, Card, Statistic, Tabs, Progress } from 'antd';
import { TeamOutlined, HomeOutlined, AlertOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import SimpleMap from '../components/SimpleMap';
import './Home.less';

const Home: React.FC = () => {
  // Define tab items for the modern Tabs component
  const tabItems = [
    {
      key: '1',
      label: '人口结构',
      children: (
        <div className="chart-container">
          <div className="chart-item">
            <div className="chart-title">年龄分布</div>
            <div className="progress-list">
              <div className="progress-item">
                <div className="progress-label">
                  <span>0-18岁</span>
                  <span>1845人</span>
                </div>
                <Progress percent={15} showInfo={false} strokeColor="#1890ff" />
              </div>
              <div className="progress-item">
                <div className="progress-label">
                  <span>19-35岁</span>
                  <span>3678人</span>
                </div>
                <Progress percent={29} showInfo={false} strokeColor="#52c41a" />
              </div>
              <div className="progress-item">
                <div className="progress-label">
                  <span>36-60岁</span>
                  <span>4538人</span>
                </div>
                <Progress percent={36} showInfo={false} strokeColor="#faad14" />
              </div>
              <div className="progress-item">
                <div className="progress-label">
                  <span>60岁以上</span>
                  <span>2407人</span>
                </div>
                <Progress percent={20} showInfo={false} strokeColor="#ff4d4f" />
              </div>
            </div>
          </div>
          <div className="chart-item">
            <div className="chart-title">户籍分布</div>
            <div className="progress-list">
              <div className="progress-item">
                <div className="progress-label">
                  <span>本地户籍</span>
                  <span>8729人</span>
                </div>
                <Progress percent={70} showInfo={false} strokeColor="#1890ff" />
              </div>
              <div className="progress-item">
                <div className="progress-label">
                  <span>省内户籍</span>
                  <span>2245人</span>
                </div>
                <Progress percent={18} showInfo={false} strokeColor="#52c41a" />
              </div>
              <div className="progress-item">
                <div className="progress-label">
                  <span>省外户籍</span>
                  <span>1494人</span>
                </div>
                <Progress percent={12} showInfo={false} strokeColor="#faad14" />
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      key: '2',
      label: '党员分布',
      children: (
        <div className="chart-container">
          <div className="chart-item">
            <div className="chart-title">党员年龄分布</div>
            <div className="progress-list">
              <div className="progress-item">
                <div className="progress-label">
                  <span>35岁以下</span>
                  <span>56人</span>
                </div>
                <Progress percent={23} showInfo={false} strokeColor="#1890ff" />
              </div>
              <div className="progress-item">
                <div className="progress-label">
                  <span>36-60岁</span>
                  <span>102人</span>
                </div>
                <Progress percent={42} showInfo={false} strokeColor="#52c41a" />
              </div>
              <div className="progress-item">
                <div className="progress-label">
                  <span>60岁以上</span>
                  <span>85人</span>
                </div>
                <Progress percent={35} showInfo={false} strokeColor="#ff4d4f" />
              </div>
            </div>
          </div>
          <div className="party-stats">
            <div className="party-stat-item">
              <div className="party-stat-number">243</div>
              <div className="party-stat-label">党员总数</div>
            </div>
            <div className="party-stat-item">
              <div className="party-stat-number">12</div>
              <div className="party-stat-label">党组织数</div>
            </div>
            <div className="party-stat-item">
              <div className="party-stat-number">18</div>
              <div className="party-stat-label">本月活动数</div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="home-container">
      <h1>汶上县中都街道办事处智慧社区平台</h1>
      
      <Row gutter={[16, 16]} className="stat-overview">
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card total-population">
            <Statistic 
              title="总人口数" 
              value={12468} 
              prefix={<TeamOutlined />} 
              valueStyle={{ color: '#3f8600' }}
            />
            <div className="stat-tag">同比增长 <span>2.8%</span></div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card households">
            <Statistic 
              title="户籍总数" 
              value={4537} 
              prefix={<TeamOutlined />} 
              valueStyle={{ color: '#0050b3' }}
            />
            <div className="stat-tag">同比增长 <span>1.9%</span></div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card houses">
            <Statistic 
              title="房屋总数" 
              value={3826} 
              prefix={<HomeOutlined />} 
              valueStyle={{ color: '#722ed1' }}
            />
            <div className="stat-tag">新增 <span>32</span> 套</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card events">
            <Statistic 
              title="事件总数" 
              value={187} 
              prefix={<AlertOutlined />} 
              valueStyle={{ color: '#cf1322' }}
            />
            <div className="stat-tag">本月处理 <span>35</span> 件</div>
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} className="data-row">
        <Col xs={24} lg={12}>
          <Card title="中都街道社区地图概览" className="map-container">
            <SimpleMap height={300} />
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="社区居民构成" className="chart-card">
            <Tabs defaultActiveKey="1" size="small" items={tabItems} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="最近事件" className="recent-events">
            <ul>
              <li>
                <div className="event-info">
                  <span className="event-badge urgent"></span>
                  <span className="event-title">中都西区消防通道占用处理</span>
                </div>
                <div className="event-meta">
                  <span className="event-status">处理中</span>
                  <span className="event-time">2024-06-15</span>
                </div>
              </li>
              <li>
                <div className="event-info">
                  <span className="event-badge important"></span>
                  <span className="event-title">汶河社区老旧小区改造项目协调会</span>
                </div>
                <div className="event-meta">
                  <span className="event-status">已完成</span>
                  <span className="event-time">2024-06-14</span>
                </div>
              </li>
              <li>
                <div className="event-info">
                  <span className="event-badge normal"></span>
                  <span className="event-title">中都社区夏季防汛应急演练</span>
                </div>
                <div className="event-meta">
                  <span className="event-status">已完成</span>
                  <span className="event-time">2024-06-12</span>
                </div>
              </li>
              <li>
                <div className="event-info">
                  <span className="event-badge normal"></span>
                  <span className="event-title">幸福社区环境卫生整治行动</span>
                </div>
                <div className="event-meta">
                  <span className="event-status">已完成</span>
                  <span className="event-time">2024-06-10</span>
                </div>
              </li>
              <li>
                <div className="event-info">
                  <span className="event-badge urgent"></span>
                  <span className="event-title">汶上县中都街道防疫工作部署会议</span>
                </div>
                <div className="event-meta">
                  <span className="event-status">已完成</span>
                  <span className="event-time">2024-06-05</span>
                </div>
              </li>
            </ul>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="网格管理概况" className="grid-management">
            <div className="grid-stats">
              <Statistic title="网格总数" value={16} prefix={<SafetyCertificateOutlined />} />
              <Statistic title="网格员数量" value={32} prefix={<TeamOutlined />} />
              <Statistic title="本月巡查次数" value={452} suffix="次" />
              <Statistic title="本周事件处理" value={43} suffix="件" />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home; 