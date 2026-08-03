
import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { IconX } from '../constants';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('cliente');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // MODO SIMULACIÓN (Si no hay Supabase configurado)
    if (!isSupabaseConfigured) {
      setTimeout(() => {
        let simulatedRole = role;
        // Credencial maestra para pruebas
        if (isLogin && email === 'admin@studio.com' && password === 'admin123') {
          simulatedRole = 'admin';
        } else if (isLogin && email !== 'admin@studio.com') {
          simulatedRole = 'cliente';
        }

        const simulatedUser = {
          id: 'sim-123',
          email: email,
          user_metadata: { role: simulatedRole }
        };

        // Guardamos en localStorage para que el Header lo reconozca en modo simulación
        localStorage.setItem('sim_user', JSON.stringify(simulatedUser));
        window.dispatchEvent(new Event('auth-change'));
        
        setLoading(false);
        onClose();
        alert(`Modo Demo: Sesión iniciada como ${simulatedRole.toUpperCase()}`);
      }, 800);
      return;
    }

    // MODO REAL (Supabase)
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role: role }
          }
        });
        if (signUpError) throw signUpError;
        
        if (data.user) {
           await supabase.from('profiles').upsert({ id: data.user.id, email, role });
        }
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error de conexión con Supabase');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative glass-modal w-full max-w-md rounded-[2.5rem] overflow-hidden animate-fade-in shadow-2xl border border-white/5">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cobalt to-transparent opacity-50"></div>
        
        <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
          <IconX />
        </button>

        <div className="p-10">
          {!isSupabaseConfigured && (
            <div className="mb-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <p className="text-[10px] text-blue-300 uppercase font-black tracking-widest text-center">
                Modo Simulación Activo
              </p>
              <p className="text-[9px] text-white/60 text-center mt-1">
                Usa <b>admin@studio.com</b> / <b>admin123</b> para Admin.
              </p>
            </div>
          )}

          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
            {isLogin ? 'Bienvenido' : 'Registro'}
          </h2>

          <form onSubmit={handleAuth} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-cobalt uppercase tracking-widest mb-2">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-cobalt transition-colors"
                placeholder="ej: admin@studio.com"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-cobalt uppercase tracking-widest mb-2">Contraseña</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-cobalt transition-colors"
                placeholder="••••••••"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-cobalt uppercase tracking-widest mb-2">Selecciona Rol</label>
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-cobalt transition-colors appearance-none"
                >
                  <option value="cliente" className="bg-[#111]">Cliente</option>
                  <option value="admin" className="bg-[#111]">Administrador</option>
                </select>
              </div>
            )}

            {error && <p className="text-red-400 text-xs text-center">{error}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-cobalt text-white font-bold py-4 rounded-2xl mt-4 hover:bg-blue-700 transition-all shadow-lg shadow-cobalt/20 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Procesando...' : (isLogin ? 'Entrar' : 'Crear Cuenta')}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-white/40 text-sm hover:text-white transition-colors underline decoration-cobalt/30 underline-offset-4"
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
