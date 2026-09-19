import React from 'react';
import { Printer, X, Wrench, ShieldCheck, MessageCircle, FileText } from 'lucide-react';
import { ServiceOrder } from '../../types';
import { formatBRL, formatDate } from '../../utils/formatters';
import { buildOsWhatsAppUrl } from '../../utils/whatsapp';
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

  const balanceDue = os.value - (os.deposit || 0);

  const handlePrint = () => {
    window.print();
  };

  const whatsAppUrl = buildOsWhatsAppUrl(os);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-zinc-900 border border-amber-500/30 rounded-2xl w-full max-w-xl p-5 sm:p-7 shadow-2xl relative text-zinc-100 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1.5 rounded-xl hover:bg-zinc-800 transition cursor-pointer print:hidden z-10"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable Tactical OS Ficha / Comprovante */}
        <div
          id="printable-os-card"
          className="bg-zinc-950 p-5 sm:p-6 rounded-2xl border-2 border-zinc-800 relative space-y-4 shadow-inner"
        >
          {/* Tactical Corner Brackets (Arte Bizú Militar) */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-500/60 pointer-events-none" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-500/60 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-500/60 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-500/60 pointer-events-none" />

          {/* Header & Logo */}
          <div className="text-center border-b border-zinc-800 pb-4 space-y-2 flex flex-col items-center">
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-amber-500/50 bg-black shadow-lg shadow-amber-500/20 p-0.5">
              <img
                src={bizuLogo}
                alt="BIZÚ Artigos Militares e Táticos"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg sm:text-xl font-tactical tracking-widest uppercase">
                BIZÚ - ARTIGOS MILITARES & TÁTICOS
              </h2>
              <div className="inline-block bg-amber-500/15 border border-amber-500/40 text-amber-400 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest mt-1 font-mono">
                COMPROVANTE DE ORDEM DE SERVIÇO & FICHA DE OFICINA
              </div>
            </div>
            <p className="text-[10px] text-zinc-400 font-mono">
              CNPJ: 42.189.902/0001-88 • TEL / WHATSAPP: (11) 98888-1234
            </p>
          </div>

          {/* OS Identification Bar: Sequential Number and Issue Date only (No raw status display) */}
          <div className="bg-zinc-900/90 p-3 rounded-xl border border-zinc-800 grid grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <span className="text-zinc-500 block text-[9px] font-bold uppercase">NÚMERO DA OS</span>
              <span className="text-amber-400 font-bold text-base font-tactical tracking-wider">{os.id}</span>
            </div>
            <div className="text-right">
              <span className="text-zinc-500 block text-[9px] font-bold uppercase">DATA DE EMISSÃO</span>
              <span className="text-zinc-200 font-semibold">{formatDate(os.date)}</span>
            </div>
          </div>

          {/* Customer / Soldier Identification */}
          <div className="bg-zinc-900/50 p-3.5 rounded-xl border border-zinc-800/90 space-y-1.5 text-xs">
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-1 font-tactical">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              IDENTIFICAÇÃO DO MILITAR / CLIENTE
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-sans">
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase">Soldado</span>
                <span className="font-bold text-white text-xs">{os.soldado || os.warName || '-'}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase">Tipo Sanguíneo</span>
                <span className="text-rose-400 font-bold text-xs font-mono">{os.bloodType || '-'}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase">Força / Corporação</span>
                <span className="text-zinc-200 font-medium text-xs">{os.force || '-'}</span>
              </div>
              {os.battalion && (
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase">Batalhão / Setor</span>
                  <span className="text-zinc-300 text-xs">{os.battalion}</span>
                </div>
              )}
              {os.phone && (
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase">Contato / WhatsApp</span>
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 font-mono text-xs font-bold inline-flex items-center gap-1 transition"
                    title="Abrir WhatsApp do Militar"
                  >
                    <MessageCircle className="w-3 h-3 text-emerald-400" />
                    <span>{os.phone}</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Workshop Service Details: Materials & Specifications */}
          <div className="bg-zinc-900/50 p-3.5 rounded-xl border border-zinc-800/90 space-y-2 text-xs">
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 font-tactical">
              <Wrench className="w-3.5 h-3.5 text-amber-400" />
              DISCRIMINAÇÃO DO MATERIAL & ESPECIFICAÇÕES
            </div>

            <div>
              <span className="text-zinc-500 text-[10px] block uppercase font-semibold">Material Deixado na Oficina</span>
              <div className="text-amber-100 font-mono text-xs bg-zinc-900/90 p-2 rounded-lg border border-zinc-800 mt-0.5">
                {os.itemDescription || 'Material entregue diretamente para oficina.'}
              </div>
            </div>

            {os.specifications && (
              <div>
                <span className="text-zinc-500 text-[10px] block uppercase font-semibold">Especificações do Pedido / Ficha</span>
                <div className="text-zinc-300 text-xs bg-zinc-900/90 p-2 rounded-lg border border-zinc-800 mt-0.5 whitespace-pre-wrap font-sans">
                  {os.specifications}
                </div>
              </div>
            )}

            {os.items && os.items.length > 0 && (
              <div>
                <span className="text-zinc-500 text-[10px] block uppercase font-semibold">
                  Equipamentos Vinculados do Arsenal ({os.items.length})
                </span>
                <div className="space-y-1 mt-1 bg-zinc-900/90 p-2 rounded-lg border border-zinc-800 font-mono text-xs">
                  {os.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center text-zinc-300">
                      <span>• {it.qty}x {it.name}</span>
                      <span className="text-amber-400 font-bold">{formatBRL(it.qty * it.unitPrice)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Financial Breakdown: Value, Discount, Deposit, Remaining Balance */}
          <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800 space-y-1.5 text-xs font-mono">
            <div className="flex justify-between text-zinc-400">
              <span>Valor do Serviço / Equipamentos:</span>
              <span className="font-bold text-white">{formatBRL(os.value)}</span>
            </div>

            {os.discount !== undefined && os.discount > 0 && (
              <div className="flex justify-between text-rose-400">
                <span>Desconto Aplicado:</span>
                <span className="font-bold">- {formatBRL(os.discount)}</span>
              </div>
            )}

            <div className="flex justify-between text-emerald-400">
              <span>
                Sinal Pago ({os.paymentMethod || 'Cartão'}
                {os.installments && os.installments > 1 ? ` em ${os.installments}x` : ''}):
              </span>
              <span className="font-bold">- {formatBRL(os.deposit || 0)}</span>
            </div>

            <div className="flex justify-between text-sm font-bold border-t border-zinc-800 pt-2 text-amber-400">
              <span>SALDO RESTANTE NA RETIRADA:</span>
              <span className="text-base">{formatBRL(balanceDue > 0 ? balanceDue : 0)}</span>
            </div>
          </div>

          {/* Tactical Verification Stamp & Signatures */}
          <div className="pt-3 border-t border-zinc-800 text-[10px] text-zinc-400 space-y-4">
            <div className="flex items-center justify-between font-mono text-[9px] text-zinc-500 border-b border-zinc-900 pb-2">
              <span>CONTROLE: BIZU-TAC-{os.id.replace(/\s+/g, '')}</span>
              <span className="text-amber-500/80 font-bold uppercase">AUTENTICAÇÃO OFICIAL DE OFICINA</span>
            </div>

            <p className="italic text-center text-zinc-500 text-[10px]">
              * Apresente este comprovante oficial para a retirada dos materiais na loja BIZÚ.
            </p>

            <div className="grid grid-cols-2 gap-8 pt-4 text-zinc-300">
              <div className="border-t border-zinc-700 pt-1.5 text-center">
                <span className="block font-semibold">Assinatura do Atendente</span>
                <span className="text-[9px] text-zinc-500 font-mono">Oficina Tática BIZÚ</span>
              </div>
              <div className="border-t border-zinc-700 pt-1.5 text-center">
                <span className="block font-semibold">Assinatura do Militar / Cliente</span>
                <span className="text-[9px] text-zinc-500 font-mono">{os.soldado || os.warName || 'Cliente'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls: Imprimir Comprovante (PDF) e WhatsApp */}
        <div className="mt-5 pt-4 border-t border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-3 print:hidden">
          <div className="flex items-center space-x-2 text-xs text-zinc-400">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Comprovante pronto para impressão ou salvar como PDF</span>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {os.phone && (
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/40 font-bold px-3.5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition flex items-center justify-center space-x-1.5 cursor-pointer"
                title="Abrir WhatsApp do Militar"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            )}

            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-amber-500/15"
              title="Imprimir esta ficha em formato de comprovante"
            >
              <Printer className="w-4 h-4" />
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
    </div>
  );
};
