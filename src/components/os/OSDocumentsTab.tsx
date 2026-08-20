import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { OrdemServico, DocumentoOS, TipoDocumento } from '../../types';
import { PdfViewerModal } from '../common/PdfViewerModal';
import {
  Cloud,
  Download,
  Eye,
  FileCheck,
  FilePlus,
  FileSpreadsheet,
  FileText,
  Image,
  Plus,
  Trash2,
  Upload,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

interface OSDocumentsTabProps {
  os: OrdemServico;
  onNavigateTab: (tabId: string) => void;
}

export const OSDocumentsTab: React.FC<OSDocumentsTabProps> = ({ os, onNavigateTab }) => {
  const { currentUser, perfil } = useAuth();
  const { getDocumentosByOS, saveDoc, deleteDoc, changeStatusOS, syncDocToDrive, conferirNF, rejeitarNF } = useData();

  const docs = getDocumentosByOS(os.id);

  // Upload Form State
  const [showUpload, setShowUpload] = useState(false);
  const [tipoDoc, setTipoDoc] = useState<TipoDocumento>('NOTA_FISCAL');
  const [numeroDoc, setNumeroDoc] = useState('');
  const [valorDoc, setValorDoc] = useState<string>(os.valorAprovado ? os.valorAprovado.toString() : '');
  const [nomeArquivo, setNomeArquivo] = useState('');
  const [uploadError, setUploadError] = useState('');

  // PDF Viewer Modal
  const [selectedDoc, setSelectedDoc] = useState<DocumentoOS | null>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeArquivo.trim()) {
      setUploadError('Informe o nome do arquivo ou selecione um documento.');
      return;
    }
    setUploadError('');

    const now = new Date().toISOString();
    const docId = `doc-${Date.now()}`;
    const v = valorDoc ? parseFloat(valorDoc) : undefined;

    const newDoc: DocumentoOS = {
      id: docId,
      osId: os.id,
      tipoDocumento: tipoDoc,
      nomeArquivo: nomeArquivo.trim().endsWith('.pdf') ? nomeArquivo.trim() : `${nomeArquivo.trim()}.pdf`,
      urlStorage: `https://storage.googleapis.com/gestao2027/${os.numeroOS}/${docId}.pdf`,
      driveSyncStatus: 'PENDENTE',
      statusDocumento: 'RECEBIDO',
      numeroDocumento: numeroDoc.trim() || undefined,
      valor: v,
      tamanhoBytes: Math.floor(Math.random() * 800000) + 150000,
      mimeType: 'application/pdf',
      criadoPor: currentUser.id,
      criadoEm: now,
      atualizadoEm: now,
    };

    saveDoc(newDoc);

    // If uploading NOTA_FISCAL, change OS status to AGUARDANDO_CONFERENCIA
    if (tipoDoc === 'NOTA_FISCAL') {
      changeStatusOS(
        os.id,
        'AGUARDANDO_CONFERENCIA',
        `Nota Fiscal nº ${numeroDoc || 'S/N'} anexada pela oficina no valor de R$ ${(v || 0).toFixed(2)}. Aguardando conferência do Master.`,
        {
          numeroNotaFiscal: numeroDoc.trim(),
          valorNotaFiscal: v,
        }
      );
    }

    // Reset Form
    setNomeArquivo('');
    setNumeroDoc('');
    setValorDoc('');
    setShowUpload(false);
  };

  const getDocIcon = (tipo: TipoDocumento) => {
    switch (tipo) {
      case 'NOTA_FISCAL':
        return FileCheck;
      case 'ORCAMENTO':
        return FileSpreadsheet;
      case 'FOTO_AVARIA':
      case 'FOTO_CONCLUSAO':
        return Image;
      default:
        return FileText;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Upload CTA */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Repositório Digital de Documentos ({docs.length})
          </h3>
          <p className="text-xs text-slate-500">
            Armazenamento seguro de Notas Fiscais (NF-e), orçamentos detalhados, laudos e fotos comprobatórias.
          </p>
        </div>

        <button
          onClick={() => setShowUpload(!showUpload)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
        >
          <Upload className="w-4 h-4" />
          {showUpload ? 'Cancelar Envio' : 'Anexar Documento / NF'}
        </button>
      </div>

      {/* Upload Modal / Inline Box */}
      {showUpload && (
        <form
          onSubmit={handleUpload}
          className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 p-5 rounded-2xl space-y-4 animate-fadeIn text-xs"
        >
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <FilePlus className="w-4 h-4 text-indigo-500" />
              Anexar Novo Documento à OS {os.numeroOS}
            </h4>
          </div>

          {uploadError && <p className="text-rose-500 font-semibold">{uploadError}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tipo de Documento <span className="text-rose-500">*</span>
              </label>
              <select
                value={tipoDoc}
                onChange={(e) => setTipoDoc(e.target.value as TipoDocumento)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              >
                <option value="NOTA_FISCAL">Nota Fiscal (NF-e / DANFE)</option>
                <option value="ORCAMENTO">Orçamento Detalhado (PDF)</option>
                <option value="LAUDO_TECNICO">Laudo Técnico Pericial</option>
                <option value="FOTO_AVARIA">Foto da Avaria (Antes)</option>
                <option value="FOTO_CONCLUSAO">Foto da Conclusão (Depois)</option>
                <option value="CERTIFICADO_GARANTIA">Certificado de Garantia</option>
                <option value="RELATORIO_CONFERENCIA">Relatório de Conferência</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nº do Documento / DANFE
              </label>
              <input
                type="text"
                value={numeroDoc}
                onChange={(e) => setNumeroDoc(e.target.value)}
                placeholder="Ex: NF-008921"
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Valor do Documento (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={valorDoc}
                onChange={(e) => setValorDoc(e.target.value)}
                placeholder="Ex: 3840.00"
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nome do Arquivo / Título <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={nomeArquivo}
                onChange={(e) => setNomeArquivo(e.target.value)}
                placeholder="Ex: NF_Eletronica_008921_Assinada.pdf"
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-end justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowUpload(false)}
                className="px-3.5 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs"
              >
                Concluir Envio
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Documents Grid / Table */}
      {docs.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Nenhum documento anexado ainda
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Clique no botão acima para anexar a Nota Fiscal eletrônica ou laudos técnicos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {docs.map((doc) => {
            const Icon = getDocIcon(doc.tipoDocumento);
            const isNF = doc.tipoDocumento === 'NOTA_FISCAL';

            return (
              <div
                key={doc.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                          {doc.nomeArquivo}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {doc.tipoDocumento.replace(/_/g, ' ')}
                          </span>
                          {doc.numeroDocumento && (
                            <span className="text-[10px] font-mono text-slate-500">
                              Nº {doc.numeroDocumento}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                        doc.statusDocumento === 'CONFERIDO'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : doc.statusDocumento === 'REJEITADO'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {doc.statusDocumento}
                    </span>
                  </div>

                  {/* Value and info */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Valor Faturado</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {doc.valor ? `R$ ${doc.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Google Drive</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-[11px] text-indigo-600 dark:text-indigo-400">
                        <Cloud className="w-3 h-3" />
                        {doc.driveSyncStatus}
                      </span>
                    </div>
                  </div>

                  {doc.motivoRejeicao && (
                    <div className="mt-2 p-2 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-lg text-[11px] text-rose-700 dark:text-rose-300">
                      <strong>Rejeitado:</strong> {doc.motivoRejeicao}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedDoc(doc)}
                      className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Visualizar PDF
                    </button>
                    {isNF && (
                      <button
                        onClick={() => onNavigateTab('conferencia')}
                        className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-800 dark:text-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        Conferência
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {doc.driveSyncStatus !== 'SINCRONIZADO' && (
                      <button
                        onClick={() => syncDocToDrive(doc.id)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded transition-colors"
                        title="Sincronizar com Google Drive"
                      >
                        <Cloud className="w-4 h-4" />
                      </button>
                    )}
                    {perfil === 'MASTER' && (
                      <button
                        onClick={() => {
                          if (confirm('Deseja excluir este documento da OS?')) {
                            deleteDoc(doc.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Excluir documento"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PDF Visualizer Modal */}
      <PdfViewerModal
        isOpen={!!selectedDoc}
        doc={selectedDoc}
        os={os}
        currentUser={currentUser}
        onClose={() => setSelectedDoc(null)}
        onConferir={(docId) => {
          conferirNF(docId);
          setSelectedDoc(null);
        }}
        onRejeitar={(docId, motivo) => {
          rejeitarNF(docId, motivo);
          setSelectedDoc(null);
        }}
      />
    </div>
  );
};
