import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Home from './pages/Home';
import Party from './pages/Party';
import Service from './pages/Service';
import Property from './pages/Property';
import Inspection from './pages/Inspection';
import Population from './pages/Population';
import Governance from './pages/Governance';
import Work from './pages/Work';
import Event from './pages/Event';
import Housing from './pages/Housing';
import GridManagement from './pages/GridManagement';
import ElderlyInfo from './pages/elderly/ElderlyInfo';
import ElderlyHealth from './pages/elderly/ElderlyHealth';
import ElderlyService from './pages/elderly/ElderlyService';
import ElderlyInstitution from './pages/elderly/ElderlyInstitution';
import PartyMember from './pages/party/PartyMember';
import PartyPosition from './pages/party/PartyPosition';
import PartyHousehold from './pages/party/PartyHousehold';
import PartyOrganization from './pages/party/PartyOrganization';
import VideoSurveillance from './pages/VideoSurveillance';
import VehicleManagement from './pages/VehicleManagement';
import WeChatEnterprise from './pages/WeChatEnterprise';
import GovernmentSystem from './pages/GovernmentSystem';
import InterfaceIntegration from './pages/InterfaceIntegration';
import './App.css';

const App: React.FC = () => {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="party" element={<Party />} />
          <Route path="service" element={<Service />} />
          <Route path="property" element={<Property />} />
          <Route path="inspection" element={<Inspection />} />
          <Route path="population" element={<Population />} />
          <Route path="governance" element={<Governance />} />
          <Route path="work" element={<Work />} />
          <Route path="event" element={<Event />} />
          <Route path="housing" element={<Housing />} />
          <Route path="grid" element={<GridManagement />} />
          <Route path="video" element={<VideoSurveillance />} />
          <Route path="vehicle" element={<VehicleManagement />} />
          <Route path="wechat" element={<WeChatEnterprise />} />
          <Route path="government" element={<GovernmentSystem />} />
          <Route path="interface" element={<InterfaceIntegration />} />
          <Route path="elderly">
            <Route path="info" element={<ElderlyInfo />} />
            <Route path="health" element={<ElderlyHealth />} />
            <Route path="service" element={<ElderlyService />} />
            <Route path="institution" element={<ElderlyInstitution />} />
          </Route>
          <Route path="party">
            <Route path="member" element={<PartyMember />} />
            <Route path="position" element={<PartyPosition />} />
            <Route path="household" element={<PartyHousehold />} />
            <Route path="organization" element={<PartyOrganization />} />
          </Route>
        </Route>
      </Routes>
    </UserProvider>
  );
};

export default App;
