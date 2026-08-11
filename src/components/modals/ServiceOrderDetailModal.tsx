import React from 'react';
import {
  Wrench,
  X,
  Clock,
  CheckCircle2,
  Printer,
  Edit2,
  XCircle,
  RotateCcw,
  Check,
  ShieldAlert,
  User,
  Calendar,
  PackageCheck,
  Package
} from 'lucide-react';
import { ServiceOrder, OsStatus, UserPermission } from '../../types';
import { formatBRL, formatDate } from '../../utils/formatters';

interface ServiceOrderDetailModalProps {
  isOpen: boolean;
  order: ServiceOrder | null;
  activeUser?: UserPermission;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: OsStatus) => void;
  onEdit: (order: ServiceOrder) => void;
  onPrint: (order: ServiceOrder) => void;
  onCancel: (id: string) => void;
  onEstornarBaixa: (id: string) => void;
}

export const ServiceOrderDetailModal: React.FC<ServiceOrderDetailModalProps> = ({
  isOpen,
  order,
  activeUser,
  onClose,
  onUpdateStatus,
  onEdit,
  onPrint,
  onCancel,
  onEstornarBaixa,
}) => {
  if (!isOpen || !order) return null;

  const statuses: { key: OsStatus; label: string; icon: React.ReactNode }[] = [
    { key: 'NOVO', label: 'NOVO', icon: <Clock className="w-3.5 h-3.5" /> },
    { key: 'EM_SEPARACAO', label: 'EM SEPARAÇÃO', icon: <Package className="w-3.5 h-3.5" /> },
    { key: 'SEPARADO', label: 'SEPARADO', icon: <PackageCheck className="w-3.5 h-3.5" /> },
    { key: 'ENTREGUE', label: 'ENTREGUE', icon: <Wrench className="w-3.5 h-3.5" /> },
    { key: 'CONCLUIDO', label: 'CONCLUÍDO', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  ];

  const currentStatusIndex = statuses.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === 'CANCELLED' || order.status === 'CANCELADO';
  const isConcluded = order.status === 'CONCLUIDO';

  const getStatusBadge = (status: OsStatus) => {
    switch (status) {
      case 'NOVO':
        return <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2.5 py-1 rounded-full text-xs font-bold uppercase">🟡 Novo</span>;
      case 'EM_SEPARACAO':
        return <span className="bg-blue-500/20 text-blue-400 border border-blue-500/40 px-2.5 py-1 rounded-full text-xs font-bold uppercase animate-pulse">🔵 Em Separação</span>;
      case 'SEPARADO':
        return <span className="bg-purple-500/20 text-purple-400 border border-purple-500/40 px-2.5 py-1 rounded-full text-xs font-bold uppercase">🟣 Separado</span>;
      case 'ENTREGUE':
        return <span className="bg-orange-500/20 text-orange-400 border border-orange-500/40 px-2.5 py-1 rounded-full text-xs font-bold uppercase">🟠 Entregue</span>;
      case 'CONCLUIDO':
        return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-1 rounded-full text-xs font-bold uppercase">🟢 Concluído</span>;
      case 'CANCELADO':
        return <span className="bg-rose-500/20 text-rose-400 border border-rose-500/40 px-2.5 py-1 rounded-full text-xs font-bold uppercase">🔴 Cancelado</span>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-3xl rounded-2xl shadow-2xl p-5 sm:p-6 space-y-5 my-auto max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <span className="font-bold font-mono text-amber-400 text-lg tracking-wider font-tactical">
                {order.id}
              </span>
              {getStatusBadge(order.status)}
              {order.stockDeducted && (
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                  ✓ Baixa Automática Realizada
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              Data de Emissão: {formatDate(order.date)} {order.createdBy ? `• Operador: ${order.createdBy}` : ''}
            </p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white cursor-pointer p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Status Timeline Progress Line */}
        {!isCancelled && (
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block font-tactical">
              Linha do Tempo de Progresso da OS
            </span>
            <div className="grid grid-cols-5 gap-1 pt-1">
              {statuses.map((s, idx) => {
                const isPassed = idx <= currentStatusIndex;
                const isCurrent = idx === currentStatusIndex;
                return (
                  <button
                    key={s.key}
                    onClick={() => onUpdateStatus(order.id, s.key)}
                    className={`flex flex-col items-center p-2 rounded-xl border transition cursor-pointer text-center space-y-1 ${
                      isCurrent
                        ? 'bg-amber-500 text-black border-amber-400 font-bold shadow-lg shadow-amber-500/20'
                        : isPassed
                        ? 'bg-zinc-900 text-amber-400 border-amber-500/40'
                        : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:text-zinc-300'
                    }`}
                  >
                    {s.icon}
                    <span className="text-[9px] font-bold uppercase leading-tight font-tactical">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Customer Military Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-1.5">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block font-tactical">
              Militar Solicitante
            </span>
            <div className="text-base font-bold text-white font-tactical">
              {order.rank} {order.warName}
            </div>
            <p className="text-xs text-zinc-300">{order.force}</p>
            <p className="text-xs text-zinc-400 font-mono">RE/ID: {order.militaryId || 'N/I'}</p>
            <p className="text-xs text-zinc-400">{order.battalion || 'Batalhão N/I'}</p>
            {order.phone && <p className="text-xs text-emerald-400 font-mono">Contato: {order.phone}</p>}
          </div>

          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-1.5">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block font-tactical">
              Resumo do Serviço / Prioridade
            </span>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">Prioridade:</span>
              <span
                className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                  order.priority === 'URGENTE'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    : order.priority === 'ALTA'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-zinc-800 text-zinc-300'
                }`}
              >
                {order.priority || 'NORMAL'}
              </span>
            </div>
            <div className="text-xs font-bold text-white pt-1">{order.serviceType}</div>
            <p className="text-xs text-zinc-400 italic">"{order.itemDescription || 'Sem descrição'}"</p>
            {order.specifications && (
              <p className="text-xs text-amber-300/80 font-mono bg-zinc-900 p-2 rounded border border-zinc-800 mt-1">
                Obs: {order.specifications}
              </p>
            )}
          </div>
        </div>

        {/* Linked Products Table */}
        {order.items && order.items.length > 0 && (
          <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 space-y-2">
            <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-tactical block">
              Equipamentos Solicitados no Arsenal nesta OS
            </span>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 text-[10px] uppercase font-mono">
                    <th className="pb-2">SKU</th>
                    <th className="pb-2">Equipamento</th>
                    <th className="pb-2 text-center">Quantidade</th>
                    <th className="pb-2 text-right">Valor Un.</th>
                    <th className="pb-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono">
                  {order.items.map((item, i) => (
                    <tr key={i} className="text-zinc-300">
                      <td className="py-2 text-amber-400 text-[11px]">{item.sku}</td>
                      <td className="py-2 font-bold text-zinc-200">{item.name}</td>
                      <td className="py-2 text-center font-bold text-emerald-400">{item.qty} un</td>
                      <td className="py-2 text-right text-zinc-400">{formatBRL(item.unitPrice || 0)}</td>
                      <td className="py-2 text-right text-emerald-400 font-bold">
                        {formatBRL((item.qty || 1) * (item.unitPrice || 0))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* History Audit Logs */}
        {order.historyLogs && order.historyLogs.length > 0 && (
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block font-tactical">
              Histórico de Alterações na OS
            </span>
            <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
              {order.historyLogs.map((log) => (
                <div key={log.id} className="text-[11px] flex items-center justify-between text-zinc-400 font-mono">
                  <span>
                    • <strong className="text-zinc-200">{log.user}</strong>: {log.action}{' '}
                    {log.statusTo ? `(${log.statusTo})` : ''}
                  </span>
                  <span className="text-zinc-500">{formatDate(log.date)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Financial Summary */}
        <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-xl border border-zinc-800 text-xs">
          <div>
            <span className="text-zinc-500 uppercase block text-[10px]">Valor Total OS:</span>
            <span className="text-lg font-bold text-white font-mono">{formatBRL(order.value)}</span>
          </div>
          <div>
            <span className="text-zinc-500 uppercase block text-[10px]">Sinal Pago:</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">{formatBRL(order.deposit)}</span>
          </div>
          <div>
            <span className="text-zinc-500 uppercase block text-[10px]">Saldo Restante:</span>
            <span className="text-lg font-bold text-amber-400 font-mono">
              {formatBRL(Math.max(0, order.value - order.deposit))}
            </span>
          </div>
        </div>

        {/* Actions Toolbar */}
        <div className="pt-3 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPrint(order)}
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>🖨 Imprimir OS</span>
            </button>

            <button
              onClick={() => onEdit(order)}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Edit2 className="w-4 h-4" />
              <span>Editar</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {isConcluded && order.stockDeducted && (
              <button
                onClick={() => onEstornarBaixa(order.id)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition flex items-center space-x-1.5 cursor-pointer shadow-lg shadow-blue-600/20"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Estornar Baixa</span>
              </button>
            )}

            {!isCancelled && order.status !== 'CONCLUIDO' && (
              <button
                onClick={() => onUpdateStatus(order.id, 'CONCLUIDO')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase transition flex items-center space-x-1.5 cursor-pointer shadow-lg shadow-emerald-600/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Concluir & Baixar Estoque</span>
              </button>
            )}

            {!isCancelled && (
              <button
                onClick={() => onCancel(order.id)}
                className="bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800/80 px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition flex items-center space-x-1 cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>Cancelar OS</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
