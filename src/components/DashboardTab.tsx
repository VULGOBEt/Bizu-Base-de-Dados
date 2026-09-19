import React, { useState } from 'react';
import {
  Layers,
  DollarSign,
  AlertTriangle,
  ShoppingBag,
  BellRing,
  Activity as ActivityIcon,
  ShieldCheck,
  Plus,
  Clock,
  TrendingUp,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Product, Order, Activity, TabType, ServiceOrder } from '../types';
import { formatBRL, formatDate } from '../utils/formatters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

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
  const [trendDays, setTrendDays] = useState<7 | 30>(7);

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

  // Dynamic Sales Trend Chart for Dashboard
  const daysArray = Array.from({ length: trendDays }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (trendDays - 1 - i));
    return d;
  });

  const trendLabels = daysArray.map((d) => `${d.getDate()}/${d.getMonth() + 1}`);
  const trendData = daysArray.map((d) => {
    const dayStr = d.toISOString().slice(0, 10);
    return sales
      .filter((s) => s.date.startsWith(dayStr))
      .reduce((sum, s) => sum + Number(s.total), 0);
  });

  const chartData = {
    labels: trendLabels,
    datasets: [
      {
        label: 'Vendas (R$)',
        data: trendData,
        fill: true,
        tension: 0.4,
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.14)',
        borderWidth: 2.5,
        pointRadius: trendDays === 30 ? 2.5 : 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#f59e0b',
        pointBorderColor: '#09090b',
        pointBorderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#09090b',
        borderColor: '#27272a',
        borderWidth: 1,
        titleColor: '#f4f4f5',
        bodyColor: '#f59e0b',
        padding: 10,
        callbacks: {
          label: (ctx: any) => `Vendas: ${formatBRL(ctx.parsed.y || 0)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#a1a1aa', font: { size: 10 } },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      y: {
        ticks: {
          color: '#a1a1aa',
          font: { size: 10 },
          callback: (val: any) => `R$ ${val}`,
        },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => onSwitchTab('service-orders')}
          className="bg-tactical-card border border-zinc-800 p-5 rounded-2xl flex items-center justify-between relative overflow-hidden group hover:border-amber-500/50 transition cursor-pointer"
        >
          <div className="space-y-1">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Ordens Não Concluídas</p>
            <h3 className="text-2xl font-bold text-amber-400 font-tactical">{uncompletedCount}</h3>
            <p className="text-[11px] text-zinc-500 font-mono">Em andamento</p>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-xl group-hover:scale-110 transition-transform">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-tactical-card border border-zinc-800 p-5 rounded-2xl flex items-center justify-between relative overflow-hidden group hover:border-sky-500/50 transition">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Vendas / Baixas do Mês</p>
            <h3 className="text-2xl font-bold text-sky-400 font-tactical">{formatBRL(monthlySalesTotal)}</h3>
            <p className="text-[11px] text-zinc-500">{currentMonthSales.length} baixas concluídas</p>
          </div>
          <div className="p-3 bg-sky-500/10 text-sky-400 border border-sky-500/30 rounded-xl group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-tactical-card border border-zinc-800 p-5 rounded-2xl flex items-center justify-between relative overflow-hidden group hover:border-amber-500/50 transition">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Estoque Crítico</p>
            <h3 className="text-2xl font-bold text-amber-400 font-tactical">{lowStockProducts.length}</h3>
            <p className="text-[11px] text-amber-400/80 font-medium">Equipamentos a repor</p>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-xl group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-tactical-card border border-zinc-800 p-5 rounded-2xl flex items-center justify-between relative overflow-hidden group hover:border-emerald-500/50 transition">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Valor do Arsenal</p>
            <h3 className="text-2xl font-bold text-emerald-400 font-tactical">{formatBRL(totalValue)}</h3>
            <p className="text-[11px] text-zinc-500">Total em estoque</p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl group-hover:scale-110 transition-transform">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Dynamic Sales Chart in Dashboard */}
      <div className="bg-tactical-card border border-zinc-800 p-5 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-zinc-100 font-tactical text-sm uppercase">
              Desempenho de Vendas Recentes
            </h3>
          </div>
          <div className="flex items-center space-x-1.5 bg-zinc-950/80 p-1 rounded-xl border border-zinc-800 self-start sm:self-auto">
            <button
              onClick={() => setTrendDays(7)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                trendDays === 7
                  ? 'bg-amber-500 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Última Semana
            </button>
            <button
              onClick={() => setTrendDays(30)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                trendDays === 30
                  ? 'bg-amber-500 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Último Mês
            </button>
          </div>
        </div>

        <div className="h-56 relative pt-1">
          <Line data={chartData} options={chartOptions} />
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
                  <th className="pb-3 font-semibold">Categoria</th>
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
                      <td className="py-3 font-semibold text-zinc-200">
                        {p.name}
                        {p.size && (
                          <span className="ml-2 text-[10px] text-amber-400 font-mono bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 rounded">
                            {p.size}
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-zinc-400 text-[11px]">{p.category}</td>
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
