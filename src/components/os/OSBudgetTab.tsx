import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { OrdemServico, ItemOrcamento, TipoItemOrcamento } from '../../types';
import {
  DollarSign,
  Plus,
  Trash2,
  Send,
  Wrench,
  Package,
  Layers,
  Save,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface OSBudgetTabProps {
  os: OrdemServico;
  onUpdateOS: (updated: Partial<OrdemServico>) => void;
}

export const OSBudgetTab: React.FC<OSBudgetTabProps> = ({ os, onUpdateOS }) => {
  const { currentUser, perfil, permissoes } = useAuth();
  const { getItensByOS, saveItem, deleteItem, changeStatusOS } = useData();

  const itens = getItensByOS(os.id);

  // Editing Diagnosis
  const [diagnostico, setDiagnostico] = useState(os.diagnosticoTecnico || '');
  const [savedDiagnosis, setSavedDiagnosis] = useState(false);

  // New Item State
  const [tipo, setTipo] = useState<TipoItemOrcamento>('PECA');
  const [descricao, setDescricao] = useState('');
  const [codigoPeca, setCodigoPeca] = useState('');
  const [quantidade, setQuantidade] = useState<number>(1);
  const [unidadeMedida, setUnidadeMedida] = useState('UN');
  const [valorUnitario, setValorUnitario] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [itemError, setItemError] = useState('');

  // Is budget editable? Only if workshop or master and status allows
  const isEditable =
    (permissoes.isOficina || permissoes.isMaster) &&
    (os.status === 'ENVIADA_A_OFICINA' ||
      os.status === 'AGUARDANDO_ORCAMENTO' ||
      os.status === 'DEVOLVIDA_PARA_CORRECAO' ||
      os.status === 'ABERTA');

  // Math Calculations
  const totals = useMemo(() => {
    let totalPecas = 0;
    let totalServicos = 0;
    let totalOutros = 0;

    itens.forEach((i) => {
      const v = i.valorTotal || i.quantidade * i.valorUnitario;
      if (i.tipo === 'PECA') totalPecas += v;
      else if (i.tipo === 'SERVICO') totalServicos += v;
      else totalOutros += v;
    });

    const totalGeral = totalPecas + totalServicos + totalOutros;
    return { totalPecas, totalServicos, totalOutros, totalGeral };
  }, [itens]);

  const handleSaveDiagnosis = () => {
    onUpdateOS({ diagnosticoTecnico: diagnostico.trim() });
    setSavedDiagnosis(true);
    setTimeout(() => setSavedDiagnosis(false), 3000);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim()) {
      setItemError('Informe a descrição do item.');
      return;
    }
    const vu = parseFloat(valorUnitario);
    if (isNaN(vu) || vu <= 0) {
      setItemError('Informe um valor unitário válido maior que zero.');
      return;
    }
    if (quantidade <= 0) {
      setItemError('A quantidade deve ser maior que zero.');
      return;
    }

    setItemError('');

    const newItem: ItemOrcamento = {
      id: `item-${Date.now()}`,
      osId: os.id,
      tipo,
      descricao: descricao.trim(),
      codigoPeca: codigoPeca.trim() || undefined,
      quantidade,
      unidadeMedida,
      valorUnitario: vu,
      valorTotal: quantidade * vu,
      aprovado: true,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };

    saveItem(newItem);

    // Reset Form
    setDescricao('');
    setCodigoPeca('');
    setQuantidade(1);
    setValorUnitario('');
    setShowAddForm(false);
  };

  const handleSubmitOrcamento = () => {
    if (itens.length === 0) {
      alert('Adicione ao menos um item de peça ou serviço no orçamento.');
      return;
    }
    if (!diagnostico.trim()) {
      alert('Por favor, preencha o diagnóstico técnico antes de submeter.');
      return;
    }

    if (
      confirm(
        `Deseja submeter este orçamento de R$ ${totals.totalGeral.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
        })} para aprovação do Master?`
      )
    ) {
      onUpdateOS({ diagnosticoTecnico: diagnostico.trim(), valorFinal: totals.totalGeral });
      changeStatusOS(
        os.id,
        'AGUARDANDO_APROVACAO',
        `Orçamento enviado pela oficina no valor de R$ ${totals.totalGeral.toFixed(2)} (${itens.length} itens).`,
        {
          dataRespostaOficina: new Date().toISOString(),
          valorFinal: totals.totalGeral,
        }
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Technical Diagnostic Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Wrench className="w-4 h-4 text-indigo-500" />
            Laudo Técnico / Diagnóstico da Oficina
          </h4>
          {isEditable && (
            <button
              onClick={handleSaveDiagnosis}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              {savedDiagnosis ? 'Salvo!' : 'Salvar Diagnóstico'}
            </button>
          )}
        </div>

        {isEditable ? (
          <textarea
            id="textarea-os-diagnostico"
            rows={3}
            value={diagnostico}
            onChange={(e) => setDiagnostico(e.target.value)}
            placeholder="Descreva o laudo pericial mecânico, componentes com desgaste constatado, causas da falha e procedimentos técnicos recomendados..."
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 leading-relaxed"
          />
        ) : (
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed">
            {diagnostico || 'Diagnóstico técnico ainda não preenchido pela oficina.'}
          </p>
        )}
      </div>

      {/* Budget Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Peças & Componentes</span>
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            R$ {totals.totalPecas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Mão de Obra / Serviços</span>
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            R$ {totals.totalServicos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-300 block">Total do Orçamento</span>
          <span className="text-xl font-extrabold text-indigo-900 dark:text-indigo-200">
            R$ {totals.totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Item List Table & Adder */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Itens do Orçamento ({itens.length})
            </h4>
            <p className="text-xs text-slate-500">
              Discriminação de peças de reposição e serviços mecânicos autorizados
            </p>
          </div>

          {isEditable && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              {showAddForm ? 'Fechar Formulário' : 'Adicionar Item'}
            </button>
          )}
        </div>

        {/* Inline Add Item Form */}
        {showAddForm && (
          <form
            onSubmit={handleAddItem}
            className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3 animate-fadeIn text-xs"
          >
            <h5 className="font-bold text-slate-800 dark:text-slate-200">Novo Item do Orçamento</h5>
            {itemError && <p className="text-rose-500 font-semibold">{itemError}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
              <div className="sm:col-span-1">
                <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Tipo</label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as TipoItemOrcamento)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="PECA">Peça</option>
                  <option value="SERVICO">Serviço</option>
                  <option value="OUTRO">Outro</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Descrição</label>
                <input
                  type="text"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Ex: Jogo de Pastilhas de Freio Dianteiras"
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Cód. Peça</label>
                <input
                  type="text"
                  value={codigoPeca}
                  onChange={(e) => setCodigoPeca(e.target.value)}
                  placeholder="Ex: BR-449"
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Qtd.</label>
                <input
                  type="number"
                  min="1"
                  value={quantidade}
                  onChange={(e) => setQuantidade(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Unidade</label>
                <select
                  value={unidadeMedida}
                  onChange={(e) => setUnidadeMedida(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="UN">UN</option>
                  <option value="HR">HR</option>
                  <option value="L">L</option>
                  <option value="KG">KG</option>
                  <option value="JG">JG</option>
                  <option value="PAR">PAR</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Valor Unitário (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={valorUnitario}
                  onChange={(e) => setValorUnitario(e.target.value)}
                  placeholder="Ex: 180.50"
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="sm:col-span-3 flex items-end justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-xs"
                >
                  Inserir no Orçamento
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Table of Items */}
        {itens.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-400">
            Nenhum item adicionado ao orçamento ainda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Tipo</th>
                  <th className="py-2.5 px-3">Descrição do Item</th>
                  <th className="py-2.5 px-3">Cód.</th>
                  <th className="py-2.5 px-3 text-center">Qtd.</th>
                  <th className="py-2.5 px-3 text-right">Unitário</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                  {isEditable && <th className="py-2.5 px-3 text-center">Remover</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {itens.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.tipo === 'PECA'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        }`}
                      >
                        {item.tipo}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">
                      {item.descricao}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono">
                      {item.codigoPeca || '—'}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-800 dark:text-slate-200">
                      {item.quantidade} {item.unidadeMedida}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-700 dark:text-slate-300">
                      R$ {item.valorUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                      R${' '}
                      {(item.valorTotal || item.quantidade * item.valorUnitario).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    {isEditable && (
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => deleteItem(item.id, os.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title="Remover item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Submission CTA for Workshop */}
      {isEditable && (
        <div className="p-5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-indigo-950 dark:text-indigo-200">
              Pronto para submeter à aprovação do Master?
            </h4>
            <p className="text-xs text-indigo-800/80 dark:text-indigo-300 mt-0.5">
              Valor Total: <strong>R$ {totals.totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> ({itens.length} itens cadastrados)
            </p>
          </div>
          <button
            id="btn-submit-orcamento"
            onClick={handleSubmitOrcamento}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 shrink-0"
          >
            <Send className="w-4 h-4" />
            Submeter Orçamento ao Master
          </button>
        </div>
      )}
    </div>
  );
};
