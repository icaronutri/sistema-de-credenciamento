import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { OrdemServico } from '../../types';
import {
  Wrench,
  CheckCircle,
  Play,
  Clock,
  FileCheck,
  Calendar,
  Gauge,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface OSExecutionTabProps {
  os: OrdemServico;
  onUpdateOS: (updated: Partial<OrdemServico>) => void;
  onNavigateTab: (tabId: string) => void;
}

export const OSExecutionTab: React.FC<OSExecutionTabProps> = ({
  os,
  onUpdateOS,
  onNavigateTab,
}) => {
  const { permissoes } = useAuth();
  const { changeStatusOS } = useData();

  const [obsExecucao, setObsExecucao] = useState('');
  const [kmFinal, setKmFinal] = useState<number>(os.quilometragemMomento || 0);

  const canExecute = permissoes.isOficina || permissoes.isMaster;

  const handleStartExecution = () => {
    changeStatusOS(
      os.id,
      'EM_EXECUCAO',
      'Início oficial dos serviços de manutenção na oficina.',
      { dataInicio: new Date().toISOString() }
    );
  };

  const handleFinishExecution = () => {
    if (confirm('Confirma a conclusão integral dos serviços mecânicos autorizados para esta viatura?')) {
      changeStatusOS(
        os.id,
        'SERVICO_CONCLUIDO',
        `Serviço mecânico concluído pela oficina. ${obsExecucao ? `Obs: ${obsExecucao}` : ''}`,
        { dataConclusao: new Date().toISOString() }
      );
      onNavigateTab('documentos');
    }
  };

  const isApproved = os.status === 'APROVADA';
  const isExecuting = os.status === 'EM_EXECUCAO';
  const isCompleted =
    os.status === 'SERVICO_CONCLUIDO' ||
    os.status === 'AGUARDANDO_DOCUMENTOS' ||
    os.status === 'AGUARDANDO_CONFERENCIA' ||
    os.status === 'FINALIZADA';

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      {isCompleted ? (
        <div className="p-6 bg-teal-50 dark:bg-teal-950/40 border border-teal-300 dark:border-teal-800 rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-teal-100 dark:bg-teal-900/60 text-teal-600 dark:text-teal-400 rounded-xl shrink-0">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-200 dark:bg-teal-900 text-teal-900 dark:text-teal-200">
              SERVIÇO MECÂNICO FINALIZADO
            </div>
            <h3 className="text-base font-bold text-teal-950 dark:text-teal-100 mt-1">
              Reparos Concluídos com Sucesso
            </h3>
            <p className="text-xs text-teal-800 dark:text-teal-300 mt-0.5">
              Concluído em: {os.dataConclusao ? new Date(os.dataConclusao).toLocaleString('pt-BR') : 'Data registrada'}. Próxima etapa: Anexação da Nota Fiscal e Documentos.
            </p>
          </div>
        </div>
      ) : isExecuting ? (
        <div className="p-6 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-300 dark:border-cyan-800 rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-cyan-100 dark:bg-cyan-900/60 text-cyan-600 dark:text-cyan-400 rounded-xl shrink-0">
            <Wrench className="w-8 h-8 animate-spin" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-200 dark:bg-cyan-900 text-cyan-900 dark:text-cyan-200">
              EM MANUTENÇÃO ATIVA NA OFICINA
            </div>
            <h3 className="text-base font-bold text-cyan-950 dark:text-cyan-100 mt-1">
              Serviços em Execução
            </h3>
            <p className="text-xs text-cyan-800 dark:text-cyan-300 mt-0.5">
              Iniciado em: {os.dataInicio ? new Date(os.dataInicio).toLocaleString('pt-BR') : 'Data registrada'}.
            </p>
          </div>
        </div>
      ) : isApproved ? (
        <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
            <Play className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
              ORÇAMENTO AUTORIZADO
            </div>
            <h3 className="text-base font-bold text-emerald-950 dark:text-emerald-100 mt-1">
              Pronta para Iniciar Execução
            </h3>
            <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5">
              O Master aprovou esta OS. A oficina credenciada já pode dar início à desmontagem e aplicação das peças autorizadas.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-750 rounded-2xl">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Aguardando Aprovação Prévia
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Os serviços mecânicos só podem ser iniciados após a aprovação formal do orçamento pelo Master.
          </p>
        </div>
      )}

      {/* Execution Details & Control Actions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <h4 className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-indigo-500" />
          Cronograma & Registros Técnicos de Oficina
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-750">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Envio à Oficina</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {os.dataEnvioOficina ? new Date(os.dataEnvioOficina).toLocaleDateString('pt-BR') : '—'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-750">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Início da Execução</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {os.dataInicio ? new Date(os.dataInicio).toLocaleDateString('pt-BR') : '—'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-750">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Conclusão Mecânica</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {os.dataConclusao ? new Date(os.dataConclusao).toLocaleDateString('pt-BR') : '—'}
            </span>
          </div>
        </div>

        {/* Action triggers */}
        {canExecute && isApproved && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              id="btn-iniciar-execucao"
              onClick={handleStartExecution}
              className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Iniciar Execução dos Serviços
            </button>
          </div>
        )}

        {canExecute && isExecuting && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Anotações de Conclusão / Observações do Mecânico
              </label>
              <textarea
                rows={3}
                value={obsExecucao}
                onChange={(e) => setObsExecucao(e.target.value)}
                placeholder="Ex: Realizada troca de óleo, pastilhas e alinhamento computadorizado. Teste de rodagem aprovado sem ruídos."
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                id="btn-concluir-servico"
                onClick={handleFinishExecution}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Concluir Serviço Mecânico & Prosseguir para NF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
