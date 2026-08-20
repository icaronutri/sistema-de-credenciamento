import React from 'react';
import { OrdemServico, Unidade, Oficina } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import {
  Building2,
  Calendar,
  Car,
  Check,
  CheckCircle,
  Clock,
  DollarSign,
  FileCheck,
  FileText,
  Gauge,
  Send,
  Shield,
  User,
  Wrench,
} from 'lucide-react';

interface OSTimelineTabProps {
  os: OrdemServico;
  unidade?: Unidade;
  oficina?: Oficina;
  onNavigateTab: (tabId: string) => void;
}

export const OSTimelineTab: React.FC<OSTimelineTabProps> = ({
  os,
  unidade,
  oficina,
  onNavigateTab,
}) => {
  const STAGES = [
    { key: 'ABERTA', label: '1. Abertura' },
    { key: 'ENVIADA_A_OFICINA', label: '2. Envio Oficina' },
    { key: 'AGUARDANDO_ORCAMENTO', label: '3. Diagnóstico' },
    { key: 'AGUARDANDO_APROVACAO', label: '4. Orçamento' },
    { key: 'APROVADA', label: '5. Aprovação' },
    { key: 'EM_EXECUCAO', label: '6. Execução' },
    { key: 'SERVICO_CONCLUIDO', label: '7. Conclusão' },
    { key: 'AGUARDANDO_CONFERENCIA', label: '8. Emissão NF' },
    { key: 'FINALIZADA', label: '9. Finalização' },
  ];

  const getStageIndex = (status: string) => {
    switch (status) {
      case 'ABERTA':
        return 0;
      case 'ENVIADA_A_OFICINA':
        return 1;
      case 'AGUARDANDO_ORCAMENTO':
        return 2;
      case 'AGUARDANDO_APROVACAO':
      case 'DEVOLVIDA_PARA_CORRECAO':
        return 3;
      case 'APROVADA':
        return 4;
      case 'EM_EXECUCAO':
        return 5;
      case 'SERVICO_CONCLUIDO':
      case 'AGUARDANDO_DOCUMENTOS':
        return 6;
      case 'AGUARDANDO_CONFERENCIA':
        return 7;
      case 'FINALIZADA':
        return 8;
      case 'CANCELADA':
        return -1;
      default:
        return 0;
    }
  };

  const currentStageIndex = getStageIndex(os.status);

  return (
    <div className="space-y-6">
      {/* Workflow Stepper */}
      <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-750">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-indigo-500" />
          Progresso da Esteira Operacional (Credenciamento 2027)
        </h4>

        {os.status === 'CANCELADA' ? (
          <div className="p-4 bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 rounded-xl text-center text-xs text-zinc-600 dark:text-zinc-300 font-semibold">
            Esta Ordem de Serviço foi <strong>CANCELADA</strong>. {os.motivoCancelamento && `Motivo: ${os.motivoCancelamento}`}
          </div>
        ) : (
          <div className="overflow-x-auto pb-2">
            <div className="flex items-center min-w-[720px] justify-between relative">
              {/* Connecting Line */}
              <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-200 dark:bg-slate-700 -translate-y-1/2 z-0" />
              <div
                className="absolute top-1/2 left-4 h-1 bg-indigo-600 -translate-y-1/2 z-0 transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.max(0, (currentStageIndex / (STAGES.length - 1)) * 100))}%`,
                }}
              />

              {STAGES.map((stage, idx) => {
                const isCompleted = currentStageIndex > idx || os.status === 'FINALIZADA';
                const isCurrent = currentStageIndex === idx && os.status !== 'FINALIZADA';

                return (
                  <div key={stage.key} className="relative z-10 flex flex-col items-center group">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                        isCompleted
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-950'
                          : isCurrent
                          ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-950 animate-pulse'
                          : 'bg-white dark:bg-slate-900 text-slate-400 border-2 border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[11px] mt-2 text-center font-medium max-w-[80px] leading-tight ${
                        isCurrent
                          ? 'font-bold text-indigo-600 dark:text-indigo-400'
                          : isCompleted
                          ? 'text-slate-800 dark:text-slate-200'
                          : 'text-slate-400'
                      }`}
                    >
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Viatura & Unidade Specs */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
              <Car className="w-4 h-4 text-indigo-500" />
              Identificação da Viatura
            </h4>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
              {os.placa}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Prefixo</span>
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">{os.prefixo}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Hodômetro Abertura</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {(os.quilometragemMomento ?? 0).toLocaleString('pt-BR')} km
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Modelo</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{os.nomeViatura}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Unidade Gestora</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{unidade?.sigla || os.unidadeId}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tipo de Manutenção</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{os.tipoManutencao.replace(/_/g, ' ')}</span>
            </div>
          </div>
        </div>

        {/* Financial & Workshop Summary */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              Valores & Oficina Credenciada
            </h4>
            <PriorityBadge prioridade={os.prioridade} />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Oficina Designada</span>
              <span className="font-bold text-slate-900 dark:text-white truncate block">
                {oficina ? oficina.nome : 'Não designada'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">CNPJ da Oficina</span>
              <span className="font-mono text-slate-600 dark:text-slate-300">{oficina?.cnpj || '—'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Valor Aprovado</span>
              <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                R$ {(os.valorAprovado || os.valorFinal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Estimativa Inicial</span>
              <span className="font-medium text-slate-600 dark:text-slate-300">
                {os.valorEstimado ? `R$ ${os.valorEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Não informada'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Description & Workshop Technical Diagnosis */}
      <div className="space-y-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <h4 className="text-xs font-bold uppercase text-slate-500 mb-2 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-slate-400" />
            Relato Inicial da Unidade (Sintomas / Falhas)
          </h4>
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            {os.descricaoProblema}
          </p>
        </div>

        {os.diagnosticoTecnico && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <h4 className="text-xs font-bold uppercase text-indigo-500 mb-2 flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-indigo-500" />
              Diagnóstico Técnico Emitido pela Oficina
            </h4>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-indigo-50/40 dark:bg-indigo-950/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900">
              {os.diagnosticoTecnico}
            </p>
          </div>
        )}

        {os.motivoRejeicaoNF && (
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl p-5 shadow-xs">
            <h4 className="text-xs font-bold uppercase text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-rose-600" />
              Pendência Registrada na Conferência da Nota Fiscal
            </h4>
            <p className="text-xs sm:text-sm text-rose-900 dark:text-rose-200 leading-relaxed">
              {os.motivoRejeicaoNF}
            </p>
          </div>
        )}
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-750 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="text-slate-600 dark:text-slate-300 font-medium">
          Ações rápidas desta ordem de serviço:
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onNavigateTab('orcamento')}
            className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-semibold transition-colors flex items-center gap-1.5"
          >
            <Wrench className="w-3.5 h-3.5 text-indigo-500" />
            Itens do Orçamento
          </button>
          <button
            onClick={() => onNavigateTab('documentos')}
            className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-semibold transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-500" />
            Documentos & Laudos
          </button>
          <button
            onClick={() => onNavigateTab('conferencia')}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <FileCheck className="w-3.5 h-3.5" />
            Conferência NF
          </button>
        </div>
      </div>
    </div>
  );
};
