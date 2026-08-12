import React from 'react';
import { Shield, Box, Crosshair, FileText, UserCheck, BarChart2, PlusCircle, Download, Wrench, Settings } from 'lucide-react';
import { TabType, UserPermission } from '../types';
import bizuLogo from '../assets/images/bizu_tactical_shield_1786484872892.jpg';

interface SidebarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  lowStockCount: number;
  activeOsCount?: number;
  activeUser?: UserPermission;
  onOpenProductModal: () => void;
  onExportCSV: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  lowStockCount,
  activeOsCount = 0,
  activeUser,
  onOpenProductModal,
  onExportCSV,
}) => {
  const allNavItems: { id: TabType; label: string; icon: React.ReactNode; badge?: React.ReactNode; show?: boolean }[] = [
    {
      id: 'dashboard',
      label: 'Painel Tático',
      icon: <Shield className="w-4 h-4 text-amber-500" />,
      show: true,
    },
    {
      id: 'products',
      label: 'Arsenal & Estoque',
      icon: <Box className="w-4 h-4" />,
      show: true,
      badge: lowStockCount > 0 ? (
        <span className="ml-auto bg-amber-500/20 text-amber-400 text-[10px] px-2 py-0.5 rounded-full font-bold border border-amber-500/40">
          {lowStockCount}
        </span>
      ) : null,
    },
    {
      id: 'service-orders',
      label: 'Pedidos',
      icon: <Crosshair className="w-4 h-4 text-amber-400" />,
      show: true,
      badge: activeOsCount > 0 ? (
        <span className="ml-auto bg-amber-500 text-black text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">
          {activeOsCount}
        </span>
      ) : null,
    },
    {
      id: 'sales',
      label: 'Histórico de Pedidos',
      icon: <FileText className="w-4 h-4" />,
      show: true,
    },
    {
      id: 'reports',
      label: 'Relatórios & Estatísticas',
      icon: <BarChart2 className="w-4 h-4" />,
      show: activeUser ? activeUser.canViewReports : true,
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: <Settings className="w-4 h-4 text-amber-500" />,
      show: true,
    },
  ];

  const navItems = allNavItems.filter((item) => item.show !== false);

  return (
    <aside className="w-full md:w-72 bg-zinc-950 border-r border-zinc-800/80 flex flex-col justify-between shrink-0 z-20 shadow-2xl">
      <div>
        {/* Bizú Shield Brand Logo - Exact Unaltered Logo Display */}
        <div className="p-4 border-b border-zinc-800 flex items-center space-x-3.5 bg-zinc-900/60">
          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center rounded-xl overflow-hidden border border-amber-500/40 bg-zinc-950 shadow-[0_0_15px_rgba(234,179,8,0.25)] p-0.5">
            <img
              src={bizuLogo}
              alt="Logo BIZÚ Artigos Militares e Táticos"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="font-bold text-2xl text-white tracking-wider leading-none font-tactical flex items-center gap-1">
              BIZÚ
            </h1>
            <p className="text-[10px] text-amber-500 font-semibold tracking-widest uppercase mt-0.5">
              Artigos Militares & Táticos
            </p>
            <span className="inline-block text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700 font-mono mt-1">
              SISTEMA OPERACIONAL v2.5
            </span>
          </div>
        </div>


        {/* Main Navigation Links */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${
                  isActive
                    ? 'bg-amber-500 text-black border-amber-400 font-bold shadow-lg shadow-amber-500/10'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border-transparent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer & Quick Actions */}
      <div className="p-3 border-t border-zinc-800 bg-zinc-950/80 space-y-2">
        {activeUser?.role !== 'OPERADOR' && (
          <button
            onClick={onOpenProductModal}
            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/10 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Cadastrar Equipamento</span>
          </button>
        )}

        <div className="flex items-center justify-between text-[11px] text-zinc-500 px-2 pt-2">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>SISTEMA ATIVO</span>
          </span>
          <button
            onClick={onExportCSV}
            title="Exportar CSV"
            className="hover:text-amber-400 transition flex items-center space-x-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
