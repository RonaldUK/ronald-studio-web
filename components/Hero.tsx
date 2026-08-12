
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Project } from '../types';

export const Hero: React.FC = () => {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const lastMouseX = useRef(0);
  const velocity = useRef(0.2);
  const requestRef = useRef<number>(null);

  const projects: Project[] = [
    { id: 1, title: "Tienda Online", desc: "Rediseño bancario.", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80" },
    { id: 2, title: "Agentes Inteligentes", desc: "Sitio inmersivo.", img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=600&q=80" },
    { id: 3, title: "Diseño Estructural", desc: "Venta de plantas.", img: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=600&q=80" },
    { id: 4, title: "Diseño Grafico", desc: "Calma visual.", img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80" },
    { id: 5, title: "Robotica", desc: "Identidad corporativa.", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80" },
    { id: 6, title: "Ingenieria", desc: "Layout dinámico.", img: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80" },
  ];

  const animate = useCallback(() => {
    if (!isDragging && !isHovered) {
      setRotation(prev => (prev + velocity.current) % 360);
    }
    requestRef.current = requestAnimationFrame(animate);
  }, [isDragging, isHovered]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    lastMouseX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMouseX.current;
    lastMouseX.current = e.clientX;
    setRotation(prev => prev + deltaX * 0.5);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleOpenAuth = () => {
    window.dispatchEvent(new CustomEvent('open-auth'));
  };

  const radius = 280;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black flex items-center select-none">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-950/20 via-black to-black"></div>
        <img 
          src="https://images.unsplash.com/photo-1590011409095-2c8c4995f9c4?auto=format&fit=crop&w=1920&q=80" 
          alt="Misti" 
          className="w-full h-full object-cover opacity-20 mix-blend-luminosity brightness-50 contrast-150"
          style={{ 
            filter: 'grayscale(100%) brightness(0.15) contrast(1.8)',
            maskImage: 'linear-gradient(to bottom, transparent, black 50%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 50%, transparent)'
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 h-full">
        <div className="w-full md:w-1/2 text-left animate-fade-in z-20">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-none mb-6 drop-shadow-2xl">
            DISEÑO QUE<br />
            <span className="text-cobalt">TRASCIENDE</span>
          </h1>
          <p className="text-white/60 text-base md:text-lg max-w-sm font-light leading-relaxed mb-10">
            Creamos experiencias digitales minimalistas donde cada píxel tiene un propósito. Menos ruido, más impacto.
          </p>

          <div className="flex justify-start">
            <div className="neon-border-wrapper">
              <div className="neon-border-glow"></div>
              <div className="neon-outer-glow"></div>
              <button 
                onClick={handleOpenAuth}
                className="neon-border-inner px-8 py-4 text-white font-black tracking-widest uppercase text-xs flex items-center gap-4 hover:bg-white/5 transition-colors"
              >
                <span>Empezar Ahora</span>
                <svg className="w-4 h-4 text-cobalt" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center md:justify-end items-center h-full">
          <div 
            className={`carousel-container relative w-full h-[500px] flex items-center justify-center cursor-grab active:cursor-grabbing`}
            style={{ perspective: '1200px' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => { handleMouseUp(); setIsHovered(false); }}
            onMouseEnter={() => setIsHovered(true)}
          >
            <div 
              className="carousel-ring"
              style={{ 
                transform: `rotateY(${rotation}deg)`,
                transformStyle: 'preserve-3d'
              }}
            >
              {projects.map((p, idx) => {
                const itemAngle = idx * (360 / projects.length);
                return (
                  <div 
                    key={p.id}
                    className="carousel-item"
                    style={{
                      transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    <div 
                      className="card-content"
                      style={{
                        transform: `rotateY(${- (rotation + itemAngle)}deg)`,
                        transition: isDragging ? 'none' : 'transform 0.1s linear'
                      }}
                    >
                      <img 
                        src={p.img} 
                        className="w-full h-full object-cover opacity-60 transition-opacity duration-500" 
                        alt={p.title} 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-3">
                        <h3 className="text-white font-bold text-[10px] md:text-xs tracking-wider uppercase">{p.title}</h3>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .carousel-container { transform-style: preserve-3d; user-select: none; }
        .carousel-ring { position: relative; width: 0; height: 0; display: flex; align-items: center; justify-content: center; }
        .carousel-item { position: absolute; width: 140px; height: 190px; display: flex; align-items: center; justify-content: center; backface-visibility: hidden; }
        .card-content { width: 100%; height: 100%; border-radius: 1.25rem; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); background: #0a0a0a; box-shadow: 0 15px 45px rgba(0,0,0,0.6); display: flex; flex-direction: column; backface-visibility: hidden; pointer-events: none; }
        @media (max-width: 768px) { .carousel-item { width: 110px; height: 150px; } .carousel-ring { transform: translateZ(-150px); } }
      `}</style>
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-cobalt/10 rounded-full blur-[140px] pointer-events-none translate-x-1/2"></div>
    </section>
  );
};
