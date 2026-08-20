import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Building2, Wrench, Lock, Mail, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { allUsers, loginWithEmail, switchUser, currentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Por favor, informe seu e-mail institucional.');
      return;
    }
    const success = loginWithEmail(email);
    if (!success) {
      setError('Usuário não localizado no cadastro. Selecione um dos perfis pré-configurados abaixo.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-indigo-600 to-indigo-500 rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-500/20 border border-indigo-400/30">
          <ShieldCheck className="w-9 h-9 text-white" />
        </div>
        <h2 className="mt-5 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Gestão de OS
        </h2>
        <p className="mt-1 text-sm text-indigo-400 font-semibold uppercase tracking-wider">
          Credenciamento Frota 2027
        </p>
        <p className="mt-2 text-xs text-slate-400 max-w-xs mx-auto">
          Ambiente corporativo seguro para gestão de manutenção de viaturas, oficinas credenciadas e conferência documental
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 sm:px-10 rounded-3xl shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 bg-rose-950/80 border border-rose-800 rounded-xl text-xs font-semibold text-rose-300">
              {error}
            </div>
          )}

          {/* Preset Roles Quick Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Acesso Rápido por Perfil (Simulação / Teste RBAC)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {allUsers.map((u) => {
                const isSelected = currentUser.id === u.id;
                const Icon = u.perfil === 'MASTER' ? Shield : u.perfil === 'UNIDADE' ? Building2 : Wrench;

                return (
                  <button
                    key={u.id}
                    onClick={() => switchUser(u.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white ring-2 ring-indigo-500/30'
                        : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                            u.perfil === 'MASTER'
                              ? 'bg-indigo-500/20 text-indigo-300'
                              : u.perfil === 'UNIDADE'
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {u.perfil}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-white truncate">{u.nome}</div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">{u.email}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-3 text-slate-500 font-bold tracking-wider">
                Ou acesse com e-mail institucional
              </span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">E-mail Cadastrado</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ex: icarogarciacel@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Senha de Acesso</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 text-xs"
            >
              Entrar no Sistema
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-[11px] text-slate-500">
            Credenciamento PM 2027 • Desenvolvido com Cloud Firestore & Google Drive
          </div>
        </div>
      </div>
    </div>
  );
};
