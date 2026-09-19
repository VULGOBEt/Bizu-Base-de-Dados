import React from 'react';
import { Printer, X, MessageCircle, ShieldCheck, Box } from 'lucide-react';
import { Order } from '../../types';
import { formatBRL, formatDate } from '../../utils/formatters';
import { openWhatsApp } from '../../utils/whatsapp';
import bizuLogo from '../../assets/images/bizu_tactical_shield_1786484872892.jpg';

interface ReceiptModalProps {
  isOpen: boolean;
  order?: Order | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, order, onClose }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-zinc-900 border border-amber-500/30 rounded-2xl w-full max-w-lg p-5 sm:p-6 shadow-2xl relative text-zinc-100 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition cursor-pointer print:hidden z-10"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable Area */}
        <div id="printable-order" className="space-y-4">
          {/* Header & Logo */}
          <div className="text-center border-b border-zinc-800 pb-4 space-y-2 flex flex-col items-center">
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-amber-500/40 bg-zinc-950 shadow-lg shadow-amber-500/20 mb-1 p-0.5">
              <img
                src={bizuLogo}
                alt="BIZÚ Artigos Militares e Táticos"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <h3 className="font-bold text-white text-lg font-tactical tracking-wider uppercase">
              BIZÚ - ARTIGOS MILITARES & TÁTICOS
            </h3>
            <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">
              COMPROVANTE DE PEDIDO & FICHA MILITAR DE CAUTELA
            </p>
            <p className="text-[10px] text-zinc-400 font-mono">
              CNPJ: 42.189.902/0001-88 • TEL / WHATSAPP: (11) 98888-1234
            </p>
          </div>

          {/* Header Info Box */}
          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-zinc-500 block text-[10px]">NÚMERO DO PEDIDO</span>
              <span className="text-amber-400 font-bold text-sm">#{order.id}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px]">DATA DA EMISSÃO</span>
              <span className="text-zinc-300">{formatDate(order.date)}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px]">PAGAMENTO</span>
              <span className="text-emerald-400 font-bold">{order.paymentMethod}</span>
            </div>
          </div>

          {/* Military Identification */}
          <div className="bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-800/80 space-y-1.5 text-xs">
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              IDENTIFICAÇÃO DO MILITAR / CLIENTE
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Soldado:</span>
              <span className="font-bold text-white">{order.soldado || order.warName || 'Soldado'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">RE / Matrícula:</span>
              <span className="font-mono text-amber-400">{order.re || order.militaryId || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">CPF:</span>
              <span className="text-zinc-200">{order.cpf || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Tipo Sanguíneo:</span>
              <span className="text-rose-400 font-bold">{order.bloodType || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Corporação / Força:</span>
              <span className="text-zinc-200">{order.force || '-'}</span>
            </div>
            {order.battalion && (
              <div className="flex justify-between">
                <span className="text-zinc-400">Batalhão / Unidade:</span>
                <span className="text-zinc-300">{order.battalion}</span>
              </div>
            )}
            {order.phone && (
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">WhatsApp / Contato:</span>
                <button
                  type="button"
                  onClick={() => openWhatsApp(order.phone || '')}
                  className="font-mono text-emerald-400 hover:text-emerald-300 font-bold flex items-center space-x-1 transition cursor-pointer"
                  title="Abrir WhatsApp do Militar"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{order.phone}</span>
                </button>
              </div>
            )}
          </div>

          {/* Items Supplied */}
          <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800/80 space-y-2 text-xs">
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Box className="w-3.5 h-3.5" />
              ITENS DO ARSENAL / PRODUTOS FORNECIDOS
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-zinc-200 bg-zinc-900/60 p-2 rounded-lg border border-zinc-800">
                  <div>
                    <span className="font-bold text-amber-300">{item.qty}x</span> {item.name}
                    <span className="text-[10px] text-zinc-500 block">{formatBRL(item.unitPrice)} un</span>
                  </div>
                  <span className="font-mono font-bold text-white">{formatBRL(item.qty * item.unitPrice)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-800 space-y-1 text-xs font-mono">
            {order.discount && order.discount > 0 ? (
              <>
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal:</span>
                  <span className="font-bold text-white">{formatBRL(order.subtotal || order.total + order.discount)}</span>
                </div>
                <div className="flex justify-between text-rose-400">
                  <span>Desconto Aplicado:</span>
                  <span className="font-bold"> - {formatBRL(order.discount)}</span>
                </div>
              </>
            ) : null}
            <div className="flex justify-between text-sm font-bold border-t border-zinc-800 pt-1.5 text-emerald-400">
              <span>VALOR TOTAL PAGO:</span>
              <span>{formatBRL(order.total)}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800/80 text-[9px] text-center text-zinc-500">
            <p>*** EQUIPAMENTO TÁTICO & MILITAR REGISTRADO ***</p>
            <p className="mt-1">Bizú Tático • Material Vistoriado e Conferido</p>
          </div>
        </div>

        {/* Modal Footer Buttons */}
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-3 print:hidden">
          {order.phone && (
            <button
              onClick={() => openWhatsApp(order.phone || '')}
              className="flex-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/40 py-2.5 rounded-xl text-xs font-bold uppercase transition flex items-center justify-center space-x-1.5 cursor-pointer"
              title="Abrir WhatsApp do Militar"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Abrir WhatsApp</span>
            </button>
          )}
          <button
            onClick={handlePrint}
            className="flex-1 bg-amber-500 hover:bg-amber-400 text-black py-2.5 rounded-xl text-xs font-bold uppercase transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg shadow-amber-500/15"
            title="Imprimir Ficha em formato de comprovante"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Ficha</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl text-xs font-bold uppercase transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
