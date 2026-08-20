import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import {
  AlertCircle,
  Award,
  CheckCircle,
  Clock,
  DollarSign,
  FileSpreadsheet,
  FileText,
  RotateCcw,
  Sparkles,
  Wrench,
} from 'lucide-react';

interface OficinaDashboardProps {
  onSelectOS: (osId: string) => void;
  onNavigate: (view: any) => void;
}

export const OficinaDashboard: React.FC<OficinaDashboardProps> = ({
  onSelectOS,
  onNavigate,
}) => {
  const { oficinaAtual } = useAuth();
  const { ordensServico } = useData();

  // Workflow Categorized Queues
  const filaDiagnostico = useMemo(
    () =>
      (ordensServico || []).filter(
        (os) => os.status === 'ENVIADA_A_OFICINA' || os.status === 'AGUARDANDO_ORCAMENTO'
      ),
    [ordensServico]
  );

  const filaDevolvidas = useMemo(
    () => (ordensServico || []).filter((os) => os.status === 'DEVOLVIDA_PARA_CORRECAO'),
    [ordensServico]
  );

  const filaExecucao = useMemo(
    () => (ordensServico || []).filter((os) => os.status === 'APROVADA' || os.status === 'EM_EXECUCAO'),
    [ordensServico]
  );

  const filaEmitirNF = useMemo(
    () =>
      (ordensServico || []).filter(
        (os) => os.status === 'SERVICO_CONCLUIDO' || os.status === 'AGUARDANDO_DOCUMENTOS'
      ),
    [ordensServico]
  );

  const filaFinalizadas = useMemo(
    () => (ordensServico || []).filter((os) => os.status === 'FINALIZADA'),
    [ordensServico]
  );

  // Financial calculations
  const totalEmExecucao = useMemo(() => {
    return filaExecucao.reduce((acc, os) => acc + (os.valorAprovado || os.valorFinal || 0), 0);
  }, [filaExecucao]);

  const totalFaturado = useMemo(() => {
    return filaFinalizadas.reduce((acc, os) => acc + (os.valorFinal || os.valorAprovado || 0), 0);
  }, [filaFinalizadas]);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Workshop Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 text-white p-6 rounded-2xl border border-amber-800/60 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Oficina Credenciada 2027
            </span>
            <span className="text-xs text-slate-300">CNPJ: {oficinaAtual?.cnpj || '12.345.678/0001-90'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            {oficinaAtual?.nome || 'Oficina Credenciada'}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            {oficinaAtual?.endereco || 'Endereço cadastrado'}{oficinaAtual?.cidade ? `, ${oficinaAtual.cidade}` : ''} • Especialidades: {oficinaAtual?.especialidades?.join(', ') || 'Mecânica Geral'}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-700 text-xs">
          <Award className="w-6 h-6 text-amber-400 shrink-0" />
          <div>
            <div className="font-bold text-white">Avaliação Técnica: {oficinaAtual?.avaliacao || 5.0} / 5.0</div>
            <div className="text-[11px] text-slate-400">Credenciamento Homologado</div>
          </div>
        </div>
      </div>

      {/* Critical Action Banner: Returned Quotes requiring correction */}
      {filaDevolvidas.length > 0 && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-500/20 text-rose-400 rounded-lg shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-300">
                {filaDevolvidas.length} Orçamento(s) Devolvido(s) pelo Master para Correção
              </h4>
              <p className="text-xs text-rose-200/80">
                Verifique as observações do fiscal e ajuste os valores/itens para reenvio.
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectOS(filaDevolvidas[0].id)}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shrink-0 transition-colors"
          >
            Ajustar Orçamento
          </button>
        </div>
      )}

      {/* Workshop Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Para Orçar / Diagnosticar</span>
            <div className="p-2 bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-blue-600 dark:text-blue-400">
            {filaDiagnostico.length}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Aguardando laudo técnico
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Em Execução Aprovada</span>
            <div className="p-2 bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 rounded-lg">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-cyan-600 dark:text-cyan-400">
            {filaExecucao.length}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            R$ {(totalEmExecucao || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Aguardando Emissão NF</span>
            <div className="p-2 bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-lg">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-purple-600 dark:text-purple-400">
            {filaEmitirNF.length}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Serviço pronto • Anexar NF-e
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Total Faturado 2027</span>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-xl font-extrabold text-slate-900 dark:text-white">
            R$ {(totalFaturado || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {filaFinalizadas.length} ordens liquidadas
          </div>
        </div>
      </div>

      {/* Main Workshop Work queues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Queue 1: Diagnóstico e Orçamentos */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Viaturas para Diagnóstico / Elaboração de Orçamento
                </h3>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                {filaDiagnostico.length}
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filaDiagnostico.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Nenhuma viatura aguardando diagnóstico neste momento.
                </div>
              ) : (
                filaDiagnostico.map((os) => (
                  <div
                    key={os.id}
                    onClick={() => onSelectOS(os.id)}
                    className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 rounded-xl transition-colors cursor-pointer"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400">
                          {os.numeroOS}
                        </span>
                        <PriorityBadge prioridade={os.prioridade} />
                        <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {os.prefixo} — {os.nomeViatura}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-1">
                        {os.descricaoProblema}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectOS(os.id);
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shrink-0 transition-colors"
                    >
                      Preencher Orçamento
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-4 border-t border-slate-100 dark:border-slate-800 pt-3">
            Preencha o diagnóstico técnico e a lista detalhada de peças e mão de obra para submeter à aprovação do Master.
          </p>
        </div>

        {/* Queue 2: Em Execução / Prontas */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Serviços Autorizados & Em Execução
                </h3>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300">
                {filaExecucao.length}
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filaExecucao.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Nenhuma ordem em execução no momento.
                </div>
              ) : (
                filaExecucao.map((os) => (
                  <div
                    key={os.id}
                    onClick={() => onSelectOS(os.id)}
                    className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 rounded-xl transition-colors cursor-pointer"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400">
                          {os.numeroOS}
                        </span>
                        <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {os.prefixo} — {os.nomeViatura}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Valor Aprovado: <strong className="text-emerald-600 dark:text-emerald-400">R$ {(os.valorAprovado || os.valorFinal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                      </div>
                    </div>
                    <StatusBadge status={os.status} size="sm" />
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">Prazo médio de execução: <strong>48h a 72h</strong></span>
            <button
              onClick={() => onNavigate('os_list')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Ver todas as ordens
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
