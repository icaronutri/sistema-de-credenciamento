import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import {
  AlertCircle,
  Building2,
  Car,
  CheckCircle2,
  Clock,
  DollarSign,
  FilePlus2,
  PlusCircle,
  ShieldAlert,
  Wrench,
} from 'lucide-react';

interface UnidadeDashboardProps {
  onSelectOS: (osId: string) => void;
  onNavigate: (view: any) => void;
}

export const UnidadeDashboard: React.FC<UnidadeDashboardProps> = ({
  onSelectOS,
  onNavigate,
}) => {
  const { currentUser, unidadeAtual } = useAuth();
  const { viaturas, ordensServico, allOficinas } = useData();

  // Fleet breakdown
  const fleetStats = useMemo(() => {
    const vtrs = viaturas || [];
    const total = vtrs.length;
    const disponiveis = vtrs.filter((v) => v.status === 'DISPONIVEL').length;
    const emManutencao = vtrs.filter((v) => v.status === 'EM_MANUTENCAO').length;
    const inativas = vtrs.filter((v) => v.status === 'INATIVA' || v.status === 'BAIXADA').length;
    const disponibilidadePct = total > 0 ? ((disponiveis / total) * 100).toFixed(1) : '100';

    return { total, disponiveis, emManutencao, inativas, disponibilidadePct };
  }, [viaturas]);

  // Active OS for this unit
  const activeOS = useMemo(() => {
    return (ordensServico || []).filter((os) => os.status !== 'FINALIZADA' && os.status !== 'CANCELADA');
  }, [ordensServico]);

  // Unit Gasto Total
  const totalGasto = useMemo(() => {
    return (ordensServico || [])
      .filter((os) => os.status === 'FINALIZADA')
      .reduce((acc, os) => acc + (os.valorFinal || os.valorAprovado || 0), 0);
  }, [ordensServico]);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-6 rounded-2xl border border-emerald-800/60 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              {unidadeAtual?.sigla || 'UNIDADE'}
            </span>
            <span className="text-xs text-slate-300">Gestão Local de Frota</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            {unidadeAtual?.nome || 'Unidade Operacional'}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            {unidadeAtual?.cidade} • Responsável: {unidadeAtual?.responsavelNome} ({unidadeAtual?.responsavelCargo})
          </p>
        </div>

        <button
          id="btn-unidade-nova-os"
          onClick={() => onNavigate('os_new')}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Solicitar Manutenção (Nova OS)
        </button>
      </div>

      {/* Fleet Readiness Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Disponibilidade Operacional</span>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {fleetStats.disponibilidadePct}%
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {fleetStats.disponiveis} de {fleetStats.total} viaturas em serviço
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Em Manutenção</span>
            <div className="p-2 bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-lg">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-amber-600 dark:text-amber-400">
            {fleetStats.emManutencao}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {activeOS.length} ordens ativas
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Total da Frota da Unidade</span>
            <div className="p-2 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-white">
            {fleetStats.total}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Prefixo {unidadeAtual?.sigla || 'VTR'}
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Custo Total Executado</span>
            <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-xl font-extrabold text-slate-900 dark:text-white">
            R$ {totalGasto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {ordensServico.filter((os) => os.status === 'FINALIZADA').length} OS finalizadas
          </div>
        </div>
      </div>

      {/* Active Maintenance Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Viaturas em Manutenção / Acompanhamento em Tempo Real
            </h3>
            <p className="text-xs text-slate-500">
              Acompanhe o andamento das ordens abertas para sua unidade
            </p>
          </div>
          <button
            onClick={() => onNavigate('os_list')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Ver histórico completo
          </button>
        </div>

        {activeOS.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Toda a frota está operacional!
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Não há ordens de serviço pendentes para esta unidade. Caso necessite de reparo, abra uma nova OS.
            </p>
            <button
              onClick={() => onNavigate('os_new')}
              className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold inline-flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Abrir OS para Viatura
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {activeOS.map((os) => {
              const oficina = allOficinas.find((o) => o.id === os.oficinaId);
              return (
                <div
                  key={os.id}
                  onClick={() => onSelectOS(os.id)}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 p-3 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 shrink-0">
                      <Car className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400">
                          {os.numeroOS}
                        </span>
                        <PriorityBadge prioridade={os.prioridade} />
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {os.prefixo} — {os.nomeViatura}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">({os.placa})</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-1">
                        <strong>Problema:</strong> {os.descricaoProblema}
                      </p>
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-3">
                        <span>Oficina: <strong>{oficina ? oficina.nome : 'Aguardando atribuição'}</strong></span>
                        <span>Aberta em: {new Date(os.criadoEm).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center sm:flex-col items-end justify-between sm:justify-center shrink-0">
                    <StatusBadge status={os.status} />
                    {os.valorFinal !== undefined && os.valorFinal !== null && (
                      <span className="text-xs font-bold text-slate-900 dark:text-white sm:mt-1.5">
                        R$ {(os.valorFinal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Fleet quick catalog */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Viaturas Alocadas ({viaturas.length})
          </h3>
          <button
            onClick={() => onNavigate('viaturas')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Ver detalhes da frota
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {viaturas.map((vtr) => (
            <div
              key={vtr.id}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3 text-xs"
            >
              <div className="min-w-0">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                  <span>{vtr.prefixo}</span>
                  <span className="font-normal text-slate-500">• {vtr.marca} {vtr.modelo}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Placa: <strong className="font-mono text-slate-700 dark:text-slate-300">{vtr.placa}</strong> • {(vtr.quilometragem ?? vtr.odometroAtual ?? 0).toLocaleString('pt-BR')} km
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                  vtr.status === 'DISPONIVEL'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : vtr.status === 'EM_MANUTENCAO'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {vtr.status === 'DISPONIVEL' ? 'Pronta' : vtr.status === 'EM_MANUTENCAO' ? 'Em Reparo' : vtr.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
