import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Unidade } from '../../types';
import {
  Building2,
  Search,
  Plus,
  Edit2,
  Trash2,
  Car,
  Wrench,
  MapPin,
  Phone,
  Mail,
  User,
  CheckCircle,
} from 'lucide-react';

export const UnidadesView: React.FC = () => {
  const { permissoes } = useAuth();
  const { allUnidades, viaturas, ordensServico, saveUnidade } = useData();

  const isMaster = permissoes.isMaster;
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnidade, setEditingUnidade] = useState<Unidade | null>(null);

  // Form State
  const [nome, setNome] = useState('');
  const [sigla, setSigla] = useState('');
  const [cidade, setCidade] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [formError, setFormError] = useState('');

  const filteredUnidades = (allUnidades || []).filter((u) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      (u.nome || '').toLowerCase().includes(q) ||
      (u.sigla || '').toLowerCase().includes(q) ||
      (u.cidade || '').toLowerCase().includes(q)
    );
  });

  const openNewModal = () => {
    setEditingUnidade(null);
    setNome('');
    setSigla('');
    setCidade('Curitiba');
    setEndereco('');
    setTelefone('(41) 3304-4000');
    setEmail('');
    setResponsavel('');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (u: Unidade) => {
    setEditingUnidade(u);
    setNome(u.nome);
    setSigla(u.sigla);
    setCidade(u.cidade);
    setEndereco(u.endereco || '');
    setTelefone(u.telefone || '');
    setEmail(u.email || '');
    setResponsavel(u.responsavel || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !sigla.trim() || !cidade.trim()) {
      setFormError('Preencha os campos obrigatórios (Nome, Sigla e Cidade).');
      return;
    }

    const now = new Date().toISOString();
    const unidadeToSave: Unidade = {
      id: editingUnidade ? editingUnidade.id : `unidade-${Date.now()}`,
      nome: nome.trim(),
      sigla: sigla.trim().toUpperCase(),
      cidade: cidade.trim(),
      endereco: endereco.trim() || undefined,
      telefone: telefone.trim() || undefined,
      email: email.trim() || undefined,
      responsavel: responsavel.trim() || undefined,
      ativo: editingUnidade ? editingUnidade.ativo : true,
      criadoEm: editingUnidade ? editingUnidade.criadoEm : now,
      atualizadoEm: now,
    };

    saveUnidade(unidadeToSave);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Unidades Operacionais
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Batalhões, companhias e unidades de apoio operacional com acesso ao sistema
          </p>
        </div>

        {isMaster && (
          <button
            onClick={openNewModal}
            className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Nova Unidade
          </button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar unidade por nome, sigla ou município..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUnidades.map((u) => {
          const fleetCount = viaturas.filter((v) => v.unidadeId === u.id).length;
          const activeOSCount = ordensServico.filter(
            (os) => os.unidadeId === u.id && os.status !== 'FINALIZADA' && os.status !== 'CANCELADA'
          ).length;

          return (
            <div
              key={u.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-bold text-xs px-2.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                    {u.sigla}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      u.ativo
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}
                  >
                    {u.ativo ? 'ATIVA' : 'INATIVA'}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{u.nome}</h3>

                <div className="mt-3 space-y-1.5 text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{u.cidade} {u.endereco ? `• ${u.endereco}` : ''}</span>
                  </div>
                  {u.responsavel && (
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">Cmt: {u.responsavel}</span>
                    </div>
                  )}
                  {u.telefone && (
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{u.telefone}</span>
                    </div>
                  )}
                </div>

                {/* Fleet and OS Stats */}
                <div className="mt-4 grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                  <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Viaturas</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-center gap-1">
                      <Car className="w-3.5 h-3.5 text-indigo-500" />
                      {fleetCount}
                    </span>
                  </div>
                  <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">OS Ativas</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-center gap-1">
                      <Wrench className="w-3.5 h-3.5 text-amber-500" />
                      {activeOSCount}
                    </span>
                  </div>
                </div>
              </div>

              {isMaster && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-1">
                  <button
                    onClick={() => openEditModal(u)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors"
                    title="Editar Unidade"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Nova / Editar Unidade */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {editingUnidade ? 'Editar Unidade Operacional' : 'Nova Unidade Operacional'}
            </h3>

            {formError && <p className="text-xs text-rose-500 font-semibold">{formError}</p>}

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Sigla *</label>
                  <input
                    type="text"
                    value={sigla}
                    onChange={(e) => setSigla(e.target.value)}
                    placeholder="Ex: 1º BPM"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Cidade *</label>
                  <input
                    type="text"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    placeholder="Ex: Curitiba"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nome Completo da Unidade *</label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: 1º Batalhão de Polícia Militar"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Endereço</label>
                  <input
                    type="text"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    placeholder="Ex: Rua Marechal Deodoro, 1200"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Responsável / Comandante</label>
                  <input
                    type="text"
                    value={responsavel}
                    onChange={(e) => setResponsavel(e.target.value)}
                    placeholder="Ex: Maj. Roberto Souza"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Telefone</label>
                  <input
                    type="text"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="Ex: (41) 3304-4000"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
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
                  Salvar Unidade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
