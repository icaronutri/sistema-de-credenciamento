import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Usuario, PerfilUsuario } from '../../types';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Shield,
  Building2,
  Wrench,
  CheckCircle,
  XCircle,
  Mail,
  UserCheck,
} from 'lucide-react';

export const UsuariosView: React.FC = () => {
  const { currentUser, permissoes } = useAuth();
  const { allUsuarios, allUnidades, allOficinas, saveUsuario } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [perfilFilter, setPerfilFilter] = useState<PerfilUsuario | 'TODOS'>('TODOS');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);

  // Form
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [perfil, setPerfil] = useState<PerfilUsuario>('UNIDADE');
  const [unidadeId, setUnidadeId] = useState(allUnidades[0]?.id || '');
  const [oficinaId, setOficinaId] = useState(allOficinas[0]?.id || '');
  const [ativo, setAtivo] = useState(true);
  const [formError, setFormError] = useState('');

  const filteredUsers = (allUsuarios || []).filter((u) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchNome = (u.nome || '').toLowerCase().includes(q);
      const matchEmail = (u.email || '').toLowerCase().includes(q);
      if (!matchNome && !matchEmail) return false;
    }
    if (perfilFilter !== 'TODOS' && u.perfil !== perfilFilter) return false;
    return true;
  });

  const openNewModal = () => {
    setEditingUser(null);
    setNome('');
    setEmail('');
    setPerfil('UNIDADE');
    setUnidadeId(allUnidades[0]?.id || '');
    setOficinaId(allOficinas[0]?.id || '');
    setAtivo(true);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (u: Usuario) => {
    setEditingUser(u);
    setNome(u.nome);
    setEmail(u.email);
    setPerfil(u.perfil);
    setUnidadeId(u.unidadeId || allUnidades[0]?.id || '');
    setOficinaId(u.oficinaId || allOficinas[0]?.id || '');
    setAtivo(u.ativo);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim()) {
      setFormError('Nome e E-mail são obrigatórios.');
      return;
    }

    const now = new Date().toISOString();
    const userToSave: Usuario = {
      id: editingUser ? editingUser.id : `usr-${Date.now()}`,
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      perfil,
      unidadeId: perfil === 'UNIDADE' ? unidadeId : undefined,
      oficinaId: perfil === 'OFICINA' ? oficinaId : undefined,
      ativo,
      criadoEm: editingUser ? editingUser.criadoEm : now,
      atualizadoEm: now,
    };

    saveUsuario(userToSave);
    setIsModalOpen(false);
  };

  const getPerfilBadge = (p: PerfilUsuario) => {
    switch (p) {
      case 'MASTER':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1 w-fit">
            <Shield className="w-3 h-3" />
            MASTER
          </span>
        );
      case 'UNIDADE':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1 w-fit">
            <Building2 className="w-3 h-3" />
            UNIDADE
          </span>
        );
      case 'OFICINA':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1 w-fit">
            <Wrench className="w-3 h-3" />
            OFICINA
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Gestão de Usuários & Perfis
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Controle de acessos, vinculação institucional e permissões por perfil (RBAC)
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Novo Usuário
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome ou e-mail..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={perfilFilter}
          onChange={(e) => setPerfilFilter(e.target.value as any)}
          className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
        >
          <option value="TODOS">Todos os Perfis</option>
          <option value="MASTER">Master / Admin</option>
          <option value="UNIDADE">Gestor de Unidade</option>
          <option value="OFICINA">Oficina Credenciada</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Nome do Usuário</th>
                <th className="py-3.5 px-4">E-mail Institucional</th>
                <th className="py-3.5 px-4">Perfil</th>
                <th className="py-3.5 px-4">Vínculo Institucional</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map((u) => {
                const unidade = allUnidades.find((x) => x.id === u.unidadeId);
                const oficina = allOficinas.find((x) => x.id === u.oficinaId);

                return (
                  <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {u.nome}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-mono">
                      {u.email}
                    </td>
                    <td className="py-3.5 px-4">
                      {getPerfilBadge(u.perfil)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                      {u.perfil === 'MASTER' ? (
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">Comando Geral / Todos</span>
                      ) : u.perfil === 'UNIDADE' ? (
                        <span>{unidade?.sigla} - {unidade?.nome}</span>
                      ) : (
                        <span>{oficina?.nome}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.ativo
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}
                      >
                        {u.ativo ? 'ATIVO' : 'INATIVO'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => openEditModal(u)}
                        className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg transition-colors"
                        title="Editar Usuário"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Cadastrar / Editar Usuário */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {editingUser ? 'Editar Usuário do Sistema' : 'Cadastrar Novo Usuário'}
            </h3>

            {formError && <p className="text-xs text-rose-500 font-semibold">{formError}</p>}

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Cap. Fernando Mendes"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">E-mail Institucional *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex: fernando.mendes@pm.gov.br"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Perfil de Acesso *</label>
                <select
                  value={perfil}
                  onChange={(e) => setPerfil(e.target.value as PerfilUsuario)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold"
                >
                  <option value="UNIDADE">UNIDADE (Gestor / Fiscal de Batalhão)</option>
                  <option value="OFICINA">OFICINA (Prestador Credenciado)</option>
                  <option value="MASTER">MASTER (Acesso Total / Comando)</option>
                </select>
              </div>

              {perfil === 'UNIDADE' && (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Unidade Vinculada *</label>
                  <select
                    value={unidadeId}
                    onChange={(e) => setUnidadeId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    {allUnidades.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.sigla} - {u.nome}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {perfil === 'OFICINA' && (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Oficina Credenciada *</label>
                  <select
                    value={oficinaId}
                    onChange={(e) => setOficinaId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    {allOficinas.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.nome} ({o.cidade})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={ativo}
                    onChange={(e) => setAtivo(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Usuário Ativo com permissão de login</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs"
                >
                  Salvar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
