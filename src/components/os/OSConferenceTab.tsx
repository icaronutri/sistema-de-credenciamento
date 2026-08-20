import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { OrdemServico, DocumentoOS } from '../../types';
import { ConfirmModal } from '../common/ConfirmModal';
import { PdfViewerModal } from '../common/PdfViewerModal';
import {
  FileCheck2,
  DollarSign,
  Cloud,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Eye,
  Award,
  ShieldCheck,
  Building2,
  Calendar,
} from 'lucide-react';

interface OSConferenceTabProps {
  os: OrdemServico;
  onNavigateTab: (tabId: string) => void;
}

export const OSConferenceTab: React.FC<OSConferenceTabProps> = ({ os, onNavigateTab }) => {
  const { currentUser, perfil, permissoes } = useAuth();
  const { getDocumentosByOS, conferirNF, rejeitarNF, changeStatusOS, googleDriveConfig } = useData();

  const isMaster = permissoes.isMaster;
  const docs = getDocumentosByOS(os.id);
  const nfDoc = docs.find((d) => d.tipoDocumento === 'NOTA_FISCAL');

  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [finalizeModalOpen, setFinalizeModalOpen] = useState(false);

  const valorAprovado = os.valorAprovado || os.valorFinal || 0;
  const valorNF = nfDoc?.valor || os.valorNotaFiscal || 0;
  const diferenca = valorNF - valorAprovado;
  const hasDivergence = Math.abs(diferenca) > 0.01;

  const isConferido = nfDoc?.statusDocumento === 'CONFERIDO';
  const isRejeitado = nfDoc?.statusDocumento === 'REJEITADO';
  const isFinalizada = os.status === 'FINALIZADA';

  const handleConferir = () => {
    if (!nfDoc) return;
    const res = conferirNF(nfDoc.id);
    if (res.success) {
      alert(res.message);
    }
  };

  const handleRejeitar = (motivo?: string) => {
    if (!nfDoc || !motivo) return;
    const res = rejeitarNF(nfDoc.id, motivo);
    if (res.success) {
      setRejectModalOpen(false);
      alert(res.message);
    }
  };

  const handleFinalizarOS = () => {
    changeStatusOS(
      os.id,
      'FINALIZADA',
      'Ordem de Serviço finalizada com sucesso após conferência da Nota Fiscal e arquivamento no Google Drive. Viatura liberada para prontidão.',
      {
        dataFinalizacao: new Date().toISOString(),
        dataConferencia: new Date().toISOString(),
      }
    );
    setFinalizeModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Finalized Banner */}
      {isFinalizada ? (
        <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
              ORDEM DE SERVIÇO 100% FINALIZADA
            </div>
            <h3 className="text-base font-bold text-emerald-950 dark:text-emerald-100 mt-1">
              Processo Liquidado & Viatura Disponível
            </h3>
            <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5">
              Conferência concluída em {os.dataFinalizacao ? new Date(os.dataFinalizacao).toLocaleString('pt-BR') : 'Data registrada'}. Todos os arquivos arquivados na pasta do Google Drive.
            </p>
          </div>
        </div>
      ) : !nfDoc ? (
        <div className="p-6 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-750 rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl shrink-0">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Nenhuma Nota Fiscal Anexada
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              A oficina credenciada deve anexar a DANFE / NF-e após a conclusão dos serviços para habilitar a conferência documental.
            </p>
            <button
              onClick={() => onNavigateTab('documentos')}
              className="mt-3 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors"
            >
              Ir para Anexação de Documentos
            </button>
          </div>
        </div>
      ) : null}

      {/* Side-by-side Financial Comparison Matrix */}
      {nfDoc && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                  NF-e {nfDoc.numeroDocumento || 'S/N'}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                    isConferido
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : isRejeitado
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  }`}
                >
                  Status da NF: {nfDoc.statusDocumento}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                Conferência de Valores Financeiros & Faturamento
              </h3>
            </div>

            <button
              onClick={() => setPdfModalOpen(true)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Eye className="w-4 h-4 text-indigo-500" />
              Visualizar Espelho da DANFE (PDF)
            </button>
          </div>

          {/* 3 Metric Comparison Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-750 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Valor Autorizado pelo Master
              </span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                R$ {valorAprovado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">Orçamento homologado</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-750 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Valor Emitido na Nota Fiscal
              </span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                R$ {valorNF.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">
                {nfDoc.nomeArquivo}
              </span>
            </div>

            <div
              className={`p-4 rounded-xl border text-center ${
                !hasDivergence
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100'
              }`}
            >
              <span className="text-[10px] uppercase font-bold block mb-1">
                Divergência / Saldo
              </span>
              <span className="text-xl font-extrabold">
                R$ {diferenca.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[11px] font-semibold block mt-1">
                {!hasDivergence ? 'Valores 100% Exatos' : 'Divergência Detectada!'}
              </span>
            </div>
          </div>

          {/* Google Drive Hierarchy Sync Box */}
          <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                <Cloud className="w-4 h-4 text-indigo-500" />
                Estrutura de Arquivamento no Google Drive
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                {nfDoc.driveSyncStatus === 'SINCRONIZADO' ? 'Pasta Sincronizada' : 'Aguardando Conferência'}
              </span>
            </div>
            <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-indigo-100 dark:border-indigo-900 font-mono text-[11px] text-slate-600 dark:text-slate-300 truncate">
              {googleDriveConfig.pastaRaizNome} &gt; Documentos OS &gt; {os.unidadeId} &gt; {os.oficinaId || 'Oficina'} &gt; {os.numeroOS} &gt; Nota Fiscal
            </div>
          </div>

          {/* Master Conference Actions */}
          {isMaster && !isFinalizada && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                {isConferido ? (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> NF conferida. Você já pode finalizar a OS.
                  </span>
                ) : (
                  <span>Ações de conferência documental do Master:</span>
                )}
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                {!isConferido && (
                  <>
                    <button
                      id="btn-rejeitar-nf"
                      onClick={() => setRejectModalOpen(true)}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:hover:bg-rose-900 dark:text-rose-300 border border-rose-300 dark:border-rose-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      Rejeitar Nota Fiscal
                    </button>

                    <button
                      id="btn-conferir-nf"
                      onClick={handleConferir}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Conferir e Sincronizar Drive
                    </button>
                  </>
                )}

                {isConferido && (
                  <button
                    id="btn-finalizar-os"
                    onClick={() => setFinalizeModalOpen(true)}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
                  >
                    <Award className="w-4 h-4" />
                    Finalizar Ordem de Serviço & Liberar Viatura
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* PDF Modal */}
      {nfDoc && (
        <PdfViewerModal
          isOpen={pdfModalOpen}
          doc={nfDoc}
          os={os}
          currentUser={currentUser}
          onClose={() => setPdfModalOpen(false)}
          onConferir={(docId) => {
            conferirNF(docId);
            setPdfModalOpen(false);
          }}
          onRejeitar={(docId, motivo) => {
            rejeitarNF(docId, motivo);
            setPdfModalOpen(false);
          }}
        />
      )}

      {/* Rejection Modal */}
      <ConfirmModal
        isOpen={rejectModalOpen}
        title="Rejeitar Nota Fiscal"
        description="A Nota Fiscal será marcada como rejeitada e a oficina credenciada receberá a notificação com os motivos apontados para emissão de carta de correção ou cancelamento/reenvio."
        confirmText="Confirmar Rejeição da NF"
        variant="danger"
        requireReason={true}
        reasonLabel="Motivo da Inconformidade Fiscal"
        reasonPlaceholder="Ex: Divergência de valores em relação ao orçamento aprovado ou CNPJ incorreto..."
        onConfirm={handleRejeitar}
        onCancel={() => setRejectModalOpen(false)}
      />

      {/* Finalize Modal */}
      <ConfirmModal
        isOpen={finalizeModalOpen}
        title="Finalizar Ordem de Serviço Definitivamente"
        description={`Confirma a finalização administrativa e contábil da ${os.numeroOS}? A viatura ${os.prefixo} será reativada como DISPONÍVEL no sistema.`}
        confirmText="Finalizar e Concluir OS"
        variant="success"
        onConfirm={handleFinalizarOS}
        onCancel={() => setFinalizeModalOpen(false)}
      />
    </div>
  );
};
