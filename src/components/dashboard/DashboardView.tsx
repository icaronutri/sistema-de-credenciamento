import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { MasterDashboard } from './MasterDashboard';
import { UnidadeDashboard } from './UnidadeDashboard';
import { OficinaDashboard } from './OficinaDashboard';
import { ActiveView } from '../common/Sidebar';

interface DashboardViewProps {
  onSelectOS: (osId: string) => void;
  onNavigate: (view: ActiveView) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onSelectOS, onNavigate }) => {
  const { perfil } = useAuth();

  if (perfil === 'UNIDADE') {
    return <UnidadeDashboard onSelectOS={onSelectOS} onNavigate={onNavigate} />;
  }

  if (perfil === 'OFICINA') {
    return <OficinaDashboard onSelectOS={onSelectOS} onNavigate={onNavigate} />;
  }

  return <MasterDashboard onSelectOS={onSelectOS} onNavigate={onNavigate} />;
};
