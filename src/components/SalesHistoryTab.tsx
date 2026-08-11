import React, { useState } from 'react';
import { Search, MessageCircle, Eye, ShoppingBag, X, User, Printer, Shield } from 'lucide-react';
import { Order } from '../types';
import { formatBRL, formatDate } from '../utils/formatters';
import { generateOrderWhatsAppText, openWhatsApp } from '../utils/whatsapp';

interface SalesHistoryTabProps {
  sales: Order[];
  onOpenReceipt: (order: Order) => void;
}

export const SalesHistoryTab: React.FC<SalesHistoryTabProps> = ({ sales, onOpenReceipt }) => {
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [customPhone, setCustomPhone] = useState('');

  const filteredSales = sales.filter((s) => {
    const query = search.toLowerCase();
    return (
      s.id.toLowerCase().includes(query) ||
      (s.soldado && s.soldado.toLowerCase().includes(query)) ||
      (s.warName && s.warName.toLowerCase().includes(query)) ||
      (s.re && s.re.toLowerCase().includes(query)) ||
      (s.cpf && s.cpf.toLowerCase().includes(query)) ||
      (s.militaryId && s.militaryId.toLowerCase().includes(query)) ||
      (s.force && s.force.toLowerCase().includes(query)) ||
      (s.battalion && s.battalion.toLowerCase().includes(query)) ||
      s.items.some((i) => i.name.toLowerCase().includes(query))
    );
  });

  const handleQuickWhatsApp = (order: Order) => {
    const text = generateOrderWhatsAppText(order);
    openWhatsApp(order.phone || '', text);
  };

  return (
    <div className="space-y-4">
      <div className="bg-tactical-card border border-zinc-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por ID, Nome, RE, Batalhão ou Item..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 font-mono placeholder-zinc-500"
          />
        </div>
        <span className="text-xs text-zinc-400 font-mono flex items-center space-x-1.5">
          <ShoppingBag className="w-4 h-4 text-amber-500" />
          <span>{filteredSales.length} baixas/pedidos salvos</span>
        </span>
      </div>

      <div className="bg-tactical-card border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 uppercase text-[10px] tracking-wider font-tactical">
              <tr>
                <th className="p-4 font-semibold">Cód. Pedido</th>
                <th className="p-4 font-semibold">Data / Hora</th>
                <th className="p-4 font-semibold">Militar / Perfil</th>
                <th className="p-4 font-semibold">Força / Unidade</th>
                <th className="p-4 font-semibold">Pagamento</th>
                <th className="p-4 font-semibold text-center">Itens</th>
                <th className="p-4 font-semibold text-right">Valor Total</th>
                <th className="p-4 font-semibold text-center">Ações Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-zinc-500 font-mono">
                    Nenhum pedido militar registrado.
                  </td>
                </tr>
              ) : (
                filteredSales.map((s) => (
                  <tr key={s.id} className="hover:bg-zinc-900/80 transition group">
                    <td className="p-4 font-mono font-bold text-amber-400 text-xs">#{s.id}</td>
                    <td className="p-4 text-xs text-zinc-400 font-mono">{formatDate(s.date)}</td>
                    <td 
                      onClick={() => {
                        setSelectedOrder(s);
                        setCustomPhone(s.phone || '');
                      }}
                      className="p-4 font-medium text-zinc-100 cursor-pointer group-hover:text-amber-400 transition"
                    >
                      <div className="font-bold text-zinc-200 group-hover:text-amber-400 flex items-center space-x-1">
                        <span>{s.soldado || s.warName || 'Soldado'}</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono">
                        RE: {s.re || s.militaryId || '-'} | CPF: {s.cpf || '-'}
                      </div>
                    </td>
                    <td className="p-4 text-zinc-300">
                      <span className="bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg text-xs font-semibold text-amber-400/90">
                        {s.force}
                      </span>
                      <span className="text-[10px] text-zinc-500 block">{s.battalion || ''}</span>
                    </td>
                    <td className="p-4 text-zinc-300 text-xs font-mono">{s.paymentMethod}</td>
                    <td className="p-4 text-center font-bold text-zinc-300 font-mono">
                      <span className="bg-zinc-900/80 px-2 py-1 rounded-lg border border-zinc-800">
                        {s.items.reduce((a, b) => a + b.qty, 0)} un
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold text-emerald-400 font-mono text-sm">{formatBRL(s.total)}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => {
                            setSelectedOrder(s);
                            setCustomPhone(s.phone || '');
                          }}
                          title="Visualizar Ficha do Militar e Detalhes"
                          className="bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-black border border-amber-500/30 text-xs px-2.5 py-1.5 rounded-lg transition font-bold flex items-center space-x-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden md:inline">Ver Ficha</span>
                        </button>

                        <button
                          onClick={() => handleQuickWhatsApp(s)}
                          title="Enviar via WhatsApp"
                          className="bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 text-xs px-2.5 py-1.5 rounded-lg transition font-bold flex items-center space-x-1 cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span className="hidden md:inline">WhatsApp</span>
                        </button>

                        <button
                          onClick={() => onOpenReceipt(s)}
                          title="Imprimir Comprovante Completo"
                          className="bg-zinc-800 hover:bg-amber-500 hover:text-black text-amber-400 text-xs px-2.5 py-1.5 rounded-lg transition font-bold uppercase cursor-pointer"
                        >
                          Comprovante
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Order & Military Profile Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 w-full max-w-xl rounded-2xl shadow-2xl p-6 space-y-4 relative max-h-[90vh] overflow-y-auto font-sans">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
              <div>
                <span className="bg-amber-500/20 text-amber-400 font-mono font-bold px-2.5 py-0.5 rounded-md text-xs border border-amber-500/30">
                  PEDIDO / BAIXA #{selectedOrder.id}
                </span>
                <span className="text-xs text-zinc-400 font-mono ml-2">{formatDate(selectedOrder.date)}</span>
              </div>
            </div>

            {/* FICHA TÁTICA DO MILITAR */}
            <div className="p-4 bg-zinc-950 rounded-2xl border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-tactical">
                      Ficha Tática do Militar
                    </h4>
                    <p className="text-[10px] text-zinc-400">Dados cadastrais do operador responsável</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {selectedOrder.force || 'Polícia Militar'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="bg-zinc-900 p-2.5 rounded-xl border border-zinc-800/80">
                  <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Nome de Guerra / Soldado</span>
                  <span className="font-bold text-white text-sm block truncate">
                    {selectedOrder.soldado || selectedOrder.warName || 'Não Informado'}
                  </span>
                </div>

                <div className="bg-zinc-900 p-2.5 rounded-xl border border-zinc-800/80">
                  <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Posto / Graduação</span>
                  <span className="font-bold text-amber-400 block truncate">
                    {selectedOrder.rank || 'Militar'}
                  </span>
                </div>

                <div className="bg-zinc-900 p-2.5 rounded-xl border border-zinc-800/80">
                  <span className="text-[10px] text-zinc-500 uppercase block font-semibold">RE / Matrícula</span>
                  <span className="font-bold text-zinc-200 font-mono block truncate">
                    {selectedOrder.re || selectedOrder.militaryId || 'N/I'}
                  </span>
                </div>

                <div className="bg-zinc-900 p-2.5 rounded-xl border border-zinc-800/80">
                  <span className="text-[10px] text-zinc-500 uppercase block font-semibold">CPF</span>
                  <span className="font-bold text-zinc-200 font-mono block truncate">
                    {selectedOrder.cpf || 'N/I'}
                  </span>
                </div>

                <div className="bg-zinc-900 p-2.5 rounded-xl border border-zinc-800/80">
                  <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Tipo Sanguíneo</span>
                  <span className="font-bold text-rose-400 font-mono bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/30 inline-block mt-0.5">
                    {selectedOrder.bloodType || 'N/I'}
                  </span>
                </div>

                <div className="bg-zinc-900 p-2.5 rounded-xl border border-zinc-800/80">
                  <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Batalhão / Unidade</span>
                  <span className="font-bold text-zinc-300 block truncate">
                    {selectedOrder.battalion || selectedOrder.force || 'N/I'}
                  </span>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-tactical">
                Itens / Equipamentos Adquiridos
              </span>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl divide-y divide-zinc-800/80 max-h-48 overflow-y-auto">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-zinc-200">{item.name}</span>
                      <span className="text-[10px] text-zinc-500 block font-mono">
                        {item.qty} x {formatBRL(item.unitPrice)}
                      </span>
                    </div>
                    <span className="font-bold text-emerald-400 font-mono">{formatBRL(item.qty * item.unitPrice)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800 space-y-1 text-xs">
              {selectedOrder.discount && selectedOrder.discount > 0 ? (
                <>
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal:</span>
                    <span className="font-mono">{formatBRL(selectedOrder.subtotal || selectedOrder.total + selectedOrder.discount)}</span>
                  </div>
                  <div className="flex justify-between text-rose-400">
                    <span>Desconto Militar:</span>
                    <span className="font-mono">-{formatBRL(selectedOrder.discount)}</span>
                  </div>
                </>
              ) : null}
              <div className="flex justify-between font-bold text-sm text-emerald-400 pt-1 border-t border-zinc-800">
                <span>Total Pago ({selectedOrder.paymentMethod}):</span>
                <span className="font-mono">{formatBRL(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Direct WhatsApp Box */}
            <div className="bg-emerald-950/30 border border-emerald-500/30 p-3 rounded-xl space-y-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5 uppercase">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Enviar Resumo por WhatsApp</span>
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  placeholder="Número de WhatsApp (ex: 11999999999)"
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono"
                />
                <button
                  onClick={() => {
                    const text = generateOrderWhatsAppText(selectedOrder);
                    openWhatsApp(customPhone, text);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition flex items-center space-x-1 cursor-pointer shrink-0"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Abrir WhatsApp</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => {
                  const ord = selectedOrder;
                  setSelectedOrder(null);
                  onOpenReceipt(ord);
                }}
                className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer flex items-center space-x-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Abrir Comprovante / Ficha Imprimível</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


