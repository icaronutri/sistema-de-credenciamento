import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusOS, PrioridadeOS, OrdemServico } from '../../types';
import {
  Search,
  Filter,
  PlusCircle,
  Car,
  Building2,
  Wrench,
  Calendar,
  DollarSign,
  Eye,
  SlidersHorizontal,
  Download,
  FileCheck,
  CheckCircle,
} from 'lucide-react';

interface OSListProps {
  onSelectOS: (osId: string) => void;
  onNavigateNew: () => void;
  initialStatusFilter?: StatusOS | 'TODOS';
}

export const OSList: React.FC<OSListProps> = ({
  onSelectOS,
  onNavigateNew,
  initialStatusFilter = 'TODOS',
}) => {
  const { perfil } = useAuth();
  const { ordensServico, allUnidades, allOficinas } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusOS | 'TODOS'>(initialStatusFilter);
  const [prioridadeFilter, setPrioridadeFilter] = useState<PrioridadeOS | 'TODOS'>('TODOS');
  const [unidadeFilter, setUnidadeFilter] = useState<string>('TODAS');
  const [oficinaFilter, setOficinaFilter] = useState<string>('TODAS');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const isMaster = perfil === 'MASTER';
  const isUnidade = perfil === 'UNIDADE';
  const isOficina = perfil === 'OFICINA';

  // Filtered dataset
  const filteredOS = useMemo(() => {
    return (ordensServico || []).filter((os) => {
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchOS = (os.numeroOS || '').toLowerCase().includes(query);
        const matchPrefixo = (os.prefixo || '').toLowerCase().includes(query);
        const matchPlaca = (os.placa || '').toLowerCase().includes(query);
        const matchViatura = (os.nomeViatura || '').toLowerCase().includes(query);
        const matchProblema = (os.descricaoProblema || '').toLowerCase().includes(query);
        if (!matchOS && !matchPrefixo && !matchPlaca && !matchViatura && !matchProblema) {
          return false;
        }
      }

      // Status
      if (statusFilter !== 'TODOS' && os.status !== statusFilter) {
        return false;
      }

      // Prioridade
      if (prioridadeFilter !== 'TODOS' && os.prioridade !== prioridadeFilter) {
        return false;
      }

      // Unidade
      if (unidadeFilter !== 'TODAS' && os.unidadeId !== unidadeFilter) {
        return false;
      }

      // Oficina
      if (oficinaFilter !== 'TODAS' && os.oficinaId !== oficinaFilter) {
        return false;
      }

      return true;
    });
  }, [ordensServico, searchTerm, statusFilter, prioridadeFilter, unidadeFilter, oficinaFilter]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Número OS', 'Status', 'Prioridade', 'Prefixo', 'Placa', 'Viatura', 'Unidade', 'Oficina', 'Valor (R$)', 'Criado Em'];
    const rows = filteredOS.map((os) => {
      const u = allUnidades.find((x) => x.id === os.unidadeId)?.sigla || os.unidadeId;
      const o = allOficinas.find((x) => x.id === os.oficinaId)?.nome || 'Não atribuída';
      return [
        os.numeroOS,
        os.status,
        os.prioridade,
        os.prefixo,
        os.placa,
        `"${os.nomeViatura}"`,
        `"${u}"`,
        `"${o}"`,
        (os.valorFinal || os.valorAprovado || os.valorEstimado || 0).toFixed(2),
        new Date(os.criadoEm).toLocaleDateString('pt-BR'),
      ];
    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ordens_servico_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header with Title and New OS button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Ordens de Serviço
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Gerenciamento e acompanhamento de {filteredOS.length} ordens de serviço cadastradas
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>

          {(isMaster || isUnidade) && (
            <button
              id="btn-os-list-nova-os"
              onClick={onNavigateNew}
              className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Nova OS
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        {/* Search input and View Mode */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-os-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nº OS, prefixo, placa, viatura ou problema..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg text-xs font-medium border transition-colors ${
                viewMode === 'table'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
              title="Visualização em Tabela"
            >
              Tabela
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-lg text-xs font-medium border transition-colors ${
                viewMode === 'cards'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
              title="Visualização em Cards"
            >
              Cards
            </button>
          </div>
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          {/* Status filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Status da Etapa
            </label>
            <select
              id="select-filter-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            >
              <option value="TODOS">Todos os Status</option>
              <option value="ABERTA">Aberta</option>
              <option value="ENVIADA_A_OFICINA">Enviada à Oficina</option>
              <option value="AGUARDANDO_ORCAMENTO">Aguardando Orçamento</option>
              <option value="AGUARDANDO_APROVACAO">Aguardando Aprovação</option>
              <option value="APROVADA">Aprovada</option>
              <option value="DEVOLVIDA_PARA_CORRECAO">Devolvida para Correção</option>
              <option value="EM_EXECUCAO">Em Execução</option>
              <option value="SERVICO_CONCLUIDO">Serviço Concluído</option>
              <option value="AGUARDANDO_DOCUMENTOS">Aguardando Documentos</option>
              <option value="AGUARDANDO_CONFERENCIA">Aguardando Conferência NF</option>
              <option value="FINALIZADA">Finalizada</option>
              <option value="CANCELADA">Cancelada</option>
            </select>
          </div>

          {/* Priority filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Prioridade
            </label>
            <select
              value={prioridadeFilter}
              onChange={(e) => setPrioridadeFilter(e.target.value as any)}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            >
              <option value="TODOS">Todas as Prioridades</option>
              <option value="URGENTE">Urgente</option>
              <option value="ALTA">Alta</option>
              <option value="NORMAL">Normal</option>
              <option value="BAIXA">Baixa</option>
            </select>
          </div>

          {/* Unidade filter (if master) */}
          {isMaster ? (
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Unidade Operacional
              </label>
              <select
                value={unidadeFilter}
                onChange={(e) => setUnidadeFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              >
                <option value="TODAS">Todas as Unidades</option>
                {allUnidades.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.sigla} - {u.nome}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="hidden sm:block" />
          )}

          {/* Oficina filter */}
          {!isOficina ? (
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Oficina Credenciada
              </label>
              <select
                value={oficinaFilter}
                onChange={(e) => setOficinaFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              >
                <option value="TODAS">Todas as Oficinas</option>
                {allOficinas.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.nome}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="hidden sm:block" />
          )}
        </div>
      </div>

      {/* Main Listing View */}
      {filteredOS.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <Search className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Nenhuma ordem de serviço encontrada
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Tente ajustar os filtros ou os termos da busca acima.
          </p>
          {(statusFilter !== 'TODOS' || searchTerm || prioridadeFilter !== 'TODOS') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('TODOS');
                setPrioridadeFilter('TODOS');
                setUnidadeFilter('TODAS');
                setOficinaFilter('TODAS');
              }}
              className="mt-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400 underline"
            >
              Limpar todos os filtros
            </button>
          )}
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Número OS</th>
                  <th className="py-3.5 px-4">Status da Etapa</th>
                  <th className="py-3.5 px-4">Prioridade</th>
                  <th className="py-3.5 px-4">Viatura / Prefixo</th>
                  <th className="py-3.5 px-4">Unidade</th>
                  <th className="py-3.5 px-4">Oficina Credenciada</th>
                  <th className="py-3.5 px-4 text-right">Valor Final</th>
                  <th className="py-3.5 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredOS.map((os) => {
                  const unidade = allUnidades.find((u) => u.id === os.unidadeId);
                  const oficina = allOficinas.find((o) => o.id === os.oficinaId);
                  const valorExibicao = os.valorFinal || os.valorAprovado || os.valorEstimado || 0;

                  return (
                    <tr
                      key={os.id}
                      onClick={() => onSelectOS(os.id)}
                      className="hover:bg-indigo-50/30 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {os.numeroOS}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={os.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4">
                        <PriorityBadge prioridade={os.prioridade} />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {os.prefixo}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[140px]">
                          {os.nomeViatura} ({os.placa})
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {unidade?.sigla || os.unidadeId}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-slate-600 dark:text-slate-300 truncate max-w-[150px] block">
                          {oficina ? oficina.nome : <em className="text-slate-400">Não definida</em>}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-white">
                        R$ {valorExibicao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectOS(os.id);
                          }}
                          className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg transition-colors inline-flex items-center gap-1 font-semibold text-xs"
                          title="Abrir Detalhe da OS"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="hidden lg:inline">Detalhes</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOS.map((os) => {
            const unidade = allUnidades.find((u) => u.id === os.unidadeId);
            const oficina = allOficinas.find((o) => o.id === os.oficinaId);
            const valorExibicao = os.valorFinal || os.valorAprovado || os.valorEstimado || 0;

            return (
              <div
                key={os.id}
                onClick={() => onSelectOS(os.id)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">
                      {os.numeroOS}
                    </span>
                    <PriorityBadge prioridade={os.prioridade} />
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {os.prefixo} — {os.nomeViatura}
                      </h4>
                      <p className="text-xs text-slate-500 font-mono">
                        Placa: {os.placa} • {unidade?.sigla || os.unidadeId}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                    {os.descricaoProblema}
                  </p>

                  <div className="mt-3 space-y-1 text-xs text-slate-500">
                    <div className="flex items-center justify-between">
                      <span>Oficina:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[160px]">
                        {oficina?.nome || 'Aguardando'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Aberta em:</span>
                      <span>{new Date(os.criadoEm).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <StatusBadge status={os.status} size="sm" />
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    R$ {valorExibicao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
