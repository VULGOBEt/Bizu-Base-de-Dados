import React, { useState } from 'react';
import { PlusCircle, X, PackagePlus } from 'lucide-react';
import { Product } from '../../types';

interface StockEntryModalProps {
  isOpen: boolean;
  products: Product[];
  onClose: () => void;
  onExecuteEntry: (productId: string, qty: number, supplier: string, invoice: string, reason: string) => void;
}

export const StockEntryModal: React.FC<StockEntryModalProps> = ({
  isOpen,
  products,
  onClose,
  onExecuteEntry,
}) => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [qty, setQty] = useState('1');
  const [supplier, setSupplier] = useState('');
  const [invoice, setInvoice] = useState('');
  const [reason, setReason] = useState('Reposição de Fornecedor');

  if (!isOpen) return null;

  const currentProd = products.find((p) => p.id === selectedProductId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;

    const quantity = parseInt(qty, 10);
    if (!quantity || quantity <= 0) return;

    onExecuteEntry(
      selectedProductId,
      quantity,
      supplier.trim() || currentProd?.supplier || 'N/I',
      invoice.trim() || 'N/A',
      reason.trim() || 'Entrada manual de estoque'
    );

    setSelectedProductId('');
    setQty('1');
    setSupplier('');
    setInvoice('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-2xl shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="font-bold text-zinc-100 flex items-center space-x-2 font-tactical uppercase text-sm">
            <PackagePlus className="w-5 h-5 text-amber-500" />
            <span>+ Entrada de Estoque</span>
          </h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-zinc-300 uppercase mb-1">
              Selecione o Equipamento *
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => {
                setSelectedProductId(e.target.value);
                const p = products.find((prod) => prod.id === e.target.value);
                if (p && p.supplier) setSupplier(p.supplier);
              }}
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="">-- Selecionar Equipamento --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (SKU: {p.sku} | Estoque Atual: {p.stock} un)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 uppercase mb-1">
                Quantidade a Adicionar *
              </label>
              <input
                type="number"
                min="1"
                required
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-mono"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block font-mono">
                {currentProd ? `Novo Estoque: ${currentProd.stock + (parseInt(qty, 10) || 0)} un` : ''}
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 uppercase mb-1">
                Nota Fiscal / Doc.
              </label>
              <input
                type="text"
                placeholder="Ex: NF-10023"
                value={invoice}
                onChange={(e) => setInvoice(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 uppercase mb-1">
                Fornecedor / Origem
              </label>
              <input
                type="text"
                placeholder="Ex: Invictus / Bélica"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 uppercase mb-1">
                Motivo / Causa
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ex: Compra, Reposição, Devolução"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>
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
              className="bg-amber-500 hover:bg-amber-400 text-black px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center space-x-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Confirmar Entrada</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
