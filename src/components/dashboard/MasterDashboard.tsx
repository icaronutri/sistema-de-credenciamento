import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusOS, OrdemServico } from '../../types';
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Car,
  CheckCircle,
  Clock,
  DollarSign,
  FileCheck,
  FileText,
  PlusCircle,
  Send,
  TrendingUp,
  Wrench,
} from 'lucide-react';

interface MasterDashboardProps {
  onSelectOS: (osId: string) => void;
  onNavigate: (view: any) => void;
  onFilterStatus?: (status: StatusOS) => void;
}

export const MasterDashboard: React.FC<MasterDashboardProps> = ({
  onSelectOS,
  onNavigate,
}) => {
  const { ordensServico, allViaturas, allOficinas, allUnidades } = useData();

  // Metrics by Status
  const countsByStatus = useMemo(() => {
    const counts: Record<StatusOS, number> = {
      ABERTA: 0,
      ENVIADA_A_OFICINA: 0,
      AGUARDANDO_ORCAMENTO: 0,
      AGUARDANDO_APROVACAO: 0,
      APROVADA: 0,
      DEVOLVIDA_PARA_CORRECAO: 0,
      EM_EXECUCAO: 0,
      SERVICO_CONCLUIDO: 0,
      AGUARDANDO_DOCUMENTOS: 0,
      AGUARDANDO_CONFERENCIA: 0,
      FINALIZADA: 0,
      CANCELADA: 0,
    };
    ordensServico.forEach((os) => {
      if (counts[os.status] !== undefined) {
        counts[os.status]++;
      }
    });
    return counts;
  }, [ordensServico]);

  // Financial Stats
  const financialStats = useMemo(() => {
    let totalAprovado = 0;
    let totalEmExecucao = 0;
    let totalFinalizado = 0;
    let totalAguardandoAprovacao = 0;

    ordensServico.forEach((os) => {
      const valor = os.valorFinal || os.valorAprovado || os.valorEstimado || 0;
      if (os.status === 'FINALIZADA') totalFinalizado += valor;
      else if (os.status === 'EM_EXECUCAO' || os.status === 'SERVICO_CONCLUIDO') totalEmExecucao += valor;
      else if (os.status === 'AGUARDANDO_APROVACAO') totalAguardandoAprovacao += valor;
      if (os.status !== 'CANCELADA') totalAprovado += valor;
    });

    return { totalAprovado, totalEmExecucao, totalFinalizado, totalAguardandoAprovacao };
  }, [ordensServico]);

  // Pending Actions
  const pendingApprovals = useMemo(
    () => (ordensServico || []).filter((os) => os.status === 'AGUARDANDO_APROVACAO'),
    [ordensServico]
  );
  const pendingConferences = useMemo(
    () => (ordensServico || []).filter((os) => os.status === 'AGUARDANDO_CONFERENCIA'),
    [ordensServico]
  );
  const urgentOS = useMemo(
    () =>
      (ordensServico || [])
        .filter((os) => os.prioridade === 'URGENTE' && os.status !== 'FINALIZADA' && os.status !== 'CANCELADA')
        .slice(0, 5),
    [ordensServico]
  );

  // Workshop distribution
  const workshopMetrics = useMemo(() => {
    return (allOficinas || []).map((oficina) => {
      const ofOS = (ordensServico || []).filter((os) => os.oficinaId === oficina.id);
      const ativas = ofOS.filter((os) => os.status !== 'FINALIZADA' && os.status !== 'CANCELADA');
      const totalGasto = ofOS
        .filter((os) => os.status === 'FINALIZADA')
        .reduce((acc, os) => acc + (os.valorFinal || os.valorAprovado || 0), 0);
      return {
        ...oficina,
        totalOS: ofOS.length,
        ativasCount: ativas.length,
        totalGasto,
      };
    });
  }, [allOficinas, ordensServico]);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Welcome & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Painel Geral de Controle
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              Exercício 2027
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Supervisão centralizada de {ordensServico.length} ordens de serviço em {allUnidades.length} unidades e {allOficinas.length} oficinas credenciadas.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('conferencia_nf')}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <FileCheck className="w-4 h-4" />
            Conferência NF ({pendingConferences.length})
          </button>
          <button
            onClick={() => onNavigate('os_new')}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Nova OS
          </button>
        </div>
      </div>

      {/* Critical Alert Banners (if pending items exist) */}
      {(pendingApprovals.length > 0 || pendingConferences.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingApprovals.length > 0 && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-300">
                    {pendingApprovals.length} Orçamento(s) Aguardando Sua Aprovação
                  </h4>
                  <p className="text-xs text-amber-200/80">
                    Total em análise: R$ {(financialStats.totalAguardandoAprovacao || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('os_list')}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold shrink-0 transition-colors"
              >
                Avaliar
              </button>
            </div>
          )}

          {pendingConferences.length > 0 && (
            <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg shrink-0">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-indigo-300">
                    {pendingConferences.length} Nota(s) Fiscal(is) Aguardando Conferência
                  </h4>
                  <p className="text-xs text-indigo-200/80">
                    Valide os valores e sincronize com a pasta Google Drive
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('conferencia_nf')}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shrink-0 transition-colors"
              >
                Conferir
              </button>
            </div>
          )}
        </div>
      )}

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Total Faturado / Pago</span>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            R$ {(financialStats.totalFinalizado || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {countsByStatus.FINALIZADA} ordens finalizadas
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Em Manutenção Ativa</span>
            <div className="p-2 bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 rounded-lg">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            R$ {(financialStats.totalEmExecucao || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {countsByStatus.EM_EXECUCAO + countsByStatus.SERVICO_CONCLUIDO} viaturas na oficina
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Frota Cadastrada</span>
            <div className="p-2 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {(allViaturas || []).length} Viaturas
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {(allViaturas || []).filter((v) => v.status === 'EM_MANUTENCAO').length} baixadas para reparo
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Rede Credenciada</span>
            <div className="p-2 bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-lg">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {(allOficinas || []).length} Oficinas
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {(allOficinas || []).filter((o) => o.statusCredenciamento === 'ATIVO').length} homologadas ativas
          </div>
        </div>
      </div>

      {/* 12-Stage Pipeline Visual Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Esteira de Fluxo das Ordens de Serviço (Pipeline)
            </h3>
            <p className="text-xs text-slate-500">
              Distribuição em tempo real das 12 etapas do processo de manutenção
            </p>
          </div>
          <button
            onClick={() => onNavigate('os_list')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            Ver todas as OS <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {(
            [
              { status: 'ABERTA', label: 'Aberta' },
              { status: 'ENVIADA_A_OFICINA', label: 'Enviada Oficina' },
              { status: 'AGUARDANDO_ORCAMENTO', label: 'Aguard. Orçamento' },
              { status: 'AGUARDANDO_APROVACAO', label: 'Aguard. Aprovação' },
              { status: 'APROVADA', label: 'Aprovada' },
              { status: 'DEVOLVIDA_PARA_CORRECAO', label: 'Devolvida Correção' },
              { status: 'EM_EXECUCAO', label: 'Em Execução' },
              { status: 'SERVICO_CONCLUIDO', label: 'Serviço Concluído' },
              { status: 'AGUARDANDO_DOCUMENTOS', label: 'Aguard. Docs' },
              { status: 'AGUARDANDO_CONFERENCIA', label: 'Aguard. Conf. NF' },
              { status: 'FINALIZADA', label: 'Finalizada' },
              { status: 'CANCELADA', label: 'Cancelada' },
            ] as { status: StatusOS; label: string }[]
          ).map((item) => {
            const count = countsByStatus[item.status];
            return (
              <div
                key={item.status}
                onClick={() => onNavigate('os_list')}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-indigo-400 hover:bg-indigo-50/20 dark:hover:bg-slate-800 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 truncate">
                    {item.label}
                  </span>
                  <span
                    className={`text-sm font-extrabold px-2 py-0.5 rounded-full ${
                      count > 0
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Urgent Items & Workshop Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Urgent / Priority OS Queue */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Viaturas em Atenção Urgente / Alta Prioridade
                </h3>
              </div>
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-300 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                {urgentOS.length} ativas
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {urgentOS.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  Nenhuma ordem de serviço com prioridade urgente em andamento.
                </div>
              ) : (
                urgentOS.map((os) => (
                  <div
                    key={os.id}
                    onClick={() => onSelectOS(os.id)}
                    className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 rounded-xl transition-colors cursor-pointer"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400">
                          {os.numeroOS}
                        </span>
                        <PriorityBadge prioridade={os.prioridade} />
                        <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {os.prefixo} — {os.nomeViatura}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-1">
                        {os.descricaoProblema}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <StatusBadge status={os.status} size="sm" />
                      <div className="text-[11px] font-bold text-slate-900 dark:text-white mt-1">
                        R$ {(os.valorFinal || os.valorEstimado || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigate('os_list')}
            className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs transition-colors text-center"
          >
            Abrir Fila Completa de Ordens de Serviço
          </button>
        </div>

        {/* Right: Workshop Performance / Accreditation */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-indigo-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Oficinas Credenciadas
                </h3>
              </div>
              <button
                onClick={() => onNavigate('oficinas')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Gerenciar
              </button>
            </div>

            <div className="space-y-3">
              {workshopMetrics.map((oficina) => (
                <div
                  key={oficina.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white truncate">
                        {oficina.nome}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {oficina.cidade}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {oficina.especialidades.slice(0, 2).join(', ')}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-indigo-600 dark:text-indigo-400">
                      {oficina.ativasCount} ativas
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Total: R$ {(oficina.totalGasto || 0).toLocaleString('pt-BR', { notation: 'compact' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Contratos vigentes até: <strong>31/12/2027</strong></span>
            <span className="text-emerald-500 font-bold">100% Homologado</span>
          </div>
        </div>
      </div>
    </div>
  );
};
