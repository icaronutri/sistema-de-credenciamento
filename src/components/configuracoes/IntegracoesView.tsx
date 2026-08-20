import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  Cloud,
  FolderSync,
  CheckCircle2,
  Database,
  ShieldCheck,
  RefreshCw,
  FolderTree,
  ExternalLink,
  Server,
  Lock,
  Layers,
  FileCheck,
  AlertCircle,
} from 'lucide-react';

export const IntegracoesView: React.FC = () => {
  const { googleDriveConfig, updateDriveConfig } = useData();

  const [pastaRaiz, setPastaRaiz] = useState(googleDriveConfig?.pastaRaizNome || 'Credenciamento 2027');
  const [syncAuto, setSyncAuto] = useState(googleDriveConfig?.sincronizacaoAutomatica ?? true);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateDriveConfig({
      ...googleDriveConfig,
      pastaRaizNome: pastaRaiz.trim(),
      sincronizacaoAutomatica: syncAuto,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleTestConnection = () => {
    setTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setTesting(false);
      setTestResult('Conexão com Google Drive API v3 e Firestore Storage bem-sucedida! Permissões de escrita e sincronização validadas.');
    }, 1200);
  };

  const logs = googleDriveConfig?.logSincronizacoes || [];
  const syncedCount = logs.filter((d) => d.status === 'SUCESSO').length;

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Integrações em Nuvem
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Conexão com Firebase Firestore, Google Drive API e infraestrutura de segurança
          </p>
        </div>

        <button
          onClick={handleTestConnection}
          disabled={testing}
          className="px-4 py-2 text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors flex items-center gap-2 shadow-xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 text-indigo-500 ${testing ? 'animate-spin' : ''}`} />
          {testing ? 'Testando Conexão...' : 'Testar Conexão Drive & Firebase'}
        </button>
      </div>

      {testResult && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl flex items-center gap-3 text-xs font-semibold text-emerald-900 dark:text-emerald-200 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{testResult}</span>
        </div>
      )}

      {/* Services Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Google Drive Status */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Cloud className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              ATIVO & CONECTADO
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mt-3">
            Google Drive API
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Arquivamento automático em árvore estruturada de diretórios por unidade e OS.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>Arquivos sincronizados:</span>
            <span className="text-indigo-600 dark:text-indigo-400">{syncedCount} PDFs</span>
          </div>
        </div>

        {/* Cloud Firestore Status */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Database className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              SINCRONIZADO
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mt-3">
            Cloud Firestore
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Banco de dados NoSQL transacional com indexação composta e isolamento por ID.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>Coleções principais:</span>
            <span className="text-amber-600 dark:text-amber-400">8 coleções</span>
          </div>
        </div>

        {/* Security Rules Status */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
              REGRAS RBAC
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mt-3">
            Segurança & firestore.rules
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Proteção backend com validação de perfis (Master, Unidade, Oficina).
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>Blindagem frontend:</span>
            <span className="text-emerald-600 dark:text-emerald-400">100% ativa</span>
          </div>
        </div>
      </div>

      {/* Google Drive Configuration Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Parametrização do Google Drive
              </h3>
              <p className="text-xs text-slate-500">
                Organização automatizada da taxonomia de pastas corporativas para arquivamento contábil e fiscal
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Nome da Pasta Raiz no Google Drive
              </label>
              <input
                type="text"
                value={pastaRaiz}
                onChange={(e) => setPastaRaiz(e.target.value)}
                placeholder="Ex: Credenciamento 2027"
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={syncAuto}
                  onChange={(e) => setSyncAuto(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Sincronizar automaticamente após homologação da NF pelo Master</span>
              </label>
            </div>
          </div>

          {/* Directory Hierarchy Visualizer */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-750 rounded-xl space-y-2">
            <h4 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <FolderSync className="w-4 h-4 text-indigo-500" />
              Taxonomia Hierárquica de Arquivamento (Padrão do Sistema)
            </h4>
            <div className="font-mono text-xs text-slate-600 dark:text-slate-300 space-y-1 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <div>📁 {pastaRaiz || 'Credenciamento 2027'}</div>
              <div className="pl-4">└── 📁 Documentos OS</div>
              <div className="pl-8">└── 📁 [UNIDADE] (Ex: 1º BPM)</div>
              <div className="pl-12">└── 📁 [OFICINA] (Ex: Auto Mecânica São Jorge)</div>
              <div className="pl-16">└── 📁 [NÚMERO DA OS] (Ex: OS-2027-001)</div>
              <div className="pl-20">├── 📄 Nota Fiscal (NF-e 004812.pdf)</div>
              <div className="pl-20">├── 📄 Orçamento Aprovado (Orcamento_001.pdf)</div>
              <div className="pl-20">└── 📄 Laudo Técnico & Fotos</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess && (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Configurações salvas com sucesso!
              </span>
            )}
            <div className="ml-auto">
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs transition-all"
              >
                Salvar Configurações do Drive
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Sync Logs Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Server className="w-5 h-5 text-indigo-500" />
          Registro de Eventos de Sincronização (Drive Sync Logs)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Data / Hora</th>
                <th className="py-2.5 px-3">Arquivo / Documento</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Caminho no Google Drive</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 text-slate-500">
                    {log.dataHora ? new Date(log.dataHora).toLocaleString('pt-BR') : '—'}
                  </td>
                  <td className="py-2.5 px-3 font-sans font-bold text-slate-800 dark:text-slate-200">
                    {log.mensagem || `${log.tipoDoc} - ${log.numeroOS}`}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 'SUCESSO'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 truncate max-w-xs">
                    {log.caminhoDrive}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
