import React, { useState } from 'react';
import { History, Search, Filter, Calendar, FileText, ArrowDownRight, ArrowUpRight, RotateCcw } from 'lucide-react';
import { StockMovement, MovementType } from '../types';
import { formatDate } from '../utils/formatters';

interface MovementsTabProps {
  movements: StockMovement[];
}

export const MovementsTab: React.FC<MovementsTabProps> = ({ movements }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [periodFilter, setPeriodFilter] = useState<string>('ALL');

  const filteredMovements = movements.filter((m) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      m.productName.toLowerCase().includes(query) ||
      m.sku.toLowerCase().includes(query) ||
      m.user.toLowerCase().includes(query) ||
      (m.osId && m.osId.toLowerCase().includes(query)) ||
      m.reason.toLowerCase().includes(query);

    const matchesType = typeFilter === 'ALL' || m.type === typeFilter;

    let matchesPeriod = true;
    const date = new Date(m.date);
    const now = new Date();

    if (periodFilter === 'TODAY') {
      matchesPeriod = date.toDateString() === now.toDateString();
    } else if (periodFilter === '7DAYS') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesPeriod = date >= sevenDaysAgo;
    } else if (periodFilter === '30DAYS') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      matchesPeriod = date >= thirtyDaysAgo;
    } else if (periodFilter === 'THIS_MONTH') {
      matchesPeriod = date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }

    return matchesSearch && matchesType && matchesPeriod;
  });

  const getTypeBadge = (type: MovementType) => {
    switch (type) {
      case 'ENTRADA':
        return (
          <span className="inline-flex items-center space-x-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono">
            <ArrowUpRight className="w-3 h-3" />
            <span>+ Entrada</span>
          </span>
        );
      case 'ESTORNO':
        return (
          <span className="inline-flex items-center space-x-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono">
            <RotateCcw className="w-3 h-3" />
            <span>Estorno</span>
          </span>
        );
      case 'BAIXA_OS':
      case 'VENDA':
      case 'BAIXA':
      case 'PERDA':
      case 'AVARIA':
        return (
          <span className="inline-flex items-center space-x-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono">
            <ArrowDownRight className="w-3 h-3" />
            <span>- {type.replace('_', ' ')}</span>
          </span>
        );
      default:
        return (
          <span className="bg-zinc-800 text-zinc-300 border border-zinc-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono">
            {type}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-zinc-900/80 p-5 rounded-2xl border border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-tactical tracking-wider flex items-center gap-2">
            <History className="w-6 h-6 text-amber-500" />
            <span>HISTÓRICO COMPLETO DE MOVIMENTAÇÕES DE ESTOQUE</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Registro auditável de entradas, baixas por OS, vendas diretas, ajustes e estornos no arsenal.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-zinc-500 font-mono block">Total de Registros</span>
          <span className="text-xl font-bold text-amber-400 font-tactical">{filteredMovements.length} movimentações</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-tactical-card border border-zinc-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por equipamento, SKU, operador ou OS..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 placeholder-zinc-500 font-mono"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs">
          <Filter className="w-4 h-4 text-zinc-500 shrink-0 mr-1" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="ALL">Todos os Tipos</option>
            <option value="ENTRADA">Entradas (+)</option>
            <option value="BAIXA_OS">Baixas por OS (-)</option>
            <option value="VENDA">Vendas Balcão (-)</option>
            <option value="ESTORNO">Estornos (+)</option>
            <option value="AJUSTE">Ajustes</option>
            <option value="PERDA">Perdas / Avarias</option>
          </select>

          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="ALL">Todo o Período</option>
            <option value="TODAY">Hoje</option>
            <option value="7DAYS">Últimos 7 dias</option>
            <option value="30DAYS">Últimos 30 dias</option>
            <option value="THIS_MONTH">Este Mês</option>
          </select>
        </div>
      </div>

      {/* Movements Table */}
      <div className="bg-tactical-card border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 uppercase text-[10px] tracking-wider font-tactical">
              <tr>
                <th className="p-4 font-semibold">Data / Hora</th>
                <th className="p-4 font-semibold">Tipo</th>
                <th className="p-4 font-semibold">Equipamento</th>
                <th className="p-4 font-semibold text-center">Quantidade</th>
                <th className="p-4 font-semibold">OS / Ref.</th>
                <th className="p-4 font-semibold">Responsável</th>
                <th className="p-4 font-semibold">Motivo / Obs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {filteredMovements.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500 font-mono">
                    Nenhuma movimentação encontrada com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredMovements.map((m) => (
                  <tr key={m.id} className="hover:bg-zinc-900/60 transition">
                    <td className="p-4 font-mono text-[11px] text-zinc-400">{formatDate(m.date)}</td>
                    <td className="p-4">{getTypeBadge(m.type)}</td>
                    <td className="p-4">
                      <div className="font-bold text-zinc-100">{m.productName}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">SKU: {m.sku}</div>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                          m.type === 'ENTRADA' || m.type === 'ESTORNO'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {m.type === 'ENTRADA' || m.type === 'ESTORNO' ? `+${m.qty}` : `-${m.qty}`} un
                      </span>
                    </td>
                    <td className="p-4 font-mono text-amber-400 font-bold">{m.osId || '-'}</td>
                    <td className="p-4 text-zinc-300 font-medium">{m.user}</td>
                    <td className="p-4 text-zinc-400 text-[11px]">
                      {m.reason}
                      {m.supplier ? ` • Fornecedor: ${m.supplier}` : ''}
                      {m.invoice ? ` • NF: ${m.invoice}` : ''}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
