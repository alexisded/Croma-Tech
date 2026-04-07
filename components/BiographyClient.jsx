"use client";
import React from 'react';
import { Calendar, MapPin, Award, Star, Zap, Trophy } from 'lucide-react';

const TIMELINE = [
  { year: '1985', title: 'Nace en Funchal, Madeira', desc: 'Cristiano Ronaldo dos Santos Aveiro nace el 5 de febrero en la Ilha da Madeira, Portugal.', icon: '🍼', milestone: false },
  { year: '2001', title: 'Llega al Sporting CP', desc: 'Con 16 años, CR7 debuta oficialmente con el Sporting CP en la liga portuguesa. Marca su primer gol profesional.', icon: '⚽', milestone: false },
  { year: '2003', title: 'Manchester United te llama', desc: 'Sir Alex Ferguson lo ficha por 12 millones de libras. Ronaldo elige el emblemático dorsal número 7.', icon: '🔴', milestone: true },
  { year: '2008', title: 'Balón de Oro y Champions', desc: 'Gana su primer Balón de Oro y la Champions League con el United. Es elegido el mejor jugador del mundo.', icon: '🏆', milestone: true },
  { year: '2009', title: 'Real Madrid, récord mundial', desc: 'El Real Madrid paga 94 millones de euros, récord mundial en aquel momento. Empieza la era más prolífica.', icon: '👑', milestone: true },
  { year: '2011-2017', title: 'Dominio absoluto con el Madrid', desc: '450 goles con el Real Madrid, 4 Champions League, 4 Balones de Oro. La mejor etapa de su carrera.', icon: '⭐', milestone: true },
  { year: '2018', title: 'Juventus: el reto italiano', desc: 'Sorprende al mundo fichando por la Juventus. Lleva la Serie A a su palmarés personal con 101 goles.', icon: '⚫', milestone: false },
  { year: '2019', title: 'Hat-trick en Champions vs. Atletico', desc: 'En uno de sus mejores partidos, marca 3 goles ante el Atlético de Madrid para clasificar a la Juventus.', icon: '🎯', milestone: true },
  { year: '2021', title: 'Regreso a Old Trafford', desc: 'Vuelve al Manchester United, donde empezó todo. La afición vibra con su regreso.', icon: '♥️', milestone: false },
  { year: '2023', title: 'Arabia Saudita y Al-Nassr', desc: 'Ficha por el Al-Nassr de Arabia Saudita. Sigue marcando a un ritmo extraordinario camino a los 1000 goles.', icon: '🌙', milestone: true },
  { year: '2025', title: '988 goles y contando', desc: 'Con 40 años, Cristiano sigue como el máximo goleador de la historia del fútbol y persigue el hito de los 1000.', icon: '🎯', milestone: true },
];

export default function Biography() {
  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div
          className="w-48 h-48 lg:w-56 lg:h-56 rounded-2xl bg-cover bg-center border-2 border-primary/30 shrink-0 glow-gold"
          style={{backgroundImage: 'url(https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=400&h=400&fit=crop)'}}
        />
        <div className="flex-1">
          <h1 className="text-5xl font-black text-primary glow-gold-text" style={{fontFamily:'Bebas Neue'}}>Cristiano Ronaldo</h1>
          <p className="text-xl text-muted-foreground font-medium mb-4">CR7 · El GOAT del fútbol mundial</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Calendar, label: 'Nacimiento', value: '5 Feb 1985, Funchal' },
              { icon: MapPin, label: 'Nacionalidad', value: 'Portuguesa 🇵🇹' },
              { icon: Trophy, label: 'Posición', value: 'Delantero centro' },
              { icon: Star, label: 'Balones de Oro', value: '5 (2008-2017)' },
              { icon: Award, label: 'Goles oficiales', value: '988 y contando' },
              { icon: Zap, label: 'Hat-tricks', value: '65 hat-tricks' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
                <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-xs font-semibold text-foreground">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quote */}
      <div className="border-l-4 border-primary pl-6 py-2">
        <p className="text-lg italic text-foreground/80">"Tu tiempo es limitado, pero tu talento no. Trabaja cada día como si fuera el último."</p>
        <p className="text-sm text-primary font-semibold mt-2">— Cristiano Ronaldo</p>
      </div>

      {/* Timeline */}
      <div>
        <h2 className="text-3xl font-black text-foreground mb-6" style={{fontFamily:'Bebas Neue'}}>Línea de Tiempo</h2>
        <div className="relative pl-8">
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-border" />
          <div className="space-y-6">
            {TIMELINE.map((item, i) => (
              <div key={i} className="relative">
                <div className={`absolute -left-5 top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  item.milestone ? 'border-primary bg-primary/20' : 'border-muted-foreground bg-muted'
                }`}>
                  {item.milestone && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <div className={`bg-card border rounded-xl p-4 transition-all hover:border-primary/30 ${
                  item.milestone ? 'border-primary/20' : 'border-border'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-primary">{item.year}</p>
                      <p className="font-semibold text-sm text-foreground">{item.title}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

