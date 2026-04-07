"use client";

import React, { useState, useEffect, createContext, useContext } from 'react';
import { Trophy, Target, User, Shield, BarChart2, Zap, HelpCircle, CheckSquare, Newspaper, Users, Menu, X, LogIn, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { formatNumber } from '../lib/utils.js';

export const AppContext = createContext();

const NAV_ITEMS = [
  { id: '/', label: 'Inicio', icon: Home },
  { id: '/goles', label: 'Goles (Galería)', icon: Target },
  { id: '/biografia', label: 'Biografía', icon: User },
  { id: '/equipos', label: 'Equipos', icon: Trophy },
  { id: '/analisis', label: 'Análisis Táctico', icon: BarChart2 },
  { id: '/misiones', label: 'Misiones CR7', icon: CheckSquare },
  { id: '/noticias', label: 'Hub de Noticias', icon: Newspaper },
  { id: '/trivia', label: 'Trivia y Retos', icon: HelpCircle },
  { id: '/comunidad', label: 'Top Comunidad', icon: Users },
];

// Reusing Lucide Home as hack since it wasn't exported easily above
function Home(props) {
    return <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
}

export function ClientProvider({ children }) {
  const [user, setUser] = useState(null);
  const [xp, setXp] = useState(0);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginName, setLoginName] = useState('');
  
  const pathname = usePathname();

  useEffect(() => {
    const savedUser = localStorage.getItem('cr7_user');
    const savedXp = localStorage.getItem('cr7_xp');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedXp) setXp(parseInt(savedXp));
  }, []);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginName.trim()) {
      const newUser = { name: loginName, avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=150&q=80' };
      setUser(newUser);
      localStorage.setItem('cr7_user', JSON.stringify(newUser));
      if (xp === 0) handleGainXp(500); 
      setShowLoginModal(false);
      setLoginName('');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('cr7_user');
  };

  const handleGainXp = (amount) => {
    setXp(prev => {
        const newXp = prev + amount;
        localStorage.setItem('cr7_xp', newXp.toString());
        return newXp;
    });
  };

  const Sidebar = () => (
    <>
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-black text-xl leading-none text-foreground" style={{fontFamily:'Bebas Neue', letterSpacing: '0.02em'}}>CR7</h1>
            <p className="text-xs text-muted-foreground">Road to 1000 - NEXT</p>
          </div>
        </div>

        <div className="mx-4 my-4 p-3 rounded-xl bg-primary/10 border border-primary/20 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="text-3xl font-black text-primary glow-gold-text relative z-10" style={{fontFamily:'Bebas Neue'}}>967</p>
          <p className="text-xs text-muted-foreground relative z-10">de 1000 goles</p>
          <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden relative z-10">
            <div className="h-full bg-primary rounded-full animate-pulse-gold" style={{width:'96.7%'}} />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2 px-4 space-y-1">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = pathname === id;
          return (
            <Link
              key={id}
              href={id}
              onClick={() => setIsMobileOpen(false)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
              {label}
            </Link>
          );
        })}
      </div>

      <div className="p-4 mt-auto border-t border-border">
        {user ? (
          <div className="bg-muted/50 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-primary/20" />
              <div className="text-left">
                <p className="text-sm font-bold text-foreground leading-none">{user.name}</p>
                <p className="text-xs text-primary font-bold mt-1 inline-flex items-center gap-1"><Zap className="w-3 h-3"/> {formatNumber(xp)} XP</p>
              </div>
            </div>
            <button onClick={handleLogout} className="text-muted-foreground hover:text-red-500 p-2">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setShowLoginModal(true)}
            className="w-full flex items-center justify-center gap-2 bg-card border border-border hover:border-primary/50 text-foreground px-4 py-3 rounded-xl text-sm font-medium transition-all"
          >
            <LogIn className="w-4 h-4" /> Entrar / Registro
          </button>
        )}
      </div>
    </>
  );

  return (
    <AppContext.Provider value={{ xp, handleGainXp, user }}>
      <div className="min-h-screen bg-background flex text-foreground">
        
        <aside className="hidden lg:flex fixed inset-y-0 w-64 flex-col border-r border-border bg-card/50 backdrop-blur-xl z-30">
          <Sidebar />
        </aside>

        <div className="lg:hidden fixed top-0 w-full h-16 border-b border-border bg-background/80 backdrop-blur-xl z-40 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            <span className="font-black text-lg" style={{fontFamily:'Bebas Neue'}}>CR7 Tracker</span>
          </div>
          <button onClick={() => setIsMobileOpen(true)} className="p-2 text-foreground">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {isMobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
            <aside className="relative w-64 bg-card h-full flex flex-col shadow-2xl">
              <button onClick={() => setIsMobileOpen(false)} className="absolute top-4 right-4 p-2 text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
              <Sidebar />
            </aside>
          </div>
        )}

        <main className="flex-1 lg:pl-64 pt-16 lg:pt-0 min-h-screen pb-20 lg:pb-0">
          {children}
        </main>

        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowLoginModal(false)} />
            <div className="relative bg-card border border-border w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
              <h2 className="text-2xl font-black text-center mb-2" style={{fontFamily:'Bebas Neue'}}>Acceso Misiones</h2>
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <input 
                  type="text" value={loginName} onChange={(e) => setLoginName(e.target.value)}
                  placeholder="Tu nombre" className="w-full bg-background border px-4 py-3 rounded-xl focus:border-primary focus:outline-none" required
                />
                <button type="submit" className="w-full bg-primary text-black font-bold py-3 rounded-xl">Entrar</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppContext.Provider>
  );
}
