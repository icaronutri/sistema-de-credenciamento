import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Info, X, XCircle } from 'lucide-react';

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'success' | 'info';
  requireReason?: boolean;
  reasonLabel?: string;
  reasonPlaceholder?: string;
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'warning',
  requireReason = false,
  reasonLabel = 'Justificativa / Observação Obrigatória',
  reasonPlaceholder = 'Descreva detalhadamente o motivo...',
  onConfirm,
  onCancel,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (requireReason && !reason.trim()) {
      setError('A justificativa é obrigatória para prosseguir.');
      return;
    }
    setError('');
    onConfirm(reason.trim());
    setReason('');
  };

  const handleCancel = () => {
    setError('');
    setReason('');
    onCancel();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: XCircle,
          iconBg: 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',
          btnBg: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500',
        };
      case 'success':
        return {
          icon: CheckCircle,
          iconBg: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
          btnBg: 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500',
        };
      case 'info':
        return {
          icon: Info,
          iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
          btnBg: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
        };
      case 'warning':
      default:
        return {
          icon: AlertTriangle,
          iconBg: 'bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
          btnBg: 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500',
        };
    }
  };

  const styles = getVariantStyles();
  const Icon = styles.icon;

  return (
    <div
      id="modal-confirm-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
      onClick={handleCancel}
    >
      <div
        id="modal-confirm-content"
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl shrink-0 ${styles.iconBg}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  {title}
                </h3>
                <button
                  onClick={handleCancel}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          {requireReason && (
            <div className="mt-5 space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {reasonLabel} <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="modal-confirm-reason-input"
                rows={3}
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError('');
                }}
                placeholder={reasonPlaceholder}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 text-slate-900 dark:text-white placeholder:text-slate-400"
              />
              {error && <p className="text-xs font-medium text-rose-600 dark:text-rose-400">{error}</p>}
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end items-center gap-3">
          <button
            id="modal-confirm-cancel-btn"
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700/60 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            id="modal-confirm-action-btn"
            type="button"
            onClick={handleConfirm}
            className={`px-4 py-2 text-sm font-semibold rounded-lg shadow-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-offset-2 ${styles.btnBg}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
