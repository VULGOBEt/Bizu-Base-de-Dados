import React, { useState } from 'react';
import {
  Wrench,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Printer,
  Edit2,
  Trash2,
  MessageCircle,
  PackageCheck,
  Package,
  ChevronRight,
  Send,
  ArrowRight
} from 'lucide-react';
import { ServiceOrder, OsStatus, Product, CartItem, Order, UserPermission } from '../types';
import { formatBRL, formatDate } from '../utils/formatters';
import { buildOsWhatsAppUrl } from '../utils/whatsapp';

interface WorkOrdersTabProps {
  orders: ServiceOrder[];
  onOpenNewOsModal: () => void;
  onOpenEditOsModal: (os: ServiceOrder) => void;
  onOpenDetailModal?: (os: ServiceOrder) => void;
  onOpenReceiptModal: (os: ServiceOrder) => void;
  onUpdateOsStatus: (id: string, status: OsStatus) => void;
  onDeleteOs: (id: string) => void;

  // Optional unified props
  posProducts?: Product[];
  posCart?: CartItem[];
  activeUser?: UserPermission;
  onAddToCart?: (productId: string) => void;
  onUpdateCartQty?: (productId: string, delta: number) => void;
  onClearCart?: () => void;
  onConfirmOrder?: (orderData: Omit<Order, 'id' | 'date' | 'items' | 'total'> & { subtotal?: number; discount?: number; total: number }) => void;
  onShowToast?: (msg: string) => void;
}

export const WorkOrdersTab: React.FC<WorkOrdersTabProps> = ({
  orders = [],
  onOpenNewOsModal,
  onOpenEditOsModal,
  onOpenReceiptModal,
  onUpdateOsStatus,
  onDeleteOs,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  // 1. FILTRO DE STATUS RÁPIDO: Padrão exibe as OS "Em Separação"
  const [statusFilter, setStatusFilter] = useState<'SEPARACAO' | 'ENTREGUES' | 'CONCLUIDAS' | 'TODAS'>('SEPARACAO');

  // Contagens dos filtros rápidos
  const separacaoCount = orders.filter((o) => o.status === 'EM_SEPARACAO' || (o.status as string) === 'NOVO').length;
  const entreguesCount = orders.filter((o) => o.status === 'ENTREGUE' || (o.status as string) === 'SEPARADO').length;
  const concluidasCount = orders.filter((o) => o.status === 'CONCLUIDO' || o.status === 'CANCELADO').length;
  const todasCount = orders.length;

  const totalPendingBalance = orders
    .filter((o) => o.status !== 'CONCLUIDO' && o.status !== 'CANCELADO')
    .reduce((acc, curr) => acc + (curr.value - curr.deposit), 0);

  const handleOpenNewOs = () => {
    setStatusFilter('SEPARACAO');
    setSearchTerm('');
    onOpenNewOsModal();
  };

  // Filtragem
  const filteredOrders = orders.filter((os) => {
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      (os.id && os.id.toLowerCase().includes(query)) ||
      (os.number && os.number.toLowerCase().includes(query)) ||
      (os.soldado && os.soldado.toLowerCase().includes(query)) ||
      (os.warName && os.warName.toLowerCase().includes(query)) ||
      (os.phone && os.phone.replace(/\D/g, '').includes(query.replace(/\D/g, ''))) ||
      (os.force && os.force.toLowerCase().includes(query)) ||
      (os.serviceType && os.serviceType.toLowerCase().includes(query)) ||
      (os.itemDescription && os.itemDescription.toLowerCase().includes(query)) ||
      (os.items && os.items.some((it) => it.name.toLowerCase().includes(query) || (it.sku && it.sku.toLowerCase().includes(query))));

    let matchesStatus = true;
    if (statusFilter === 'SEPARACAO') {
      matchesStatus = os.status === 'EM_SEPARACAO' || (os.status as string) === 'NOVO';
    } else if (statusFilter === 'ENTREGUES') {
      matchesStatus = os.status === 'ENTREGUE' || (os.status as string) === 'SEPARADO';
    } else if (statusFilter === 'CONCLUIDAS') {
      matchesStatus = os.status === 'CONCLUIDO' || os.status === 'CANCELADO';
    } else if (statusFilter === 'TODAS') {
      matchesStatus = true;
    }

    return matchesSearch && matchesStatus;
  });

  // STATUS COM BADGES COLORIDOS:
  // * Em Separação (Azul)
  // * Entregue (Âmbar/Laranja)
  // * Concluído (Verde)
  // * Cancelado (Vermelho)
  const renderStatusBadge = (status: OsStatus) => {
    switch (status) {
      case 'EM_SEPARACAO':
        return (
          <span className="status-badge-producao inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider font-mono shadow-sm animate-pulse">
            <Wrench className="w-3 h-3 text-blue-400 shrink-0 animate-spin" />
            <span>Em Separação</span>
          </span>
        );
      case 'ENTREGUE':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider font-mono shadow-sm bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <PackageCheck className="w-3 h-3 text-amber-400 shrink-0" />
            <span>Entregue</span>
          </span>
        );
      case 'CONCLUIDO':
        return (
          <span className="status-badge-pronto inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider font-mono shadow-sm">
            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>Concluído</span>
          </span>
        );
      case 'CANCELADO':
        return (
          <span className="status-badge-cancelado inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider font-mono shadow-sm">
            <AlertCircle className="w-3 h-3 text-rose-400 shrink-0" />
            <span>Cancelado</span>
          </span>
        );
      default:
        return (
          <span className="status-badge-producao inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider font-mono shadow-sm">
            <Wrench className="w-3 h-3 text-blue-400 shrink-0" />
            <span>Em Separação</span>
          </span>
        );
    }
  };

  // Botão de Avanço Rápido de Status do Fluxo Tático
  const renderNextStatusAction = (os: ServiceOrder) => {
    switch (os.status) {
      case 'EM_SEPARACAO':
        return (
          <button
            onClick={() => onUpdateOsStatus(os.id, 'ENTREGUE')}
            title="Avançar status: Marcar como Entregue"
            className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/40 rounded-lg text-[10px] font-bold uppercase tracking-wider transition cursor-pointer flex items-center space-x-1"
          >
            <span>Entregar</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        );
      case 'ENTREGUE':
        return (
          <button
            onClick={() => onUpdateOsStatus(os.id, 'CONCLUIDO')}
            title="Avançar status: Concluir e Baixar Estoque"
            className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-black border border-emerald-500/40 rounded-lg text-[10px] font-bold uppercase tracking-wider transition cursor-pointer flex items-center space-x-1"
          >
            <span>Concluir</span>
            <CheckCircle2 className="w-3 h-3" />
          </button>
        );
      case 'CONCLUIDO':
      case 'CANCELADO':
        return null;
      default:
        return (
          <button
            onClick={() => onUpdateOsStatus(os.id, 'ENTREGUE')}
            title="Avançar status: Marcar como Entregue"
            className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/40 rounded-lg text-[10px] font-bold uppercase tracking-wider transition cursor-pointer flex items-center space-x-1"
          >
            <span>Entregar</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/80 p-5 rounded-2xl border border-zinc-800/80 shadow-lg">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold text-white font-tactical tracking-wider flex items-center gap-2">
              <Wrench className="w-6 h-6 text-amber-500" />
              <span>ORDENS DE SERVIÇO</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleOpenNewOs}
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/10 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Nova OS</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold uppercase">
            <span>OS Ativas em Aberto</span>
            <Wrench className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-blue-400 mt-2 font-tactical">{separacaoCount}</p>
          <p className="text-[10px] text-zinc-500 mt-1">Ordens ativas na oficina</p>
        </div>

        <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold uppercase">
            <span>OS Entregues</span>
            <PackageCheck className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2 font-tactical">{entreguesCount}</p>
          <p className="text-[10px] text-zinc-500 mt-1">Entregues ao militar</p>
        </div>

        <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold uppercase">
            <span>Saldo a Receber</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2 font-mono">{formatBRL(totalPendingBalance)}</p>
          <p className="text-[10px] text-zinc-500 mt-1">Pendente nas ordens ativas</p>
        </div>

        <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold uppercase">
            <span>Total de Ordens</span>
            <FileText className="w-4 h-4 text-zinc-400" />
          </div>
          <p className="text-2xl font-bold text-zinc-300 mt-2 font-tactical">{todasCount}</p>
          <p className="text-[10px] text-zinc-500 mt-1">{concluidasCount} concluídas / finalizadas</p>
        </div>
      </div>

      {/* 1. FILTRO DE STATUS RÁPIDO & BARRA DE BUSCA */}
      <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Barra de Pesquisa */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por OS#, Militar, Força, Serviço..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none font-mono"
          />
        </div>

        {/* Abas / Botões de Filtro Rápido */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 lg:pb-0 text-xs">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase flex items-center space-x-1 shrink-0 mr-1 hidden sm:flex">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtro:</span>
          </span>

          {/* Botão SEPARAÇÃO (Padrão: Em Separação) */}
          <button
            onClick={() => setStatusFilter('SEPARACAO')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase transition flex items-center space-x-1.5 cursor-pointer shrink-0 ${
              statusFilter === 'SEPARACAO'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Em Separação</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                statusFilter === 'SEPARACAO' ? 'bg-blue-800 text-white' : 'bg-zinc-800 text-zinc-300'
              }`}
            >
              {separacaoCount}
            </span>
          </button>

          {/* Botão ENTREGUES */}
          <button
            onClick={() => setStatusFilter('ENTREGUES')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase transition flex items-center space-x-1.5 cursor-pointer shrink-0 ${
              statusFilter === 'ENTREGUES'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Entregues</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                statusFilter === 'ENTREGUES' ? 'bg-black/20 text-black' : 'bg-zinc-800 text-zinc-300'
              }`}
            >
              {entreguesCount}
            </span>
          </button>

          {/* Botão CONCLUÍDAS */}
          <button
            onClick={() => setStatusFilter('CONCLUIDAS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase transition flex items-center space-x-1.5 cursor-pointer shrink-0 ${
              statusFilter === 'CONCLUIDAS'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Concluídas</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                statusFilter === 'CONCLUIDAS' ? 'bg-emerald-800 text-white' : 'bg-zinc-800 text-zinc-300'
              }`}
            >
              {concluidasCount}
            </span>
          </button>

          {/* Botão TODAS */}
          <button
            onClick={() => setStatusFilter('TODAS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase transition flex items-center space-x-1.5 cursor-pointer shrink-0 ${
              statusFilter === 'TODAS'
                ? 'bg-zinc-700 text-white shadow-md'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <span>Todas</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                statusFilter === 'TODAS' ? 'bg-zinc-800 text-white' : 'bg-zinc-800 text-zinc-300'
              }`}
            >
              {todasCount}
            </span>
          </button>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL: TABELA DE OS OU CARDS */}
      {filteredOrders.length === 0 ? (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-12 text-center text-zinc-500">
          <Wrench className="w-12 h-12 mx-auto text-zinc-600 mb-3" />
          <p className="text-sm font-semibold text-zinc-400">Nenhuma Ordem de Serviço encontrada</p>
          <p className="text-xs text-zinc-500 mt-1">
            {statusFilter === 'SEPARACAO'
              ? 'Não há ordens de serviço em separação no momento.'
              : 'Nenhum registro para o filtro selecionado.'}
          </p>
          <button
            onClick={handleOpenNewOs}
            className="mt-4 px-4 py-2 bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-black border border-amber-500/30 rounded-xl text-xs font-bold uppercase transition inline-flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Nova OS</span>
          </button>
        </div>
      ) : (
        /* ============================================================
           VISUALIZAÇÃO EM CARDS
           ============================================================ */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((os) => {
            const balanceDue = os.value - os.deposit;
            const whatsAppUrl = buildOsWhatsAppUrl(os);

            return (
              <div
                key={os.id}
                className="bg-zinc-900 border border-zinc-800/80 hover:border-amber-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 shadow-xl group"
              >
                <div>
                  {/* Top bar: OS Number + Status */}
                  <div
                    onClick={() => onOpenReceiptModal(os)}
                    className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-3 cursor-pointer group-hover:border-amber-500/40 transition"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-bold font-mono text-amber-400 text-sm tracking-wide flex items-center space-x-1">
                        <Wrench className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition" />
                        <span>{os.id}</span>
                      </span>
                      <span className="bg-zinc-800 text-zinc-400 text-[9px] px-2 py-0.5 rounded font-mono">
                        {formatDate(os.date)}
                      </span>
                    </div>
                    {renderStatusBadge(os.status)}
                  </div>

                  {/* Customer Military Badge */}
                  <div
                    onClick={() => onOpenReceiptModal(os)}
                    className="p-3 bg-zinc-950 hover:bg-zinc-900/90 rounded-xl border border-zinc-800/80 mb-3 cursor-pointer transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                        {os.force || 'Militar'}
                      </span>
                    </div>
                    <div className="text-base font-bold text-white mt-1 font-tactical tracking-wide">
                      {os.soldado || os.warName || 'Militar'}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-1 font-mono">
                      <span>WhatsApp: {os.phone || '-'}</span>
                      <span className="text-rose-400 font-bold">Sangue: {os.bloodType || '-'}</span>
                    </div>
                    {os.battalion && (
                      <div className="text-[11px] text-zinc-500 mt-0.5">{os.battalion}</div>
                    )}
                  </div>

                  {/* Service Details */}
                  <div className="space-y-2 text-xs mb-4">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Material Entregue:</span>
                      <span className="text-amber-200 font-mono text-[11px] block bg-zinc-950 p-2 rounded-lg border border-zinc-800/60 line-clamp-2">
                        {os.itemDescription || 'Material padrão entregue para serviço'}
                      </span>
                    </div>

                    {os.specifications && (
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Especificações:</span>
                        <p className="text-zinc-400 text-[11px] italic line-clamp-2">"{os.specifications}"</p>
                      </div>
                    )}

                    {os.items && os.items.length > 0 && (
                      <div className="bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-800/80 space-y-1">
                        <span className="text-[10px] text-amber-400 uppercase block font-mono font-bold flex items-center gap-1">
                          <Package className="w-3 h-3 text-amber-400" />
                          <span>Equipamentos Vinculados ({os.items.length}):</span>
                        </span>
                        <div className="space-y-1 pt-0.5">
                          {os.items.map((it, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-[11px] text-zinc-300 font-mono"
                            >
                              <span className="truncate pr-2">• {it.qty}x {it.name}</span>
                              <span className="text-amber-400 font-semibold shrink-0">{formatBRL(it.qty * it.unitPrice)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer: Financial & Actions */}
                <div className="pt-3 border-t border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between text-xs bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase block">Valor Total</span>
                      <span className="font-bold text-white font-mono">{formatBRL(os.value)}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-zinc-500 uppercase block">
                        {balanceDue <= 0 ? 'STATUS PAGO' : 'PENDENTE RETIRADA'}
                      </span>
                      <span
                        className={`font-bold font-mono ${
                          balanceDue <= 0 ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {balanceDue <= 0 ? 'PAGO' : formatBRL(balanceDue)}
                      </span>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center justify-between gap-1.5 flex-wrap">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onOpenReceiptModal(os)}
                        title="Imprimir Comprovante / Ficha Completa"
                        className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-black border border-amber-500/30 rounded-lg text-xs font-bold flex items-center space-x-1 transition cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Comprovante</span>
                      </button>

                      {/* 4. BOTÃO DO WHATSAPP DIRETO */}
                      <a
                        href={whatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Abrir conversa no WhatsApp"
                        className="px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 rounded-lg text-xs font-semibold flex items-center space-x-1 transition cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="text-[11px]">WhatsApp</span>
                      </a>
                    </div>

                    <div className="flex items-center space-x-1">
                      {renderNextStatusAction(os)}

                      <button
                        onClick={() => onOpenEditOsModal(os)}
                        title="Editar OS"
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDeleteOs(os.id)}
                        title="Excluir OS"
                        className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
