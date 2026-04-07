"use client";
import React, { useState } from 'react';
import { Trophy, Target, Star } from 'lucide-react';
import { TEAM_STATS, formatNumber } from '../lib/utils.js';

const TEAM_DETAILS = {
  'Sporting CP': {
    founded: 1906, country: 'Portugal 🇵🇹', stadium: 'Estádio José Alvalade',
    trophies: ['Liga Portuguesa x1'],
    bio: 'Fue aquí donde CR7 deslumbró por primera vez. Con 16 años ya era titular indiscutible y sus actuaciones llamaron la atención de los grandes de Europa.',
    color: '#006600',
  },
  'Manchester United': {
    founded: 1878, country: 'Inglaterra 🏴󠁧󠁢󠁥󠁮󠁧󠁿', stadium: 'Old Trafford',
    trophies: ['Premier League x3', 'Champions League x1', 'FA Cup x1', 'Balón de Oro x1'],
    bio: 'Llegó con 18 años y se convirtió en leyenda. Bajo la tutela de Sir Alex Ferguson, Ronaldo pasó de ser un joven talento a ser el mejor jugador del mundo.',
    color: '#DA291C',
  },
  'Real Madrid': {
    founded: 1902, country: 'España 🇪🇸', stadium: 'Santiago Bernabéu',
    trophies: ['LaLiga x2', 'Champions League x4', 'Copa del Rey x2', 'Balón de Oro x4'],
    bio: 'La etapa más prolífica de su carrera. 450 goles en 438 partidos, 4 Champions League y 4 Balones de Oro. CR7 y el Madrid son historia del fútbol.',
    color: '#FEBE10',
  },
  'Juventus': {
    founded: 1897, country: 'Italia 🇮🇹', stadium: 'Allianz Stadium',
    trophies: ['Serie A x2', 'Coppa Italia x1'],
    bio: 'A sus 33 años demostró que aún tenía mucho que dar. En Italia conquistó la Serie A y protagonizó actuaciones épicas en Champions League.',
    color: '#a0a0a0',
  },
  'Al-Nassr': {
    founded: 1955, country: 'Arabia Saudita 🇸🇦', stadium: 'Mrsool Park',
    trophies: ['Saudi Pro League x1', 'Arab Club Champions Cup x1'],
    bio: 'Con 38 años decidió vivir una nueva aventura. Sigue siendo el mejor de la Saudi Pro League y no ha perdido esa sed de goles.',
    color: '#FFCB00',
  },
  'Portugal': {
    founded: 1914, country: 'Portugal 🇵🇹', stadium: 'Estádio da Luz (principal)',
    trophies: ['Euro 2016 x1', 'Nations League x1'],
    bio: 'El máximo goleador de la historia de la selección portuguesa y de TODAS las selecciones nacionales del mundo. 136 goles en partidos internacionales.',
    color: '#006600',
  },
};

export default function Teams() {
  const [selected, setSelected] = useState('Real Madrid');
  const detail = TEAM_DETAILS[selected];
  const stat = TEAM_STATS.find(t => t.team === selected);

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-6">
      <h1 className="text-4xl font-black text-foreground" style={{fontFamily:'Bebas Neue'}}>Equipos de CR7</h1>

      {/* Team selector */}
      <div className="flex flex-wrap gap-2">
        {TEAM_STATS.map(t => (
          <button
            key={t.team}
            onClick={() => setSelected(t.team)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              selected === t.team
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border hover:border-primary/30 text-muted-foreground'
            }`}
          >
            <span>{t.flag}</span> {t.team}
          </button>
        ))}
      </div>

      {/* Detail card */}
      {detail && stat && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main info */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 space-y-5">
            <div className="flex items-start gap-4">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl border-2"
                style={{borderColor: detail.color, background: detail.color + '22'}}
              >
                {stat.flag}
              </div>
              <div>
                <h2 className="text-3xl font-black text-foreground" style={{fontFamily:'Bebas Neue'}}>{selected}</h2>
                <p className="text-muted-foreground text-sm">{detail.country} · Fundado en {detail.founded}</p>
                <p className="text-xs text-muted-foreground mt-0.5">🏟️ {detail.stadium}</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">{detail.bio}</p>

            {/* Goals bar */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-foreground">Goles con {selected}</span>
                <span className="text-primary font-black text-lg" style={{fontFamily:'Bebas Neue'}}>{stat.goals}</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(stat.goals / 450) * 100}%`,
                    backgroundColor: detail.color,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{stat.years}</p>
            </div>

            {/* Trophies */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1">
                <Trophy className="w-4 h-4 text-primary" /> Títulos con CR7
              </p>
              <div className="flex flex-wrap gap-2">
                {detail.trophies.map(t => (
                  <span key={t} className="text-xs bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats column */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Goles totales</p>
              <p className="text-6xl font-black text-primary glow-gold-text" style={{fontFamily:'Bebas Neue'}}>{stat.goals}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">% del total de carrera</p>
              <p className="text-4xl font-black text-foreground" style={{fontFamily:'Bebas Neue'}}>
                {((stat.goals / 988) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-3">Comparación equipos</p>
              {TEAM_STATS.map(t => (
                <div key={t.team} className="mb-2">
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className={t.team === selected ? 'text-primary font-bold' : 'text-muted-foreground'}>{t.team}</span>
                    <span className={t.team === selected ? 'text-primary font-bold' : 'text-muted-foreground'}>{t.goals}</span>
                  </div>
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{width: `${(t.goals/450)*100}%`, backgroundColor: t.team === selected ? detail.color : '#374151'}} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

