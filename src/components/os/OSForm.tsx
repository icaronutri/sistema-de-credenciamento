import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { TipoManutencao, PrioridadeOS, Viatura } from '../../types';
import {
  ArrowLeft,
  Building2,
  Car,
  CheckCircle,
  FilePlus,
  Gauge,
  HelpCircle,
  Info,
  Send,
  Sparkles,
  Wrench,
} from 'lucide-react';

interface OSFormProps {
  onCancel: () => void;
  onSuccess: (newOSId: string) => void;
}

export const OSForm: React.FC<OSFormProps> = ({ onCancel, onSuccess }) => {
  const { currentUser, perfil, unidadeAtual } = useAuth();
  const { viaturas, allUnidades, allOficinas, createOS } = useData();

  const isMaster = perfil === 'MASTER';

  // Form State
  const [selectedViaturaId, setSelectedViaturaId] = useState<string>('');
  const [tipoManutencao, setTipoManutencao] = useState<TipoManutencao>('CORRETIVA');
  const [prioridade, setPrioridade] = useState<PrioridadeOS>('NORMAL');
  const [quilometragem, setQuilometragem] = useState<number>(0);
  const [descricaoProblema, setDescricaoProblema] = useState<string>('');
  const [selectedOficinaId, setSelectedOficinaId] = useState<string>('');
  const [valorEstimado, setValorEstimado] = useState<string>('');
  const [unidadeId, setUnidadeId] = useState<string>(
    unidadeAtual ? unidadeAtual.id : allUnidades[0]?.id || ''
  );
  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  // Available vehicles for selection
  const availableViaturas = useMemo(() => {
    if (isMaster) {
      if (unidadeId) {
        return viaturas.filter((v) => v.unidadeId === unidadeId);
      }
      return viaturas;
    }
    return viaturas;
  }, [viaturas, isMaster, unidadeId]);

  // When vehicle selected, auto-fill details
  const handleSelectViatura = (vtrId: string) => {
    setSelectedViaturaId(vtrId);
    const vtr = viaturas.find((v) => v.id === vtrId);
    if (vtr) {
      setQuilometragem(vtr.quilometragem);
      if (isMaster) {
        setUnidadeId(vtr.unidadeId);
      }
    }
  };

  const selectedViatura = viaturas.find((v) => v.id === selectedViaturaId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedViaturaId || !selectedViatura) {
      setError('Por favor, selecione uma viatura para abrir a OS.');
      return;
    }
    if (!descricaoProblema.trim()) {
      setError('Por favor, detalhe o problema ou o serviço solicitado.');
      return;
    }
    if (quilometragem <= 0) {
      setError('A quilometragem informada deve ser maior que zero.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const now = new Date().toISOString();
      const statusInicial = selectedOficinaId ? 'ENVIADA_A_OFICINA' : 'ABERTA';

      const newOS = createOS({
        viaturaId: selectedViatura.id,
        prefixo: selectedViatura.prefixo,
        placa: selectedViatura.placa,
        nomeViatura: `${selectedViatura.marca} ${selectedViatura.modelo} (${selectedViatura.ano})`,
        unidadeId: selectedViatura.unidadeId,
        oficinaId: selectedOficinaId || undefined,
        status: statusInicial,
        tipoManutencao,
        prioridade,
        quilometragemMomento: quilometragem,
        descricaoProblema: descricaoProblema.trim(),
        valorEstimado: valorEstimado ? parseFloat(valorEstimado) : undefined,
        dataEnvioOficina: selectedOficinaId ? now : undefined,
      });

      onSuccess(newOS.id);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar a Ordem de Serviço.');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para a Lista
        </button>

        <div className="text-xs text-slate-500">
          Credenciamento Frota 2027 • Abertura Oficial
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex items-start gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-2xl border border-indigo-200 dark:border-indigo-800 shrink-0">
            <FilePlus className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Abertura de Ordem de Serviço
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Preencha os dados da viatura, o tipo de manutenção e descreva as avarias identificadas para direcionamento à oficina credenciada.
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Unidade (if Master) & Viatura Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isMaster && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Unidade Operacional Responsável <span className="text-rose-500">*</span>
                </label>
                <select
                  value={unidadeId}
                  onChange={(e) => {
                    setUnidadeId(e.target.value);
                    setSelectedViaturaId('');
                  }}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  {allUnidades.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.sigla} - {u.nome} ({u.cidade})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className={isMaster ? '' : 'sm:col-span-2'}>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Selecione a Viatura da Frota <span className="text-rose-500">*</span>
              </label>
              <select
                id="select-os-viatura"
                value={selectedViaturaId}
                onChange={(e) => handleSelectViatura(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="">-- Escolha uma viatura cadastrada --</option>
                {availableViaturas.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.prefixo} • {v.marca} {v.modelo} • Placa: {v.placa} ({v.status})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Viatura Auto-Fill Summary Card */}
          {selectedViatura && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-750 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Prefixo</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">{selectedViatura.prefixo}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Placa</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">{selectedViatura.placa}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Marca / Modelo</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{selectedViatura.marca} {selectedViatura.modelo} ({selectedViatura.ano})</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Status Atual</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">{selectedViatura.status}</span>
              </div>
            </div>
          )}

          {/* Maintenance Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Tipo de Manutenção <span className="text-rose-500">*</span>
              </label>
              <select
                id="select-os-tipo"
                value={tipoManutencao}
                onChange={(e) => setTipoManutencao(e.target.value as TipoManutencao)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="CORRETIVA">Corretiva (Reparo / Quebra)</option>
                <option value="PREVENTIVA">Preventiva (Revisão Programada)</option>
                <option value="REVISAO_PERIODICA">Revisão Periódica (KM)</option>
                <option value="EMERGENCIAL">Emergencial (Socorro)</option>
                <option value="FUNILARIA_PINTURA">Funilaria & Pintura</option>
                <option value="ELETRICA">Elétrica & Injeção Eletrônica</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Prioridade do Reparo <span className="text-rose-500">*</span>
              </label>
              <select
                id="select-os-prioridade"
                value={prioridade}
                onChange={(e) => setPrioridade(e.target.value as PrioridadeOS)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-semibold"
              >
                <option value="NORMAL">Normal</option>
                <option value="ALTA">Alta</option>
                <option value="URGENTE">Urgente (Viatura de Linha de Frente)</option>
                <option value="BAIXA">Baixa</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Quilometragem (Hodômetro) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="input-os-km"
                  type="number"
                  min="0"
                  value={quilometragem || ''}
                  onChange={(e) => setQuilometragem(parseInt(e.target.value, 10) || 0)}
                  placeholder="Ex: 85400"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">
                  km
                </span>
              </div>
            </div>
          </div>

          {/* Description of Problem */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Descrição Detalhada do Problema / Relato da Guarnição <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="textarea-os-problema"
              rows={4}
              value={descricaoProblema}
              onChange={(e) => setDescricaoProblema(e.target.value)}
              placeholder="Descreva minuciosamente as falhas mecânicas, ruídos, luzes de advertência no painel ou serviços preventivos solicitados..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            />
          </div>

          {/* Workshop Assignment & Budget estimate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Oficina Credenciada Designada
              </label>
              <select
                id="select-os-oficina"
                value={selectedOficinaId}
                onChange={(e) => setSelectedOficinaId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">-- Deixar para atribuição posterior --</option>
                {allOficinas.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.nome} ({o.cidade}) • Nota: {o.avaliacao} ★
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                Ao selecionar a oficina, a OS será imediatamente direcionada para a esteira de orçamento técnico.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Valor Estimado Inicial (Opcional - R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={valorEstimado}
                onChange={(e) => setValorEstimado(e.target.value)}
                placeholder="Ex: 1500.00"
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Estimativa orçamentária prévia da unidade gestora.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              id="btn-submit-create-os"
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              {submitting ? 'Gravando Ordem...' : 'Gerar Ordem de Serviço'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
