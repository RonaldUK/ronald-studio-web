
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { ChatWidget } from './components/ChatWidget';
import { AuthModal } from './components/AuthModal';

const App: React.FC = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    const handleOpenAuth = () => setIsAuthOpen(true);
    window.addEventListener('open-auth', handleOpenAuth);
    return () => window.removeEventListener('open-auth', handleOpenAuth);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-black">
      <Header />
      <main className="flex-grow">
        <Hero />
        
        <section id="servicios" className="py-32 bg-white rounded-t-[4rem] relative z-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-black mb-16 tracking-tight text-charcoal">Nuestros Servicios</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="group p-10 border border-gray-100 rounded-[3rem] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 bg-white">
                <div className="text-cobalt mb-6 text-3xl font-black">01</div>
                <h3 className="text-2xl font-bold mb-4 text-charcoal">UI/UX Design</h3>
                <p className="text-gray-500 font-light leading-relaxed">Diseñamos interfaces que cautivan y fluyen con absoluta naturalidad.</p>
              </div>
              <div className="group p-10 border border-gray-100 rounded-[3rem] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 bg-white">
                <div className="text-cobalt mb-6 text-3xl font-black">02</div>
                <h3 className="text-2xl font-bold mb-4 text-charcoal">Web Development</h3>
                <p className="text-gray-500 font-light leading-relaxed">Código limpio, escalable y optimizado para el máximo rendimiento.</p>
              </div>
              <div className="group p-10 border border-gray-100 rounded-[3rem] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 bg-white">
                <div className="text-cobalt mb-6 text-3xl font-black">03</div>
                <h3 className="text-2xl font-bold mb-4 text-charcoal">Automation</h3>
                <p className="text-gray-500 font-light leading-relaxed">Integramos herramientas como n8n para potenciar tu ecosistema digital.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <ChatWidget />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};

export default App;
