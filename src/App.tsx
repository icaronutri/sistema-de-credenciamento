import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar, ActiveView } from './components/common/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { OSList } from './components/os/OSList';
import { OSForm } from './components/os/OSForm';
import { OSDetail } from './components/os/OSDetail';
import { ViaturasView } from './components/viaturas/ViaturasView';
import { UnidadesView } from './components/unidades/UnidadesView';
import { OficinasView } from './components/oficinas/OficinasView';
import { UsuariosView } from './components/usuarios/UsuariosView';
import { RelatoriosView } from './components/relatorios/RelatoriosView';
import { IntegracoesView } from './components/configuracoes/IntegracoesView';
import { ConfiguracoesView } from './components/configuracoes/ConfiguracoesView';
import { StatusOS } from './types';

const MainApp: React.FC = () => {
  const { currentUser, perfil } = useAuth();
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [selectedOSId, setSelectedOSId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [initialStatusFilter, setInitialStatusFilter] = useState<StatusOS | 'TODOS'>('TODOS');

  // Navigation handlers
  const handleSelectOS = (osId: string) => {
    setSelectedOSId(osId);
    setActiveView('os-detalhe');
    setSidebarOpen(false);
  };

  const handleNavigate = (view: ActiveView) => {
    if (view === 'conferencia-nf') {
      setInitialStatusFilter('AGUARDANDO_CONFERENCIA');
      setActiveView('ordens-servico');
      setSelectedOSId(null);
      setSidebarOpen(false);
      return;
    }

    if (view !== 'os-detalhe') {
      setSelectedOSId(null);
      if (view === 'ordens-servico') {
        setInitialStatusFilter('TODOS');
      }
    }
    setActiveView(view);
    setSidebarOpen(false);
  };

  const handleOpenOSForViatura = (viaturaId: string) => {
    setActiveView('nova-os');
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onSelectOS={handleSelectOS}
        onNavigate={handleNavigate}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeView={activeView}
          onSelectView={handleNavigate}
          isOpenMobile={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeView === 'dashboard' && (
              <DashboardView
                onSelectOS={handleSelectOS}
                onNavigate={handleNavigate}
              />
            )}

            {activeView === 'ordens-servico' && (
              <OSList
                onSelectOS={handleSelectOS}
                onNavigateNew={() => handleNavigate('nova-os')}
                initialStatusFilter={initialStatusFilter}
              />
            )}

            {activeView === 'nova-os' && (
              <OSForm
                onCancel={() => handleNavigate('ordens-servico')}
                onSuccess={(newOSId) => handleSelectOS(newOSId)}
              />
            )}

            {activeView === 'os-detalhe' && selectedOSId && (
              <OSDetail
                osId={selectedOSId}
                onBack={() => handleNavigate('ordens-servico')}
              />
            )}

            {activeView === 'viaturas' && (
              <ViaturasView onOpenOSForViatura={handleOpenOSForViatura} />
            )}

            {activeView === 'unidades' && <UnidadesView />}

            {activeView === 'oficinas' && <OficinasView />}

            {activeView === 'usuarios' && <UsuariosView />}

            {activeView === 'relatorios' && <RelatoriosView />}

            {activeView === 'integracoes' && <IntegracoesView />}

            {activeView === 'configuracoes' && <ConfiguracoesView />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainApp />
      </DataProvider>
    </AuthProvider>
  );
}
