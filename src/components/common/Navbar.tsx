import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  Bell,
  Check,
  ChevronDown,
  Cloud,
  LogOut,
  Menu,
  Shield,
  Building,
  Wrench,
  UserCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { currentUser, perfil, unidadeAtual, oficinaAtual, allUsers, switchUser, logout } = useAuth();
  const { notificacoes, unreadNotificacoesCount, markNotificacaoRead, markAllNotificacoesRead, googleDriveConfig, resetDemoData } = useData();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const getPerfilBadge = () => {
    switch (perfil) {
      case 'MASTER':
        return {
          label: 'MASTER / ADMIN',
          bg: 'bg-indigo-900/40 text-indigo-200 border-indigo-500/50',
          icon: Shield,
        };
      case 'UNIDADE':
        return {
          label: unidadeAtual ? `UNIDADE: ${unidadeAtual.sigla}` : 'UNIDADE OPERACIONAL',
          bg: 'bg-emerald-900/40 text-emerald-200 border-emerald-500/50',
          icon: Building,
        };
      case 'OFICINA':
        return {
          label: oficinaAtual ? `OFICINA: ${oficinaAtual.nome.split(' ')[0]}` : 'OFICINA CREDENCIADA',
          bg: 'bg-amber-900/40 text-amber-200 border-amber-500/50',
          icon: Wrench,
        };
      default:
        return {
          label: perfil,
          bg: 'bg-slate-800 text-slate-300 border-slate-700',
          icon: UserCheck,
        };
    }
  };

  const badge = getPerfilBadge();
  const BadgeIcon = badge.icon;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-slate-900 border-b border-slate-800 text-white shadow-sm select-none">
      {/* Left side: Hamburger & Title */}
      <div className="flex items-center gap-3">
        <button
          id="btn-toggle-sidebar"
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-hidden transition-colors md:hidden"
          aria-label="Abrir Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-md font-black text-white text-base tracking-tighter">
            OS
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
              Gestão de OS
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                2027
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Manutenção de Frotas & Credenciamento
            </p>
          </div>
        </div>
      </div>

      {/* Right side: Drive indicator, Profile Switcher & Notifications */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Google Drive Status Pill */}
        <div
          title={
            googleDriveConfig.conectado
              ? `Google Drive Conectado: ${googleDriveConfig.pastaRaizNome}`
              : 'Google Drive Desconectado'
          }
          className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
            googleDriveConfig.conectado
              ? 'bg-emerald-950/50 text-emerald-300 border-emerald-800/80'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          <Cloud className={`w-3.5 h-3.5 ${googleDriveConfig.conectado ? 'text-emerald-400' : 'text-slate-400'}`} />
          <span>{googleDriveConfig.conectado ? 'Drive Ativo' : 'Drive Off'}</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            id="btn-navbar-notificacoes"
            onClick={() => {
              setNotifDropdownOpen(!notifDropdownOpen);
              setProfileDropdownOpen(false);
            }}
            className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors focus:outline-hidden"
            aria-label="Notificações"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificacoesCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
                {unreadNotificacoesCount > 9 ? '9+' : unreadNotificacoesCount}
              </span>
            )}
          </button>

          {notifDropdownOpen && (
            <div
              id="dropdown-notificacoes-menu"
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-fadeIn"
            >
              <div className="flex items-center justify-between px-4 py-3 bg-slate-800/80 border-b border-slate-700 text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-indigo-400" />
                  Notificações do Sistema ({notificacoes.length})
                </span>
                {unreadNotificacoesCount > 0 && (
                  <button
                    onClick={() => markAllNotificacoesRead()}
                    className="text-[11px] text-indigo-300 hover:text-white font-medium underline"
                  >
                    Marcar todas lidas
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-800">
                {notificacoes.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    Nenhuma notificação no momento.
                  </div>
                ) : (
                  notificacoes.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificacaoRead(notif.id)}
                      className={`p-3.5 hover:bg-slate-800/50 transition-colors cursor-pointer text-xs ${
                        !notif.lida ? 'bg-indigo-950/30' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-slate-200 leading-snug">{notif.titulo}</h4>
                        {!notif.lida && (
                          <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="mt-1 text-slate-400 leading-relaxed text-[11px]">{notif.mensagem}</p>
                      <span className="mt-2 block text-[10px] text-slate-500">
                        {new Date(notif.dataHora).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick User Profile Switcher (Key Requirement for Instant Demo Testing) */}
        <div className="relative">
          <button
            id="btn-user-profile-menu"
            onClick={() => {
              setProfileDropdownOpen(!profileDropdownOpen);
              setNotifDropdownOpen(false);
            }}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left transition-all focus:outline-hidden"
          >
            <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center font-bold text-xs text-white uppercase shrink-0">
              {currentUser.nome.charAt(0)}
            </div>
            <div className="hidden sm:block min-w-0 max-w-[150px]">
              <div className="text-xs font-semibold text-white truncate leading-tight">
                {currentUser.nome}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {badge.label}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
          </button>

          {profileDropdownOpen && (
            <div
              id="dropdown-profile-switcher"
              className="absolute right-0 mt-2 w-72 sm:w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-fadeIn"
            >
              {/* Active User Header */}
              <div className="p-4 bg-slate-800/80 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold border ${badge.bg}`}>
                    <BadgeIcon className="w-3 h-3" />
                    {badge.label}
                  </span>
                </div>
                <h3 className="mt-2 text-sm font-bold text-white">{currentUser.nome}</h3>
                <p className="text-xs text-slate-400">{currentUser.email}</p>
                {currentUser.cargo && (
                  <p className="text-[11px] text-slate-500 mt-0.5 italic">{currentUser.cargo}</p>
                )}
              </div>

              {/* Quick Persona Switcher */}
              <div className="p-2">
                <div className="px-2 py-1 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                  Alternar Perfil (Simulação Rápida)
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1 mt-1">
                  {allUsers.map((u) => {
                    const isSelected = u.id === currentUser.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setProfileDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs transition-colors ${
                          isSelected
                            ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/30 font-semibold'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="truncate font-medium text-white">{u.nome}</div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {u.perfil} {u.cargo ? `• ${u.cargo}` : ''}
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Footer actions */}
              <div className="p-2 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
                <button
                  onClick={() => {
                    if (confirm('Deseja restaurar todos os dados de demonstração para o estado inicial?')) {
                      resetDemoData();
                      setProfileDropdownOpen(false);
                    }
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded transition-colors text-[11px]"
                  title="Restaurar dados de teste"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Dados Demo
                </button>
                <button
                  onClick={() => {
                    logout();
                    setProfileDropdownOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-rose-400 hover:bg-rose-950/50 rounded transition-colors text-[11px]"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
