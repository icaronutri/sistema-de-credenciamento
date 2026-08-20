import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  BarChart3,
  DollarSign,
  Calendar,
  Building2,
  Wrench,
  Download,
  Printer,
  TrendingUp,
  Clock,
  Car,
  FileSpreadsheet,
} from 'lucide-react';

export const RelatoriosView: React.FC = () => {
  const { permissoes } = useAuth();
  const { ordensServico, allUnidades, allOficinas, viaturas } = useData();

  const [unidadeFilter, setUnidadeFilter] = useState('TODAS');
  const [oficinaFilter, setOficinaFilter] = useState('TODAS');

  // Filtered dataset
  const filteredOS = useMemo(() => {
    return (ordensServico || []).filter((os) => {
      if (unidadeFilter !== 'TODAS' && os.unidadeId !== unidadeFilter) return false;
      if (oficinaFilter !== 'TODAS' && os.oficinaId !== oficinaFilter) return false;
      return true;
    });
  }, [ordensServico, unidadeFilter, oficinaFilter]);

  // Aggregations
  const totalGasto = useMemo(() => {
    return (filteredOS || [])
      .filter((os) => os.status === 'FINALIZADA' || os.status === 'AGUARDANDO_CONFERENCIA' || os.status === 'SERVICO_CONCLUIDO')
      .reduce((acc, os) => acc + (os.valorFinal || os.valorAprovado || 0), 0);
  }, [filteredOS]);

  const totalEmAndamento = useMemo(() => {
    return (filteredOS || [])
      .filter((os) => os.status !== 'FINALIZADA' && os.status !== 'CANCELADA')
      .reduce((acc, os) => acc + (os.valorFinal || os.valorAprovado || os.valorEstimado || 0), 0);
  }, [filteredOS]);

  // Breakdown by Unidade
  const porUnidade = useMemo(() => {
    return (allUnidades || []).map((u) => {
      const osList = (ordensServico || []).filter((os) => os.unidadeId === u.id);
      const total = osList.reduce((acc, os) => acc + (os.valorFinal || os.valorAprovado || 0), 0);
      const ativas = osList.filter((os) => os.status !== 'FINALIZADA' && os.status !== 'CANCELADA').length;
      return {
        id: u.id,
        sigla: u.sigla,
        nome: u.nome,
        qtdOS: osList.length,
        ativas,
        total,
      };
    });
  }, [allUnidades, ordensServico]);

  // Breakdown by Oficina
  const porOficina = useMemo(() => {
    return (allOficinas || []).map((o) => {
      const osList = (ordensServico || []).filter((os) => os.oficinaId === o.id);
      const total = osList.reduce((acc, os) => acc + (os.valorFinal || os.valorAprovado || 0), 0);
      const concluidas = osList.filter((os) => os.status === 'FINALIZADA').length;
      return {
        id: o.id,
        nome: o.nome,
        cnpj: o.cnpj,
        qtdOS: osList.length,
        concluidas,
        total,
        avaliacao: o.avaliacao || 4.8,
      };
    });
  }, [allOficinas, ordensServico]);

  // Breakdown by Tipo de Manutenção
  const porTipo = useMemo(() => {
    const tipos = ['CORRETIVA', 'PREVENTIVA', 'REVISAO_PERIODICA', 'EMERGENCIAL', 'FUNILARIA_PINTURA', 'ELETRICA'];
    return tipos.map((t) => {
      const osList = (ordensServico || []).filter((os) => os.tipoManutencao === t);
      const total = osList.reduce((acc, os) => acc + (os.valorFinal || os.valorAprovado || 0), 0);
      return {
        tipo: t,
        count: osList.length,
        total,
      };
    });
  }, [ordensServico]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Tipo Relatório', 'Identificador', 'Qtd OS', 'Valor Total (R$)'];
    const rows: string[][] = [];

    porUnidade.forEach((u) => {
      rows.push(['Unidade', `"${u.sigla} - ${u.nome}"`, u.qtdOS.toString(), u.total.toFixed(2)]);
    });

    porOficina.forEach((o) => {
      rows.push(['Oficina', `"${o.nome}"`, o.qtdOS.toString(), o.total.toFixed(2)]);
    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_gerencial_2027_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Relatórios Gerenciais & Auditoria 2027
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Inteligência operacional, métricas de faturamento por unidade e desempenho da rede credenciada
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Faturado & Liquidado
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              R$ {totalGasto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <p className="text-xs text-slate-500 mt-1">Conferência de NF homologada</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Em Manutenção / Aprovação
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
              R$ {totalEmAndamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <p className="text-xs text-slate-500 mt-1">Em execução ou esteira orçamentária</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Tempo Médio em Oficina
            </span>
            <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              3.4 dias
            </span>
            <p className="text-xs text-slate-500 mt-1">Dentro do SLA de 5 dias do Credenciamento</p>
          </div>
        </div>
      </div>

      {/* Breakdown Section: Unidades */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-500" />
            Investimento & Ordens por Unidade Operacional
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Sigla</th>
                <th className="py-3 px-4">Nome da Unidade</th>
                <th className="py-3 px-4 text-center">Total OS</th>
                <th className="py-3 px-4 text-center">OS Ativas</th>
                <th className="py-3 px-4 text-right">Valor Total Acumulado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {porUnidade.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                    {u.sigla}
                  </td>
                  <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-medium">
                    {u.nome}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-slate-900 dark:text-white">
                    {u.qtdOS}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                      {u.ativas}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                    R$ {u.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Breakdown Section: Oficinas */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-emerald-500" />
            Faturamento & Performance por Oficina Credenciada
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Oficina Credenciada</th>
                <th className="py-3 px-4">CNPJ</th>
                <th className="py-3 px-4 text-center">Avaliação</th>
                <th className="py-3 px-4 text-center">Concluídas</th>
                <th className="py-3 px-4 text-right">Faturamento Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {porOficina.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {o.nome}
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono">
                    {o.cnpj}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-amber-500">
                    ★ {o.avaliacao.toFixed(1)}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400">
                    {o.concluidas} OS
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                    R$ {o.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
