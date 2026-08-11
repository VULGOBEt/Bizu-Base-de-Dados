import React, { useState } from 'react';
import { Users, UserPlus, Shield, Edit2, ShieldCheck, UserCheck, Search, Eye, Power, CheckCircle2, XCircle } from 'lucide-react';
import { MilitaryProfile, UserPermission, ServiceOrder, Order } from '../types';
import { formatDate } from '../utils/formatters';

interface MilitaryProfilesTabProps {
  profiles: MilitaryProfile[];
  users?: UserPermission[];
  serviceOrders?: ServiceOrder[];
  sales?: Order[];
  activeUser?: UserPermission;
  onOpenMilitaryModal: (id?: string) => void;
  onViewProfileDetail: (profile: MilitaryProfile) => void;
  onToggleProfileStatus: (id: string) => void;
  onOpenUserModal: (user?: UserPermission) => void;
  onToggleUserStatus: (id: string) => void;
  onShowToast?: (msg: string) => void;
}

export const MilitaryProfilesTab: React.FC<MilitaryProfilesTabProps> = ({
  profiles = [],
  users = [],
  serviceOrders = [],
  sales = [],
  activeUser,
  onOpenMilitaryModal,
  onViewProfileDetail,
  onToggleProfileStatus,
  onOpenUserModal,
  onToggleUserStatus,
  onShowToast,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'perfis' | 'usuarios'>('perfis');

  // Check if current user is Admin
  const isAdmin = activeUser?.role === 'ADMINISTRADOR';

  // Search and status filter state for Profiles
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'TODOS' | 'ATIVOS' | 'INATIVOS'>('ATIVOS');

  // Compute total order count per profile ID/re
  const getProfileOrderCount = (p: MilitaryProfile): number => {
    const osCount = serviceOrders.filter((os) => {
      if (os.profileId && os.profileId === p.id) return true;
      if (p.re && os.militaryId && os.militaryId.toLowerCase() === p.re.toLowerCase()) return true;
      if (p.warName && os.warName && os.warName.toLowerCase() === p.warName.toLowerCase()) return true;
      return false;
    }).length;

    const salesCount = sales.filter((s) => {
      if (p.re && s.militaryId && s.militaryId.toLowerCase() === p.re.toLowerCase()) return true;
      if (p.warName && s.warName && s.warName.toLowerCase() === p.warName.toLowerCase()) return true;
      return false;
    }).length;

    return osCount + salesCount;
  };

  // Admin sees all profiles; Non-admin only sees their own matching profile
  const baseProfiles = profiles.filter((p) => {
    if (isAdmin) return true;
    if (!activeUser) return false;
    const userName = (activeUser.name || '').toLowerCase();
    const userEmail = (activeUser.email || '').toLowerCase();
    const pName = (p.name || '').toLowerCase();
    const pWarName = (p.warName || '').toLowerCase();
    const pRe = (p.re || '').toLowerCase();

    return (
      (pName && userName.includes(pName)) ||
      (pWarName && userName.includes(pWarName)) ||
      (pRe && userEmail.includes(pRe))
    );
  });

  // Filter profiles based on search and status
  const filteredProfiles = baseProfiles.filter((p) => {
    // Status filter
    const status = p.status || 'ATIVO';
    if (statusFilter === 'ATIVOS' && status !== 'ATIVO') return false;
    if (statusFilter === 'INATIVOS' && status !== 'INATIVO') return false;

    // Search filter: Nome, Identificação, Setor
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();

    const nameMatch = (p.name || '').toLowerCase().includes(term) || (p.warName || '').toLowerCase().includes(term);
    const reMatch = (p.re || '').toLowerCase().includes(term);
    const sectorMatch = (p.sector || p.battalion || '').toLowerCase().includes(term) || (p.force || '').toLowerCase().includes(term);

    return nameMatch || reMatch || sectorMatch;
  });

  // Admin sees all system users; Non-admin only sees their own user card
  const visibleUsers = users.filter((u) => {
    if (isAdmin) return true;
    return u.id === activeUser?.id;
  });

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'ADMINISTRADOR':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'OPERADOR':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'CONSULTA':
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="space-y-5">
      {/* Sub-navigation Tabs (PERFIS vs USUÁRIOS E PERMISSÕES) */}
      <div className="bg-tactical-card border border-zinc-800 p-2 rounded-2xl flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveSubTab('perfis')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center space-x-2 cursor-pointer ${
              activeSubTab === 'perfis'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/10'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>PERFIS</span>
            <span className="bg-black/20 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
              {profiles.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('usuarios')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center space-x-2 cursor-pointer ${
              activeSubTab === 'usuarios'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/10'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>USUÁRIOS E PERMISSÕES</span>
            <span className="bg-black/20 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
              {users.length}
            </span>
          </button>
        </div>

        {activeSubTab === 'perfis' ? (
          <button
            onClick={() => onOpenMilitaryModal()}
            className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center space-x-2 shrink-0 cursor-pointer shadow-md shadow-amber-500/10"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ NOVO PERFIL</span>
          </button>
        ) : (
          <button
            onClick={() => onOpenUserModal()}
            className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center space-x-2 shrink-0 cursor-pointer shadow-md shadow-amber-500/10"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ NOVO USUÁRIO</span>
          </button>
        )}
      </div>

      {/* -------------------------------------------------- */}
      {/* AREA 1: PERFIS (SOLICITANTES / CLIENTES) */}
      {/* -------------------------------------------------- */}
      {activeSubTab === 'perfis' && (
        <div className="space-y-4">
          {!isAdmin && (
            <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-2xl flex items-center space-x-3 text-xs text-amber-300 font-mono">
              <Shield className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Aviso: Apenas o Administrador pode visualizar e gerenciar o perfil dos outros integrantes.</span>
            </div>
          )}

          {/* Top Search & Filter Bar */}
          <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="🔎 Pesquisar perfil (Nome, Identificação, Setor)..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Status Filter buttons */}
            <div className="flex items-center space-x-1.5 self-start md:self-auto">
              <span className="text-[11px] text-zinc-400 font-mono uppercase mr-1">Filtros:</span>
              <button
                onClick={() => setStatusFilter('TODOS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                  statusFilter === 'TODOS'
                    ? 'bg-amber-500 text-black'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setStatusFilter('ATIVOS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                  statusFilter === 'ATIVOS'
                    ? 'bg-amber-500 text-black'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                Ativos
              </button>
              <button
                onClick={() => setStatusFilter('INATIVOS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                  statusFilter === 'INATIVOS'
                    ? 'bg-amber-500 text-black'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                Inativos
              </button>
            </div>
          </div>

          {/* Profiles Grid / Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProfiles.length === 0 ? (
              <div className="col-span-full py-12 text-center text-zinc-500 font-mono bg-tactical-card border border-zinc-800 rounded-2xl space-y-2">
                <Users className="w-8 h-8 text-zinc-600 mx-auto" />
                <p>Nenhum perfil encontrado para os filtros selecionados.</p>
              </div>
            ) : (
              filteredProfiles.map((p) => {
                const orderCount = getProfileOrderCount(p);
                const isInactive = p.status === 'INATIVO';

                return (
                  <div
                    key={p.id}
                    className={`bg-tactical-card border p-4 rounded-2xl space-y-3 relative group transition ${
                      isInactive
                        ? 'border-zinc-850 opacity-75 hover:opacity-100'
                        : 'border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-start justify-between border-b border-zinc-800/80 pb-2.5">
                      <div className="flex items-center space-x-2.5">
                        <div
                          className={`p-2.5 rounded-xl border ${
                            isInactive
                              ? 'bg-zinc-800 border-zinc-700 text-zinc-500'
                              : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          }`}
                        >
                          <Shield className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-zinc-100 text-sm font-tactical">
                            {p.name || `${p.rank} ${p.warName}`}
                          </h4>
                          <p className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">
                            {p.force || 'Militar / Tático'}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                          isInactive
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {p.status || 'ATIVO'}
                      </span>
                    </div>

                    <div className="text-xs space-y-1.5 text-zinc-400 font-mono bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Identificação:</span>
                        <span className="text-amber-400 font-bold">{p.re}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Setor:</span>
                        <span className="text-zinc-200 font-medium">{p.sector || p.battalion || 'Operacional'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Pedidos:</span>
                        <span className="text-zinc-100 font-bold font-tactical">{orderCount}</span>
                      </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex items-center justify-between pt-1 gap-2">
                      <div className="flex items-center space-x-1.5 w-full">
                        <button
                          onClick={() => onViewProfileDetail(p)}
                          className="flex-1 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black border border-amber-500/30 px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition flex items-center justify-center space-x-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>VER PERFIL</span>
                        </button>

                        <button
                          onClick={() => onOpenMilitaryModal(p.id)}
                          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 p-1.5 rounded-xl text-xs font-bold uppercase transition cursor-pointer border border-zinc-700"
                          title="EDITAR PERFIL"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onToggleProfileStatus(p.id)}
                          className={`p-1.5 rounded-xl text-xs font-bold uppercase transition cursor-pointer border ${
                            isInactive
                              ? 'bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black border-emerald-500/30'
                              : 'bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-black border-rose-500/30'
                          }`}
                          title={isInactive ? 'Ativar Perfil' : 'Inativar Perfil'}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* AREA 2: USUÁRIOS E PERMISSÕES (ACESSOS DO SISTEMA) */}
      {/* -------------------------------------------------- */}
      {activeSubTab === 'usuarios' && (
        <div className="space-y-4">
          {!isAdmin && (
            <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-2xl flex items-center space-x-3 text-xs text-amber-300 font-mono">
              <Shield className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Aviso: Apenas o Administrador possui acesso para visualizar e gerenciar as permissões dos outros usuários.</span>
            </div>
          )}

          <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl space-y-1">
            <h4 className="font-bold text-amber-400 text-xs font-tactical uppercase tracking-wider flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>Controle de Operadores e Níveis de Acesso</span>
            </h4>
            <p className="text-xs text-zinc-400">
              Gerencie quem pode acessar o sistema BIZÚ, atribuindo os níveis Administrador, Operador ou Consulta com permissões customizáveis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleUsers.map((u) => {
              const isCurrentSessionUser = activeUser?.id === u.id;
              const isInactive = !u.active;

              return (
                <div
                  key={u.id}
                  className={`bg-tactical-card border p-4 rounded-2xl space-y-3 relative transition ${
                    isCurrentSessionUser
                      ? 'border-amber-500/60 shadow-lg shadow-amber-500/10'
                      : isInactive
                      ? 'border-zinc-850 opacity-70'
                      : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-amber-400 font-tactical">
                        {u.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-100 text-sm flex items-center space-x-1.5">
                          <span>{u.name}</span>
                          {isCurrentSessionUser && (
                            <span className="bg-amber-500/20 text-amber-400 text-[9px] px-1.5 py-0.2 rounded font-mono font-bold">
                              VOCÊ
                            </span>
                          )}
                        </h4>
                        <p className="text-[10px] text-zinc-400 font-mono">{u.email}</p>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                        isInactive
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {u.active ? 'ATIVO' : 'INATIVO'}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400 font-mono text-[11px]">Função:</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-tactical border ${getRoleBadgeStyle(
                          u.role
                        )}`}
                      >
                        {u.role}
                      </span>
                    </div>

                    <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 space-y-1 font-mono text-[11px]">
                      <div className="flex justify-between text-zinc-400">
                        <span>Último Acesso:</span>
                        <span className="text-zinc-200">
                          {u.lastAccess ? formatDate(u.lastAccess) : 'Hoje'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between gap-2 border-t border-zinc-800/80">
                    <button
                      onClick={() => onOpenUserModal(u)}
                      className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 py-1.5 rounded-xl text-xs font-bold uppercase transition flex items-center justify-center space-x-1 cursor-pointer border border-zinc-700"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>EDITAR USUÁRIO</span>
                    </button>

                    <button
                      onClick={() => onToggleUserStatus(u.id)}
                      className={`p-1.5 rounded-xl text-xs font-bold uppercase transition cursor-pointer border ${
                        isInactive
                          ? 'bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black border-emerald-500/30'
                          : 'bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-black border-rose-500/30'
                      }`}
                      title={isInactive ? 'Ativar Usuário' : 'Inativar Usuário'}
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
