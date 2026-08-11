import React, { useState } from 'react';
import { Crosshair, Search, ShieldCheck, BadgeCheck, CheckCircle, Flame, PlusCircle, Tag } from 'lucide-react';
import { Product, CartItem, Order, UserPermission } from '../types';
import { MILITARY_FORCES, BLOOD_TYPES } from '../data/initialData';
import { formatBRL } from '../utils/formatters';

interface PosTabProps {
  products: Product[];
  cart: CartItem[];
  activeUser?: UserPermission;
  onAddToCart: (productId: string) => void;
  onUpdateCartQty: (productId: string, delta: number) => void;
  onClearCart: () => void;
  onConfirmOrder: (orderData: Omit<Order, 'id' | 'date' | 'items' | 'total'> & { subtotal?: number; discount?: number; total: number }) => void;
  onShowToast: (msg: string) => void;
}

export const PosTab: React.FC<PosTabProps> = ({
  products = [],
  cart = [],
  activeUser,
  onAddToCart,
  onUpdateCartQty,
  onClearCart,
  onConfirmOrder,
  onShowToast,
}) => {
  const [search, setSearch] = useState('');
  
  // Military Form state
  const [soldado, setSoldado] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodType, setBloodType] = useState('O+');
  const [force, setForce] = useState('Polícia Militar');
  const [battalion, setBattalion] = useState('');
  const [embroideryDetails, setEmbroideryDetails] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Pix Tático');
  const [orderType, setOrderType] = useState('Venda Direta');

  // Discount state
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [discountFixed, setDiscountFixed] = useState<number>(0);

  // Top selling products
  const bestSellers = products.slice(0, 4);

  const filteredCatalog = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleNewOrder = () => {
    onClearCart();
    setDiscountPercent(0);
    setDiscountFixed(0);
    setSoldado('');
    setPhone('');
    setBloodType('O+');
    setBattalion('');
    setEmbroideryDetails('');
    onShowToast('Novo pedido iniciado!');
  };

  const subtotal = cart.reduce((sum, item) => sum + item.qty * item.salePrice, 0);
  const percentDiscountValue = (subtotal * discountPercent) / 100;
  const totalDiscount = percentDiscountValue + discountFixed;
  const finalTotal = Math.max(0, subtotal - totalDiscount);

  const handleConfirm = () => {
    if (cart.length === 0) {
      onShowToast('Adicione pelo menos 1 equipamento ao pedido!');
      return;
    }

    if (!soldado.trim() || !bloodType.trim()) {
      onShowToast('Preencha os campos obrigatórios: Soldado e Tipo Sanguíneo!');
      return;
    }

    onConfirmOrder({
      soldado: soldado.trim(),
      re: '',
      cpf: '',
      phone: phone.trim(),
      bloodType: bloodType.trim(),
      force,
      battalion: battalion.trim() || 'Não Informado',
      paymentMethod,
      orderType,
      subtotal,
      discount: totalDiscount,
      total: finalTotal,
      specifications: embroideryDetails.trim(),
    });

    // Reset order
    handleNewOrder();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Catalog Selector */}
      <div className="lg:col-span-7 space-y-4">
        {/* Top Sellers Banner */}
        <div className="bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-900 border border-amber-500/30 p-3.5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 font-tactical uppercase tracking-wider flex items-center space-x-1.5">
              <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>🔥 Produtos Mais Vendidos no Arsenal</span>
            </span>
            <span className="text-[10px] text-zinc-400">Atalho rápido de inserção</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {bestSellers.map((p) => (
              <button
                key={p.id}
                onClick={() => onAddToCart(p.id)}
                className="bg-zinc-950/90 hover:bg-amber-500 hover:text-black border border-zinc-800 p-2 rounded-xl text-left transition group cursor-pointer space-y-0.5"
              >
                <p className="text-[11px] font-bold text-zinc-200 group-hover:text-black line-clamp-1">{p.name}</p>
                <p className="text-[10px] text-emerald-400 font-mono font-bold group-hover:text-black">{formatBRL(p.salePrice)}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-tactical-card border border-zinc-800 p-4 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-zinc-100 text-xs uppercase tracking-wider font-tactical flex items-center space-x-2">
              <Crosshair className="w-4 h-4 text-emerald-400" />
              <span>Seletor de Equipamentos do Arsenal</span>
            </h3>
            <span className="text-[11px] text-zinc-400">Clique no item para adicionar ao pedido</span>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filtrar por nome, SKU, farda, coturno, tático..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 placeholder-zinc-500 font-mono"
            />
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-1">
          {filteredCatalog.length === 0 ? (
            <div className="col-span-full py-8 text-center text-zinc-500 font-mono">
              Nenhum equipamento encontrado no catálogo tático.
            </div>
          ) : (
            filteredCatalog.map((p) => {
              const isOutOfStock = Number(p.stock) <= 0;
              return (
                <div
                  key={p.id}
                  onClick={() => !isOutOfStock && onAddToCart(p.id)}
                  className={`bg-tactical-card border ${
                    isOutOfStock
                      ? 'border-red-900/40 opacity-50 cursor-not-allowed'
                      : 'border-zinc-800 hover:border-amber-500/80 cursor-pointer'
                  } p-3.5 rounded-2xl transition space-y-2 group`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                      {p.sku}
                    </span>
                    <span
                      className={`text-[10px] font-semibold font-mono px-2 py-0.5 rounded ${
                        isOutOfStock ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {isOutOfStock ? 'Esgotado' : `${p.stock} em estoque`}
                    </span>
                  </div>
                  <h4 className="font-bold text-zinc-200 text-xs line-clamp-2 group-hover:text-amber-400 transition">
                    {p.name}
                  </h4>
                  <div className="flex justify-between items-center pt-1 border-t border-zinc-800/80">
                    <span className="text-[10px] text-zinc-400">{p.category}</span>
                    <span className="font-bold text-emerald-400 text-xs font-mono">{formatBRL(p.salePrice)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Shopping Cart & Military Order Profile Panel */}
      <div className="lg:col-span-5 bg-tactical-card border border-zinc-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-bold text-zinc-100 font-tactical flex items-center space-x-2 text-sm uppercase">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Resumo do Pedido Tático</span>
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleNewOrder}
                className="bg-emerald-600/20 hover:bg-emerald-600 hover:text-white text-emerald-400 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-emerald-500/40 transition flex items-center space-x-1 cursor-pointer uppercase"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Novo Pedido</span>
              </button>
              <button
                onClick={onClearCart}
                className="text-xs text-zinc-400 hover:text-red-400 transition font-mono cursor-pointer"
              >
                Limpar
              </button>
            </div>
          </div>

          {/* Cart List */}
          <div className="space-y-2.5 max-h-[170px] overflow-y-auto pr-1 divide-y divide-zinc-800/60">
            {cart.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-6 font-mono">Nenhum equipamento no pedido.</p>
            ) : (
              cart.map((item) => {
                const itemTotal = item.qty * item.salePrice;
                return (
                  <div key={item.productId} className="flex items-center justify-between py-1.5 text-xs">
                    <div className="space-y-0.5 max-w-[150px]">
                      <p className="font-bold text-zinc-200 line-clamp-1">{item.name}</p>
                      <p className="text-zinc-500 font-mono text-[10px]">{formatBRL(item.salePrice)} un</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1 bg-zinc-950 border border-zinc-800 rounded p-0.5 font-mono">
                        <button
                          onClick={() => onUpdateCartQty(item.productId, -1)}
                          className="w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-bold text-zinc-100 text-xs">{item.qty}</span>
                        <button
                          onClick={() => onUpdateCartQty(item.productId, 1)}
                          className="w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-bold text-amber-400 w-16 text-right font-mono">{formatBRL(itemTotal)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* MILITARY ORDER PROFILE SECTION */}
          <div className="bg-zinc-950/90 border border-zinc-800 p-3.5 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-tactical flex items-center space-x-1.5">
                <BadgeCheck className="w-4 h-4" />
                <span>Dados do Cliente / Pedido</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[10px] font-semibold text-zinc-400 uppercase mb-1">
                  Soldado (Nome) *
                </label>
                <input
                  type="text"
                  value={soldado}
                  onChange={(e) => setSoldado(e.target.value)}
                  placeholder="Ex: Sd Silva / João"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-zinc-400 uppercase mb-1">
                  Contato (WhatsApp)
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 98888-1234"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-zinc-400 uppercase mb-1">
                  Tipo Sanguíneo *
                </label>
                <select
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-mono cursor-pointer"
                >
                  {BLOOD_TYPES.map((bt) => (
                    <option key={bt} value={bt}>
                      {bt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-zinc-400 uppercase mb-1">
                  Corporação / Força
                </label>
                <select
                  value={force}
                  onChange={(e) => setForce(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {MILITARY_FORCES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-semibold text-zinc-400 uppercase mb-1">
                  Unidade / Batalhão
                </label>
                <input
                  type="text"
                  value={battalion}
                  onChange={(e) => setBattalion(e.target.value)}
                  placeholder="Ex: 12º BPM / 2ª Cia"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-amber-400 uppercase mb-1">
                  Especificações de Bordado
                </label>
                <textarea
                  rows={2}
                  value={embroideryDetails}
                  onChange={(e) => setEmbroideryDetails(e.target.value)}
                  placeholder="Ex: Bordar tarjeta SILVA na cor Amarelo Ouro + Aplicar velcro na manga..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>
            </div>
          </div>

          {/* DESCONTO E CONVÊNIO MILITAR */}
          <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-amber-400 uppercase tracking-wider">
              <span className="flex items-center space-x-1">
                <Tag className="w-3.5 h-3.5 text-amber-500" />
                <span>Desconto / Convênio Militar</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                {totalDiscount > 0 ? `-${formatBRL(totalDiscount)}` : 'Sem Desconto'}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {[0, 5, 10, 15].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => {
                    setDiscountPercent(pct);
                    setDiscountFixed(0);
                  }}
                  className={`py-1 text-[11px] font-bold rounded-lg border cursor-pointer transition ${
                    discountPercent === pct && discountFixed === 0
                      ? 'bg-amber-500 text-black border-amber-400'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  {pct === 0 ? 'Sem Desconto' : `${pct}% Off`}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <span className="text-[10px] text-zinc-400 uppercase shrink-0 font-semibold">Valor Fixo (R$):</span>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="0.00"
                value={discountFixed || ''}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setDiscountFixed(val);
                  setDiscountPercent(0);
                }}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-amber-400 font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Payment & Type */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-semibold text-zinc-400 uppercase mb-1">
                Forma de Pagamento
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="Pix Tático">Pix Tático</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Cartão de Débito">Cartão de Débito</option>
                <option value="Dinheiro">Dinheiro Espécie</option>
                <option value="Cautela / Faturado">Cautela Operacional</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-zinc-400 uppercase mb-1">
                Tipo de Pedido
              </label>
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="Venda Direta">Venda Direta</option>
                <option value="Equipamento de Cautela">Cautela de Equipamento</option>
                <option value="Encomenda Especial">Encomenda Especial</option>
                <option value="Reserva Tática">Reserva Tática</option>
              </select>
            </div>
          </div>
        </div>

        {/* Totals & Confirmation */}
        <div className="space-y-3 pt-3 border-t border-zinc-800">
          <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800 space-y-1">
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Subtotal Equipamentos:</span>
              <span className="font-mono">{formatBRL(subtotal)}</span>
            </div>
            {totalDiscount > 0 && (
              <div className="flex justify-between text-xs text-rose-400 font-semibold">
                <span>Desconto / Abatimento:</span>
                <span className="font-mono">-{formatBRL(totalDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-amber-400 font-tactical pt-1 border-t border-zinc-800/80">
              <span>Total Final do Pedido:</span>
              <span className="font-mono text-emerald-400">{formatBRL(finalTotal)}</span>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center space-x-2 text-xs uppercase tracking-wider cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Confirmar e Processar Baixa</span>
          </button>
        </div>
      </div>
    </div>
  );
};

