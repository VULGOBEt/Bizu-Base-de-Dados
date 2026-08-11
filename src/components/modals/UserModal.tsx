import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, UserCheck, Lock, Check, Key } from 'lucide-react';
import { UserPermission, UserCustomPermissions } from '../../types';
import { getDefaultPermissionsByRole } from '../../utils/permissions';

interface UserModalProps {
  isOpen: boolean;
  editingUser?: UserPermission | null;
  onClose: () => void;
  onSave: (userData: Omit<UserPermission, 'id'> & { id?: string }) => void;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  editingUser,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'ADMINISTRADOR' | 'OPERADOR' | 'CONSULTA'>('OPERADOR');
  const [active, setActive] = useState(true);
  const [customPerms, setCustomPerms] = useState<UserCustomPermissions>(
    getDefaultPermissionsByRole('OPERADOR')
  );

  useEffect(() => {
    if (editingUser) {
      setName(editingUser.name || '');
      setEmail(editingUser.email || '');
      setPassword(editingUser.password || '');
      setRole(editingUser.role || 'OPERADOR');
      setActive(editingUser.active ?? true);
      setCustomPerms(
        editingUser.customPermissions || getDefaultPermissionsByRole(editingUser.role || 'OPERADOR')
      );
    } else {
      setName('');
      setEmail('');
      setPassword('');
      setRole('OPERADOR');
      setActive(true);
      setCustomPerms(getDefaultPermissionsByRole('OPERADOR'));
    }
  }, [editingUser, isOpen]);

  if (!isOpen) return null;

  const handleRoleChange = (newRole: 'ADMINISTRADOR' | 'OPERADOR' | 'CONSULTA') => {
    setRole(newRole);
    setCustomPerms(getDefaultPermissionsByRole(newRole));
  };

  const handleTogglePerm = (key: keyof UserCustomPermissions) => {
    setCustomPerms((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onSave({
      id: editingUser ? editingUser.id : undefined,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim() || 'bizu123',
      role,
      active,
      canGiveDiscount: role === 'ADMINISTRADOR',
      canManageUsers: customPerms.canManageUsers,
      canViewReports: customPerms.canViewReports,
      customPermissions: customPerms,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-2xl shadow-2xl p-5 space-y-4 text-zinc-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-100 font-tactical uppercase text-sm">
                {editingUser ? 'Editar Usuário e Permissões' : 'Novo Usuário do Sistema'}
              </h3>
              <p className="text-[10px] text-zinc-400 font-mono">
                Configure o controle de acesso e perfil operacional
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-zinc-300 uppercase mb-1">
                Nome do Usuário *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Cabo Lima"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-300 uppercase mb-1">
                E-mail / Usuário de Acesso *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="lima@bizutatico.com.br"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-zinc-300 uppercase mb-1">
                Função / Cargo Preset *
              </label>
              <select
                value={role}
                onChange={(e) => handleRoleChange(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-bold cursor-pointer"
              >
                <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                <option value="OPERADOR">OPERADOR</option>
                <option value="CONSULTA">CONSULTA</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-300 uppercase mb-1">
                Senha de Acesso
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-300 uppercase mb-1">
                Status
              </label>
              <select
                value={active ? 'ATIVO' : 'INATIVO'}
                onChange={(e) => setActive(e.target.value === 'ATIVO')}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-bold cursor-pointer"
              >
                <option value="ATIVO" className="bg-zinc-900 text-emerald-400">
                  ATIVO
                </option>
                <option value="INATIVO" className="bg-zinc-900 text-rose-400">
                  INATIVO
                </option>
              </select>
            </div>
          </div>

          {/* Granular Permissions Section */}
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h4 className="font-bold text-amber-400 text-xs font-tactical uppercase tracking-wider flex items-center space-x-1.5">
                <Key className="w-4 h-4 text-amber-500" />
                <span>PERMISSÕES DO USUÁRIO</span>
              </h4>
              <span className="text-[10px] text-zinc-500 font-mono">
                Ajuste os privilégios individualmente
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              {/* ESTOQUE */}
              <div className="bg-zinc-900/80 p-3 rounded-lg border border-zinc-800/80 space-y-1.5">
                <p className="font-bold text-zinc-200 text-[11px] uppercase tracking-wider text-amber-400/90 border-b border-zinc-800 pb-1">
                  ESTOQUE
                </p>
                <div className="space-y-1 pt-1">
                  {[
                    { label: 'Visualizar', key: 'canViewStock' },
                    { label: 'Criar Produtos', key: 'canCreateStock' },
                    { label: 'Editar Produtos', key: 'canEditStock' },
                    { label: 'Excluir Produtos', key: 'canDeleteStock' },
                    { label: 'Entrada de Estoque', key: 'canStockEntry' },
                    { label: 'Baixa de Estoque', key: 'canStockWriteoff' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center space-x-2 cursor-pointer text-zinc-300 hover:text-white">
                      <input
                        type="checkbox"
                        checked={!!customPerms[item.key as keyof UserCustomPermissions]}
                        onChange={() => handleTogglePerm(item.key as keyof UserCustomPermissions)}
                        className="rounded border-zinc-700 bg-zinc-950 text-amber-500 focus:ring-0 cursor-pointer"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* PEDIDOS / OS */}
              <div className="bg-zinc-900/80 p-3 rounded-lg border border-zinc-800/80 space-y-1.5">
                <p className="font-bold text-zinc-200 text-[11px] uppercase tracking-wider text-amber-400/90 border-b border-zinc-800 pb-1">
                  PEDIDOS / OS
                </p>
                <div className="space-y-1 pt-1">
                  {[
                    { label: 'Visualizar', key: 'canViewOs' },
                    { label: 'Criar OS / Venda', key: 'canCreateOs' },
                    { label: 'Editar OS', key: 'canEditOs' },
                    { label: 'Cancelar OS', key: 'canCancelOs' },
                    { label: 'Concluir OS', key: 'canConcludeOs' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center space-x-2 cursor-pointer text-zinc-300 hover:text-white">
                      <input
                        type="checkbox"
                        checked={!!customPerms[item.key as keyof UserCustomPermissions]}
                        onChange={() => handleTogglePerm(item.key as keyof UserCustomPermissions)}
                        className="rounded border-zinc-700 bg-zinc-950 text-amber-500 focus:ring-0 cursor-pointer"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* PERFIS */}
              <div className="bg-zinc-900/80 p-3 rounded-lg border border-zinc-800/80 space-y-1.5">
                <p className="font-bold text-zinc-200 text-[11px] uppercase tracking-wider text-amber-400/90 border-b border-zinc-800 pb-1">
                  PERFIS DE SOLICITANTES
                </p>
                <div className="space-y-1 pt-1">
                  {[
                    { label: 'Visualizar', key: 'canViewProfiles' },
                    { label: 'Criar Perfis', key: 'canCreateProfiles' },
                    { label: 'Editar Perfis', key: 'canEditProfiles' },
                    { label: 'Inativar Perfis', key: 'canInactivateProfiles' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center space-x-2 cursor-pointer text-zinc-300 hover:text-white">
                      <input
                        type="checkbox"
                        checked={!!customPerms[item.key as keyof UserCustomPermissions]}
                        onChange={() => handleTogglePerm(item.key as keyof UserCustomPermissions)}
                        className="rounded border-zinc-700 bg-zinc-950 text-amber-500 focus:ring-0 cursor-pointer"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* RELATÓRIOS, USUÁRIOS E CONFIGURAÇÕES */}
              <div className="bg-zinc-900/80 p-3 rounded-lg border border-zinc-800/80 space-y-1.5">
                <p className="font-bold text-zinc-200 text-[11px] uppercase tracking-wider text-amber-400/90 border-b border-zinc-800 pb-1">
                  GESTÃO & CONFIGURAÇÕES
                </p>
                <div className="space-y-1 pt-1">
                  {[
                    { label: 'Visualizar Relatórios', key: 'canViewReports' },
                    { label: 'Exportar Relatórios', key: 'canExportReports' },
                    { label: 'Visualizar Usuários', key: 'canViewUsers' },
                    { label: 'Criar / Editar Usuários', key: 'canCreateUsers' },
                    { label: 'Alterar Permissões', key: 'canManageUsers' },
                    { label: 'Acessar Configurações', key: 'canAccessSettings' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center space-x-2 cursor-pointer text-zinc-300 hover:text-white">
                      <input
                        type="checkbox"
                        checked={!!customPerms[item.key as keyof UserCustomPermissions]}
                        onChange={() => handleTogglePerm(item.key as keyof UserCustomPermissions)}
                        className="rounded border-zinc-700 bg-zinc-950 text-amber-500 focus:ring-0 cursor-pointer"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end space-x-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white uppercase transition cursor-pointer"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-black px-5 py-2 rounded-xl text-xs font-bold uppercase transition cursor-pointer shadow-md shadow-amber-500/10"
            >
              SALVAR USUÁRIO
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
