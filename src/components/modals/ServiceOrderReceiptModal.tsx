import React from 'react';
import { Printer, X, Wrench, ShieldCheck } from 'lucide-react';
import { ServiceOrder } from '../../types';
import { formatBRL, formatDate } from '../../utils/formatters';
import bizuLogo from '../../assets/images/bizu_tactical_shield_1786484872892.jpg';

interface ServiceOrderReceiptModalProps {
  isOpen: boolean;
  os: ServiceOrder | null;
  onClose: () => void;
}

export const ServiceOrderReceiptModal: React.FC<ServiceOrderReceiptModalProps> = ({
  isOpen,
  os,
  onClose,
}) => {
  if (!isOpen || !os) return null;

  const handlePrint = () => {
    window.print();
  };

  const balanceDue = os.value - os.deposit;

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
        <div id="printable-os" className="space-y-4">
          {/* Header & Unaltered Logo */}
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
              COMPROVANTE DE ORDEM DE SERVIÇO & FICHA DE OFICINA
            </p>
            <p className="text-[10px] text-zinc-400 font-mono">
              CNPJ: 42.189.902/0001-88 • TEL / WHATSAPP: (11) 98888-1234
            </p>
          </div>

          {/* OS Header Info */}
          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-zinc-500 block text-[10px]">NÚMERO DA OS</span>
              <span className="text-amber-400 font-bold text-sm">{os.id}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px]">DATA DA EMISSÃO</span>
              <span className="text-zinc-300">{formatDate(os.date)}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px]">PRAZO PREVISTO</span>
              <span className="text-emerald-400 font-bold">{formatDate(os.deliveryDate)}</span>
            </div>
          </div>

          {/* Military Customer Details */}
          <div className="bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-800/80 space-y-1.5 text-xs">
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              IDENTIFICAÇÃO DO MILITAR / CLIENTE
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Soldado:</span>
              <span className="font-bold text-white">{os.soldado || os.warName || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">RE / Matrícula:</span>
              <span className="font-mono text-amber-400">{os.re || os.militaryId || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">CPF:</span>
              <span className="text-zinc-200">{os.cpf || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Tipo Sanguíneo:</span>
              <span className="text-rose-400 font-bold">{os.bloodType || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Corporação / Força:</span>
              <span className="text-zinc-200">{os.force || '-'}</span>
            </div>
            {os.battalion && (
              <div className="flex justify-between">
                <span className="text-zinc-400">Batalhão / Unidade:</span>
                <span className="text-zinc-300">{os.battalion}</span>
              </div>
            )}
            {os.phone && (
              <div className="flex justify-between">
                <span className="text-zinc-400">Contato:</span>
                <span className="text-zinc-300">{os.phone}</span>
              </div>
            )}
          </div>

          {/* Service & Item Details */}
          <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800/80 space-y-2 text-xs">
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Wrench className="w-3.5 h-3.5" />
              DESCRIÇÃO DO SERVIÇO DE OFICINA
            </div>

            <div>
              <span className="text-zinc-500 text-[10px] block uppercase">Tipo de Serviço</span>
              <span className="text-white font-bold">{os.serviceType}</span>
            </div>

            <div>
              <span className="text-zinc-500 text-[10px] block uppercase">Material Deixado pelo Cliente</span>
              <span className="text-amber-200 font-mono text-[11px] block bg-zinc-900 p-2 rounded-lg border border-zinc-800 mt-0.5">
                {os.itemDescription}
              </span>
            </div>

            {os.specifications && (
              <div>
                <span className="text-zinc-500 text-[10px] block uppercase">Especificações do Bordado / Costura</span>
                <span className="text-zinc-300 text-[11px] block bg-zinc-900 p-2 rounded-lg border border-zinc-800 mt-0.5 whitespace-pre-wrap">
                  {os.specifications}
                </span>
              </div>
            )}
          </div>

          {/* Financial Breakdown */}
          <div className="bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-800 space-y-1.5 text-xs font-mono">
            <div className="flex justify-between text-zinc-400">
              <span>Valor Total do Serviço:</span>
              <span className="font-bold text-white">{formatBRL(os.value)}</span>
            </div>
            <div className="flex justify-between text-emerald-400">
              <span>Sinal Pago ({os.paymentMethod}):</span>
              <span className="font-bold"> - {formatBRL(os.deposit)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold border-t border-zinc-800 pt-1.5 text-amber-400">
              <span>SALDO RESTANTE NA RETIRADA:</span>
              <span>{formatBRL(balanceDue > 0 ? balanceDue : 0)}</span>
            </div>
          </div>

          {/* Signatures & Notice */}
          <div className="pt-4 border-t border-zinc-800 text-[10px] text-zinc-500 text-center space-y-4">
            <p className="italic">
              * Apresente este comprovante para a retirada dos materiais na loja BIZÚ. Prazo de guarda máximo: 90 dias.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 text-zinc-400">
              <div className="border-t border-zinc-700 pt-1">
                <span>Assinatura do Atendente</span>
              </div>
              <div className="border-t border-zinc-700 pt-1">
                <span>Assinatura do Militar/Cliente</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-between items-center print:hidden">
          <span className="text-xs text-zinc-500">Formato Térmico / A4 Pronto</span>
          <button
            onClick={handlePrint}
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition flex items-center space-x-2 cursor-pointer shadow-lg shadow-amber-500/10"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Ficha / OS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
