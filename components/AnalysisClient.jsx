"use client";
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { TEAM_STATS, CAREER_STATS } from '../lib/utils.js';
import AdSpace from './AdSpace.jsx';


const SEASON_DATA = [
  { season: '03/04', goals: 5 }, { season: '04/05', goals: 9 }, { season: '05/06', goals: 12 },
  { season: '06/07', goals: 23 }, { season: '07/08', goals: 42 }, { season: '08/09', goals: 25 },
  { season: '09/10', goals: 33 }, { season: '10/11', goals: 53 }, { season: '11/12', goals: 60 },
  { season: '12/13', goals: 55 }, { season: '13/14', goals: 51 }, { season: '14/15', goals: 57 },
  { season: '15/16', goals: 51 }, { season: '16/17', goals: 42 }, { season: '17/18', goals: 44 },
  { season: '18/19', goals: 28 }, { season: '19/20', goals: 37 }, { season: '20/21', goals: 36 },
  { season: '21/22', goals: 24 }, { season: '22/23', goals: 2 }, { season: '23/24', goals: 50 },
  { season: '24/25', goals: 25 },
];

const GOAL_TYPES = [
  { name: 'Pie derecho', value: 498, color: '#EAB308' },
  { name: 'Cabeza', value: 145, color: '#3B82F6' },
  { name: 'Pie izquierdo', value: 95, color: '#10B981' },
  { name: 'Falta directa', value: 58, color: '#8B5CF6' },
  { name: 'Penalti', value: 192, color: '#EF4444' },
];

const MINUTE_DATA = [
  { range: '1-15', goals: 92 }, { range: '16-30', goals: 118 }, { range: '31-45', goals: 143 },
  { range: '46-60', goals: 158 }, { range: '61-75', goals: 187 }, { range: '76-90+', goals: 210 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-bold text-primary">{payload[0].value} goles</p>
    </div>
  );
};

function ChartCard({ title, children }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <h3 className="text-lg font-black text-foreground mb-4" style={{fontFamily:'Bebas Neue'}}>{title}</h3>
      {children}
    </div>
  );
}

export default function Analysis() {
  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-black text-foreground" style={{fontFamily:'Bebas Neue'}}>Análisis de Carrera</h1>
        <p className="text-sm text-muted-foreground">Estadísticas profundas de los 988 goles de CR7</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Promedio goles/temporada', value: '44.9' },
          { label: 'Mejor temporada', value: '60 (11/12)' },
          { label: '% goles de cabeza', value: '14.7%' },
          { label: 'Penaltis convertidos', value: '192' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-primary" style={{fontFamily:'Bebas Neue'}}>{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="py-2"><AdSpace format="banner" /></div>

      {/* Season evolution */}

      <ChartCard title="Evolución por Temporada">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={SEASON_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 15%)" />
            <XAxis dataKey="season" tick={{fontSize: 10, fill: '#6B7280'}} />
            <YAxis tick={{fontSize: 10, fill: '#6B7280'}} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone" dataKey="goals"
              stroke="hsl(43 96% 56%)" strokeWidth={2.5}
              dot={{fill: 'hsl(43 96% 56%)', r: 3}}
              activeDot={{r: 5, fill: 'hsl(43 96% 56%)'}}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Goal types pie */}
        <ChartCard title="Tipo de Gol">
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie data={GOAL_TYPES} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={3}>
                  {GOAL_TYPES.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {GOAL_TYPES.map(({ name, value, color }) => (
                <div key={name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: color}} />
                    <span className="text-xs text-muted-foreground">{name}</span>
                  </div>
                  <span className="text-xs font-bold text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Goals by minute */}
        <ChartCard title="Goles por Minuto de Juego">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={MINUTE_DATA}>
              <XAxis dataKey="range" tick={{fontSize: 10, fill: '#6B7280'}} />
              <YAxis tick={{fontSize: 10, fill: '#6B7280'}} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="goals" fill="hsl(43 96% 56%)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground text-center mt-2">CR7 es más peligroso en el segundo tiempo ⏱️</p>
        </ChartCard>
      </div>

      {/* Goals by team */}
      <ChartCard title="Goles por Club y Selección">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={TEAM_STATS} layout="vertical">
            <XAxis type="number" tick={{fontSize: 10, fill: '#6B7280'}} />
            <YAxis dataKey="team" type="category" tick={{fontSize: 11, fill: '#9CA3AF'}} width={120} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="goals" radius={[0,4,4,0]}>
              {TEAM_STATS.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

