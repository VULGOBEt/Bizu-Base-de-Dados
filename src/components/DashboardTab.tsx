import React from 'react';
import { Layers, DollarSign, AlertTriangle, ShoppingBag, BellRing, Activity as ActivityIcon, ShieldCheck, Plus, Clock } from 'lucide-react';
import { Product, Order, Activity, TabType, ServiceOrder } from '../types';
import { formatBRL, formatDate } from '../utils/formatters';

interface DashboardTabProps {
  products: Product[];
  sales: Order[];
  serviceOrders?: ServiceOrder[];
  pendingOrdersCount?: number;
  activities: Activity[];
  onSwitchTab: (tab: TabType) => void;
  onOpenAdjustModal: (productId: string) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  products = [],
  sales = [],
  serviceOrders = [],
  pendingOrdersCount,
  activities = [],
  onSwitchTab,
  onOpenAdjustModal,
}) => {
  const totalValue = products.reduce((acc, p) => acc + Number(p.stock) * Number(p.salePrice), 0);
  const lowStockProducts = products.filter((p) => Number(p.stock) <= Number(p.minStock));

  const uncompletedCount = pendingOrdersCount !== undefined
    ? pendingOrdersCount
    : serviceOrders.filter((os) => os.status !== 'CONCLUIDO' && os.status !== 'CANCELADO').length;

  const now = new Date();
  const currentMonthSales = sales.filter((s) => {
    const sd = new Date(s.date);
    return sd.getMonth() === now.getMonth() && sd.getFullYear() === now.getFullYear();
  });
  const monthlySalesTotal = currentMonthSales.reduce((acc, s) => acc + Number(s.total), 0);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => onSwitchTab('service-orders')}
          className="bg-tactical-card border border-zinc-800 p-5 rounded-2xl flex items-center justify-between relative overflow-hidden group hover:border-zinc-700 transition cursor-pointer"
        >
          <div className="space-y-1">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Pedidos Não Concluídos</p>
            <h3 className="text-2xl font-bold text-amber-400 font-tactical">{uncompletedCount}</h3>
            <p className="text-[11px] text-zinc-500 font-mono">Em andamento / aguardando</p>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-xl group-hover:scale-110 transition-transform">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-tactical-card border border-zinc-800 p-5 rounded-2xl flex items-center justify-between relative overflow-hidden group hover:border-zinc-700 transition">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Vendas / Baixas do Mês</p>
            <h3 className="text-2xl font-bold text-sky-400 font-tactical">{formatBRL(monthlySalesTotal)}</h3>
            <p className="text-[11px] text-zinc-500">{currentMonthSales.length} pedidos concluídos</p>
          </div>
          <div className="p-3 bg-sky-500/10 text-sky-400 border border-sky-500/30 rounded-xl group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-tactical-card border border-zinc-800 p-5 rounded-2xl flex items-center justify-between relative overflow-hidden group hover:border-zinc-700 transition">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Estoque Crítico</p>
            <h3 className="text-2xl font-bold text-amber-400 font-tactical">{lowStockProducts.length}</h3>
            <p className="text-[11px] text-amber-400/80 font-medium">Equipamentos a repor</p>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-xl group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-tactical-card border border-zinc-800 p-5 rounded-2xl flex items-center justify-between relative overflow-hidden group hover:border-zinc-700 transition">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Valor do Estoque</p>
            <h3 className="text-2xl font-bold text-emerald-400 font-tactical">{formatBRL(totalValue)}</h3>
            <p className="text-[11px] text-zinc-500">Baseado no valor de venda</p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl group-hover:scale-110 transition-transform">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Dashboard Low Stock & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-tactical-card border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-zinc-100 flex items-center space-x-2 font-tactical">
                <BellRing className="w-4 h-4 text-amber-400" />
                <span>Alerta de Reposição de Equipamentos</span>
              </h3>
              <p className="text-xs text-zinc-400">Itens do arsenal com quantidade em limite crítico</p>
            </div>
            <button
              onClick={() => onSwitchTab('products')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold uppercase tracking-wider cursor-pointer"
            >
              Ver Todos
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-zinc-400 border-b border-zinc-800 uppercase text-[10px] tracking-wider">
                  <th className="pb-3 font-semibold">Equipamento</th>
                  <th className="pb-3 font-semibold">Cód. SKU</th>
                  <th className="pb-3 font-semibold text-center">Qtde Atual</th>
                  <th className="pb-3 font-semibold text-center">Qtde Mín.</th>
                  <th className="pb-3 font-semibold text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {lowStockProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-zinc-500 font-mono">
                      Nenhum equipamento em nível crítico! 🎖️
                    </td>
                  </tr>
                ) : (
                  lowStockProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-zinc-900/60 transition">
                      <td className="py-3 font-semibold text-zinc-200">{p.name}</td>
                      <td className="py-3 text-zinc-400 font-mono text-[11px]">{p.sku}</td>
                      <td className="py-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
                            p.stock === 0
                              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          }`}
                        >
                          {p.stock} un
                        </span>
                      </td>
                      <td className="py-3 text-center text-zinc-400 font-mono">{p.minStock} un</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => onOpenAdjustModal(p.id)}
                          className="text-xs bg-zinc-800 hover:bg-amber-500 hover:text-black text-amber-400 px-2.5 py-1 rounded-lg transition font-bold uppercase cursor-pointer"
                        >
                          + Repor
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="bg-tactical-card border border-zinc-800 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-zinc-100 flex items-center space-x-2 font-tactical">
            <ActivityIcon className="w-4 h-4 text-amber-400" />
            <span>Últimas Movimentações</span>
          </h3>
          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
            {activities.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-4 font-mono">Nenhuma movimentação registrada.</p>
            ) : (
              activities.slice(0, 7).map((a) => (
                <div key={a.id} className="flex items-start space-x-2.5 text-xs">
                  <div
                    className={`p-1 rounded ${
                      a.type === 'SALE'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    } shrink-0 mt-0.5`}
                  >
                    {a.type === 'SALE' ? <ShieldCheck className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-zinc-300 font-medium leading-tight">{a.description}</p>
                    <span className="text-[10px] text-zinc-500 font-mono">{formatDate(a.date)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
