export interface Product {
  id: string;
  sku: string;
  code?: string;
  name: string;
  category: string;
  size?: string;
  description?: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  minStock: number;
  supplier?: string;
  location?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MilitaryProfile {
  id: string;
  name?: string;
  force: string;
  rank: string;
  warName: string;
  re: string;
  phone?: string;
  battalion?: string;
  sector?: string;
  notes?: string;
  status?: 'ATIVO' | 'INATIVO';
  createdAt?: string;
}

export interface UserCustomPermissions {
  // ESTOQUE
  canViewStock: boolean;
  canCreateStock: boolean;
  canEditStock: boolean;
  canDeleteStock: boolean;
  canStockEntry: boolean;
  canStockWriteoff: boolean;
  // PEDIDOS / OS
  canViewOs: boolean;
  canCreateOs: boolean;
  canEditOs: boolean;
  canCancelOs: boolean;
  canConcludeOs: boolean;
  // PERFIS
  canViewProfiles: boolean;
  canCreateProfiles: boolean;
  canEditProfiles: boolean;
  canInactivateProfiles: boolean;
  // RELATÓRIOS
  canViewReports: boolean;
  canExportReports: boolean;
  // USUÁRIOS
  canViewUsers: boolean;
  canCreateUsers: boolean;
  canEditUsers: boolean;
  canManageUsers: boolean;
  // CONFIGURAÇÕES
  canAccessSettings: boolean;
}

export interface UserPermission {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'ADMINISTRADOR' | 'OPERADOR' | 'CONSULTA';
  active: boolean;
  lastAccess?: string;
  canGiveDiscount?: boolean;
  canManageUsers?: boolean;
  canViewReports?: boolean;
  customPermissions?: UserCustomPermissions;
}

export interface Activity {
  id: string;
  date: string;
  type: 'SALE' | 'ADD' | 'OS_CONCLUDED' | 'ESTORNO' | 'BAIXA_RAPIDA' | 'ENTRADA';
  description: string;
  user?: string;
}

export interface OsItem {
  productId: string;
  sku: string;
  name: string;
  qty: number;
  unitPrice: number;
}

export type OsStatus = 'NOVO' | 'EM_SEPARACAO' | 'SEPARADO' | 'ENTREGUE' | 'CONCLUIDO' | 'CANCELADO';
export type OsPriority = 'NORMAL' | 'ALTA' | 'URGENTE';

export interface OsHistoryLog {
  id: string;
  date: string;
  user: string;
  action: string;
  statusFrom?: OsStatus;
  statusTo?: OsStatus;
}

export interface ServiceOrder {
  id: string; // e.g. OS-000001
  number?: string;
  profileId?: string;
  date: string;
  deliveryDate?: string;
  soldado: string;
  re: string;
  cpf: string;
  bloodType: string;
  force: string;
  rank?: string;
  warName?: string;
  militaryId?: string;
  phone?: string;
  battalion?: string;
  serviceType: string;
  itemDescription?: string;
  specifications?: string;
  items?: OsItem[];
  value: number;
  deposit: number;
  paymentMethod?: string;
  priority: OsPriority;
  status: OsStatus;
  notes?: string;
  stockDeducted?: boolean;
  createdBy?: string;
  updatedAt?: string;
  historyLogs?: OsHistoryLog[];
}

export type MovementType =
  | 'ENTRADA'
  | 'BAIXA'
  | 'VENDA'
  | 'AJUSTE'
  | 'ESTORNO'
  | 'PERDA'
  | 'AVARIA'
  | 'BAIXA_OS';

export interface StockMovement {
  id: string;
  date: string;
  productId: string;
  productName: string;
  sku: string;
  type: MovementType;
  qty: number;
  osId?: string;
  user: string;
  reason: string;
  supplier?: string;
  invoice?: string;
}

export interface SystemNotification {
  id: string;
  type: 'CRITICAL_STOCK' | 'URGENT_OS' | 'PENDING_OS' | 'ZERO_STOCK';
  title: string;
  message: string;
  date: string;
  read: boolean;
  targetTab?: TabType;
  targetId?: string;
}

export type TabType =
  | 'dashboard'
  | 'products'
  | 'pos'
  | 'sales'
  | 'service-orders'
  | 'reports'
  | 'movements'
  | 'settings';

export interface OrderItem {
  productId: string;
  name: string;
  qty: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  date: string;
  soldado: string;
  re: string;
  cpf: string;
  bloodType: string;
  militaryId?: string;
  force: string;
  rank?: string;
  warName?: string;
  phone?: string;
  battalion?: string;
  paymentMethod: string;
  orderType?: string;
  createdBy?: string;
  items: OrderItem[];
  subtotal?: number;
  discount?: number;
  total: number;
}

export interface CartItem {
  productId: string;
  name: string;
  salePrice: number;
  maxStock: number;
  qty: number;
}

export interface StoreConfig {
  name?: string;
  storeName?: string;
  slogan?: string;
  cnpj?: string;
  phone?: string;
  address?: string;
  cityState?: string;
  pixKey?: string;
  receiptNote?: string;
  orderPrefix?: string;
  maxDiscountPercent?: number;
  autoPrintReceipt?: boolean;
  theme?: string;
  receiptFooterText?: string;
  logoUrl?: string;
}

