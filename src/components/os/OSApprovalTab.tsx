import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { OrdemServico } from '../../types';
import { ConfirmModal } from '../common/ConfirmModal';
import {
  CheckCircle,
  RotateCcw,
  XCircle,
  ShieldCheck,
  DollarSign,
  AlertTriangle,
  Clock,
  User,
  Calendar,
  Lock,
} from 'lucide-react';

interface OSApprovalTabProps {
  os: OrdemServico;
}

export const OSApprovalTab: React.FC<OSApprovalTabProps> = ({ os }) => {
  const { currentUser, perfil, permissoes } = useAuth();
  const { changeStatusOS, getItensByOS } = useData();

  const isMaster = permissoes.isMaster;
  const itens = getItensByOS(os.id);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'APROVAR' | 'DEVOLVER' | 'CANCELAR' | null;
  }>({ isOpen: false, type: null });

  const valorTotal = os.valorFinal || itens.reduce((acc, i) => acc + (i.valorTotal || i.quantidade * i.valorUnitario), 0);

  const handleActionConfirm = (reason?: string) => {
    if (modalState.type === 'APROVAR') {
      changeStatusOS(
        os.id,
        'APROVADA',
        `Orçamento aprovado pelo Master no valor de R$ ${valorTotal.toFixed(2)}.`,
        {
          valorAprovado: valorTotal,
          dataAprovacao: new Date().toISOString(),
          responsavelId: currentUser.id,
        }
      );
    } else if (modalState.type === 'DEVOLVER') {
      changeStatusOS(
        os.id,
        'DEVOLVIDA_PARA_CORRECAO',
        reason || 'Orçamento devolvido para ajuste.',
        {
          motivoRejeicaoNF: reason,
        }
      );
    } else if (modalState.type === 'CANCELAR') {
      changeStatusOS(
        os.id,
        'CANCELADA',
        reason || 'Cancelamento solicitado.',
        {
          motivoCancelamento: reason,
          dataCancelamento: new Date().toISOString(),
        }
      );
    }
    setModalState({ isOpen: false, type: null });
  };

  const isAwaitingApproval = os.status === 'AGUARDANDO_APROVACAO';
  const isApproved = os.status === 'APROVADA' || os.status === 'EM_EXECUCAO' || os.status === 'SERVICO_CONCLUIDO' || os.status === 'AGUARDANDO_DOCUMENTOS' || os.status === 'AGUARDANDO_CONFERENCIA' || os.status === 'FINALIZADA';

  return (
    <div className="space-y-6">
      {/* Approval Status Header */}
      {isApproved ? (
        <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
              ORÇAMENTO AUTORIZADO PELO MASTER
            </div>
            <h3 className="text-base font-bold text-emerald-950 dark:text-emerald-100">
              Valor Autorizado: R$ {(os.valorAprovado || os.valorFinal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-xs text-emerald-800 dark:text-emerald-300">
              Aprovado em {os.dataAprovacao ? new Date(os.dataAprovacao).toLocaleString('pt-BR') : 'Data registrada'} por <strong>{os.criadaPor || 'Fiscal de Manutenção'}</strong>.
            </p>
          </div>
        </div>
      ) : isAwaitingApproval ? (
        <div className="p-6 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 rounded-xl shrink-0">
            <Clock className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
              AGUARDANDO DELIBERAÇÃO DO MASTER
            </div>
            <h3 className="text-base font-bold text-amber-950 dark:text-amber-100">
              Orçamento Submetido: R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-xs text-amber-800 dark:text-amber-300">
              A oficina credenciada submeteu a cotação com {itens.length} itens para avaliação e autorização de início das obras.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-750 rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl shrink-0">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Status Atual: {os.status.replace(/_/g, ' ')}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              A etapa de aprovação formal estará disponível assim que a oficina concluir o diagnóstico técnico e submeter a cotação de itens.
            </p>
          </div>
        </div>
      )}

      {/* Item summary for fast approval inspection */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
        <h4 className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
          <DollarSign className="w-4 h-4 text-emerald-500" />
          Resumo dos Valores Submetidos
        </h4>
        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {itens.map((item) => (
            <div key={item.id} className="py-2 flex items-center justify-between">
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {item.quantidade}x {item.descricao} ({item.tipo})
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                R$ {(item.valorTotal || item.quantidade * item.valorUnitario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
          <div className="pt-3 flex items-center justify-between font-extrabold text-sm text-slate-900 dark:text-white">
            <span>Valor Total Proposto:</span>
            <span className="text-indigo-600 dark:text-indigo-400">
              R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Master Decision Controls */}
      {isMaster && isAwaitingApproval && (
        <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-lg space-y-4">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              Painel de Decisão Master / Fiscal do Contrato
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Avalie a compatibilidade dos valores com a tabela referencial do Credenciamento 2027 e emita sua deliberação.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              id="btn-aprovar-orcamento"
              onClick={() => setModalState({ isOpen: true, type: 'APROVAR' })}
              className="w-full sm:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Aprovar Orçamento (R$ {valorTotal.toFixed(2)})
            </button>

            <button
              id="btn-devolver-orcamento"
              onClick={() => setModalState({ isOpen: true, type: 'DEVOLVER' })}
              className="w-full sm:w-auto px-4 py-2.5 bg-amber-600/80 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Devolver para Ajuste
            </button>

            <button
              id="btn-cancelar-os"
              onClick={() => setModalState({ isOpen: true, type: 'CANCELAR' })}
              className="w-full sm:w-auto px-4 py-2.5 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Cancelar OS
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={modalState.isOpen && modalState.type === 'APROVAR'}
        title="Aprovar Orçamento da Ordem de Serviço"
        description={`Confirma a aprovação técnica e financeira no valor total de R$ ${valorTotal.toLocaleString(
          'pt-BR',
          { minimumFractionDigits: 2 }
        )}? A oficina será autorizada a iniciar imediatamente os serviços.`}
        confirmText="Confirmar Aprovação"
        variant="success"
        onConfirm={handleActionConfirm}
        onCancel={() => setModalState({ isOpen: false, type: null })}
      />

      <ConfirmModal
        isOpen={modalState.isOpen && modalState.type === 'DEVOLVER'}
        title="Devolver Orçamento para Correção da Oficina"
        description="A OS voltará para a fila da oficina credenciada para retificação dos itens ou valores."
        confirmText="Devolver à Oficina"
        variant="warning"
        requireReason={true}
        reasonLabel="Instruções de Correção para a Oficina"
        reasonPlaceholder="Ex: Favor reavaliar o preço unitário do item 2 ou remover a peça X..."
        onConfirm={handleActionConfirm}
        onCancel={() => setModalState({ isOpen: false, type: null })}
      />

      <ConfirmModal
        isOpen={modalState.isOpen && modalState.type === 'CANCELAR'}
        title="Cancelar Ordem de Serviço"
        description="Esta ação cancelará definitivamente esta OS e liberará a viatura no cadastro da frota."
        confirmText="Sim, Cancelar OS"
        variant="danger"
        requireReason={true}
        reasonLabel="Motivo Formal do Cancelamento"
        reasonPlaceholder="Ex: Viatura transferida de unidade ou serviço não mais necessário..."
        onConfirm={handleActionConfirm}
        onCancel={() => setModalState({ isOpen: false, type: null })}
      />
    </div>
  );
};
