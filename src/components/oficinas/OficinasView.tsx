import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Oficina } from '../../types';
import {
  Wrench,
  Search,
  Plus,
  Edit2,
  MapPin,
  Phone,
  Mail,
  Star,
  CheckCircle,
  FileSpreadsheet,
  Building,
} from 'lucide-react';

export const OficinasView: React.FC = () => {
  const { permissoes } = useAuth();
  const { allOficinas, ordensServico, saveOficina } = useData();

  const isMaster = permissoes.isMaster;
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOficina, setEditingOficina] = useState<Oficina | null>(null);

  // Form State
  const [nome, setNome] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [cidade, setCidade] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [especialidades, setEspecialidades] = useState<string>('Mecânica Geral, Freios, Suspensão');
  const [avaliacao, setAvaliacao] = useState<number>(4.8);
  const [formError, setFormError] = useState('');

  const filteredOficinas = (allOficinas || []).filter((o) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      (o.nome || '').toLowerCase().includes(q) ||
      (o.cnpj || '').toLowerCase().includes(q) ||
      (o.cidade || '').toLowerCase().includes(q) ||
      (o.razaoSocial || '').toLowerCase().includes(q)
    );
  });

  const openNewModal = () => {
    setEditingOficina(null);
    setNome('');
    setRazaoSocial('');
    setCnpj('12.345.678/0001-90');
    setCidade('Curitiba');
    setEndereco('');
    setTelefone('(41) 3222-1000');
    setEmail('');
    setResponsavel('');
    setEspecialidades('Mecânica Leve, Injeção Eletrônica, Freios');
    setAvaliacao(4.9);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (o: Oficina) => {
    setEditingOficina(o);
    setNome(o.nome);
    setRazaoSocial(o.razaoSocial || '');
    setCnpj(o.cnpj);
    setCidade(o.cidade);
    setEndereco(o.endereco || '');
    setTelefone(o.telefone || '');
    setEmail(o.email || '');
    setResponsavel(o.responsavel || '');
    setEspecialidades(o.especialidades ? o.especialidades.join(', ') : '');
    setAvaliacao(o.avaliacao || 4.8);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !cnpj.trim() || !cidade.trim()) {
      setFormError('Preencha os campos obrigatórios (Nome Fantasia, CNPJ e Cidade).');
      return;
    }

    const now = new Date().toISOString();
    const espArray = especialidades
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const oficinaToSave: Oficina = {
      id: editingOficina ? editingOficina.id : `oficina-${Date.now()}`,
      nome: nome.trim(),
      razaoSocial: razaoSocial.trim() || nome.trim(),
      cnpj: cnpj.trim(),
      cidade: cidade.trim(),
      endereco: endereco.trim() || undefined,
      telefone: telefone.trim() || undefined,
      email: email.trim() || undefined,
      responsavel: responsavel.trim() || undefined,
      especialidades: espArray,
      avaliacao,
      ativo: editingOficina ? editingOficina.ativo : true,
      criadoEm: editingOficina ? editingOficina.criadoEm : now,
      atualizadoEm: now,
    };

    saveOficina(oficinaToSave);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Rede de Oficinas Credenciadas 2027
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Prestadores de serviços de manutenção automotiva habilitados no processo de credenciamento
          </p>
        </div>

        {isMaster && (
          <button
            onClick={openNewModal}
            className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Credenciar Oficina
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
            placeholder="Buscar oficina por nome fantasia, CNPJ ou cidade..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOficinas.map((o) => {
          const activeOSCount = ordensServico.filter(
            (os) => os.oficinaId === o.id && os.status !== 'FINALIZADA' && os.status !== 'CANCELADA'
          ).length;

          const totalFinished = ordensServico.filter(
            (os) => os.oficinaId === o.id && os.status === 'FINALIZADA'
          ).length;

          return (
            <div
              key={o.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{o.avaliacao ? o.avaliacao.toFixed(1) : '5.0'}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      o.ativo
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}
                  >
                    {o.ativo ? 'CREDENCIADA' : 'INATIVA'}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white">{o.nome}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">CNPJ: {o.cnpj}</p>

                {/* Specialties chips */}
                {o.especialidades && o.especialidades.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {o.especialidades.map((esp, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {esp}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-3 space-y-1.5 text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{o.cidade} {o.endereco ? `• ${o.endereco}` : ''}</span>
                  </div>
                  {o.responsavel && (
                    <div className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">Contato: {o.responsavel}</span>
                    </div>
                  )}
                  {o.telefone && (
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{o.telefone}</span>
                    </div>
                  )}
                </div>

                {/* Active OS Stats */}
                <div className="mt-4 grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                  <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Em Andamento</span>
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      {activeOSCount} OS
                    </span>
                  </div>
                  <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Concluídas</span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {totalFinished} OS
                    </span>
                  </div>
                </div>
              </div>

              {isMaster && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-1">
                  <button
                    onClick={() => openEditModal(o)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors"
                    title="Editar Oficina"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Cadastrar / Editar Oficina */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {editingOficina ? 'Editar Oficina Credenciada' : 'Credenciar Nova Oficina'}
            </h3>

            {formError && <p className="text-xs text-rose-500 font-semibold">{formError}</p>}

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nome Fantasia *</label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Auto Mecânica São Jorge"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">CNPJ *</label>
                  <input
                    type="text"
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    placeholder="Ex: 12.345.678/0001-90"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Razão Social</label>
                  <input
                    type="text"
                    value={razaoSocial}
                    onChange={(e) => setRazaoSocial(e.target.value)}
                    placeholder="Ex: São Jorge Centro Automotivo LTDA"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
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
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Telefone</label>
                  <input
                    type="text"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="Ex: (41) 3222-1000"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Especialidades (separadas por vírgula)</label>
                  <input
                    type="text"
                    value={especialidades}
                    onChange={(e) => setEspecialidades(e.target.value)}
                    placeholder="Ex: Mecânica Pesada, Injeção Eletrônica, Freios"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
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
                  Salvar Oficina
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
