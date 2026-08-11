import React, { useState } from 'react';
import { TrendingUp, Award, Calendar, DollarSign, BarChart3, ShoppingBag, ShieldAlert, Lock } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Product, Order, UserPermission } from '../types';
import { formatBRL } from '../utils/formatters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ReportsTabProps {
  products: Product[];
  sales: Order[];
  activeUser?: UserPermission;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({ products = [], sales = [], activeUser }) => {
  const [viewType, setViewType] = useState<'daily' | 'monthly'>('daily');

  // Check role permission
  if (activeUser && !activeUser.canViewReports) {
    return (
      <div className="bg-tactical-card border border-rose-500/40 p-8 rounded-2xl text-center space-y-5 max-w-xl mx-auto my-8 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/40 shadow-lg shadow-rose-500/10">
          <ShieldAlert className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <span className="bg-rose-500/20 text-rose-400 text-xs font-bold font-mono px-3 py-1 rounded-md border border-rose-500/30">
            AÇÃO RECUSADA • SEGURANÇA DO ARSENAL
          </span>
          <h3 className="text-xl font-bold text-white font-tactical uppercase tracking-wide">
            Acesso Restrito ao Cargo {activeUser.role}
          </h3>
          <p className="text-xs text-zinc-300 leading-relaxed">
            O operador <strong className="text-white">{activeUser.name}</strong> ({activeUser.email}) com o cargo <strong className="text-amber-400">{activeUser.role}</strong> não possui autorização para visualizar os relatórios estatísticos e financeiros.
          </p>
        </div>

        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-left text-xs space-y-2">
          <div className="flex items-center space-x-2 text-amber-400 font-bold uppercase tracking-wider font-tactical">
            <Lock className="w-4 h-4" />
            <span>Permissões de Cargos do Sistema</span>
          </div>
          <ul className="space-y-1.5 text-zinc-400 text-[11px] font-mono">
            <li><strong className="text-amber-400">ADMINISTRADOR:</strong> Visualização total de relatórios, faturamento e fluxo de caixa.</li>
            <li><strong className="text-blue-400">GERENTE:</strong> Acesso aos relatórios de estoque e vendas.</li>
            <li><strong className="text-zinc-400">OPERADOR:</strong> <span className="text-rose-400 font-bold">Recusado</span> (Apenas registro de pedidos de balcão).</li>
          </ul>
        </div>

        <p className="text-[11px] text-zinc-500 italic">
          Para alterar seu operador ou cargo, utilize o seletor no topo da tela ou consulte um Administrador.
        </p>
      </div>
    );
  }

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Top Selling / Issued Equipment Map
  const productSalesMap: Record<string, number> = {};
  sales.forEach((s) => {
    s.items.forEach((i) => {
      productSalesMap[i.name] = (productSalesMap[i.name] || 0) + i.qty;
    });
  });

  const topList = Object.entries(productSalesMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Daily Sales of Current Month calculation
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const dailyTotals: number[] = new Array(daysInMonth).fill(0);

  let monthTotal = 0;
  let monthOrdersCount = 0;

  sales.forEach((order) => {
    const orderDate = new Date(order.date);
    if (!isNaN(orderDate.getTime())) {
      if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
        const day = orderDate.getDate() - 1; // 0-indexed
        if (day >= 0 && day < daysInMonth) {
          dailyTotals[day] += order.total;
          monthTotal += order.total;
          monthOrdersCount += 1;
        }
      }
    }
  });

  const averageTicket = monthOrdersCount > 0 ? monthTotal / monthOrdersCount : 0;

  // Yearly / Monthly calculation
  const monthlyTotals: number[] = new Array(12).fill(0);
  sales.forEach((order) => {
    const orderDate = new Date(order.date);
    if (!isNaN(orderDate.getTime()) && orderDate.getFullYear() === currentYear) {
      const m = orderDate.getMonth();
      monthlyTotals[m] += order.total;
    }
  });

  const dailyLabels = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = String(i + 1).padStart(2, '0');
    return `${dayNum}/${String(currentMonth + 1).padStart(2, '0')}`;
  });

  const chartDataDaily = {
    labels: dailyLabels,
    datasets: [
      {
        label: 'Vendas (R$)',
        data: dailyTotals,
        backgroundColor: 'rgba(234, 179, 8, 0.75)', // amber-500
        borderColor: '#eab308',
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: '#f59e0b',
      },
    ],
  };

  const chartDataMonthly = {
    labels: monthNames.map((m) => m.slice(0, 3)),
    datasets: [
      {
        label: 'Faturamento (R$)',
        data: monthlyTotals,
        backgroundColor: 'rgba(16, 185, 129, 0.75)', // emerald-500
        borderColor: '#10b981',
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: '#059669',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const val = context.parsed.y || 0;
            return `Total: ${formatBRL(val)}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#a1a1aa',
          font: { size: 10 },
          maxRotation: 45,
        },
        grid: {
          color: 'rgba(150, 150, 150, 0.1)',
        },
      },
      y: {
        ticks: {
          color: '#a1a1aa',
          font: { size: 10 },
          callback: (value: any) => `R$ ${value}`,
        },
        grid: {
          color: 'rgba(150, 150, 150, 0.1)',
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Monthly Sales Chart Card */}
      <div className="lg:col-span-7 bg-tactical-card border border-zinc-800 p-5 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <h3 className="font-bold text-zinc-100 font-tactical flex items-center space-x-2 text-sm uppercase">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <span>Gráfico de Vendas do Mês ({monthNames[currentMonth]} {currentYear})</span>
            </h3>
            <p className="text-[11px] text-zinc-400">Acompanhamento diário das baixas e faturamento do arsenal</p>
          </div>

          <div className="flex items-center space-x-1.5 bg-zinc-950/80 p-1 rounded-xl border border-zinc-800 self-start sm:self-auto">
            <button
              onClick={() => setViewType('daily')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                viewType === 'daily'
                  ? 'bg-amber-500 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Dia a Dia
            </button>
            <button
              onClick={() => setViewType('monthly')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                viewType === 'monthly'
                  ? 'bg-emerald-500 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Meses do Ano
            </button>
          </div>
        </div>

        {/* Monthly Summary Badges */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="bg-zinc-950/80 border border-zinc-800 p-2.5 rounded-xl space-y-0.5">
            <span className="text-[10px] text-zinc-400 uppercase font-semibold flex items-center space-x-1">
              <DollarSign className="w-3 h-3 text-amber-400" />
              <span>Total Mês</span>
            </span>
            <p className="text-sm font-bold font-mono text-emerald-400">{formatBRL(monthTotal)}</p>
          </div>
          <div className="bg-zinc-950/80 border border-zinc-800 p-2.5 rounded-xl space-y-0.5">
            <span className="text-[10px] text-zinc-400 uppercase font-semibold flex items-center space-x-1">
              <ShoppingBag className="w-3 h-3 text-amber-400" />
              <span>Pedidos</span>
            </span>
            <p className="text-sm font-bold font-mono text-amber-400">{monthOrdersCount}</p>
          </div>
          <div className="bg-zinc-950/80 border border-zinc-800 p-2.5 rounded-xl space-y-0.5">
            <span className="text-[10px] text-zinc-400 uppercase font-semibold flex items-center space-x-1">
              <BarChart3 className="w-3 h-3 text-amber-400" />
              <span>Ticket Médio</span>
            </span>
            <p className="text-sm font-bold font-mono text-zinc-200">{formatBRL(averageTicket)}</p>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="h-64 relative pt-2">
          <Bar
            data={viewType === 'daily' ? chartDataDaily : chartDataMonthly}
            options={chartOptions}
          />
        </div>
      </div>

      {/* Top Sellers Card */}
      <div className="lg:col-span-5 bg-tactical-card border border-zinc-800 p-5 rounded-2xl space-y-4">
        <div className="space-y-0.5">
          <h3 className="font-bold text-zinc-100 font-tactical flex items-center space-x-2 text-sm uppercase">
            <Award className="w-5 h-5 text-emerald-400" />
            <span>Top Equipamentos Mais Vendidos</span>
          </h3>
          <p className="text-[11px] text-zinc-400">Ranking dos itens com maior volume de saídas</p>
        </div>

        <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
          {topList.length === 0 ? (
            <p className="text-xs text-zinc-500 text-center py-12 font-mono">
              Nenhum dado de vendas registrado até o momento.
            </p>
          ) : (
            topList.map(([name, qty], idx) => (
              <div key={name} className="flex items-center justify-between p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 flex items-center justify-center bg-amber-500/20 text-amber-400 rounded-full font-bold text-xs font-mono border border-amber-500/30 shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-zinc-200 line-clamp-1">{name}</span>
                </div>
                <span className="text-xs font-bold font-mono bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-500/20 shrink-0 ml-2">
                  {qty} un
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

