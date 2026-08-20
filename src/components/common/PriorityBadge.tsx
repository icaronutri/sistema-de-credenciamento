import React from 'react';
import { PrioridadeOS } from '../../types';
import { AlertCircle, AlertTriangle, ArrowDown, ArrowUp } from 'lucide-react';

interface PriorityBadgeProps {
  prioridade: PrioridadeOS;
  showIcon?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ prioridade, showIcon = true }) => {
  const getConfig = (p: PrioridadeOS) => {
    switch (p) {
      case 'URGENTE':
        return {
          label: 'Urgente',
          bg: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/70 dark:text-red-300 dark:border-red-800',
          icon: AlertCircle,
        };
      case 'ALTA':
        return {
          label: 'Alta',
          bg: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950/70 dark:text-orange-300 dark:border-orange-800',
          icon: ArrowUp,
        };
      case 'NORMAL':
        return {
          label: 'Normal',
          bg: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
          icon: AlertTriangle,
        };
      case 'BAIXA':
        return {
          label: 'Baixa',
          bg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
          icon: ArrowDown,
        };
      default:
        return {
          label: prioridade,
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: ArrowDown,
        };
    }
  };

  const config = getConfig(prioridade);
  const Icon = config.icon;

  return (
    <span
      id={`badge-priority-${prioridade.toLowerCase()}`}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border ${config.bg} whitespace-nowrap`}
    >
      {showIcon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{config.label}</span>
    </span>
  );
};
