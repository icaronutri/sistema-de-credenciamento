import React from 'react';
import { StatusOS } from '../../types';
import {
  FileText,
  Send,
  Clock,
  CheckCircle,
  RotateCcw,
  Wrench,
  CheckCheck,
  FileSpreadsheet,
  FileCheck,
  Award,
  XCircle,
} from 'lucide-react';

interface StatusBadgeProps {
  status: StatusOS;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showIcon = true, size = 'md' }) => {
  const getStatusConfig = (s: StatusOS) => {
    switch (s) {
      case 'ABERTA':
        return {
          label: 'Aberta',
          bg: 'bg-slate-100 dark:bg-slate-800',
          text: 'text-slate-800 dark:text-slate-200',
          border: 'border-slate-300 dark:border-slate-700',
          dot: 'bg-slate-500',
          icon: FileText,
        };
      case 'ENVIADA_A_OFICINA':
        return {
          label: 'Enviada à Oficina',
          bg: 'bg-blue-50 dark:bg-blue-950/60',
          text: 'text-blue-700 dark:text-blue-300',
          border: 'border-blue-200 dark:border-blue-800',
          dot: 'bg-blue-500',
          icon: Send,
        };
      case 'AGUARDANDO_ORCAMENTO':
        return {
          label: 'Aguardando Orçamento',
          bg: 'bg-amber-50 dark:bg-amber-950/60',
          text: 'text-amber-800 dark:text-amber-300',
          border: 'border-amber-200 dark:border-amber-800',
          dot: 'bg-amber-500',
          icon: Clock,
        };
      case 'AGUARDANDO_APROVACAO':
        return {
          label: 'Aguardando Aprovação',
          bg: 'bg-orange-50 dark:bg-orange-950/60',
          text: 'text-orange-800 dark:text-orange-300',
          border: 'border-orange-300 dark:border-orange-800',
          dot: 'bg-orange-500',
          icon: Clock,
        };
      case 'APROVADA':
        return {
          label: 'Aprovada',
          bg: 'bg-emerald-50 dark:bg-emerald-950/60',
          text: 'text-emerald-800 dark:text-emerald-300',
          border: 'border-emerald-300 dark:border-emerald-800',
          dot: 'bg-emerald-500',
          icon: CheckCircle,
        };
      case 'DEVOLVIDA_PARA_CORRECAO':
        return {
          label: 'Devolvida p/ Correção',
          bg: 'bg-rose-50 dark:bg-rose-950/60',
          text: 'text-rose-800 dark:text-rose-300',
          border: 'border-rose-300 dark:border-rose-800',
          dot: 'bg-rose-500',
          icon: RotateCcw,
        };
      case 'EM_EXECUCAO':
        return {
          label: 'Em Execução',
          bg: 'bg-cyan-50 dark:bg-cyan-950/60',
          text: 'text-cyan-800 dark:text-cyan-300',
          border: 'border-cyan-300 dark:border-cyan-800',
          dot: 'bg-cyan-500',
          icon: Wrench,
        };
      case 'SERVICO_CONCLUIDO':
        return {
          label: 'Serviço Concluído',
          bg: 'bg-teal-50 dark:bg-teal-950/60',
          text: 'text-teal-800 dark:text-teal-300',
          border: 'border-teal-300 dark:border-teal-800',
          dot: 'bg-teal-500',
          icon: CheckCheck,
        };
      case 'AGUARDANDO_DOCUMENTOS':
        return {
          label: 'Aguardando Documentos',
          bg: 'bg-purple-50 dark:bg-purple-950/60',
          text: 'text-purple-800 dark:text-purple-300',
          border: 'border-purple-300 dark:border-purple-800',
          dot: 'bg-purple-500',
          icon: FileSpreadsheet,
        };
      case 'AGUARDANDO_CONFERENCIA':
        return {
          label: 'Aguardando Conferência NF',
          bg: 'bg-indigo-50 dark:bg-indigo-950/60',
          text: 'text-indigo-800 dark:text-indigo-300',
          border: 'border-indigo-300 dark:border-indigo-800',
          dot: 'bg-indigo-500',
          icon: FileCheck,
        };
      case 'FINALIZADA':
        return {
          label: 'Finalizada',
          bg: 'bg-emerald-100 dark:bg-emerald-900/50',
          text: 'text-emerald-900 dark:text-emerald-200',
          border: 'border-emerald-400 dark:border-emerald-700',
          dot: 'bg-emerald-600',
          icon: Award,
        };
      case 'CANCELADA':
        return {
          label: 'Cancelada',
          bg: 'bg-zinc-100 dark:bg-zinc-800',
          text: 'text-zinc-600 dark:text-zinc-400',
          border: 'border-zinc-300 dark:border-zinc-700',
          dot: 'bg-zinc-400',
          icon: XCircle,
        };
      default:
        return {
          label: status,
          bg: 'bg-slate-100',
          text: 'text-slate-800',
          border: 'border-slate-300',
          dot: 'bg-slate-400',
          icon: FileText,
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs font-medium gap-1.5',
    lg: 'px-3 py-1.5 text-sm font-semibold gap-2',
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }[size];

  return (
    <span
      id={`badge-status-${status.toLowerCase()}`}
      className={`inline-flex items-center rounded-md border ${config.bg} ${config.text} ${config.border} ${sizeClasses} whitespace-nowrap shadow-xs transition-colors`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} shrink-0`} />
      {showIcon && <Icon className={`${iconSizes} shrink-0`} />}
      <span>{config.label}</span>
    </span>
  );
};
