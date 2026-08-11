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
  Calendar,
  UserCheck,
  ChevronRight,
  ShieldAlert,
  MessageCircle,
  Eye,
  PackageCheck,
  Package
} from 'lucide-react';
import { ServiceOrder, OsStatus } from '../types';
import { formatBRL, formatDate } from '../utils/formatters';
import { generateOsWhatsAppText, openWhatsApp } from '../utils/whatsapp';

interface WorkOrdersTabProps {
  orders: ServiceOrder[];
  onOpenNewOsModal: () => void;
  onOpenEditOsModal: (os: ServiceOrder) => void;
  onOpenDetailModal: (os: ServiceOrder) => void;
  onOpenReceiptModal: (os: ServiceOrder) => void;
  onUpdateOsStatus: (id: string, status: OsStatus) => void;
  onDeleteOs: (id: string) => void;
}

export const WorkOrdersTab: React.FC<WorkOrdersTabProps> = ({
  orders = [],
  onOpenNewOsModal,
  onOpenEditOsModal,
  onOpenDetailModal,
  onOpenReceiptModal,
  onUpdateOsStatus,
  onDeleteOs,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Stats calculation
  const totalOsCount = orders.length;
  const novoCount = orders.filter((o) => o.status === 'NOVO').length;
  const separacaoCount = orders.filter((o) => o.status === 'EM_SEPARACAO').length;
  const separadoCount = orders.filter((o) => o.status === 'SEPARADO').length;
  const entregueCount = orders.filter((o) => o.status === 'ENTREGUE').length;
  const concluidoCount = orders.filter((o) => o.status === 'CONCLUIDO').length;
  const emAndamentoCount = novoCount + separacaoCount;

  const totalPendingBalance = orders
    .filter((o) => o.status !== 'CONCLUIDO' && o.status !== 'CANCELADO')
    .reduce((acc, curr) => acc + (curr.value - curr.deposit), 0);

  // Filtered orders
  const filteredOrders = orders.filter((os) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      os.id.toLowerCase().includes(query) ||
      (os.number && os.number.toLowerCase().includes(query)) ||
      os.warName.toLowerCase().includes(query) ||
      os.force.toLowerCase().includes(query) ||
      os.serviceType.toLowerCase().includes(query) ||
      (os.itemDescription && os.itemDescription.toLowerCase().includes(query));

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && (os.status === 'NOVO' || os.status === 'EM_SEPARACAO' || os.status === 'SEPARADO')) ||
      os.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OsStatus) => {
    switch (status) {
      case 'NOVO':
        return (
          <span className="inline-flex items-center space-x-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">
            <Clock className="w-3 h-3" />
            <span>Novo</span>
          </span>
        );
      case 'EM_SEPARACAO':
        return (
          <span className="inline-flex items-center space-x-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase animate-pulse">
            <Package className="w-3 h-3" />
            <span>Em Separação</span>
          </span>
        );
      case 'SEPARADO':
        return (
          <span className="inline-flex items-center space-x-1 bg-purple-500/10 text-purple-400 border border-purple-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">
            <PackageCheck className="w-3 h-3" />
            <span>Separado</span>
          </span>
        );
      case 'ENTREGUE':
        return (
          <span className="inline-flex items-center space-x-1 bg-orange-500/10 text-orange-400 border border-orange-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">
            <Wrench className="w-3 h-3" />
            <span>Entregue</span>
          </span>
        );
      case 'CONCLUIDO':
        return (
          <span className="inline-flex items-center space-x-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">
            <CheckCircle2 className="w-3 h-3" />
            <span>Concluído</span>
          </span>
        );
      case 'CANCELADO':
        return (
          <span className="inline-flex items-center space-x-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">
            <span>Cancelado</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/80 p-5 rounded-2xl border border-zinc-800/80">
        <div>
          <h2 className="text-xl font-bold text-white font-tactical tracking-wider flex items-center gap-2">
            <Wrench className="w-6 h-6 text-amber-500" />
            <span>ORDENS DE SERVIÇO (OS) - OFICINA TÁTICA</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Gestão de bordados de tarjetas, confecção de divisas, ajustes de farda e customizações táticas.
          </p>
        </div>

        <button
          onClick={onOpenNewOsModal}
          className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider transition flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Ordem de Serviço (OS)</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold uppercase">
            <span>Total de OS Emitidas</span>
            <FileText className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-white mt-2 font-tactical">{totalOsCount}</p>
          <p className="text-[10px] text-zinc-500 mt-1">Registros na oficina</p>
        </div>

        <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold uppercase">
            <span>Em Andamento / Separação</span>
            <Wrench className="w-4 h-4 text-blue-400 animate-spin" />
          </div>
          <p className="text-2xl font-bold text-blue-400 mt-2 font-tactical">{emAndamentoCount}</p>
          <p className="text-[10px] text-zinc-500 mt-1">{novoCount} Novos • {separacaoCount} Separação</p>
        </div>

        <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold uppercase">
            <span>Prontas / Separadas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2 font-tactical">{separadoCount}</p>
          <p className="text-[10px] text-zinc-500 mt-1">Aguardando militar no balcão</p>
        </div>

        <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold uppercase">
            <span>Saldo Pendente a Receber</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2 font-mono">{formatBRL(totalPendingBalance)}</p>
          <p className="text-[10px] text-zinc-500 mt-1">A receber nas retiradas</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por OS#, Nome de Guerra, Força, Serviço..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs">
          <Filter className="w-4 h-4 text-zinc-500 shrink-0 mr-1" />
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-amber-500 text-black font-bold'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            Todas ({orders.length})
          </button>
          <button
            onClick={() => setStatusFilter('ACTIVE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition cursor-pointer ${
              statusFilter === 'ACTIVE'
                ? 'bg-amber-500 text-black font-bold'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            Em Andamento ({emAndamentoCount})
          </button>
          <button
            onClick={() => setStatusFilter('SEPARADO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition cursor-pointer ${
              statusFilter === 'SEPARADO'
                ? 'bg-amber-500 text-black font-bold'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            Separado ({separadoCount})
          </button>
          <button
            onClick={() => setStatusFilter('ENTREGUE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition cursor-pointer ${
              statusFilter === 'ENTREGUE'
                ? 'bg-amber-500 text-black font-bold'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            Entregues ({entregueCount})
          </button>
          <button
            onClick={() => setStatusFilter('CONCLUIDO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition cursor-pointer ${
              statusFilter === 'CONCLUIDO'
                ? 'bg-amber-500 text-black font-bold'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            Concluídos ({concluidoCount})
          </button>
        </div>
      </div>

      {/* OS Grid / List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-12 text-center text-zinc-500">
          <Wrench className="w-12 h-12 mx-auto text-zinc-600 mb-3" />
          <p className="text-sm font-semibold text-zinc-400">Nenhuma Ordem de Serviço encontrada</p>
          <p className="text-xs text-zinc-500 mt-1">
            Clique em "Nova Ordem de Serviço (OS)" para registrar um pedido de bordado, costura ou customização.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((os) => {
            const balanceDue = os.value - os.deposit;
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
                    {getStatusBadge(os.status)}
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
                      <span className="text-[10px] text-zinc-500 font-mono">
                        RE: {os.re || os.militaryId || 'S/ ID'}
                      </span>
                    </div>
                    <div className="text-base font-bold text-white mt-1 font-tactical tracking-wide">
                      {os.soldado || os.warName || 'Militar'}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-1 font-mono">
                      <span>CPF: {os.cpf || '-'}</span>
                      <span className="text-rose-400 font-bold">Sangue: {os.bloodType || '-'}</span>
                    </div>
                    {os.battalion && (
                      <div className="text-[11px] text-zinc-500 mt-0.5">{os.battalion}</div>
                    )}
                  </div>

                  {/* Service Details */}
                  <div className="space-y-2 text-xs mb-4">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Tipo de Serviço:</span>
                      <span className="text-white font-bold">{os.serviceType}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Material Entregue:</span>
                      <span className="text-amber-200 font-mono text-[11px] block bg-zinc-950 p-2 rounded-lg border border-zinc-800/60 line-clamp-2">
                        {os.itemDescription}
                      </span>
                    </div>

                    {os.specifications && (
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Especificações:</span>
                        <p className="text-zinc-400 text-[11px] italic line-clamp-2">"{os.specifications}"</p>
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
                        onClick={() => onOpenDetailModal(os)}
                        title="Ver Ficha Completa da OS"
                        className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-black border border-amber-500/30 rounded-lg text-xs font-bold flex items-center space-x-1 transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Ver Ficha</span>
                      </button>

                      <button
                        onClick={() => onOpenReceiptModal(os)}
                        title="Imprimir Comprovante / OS"
                        className="px-2 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-semibold flex items-center space-x-1 transition cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-[11px]">Ficha</span>
                      </button>

                      <button
                        onClick={() => {
                          const text = generateOsWhatsAppText(os);
                          openWhatsApp('', text);
                        }}
                        title="Avisar no WhatsApp"
                        className="px-2 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 rounded-lg text-xs font-semibold flex items-center space-x-1 transition cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="text-[11px]">WhatsApp</span>
                      </button>
                    </div>

                    <div className="flex items-center space-x-1">
                      {os.status === 'NOVO' ? (
                        <button
                          onClick={() => onUpdateOsStatus(os.id, 'EM_SEPARACAO')}
                          className="bg-blue-500 hover:bg-blue-400 text-black text-[11px] font-bold px-2 py-1.5 rounded-lg transition uppercase tracking-wider cursor-pointer"
                        >
                          Separar
                        </button>
                      ) : os.status === 'EM_SEPARACAO' ? (
                        <button
                          onClick={() => onUpdateOsStatus(os.id, 'SEPARADO')}
                          className="bg-purple-500 hover:bg-purple-400 text-black text-[11px] font-bold px-2 py-1.5 rounded-lg transition uppercase tracking-wider cursor-pointer"
                        >
                          Pronto
                        </button>
                      ) : os.status === 'SEPARADO' ? (
                        <button
                          onClick={() => onUpdateOsStatus(os.id, 'ENTREGUE')}
                          className="bg-orange-500 hover:bg-orange-400 text-black text-[11px] font-bold px-2 py-1.5 rounded-lg transition uppercase tracking-wider cursor-pointer"
                        >
                          Entregar
                        </button>
                      ) : os.status === 'ENTREGUE' ? (
                        <button
                          onClick={() => onUpdateOsStatus(os.id, 'CONCLUIDO')}
                          className="bg-emerald-500 hover:bg-emerald-400 text-black text-[11px] font-bold px-2 py-1.5 rounded-lg transition uppercase tracking-wider cursor-pointer"
                        >
                          Concluir
                        </button>
                      ) : null}

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
