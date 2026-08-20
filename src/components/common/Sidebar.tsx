import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  FileCheck2,
  Car,
  Building2,
  Wrench,
  Users,
  BarChart3,
  Settings,
  X,
  FileSpreadsheet,
  Clock,
  Shield,
  Layers,
  Cloud,
} from 'lucide-react';

export type ActiveView =
  | 'dashboard'
  | 'ordens-servico'
  | 'nova-os'
  | 'os-detalhe'
  | 'conferencia-nf'
  | 'viaturas'
  | 'unidades'
  | 'oficinas'
  | 'usuarios'
  | 'relatorios'
  | 'integracoes'
  | 'configuracoes';

interface SidebarProps {
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  isOpenMobile?: boolean;
  isOpen?: boolean;
  onCloseMobile?: () => void;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  isOpenMobile,
  isOpen,
  onCloseMobile,
  onClose,
}) => {
  const open = isOpenMobile ?? isOpen ?? false;
  const close = onCloseMobile ?? onClose ?? (() => {});

  const { perfil, currentUser, unidadeAtual, oficinaAtual } = useAuth();
  const { ordensServico, allOrdensServico } = useData();

  const isMaster = perfil === 'MASTER';
  const isUnidade = perfil === 'UNIDADE';
  const isOficina = perfil === 'OFICINA';

  // Count pending NFs for Master badge
  const pendingNFCount = (allOrdensServico || []).filter(
    (os) => os.status === 'AGUARDANDO_CONFERENCIA'
  ).length;

  // Count active OS for current view
  const activeOSCount = (ordensServico || []).filter(
    (os) => os.status !== 'FINALIZADA' && os.status !== 'CANCELADA'
  ).length;

  const handleNav = (view: ActiveView) => {
    onSelectView(view);
    close();
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {open && (
        <div
          id="sidebar-backdrop"
          onClick={close}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 md:hidden border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Shield className="w-5 h-5 text-indigo-400" />
            <span>Navegação</span>
          </div>
          <button
            onClick={close}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card Mini */}
        <div className="p-4 mx-3 my-3 rounded-xl bg-slate-800/60 border border-slate-750 text-xs">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Painel Ativo
          </div>
          <div className="mt-1 font-bold text-white text-sm flex items-center gap-1.5 truncate">
            {isMaster && (
              <>
                <Shield className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="truncate">Gestão Geral / Master</span>
              </>
            )}
            {isUnidade && (
              <>
                <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">{unidadeAtual?.sigla || 'Unidade'}</span>
              </>
            )}
            {isOficina && (
              <>
                <Wrench className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">{oficinaAtual?.nome || 'Oficina'}</span>
              </>
            )}
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
            <span>OS Ativas:</span>
            <span className="font-bold text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-800/50">
              {activeOSCount}
            </span>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
          {/* Main Group */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Operacional
            </div>
            <div className="space-y-1">
              <button
                id="nav-dashboard"
                onClick={() => handleNav('dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                  activeView === 'dashboard'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>Dashboard</span>
              </button>

              <button
                id="nav-os-list"
                onClick={() => handleNav('ordens-servico')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                  activeView === 'ordens-servico' || activeView === 'os-detalhe'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ClipboardList className="w-4 h-4 shrink-0" />
                  <span>Ordens de Serviço</span>
                </div>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-slate-800 text-slate-300">
                  {ordensServico.length}
                </span>
              </button>

              {(isMaster || isUnidade) && (
                <button
                  id="nav-os-new"
                  onClick={() => handleNav('nova-os')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                    activeView === 'nova-os'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-emerald-300 hover:bg-emerald-950/40 hover:text-emerald-200'
                  }`}
                >
                  <PlusCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Nova Ordem de Serviço</span>
                </button>
              )}

              {isMaster && (
                <button
                  id="nav-conferencia-nf"
                  onClick={() => handleNav('conferencia-nf')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                    activeView === 'conferencia-nf'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-amber-300 hover:bg-amber-950/40 hover:text-amber-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileCheck2 className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>Conferência de NF</span>
                  </div>
                  {pendingNFCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-500 text-slate-950 shadow-xs animate-pulse">
                      {pendingNFCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Cadastros / Gestão de Frota */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {isMaster ? 'Cadastros & Credenciamento' : 'Recursos & Frota'}
            </div>
            <div className="space-y-1">
              <button
                id="nav-viaturas"
                onClick={() => handleNav('viaturas')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                  activeView === 'viaturas'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Car className="w-4 h-4 shrink-0" />
                <span>{isUnidade ? 'Nossas Viaturas' : 'Viaturas da Frota'}</span>
              </button>

              <button
                id="nav-oficinas"
                onClick={() => handleNav('oficinas')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                  activeView === 'oficinas'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Wrench className="w-4 h-4 shrink-0" />
                <span>{isOficina ? 'Dados da Oficina' : 'Oficinas Credenciadas'}</span>
              </button>

              {isMaster && (
                <>
                  <button
                    id="nav-unidades"
                    onClick={() => handleNav('unidades')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                      activeView === 'unidades'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Building2 className="w-4 h-4 shrink-0" />
                    <span>Unidades Operacionais</span>
                  </button>

                  <button
                    id="nav-usuarios"
                    onClick={() => handleNav('usuarios')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                      activeView === 'usuarios'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Users className="w-4 h-4 shrink-0" />
                    <span>Usuários & Perfis</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Relatórios & Configs */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Análise & Sistema
            </div>
            <div className="space-y-1">
              <button
                id="nav-relatorios"
                onClick={() => handleNav('relatorios')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                  activeView === 'relatorios'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <BarChart3 className="w-4 h-4 shrink-0" />
                <span>Relatórios & Custos</span>
              </button>

              <button
                id="nav-integracoes"
                onClick={() => handleNav('integracoes')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                  activeView === 'integracoes'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Cloud className="w-4 h-4 shrink-0" />
                <span>Google Drive & Nuvem</span>
              </button>

              {isMaster && (
                <button
                  id="nav-configuracoes"
                  onClick={() => handleNav('configuracoes')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                    activeView === 'configuracoes'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Settings className="w-4 h-4 shrink-0" />
                  <span>Configurações & SLA</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer / Version Badge */}
        <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Versão 2027.1</span>
          <span className="inline-flex items-center gap-1 font-mono text-[10px] text-indigo-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            Online
          </span>
        </div>
      </aside>
    </>
  );
};
