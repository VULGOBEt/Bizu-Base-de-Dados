import React, { useState } from 'react';
import {
  Settings,
  Users,
  Database,
  Palette,
  Store,
  Sliders,
  Plus,
  Shield,
  Download,
  Upload,
  RefreshCw,
  Check,
  UserCheck,
  Lock,
  Trash2,
  FileText,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { StoreConfig, UserPermission } from '../types';

interface SettingsTabProps {
  storeConfig: StoreConfig;
  users: UserPermission[];
  activeUser?: UserPermission;
  onSelectUser?: (user: UserPermission) => void;
  onSaveStoreConfig: (config: StoreConfig) => void;
  onAddUser: (user: Omit<UserPermission, 'id'>) => void;
  onToggleUserStatus: (id: string) => void;
  onDeleteUser: (id: string) => void;
  onExportFullBackup: () => void;
  onImportFullBackup: (jsonText: string) => boolean;
  onResetFactoryData: () => void;
  onShowToast: (msg: string) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  storeConfig,
  users,
  activeUser,
  onSelectUser,
  onSaveStoreConfig,
  onAddUser,
  onToggleUserStatus,
  onDeleteUser,
  onExportFullBackup,
  onImportFullBackup,
  onResetFactoryData,
  onShowToast,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'store' | 'backup' | 'appearance' | 'more'
  >('store');

  // Store form state
  const [configForm, setConfigForm] = useState<StoreConfig>(storeConfig);

  // User form state
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserPermission['role']>('OPERADOR');
  const [newUserCanDiscount, setNewUserCanDiscount] = useState(false);
  const [newUserCanReports, setNewUserCanReports] = useState(false);

  // Backup Import State
  const [importJsonText, setImportJsonText] = useState('');

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveStoreConfig(configForm);
    onShowToast('Configurações da loja BIZÚ salvas com sucesso!');
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      onShowToast('Preencha o Nome e o E-mail do usuário.');
      return;
    }

    onAddUser({
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      active: true,
      canGiveDiscount: newUserRole === 'ADMINISTRADOR' || newUserRole === 'GERENTE' || newUserCanDiscount,
      canManageUsers: newUserRole === 'ADMINISTRADOR',
      canViewReports: newUserRole === 'ADMINISTRADOR' || newUserRole === 'GERENTE' || newUserCanReports,
    });

    setNewUserName('');
    setNewUserEmail('');
    setNewUserRole('OPERADOR');
    setNewUserCanDiscount(false);
    setNewUserCanReports(false);
    setIsAddUserOpen(false);
    onShowToast('Novo operador cadastrado!');
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJsonText.trim()) return;
    const ok = onImportFullBackup(importJsonText);
    if (ok) {
      setImportJsonText('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Settings Top Banner */}
      <div className="bg-zinc-900/80 p-5 rounded-2xl border border-zinc-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-tactical tracking-wider flex items-center gap-2">
            <Settings className="w-6 h-6 text-amber-500" />
            <span>CONFIGURAÇÕES & PARÂMETROS OPERACIONAIS</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Gerencie dados da loja BIZÚ, acessos de usuários, cópias de segurança e personalização do sistema.
          </p>
        </div>
      </div>

      {/* Sub Tab Navigation */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 border-b border-zinc-800">
        <button
          onClick={() => setActiveSubTab('store')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeSubTab === 'store'
              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/10'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Dados da Loja</span>
        </button>

        <button
          onClick={() => setActiveSubTab('backup')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeSubTab === 'backup'
              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/10'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Backup & Segurança</span>
        </button>

        <button
          onClick={() => setActiveSubTab('appearance')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeSubTab === 'appearance'
              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/10'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Aparência</span>
        </button>

        <button
          onClick={() => setActiveSubTab('more')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeSubTab === 'more'
              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/10'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Parâmetros & Mais</span>
        </button>
      </div>

      {/* 1. DADOS DA LOJA */}
      {activeSubTab === 'store' && (
        <form onSubmit={handleSaveConfig} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
          <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base font-tactical tracking-wider uppercase flex items-center gap-2">
                <Store className="w-5 h-5 text-amber-500" />
                <span>Dados de Identificação da Marca BIZÚ</span>
              </h3>
              <p className="text-xs text-zinc-400">
                Essas informações aparecem no topo dos comprovantes, fichas da oficina de OS e cabeçalhos.
              </p>
            </div>
            {activeUser?.role === 'ADMINISTRADOR' && (
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition flex items-center space-x-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Dados</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-amber-400 uppercase mb-1">Nome Fantasia da Marca *</label>
              <input
                type="text"
                required
                value={configForm.name}
                onChange={(e) => setConfigForm({ ...configForm, name: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white font-bold font-tactical focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Slogan / Subtítulo Tático</label>
              <input
                type="text"
                value={configForm.slogan}
                onChange={(e) => setConfigForm({ ...configForm, slogan: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">CNPJ da Empresa</label>
              <input
                type="text"
                value={configForm.cnpj}
                onChange={(e) => setConfigForm({ ...configForm, cnpj: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Telefone / WhatsApp Comercial</label>
              <input
                type="text"
                value={configForm.phone}
                onChange={(e) => setConfigForm({ ...configForm, phone: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Endereço da Loja Física / Batalhão</label>
              <input
                type="text"
                value={configForm.address}
                onChange={(e) => setConfigForm({ ...configForm, address: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Chave Pix Padrão da Loja</label>
              <input
                type="text"
                value={configForm.pixKey}
                onChange={(e) => setConfigForm({ ...configForm, pixKey: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-amber-400 font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Mensagem do Rodapé do Recibo</label>
              <input
                type="text"
                value={configForm.receiptNote}
                onChange={(e) => setConfigForm({ ...configForm, receiptNote: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </form>
      )}

      {/* 3. BACKUP & RECURSOS */}
      {activeSubTab === 'backup' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-white text-base font-tactical tracking-wider uppercase flex items-center gap-2">
              <Download className="w-5 h-5 text-amber-500" />
              <span>Exportar Cópia de Segurança (Backup)</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Faça o download de todos os seus dados operacionais (Produtos, Vendas, Ordens de Serviço, Perfis Militares e Configurações) em formato JSON seguro.
            </p>

            <button
              onClick={onExportFullBackup}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/10 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Backup Completo (.json)</span>
            </button>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-white text-base font-tactical tracking-wider uppercase flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-400" />
              <span>Restaurar Backup de Dados</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Cole o código do backup em JSON para restaurar todo o banco de dados da BIZÚ instantaneamente.
            </p>

            <form onSubmit={handleImportSubmit} className="space-y-3">
              <textarea
                rows={3}
                placeholder="Cole o conteúdo do arquivo JSON de backup aqui..."
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs font-mono text-zinc-200 focus:border-amber-500 focus:outline-none"
              ></textarea>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
              >
                Importar Dados
              </button>
            </form>
          </div>

          {/* Reset Factory Option */}
          {activeUser?.role === 'ADMINISTRADOR' && (
            <div className="md:col-span-2 bg-rose-950/20 border border-rose-900/50 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-rose-400 text-sm uppercase tracking-wider flex items-center gap-2 font-tactical">
                  <RefreshCw className="w-4 h-4" />
                  <span>Restaurar Dados Iniciais de Fábrica</span>
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Atenção: Esta ação limpa o banco de dados atual e restaura os produtos e serviços de teste originais.
                </p>
              </div>
              <button
                onClick={onResetFactoryData}
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition shrink-0 cursor-pointer"
              >
                Restaurar Padrões BIZÚ
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4. APARÊNCIA */}
      {activeSubTab === 'appearance' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="font-bold text-white text-base font-tactical tracking-wider uppercase flex items-center gap-2">
              <Palette className="w-5 h-5 text-amber-500" />
              <span>Aparência & Interface do Sistema</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Escolha a paleta de cores e densidade visual do painel operacional BIZÚ.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div
              onClick={() => {
                const updated = { ...configForm, theme: 'tactical-dark' as const };
                setConfigForm(updated);
                onSaveStoreConfig(updated);
              }}
              className={`p-4 rounded-xl border cursor-pointer transition space-y-2 ${
                configForm.theme === 'tactical-dark'
                  ? 'bg-zinc-950 border-amber-500 shadow-lg shadow-amber-500/10'
                  : 'bg-zinc-950/50 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between px-3">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="text-[10px] font-mono text-amber-400">TÁTICO ESCURO</span>
              </div>
              <h4 className="font-bold text-xs text-white uppercase">Padrão Tático Amber</h4>
              <p className="text-[11px] text-zinc-400">Visual escuro militar com destaques em amarelo ouro tático.</p>
            </div>

            <div
              onClick={() => {
                const updated = { ...configForm, theme: 'tactical-blue' as const };
                setConfigForm(updated);
                onSaveStoreConfig(updated);
              }}
              className={`p-4 rounded-xl border cursor-pointer transition space-y-2 ${
                configForm.theme === 'tactical-blue'
                  ? 'bg-zinc-950 border-sky-400 shadow-lg shadow-sky-500/20'
                  : 'bg-zinc-950/50 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="h-10 rounded-lg bg-slate-900 border border-sky-800 flex items-center justify-between px-3">
                <span className="w-3 h-3 rounded-full bg-sky-400"></span>
                <span className="text-[10px] font-mono text-sky-400">AZUL ESCURO</span>
              </div>
              <h4 className="font-bold text-xs text-white uppercase">Azul Operacional Tático</h4>
              <p className="text-[11px] text-zinc-400">Modo escuro em tons de azul marinho com alta legibilidade.</p>
            </div>

            <div
              onClick={() => {
                const updated = { ...configForm, theme: 'stealth-black' as const };
                setConfigForm(updated);
                onSaveStoreConfig(updated);
              }}
              className={`p-4 rounded-xl border cursor-pointer transition space-y-2 ${
                configForm.theme === 'stealth-black'
                  ? 'bg-zinc-950 border-amber-500 shadow-lg shadow-amber-500/10'
                  : 'bg-zinc-950/50 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="h-10 rounded-lg bg-black border border-zinc-800 flex items-center justify-between px-3">
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                <span className="text-[10px] font-mono text-emerald-400">STEALTH MONO</span>
              </div>
              <h4 className="font-bold text-xs text-white uppercase">Stealth Blackout</h4>
              <p className="text-[11px] text-zinc-400">Contraste máximo preto total para visualização noturna.</p>
            </div>

            <div
              onClick={() => {
                const updated = { ...configForm, theme: 'olive-militaria' as const };
                setConfigForm(updated);
                onSaveStoreConfig(updated);
              }}
              className={`p-4 rounded-xl border cursor-pointer transition space-y-2 ${
                configForm.theme === 'olive-militaria'
                  ? 'bg-zinc-950 border-amber-500 shadow-lg shadow-amber-500/10'
                  : 'bg-zinc-950/50 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="h-10 rounded-lg bg-emerald-950/40 border border-emerald-800 flex items-center justify-between px-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-mono text-emerald-300">MILITAR VERDE</span>
              </div>
              <h4 className="font-bold text-xs text-white uppercase">Militar Verde Oliva</h4>
              <p className="text-[11px] text-zinc-400">Inspirado nas fardas e equipamentos de combate.</p>
            </div>

            <div
              onClick={() => {
                const updated = { ...configForm, theme: 'tactical-light' as const };
                setConfigForm(updated);
                onSaveStoreConfig(updated);
              }}
              className={`p-4 rounded-xl border cursor-pointer transition space-y-2 ${
                configForm.theme === 'tactical-light'
                  ? 'bg-slate-200 border-amber-500 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-200/80 border-slate-300 hover:border-slate-400'
              }`}
            >
              <div className="h-10 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-between px-3">
                <span className="w-3 h-3 rounded-full bg-slate-800"></span>
                <span className="text-[10px] font-mono text-slate-800 font-bold">CINZA SUAVE</span>
              </div>
              <h4 className="font-bold text-xs text-slate-900 uppercase">Tema Suave (Claro)</h4>
              <p className="text-[11px] text-slate-600">Fundo cinza suave sem excesso de brilho, descansando a visão.</p>
            </div>
          </div>
        </div>
      )}

      {/* 5. PARÂMETROS E MAIS */}
      {activeSubTab === 'more' && (
        <form onSubmit={handleSaveConfig} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
          <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base font-tactical tracking-wider uppercase flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-500" />
                <span>Parâmetros de Venda & Limites</span>
              </h3>
              <p className="text-xs text-zinc-400">Regras de prefixo de pedidos, teto de descontos e automação.</p>
            </div>
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition flex items-center space-x-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Parâmetros</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Prefixo do Código do Pedido</label>
              <input
                type="text"
                value={configForm.orderPrefix}
                onChange={(e) => setConfigForm({ ...configForm, orderPrefix: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white font-mono focus:border-amber-500 focus:outline-none uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Limite Máximo de Desconto Permitido (%)</label>
              <input
                type="number"
                min="0"
                max="50"
                value={configForm.maxDiscountPercent}
                onChange={(e) => setConfigForm({ ...configForm, maxDiscountPercent: parseFloat(e.target.value) || 0 })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-amber-400 font-bold focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2 flex items-center justify-between p-4 bg-zinc-950 rounded-xl border border-zinc-800">
              <div>
                <span className="block text-xs font-bold text-white uppercase">Impressão Automática de Comprovante</span>
                <span className="text-[11px] text-zinc-400">Abrir janela de impressão automaticamente ao confirmar pedido.</span>
              </div>
              <input
                type="checkbox"
                checked={configForm.autoPrintReceipt}
                onChange={(e) => setConfigForm({ ...configForm, autoPrintReceipt: e.target.checked })}
                className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
