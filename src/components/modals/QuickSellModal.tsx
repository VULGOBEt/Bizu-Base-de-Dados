import React, { useState, useEffect } from 'react';
import { Zap, X } from 'lucide-react';
import { Product } from '../../types';
import { formatBRL } from '../../utils/formatters';

interface QuickSellModalProps {
  isOpen: boolean;
  products: Product[];
  onClose: () => void;
  onExecute: (productId: string, qty: number, payment: string, reason: string) => void;
}

export const QuickSellModal: React.FC<QuickSellModalProps> = ({
  isOpen,
  products = [],
  onClose,
  onExecute,
}) => {
  const [selectedProdId, setSelectedProdId] = useState('');
  const [qty, setQty] = useState('1');
  const [payment, setPayment] = useState('Pix Tático');
  const [reason, setReason] = useState('');

  const availableProducts = (products || []).filter((p) => p.stock > 0);

  useEffect(() => {
    if (availableProducts.length > 0 && !selectedProdId) {
      setSelectedProdId(availableProducts[0].id);
    }
  }, [products, isOpen]);

  if (!isOpen) return null;

  const currentProd = products.find((p) => p.id === selectedProdId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProdId) return;

    onExecute(selectedProdId, parseInt(qty, 10) || 1, payment, reason.trim());
    setReason('');
    setQty('1');
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="font-bold text-zinc-100 flex items-center space-x-2 font-tactical uppercase text-sm">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Baixa Rápida de Equipamento</span>
          </h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-zinc-300 uppercase mb-1">
              Equipamento *
            </label>
            <select
              value={selectedProdId}
              onChange={(e) => setSelectedProdId(e.target.value)}
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                  {p.name} (Estoque: {p.stock})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 uppercase mb-1">
                Qtde Baixada *
              </label>
              <input
                type="number"
                min="1"
                required
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block font-mono">
                {currentProd
                  ? `Estoque: ${currentProd.stock} un | ${formatBRL(currentProd.salePrice)}`
                  : 'Sem estoque'}
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 uppercase mb-1">
                Pagamento
              </label>
              <select
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="Pix Tático">Pix Tático</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Cartão de Débito">Cartão de Débito</option>
                <option value="Dinheiro Espécie">Dinheiro Espécie</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-300 uppercase mb-1">
              Militar / Identificação
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: SD Silva / RE 123.456"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div className="pt-3 flex justify-end space-x-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white uppercase cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
            >
              Confirmar Baixa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
