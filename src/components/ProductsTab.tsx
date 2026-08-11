import React, { useState } from 'react';
import { Search, Plus, RefreshCw, Edit3, Trash2, PackagePlus, AlertTriangle, MapPin } from 'lucide-react';
import { Product, UserPermission } from '../types';
import { formatBRL } from '../utils/formatters';

interface ProductsTabProps {
  products: Product[];
  activeUser?: UserPermission;
  onOpenProductModal: (id?: string) => void;
  onOpenAdjustModal: (id: string) => void;
  onOpenStockEntryModal?: () => void;
  onDeleteProduct: (id: string) => void;
  onShowToast?: (msg: string) => void;
}

export const ProductsTab: React.FC<ProductsTabProps> = ({
  products,
  activeUser,
  onOpenProductModal,
  onOpenAdjustModal,
  onOpenStockEntryModal,
  onDeleteProduct,
  onShowToast,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const isOperator = activeUser?.role === 'OPERADOR';

  const handleCreateOrEditProduct = (id?: string) => {
    if (isOperator) {
      if (onShowToast) {
        onShowToast(`⛔ Ação Recusada: O cargo OPERADOR (${activeUser?.name}) não possui autorização para cadastrar ou editar produtos.`);
      }
      return;
    }
    onOpenProductModal(id);
  };

  const handleAdjustStock = (id: string) => {
    if (isOperator) {
      if (onShowToast) {
        onShowToast(`⛔ Ação Recusada: O cargo OPERADOR (${activeUser?.name}) não possui permissão para ajustar estoque manualmente.`);
      }
      return;
    }
    onOpenAdjustModal(id);
  };

  const handleDeleteProductCheck = (id: string) => {
    if (isOperator) {
      if (onShowToast) {
        onShowToast(`⛔ Ação Recusada: O cargo OPERADOR (${activeUser?.name}) não possui autorização para excluir produtos do arsenal.`);
      }
      return;
    }
    onDeleteProduct(id);
  };

  const filteredProducts = products.filter((p) => {
    const query = search.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(query) ||
      p.sku.toLowerCase().includes(query) ||
      (p.code && p.code.toLowerCase().includes(query)) ||
      (p.supplier && p.supplier.toLowerCase().includes(query)) ||
      (p.location && p.location.toLowerCase().includes(query));

    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;

    let matchesStatus = true;
    if (statusFilter === 'LOW') matchesStatus = Number(p.stock) <= Number(p.minStock) && Number(p.stock) > 0;
    if (statusFilter === 'OUT') matchesStatus = Number(p.stock) === 0;
    if (statusFilter === 'OK') matchesStatus = Number(p.stock) > Number(p.minStock);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="bg-tactical-card border border-zinc-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por equipamento, SKU, código, localização..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 placeholder-zinc-500 font-mono"
          />
        </div>

        <div className="flex flex-wrap items-center space-x-2 w-full sm:w-auto justify-end gap-y-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="ALL">Todas as Categorias</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="ALL">Todos os Status</option>
            <option value="LOW">⚠️ Estoque Crítico</option>
            <option value="OK">Estoque Normal</option>
            <option value="OUT">Esgotado</option>
          </select>

          {onOpenStockEntryModal && !isOperator && (
            <button
              onClick={onOpenStockEntryModal}
              className="bg-zinc-800 hover:bg-zinc-700 text-amber-400 border border-amber-500/30 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center space-x-1.5 shrink-0 cursor-pointer"
            >
              <PackagePlus className="w-4 h-4" />
              <span>+ Entrada Estoque</span>
            </button>
          )}

          {!isOperator && (
            <button
              onClick={() => handleCreateOrEditProduct()}
              className="bg-amber-500 hover:bg-amber-400 text-black px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center space-x-1.5 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Novo Produto</span>
            </button>
          )}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-tactical-card border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 uppercase text-[10px] tracking-wider font-tactical">
              <tr>
                <th className="p-4 font-semibold">Equipamento Tático</th>
                <th className="p-4 font-semibold">Localização</th>
                <th className="p-4 font-semibold">Categoria</th>
                <th className="p-4 font-semibold text-right">Custo (R$)</th>
                <th className="p-4 font-semibold text-right">Venda (R$)</th>
                <th className="p-4 font-semibold text-center">Quantidade</th>
                <th className="p-4 font-semibold text-center">Status</th>
                {!isOperator && <th className="p-4 font-semibold text-center">Ações</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-zinc-500 font-mono">
                    Nenhum equipamento encontrado no arsenal.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  let statusBadge = (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                      Normal
                    </span>
                  );
                  if (Number(p.stock) === 0) {
                    statusBadge = (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 font-mono">
                        Esgotado
                      </span>
                    );
                  } else if (Number(p.stock) <= Number(p.minStock)) {
                    statusBadge = (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono flex items-center justify-center space-x-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Estoque Crítico</span>
                      </span>
                    );
                  }

                  return (
                    <tr key={p.id} className="hover:bg-zinc-900/60 transition">
                      <td className="p-4 font-medium text-zinc-100">
                        <div className="font-bold text-zinc-200">{p.name}</div>
                        <div className="text-[11px] text-zinc-500 font-mono">
                          SKU: {p.sku} {p.code ? `• Cód: ${p.code}` : ''} {p.supplier ? '• ' + p.supplier : ''}
                        </div>
                      </td>
                      <td className="p-4 text-zinc-400 font-mono text-[11px]">
                        <span className="inline-flex items-center space-x-1 text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                          <MapPin className="w-3 h-3 text-amber-500" />
                          <span>{p.location || 'Arsenal General'}</span>
                        </span>
                      </td>
                      <td className="p-4 text-zinc-400">
                        <span className="bg-zinc-900 px-2.5 py-1 rounded-lg text-xs font-medium border border-zinc-800">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-4 text-right font-mono text-zinc-400">{formatBRL(p.costPrice)}</td>
                      <td className="p-4 text-right font-mono text-emerald-400 font-bold">{formatBRL(p.salePrice)}</td>
                      <td className="p-4 text-center">
                        <span className="font-bold text-zinc-100 text-sm font-mono">{p.stock}</span>
                        <span className="text-[10px] text-zinc-500 block font-mono">Mín: {p.minStock}</span>
                      </td>
                      <td className="p-4 text-center">{statusBadge}</td>
                      {!isOperator && (
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center space-x-1.5">
                            <button
                              onClick={() => handleAdjustStock(p.id)}
                              title="Ajustar Estoque"
                              className="p-1.5 rounded-lg transition cursor-pointer hover:bg-zinc-800 text-amber-400"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleCreateOrEditProduct(p.id)}
                              title="Editar Equipamento"
                              className="p-1.5 rounded-lg transition cursor-pointer hover:bg-zinc-800 text-zinc-300"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProductCheck(p.id)}
                              title="Excluir Equipamento"
                              className="p-1.5 rounded-lg transition cursor-pointer hover:bg-zinc-800 text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

