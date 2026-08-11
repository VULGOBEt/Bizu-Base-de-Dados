import React, { useState, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { Product } from '../../types';

interface AdjustStockModalProps {
  isOpen: boolean;
  product?: Product | null;
  onClose: () => void;
  onConfirmAdjust: (productId: string, type: 'ADD' | 'REMOVE', qty: number, reason: string) => void;
}

export const AdjustStockModal: React.FC<AdjustStockModalProps> = ({
  isOpen,
  product,
  onClose,
  onConfirmAdjust,
}) => {
  const [type, setType] = useState<'ADD' | 'REMOVE'>('ADD');
  const [qty, setQty] = useState('1');
  const [reason, setReason] = useState('');

  useEffect(() => {
    setType('ADD');
    setQty('1');
    setReason('');
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = parseInt(qty, 10) || 1;
    onConfirmAdjust(product.id, type, q, reason.trim() || 'Ajuste manual');
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="font-bold text-zinc-100 flex items-center space-x-2 font-tactical uppercase text-sm">
            <RefreshCw className="w-4 h-4 text-amber-400" />
            <span>Ajuste / Reposição de Arsenal</span>
          </h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[10px] font-semibold text-zinc-400 uppercase mb-1">Equipamento</label>
            <input
              type="text"
              readOnly
              value={`${product.name} (Atual: ${product.stock} un)`}
              className="w-full bg-zinc-950 border border-zinc-800/80 rounded-xl px-3 py-2 text-xs text-zinc-400 cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-zinc-300 uppercase mb-1">Operação</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'ADD' | 'REMOVE')}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="ADD">Entrada (+ Reposição)</option>
                <option value="REMOVE">Saída (- Avaria / Baixa)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-zinc-300 uppercase mb-1">Quantidade *</label>
              <input
                type="number"
                min="1"
                required
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-zinc-300 uppercase mb-1">
              Motivo / Nota de Lote
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: NF 40521 / Lote do Fornecedor"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
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
              className="bg-amber-500 hover:bg-amber-400 text-black px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
            >
              Aplicar Ajuste
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
