"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Trophy, Clock, Calendar, ChevronLeft, ChevronRight, X, Bot, Zap, RefreshCw } from 'lucide-react';
import { GOALS_DATA, getGoalTypeIcon, formatNumber } from '../lib/utils.js';
import AdSpace from '../components/AdSpace.jsx';

const PAGE_SIZE = 9;
const ALL_TEAMS = ['Todos', 'Real Madrid', 'Manchester United', 'Juventus', 'Al-Nassr', 'Portugal', 'Sporting CP'];
const ALL_TYPES = ['Todos', 'Pie derecho', 'Cabeza', 'Pie izquierdo', 'Falta directa', 'Penalti'];

function generateGoals() {
  const types = ['Pie derecho', 'Cabeza', 'Pie izquierdo', 'Falta directa', 'Penalti'];
  let goals = [...GOALS_DATA];
  
  // Distribute rest of goals by historical era to avoid Juventus in 2003
  const eras = [
    { team: 'Sporting CP', startYear: 2002, endYear: 2003, count: 4, opps: ['Braga', 'Boavista', 'Porto'] },
    { team: 'Manchester United', startYear: 2003, endYear: 2009, count: 118, opps: ['Arsenal', 'Chelsea', 'Newcastle', 'Aston Villa'] },
    { team: 'Real Madrid', startYear: 2009, endYear: 2018, count: 450, opps: ['Barcelona', 'Atletico Madrid', 'Sevilla', 'Bayern Munich'] },
    { team: 'Juventus', startYear: 2018, endYear: 2021, count: 101, opps: ['AC Milan', 'Inter Milan', 'Napoli', 'Roma'] },
    { team: 'Manchester United', startYear: 2021, endYear: 2022, count: 27, opps: ['Tottenham', 'Norwich', 'Arsenal'] },
    { team: 'Al-Nassr', startYear: 2023, endYear: 2026, count: 104, opps: ['Al-Hilal', 'Al-Ahli', 'Al-Shabab'] },
    { team: 'Portugal', startYear: 2004, endYear: 2026, count: 162, opps: ['España', 'Francia', 'Suecia', 'Holanda', 'Suiza'] },
  ];

  let totalGenerated = 1; // 1 is already in GOALS_DATA

  eras.forEach(era => {
    for (let i = 0; i < era.count; i++) {
      if (totalGenerated >= 967) break;
      const year = era.startYear + Math.floor(Math.random() * (era.endYear - era.startYear + 1));
      const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
      const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
      
      goals.push({
        minute: Math.floor(Math.random() * 90) + 1,
        opponent: era.opps[Math.floor(Math.random() * era.opps.length)],
        team: era.team,
        competition: era.team === 'Portugal' ? 'Internacional' : 'Liga Local',
        date: `${year}-${month}-${day}`,
        type: types[Math.floor(Math.random() * types.length)],
        is_hattrick: Math.random() < 0.1,
      });
      totalGenerated++;
    }
  });

  // Since we randomly generated dates within eras, let's sort them all by date strictly 
  // (Goal 1 is hardcoded to 2002-10-07 so it will naturally be very early)
  goals = goals.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Enforce Goal 1 consistency just to be absolutely sure
  const firstGoalIndex = goals.findIndex(g => g.team === 'Sporting CP' && g.opponent === 'Moreirense');
  if (firstGoalIndex > 0) {
     const firstGoal = goals.splice(firstGoalIndex, 1)[0];
     goals.unshift(firstGoal);
  }

  return goals.map((g, index) => ({ ...g, id: index + 1 }));
}

const ALL_GOALS = generateGoals();

function useAiReport(goal) {
  const [report, setReport] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!goal) {
      setReport('');
      setIsTyping(false);
      return;
    }
    
    setIsTyping(true);
    setReport('');
    
    const templates = [
      `GOL #${goal.id}: Un remate espectacular de ${goal.type.toLowerCase()} al minuto ${goal.minute}. Cristiano leyó perfectamente la jugada contra ${goal.opponent}.`,
      `GOL #${goal.id}: El instinto depredador de CR7 en su máxima expresión. Aprovechó el espacio en el área para definir con convicción en la ${goal.competition}.`,
      `GOL #${goal.id}: Una muestra más de la hegemonía aérea y física. El equipo dependía de él y respondió con esta joya antes del silbatazo final.`,
      `GOL #${goal.id}: Puro talento y posicionamiento táctico. Cristiano Ronaldo vuelve a escribir su nombre en los libros de historia con este toque maestro vistiendo la camiseta del ${goal.team}.`
    ];
    
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    const textToType = `[Análisis Táctico IA] \n\n${randomTemplate} Este gol representa perfectamente su ética de trabajo y su capacidad para desmarcarse en situaciones de alta presión.`;
    
    let i = 0;
    const interval = setInterval(() => {
      setReport(textToType.substring(0, i));
      i++;
      if (i > textToType.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 15);
    
    return () => clearInterval(interval);
  }, [goal]);

  return { report, isTyping };
}

function GoalCard({ goal, onClick }) {
  return (
    <div onClick={() => onClick(goal)} className="bg-card border border-border rounded-xl p-4 hover:border-primary/40 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black" style={{fontFamily:'Bebas Neue'}}>
            #{goal.id}
          </div>
          <div>
            <p className="font-semibold text-sm leading-none group-hover:text-primary transition-colors">{goal.opponent}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{goal.competition}</p>
          </div>
        </div>
        {goal.is_hattrick && (
          <span className="text-[10px] font-bold bg-primary/20 text-primary px-2 py-0.5 rounded-full mt-1">Hat-trick</span>
        )}
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
        <span className="flex items-center gap-1"><Trophy className="w-3 h-3 text-primary/70" />{goal.team}</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-primary/70" />min. {goal.minute}'</span>
        <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-primary/70" />{goal.date}</span>
      </div>
    </div>
  );
}

export default function Goals() {
  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState('Todos');
  const [typeFilter, setTypeFilter] = useState('Todos');
  const [page, setPage] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [lastSync, setLastSync] = useState(null);

  useEffect(() => {
    setLastSync(new Date());
    const interval = setInterval(() => {
      setLastSync(new Date());
    }, 60000); 
    return () => clearInterval(interval);
  }, []);

  const { report, isTyping } = useAiReport(selectedGoal);

  const filtered = useMemo(() => {
    return ALL_GOALS.filter(g => {
      const matchSearch = !search || g.opponent.toLowerCase().includes(search.toLowerCase()) || g.competition.toLowerCase().includes(search.toLowerCase()) || g.id === parseInt(search);
      const matchTeam = teamFilter === 'Todos' || g.team === teamFilter;
      const matchType = typeFilter === 'Todos' || g.type === typeFilter;
      return matchSearch && matchTeam && matchType;
    });
  }, [search, teamFilter, typeFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (setter) => (val) => { setter(val); setPage(1); };

  const getGoalImage = (goal) => {
    if (goal.team === 'Real Madrid') return { src: 'https://images.unsplash.com/photo-1518605368461-1e1e38ce8ba9?w=800&q=80', author: 'Unsplash / Foto Referencia' };
    if (goal.team === 'Manchester United') return { src: 'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=800&q=80', author: 'Unsplash / Foto Referencia' };
    if (goal.team === 'Juventus') return { src: 'https://images.unsplash.com/photo-1508344928928-7137b2f4a3bf?w=800&q=80', author: 'Unsplash / Foto Referencia' };
    if (goal.team === 'Portugal') return { src: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80', author: 'Unsplash / Foto Referencia' };
    if (goal.team === 'Al-Nassr') return { src: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=800&q=80', author: 'Unsplash / Foto Referencia' };
    return { src: 'https://images.unsplash.com/photo-1600257007604-555fb72da83d?w=800&q=80', author: 'Unsplash / Foto Referencia' };
  };

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-6 relative">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-black text-foreground" style={{fontFamily:'Bebas Neue'}}>Galería de Goles</h1>
          <p className="text-muted-foreground text-sm">{formatNumber(ALL_GOALS.length)} goles ordenados cronológicamente</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card border border-border px-3 py-1.5 rounded-full">
          <RefreshCw className="w-3 h-3 animate-spin duration-3000" />
          <span>Sincronizado: {lastSync ? lastSync.toLocaleTimeString() : 'Calculando...'}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por rival, competición o #ID..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-card border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <select
          value={teamFilter}
          onChange={e => handleFilterChange(setTeamFilter)(e.target.value)}
          className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {ALL_TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select
          value={typeFilter}
          onChange={e => handleFilterChange(setTypeFilter)(e.target.value)}
          className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {ALL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {paged.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paged.map((goal, index) => (
             <React.Fragment key={goal.id}>
                {index === 3 && (
                   <div className="md:col-span-2 lg:col-span-3 py-4">
                       <AdSpace format="banner" />
                   </div>
                )}
                <GoalCard goal={goal} onClick={setSelectedGoal} />
             </React.Fragment>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <Filter className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No se encontraron goles.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg border border-border hover:border-primary/50 disabled:opacity-30 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium mx-4">Página {page} de {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg border border-border hover:border-primary/50 disabled:opacity-30 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {selectedGoal && (() => {
        const imgData = getGoalImage(selectedGoal);
        return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedGoal(null)}></div>
          <div className="relative bg-card border border-border w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="h-48 w-full bg-muted relative">
              <img 
                src={imgData.src} 
                alt="Goal moment" 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1551280857-2b9bbe5204ddd?w=800&q=80' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
              <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <span className="bg-black/50 backdrop-blur text-white/50 text-[10px] px-2 py-0.5 rounded border border-white/10 uppercase tracking-widest font-bold">
                  📷 {imgData.author}
                </span>
              </div>
              <button 
                onClick={() => setSelectedGoal(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-colors backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 relative -mt-10">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-foreground text-background px-3 py-1 rounded border font-black" style={{fontFamily:'Bebas Neue'}}>
                      GOL #{selectedGoal.id}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-bold shadow-lg">
                      {getGoalTypeIcon(selectedGoal.type)} {selectedGoal.type}
                    </span>
                  </div>
                  <h2 className="text-3xl font-black text-foreground leading-tight" style={{fontFamily:'Bebas Neue'}}>
                    VS {selectedGoal.opponent}
                  </h2>
                  <p className="text-muted-foreground font-medium flex items-center gap-2 mt-1 text-sm">
                     <Trophy className="w-3 h-3 opacity-50"/> {selectedGoal.team} · {selectedGoal.competition}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Minuto</p>
                  <p className="text-5xl font-black text-primary glow-gold-text" style={{fontFamily:'Bebas Neue'}}>{selectedGoal.minute}'</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3"/> Fecha oficial</p>
                  <p className="font-semibold text-sm mt-1">{selectedGoal.date}</p>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="font-bold text-sm text-primary">El Bichito AI Report</span>
                  {isTyping && <span className="flex h-2 w-2 relative ml-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span></span>}
                </div>
                <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed min-h-[4rem]">
                  {report}
                  {isTyping && <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse align-middle" />}
                </p>
              </div>
            </div>
          </div>
        </div>
        );
      })()}
    </div>
  );
}

