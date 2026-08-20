import React from 'react';
import { useData } from '../../context/DataContext';
import { OrdemServico } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import {
  Calendar,
  Clock,
  History,
  Shield,
  User,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface OSAuditTabProps {
  os: OrdemServico;
}

export const OSAuditTab: React.FC<OSAuditTabProps> = ({ os }) => {
  const { getHistoricoByOS } = useData();
  const logs = getHistoricoByOS(os.id);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-500" />
              Histórico & Trilha de Auditoria Digital
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Registro cronológico auditável de todos os eventos, alterações de status e assinaturas de usuários nesta OS.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {logs.length} registros
          </span>
        </div>

        {logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Nenhum evento registrado no histórico desta ordem.
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {logs.map((log) => (
              <div key={log.id} className="relative group text-xs">
                {/* Timeline Dot */}
                <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-indigo-100 dark:ring-indigo-950" />

                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-750 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {log.evento}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(log.dataHora).toLocaleString('pt-BR')}
                    </span>
                  </div>

                  {/* Status Transition if any */}
                  {log.novoStatus && (
                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      {log.statusAnterior && (
                        <>
                          <StatusBadge status={log.statusAnterior} size="sm" />
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                        </>
                      )}
                      <StatusBadge status={log.novoStatus} size="sm" />
                    </div>
                  )}

                  {/* User identity & Observation */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        Registrado por: <strong>{log.usuarioNome}</strong> ({log.perfilUsuario})
                      </span>
                    </div>

                    {log.observacao && (
                      <span className="text-slate-500 italic truncate max-w-sm">
                        "{log.observacao}"
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
