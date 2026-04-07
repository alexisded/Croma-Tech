import HomeClient from '../components/HomeClient';
import { askGemini, HAS_API_KEY } from '../lib/ai';
import { CAREER_STATS } from '../lib/utils';

// Constante de revalidación para Next.js App Router (1 Hora de Cache)
export const revalidate = 3600;

export default async function Page() {
  let liveData = {
     totalGoles: CAREER_STATS.totalGoals,
     lastMatch: { home: 'Modo Local', away: 'Sin API Key', score: '- - -', desc: "Datos congelados.", date: "Añade tu clave" },
     nextMatch: { home: 'Sistema Offline', away: '', desc: "Requiere API configurada", date: "N/A" },
     liveMatch: null
  };

  if (HAS_API_KEY) {
      try {
        const prompt = `Usa Google Search para encontrar: 
1. La cantidad TOTAL MÁS ACTUALIZADA DE HOY de goles oficiales de Cristiano Ronaldo en su carrera.
2. El resultado exacto de su último partido oficial jugado.
3. Cuándo y contra quién es el próximo partido de Al-Nassr o Portugal.

Devuelve ESTRICTAMENTE este JSON completado (nada de texto fuera del llaves):
{
  "totalGoles": 960, 
  "lastMatch": { "home": "Equipo local", "away": "Equipo visitante", "score": "0 - 0", "desc": "Breve desc si metió gol CR7 o no", "date": "Fecha del partido recién jugado" },
  "nextMatch": { "home": "Equipo local", "away": "Eq. Visitante", "desc": "Competición", "date": "Fecha/Hora" },
  "liveMatch": null 
}`;

        // Llamada protegida que Next.js intercepta y almacena en disco por 3600 segundos
        const jsonString = await askGemini(prompt, { useSearch: true, revalidate: 3600 });
        
        let parsed;
        const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
        const cleanStr = jsonMatch ? jsonMatch[0] : jsonString;
        parsed = JSON.parse(cleanStr);
        
        if (parsed.totalGoles < 900) parsed.totalGoles = CAREER_STATS.totalGoals;
        
        liveData = parsed;
      } catch (err) {
        console.warn("Live Hub SSR Fallback (API Rate Limit)", err.message);
        liveData = {
           totalGoles: CAREER_STATS.totalGoals,
           lastMatch: { home: 'Límite API', away: 'Alcanzado', score: '429', desc: "Excediste tu cuota gratuita de IA.", date: "Google bloqueado" },
           nextMatch: { home: 'Datos Offline', away: '', desc: "Espera a que tu cuota se renueve", date: "Pronto" },
           liveMatch: null
        };
      }
  }

  return <HomeClient initialLiveData={liveData} hasKey={HAS_API_KEY} />;
}
