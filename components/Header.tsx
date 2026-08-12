
import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);

  const checkAuth = () => {
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
      });
    } else {
      const simUser = localStorage.getItem('sim_user');
      setUser(simUser ? JSON.parse(simUser) : null);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('auth-change', checkAuth);
    
    checkAuth();

    let subscription: any;
    if (isSupabaseConfigured) {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
      subscription = data.subscription;
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('auth-change', checkAuth);
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem('sim_user');
      window.dispatchEvent(new Event('auth-change'));
    }
  };

  const userRole = user?.user_metadata?.role || user?.role || 'Visitante';

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className={`font-bold text-xl tracking-tight transition-colors duration-300 ${scrolled ? 'text-charcoal' : 'text-white'}`}>
              AO RNLD US.
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#proyectos" className={`text-sm font-medium transition-colors ${scrolled ? 'text-gray-600 hover:text-cobalt' : 'text-white/80 hover:text-white'}`}>Proyectos</a>
          <a href="#servicios" className={`text-sm font-medium transition-colors ${scrolled ? 'text-gray-600 hover:text-cobalt' : 'text-white/80 hover:text-white'}`}>Servicios</a>
          
          {user ? (
            <div className="flex items-center gap-4">
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${scrolled ? 'bg-cobalt/10 text-cobalt' : 'bg-white/10 text-white'}`}>
                {userRole}
              </div>
              <button 
                onClick={handleLogout}
                className={`text-xs font-bold px-4 py-2 border rounded-full transition-all ${scrolled ? 'border-charcoal text-charcoal hover:bg-charcoal hover:text-white' : 'border-white/20 text-white hover:bg-white/10'}`}
              >
                Salir
              </button>
            </div>
          ) : (
             <span className={`text-[10px] font-bold uppercase tracking-widest opacity-40 ${scrolled ? 'text-charcoal' : 'text-white'}`}>
               Acceso Restringido
             </span>
          )}
        </nav>
      </div>
    </header>
  );
};
