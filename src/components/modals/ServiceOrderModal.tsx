import React, { useState, useEffect } from 'react';
import { X, Wrench, Calendar, Plus, Trash2, Search, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ServiceOrder, Product, OsItem, OsPriority, OsStatus } from '../../types';
import { MILITARY_FORCES, SERVICE_TYPES, BLOOD_TYPES } from '../../data/initialData';
import { formatBRL } from '../../utils/formatters';

interface ServiceOrderModalProps {
  isOpen: boolean;
  editingOs: ServiceOrder | null;
  products: Product[];
  existingOrders: ServiceOrder[];
  onClose: () => void;
  onSave: (data: Omit<ServiceOrder, 'id' | 'date'> & { id?: string; date?: string }) => void;
}

export const ServiceOrderModal: React.FC<ServiceOrderModalProps> = ({
  isOpen,
  editingOs,
  products = [],
  existingOrders = [],
  onClose,
  onSave,
}) => {
  const [osNumber, setOsNumber] = useState('');
  const [soldado, setSoldado] = useState('');
  const [bloodType, setBloodType] = useState('O+');
  const [force, setForce] = useState(MILITARY_FORCES[0]);
  const [phone, setPhone] = useState('');
  const [battalion, setBattalion] = useState('');
  const [osDate, setOsDate] = useState(() => new Date().toISOString().slice(0, 10));

  const [serviceType, setServiceType] = useState(SERVICE_TYPES[0]);
  const [itemDescription, setItemDescription] = useState('');
  const [specifications, setSpecifications] = useState('');
  const [priority, setPriority] = useState<OsPriority>('NORMAL');
  const [value, setValue] = useState('');
  const [deposit, setDeposit] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Pix Tático');
  const [status, setStatus] = useState<OsStatus>('NOVO');
  const [notes, setNotes] = useState('');

  // Items selection state inside OS creation
  const [osItems, setOsItems] = useState<OsItem[]>([]);
  const [prodSearch, setProdSearch] = useState('');
  const [selectedProdId, setSelectedProdId] = useState('');
  const [selectedProdQty, setSelectedProdQty] = useState(1);
  const [itemError, setItemError] = useState('');

  // Generate next sequential OS number e.g. OS-000003
  const generateNextOsNumber = () => {
    let maxNum = 0;
    (existingOrders || []).forEach((o) => {
      const match = o.id.match(/OS-(\d+)/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    const next = maxNum + 1;
    return `OS-${next.toString().padStart(6, '0')}`;
  };

  useEffect(() => {
    if (editingOs) {
      setOsNumber(editingOs.id);
      setOsDate(editingOs.date ? editingOs.date.slice(0, 10) : new Date().toISOString().slice(0, 10));
      setSoldado(editingOs.soldado || editingOs.warName || '');
      setBloodType(editingOs.bloodType || 'O+');
      setForce(editingOs.force || MILITARY_FORCES[0]);
      setPhone(editingOs.phone || '');
      setBattalion(editingOs.battalion || '');
      setServiceType(editingOs.serviceType || SERVICE_TYPES[0]);
      setItemDescription(editingOs.itemDescription || '');
      setSpecifications(editingOs.specifications || '');
      setPriority(editingOs.priority || 'NORMAL');
      setValue(editingOs.value.toString());
      setDeposit(editingOs.deposit.toString());
      setPaymentMethod(editingOs.paymentMethod || 'Pix Tático');
      setStatus(editingOs.status || 'NOVO');
      setNotes(editingOs.notes || '');
      setOsItems(editingOs.items || []);
    } else {
      setOsNumber(generateNextOsNumber());
      setOsDate(new Date().toISOString().slice(0, 10));
      setSoldado('');
      setBloodType('O+');
      setForce(MILITARY_FORCES[0]);
      setPhone('');
      setBattalion('');
      setServiceType(SERVICE_TYPES[0]);
      setItemDescription('');
      setSpecifications('');
      setPriority('NORMAL');
      setValue('');
      setDeposit('');
      setPaymentMethod('Pix Tático');
      setStatus('NOVO');
      setNotes('');
      setOsItems([]);
    }
    setItemError('');
    setProdSearch('');
    setSelectedProdId('');
    setSelectedProdQty(1);
  }, [editingOs, isOpen]);

  if (!isOpen) return null;

  const filteredCatalog = products.filter(
    (p) =>
      p.name.toLowerCase().includes(prodSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(prodSearch.toLowerCase()) ||
      (p.code && p.code.toLowerCase().includes(prodSearch.toLowerCase())) ||
      p.category.toLowerCase().includes(prodSearch.toLowerCase())
  );

  const selectedProd = products.find((p) => p.id === selectedProdId);

  const handleAddItemToOs = () => {
    setItemError('');
    if (!selectedProd) return;

    if (selectedProdQty <= 0) {
      setItemError('Selecione uma quantidade válida.');
      return;
    }

    if (selectedProdQty > selectedProd.stock) {
      setItemError(`Quantidade superior ao estoque disponível (${selectedProd.stock} un disponíveis).`);
      return;
    }

    // Check if already in items
    const existingIndex = osItems.findIndex((it) => it.productId === selectedProd.id);
    if (existingIndex >= 0) {
      const currentQty = osItems[existingIndex].qty;
      const newTotal = currentQty + selectedProdQty;
      if (newTotal > selectedProd.stock) {
        setItemError(`Quantidade superior ao estoque disponível (${selectedProd.stock} un disponíveis).`);
        return;
      }
      const updated = [...osItems];
      updated[existingIndex].qty = newTotal;
      setOsItems(updated);
    } else {
      setOsItems([
        ...osItems,
        {
          productId: selectedProd.id,
          sku: selectedProd.sku,
          name: selectedProd.name,
          qty: selectedProdQty,
          unitPrice: selectedProd.salePrice,
        },
      ]);
    }

    // Recalculate auto total value
    const itemsTotal = [...osItems, { productId: selectedProd.id, qty: selectedProdQty, unitPrice: selectedProd.salePrice }].reduce(
      (acc, it) => acc + (it.qty || 1) * (it.unitPrice || 0),
      0
    );
    if (!value || parseFloat(value) === 0) {
      setValue(itemsTotal.toFixed(2));
    }

    setSelectedProdId('');
    setSelectedProdQty(1);
    setProdSearch('');
  };

  const handleRemoveOsItem = (productId: string) => {
    setOsItems(osItems.filter((i) => i.productId !== productId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!soldado.trim()) {
      alert('Por favor, informe o nome do Soldado.');
      return;
    }

    const valNum = parseFloat(value) || 0;
    const depNum = parseFloat(deposit) || 0;

    onSave({
      id: osNumber,
      date: new Date(osDate).toISOString(),
      soldado: soldado.trim(),
      re: '',
      cpf: '',
      bloodType: bloodType.trim(),
      force,
      phone: phone.trim(),
      battalion: battalion.trim(),
      serviceType,
      itemDescription: itemDescription.trim() || 'Serviço e Equipamentos Táticos',
      specifications: specifications.trim(),
      items: osItems,
      value: valNum,
      deposit: depNum,
      paymentMethod,
      priority,
      status,
      notes: notes.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl my-auto">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between sticky top-0 bg-zinc-900/95 backdrop-blur z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg font-tactical tracking-wider">
                {editingOs ? `EDITAR ORDEM DE SERVIÇO #${osNumber}` : `NOVA OS - ${osNumber}`}
              </h2>
              <p className="text-xs text-zinc-400">Emissão e controle de Ordens de Serviço Táticas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6">
          {/* OS Header Bar: Number + Date + Priority */}
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1 font-tactical">
                Número da OS (Sequencial)
              </label>
              <input
                type="text"
                value={osNumber}
                readOnly
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs font-mono font-bold text-amber-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 font-tactical">
                Data de Emissão
              </label>
              <input
                type="date"
                required
                value={osDate}
                onChange={(e) => setOsDate(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 font-tactical">
                Prioridade da OS
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as OsPriority)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:border-amber-500 font-bold"
              >
                <option value="NORMAL">Normal</option>
                <option value="ALTA">Alta</option>
                <option value="URGENTE">Urgente</option>
              </select>
            </div>
          </div>

          {/* Solicitante Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
              <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-tactical">
                1. DADOS DO CLIENTE / MILITAR
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-amber-400 uppercase mb-1">Soldado (Nome) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Sd Silva / João"
                  value={soldado}
                  onChange={(e) => setSoldado(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-zinc-400 uppercase mb-1">Tipo Sanguíneo *</label>
                <select
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 font-mono cursor-pointer"
                >
                  {BLOOD_TYPES.map((bt) => (
                    <option key={bt} value={bt}>{bt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-zinc-400 uppercase mb-1">Corporação / Força</label>
                <select
                  value={force}
                  onChange={(e) => setForce(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500"
                >
                  {MILITARY_FORCES.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-zinc-400 uppercase mb-1">WhatsApp / Telefone</label>
                <input
                  type="text"
                  placeholder="(11) 98888-1234"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-zinc-400 uppercase mb-1">Batalhão / Setor</label>
                <input
                  type="text"
                  placeholder="Ex: 12º BPM / 2ª Cia"
                  value={battalion}
                  onChange={(e) => setBattalion(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[10px] font-bold text-amber-400 uppercase mb-1">Especificações de Bordado / Ficha</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Bordar tarjeta SILVA na cor Amarelo Ouro + Aplicar tipo sanguíneo O+ emborrachado na gandola..."
                  value={specifications}
                  onChange={(e) => setSpecifications(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Section 2: Adicionar Produtos do Arsenal à OS */}
          <div className="space-y-3 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-tactical flex items-center justify-between">
              <span>2. ADICIONAR PRODUTOS DO ARSENAL À OS</span>
              <span className="text-[10px] text-zinc-400 font-normal font-sans">Pesquisa e adição com trava de estoque</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
              <div className="sm:col-span-6 space-y-1">
                <label className="block text-[10px] font-semibold text-zinc-400 uppercase">
                  🔎 Pesquisar Produto (Nome, SKU, Código, Categoria)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={prodSearch}
                    onChange={(e) => setProdSearch(e.target.value)}
                    placeholder="Digite para filtrar equipamentos..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:border-amber-500 font-mono"
                  />
                </div>
                <select
                  value={selectedProdId}
                  onChange={(e) => setSelectedProdId(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-xs text-zinc-200 focus:border-amber-500"
                >
                  <option value="">-- Selecionar Equipamento do Resultado --</option>
                  {filteredCatalog.map((p) => (
                    <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                      {p.name} (SKU: {p.sku} | Estoque: {p.stock} un | {formatBRL(p.salePrice)})
                    </option>
                  ))}
                </select>
              </div>

              {selectedProd && (
                <div className="sm:col-span-3 space-y-1 bg-zinc-900 p-2 rounded-lg border border-zinc-800 text-[11px] font-mono">
                  <div className="text-zinc-400 uppercase text-[9px]">Estoque Disponível:</div>
                  <div className="font-bold text-emerald-400">{selectedProd.stock} unidades</div>
                  <div className="text-zinc-500 text-[9px]">{formatBRL(selectedProd.salePrice)} un</div>
                </div>
              )}

              <div className="sm:col-span-3 space-y-1">
                <label className="block text-[10px] font-semibold text-zinc-400 uppercase">Quantidade</label>
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => setSelectedProdQty(Math.max(1, selectedProdQty - 1))}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white w-8 h-8 rounded-lg font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={selectedProdQty}
                    onChange={(e) => setSelectedProdQty(parseInt(e.target.value, 10) || 1)}
                    className="w-12 bg-zinc-900 border border-zinc-800 rounded-lg p-1.5 text-center text-xs font-bold text-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setSelectedProdQty(selectedProdQty + 1)}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white w-8 h-8 rounded-lg font-bold cursor-pointer"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={handleAddItemToOs}
                    disabled={!selectedProd}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-bold h-8 rounded-lg text-xs uppercase cursor-pointer disabled:opacity-40 transition"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>

            {itemError && (
              <div className="p-2.5 bg-rose-500/20 border border-rose-500/40 rounded-lg text-rose-300 text-xs font-bold flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{itemError}</span>
              </div>
            )}

            {/* Added Items List */}
            {osItems.length > 0 && (
              <div className="mt-3 border-t border-zinc-800/80 pt-3 space-y-2">
                <span className="text-[11px] font-bold text-zinc-300 uppercase block font-mono">
                  Lista de Produtos Adicionados à OS:
                </span>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-500 text-[10px] uppercase font-mono">
                        <th className="pb-2">PRODUTO</th>
                        <th className="pb-2 text-center">QUANTIDADE</th>
                        <th className="pb-2 text-right">VALOR UN.</th>
                        <th className="pb-2 text-right">AÇÃO</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 font-mono">
                      {osItems.map((item) => (
                        <tr key={item.productId} className="text-zinc-200">
                          <td className="py-2 font-bold">{item.name}</td>
                          <td className="py-2 text-center font-bold text-emerald-400">{item.qty} un</td>
                          <td className="py-2 text-right text-zinc-400">{formatBRL(item.unitPrice || 0)}</td>
                          <td className="py-2 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveOsItem(item.productId)}
                              className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                              title="Remover produto da OS"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Observação, Valores e Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-semibold text-zinc-400 uppercase mb-1">
                  Tipo de Serviço Principal / Titular
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 font-bold"
                >
                  {SERVICE_TYPES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-zinc-400 uppercase mb-1">
                  Material Deixado pelo Cliente
                </label>
                <input
                  type="text"
                  placeholder="Ex: 2x Gandolas PMESP + 1x Japona"
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-zinc-400 uppercase mb-1">Observações do Pedido</label>
                <textarea
                  rows={2}
                  placeholder="Escreva observações ou orientações para a produção..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-500"
                ></textarea>
              </div>
            </div>

            <div className="space-y-3 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-tactical">
                Financeiro & Status da OS
              </h4>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-amber-400 uppercase mb-1">Valor Total (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-sm text-amber-400 font-bold font-mono focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-emerald-400 uppercase mb-1">Sinal Pago (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={deposit}
                    onChange={(e) => setDeposit(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-sm text-emerald-400 font-bold font-mono focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-zinc-400 uppercase mb-1">Status da OS</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as OsStatus)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white font-bold cursor-pointer"
                >
                  <option value="NOVO">🟡 NOVO</option>
                  <option value="EM_SEPARACAO">🔵 EM SEPARAÇÃO</option>
                  <option value="SEPARADO">🟣 SEPARADO</option>
                  <option value="ENTREGUE">🟠 ENTREGUE</option>
                  <option value="CONCLUIDO">🟢 CONCLUÍDO (Dar Baixa no Estoque)</option>
                  <option value="CANCELADO">🔴 CANCELADO</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-zinc-400 uppercase mb-1">Forma de Pagamento</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="Pix Tático">Pix Tático</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Cartão de Débito">Cartão de Débito</option>
                  <option value="Dinheiro Espécie">Dinheiro Espécie</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs font-semibold uppercase tracking-wider cursor-pointer transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/10 cursor-pointer flex items-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{editingOs ? 'Salvar OS' : 'Gerar Ordem de Serviço'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

