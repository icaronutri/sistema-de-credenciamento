import React, { useState } from 'react';
import { DocumentoOS, OrdemServico, Usuario } from '../../types';
import {
  Download,
  FileText,
  Printer,
  X,
  CheckCircle,
  XCircle,
  ExternalLink,
  ShieldCheck,
  Building2,
  Calendar,
  DollarSign,
  Cloud,
} from 'lucide-react';

interface PdfViewerModalProps {
  isOpen: boolean;
  doc: DocumentoOS | null;
  os?: OrdemServico | null;
  currentUser?: Usuario;
  onClose: () => void;
  onConferir?: (docId: string) => void;
  onRejeitar?: (docId: string, motivo: string) => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  doc,
  os,
  currentUser,
  onClose,
  onConferir,
  onRejeitar,
}) => {
  const [rejecting, setRejecting] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !doc) return null;

  const isMaster = currentUser?.perfil === 'MASTER';
  const isNF = doc.tipoDocumento === 'NOTA_FISCAL';
  const isPending = doc.statusDocumento === 'RECEBIDO' || doc.statusDocumento === 'PENDENTE';

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate synthetic download
    const element = document.createElement('a');
    const file = new Blob(
      [
        `DOCUMENTO OFICIAL - GESTÃO DE OS 2027\n\nTipo: ${doc.tipoDocumento}\nNº Documento: ${doc.numeroDocumento || 'S/N'}\nValor: R$ ${(doc.valor || 0).toFixed(2)}\nOS: ${os?.numeroOS || 'OS-2027'}\nViatura: ${os?.prefixo || 'VTR'}\nArquivo: ${doc.nomeArquivo}\nStatus: ${doc.statusDocumento}\nEmitido em: ${doc.dataEmissao || doc.criadoEm}\n\nAutenticação Digital: SHA256-${Math.random().toString(36).substring(2, 15)}`,
      ],
      { type: 'text/plain' }
    );
    element.href = URL.createObjectURL(file);
    element.download = doc.nomeArquivo || 'documento_os.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const submitRejeicao = () => {
    if (!motivo.trim()) {
      setError('Por favor, informe a justificativa da rejeição.');
      return;
    }
    if (onRejeitar) {
      onRejeitar(doc.id, motivo.trim());
      setRejecting(false);
      setMotivo('');
      onClose();
    }
  };

  return (
    <div
      id="modal-pdf-viewer-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs animate-fadeIn"
    >
      <div
        id="modal-pdf-viewer-container"
        className="w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 text-slate-100 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/90 border-b border-slate-700">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-white truncate flex items-center gap-2">
                {doc.nomeArquivo}
                <span className="px-2 py-0.5 rounded text-xs font-mono font-medium bg-slate-700 text-slate-300">
                  {doc.tipoDocumento.replace('_', ' ')}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {os ? `Vinculado à OS ${os.numeroOS} (${os.prefixo})` : 'Documento da OS'} • {(doc.tamanhoBytes ? (doc.tamanhoBytes / 1024).toFixed(0) + ' KB' : 'PDF')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title="Imprimir"
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              title="Baixar arquivo"
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium bg-slate-800 border border-slate-700"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Baixar</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Body Simulation */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950 flex justify-center">
          <div className="w-full max-w-2xl bg-white text-slate-900 shadow-xl rounded-lg p-6 sm:p-10 text-xs sm:text-sm font-sans border border-slate-300">
            {/* DANFE / NF-e Style Header */}
            <div className="border-2 border-slate-900 p-4 mb-6 rounded-md">
              <div className="flex justify-between items-start border-b border-slate-300 pb-3 mb-3">
                <div>
                  <h3 className="font-extrabold text-base tracking-tight text-slate-950 uppercase">
                    {doc.tipoDocumento === 'NOTA_FISCAL' ? 'DOCUMENTO AUXILIAR DA NOTA FISCAL ELETRÔNICA - DANFE' : `DOCUMENTO DE COMPROVAÇÃO - ${doc.tipoDocumento}`}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">Credenciamento de Frotas & Manutenção 2027</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 bg-slate-900 text-white text-xs font-bold rounded">
                    {doc.numeroDocumento || 'DOC-002027'}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">Série: 001 • Folha 1/1</p>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[10px] font-semibold text-slate-500 block uppercase">Número da OS</span>
                  <span className="font-bold text-slate-900">{os?.numeroOS || 'OS-2027-000000'}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[10px] font-semibold text-slate-500 block uppercase">Viatura / Prefixo</span>
                  <span className="font-bold text-slate-900">{os?.prefixo || 'VTR-000'} ({os?.placa || 'PLACA'})</span>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[10px] font-semibold text-slate-500 block uppercase">Data Emissão</span>
                  <span className="font-bold text-slate-900">
                    {doc.dataEmissao ? new Date(doc.dataEmissao).toLocaleDateString('pt-BR') : new Date(doc.criadoEm).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="p-2 bg-emerald-50 rounded border border-emerald-300">
                  <span className="text-[10px] font-bold text-emerald-800 block uppercase">Valor Total</span>
                  <span className="font-extrabold text-sm text-emerald-950">
                    R$ {(doc.valor || os?.valorFinal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Parties Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="border border-slate-300 rounded p-3">
                <h4 className="font-bold text-xs uppercase text-slate-700 flex items-center gap-1.5 mb-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  Emitente / Oficina Credenciada
                </h4>
                <p className="font-semibold text-slate-900">{os?.oficinaId ? 'Oficina Credenciada Vinculada' : 'Centro Técnico Credenciado'}</p>
                <p className="text-xs text-slate-600">CNPJ: 12.345.678/0001-90</p>
                <p className="text-xs text-slate-600">Credenciamento Homologado 2027</p>
              </div>

              <div className="border border-slate-300 rounded p-3">
                <h4 className="font-bold text-xs uppercase text-slate-700 flex items-center gap-1.5 mb-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  Destinatário / Unidade Gestora
                </h4>
                <p className="font-semibold text-slate-900">{os?.unidadeId ? 'Unidade Operacional da Frota' : 'Secretaria de Segurança Pública'}</p>
                <p className="text-xs text-slate-600">Gestão Integrada de Manutenção</p>
                <p className="text-xs text-slate-600">São Paulo - SP</p>
              </div>
            </div>

            {/* Description / Summary Table */}
            <div className="border border-slate-300 rounded overflow-hidden mb-6">
              <div className="bg-slate-100 px-3 py-1.5 font-bold text-xs uppercase text-slate-700 border-b border-slate-300">
                Descrição dos Serviços e Fornecimentos Faturados
              </div>
              <div className="p-3 text-xs space-y-2">
                <p className="text-slate-800">
                  <strong>Objeto:</strong> Manutenção preventiva/corretiva referente à Ordem de Serviço <strong>{os?.numeroOS}</strong> para o veículo prefixo <strong>{os?.prefixo}</strong> ({os?.nomeViatura}), placa <strong>{os?.placa}</strong>.
                </p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {os?.diagnosticoTecnico || os?.descricaoProblema || 'Execução integral de serviços mecânicos com substituição de componentes conforme itens de orçamento autorizados pela administração.'}
                </p>
              </div>
            </div>

            {/* Financial Comparison Box if NF */}
            {isNF && os && (
              <div className="p-3.5 bg-slate-50 border border-slate-300 rounded-lg mb-6 text-xs">
                <h4 className="font-bold text-slate-800 uppercase mb-2 flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  Demonstrativo de Conferência de Valores
                </h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block uppercase">Valor Aprovado</span>
                    <span className="font-bold text-slate-900">
                      R$ {(os.valorAprovado || os.valorFinal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block uppercase">Valor da NF</span>
                    <span className="font-bold text-slate-900">
                      R$ {(doc.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className={`p-2 rounded border ${
                    Math.abs((os.valorAprovado || os.valorFinal || 0) - (doc.valor || 0)) < 0.01
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                      : 'bg-rose-50 border-rose-300 text-rose-900 font-bold'
                  }`}>
                    <span className="text-[10px] block uppercase">Diferença</span>
                    <span>
                      R$ {((doc.valor || 0) - (os.valorAprovado || os.valorFinal || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Signature & Verification Seal */}
            <div className="pt-4 border-t-2 border-dashed border-slate-300 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-slate-800">DOCUMENTO DIGITAL AUTENTICADO</p>
                  <p className="text-[9px] text-slate-500 font-mono">HASH: SHA256-{(doc.id).padEnd(24, 'X')}</p>
                  {doc.driveSyncStatus === 'SINCRONIZADO' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 mt-1">
                      <Cloud className="w-3 h-3" /> Sincronizado Google Drive
                    </span>
                  )}
                </div>
              </div>

              <div className="text-[11px] text-slate-500">
                <p>Status: <strong className="uppercase text-slate-900">{doc.statusDocumento}</strong></p>
                {doc.dataConferencia && (
                  <p className="text-[10px]">Conferido em: {new Date(doc.dataConferencia).toLocaleString('pt-BR')}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Conference Footer (Master controls) */}
        {isMaster && isNF && isPending && (
          <div className="px-6 py-4 bg-slate-800 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
            {!rejecting ? (
              <>
                <div className="text-xs text-slate-300">
                  <span className="font-semibold text-white">Ação de Auditoria Master:</span> Confirme se os valores e itens coincidem com a OS aprovada antes de finalizar.
                </div>
                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setRejecting(true)}
                    className="px-3.5 py-2 text-xs font-semibold bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-700 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    Rejeitar NF
                  </button>
                  <button
                    onClick={() => {
                      if (onConferir) {
                        onConferir(doc.id);
                        onClose();
                      }
                    }}
                    className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Conferir e Sincronizar Drive
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> Motivo da Rejeição da Nota Fiscal
                  </span>
                  <button
                    onClick={() => {
                      setRejecting(false);
                      setError('');
                    }}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={motivo}
                  onChange={(e) => {
                    setMotivo(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Ex: Valor cobrado na NF diverge em R$ 200 do orçamento aprovado, ou CNPJ incorreto..."
                  className="w-full text-xs p-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-1 focus:ring-rose-500"
                />
                {error && <p className="text-[11px] text-rose-400 font-medium">{error}</p>}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setRejecting(false)}
                    className="px-3 py-1 text-xs text-slate-300 hover:bg-slate-700 rounded"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={submitRejeicao}
                    className="px-3.5 py-1 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded"
                  >
                    Confirmar Rejeição da NF
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
