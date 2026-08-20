import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Settings,
  Shield,
  Clock,
  DollarSign,
  Bell,
  CheckCircle,
  Save,
  Sliders,
  FileCheck,
} from 'lucide-react';

export const ConfiguracoesView: React.FC = () => {
  const { permissoes } = useAuth();

  const [nomeSistema, setNomeSistema] = useState('Gestão de OS - Credenciamento 2027');
  const [orgao, setOrgao] = useState('Comando Geral - Diretoria de Apoio Logístico');
  const [prazoOrcamentoHoras, setPrazoOrcamentoHoras] = useState(48);
  const [limiteAlcadaAprovacao, setLimiteAlcadaAprovacao] = useState(5000);
  const [exigirFotos, setExigirFotos] = useState(true);
  const [notificarEmail, setNotificarEmail] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Configurações do Sistema & Parâmetros do Credenciamento
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Regras de negócio, prazos contratuais de SLA e políticas operacionais
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Identificação Institucional */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-500" />
            Identificação Institucional
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nome do Sistema
              </label>
              <input
                type="text"
                value={nomeSistema}
                onChange={(e) => setNomeSistema(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Órgão / Diretoria Responsável
              </label>
              <input
                type="text"
                value={orgao}
                onChange={(e) => setOrgao(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* SLA e Prazos Contratuais */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            Regras de Negócio & SLAs do Edital 2027
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Prazo Máximo para Envio de Orçamento (Horas)
              </label>
              <input
                type="number"
                value={prazoOrcamentoHoras}
                onChange={(e) => setPrazoOrcamentoHoras(parseInt(e.target.value, 10) || 48)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
              />
              <p className="text-[11px] text-slate-500 mt-1">Tempo limite para a oficina emitir o laudo técnico.</p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Alçada de Aprovação Direta (R$)
              </label>
              <input
                type="number"
                value={limiteAlcadaAprovacao}
                onChange={(e) => setLimiteAlcadaAprovacao(parseFloat(e.target.value) || 5000)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
              />
              <p className="text-[11px] text-slate-500 mt-1">Valores acima desta quantia exigem dupla validação do Master.</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800 dark:text-slate-200">
              <input
                type="checkbox"
                checked={exigirFotos}
                onChange={(e) => setExigirFotos(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Exigir fotos comprobatórias de avaria e conclusão em reparos de funilaria/colisão</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800 dark:text-slate-200">
              <input
                type="checkbox"
                checked={notificarEmail}
                onChange={(e) => setNotificarEmail(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Disparar alertas automáticos por e-mail para oficinas a cada nova OS aberta</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between">
          {saved && (
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Parâmetros salvos com sucesso!
            </span>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Salvar Parâmetros
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
