import React, { useState, useEffect } from 'react';
import { ShieldAlert, Zap, Clock, Palette, LogOut } from 'lucide-react';
import { TabType, UserPermission } from '../types';

interface HeaderProps {
  currentTab: TabType;
  onOpenQuickSell: () => void;
  onOpenNewOrder?: () => void;
  users?: UserPermission[];
  activeUser?: UserPermission;
  onSelectUser?: (user: UserPermission) => void;
  onLogout?: () => void;
  currentTheme?: string;
  onSelectTheme?: (theme: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenQuickSell,
  users = [],
  activeUser,
  onSelectUser,
  onLogout,
  currentTheme = 'tactical-dark',
  onSelectTheme,
}) => {
  const [timeStr, setTimeStr] = useState<string>('--:--:--');
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('pt-BR'));
      setDateStr(now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const tabTitles: Record<TabType, string> = {
    dashboard: 'Painel Tático Geral',
    products: 'Arsenal & Estoque',
    movements: 'Movimentações de Estoque',
    pos: 'Pedido Militar (POS)',
    'service-orders': 'Ordens de Serviço',
    sales: 'Histórico de Pedidos & Cautelas',
    settings: 'Configurações do Sistema',
  };

  const title = tabTitles[currentTab] || 'Painel Tático';

  const themes = [
    { id: 'tactical-dark', label: '🌙 Tático Escuro' },
    { id: 'stealth-black', label: '🖤 Stealth Black' },
    { id: 'olive-militaria', label: '🪖 Verde Oliva' },
    { id: 'tactical-blue', label: '🔵 Azul Tático' },
    { id: 'tactical-light', label: '☀️ Tema Claro' },
  ];

  return (
    <header className="bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-10 gap-2">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 hidden sm:block">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider font-tactical">{title}</h2>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Quick Theme Switcher */}
        {onSelectTheme && (
          <div className="flex items-center space-x-1.5 bg-zinc-950 border border-zinc-800 px-2.5 py-1.5 rounded-xl">
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={currentTheme}
              onChange={(e) => onSelectTheme(e.target.value)}
              className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer font-medium"
              title="Alternar Tema Visual"
            >
              {themes.map((t) => (
                <option key={t.id} value={t.id} className="bg-zinc-900 text-zinc-100">
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={onOpenQuickSell}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-lg flex items-center space-x-1.5 transition shadow-md shadow-emerald-600/20 border border-emerald-400/30 cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Baixa Rápida</span>
        </button>

        <div className="hidden sm:flex items-center space-x-3 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-amber-500/40 px-4 py-2 rounded-xl shadow-lg shadow-amber-500/10 group hover:border-amber-500/80 transition">
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </div>
          <Clock className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
          <div className="flex flex-col text-right leading-none">
            <span className="text-base sm:text-lg font-mono font-bold text-amber-400 tracking-wider drop-shadow-[0_0_10px_rgba(245,158,11,0.4)]">
              {timeStr}
            </span>
            <span className="text-[10px] font-mono text-zinc-400 tracking-tight mt-0.5">
              {dateStr} • HORA BSB
            </span>
          </div>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            title="Bloquear Terminal / Sair"
            className="bg-zinc-950 hover:bg-rose-950/80 hover:text-rose-400 text-zinc-400 border border-zinc-800 hover:border-rose-500/40 px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden xl:inline">Sair</span>
          </button>
        )}
      </div>
    </header>
  );
};

