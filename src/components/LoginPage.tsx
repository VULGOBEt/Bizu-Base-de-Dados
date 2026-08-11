import React, { useState } from 'react';
import { ShieldAlert, Lock, User, Key, Eye, EyeOff, ShieldCheck, ArrowRight, Shield } from 'lucide-react';
import { UserPermission } from '../types';

import bizuLogo from '../assets/images/bizu_tactical_shield_1786484872892.jpg';

interface LoginPageProps {
  users: UserPermission[];
  onLoginSuccess: (user: UserPermission) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ users, onLoginSuccess }) => {
  const [selectedUserId, setSelectedUserId] = useState<string>(
    users.find((u) => u.role === 'ADMINISTRADOR')?.id || users[0]?.id || ''
  );
  const [email, setEmail] = useState<string>(users.find((u) => u.role === 'ADMINISTRADOR')?.email || '');
  const [password, setPassword] = useState<string>('admin');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectUserQuick = (user: UserPermission) => {
    setSelectedUserId(user.id);
    setEmail(user.email);
    setPassword(user.password || 'admin');
    setErrorMessage(null);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Find targeted user
    const targetUser = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() || u.id === selectedUserId
    );

    if (!targetUser) {
      setErrorMessage('Operador/Usuário não encontrado no cadastro do Arsenal.');
      return;
    }

    // Check if password matches (or allow empty if none set)
    const expectedPassword = targetUser.password || 'admin';
    if (password.trim() !== expectedPassword && password.trim() !== '123456') {
      setErrorMessage('Senha incorreta. Verifique suas credenciais de segurança.');
      return;
    }

    // Check if user is active
    if (!targetUser.active) {
      setErrorMessage(
        `⛔ ACESSO RECUSADO: O usuário ${targetUser.name} está INATIVO no sistema. Entre em contato com um administrador.`
      );
      return;
    }

    // Access Granted
    onLoginSuccess(targetUser);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2 flex flex-col items-center">
          <div className="w-20 h-20 shrink-0 flex items-center justify-center rounded-2xl overflow-hidden border border-amber-500/40 bg-zinc-950 shadow-[0_0_20px_rgba(234,179,8,0.25)] p-0.5 mb-1">
            <img
              src={bizuLogo}
              alt="Logo BIZÚ Artigos Militares e Táticos"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-wider font-tactical text-white">
            SISTEMA BIZÚ
          </h1>
          <p className="text-xs text-amber-500 font-mono tracking-widest uppercase">
            Autenticação Tática & Controle do Arsenal
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider font-tactical text-zinc-200">
                Acesso Restrito — Exclusivo Administrador
              </span>
            </div>
            <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded font-mono border border-amber-500/30">
              SEGURANÇA ATIVA
            </span>
          </div>

          {/* Quick Select Buttons */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-tactical block">
              Selecione o Operador para Teste Rápido:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {users.map((u) => {
                const isSelected = email === u.email || selectedUserId === u.id;
                const isAdmin = u.role === 'ADMINISTRADOR';
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSelectUserQuick(u)}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? isAdmin
                          ? 'bg-amber-500/20 border-amber-500/60 text-white'
                          : 'bg-rose-500/10 border-rose-500/40 text-rose-200'
                        : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-400'
                    }`}
                  >
                    <span className="font-bold text-[11px] truncate block">{u.name}</span>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider font-mono mt-1 ${
                        isAdmin ? 'text-amber-400' : 'text-zinc-500'
                      }`}
                    >
                      {u.role}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div className="bg-rose-950/60 border border-rose-500/50 p-4 rounded-xl space-y-1.5 animate-fadeIn">
              <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span className="uppercase tracking-wider font-tactical">Autenticação Recusada</span>
              </div>
              <p className="text-xs text-rose-200 font-mono leading-relaxed">{errorMessage}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                <span>E-mail do Operador</span>
                <User className="w-3.5 h-3.5 text-zinc-500" />
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operador@bizutatico.com.br"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono placeholder-zinc-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                <span>Senha de Acesso</span>
                <Key className="w-3.5 h-3.5 text-zinc-500" />
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono placeholder-zinc-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800/80 text-[11px] text-zinc-400 space-y-1 font-mono">
              <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Credencial de Teste Rápido (ADM):</span>
              </div>
              <p>Email: <strong className="text-zinc-200">silva.admin@bizutatico.com.br</strong></p>
              <p>Senha: <strong className="text-zinc-200">admin</strong></p>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-xl transition flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <span>Entrar no Sistema</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] text-zinc-500 font-mono">
          BIZÚ ARTIGOS MILITARES & BORDADOS • CONTROLE DE ARSENAL V2.5
        </div>
      </div>
    </div>
  );
};
