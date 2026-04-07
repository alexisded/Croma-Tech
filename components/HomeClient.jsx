"use client";

import React, { useState, useEffect } from 'react';
import { Trophy, Target, Zap, TrendingUp, Star, Award, ChevronRight, Flame, RefreshCw, AlertCircle } from 'lucide-react';
import { CAREER_STATS, TEAM_STATS, formatNumber } from '../lib/utils.js';

function StatCard({ label, value, icon: Icon, color = 'text-primary', suffix = '' }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-1 hover:border-primary/40 transition-all duration-300">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <p className="text-2xl font-black text-foreground" style={{fontFamily:'Bebas Neue'}}>
        {typeof value === 'number' ? formatNumber(value) : value}{suffix}
      </p>
    </div>
  );
}

function CountUpNumber({ target, duration = 1500 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <span>{formatNumber(count)}</span>;
}

export default function HomeClient({ initialLiveData, hasKey }) {
  const currentTotal = initialLiveData ? initialLiveData.totalGoles : CAREER_STATS.totalGoals;
  const progress = (currentTotal / CAREER_STATS.targetGoals) * 100;
  const remaining = CAREER_STATS.targetGoals - currentTotal;
  const liveData = initialLiveData;

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden border border-primary/20 glow-gold">
        <div
          className="absolute inset-0 bg-cover bg-top opacity-20"
          style={{backgroundImage: 'url(https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80)'}}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="relative z-10 px-6 py-10 lg:px-12 lg:py-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">En curso · Temporada</span>
            </div>
            {hasKey ? (
               <div className="flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">
                 <Zap className="w-3 h-3 animate-pulse" /> CLOUD CACHED - ACTIVE 
               </div>
             ) : (
               <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
                 <AlertCircle className="w-3 h-3" /> OFFLINE MOCK
               </div>
             )}
          </div>
          
          <h1 className="text-5xl lg:text-8xl font-black text-foreground mb-2" style={{fontFamily:'Bebas Neue', letterSpacing:'0.02em'}}>
            Cristiano <span className="text-primary glow-gold-text">Ronaldo</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8">El camino más ambicioso del fútbol mundial (Next.js Edge)</p>

          <div className="flex items-end gap-4 mb-6">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-2">
                Goles oficiales 
              </p>
              <div className="text-8xl lg:text-[10rem] font-black leading-none text-primary glow-gold-text relative" style={{fontFamily:'Bebas Neue'}}>
                <CountUpNumber target={currentTotal} />
              </div>
            </div>
            <div className="mb-4">
              <p className="text-2xl text-muted-foreground font-black" style={{fontFamily:'Bebas Neue'}}>/ 1000</p>
            </div>
          </div>

          <div className="max-w-lg">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Progreso al objetivo</span>
              <span className="text-primary font-bold">{progress.toFixed(1)}% · Faltan {remaining} goles</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full relative"
                style={{width: `${progress}%`, transition: 'width 1.5s ease-out'}}
              >
                <div className="absolute inset-0 shimmer rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Match Hub */}
      <div>
        <h2 className="text-2xl font-black text-foreground mb-4 flex gap-2 items-center" style={{fontFamily:'Bebas Neue'}}>
          Match Hub (Server Cached) <Zap className="w-6 h-6 text-primary" />
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-4 flex flex-col justify-between hover:border-primary/40 transition-colors">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Último Partido</p>
              <div className="flex items-center justify-between font-bold text-lg">
                <span className="truncate max-w-[100px]">{liveData?.lastMatch?.home}</span>
                <span className="text-primary px-2 py-0.5 bg-primary/10 rounded border border-primary/20 shrink-0">{liveData?.lastMatch?.score}</span>
                <span className="truncate max-w-[100px] text-right">{liveData?.lastMatch?.away}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1"><Trophy className="w-3 h-3 text-primary"/> {liveData?.lastMatch?.desc}</p>
            </div>
            <p className="text-[10px] text-muted-foreground mt-4 text-right">{liveData?.lastMatch?.date}</p>
          </div>
          
          {liveData?.liveMatch ? (
            <div className="bg-primary/5 border border-primary/30 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-2.5 h-2.5 m-4 bg-red-500 rounded-full animate-ping opacity-75" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 m-4 bg-red-500 rounded-full" />
              <div>
                <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2 flex items-center gap-1"><Zap className="w-3 h-3"/> En Vivo</p>
                <div className="flex items-center justify-between font-black text-xl text-foreground">
                  <span className="truncate max-w-[100px]">{liveData?.liveMatch?.home}</span>
                  <span className="text-red-500 px-2 py-0.5 bg-red-500/10 rounded shrink-0">{liveData?.liveMatch?.score}</span>
                  <span className="truncate max-w-[100px] text-right">{liveData?.liveMatch?.away}</span>
                </div>
                <p className="text-xs text-primary font-bold mt-2 glow-gold-text">{liveData?.liveMatch?.desc}</p>
              </div>
              <p className="text-[10px] text-red-500/80 mt-1 text-right font-medium">{liveData?.liveMatch?.date}</p>
            </div>
          ) : (
            <div className="bg-card/50 border border-border/50 rounded-xl p-4 flex flex-col items-center justify-center text-center">
               <Zap className="w-8 h-8 text-muted-foreground/30 mb-2" />
               <p className="text-sm font-bold text-muted-foreground">Sin partidos en juego</p>
               <p className="text-xs text-muted-foreground/70">Esperando el próximo evento</p>
            </div>
          )}

          <div className="bg-card border border-border rounded-xl p-4 flex flex-col justify-between hover:border-primary/40 transition-colors">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Próximo Partido</p>
              <div className="flex items-center justify-between font-bold text-lg text-muted-foreground">
                <span className="truncate max-w-[100px]">{liveData?.nextMatch?.home}</span>
                <span className="px-2 py-0.5 bg-muted rounded text-xs shrink-0">VS</span>
                <span className="truncate max-w-[100px] text-right">{liveData?.nextMatch?.away}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{liveData?.nextMatch?.desc}</p>
            </div>
            <p className="text-[10px] text-primary mt-4 font-bold max-w-full truncate">{liveData?.nextMatch?.date}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Goles de club" value={CAREER_STATS.clubGoals} icon={Trophy} />
        <StatCard label="Goles selección" value={CAREER_STATS.nationalGoals} icon={Star} color="text-blue-400" />
        <StatCard label="Champions League" value={CAREER_STATS.championsLeagueGoals} icon={Award} color="text-purple-400" />
        <StatCard label="Hat-tricks" value={CAREER_STATS.hattricks} icon={Flame} color="text-red-400" />
      </div>

      <div>
        <h2 className="text-2xl font-black text-foreground mb-4" style={{fontFamily:'Bebas Neue'}}>Goles por equipo</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {TEAM_STATS.map((t) => (
            <div key={t.team} className="bg-card border border-border rounded-xl p-4 hover:border-primary/40 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{t.flag}</span>
                  <div>
                    <p className="font-semibold text-sm">{t.team}</p>
                    <p className="text-xs text-muted-foreground">{t.years}</p>
                  </div>
                </div>
                <span className="text-3xl font-black text-primary" style={{fontFamily:'Bebas Neue'}}>{t.goals}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 hover:brightness-110"
                  style={{ width: `${(t.goals / currentTotal) * 100}%`, backgroundColor: t.color || '#EAB308' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
