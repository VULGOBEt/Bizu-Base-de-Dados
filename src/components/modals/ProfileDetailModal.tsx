import React from 'react';
import { X, User, Phone, MapPin, FileText, Plus, Edit2, ShieldAlert, CheckCircle2, Clock, PackageCheck, Wrench, ChevronRight } from 'lucide-react';
import { MilitaryProfile, ServiceOrder, OsStatus } from '../../types';
import { formatDate } from '../../utils/formatters';

interface ProfileDetailModalProps {
  isOpen: boolean;
  profile: MilitaryProfile | null;
  serviceOrders: ServiceOrder[];
  onClose: () => void;
  onEditProfile: (profile: MilitaryProfile) => void;
  onCreateOsForProfile: (profile: MilitaryProfile) => void;
  onOpenOsDetail: (os: ServiceOrder) => void;
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({
  isOpen,
  profile,
  serviceOrders = [],
  onClose,
  onEditProfile,
  onCreateOsForProfile,
  onOpenOsDetail,
}) => {
  if (!isOpen || !profile) return null;

  // Filter orders related to this profile by profileId or matching identification/warName
  const profileOrders = serviceOrders.filter((os) => {
    if (os.profileId && os.profileId === profile.id) return true;
    if (profile.re && os.militaryId && os.militaryId.toLowerCase() === profile.re.toLowerCase()) return true;
    if (profile.warName && os.warName && os.warName.toLowerCase() === profile.warName.toLowerCase()) return true;
    return false;
  });

  // Calculate real metrics
  const totalOrdersCount = profileOrders.length;
  const openOrdersCount = profileOrders.filter(
    (os) => os.status !== 'CONCLUIDO' && os.status !== 'CANCELADO'
  ).length;
  const completedOrdersCount = profileOrders.filter((os) => os.status === 'CONCLUIDO').length;

  // Calculate total items received from completed/delivered OS
  const totalItemsReceived = profileOrders
    .filter((os) => os.status === 'CONCLUIDO' || os.status === 'ENTREGUE')
    .reduce((acc, os) => {
      if (os.items && os.items.length > 0) {
        return acc + os.items.reduce((sum, item) => sum + item.qty, 0);
      }
      return acc + 1; // Fallback to 1 item per OS if items array empty
    }, 0);

  const getStatusBadge = (status: OsStatus) => {
    switch (status) {
      case 'NOVO':
        return (
          <span className="inline-flex items-center space-x-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
            <Clock className="w-3 h-3" />
            <span>Novo</span>
          </span>
        );
      case 'EM_SEPARACAO':
        return (
          <span className="inline-flex items-center space-x-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
            <Wrench className="w-3 h-3" />
            <span>Em Separação</span>
          </span>
        );
      case 'SEPARADO':
        return (
          <span className="inline-flex items-center space-x-1 bg-purple-500/10 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
            <PackageCheck className="w-3 h-3" />
            <span>Separado</span>
          </span>
        );
      case 'ENTREGUE':
        return (
          <span className="inline-flex items-center space-x-1 bg-orange-500/10 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
            <CheckCircle2 className="w-3 h-3" />
            <span>Entregue</span>
          </span>
        );
      case 'CONCLUIDO':
        return (
          <span className="inline-flex items-center space-x-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
            <CheckCircle2 className="w-3 h-3" />
            <span>Concluído</span>
          </span>
        );
      case 'CANCELADO':
        return (
          <span className="inline-flex items-center space-x-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
            <ShieldAlert className="w-3 h-3" />
            <span>Cancelado</span>
          </span>
        );
      default:
        return null;
    }
  };

  const isInactive = profile.status === 'INATIVO';

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-2xl shadow-2xl p-6 space-y-5 text-zinc-100 max-h-[90vh] overflow-y-auto">
        {/* Header with Top Action Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-zinc-800 pb-4 gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg font-tactical">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white font-tactical text-lg">
                  {profile.name || `${profile.rank} ${profile.warName}`}
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                    isInactive
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  {profile.status || 'ATIVO'}
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono">
                Identificação: <span className="text-amber-400 font-bold">{profile.re}</span> • {profile.force}
              </p>
            </div>
          </div>

          {/* Top Right Action Group */}
          <div className="flex items-center space-x-2 self-end sm:self-auto">
            <button
              onClick={() => {
                onClose();
                onEditProfile(profile);
              }}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center space-x-1.5 cursor-pointer border border-zinc-700"
              title="Editar Perfil"
            >
              <Edit2 className="w-3.5 h-3.5 text-amber-400" />
              <span>EDITAR PERFIL</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onCreateOsForProfile(profile);
              }}
              className="bg-amber-500 hover:bg-amber-400 text-black px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center space-x-1.5 cursor-pointer shadow-md shadow-amber-500/10 font-tactical"
              title="Novo Pedido / Ordem de Serviço"
            >
              <Plus className="w-4 h-4" />
              <span>+ NOVA OS</span>
            </button>

            <button onClick={onClose} className="text-zinc-400 hover:text-white cursor-pointer p-1.5 ml-1 rounded-lg hover:bg-zinc-800 transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-center">
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">PEDIDOS</p>
            <p className="text-xl font-bold text-white font-tactical mt-1">{totalOrdersCount}</p>
          </div>

          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-center">
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">PEDIDOS ABERTOS</p>
            <p className="text-xl font-bold text-amber-400 font-tactical mt-1">{openOrdersCount}</p>
          </div>

          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-center">
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">PEDIDOS CONCLUÍDOS</p>
            <p className="text-xl font-bold text-emerald-400 font-tactical mt-1">{completedOrdersCount}</p>
          </div>

          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-center">
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">ITENS RECEBIDOS</p>
            <p className="text-xl font-bold text-blue-400 font-tactical mt-1">{totalItemsReceived}</p>
          </div>
        </div>

        {/* Sector Info Bar */}
        <div className="flex items-center space-x-2 text-xs text-zinc-400 font-mono bg-zinc-950 p-3 rounded-xl border border-zinc-800">
          <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Setor / Unidade: <strong className="text-zinc-200">{profile.sector || profile.battalion || 'Não informado'}</strong></span>
        </div>

        {/* Profile Info Card */}
        <div className="bg-zinc-950/80 p-4 rounded-xl border border-zinc-800 space-y-2 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-zinc-300">
            <div className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              <span>Contato: <strong>{profile.phone || 'Não informado'}</strong></span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="w-3.5 h-3.5 text-amber-500" />
              <span>Posto / Nome Guerra: <strong>{profile.rank} {profile.warName}</strong></span>
            </div>
          </div>

          {profile.notes && (
            <div className="pt-2 border-t border-zinc-800/80 text-zinc-400 flex items-start space-x-2">
              <FileText className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
              <p>Observações: <span className="text-zinc-200">{profile.notes}</span></p>
            </div>
          )}
        </div>

        {/* Order History */}
        <div className="space-y-3">
          <h4 className="font-bold text-zinc-200 text-xs font-tactical uppercase tracking-wider flex items-center justify-between">
            <span>HISTÓRICO DE PEDIDOS & ORDENS DE SERVIÇO</span>
            <span className="text-[10px] text-zinc-500 font-mono font-normal">
              {profileOrders.length} registros encontrados
            </span>
          </h4>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {profileOrders.length === 0 ? (
              <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 text-center text-zinc-500 font-mono text-xs">
                Nenhum pedido ou ordem de serviço registrado para este perfil.
              </div>
            ) : (
              profileOrders.map((os) => {
                const itemCount = os.items && os.items.length > 0
                  ? os.items.reduce((s, i) => s + i.qty, 0)
                  : 1;

                return (
                  <div
                    key={os.id}
                    onClick={() => {
                      onClose();
                      onOpenOsDetail(os);
                    }}
                    className="bg-zinc-950 hover:bg-zinc-800/60 p-3 rounded-xl border border-zinc-800 transition flex items-center justify-between cursor-pointer group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-amber-400 font-mono text-xs group-hover:underline">
                          {os.id}
                        </span>
                        <span className="text-zinc-400 text-xs font-mono">• {itemCount} {itemCount === 1 ? 'item' : 'itens'}</span>
                      </div>
                      <p className="text-[11px] text-zinc-300 font-medium line-clamp-1">
                        {os.serviceType} {os.itemDescription ? `- ${os.itemDescription}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <div className="text-right">
                        <div>{getStatusBadge(os.status)}</div>
                        <p className="text-[10px] text-zinc-500 font-mono mt-1">
                          {formatDate(os.date)}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-500 transition" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
