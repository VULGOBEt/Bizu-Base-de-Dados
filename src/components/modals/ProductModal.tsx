import React, { useState, useEffect } from 'react';
import { X, Tag } from 'lucide-react';
import { Product } from '../../types';
import { PRODUCT_CATEGORIES } from '../../data/initialData';

interface ProductModalProps {
  isOpen: boolean;
  editingProduct?: Product | null;
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id'> & { id?: string }) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  editingProduct,
  onClose,
  onSave,
}) => {
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState(PRODUCT_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [size, setSize] = useState('');
  const [name, setName] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [stock, setStock] = useState('');
  const [minStock, setMinStock] = useState('3');
  const [supplier, setSupplier] = useState('');

  useEffect(() => {
    if (editingProduct) {
      setSku(editingProduct.sku);
      if (PRODUCT_CATEGORIES.includes(editingProduct.category)) {
        setCategory(editingProduct.category);
        setCustomCategory('');
      } else {
        setCategory('Outros / Personalizado');
        setCustomCategory(editingProduct.category);
      }
      setSize(editingProduct.size || '');
      setName(editingProduct.name);
      setCostPrice(editingProduct.costPrice.toString());
      setSalePrice(editingProduct.salePrice.toString());
      setStock(editingProduct.stock.toString());
      setMinStock(editingProduct.minStock.toString());
      setSupplier(editingProduct.supplier || '');
    } else {
      setSku('TAC-' + Math.floor(100 + Math.random() * 900));
      setCategory(PRODUCT_CATEGORIES[0]);
      setCustomCategory('');
      setSize('');
      setName('');
      setCostPrice('');
      setSalePrice('');
      setStock('');
      setMinStock('3');
      setSupplier('');
    }
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const actualCategory = category === 'Outros / Personalizado' ? customCategory : category;

  // Sizes suggestion per category type
  const isPants = actualCategory.toLowerCase().includes('calça') || actualCategory.toLowerCase().includes('bermuda');
  const isFootwear = actualCategory.toLowerCase().includes('calçado') || actualCategory.toLowerCase().includes('coturno') || actualCategory.toLowerCase().includes('bota');
  const isShirtOrFarda = actualCategory.toLowerCase().includes('farda') || actualCategory.toLowerCase().includes('vestuário') || actualCategory.toLowerCase().includes('camisa') || actualCategory.toLowerCase().includes('gandola');
  const isBeltOrVest = actualCategory.toLowerCase().includes('coleter') || actualCategory.toLowerCase().includes('cinto') || actualCategory.toLowerCase().includes('porta-placas');

  const letterSizes = ['P', 'M', 'G', 'GG', 'XGG', 'EXG'];
  const pantsSizes = ['36', '38', '40', '42', '44', '46', '48', '50', '52', '54'];
  const shoeSizes = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];
  const beltSizes = ['P', 'M', 'G', 'GG', '80cm', '90cm', '100cm', '110cm', '120cm', 'Único'];

  let activeQuickSizes: string[] = [];
  if (isPants) activeQuickSizes = pantsSizes;
  else if (isFootwear) activeQuickSizes = shoeSizes;
  else if (isShirtOrFarda) activeQuickSizes = letterSizes;
  else if (isBeltOrVest) activeQuickSizes = beltSizes;
  else activeQuickSizes = letterSizes;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actualCategory.trim()) {
      alert('Por favor, informe a categoria.');
      return;
    }
    onSave({
      id: editingProduct ? editingProduct.id : undefined,
      sku: sku.trim(),
      category: actualCategory.trim(),
      size: size.trim(),
      name: name.trim(),
      costPrice: parseFloat(costPrice) || 0,
      salePrice: parseFloat(salePrice) || 0,
      stock: parseInt(stock, 10) || 0,
      minStock: parseInt(minStock, 10) || 0,
      supplier: supplier.trim(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <h3 className="font-bold text-base text-zinc-100 font-tactical uppercase tracking-wider">
            {editingProduct ? 'Editar Equipamento Tático' : 'Cadastrar Equipamento Tático'}
          </h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[11px] font-semibold text-zinc-300 uppercase mb-1">Código SKU *</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Ex: TAC-101"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[11px] font-semibold text-zinc-300 uppercase mb-1">Categoria *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-medium cursor-pointer"
              >
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {category === 'Outros / Personalizado' && (
            <div>
              <label className="block text-[11px] font-semibold text-amber-400 uppercase mb-1">Nome da Categoria Personalizada *</label>
              <input
                type="text"
                required
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Digite a nova categoria ex: Lanternas, Lanternas Táticas"
                className="w-full bg-zinc-950 border border-amber-500/50 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>
          )}

          {/* Tamanho da Camisa / Calça / Coturno (Seleção Condicional) */}
          <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold text-amber-400 uppercase tracking-wider font-tactical flex items-center space-x-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-500" />
                <span>Tamanho / Numeração do Item</span>
              </label>
              {size && (
                <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                  Selecionado: {size}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="Ex: P, M, G, GG, 42, 44..."
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-mono font-bold"
              />
            </div>

            {/* Quick Size Select Buttons */}
            <div className="space-y-1 pt-1">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Atalhos rápidos para {actualCategory}:</span>
              <div className="flex flex-wrap gap-1.5">
                {activeQuickSizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition cursor-pointer font-mono ${
                      size === s
                        ? 'bg-amber-500 text-black border-amber-400 shadow-md'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-300 uppercase mb-1">Nome do Equipamento *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Coturno Tático Airstep Ripstop"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 uppercase mb-1">Preço de Custo (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                placeholder="0.00"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 uppercase mb-1">Preço de Venda (R$) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="0.00"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 uppercase mb-1">Qtde em Estoque *</label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="0"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 uppercase mb-1">Estoque Mínimo (Alerta) *</label>
              <input
                type="number"
                min="0"
                required
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
                placeholder="3"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-300 uppercase mb-1">Fornecedor / Fabricante</label>
            <input
              type="text"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              placeholder="Ex: Invictus, Airstep, Bélica"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="pt-3 flex items-center justify-end space-x-3 border-t border-zinc-800">
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
              Salvar Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
