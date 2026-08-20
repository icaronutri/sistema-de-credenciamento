import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { OSTimelineTab } from './OSTimelineTab';
import { OSBudgetTab } from './OSBudgetTab';
import { OSApprovalTab } from './OSApprovalTab';
import { OSExecutionTab } from './OSExecutionTab';
import { OSDocumentsTab } from './OSDocumentsTab';
import { OSConferenceTab } from './OSConferenceTab';
import { OSAuditTab } from './OSAuditTab';
import {
  ArrowLeft,
  Building2,
  Car,
  Clock,
  DollarSign,
  FileCheck,
  FileText,
  History,
  Layers,
  ShieldCheck,
  Wrench,
  Sparkles,
} from 'lucide-react';

interface OSDetailProps {
  osId: string;
  onBack: () => void;
}

export const OSDetail: React.FC<OSDetailProps> = ({ osId, onBack }) => {
  const { currentUser, perfil, permissoes } = useAuth();
  const { getOSById, allUnidades, allOficinas, updateOS } = useData();

  const [activeTab, setActiveTab] = useState<string>('resumo');

  const os = getOSById(osId);

  if (!os) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Ordem de Serviço não encontrada
        </h3>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
        >
          Voltar para a Lista
        </button>
      </div>
    );
  }

  const unidade = allUnidades.find((u) => u.id === os.unidadeId);
  const oficina = allOficinas.find((o) => o.id === os.oficinaId);

  const TABS = [
    { id: 'resumo', label: 'Resumo & Esteira', icon: Layers },
    { id: 'orcamento', label: 'Diagnóstico & Orçamento', icon: Wrench },
    { id: 'aprovacao', label: 'Aprovação Master', icon: ShieldCheck },
    { id: 'execucao', label: 'Execução Mecânica', icon: Clock },
    { id: 'documentos', label: 'Documentos & Laudos', icon: FileText },
    { id: 'conferencia', label: 'Conferência de NF', icon: FileCheck },
    { id: 'historico', label: 'Histórico & Auditoria', icon: History },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title="Voltar para a Lista"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                {os.numeroOS}
              </span>
              <StatusBadge status={os.status} size="sm" />
              <PriorityBadge prioridade={os.prioridade} />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
              {os.prefixo} • {os.nomeViatura} ({os.placa})
            </h2>
          </div>
        </div>

        {/* Units / Workshop Badges */}
        <div className="flex items-center gap-2 text-xs flex-wrap self-start sm:self-auto">
          <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <Building2 className="w-3.5 h-3.5 text-indigo-500" />
            <span>Unidade: <strong>{unidade?.sigla || os.unidadeId}</strong></span>
          </div>
          <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <Wrench className="w-3.5 h-3.5 text-emerald-500" />
            <span>Oficina: <strong>{oficina ? oficina.nome : 'Pendente'}</strong></span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 shadow-xs overflow-x-auto">
        <div className="flex items-center gap-1 min-w-[700px]">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab Content */}
      <div className="mt-4">
        {activeTab === 'resumo' && (
          <OSTimelineTab
            os={os}
            unidade={unidade}
            oficina={oficina}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'orcamento' && (
          <OSBudgetTab
            os={os}
            onUpdateOS={(updated) => updateOS(os.id, updated)}
          />
        )}

        {activeTab === 'aprovacao' && <OSApprovalTab os={os} />}

        {activeTab === 'execucao' && (
          <OSExecutionTab
            os={os}
            onUpdateOS={(updated) => updateOS(os.id, updated)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'documentos' && (
          <OSDocumentsTab
            os={os}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'conferencia' && (
          <OSConferenceTab
            os={os}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'historico' && <OSAuditTab os={os} />}
      </div>
    </div>
  );
};
