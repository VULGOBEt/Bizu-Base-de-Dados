import React, { useState } from 'react';
import { Printer, X, MessageCircle, Copy, Check, ShieldCheck, Box } from 'lucide-react';
import { Order } from '../../types';
import { formatBRL, formatDate } from '../../utils/formatters';
import { generateOrderWhatsAppText, openWhatsApp } from '../../utils/whatsapp';
import bizuLogo from '../../assets/images/bizu_tactical_shield_1786484872892.jpg';

interface ReceiptModalProps {
  isOpen: boolean;
  order?: Order | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, order, onClose }) => {
  const [phone, setPhone] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsApp = () => {
    const text = generateOrderWhatsAppText(order);
    openWhatsApp(phone || order.phone || '', text);
  };

  const handleCopyText = () => {
    const text = generateOrderWhatsAppText(order);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative text-zinc-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition cursor-pointer print:hidden"
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
              <div className="flex justify-between">
                <span className="text-zinc-400">Contato:</span>
                <span className="text-zinc-300">{order.phone}</span>
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
          <div className="bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-800 space-y-1.5 text-xs font-mono">
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

          {/* WhatsApp Quick Action Section */}
          <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-xl space-y-2 print:hidden">
            <div className="flex items-center justify-between text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <span className="flex items-center space-x-1.5">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Enviar Comprovante para o WhatsApp do Militar</span>
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="DDD + Telefone (ex: 11999999999)"
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono"
              />
              <button
                onClick={handleSendWhatsApp}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition flex items-center space-x-1 cursor-pointer shrink-0"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Enviar</span>
              </button>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleCopyText}
                className="text-[10px] text-zinc-400 hover:text-emerald-400 transition flex items-center space-x-1 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copiado para a área de transferência!' : 'Copiar texto formatado p/ WhatsApp'}</span>
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800/80 text-[9px] text-center text-zinc-500">
            <p>*** EQUIPAMENTO TÁTICO & MILITAR REGISTRADO ***</p>
            <p className="mt-1">Bizú Tático • Material Vistoriado e Conferido</p>
          </div>
        </div>

        {/* Modal Footer Buttons */}
        <div className="flex justify-end space-x-2 pt-2 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-amber-400 border border-zinc-700 py-2.5 rounded-xl text-xs font-bold uppercase transition flex items-center justify-center space-x-1 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Ficha</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-amber-500 hover:bg-amber-400 text-black py-2.5 rounded-xl text-xs font-bold uppercase transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

