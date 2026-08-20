import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Viatura, StatusViatura } from '../../types';
import {
  Car,
  Search,
  PlusCircle,
  Building2,
  Gauge,
  Calendar,
  Wrench,
  Edit2,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Plus,
} from 'lucide-react';

interface ViaturasViewProps {
  onOpenOSForViatura: (viaturaId: string) => void;
}

export const ViaturasView: React.FC<ViaturasViewProps> = ({ onOpenOSForViatura }) => {
  const { perfil, permissoes } = useAuth();
  const { viaturas, allUnidades, saveViatura, deleteViatura, ordensServico } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusViatura | 'TODOS'>('TODOS');
  const [unidadeFilter, setUnidadeFilter] = useState<string>('TODAS');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVtr, setEditingVtr] = useState<Viatura | null>(null);

  // Form State
  const [prefixo, setPrefixo] = useState('');
  const [placa, setPlaca] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [ano, setAno] = useState<number>(2023);
  const [chassi, setChassi] = useState('');
  const [renavam, setRenavam] = useState('');
  const [quilometragem, setQuilometragem] = useState<number>(0);
  const [unidadeId, setUnidadeId] = useState(allUnidades[0]?.id || '');
  const [tipoCombustivel, setTipoCombustivel] = useState('DIESEL_S10');
  const [statusVtr, setStatusVtr] = useState<StatusViatura>('DISPONIVEL');
  const [formError, setFormError] = useState('');

  const isMaster = permissoes.isMaster;

  // Filtered dataset
  const filteredViaturas = useMemo(() => {
    return (viaturas || []).filter((v) => {
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchPref = (v.prefixo || '').toLowerCase().includes(q);
        const matchPlaca = (v.placa || '').toLowerCase().includes(q);
        const matchModel = `${v.marca || ''} ${v.modelo || v.nomeModelo || ''}`.toLowerCase().includes(q);
        if (!matchPref && !matchPlaca && !matchModel) return false;
      }
      if (statusFilter !== 'TODOS' && v.status !== statusFilter) return false;
      if (unidadeFilter !== 'TODAS' && v.unidadeId !== unidadeFilter) return false;
      return true;
    });
  }, [viaturas, searchTerm, statusFilter, unidadeFilter]);

  const openNewModal = () => {
    setEditingVtr(null);
    setPrefixo('');
    setPlaca('');
    setMarca('Toyota');
    setModelo('Hilux 4x4');
    setAno(2023);
    setChassi('');
    setRenavam('');
    setQuilometragem(45000);
    setUnidadeId(allUnidades[0]?.id || '');
    setTipoCombustivel('DIESEL_S10');
    setStatusVtr('DISPONIVEL');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (v: Viatura) => {
    setEditingVtr(v);
    setPrefixo(v.prefixo);
    setPlaca(v.placa);
    setMarca(v.marca);
    setModelo(v.modelo);
    setAno(v.ano);
    setChassi(v.chassi || '');
    setRenavam(v.renavam || '');
    setQuilometragem(v.quilometragem ?? v.odometroAtual ?? 0);
    setUnidadeId(v.unidadeId);
    setTipoCombustivel(v.tipoCombustivel || 'DIESEL_S10');
    setStatusVtr(v.status);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prefixo.trim() || !placa.trim() || !marca.trim() || !modelo.trim()) {
      setFormError('Preencha os campos obrigatórios (Prefixo, Placa, Marca e Modelo).');
      return;
    }

    const now = new Date().toISOString();
    const vtrToSave: Viatura = {
      id: editingVtr ? editingVtr.id : `vtr-${Date.now()}`,
      prefixo: prefixo.trim().toUpperCase(),
      placa: placa.trim().toUpperCase(),
      marca: marca.trim(),
      modelo: modelo.trim(),
      ano,
      chassi: chassi.trim() || undefined,
      renavam: renavam.trim() || undefined,
      quilometragem: quilometragem || 0,
      unidadeId,
      tipoCombustivel,
      status: statusVtr,
      criadoEm: editingVtr ? editingVtr.criadoEm : now,
      atualizadoEm: now,
    };

    saveViatura(vtrToSave);
    setIsModalOpen(false);
  };

  const getStatusBadge = (status: StatusViatura) => {
    switch (status) {
      case 'DISPONIVEL':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">DISPONÍVEL</span>;
      case 'EM_MANUTENCAO':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">EM MANUTENÇÃO</span>;
      case 'RESERVA':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">RESERVA</span>;
      case 'BAIXADA':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">BAIXADA</span>;
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
            Gestão da Frota de Viaturas
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Controle de {filteredViaturas.length} viaturas operacionais cadastradas no sistema
          </p>
        </div>

        {isMaster && (
          <button
            onClick={openNewModal}
            className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Cadastrar Viatura
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por prefixo, placa ou modelo de viatura..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
        >
          <option value="TODOS">Todos os Status</option>
          <option value="DISPONIVEL">Disponível</option>
          <option value="EM_MANUTENCAO">Em Manutenção</option>
          <option value="RESERVA">Reserva Técnica</option>
          <option value="BAIXADA">Baixada</option>
        </select>

        {isMaster && (
          <select
            value={unidadeFilter}
            onChange={(e) => setUnidadeFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
          >
            <option value="TODAS">Todas as Unidades</option>
            {allUnidades.map((u) => (
              <option key={u.id} value={u.id}>
                {u.sigla} - {u.nome}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredViaturas.map((v) => {
          const unidade = allUnidades.find((u) => u.id === v.unidadeId);
          const activeOS = ordensServico.filter((os) => os.viaturaId === v.id && os.status !== 'FINALIZADA' && os.status !== 'CANCELADA');

          return (
            <div
              key={v.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="font-mono text-xs font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                      {v.prefixo}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      {v.marca} {v.modelo}
                    </h3>
                  </div>
                  {getStatusBadge(v.status)}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 py-2 border-y border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Placa</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{v.placa}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Ano Fab.</span>
                    <span className="font-bold text-slate-900 dark:text-white">{v.ano}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Unidade</span>
                    <span className="font-bold text-slate-900 dark:text-white truncate block">{unidade?.sigla || v.unidadeId}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Hodômetro</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{(v.quilometragem ?? v.odometroAtual ?? 0).toLocaleString('pt-BR')} km</span>
                  </div>
                </div>

                {activeOS.length > 0 && (
                  <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-1.5 font-semibold">
                    <Wrench className="w-3.5 h-3.5" />
                    OS Ativa: {activeOS[0].numeroOS} ({activeOS[0].status})
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenOSForViatura(v.id)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-xs"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  Abrir OS
                </button>

                {isMaster && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(v)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors"
                      title="Editar Viatura"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Deseja remover a viatura ${v.prefixo} do sistema?`)) {
                          deleteViatura(v.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                      title="Excluir Viatura"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Cadastrar / Editar Viatura */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {editingVtr ? 'Editar Viatura da Frota' : 'Cadastrar Nova Viatura'}
            </h3>

            {formError && <p className="text-xs text-rose-500 font-semibold">{formError}</p>}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Prefixo *</label>
                  <input
                    type="text"
                    value={prefixo}
                    onChange={(e) => setPrefixo(e.target.value)}
                    placeholder="Ex: VTR-1025"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Placa *</label>
                  <input
                    type="text"
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value)}
                    placeholder="Ex: BRA2E19"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Marca *</label>
                  <input
                    type="text"
                    value={marca}
                    onChange={(e) => setMarca(e.target.value)}
                    placeholder="Ex: Toyota"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Modelo *</label>
                  <input
                    type="text"
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                    placeholder="Ex: Hilux CD 4x4"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Ano</label>
                  <input
                    type="number"
                    value={ano}
                    onChange={(e) => setAno(parseInt(e.target.value, 10) || 2023)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Hodômetro Atual (KM)</label>
                  <input
                    type="number"
                    value={quilometragem}
                    onChange={(e) => setQuilometragem(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Unidade Responsável</label>
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
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Status da Viatura</label>
                  <select
                    value={statusVtr}
                    onChange={(e) => setStatusVtr(e.target.value as StatusViatura)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="DISPONIVEL">Disponível</option>
                    <option value="EM_MANUTENCAO">Em Manutenção</option>
                    <option value="RESERVA">Reserva Técnica</option>
                    <option value="BAIXADA">Baixada</option>
                  </select>
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
                  Salvar Viatura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
