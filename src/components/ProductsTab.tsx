import React, { useState } from 'react';
import { Search, Plus, RefreshCw, Edit3, Trash2, PackagePlus, AlertTriangle, MapPin, Box, ShieldCheck, Flame } from 'lucide-react';
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

  const lowStockCount = products.filter((p) => Number(p.stock) <= Number(p.minStock)).length;
  const totalStockCount = products.reduce((acc, p) => acc + Number(p.stock), 0);

  return (
    <div className="space-y-4">
      {/* Top Banner Stats */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-tactical uppercase tracking-wider flex items-center gap-2">
              <span>Arsenal e Estoque de Equipamentos</span>
            </h2>
            <p className="text-xs text-zinc-400">
              {products.length} itens cadastrados • Total de {totalStockCount} unidades em estoque
            </p>
          </div>
        </div>

        {lowStockCount > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 px-3.5 py-2 rounded-xl flex items-center space-x-2 shrink-0">
            <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-xs font-bold text-amber-400 font-mono">
              {lowStockCount} {lowStockCount === 1 ? 'item com estoque crítico' : 'itens com estoque crítico'}
            </span>
          </div>
        )}
      </div>

      {/* Filter Bar & View Toggle */}
      <div className="bg-tactical-card border border-zinc-800 p-4 rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-3">
        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar equipamento, farda, coturno, tático..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 placeholder-zinc-500 font-mono"
          />
        </div>

        <div className="flex flex-wrap items-center space-x-2 w-full lg:w-auto justify-end gap-y-2">
          {/* Categories */}
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

          {/* Status */}
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
              className="bg-zinc-800 hover:bg-zinc-700 text-amber-400 border border-amber-500/30 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center space-x-1.5 shrink-0 cursor-pointer"
            >
              <PackagePlus className="w-4 h-4" />
              <span>+ Entrada</span>
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

      {/* Equipment Display: GRID (Cards Dashboard) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full bg-tactical-card border border-zinc-800 rounded-2xl p-12 text-center text-zinc-500 font-mono">
              Nenhum equipamento encontrado no arsenal.
            </div>
          ) : (
            filteredProducts.map((p) => {
              const isOutOfStock = Number(p.stock) <= 0;
              const isLowStock = Number(p.stock) <= Number(p.minStock) && !isOutOfStock;

              return (
                <div
                  key={p.id}
                  className={`bg-tactical-card border ${
                    isOutOfStock
                      ? 'border-rose-900/40 bg-zinc-950/60'
                      : isLowStock
                      ? 'border-amber-500/50 bg-amber-500/5'
                      : 'border-zinc-800 hover:border-amber-500/60'
                  } p-4 rounded-2xl transition flex flex-col justify-between space-y-3 group shadow-lg`}
                >
                  <div className="space-y-2.5">
                    {/* Stock Badges */}
                    <div className="flex justify-end items-center gap-1">
                      <span
                        className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full flex items-center space-x-1 ${
                          isOutOfStock
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : isLowStock
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {isLowStock && <AlertTriangle className="w-3 h-3" />}
                        <span>
                          {isOutOfStock
                            ? 'Esgotado'
                            : isLowStock
                            ? `Crítico (${p.stock})`
                            : `${p.stock} em estoque`}
                        </span>
                      </span>
                    </div>

                    {/* Product Name & Size */}
                    <div>
                      <h4 className="font-bold text-zinc-100 text-sm leading-snug group-hover:text-amber-400 transition flex items-start justify-between gap-1.5">
                        <span>{p.name}</span>
                        {p.size && (
                          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-1.5 py-0.2 rounded text-[10px] font-mono shrink-0 font-bold">
                            Tam: {p.size}
                          </span>
                        )}
                      </h4>
                      {p.description && (
                        <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">{p.description}</p>
                      )}
                    </div>

                    {/* Category Badge */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      <span className="bg-zinc-950 text-zinc-300 px-2 py-0.5 rounded border border-zinc-800 font-medium">
                        {p.category}
                      </span>
                    </div>
                  </div>

                  {/* Financial Info & Action Buttons */}
                  <div className="pt-2 border-t border-zinc-800/80 space-y-2.5">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <div>
                        <span className="text-[10px] text-zinc-500 block">Custo</span>
                        <span className="text-zinc-400">{formatBRL(p.costPrice)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-zinc-500 block">Venda</span>
                        <span className="font-bold text-emerald-400 text-sm">{formatBRL(p.salePrice)}</span>
                      </div>
                    </div>

                    {!isOperator && (
                      <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-zinc-800/60">
                        <button
                          onClick={() => handleAdjustStock(p.id)}
                          className="flex-1 bg-zinc-950 hover:bg-zinc-800 text-amber-400 border border-zinc-800 hover:border-amber-500/40 py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center space-x-1 transition cursor-pointer"
                          title="Ajustar Estoque"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Ajustar</span>
                        </button>
                        <button
                          onClick={() => handleCreateOrEditProduct(p.id)}
                          className="p-1.5 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg transition cursor-pointer hover:border-zinc-700"
                          title="Editar Equipamento"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProductCheck(p.id)}
                          className="p-1.5 bg-zinc-950 hover:bg-zinc-800 text-rose-400 border border-zinc-800 rounded-lg transition cursor-pointer hover:border-rose-900/40"
                          title="Excluir Equipamento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
    </div>
  );
};
