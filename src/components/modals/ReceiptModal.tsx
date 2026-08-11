import React, { useState } from 'react';
import { Printer, X, MessageCircle, Copy, Check } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-700 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4 font-mono relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center border-b border-zinc-800 pb-4 space-y-1 flex flex-col items-center">
          <div className="w-14 h-14 rounded-xl overflow-hidden border border-amber-500/40 shadow-lg shadow-amber-500/20 mb-2">
            <img
              src={bizuLogo}
              alt="Bizú Logo"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <h3 className="font-bold text-white text-base font-tactical tracking-wider uppercase">
            BIZÚ - ARTIGOS MILITARES
          </h3>
          <p className="text-[10px] text-amber-500 font-bold">COMPROVANTE DE PEDIDO / BAIXA DE CAUTELA</p>
          <p className="text-[11px] text-zinc-400">PEDIDO: #{order.id}</p>
        </div>

        {/* Military Profile Summary in Receipt */}
        <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-[11px] space-y-1 text-zinc-300">
          <div className="flex justify-between">
            <span className="text-zinc-500">DATA/HORA:</span>
            <span className="text-zinc-200">{formatDate(order.date)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">SOLDADO:</span>
            <span className="text-amber-400 font-bold">{order.soldado || order.warName || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">RE / MATRÍCULA:</span>
            <span className="text-zinc-100 font-bold">{order.re || order.militaryId || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">CPF:</span>
            <span className="text-zinc-200">{order.cpf || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">TIPO SANGUÍNEO:</span>
            <span className="text-rose-400 font-bold">{order.bloodType || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">FORÇA/CORPO:</span>
            <span className="text-zinc-200">{order.force || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">BATALHÃO/UNIDADE:</span>
            <span className="text-zinc-200">{order.battalion || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">TIPO PAGAMENTO:</span>
            <span className="text-zinc-200">{order.paymentMethod}</span>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-3 space-y-2 text-xs">
          <span className="text-[10px] text-zinc-500 uppercase font-semibold block">
            Itens do Arsenal Fornecidos:
          </span>
          <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-zinc-200">
                <span>
                  {item.qty}x {item.name}
                </span>
                <span className="font-bold text-zinc-100">{formatBRL(item.qty * item.unitPrice)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-800 pt-2 space-y-1">
            {order.discount && order.discount > 0 ? (
              <>
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Subtotal:</span>
                  <span>{formatBRL(order.subtotal || order.total + order.discount)}</span>
                </div>
                <div className="flex justify-between text-xs text-rose-400">
                  <span>Desconto Aplicado:</span>
                  <span>-{formatBRL(order.discount)}</span>
                </div>
              </>
            ) : null}
            <div className="flex justify-between font-bold text-sm text-emerald-400 pt-1">
              <span>VALOR TOTAL:</span>
              <span>{formatBRL(order.total)}</span>
            </div>
          </div>
        </div>

        {/* WhatsApp Quick Action Section */}
        <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <span className="flex items-center space-x-1.5">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Enviar para o WhatsApp do Militar</span>
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

        <div className="flex justify-end space-x-2 pt-2">
          <button
            onClick={handlePrint}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-amber-400 border border-zinc-700 py-2.5 rounded-xl text-xs font-bold uppercase transition flex items-center justify-center space-x-1 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir</span>
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

