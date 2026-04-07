"use client";
import React, { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle, ChevronRight, Trophy, RefreshCw } from 'lucide-react';

const QUESTIONS = [
  { q: '¿En qué año ganó CR7 su primer Balón de Oro?', opts: ['2006', '2007', '2008', '2009'], ans: 2 },
  { q: '¿Cuántos goles marcó CR7 en su mejor temporada (2011/12)?', opts: ['55', '58', '60', '63'], ans: 2 },
  { q: '¿Con qué camiseta debutó en la Premier League?', opts: ['Nº 7', 'Nº 9', 'Nº 11', 'Nº 17'], ans: 0 },
  { q: '¿En qué competición marcó CR7 su gol número 500?', opts: ['Liga BBVA', 'Copa del Rey', 'Champions League', 'Premier League'], ans: 2 },
  { q: '¿Cuántos hat-tricks tiene CR7 en toda su carrera?', opts: ['52', '58', '62', '65'], ans: 3 },
  { q: '¿Contra qué equipo marcó CR7 en la final de Champions 2018?', opts: ['Bayern Munich', 'Barcelona', 'Liverpool', 'PSG'], ans: 2 },
  { q: '¿Qué récord estableció CR7 con la selección de Portugal?', opts: ['Más asistencias', 'Más goles en selecciones', 'Más partidos', 'Más amarillas'], ans: 1 },
  { q: '¿Cuántos goles marcó CR7 con el Real Madrid?', opts: ['400', '430', '450', '480'], ans: 2 },
];

export default function Trivia() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState(false);

  const q = QUESTIONS[current];

  const handleAnswer = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.ans) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (current + 1 >= QUESTIONS.length) {
      setFinished(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const handleRestart = () => {
    setCurrent(0); setSelected(null); setScore(0); setFinished(false); setAnswered(false);
  };

  if (finished) {
    const pct = Math.round((score / QUESTIONS.length) * 100);
    return (
      <div className="p-4 lg:p-8 max-w-2xl mx-auto">
        <div className="bg-card border border-primary/30 rounded-2xl p-8 text-center space-y-4 glow-gold">
          <div className="text-6xl">🏆</div>
          <h2 className="text-4xl font-black text-primary" style={{fontFamily:'Bebas Neue'}}>¡Trivia Completada!</h2>
          <p className="text-muted-foreground">Tu puntuación final</p>
          <div className="text-8xl font-black text-foreground" style={{fontFamily:'Bebas Neue'}}>{score}<span className="text-muted-foreground text-4xl">/{QUESTIONS.length}</span></div>
          <p className="text-2xl font-bold text-primary">{pct}%</p>
          <p className="text-sm text-muted-foreground">
            {pct >= 80 ? '🌟 ¡Eres un experto en CR7!' : pct >= 60 ? '👍 Buen conocimiento del GOAT' : '📚 Hay que estudiar más sobre CR7'}
          </p>
          <button onClick={handleRestart} className="flex items-center gap-2 mx-auto px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-opacity">
            <RefreshCw className="w-4 h-4" /> Jugar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-black text-foreground" style={{fontFamily:'Bebas Neue'}}>Trivia CR7</h1>
        <p className="text-sm text-muted-foreground">¿Cuánto sabes de Cristiano Ronaldo?</p>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Pregunta {current + 1} de {QUESTIONS.length}</span>
          <span className="text-primary font-bold">Puntos: {score}</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" style={{width: `${((current) / QUESTIONS.length) * 100}%`}} />
        </div>
      </div>

      {/* Question */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <div className="flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="font-semibold text-foreground text-lg leading-snug">{q.q}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          {q.opts.map((opt, idx) => {
            let cls = 'bg-muted/50 border-border hover:border-primary/50 hover:bg-primary/5';
            if (answered) {
              if (idx === q.ans) cls = 'bg-green-500/20 border-green-500 text-green-400';
              else if (idx === selected) cls = 'bg-red-500/20 border-red-500 text-red-400';
              else cls = 'bg-muted/20 border-border opacity-50';
            }
            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={`flex items-center gap-3 p-3 rounded-xl border text-sm font-medium text-left transition-all ${cls}`}
              >
                <span className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center text-xs font-bold shrink-0">
                  {String.fromCharCode(65 + idx)}
                </span>
                {opt}
                {answered && idx === q.ans && <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />}
                {answered && idx === selected && idx !== q.ans && <XCircle className="w-4 h-4 text-red-400 ml-auto" />}
              </button>
            );
          })}
        </div>

        {answered && (
          <button
            onClick={handleNext}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-opacity mt-2"
          >
            {current + 1 >= QUESTIONS.length ? <><Trophy className="w-4 h-4" /> Ver resultado</> : <>Siguiente <ChevronRight className="w-4 h-4" /></>}
          </button>
        )}
      </div>
    </div>
  );
}

