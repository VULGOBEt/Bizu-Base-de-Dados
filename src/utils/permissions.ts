import { UserPermission, UserCustomPermissions } from '../types';

export function getDefaultPermissionsByRole(
  role: 'ADMINISTRADOR' | 'OPERADOR' | 'CONSULTA'
): UserCustomPermissions {
  if (role === 'ADMINISTRADOR') {
    return {
      canViewStock: true,
      canCreateStock: true,
      canEditStock: true,
      canDeleteStock: true,
      canStockEntry: true,
      canStockWriteoff: true,

      canViewOs: true,
      canCreateOs: true,
      canEditOs: true,
      canCancelOs: true,
      canConcludeOs: true,

      canViewProfiles: true,
      canCreateProfiles: true,
      canEditProfiles: true,
      canInactivateProfiles: true,

      canViewReports: true,
      canExportReports: true,

      canViewUsers: true,
      canCreateUsers: true,
      canEditUsers: true,
      canManageUsers: true,

      canAccessSettings: true,
    };
  }

  if (role === 'OPERADOR') {
    return {
      canViewStock: true,
      canCreateStock: true,
      canEditStock: true,
      canDeleteStock: false,
      canStockEntry: true,
      canStockWriteoff: true,

      canViewOs: true,
      canCreateOs: true,
      canEditOs: true,
      canCancelOs: false,
      canConcludeOs: true,

      canViewProfiles: true,
      canCreateProfiles: true,
      canEditProfiles: true,
      canInactivateProfiles: false,

      canViewReports: true,
      canExportReports: false,

      canViewUsers: true,
      canCreateUsers: false,
      canEditUsers: false,
      canManageUsers: false,

      canAccessSettings: false,
    };
  }

  // CONSULTA (Read-only)
  return {
    canViewStock: true,
    canCreateStock: false,
    canEditStock: false,
    canDeleteStock: false,
    canStockEntry: false,
    canStockWriteoff: false,

    canViewOs: true,
    canCreateOs: false,
    canEditOs: false,
    canCancelOs: false,
    canConcludeOs: false,

    canViewProfiles: true,
    canCreateProfiles: false,
    canEditProfiles: false,
    canInactivateProfiles: false,

    canViewReports: true,
    canExportReports: false,

    canViewUsers: true,
    canCreateUsers: false,
    canEditUsers: false,
    canManageUsers: false,

    canAccessSettings: false,
  };
}

export function checkUserPermission(
  user: UserPermission | undefined,
  permission: keyof UserCustomPermissions
): { allowed: boolean; message?: string } {
  if (!user) {
    return { allowed: false, message: 'Usuário não autenticado.' };
  }

  if (!user.active) {
    return { allowed: false, message: 'Usuário inativo no sistema. Acesso bloqueado.' };
  }

  if (user.role === 'ADMINISTRADOR') {
    return { allowed: true };
  }

  const effectivePermissions = user.customPermissions || getDefaultPermissionsByRole(user.role);

  if (effectivePermissions[permission]) {
    return { allowed: true };
  }

  return {
    allowed: false,
    message: 'Você não possui permissão para realizar esta ação.',
  };
}
