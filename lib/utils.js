import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n) {
  return n?.toLocaleString('es-ES') ?? '0';
}

export function getTeamColor(team) {
  const colors = {
    'Sporting CP': '#006600',
    'Manchester United': '#DA291C',
    'Real Madrid': '#FEBE10',
    'Juventus': '#000000',
    'Al-Nassr': '#FFCB00',
    'Portugal': '#006600',
  };
  return colors[team] || '#EAB308';
}

export function getGoalTypeIcon(type) {
  const icons = {
    'Pie derecho': '🦵',
    'Cabeza': '🤯',
    'Pie izquierdo': '🦶',
    'Falta directa': '🎯',
    'Penalti': '⚽',
  };
  return icons[type] || '⚽';
}

export const CAREER_STATS = {
  totalGoals: 967,
  targetGoals: 1000,
  clubGoals: 705,
  nationalGoals: 162,
  championsLeagueGoals: 141,
  hattricks: 65,
  seasons: 22,
  clubs: ['Sporting CP', 'Manchester United', 'Real Madrid', 'Juventus', 'Al-Nassr'],
};

export const TEAM_STATS = [
  { team: 'Sporting CP', goals: 5, years: '2001-2003', color: '#006600', flag: '🇵🇹' },
  { team: 'Manchester United', goals: 118, years: '2003-2009, 2021-2022', color: '#DA291C', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { team: 'Real Madrid', goals: 450, years: '2009-2018', color: '#FEBE10', flag: '🇪🇸' },
  { team: 'Juventus', goals: 101, years: '2018-2021', color: '#000000', flag: '🇮🇹' },
  { team: 'Al-Nassr', goals: 71, years: '2023-presente', color: '#FFCB00', flag: '🇸🇦' },
  { team: 'Portugal', goals: 162, years: '2003-presente', color: '#006600', flag: '🇵🇹' },
];

export const GOALS_DATA = [
  { id: 1, minute: 34, opponent: 'Moreirense', team: 'Sporting CP', competition: 'Primeira Liga', date: '2002-10-07', type: 'Pie derecho', is_hattrick: false }
];
