import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { MilitaryProfile } from '../../types';
import { MILITARY_FORCES, MILITARY_RANKS } from '../../data/initialData';

interface MilitaryProfileModalProps {
  isOpen: boolean;
  editingProfile?: MilitaryProfile | null;
  existingProfiles?: MilitaryProfile[];
  onClose: () => void;
  onSave: (data: Omit<MilitaryProfile, 'id'> & { id?: string }) => void;
}

export const MilitaryProfileModal: React.FC<MilitaryProfileModalProps> = ({
  isOpen,
  editingProfile,
  existingProfiles = [],
  onClose,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'contato' | 'bordado'>('contato');
  const [fullName, setFullName] = useState('');
  const [re, setRe] = useState('');
  const [sector, setSector] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'ATIVO' | 'INATIVO'>('ATIVO');

  const [force, setForce] = useState('Polícia Militar');
  const [rank, setRank] = useState('3º Sgt');
  const [warName, setWarName] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setActiveTab('contato');
    if (editingProfile) {
      setFullName(editingProfile.name || '');
      setRe(editingProfile.re || editingProfile.id || 'PERFIL');
      setSector(editingProfile.sector || editingProfile.battalion || '');
      setPhone(editingProfile.phone || '');
      setNotes(editingProfile.notes || '');
      setStatus(editingProfile.status || 'ATIVO');

      setForce(editingProfile.force || 'Polícia Militar');
      setRank(editingProfile.rank || '3º Sgt');
      setWarName(editingProfile.warName || '');
    } else {
      setFullName('');
      setRe('PERFIL-' + Math.floor(1000 + Math.random() * 9000));
      setSector('');
      setPhone('');
      setNotes('');
      setStatus('ATIVO');

      setForce('Polícia Militar');
      setRank('3º Sgt');
      setWarName('');
    }
    setErrorMessage('');
  }, [editingProfile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedRe = re.trim() || 'PERFIL-' + Date.now();

    // Auto calculate warName and fullName if one is blank
    const derivedFullName = fullName.trim() || `${rank} ${warName || 'MILITAR'}`;
    const derivedWarName = warName.trim()
      ? warName.trim().toUpperCase()
      : derivedFullName.split(' ').pop()?.toUpperCase() || 'MILITAR';

    onSave({
      id: editingProfile ? editingProfile.id : undefined,
      name: derivedFullName,
      re: trimmedRe,
      sector: sector.trim(),
      battalion: sector.trim(),
      phone: phone.trim(),
      notes: notes.trim(),
      status,
      force,
      rank: rank.trim() || 'Militar',
      warName: derivedWarName,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-2xl shadow-2xl p-5 space-y-4 text-zinc-100">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="font-bold text-zinc-100 font-tactical uppercase text-sm">
            {editingProfile ? 'Editar Perfil' : 'Novo Perfil do Cliente'}
          </h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center space-x-2 border-b border-zinc-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('contato')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
              activeTab === 'contato'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/10'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            1. Aba Contato & Dados
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bordado')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
              activeTab === 'bordado'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/10'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            2. Especificações de Bordado
          </button>
        </div>

        {errorMessage && (
          <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl flex items-center space-x-2 text-rose-400 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {activeTab === 'contato' ? (
            <>
              <div>
                <label className="block text-[11px] font-bold text-amber-400 uppercase mb-1">
                  Nome Completo / Soldado *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: João Silva de Oliveira"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 uppercase mb-1">
                    Contato (WhatsApp / Telefone) *
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 98888-1234"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 uppercase mb-1">
                    Setor / Batalhão
                  </label>
                  <input
                    type="text"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    placeholder="Ex: Operacional / 12º BPM"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-zinc-400 uppercase mb-1">
                    Corporação
                  </label>
                  <select
                    value={force}
                    onChange={(e) => setForce(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    {MILITARY_FORCES.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-zinc-400 uppercase mb-1">
                    Posto / Graduação
                  </label>
                  <input
                    type="text"
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                    placeholder="Ex: 3º Sgt / Sd"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-zinc-400 uppercase mb-1">
                    Nome de Guerra
                  </label>
                  <input
                    type="text"
                    value={warName}
                    onChange={(e) => setWarName(e.target.value)}
                    placeholder="Ex: SILVA"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-amber-400 uppercase mb-1">
                  Especificações de Bordado da Ficha
                </label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Detalhamento do bordado: Nome a ser gravado na tarjeta, tipo de linha (ex: Amarelo Ouro / Baixo Contraste), insígnia de posto, tipo sanguíneo emborrachado/bordado e posição das tarjetas na farda..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase font-mono block">
                  💡 Orientações de Bordado para Oficina:
                </span>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Estas especificações serão utilizadas automaticamente nas fichas de ordens de serviço e comprobantes de customização do cliente.
                </p>
              </div>
            </div>
          )}

          <div className="pt-3 flex items-center justify-end space-x-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white uppercase transition cursor-pointer"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-black px-5 py-2 rounded-xl text-xs font-bold uppercase transition cursor-pointer shadow-md shadow-amber-500/10"
            >
              {editingProfile ? 'SALVAR ALTERAÇÕES' : 'SALVAR PERFIL'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
