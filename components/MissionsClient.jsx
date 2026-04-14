"use client";
import React, { useState, useEffect } from 'react';
import { Target, Star, Gift, CheckCircle, Lock, Zap, X, Trophy } from 'lucide-react';
import { askGemini, HAS_API_KEY } from '../lib/ai.js';
import AdSpace from './AdSpace.jsx';

const INITIAL_MISSIONS = [
  { id: 1, title: 'El Bautizo', desc: 'Abre la galería de goles y mira el primer gol oficial.', xp: 300, isCompleted: false },
  { id: 2, title: 'Cazador de Hattricks', desc: 'Filtra la galería para ver solo los Hattricks de CR7.', xp: 500, isCompleted: false },
  { id: 3, title: 'Lector Empedernido', desc: 'Expande y lee una noticia o curiosidad generada por la IA.', xp: 400, isCompleted: false },
  { id: 4, title: 'Fiel al Comandante', desc: 'Inicia sesión en la plataforma por primera vez.', xp: 1000, isCompleted: false },
  { id: 5, title: 'Inversor Táctico', desc: 'Reclama tu primera recompensa misteriosa de IA.', xp: 800, isCompleted: false },
];

export default function Missions({ xp, onGainXp }) {
  const [missions, setMissions] = useState(INITIAL_MISSIONS);

  const [unlockedCard, setUnlockedCard] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Carga diferida para evitar errores de SSR/Vercel build
    const saved = localStorage.getItem('cr7_missions');
    if (saved) {
      try {
        setMissions(JSON.parse(saved));
      } catch (e) {
        console.error("Error al cargar misiones de localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cr7_missions', JSON.stringify(missions));
  }, [missions]);


  const handleComplete = async (id, missionXp) => {
    if (missions.find(m => m.id === id).isCompleted) return;
    
    // Mark completed
    setMissions(prev => prev.map(m => m.id === id ? { ...m, isCompleted: true } : m));
    onGainXp(missionXp);

    if (HAS_API_KEY) {
        setIsGenerating(true);
        try {
            const prompt = `Un usuario acaba de completar una misión en la app de Cristiano Ronaldo.
Premialo revelándole una "Carta Histórica". Habla sobre algún jugador legendario compañero o rival clave de CR7 (Ej: Marcelo, Pepe, Rooney, Modric, Messi, Casillas, etc.) o un técnico legendario. 
Devuelve ESTRICTAMENTE este JSON:
{
  "name": "Nombre del Jugador",
  "fact": "Una anécdota increíble, emocionante y muy poco conocida sobre su relación con Cristiano Ronaldo. Máximo 3 oraciones.",
  "role": "El Mejor Socio / El Gran Rival / Mentor",
  "img": "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=600"
}`;
            const res = await askGemini(prompt);
            const cleanStr = res.match(/\{[\s\S]*\}/)?.[0] || res;
            setUnlockedCard(JSON.parse(cleanStr));
        } catch(e) {
            console.error(e);
        } finally {
            setIsGenerating(false);
        }
    }
  };

  const progress = (missions.filter(m => m.isCompleted).length / missions.length) * 100;

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="bg-card border border-border rounded-3xl p-6 lg:p-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-primary/20 transition-colors duration-500" />
        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-black text-foreground" style={{fontFamily:'Bebas Neue', letterSpacing: '0.02em'}}>Misiones & Legado</h1>
                  <p className="text-muted-foreground text-sm">Completa retos para desbloquear experiencia y Cartas de Historia generadas por IA.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-background/50 backdrop-blur-sm border border-border p-6 rounded-2xl text-center min-w-[200px]">
                <div className="flex justify-center mb-2"><Trophy className="w-8 h-8 text-primary" /></div>
                <p className="text-sm text-muted-foreground font-bold">TU EXPERIENCIA</p>
                <p className="text-4xl font-black text-foreground" style={{fontFamily:'Bebas Neue'}}>{xp} XP</p>
            </div>
        </div>
      </div>

      <div className="py-2"><AdSpace format="banner" /></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* PROGRESS COL */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden">
                <div className="flex justify-between items-end mb-4">
                     <p className="font-bold text-foreground">Progreso Global</p>
                     <p className="text-sm font-bold text-primary">{Math.round(progress)}%</p>
                </div>
                <div className="h-3 bg-background rounded-full overflow-hidden border border-border">
                    <div className="h-full bg-primary transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
                </div>
            </div>
            
            <div className="bg-card border border-border rounded-2xl p-6 text-center space-y-4">
               <Star className="w-10 h-10 text-yellow-500 mx-auto" />
               <h3 className="font-bold text-lg text-foreground">Cartas de Historia IA</h3>
               <p className="text-sm text-muted-foreground">Cada vez que completes una misión, la IA invocará una carta única con anécdotas reales de personajes históricos relacionados a Cristiano Ronaldo. ¡Gana XP y descúbrelas!</p>
               {!HAS_API_KEY && (
                   <p className="text-xs text-red-400 font-bold p-2 bg-red-400/10 rounded-lg">API Key de Gemini no configurada. Las cartas no se generarán en vivo.</p>
               )}
            </div>
        </div>

        {/* MISSIONS COL */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-black mb-4" style={{fontFamily: 'Bebas Neue'}}>Misiones Activas</h2>
          {missions.map((mission) => (
            <div 
              key={mission.id} 
              className={`flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-5 rounded-2xl border transition-all ${
                mission.isCompleted 
                  ? 'bg-primary/5 border-primary/20 opacity-70 cursor-not-allowed' 
                  : 'bg-card border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  mission.isCompleted ? 'bg-primary text-primary-foreground' : 'bg-background border border-border text-muted-foreground'
                }`}>
                  {mission.isCompleted ? <CheckCircle className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                      <h3 className={`font-bold text-lg ${mission.isCompleted ? 'text-primary' : 'text-foreground'}`}>
                        {mission.title}
                      </h3>
                      {isGenerating && !mission.isCompleted && (
                          <span className="text-[10px] uppercase font-bold text-amber-500 animate-pulse">Esperando turno...</span>
                      )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{mission.desc}</p>
                  <p className="text-xs font-bold text-primary mt-2 inline-flex items-center gap-1 border border-primary/20 bg-primary/10 px-2 py-0.5 rounded-full">
                      <Zap className="w-3 h-3"/> {mission.xp} XP Recompensa
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => handleComplete(mission.id, mission.xp)}
                disabled={mission.isCompleted || isGenerating}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold transition-all ${
                  mission.isCompleted 
                    ? 'bg-background text-muted-foreground border border-border'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20'
                }`}
              >
                {mission.isCompleted ? 'Completada' : (isGenerating ? 'Bloqueado' : 'Reclamar')}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* GENERATING OVERLAY */}
      {isGenerating && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
             <div className="relative text-center animate-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:zoom-out-95">
                 <div className="w-24 h-24 mx-auto border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-6" />
                 <h2 className="text-3xl font-black text-white mb-2" style={{fontFamily:'Bebas Neue'}}>Invocando Leyenda</h2>
                 <p className="text-white/60">La IA está buscando una historia clasificada en los archivos...</p>
             </div>
         </div>
      )}

      {/* UNLOCKED CARD MODAL */}
      {unlockedCard && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setUnlockedCard(null)} />
             
             <div className="relative bg-black border border-primary/50 w-full max-w-sm rounded-[2rem] overflow-hidden shadow-[0_0_50px_-12px_rgba(234,179,8,0.5)] animate-in zoom-in-95 group">
                 <button onClick={() => setUnlockedCard(null)} className="absolute top-4 right-4 z-20 w-8 h-8 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white/70 hover:text-white border border-white/20">
                     <X className="w-5 h-5"/>
                 </button>

                 <div className="relative h-[250px] w-full overflow-hidden">
                     <img src={unlockedCard.img} className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700" alt="card" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                     <div className="absolute bottom-4 left-6">
                         <div className="bg-primary text-black font-black text-[10px] px-2 py-1 rounded-full uppercase tracking-widest inline-block mb-1">
                             {unlockedCard.role}
                         </div>
                         <h2 className="text-4xl text-white font-black" style={{fontFamily: 'Bebas Neue'}}>{unlockedCard.name}</h2>
                     </div>
                 </div>

                 <div className="p-6 bg-gradient-to-br from-zinc-900 to-black">
                     <div className="flex items-center gap-2 mb-4 text-primary">
                         <Star className="w-4 h-4 fill-primary" />
                         <span className="font-bold text-xs tracking-widest uppercase">Anécdota Legendaria</span>
                     </div>
                     <p className="text-zinc-300 text-sm leading-relaxed italic border-l-2 border-primary/50 pl-4">{unlockedCard.fact}</p>
                     
                     <button onClick={() => setUnlockedCard(null)} className="w-full mt-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors">
                         Añadir a mi colección
                     </button>
                 </div>
             </div>
         </div>
      )}

    </div>
  );
}

