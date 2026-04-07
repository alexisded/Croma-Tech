"use client";
import React, { useState, useEffect } from 'react';
import { Newspaper, Clock, Zap, AlertCircle, X, ChevronLeft, Bot } from 'lucide-react';
import { askGemini, HAS_API_KEY } from '../lib/ai.js';
import { setDynamicSEO } from '../lib/seo.js';
import AdSpace from '../components/AdSpace.jsx';

const FALLBACK_NEWS = [
  {
    id: 1, title: 'Modo Entrenador: Añade tu API Key para ver noticias reales.', summary: 'Estás viendo noticias locales de prueba. Configura el .env.', tag: 'Sistema', date: new Date().toISOString().split('T')[0], img: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800'
  }
];

const TAG_COLORS = {
  'Saudi Pro League': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  'Historia': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  'Internacional': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  'Sistema': 'text-red-400 bg-red-400/10 border-red-400/20',
};

export default function News() {
  const [readIds, setReadIds] = useState(new Set());
  const [newsList, setNewsList] = useState([]);
  const [curiosities, setCuriosities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCuriosities, setLoadingCuriosities] = useState(false);
  const [activeTab, setActiveTab] = useState('news'); // 'news' or 'curiosities'
  
  // States for Full Article view
  const [activeArticle, setActiveArticle] = useState(null);
  const [articleContent, setArticleContent] = useState('');
  const [articleLoading, setArticleLoading] = useState(false);

  useEffect(() => {
    // Reset SEO to generic index when mounting the main grid
    setDynamicSEO({ title: 'Noticias en Vivo', description: 'Última hora del rastro a los 1000 goles de Cristiano Ronaldo' });

    async function fetchLiveNews() {
      if (!HAS_API_KEY) {
        setNewsList(FALLBACK_NEWS);
        setLoading(false);
        return;
      }
      try {
        const prompt = `Busca las 4 noticias MÁS RECIENTES E IMPORTANTES de Cristiano Ronaldo. 
Crea un array JSON con esta estructura exacta para cada noticia:
[
  {
    "id": 1,
    "title": "Titular de la noticia",
    "summary": "Resumen de máximo 2 oraciones",
    "tag": "Palabra clave",
    "date": "YYYY-MM-DD",
    "img": "Contextual Unsplash Image URL, use https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=600 if no good idea"
  }
]`;
        const jsonString = await askGemini(prompt, { useSearch: true });
        
        let parsed;
        try {
            const jsonMatch = jsonString.match(/\[[\s\S]*\]/);
            const cleanStr = jsonMatch ? jsonMatch[0] : jsonString;
            parsed = JSON.parse(cleanStr);
        } catch(e) { throw new Error("Format error: " + e.message); }
        if (!Array.isArray(parsed)) throw new Error("Not an array.");
        
        setNewsList(parsed);
      } catch (error) {
        console.warn("Live News Fetch Failed (Rate limit or offline). Loading static fallback.", error.message);
        setNewsList([{
            id: 99, title: "CR7 rompe otro récord histórico en Medio Oriente", summary: "Cristiano Ronaldo volvió a deslumbrar con una actuación magnética...", tag: "Saudi Pro League", date: new Date().toISOString().split('T')[0], img: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800"
        }, {
            id: 98, title: "El camino imparable hacia los 1000 goles", summary: "Analistas afirman que la proyección estadística juega a su favor...", tag: "Historia", date: new Date().toISOString().split('T')[0], img: "https://images.unsplash.com/photo-1518605368461-1e1e114138e6?w=800"
        }]);
      } finally { setLoading(false); }
    }
    fetchLiveNews();
  }, []);

  const openArticle = async (article) => {
    setReadIds(prev => new Set([...prev, article.id]));
    setActiveArticle(article);
    setArticleContent('');
    
    // Inject Target SEO attributes for the exact article immediately
    setDynamicSEO({ 
        title: article.title, 
        description: article.summary, 
        imageUrl: article.img, 
        article: true 
    });

    if (!HAS_API_KEY) {
        setArticleContent("Sin acceso a API real. No se puede redactar un artículo falso. Necesitas configuración en el archivo .env.");
        return;
    }

    setArticleLoading(true);
    try {
        const prompt = `Actúa como un periodista deportivo de alto nivel mundial. El titular o noticia actual de Cristiano Ronaldo es "${article.title}". 
Dando contexto: ${article.summary}. Escribe un artículo muy emocionante, profesional, con 3 o 4 párrafos completos, usando formato MarkDown de texto, con subtitulos atractivos y negrillas resaltando jugadores o fechas, listo para publicar sobre esta noticia. Si es posible, usa herramientas de Google Search para dar detalles reales como contra quién fue o qué minuto.`;
        
        const fullText = await askGemini(prompt, { useSearch: true });
        // Simulate typing or just dump
        setArticleContent(fullText);
    } catch(e) {
        setArticleContent("Lo sentimos. El servidor falló intentando expandir esta noticia.\n\n" + e.message);
    } finally {
        setArticleLoading(false);
    }
  };

  const closeArticle = () => {
    setActiveArticle(null);
    setDynamicSEO({ title: 'Noticias en Vivo' });
  };

  const fetchCuriosities = async () => {
    if (curiosities.length > 0 || !HAS_API_KEY) return;
    setLoadingCuriosities(true);
    try {
        const prompt = `Genera EXACTAMENTE 3 curiosidades increíbles, verificables y poco conocidas sobre la carrera o récords de Cristiano Ronaldo.
Devuelve SOLO un JSON con esta estructura exacta:
[
  {
    "id": 100,
    "title": "Sabías que...",
    "summary": "Mito o dato real.",
    "tag": "Curiosidad",
    "date": "${new Date().toISOString().split('T')[0]}",
    "img": "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=600"
  }
]`;
        const jsonString = await askGemini(prompt);
        let parsed;
        const jsonMatch = jsonString.match(/\[[\s\S]*\]/);
        parsed = JSON.parse(jsonMatch ? jsonMatch[0] : jsonString);
        setCuriosities(parsed);
    } catch(e) {
        console.warn("Curiosities Fetch Failed (Rate limit or offline). Loading static fallback.", e.message);
        setCuriosities([{
            id: 101, title: 'La disciplina extrema de Madeira', summary: 'Gana 500XP completando misiones para desbloquear más curiosidades IA en tiempo real.', tag: 'Curiosidad Estática', date: new Date().toISOString().split('T')[0], img: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800'
        }]);
    } finally {
        setLoadingCuriosities(false);
    }
  };

  if (activeArticle) {
      return (
          <div className="bg-background min-h-screen relative z-50">
              <div className="max-w-3xl mx-auto p-4 lg:p-8 space-y-8 animate-in slide-in-from-bottom-10">
                 <button onClick={closeArticle} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group mb-4">
                     <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform"/> Volver al muro
                 </button>
                 
                 <div className="w-full h-64 lg:h-96 rounded-2xl overflow-hidden relative border border-border">
                     <img src={activeArticle.img} alt={activeArticle.title} className="w-full h-full object-cover" />
                     <div className="absolute top-4 left-4">
                         <span className={`text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md bg-black/60 border border-white/10 text-white`}>
                            {activeArticle.tag}
                         </span>
                     </div>
                 </div>

                 <div className="space-y-4">
                     <h1 className="text-4xl lg:text-5xl font-black leading-tight text-foreground" style={{fontFamily: 'Bebas Neue'}}>
                         {activeArticle.title}
                     </h1>
                     <div className="flex items-center justify-between border-b border-border pb-6">
                         <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                                 <Bot className="w-5 h-5 text-primary"/>
                             </div>
                             <div>
                                 <p className="font-bold text-sm">Escrito por Sistema IA</p>
                                 <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3"/> Publicado: {activeArticle.date}</p>
                             </div>
                         </div>
                     </div>
                 </div>

                 {/* Ad Placement top of article */}
                 <div className="py-2">
                    <AdSpace format="banner" />
                 </div>

                 <div className="prose prose-invert prose-yellow max-w-none text-foreground/80 leading-relaxed text-lg pb-10">
                     {articleLoading ? (
                         <div className="flex flex-col items-center justify-center py-20 opacity-50">
                             <Zap className="w-10 h-10 text-primary animate-pulse mb-4"/>
                             <p className="font-bold">Redactando investigación al vuelo...</p>
                         </div>
                     ) : (
                         <div className="whitespace-pre-line space-y-6">
                             {/* Simplistic markdown rendering mapping ## to bold blocks etc */}
                             {articleContent.split('\n\n').map((paragraph, i) => {
                                 if(paragraph.startsWith('##')) {
                                     return <h2 key={i} className="text-2xl font-bold text-foreground mt-8 mb-4 border-l-4 border-primary pl-4">{paragraph.replace(/##/g, '')}</h2>
                                 }
                                 // extremely simple bold markdown parsing
                                 const bolded = paragraph.split('**').map((part, j) => j % 2 === 1 ? <strong key={j} className="text-primary">{part}</strong> : part);
                                 return <p key={i}>{bolded}</p>
                             })}
                         </div>
                     )}
                 </div>
                 
                 {/* Ad Placement bottom of article */}
                 <div className="py-6 border-t border-border">
                    <AdSpace format="fluid" />
                 </div>
              </div>
          </div>
      );
  }

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-foreground" style={{fontFamily:'Bebas Neue'}}>Noticias CR7</h1>
          <p className="text-sm text-muted-foreground">Artículos expandibles auto-generados y SEO indexados.</p>
        </div>
        {HAS_API_KEY ? (
            <div className="flex items-center gap-2 text-xs font-bold text-green-500 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
              <Zap className="w-3 h-3 animate-pulse" /> IA Conectada a la Web
            </div>
        ) : (
            <div className="flex items-center gap-2 text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
              <AlertCircle className="w-3 h-3" /> API Key Requiere Atención
            </div>
        )}
      </div>

      <div className="flex gap-2 border-b border-border border-b-2 font-bold uppercase text-sm tracking-wider">
         <button onClick={() => setActiveTab('news')} className={`pb-3 px-2 border-b-2 -mb-0.5 transition-colors ${activeTab==='news' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>Titulares Reales</button>
         <button onClick={() => { setActiveTab('curiosities'); fetchCuriosities(); }} className={`pb-3 px-2 border-b-2 -mb-0.5 transition-colors flex items-center gap-1 ${activeTab==='curiosities' ? 'border-purple-500 text-purple-500' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
             <Bot className="w-4 h-4"/> Curiosidades Autogeneradas
         </button>
      </div>

      <div className="py-2">
         <AdSpace format="banner" />
      </div>

      {(activeTab === 'news' ? loading : loadingCuriosities) ? (
        <div className="text-center py-20 text-muted-foreground animate-pulse">
           <Newspaper className="w-12 h-12 mx-auto mb-4 opacity-50" />
           <p className="font-bold">{activeTab === 'news' ? 'Rastreando titulares...' : 'Generando conocimientos ocultos...'}</p>
        </div>
      ) : (
        <>
          {(activeTab === 'news' ? newsList : curiosities)[0] && (
            <div
              className={`relative rounded-2xl overflow-hidden border cursor-pointer hover:border-primary/40 transition-all group ${readIds.has((activeTab === 'news' ? newsList : curiosities)[0].id) ? 'border-border opacity-70' : 'border-primary/50'}`}
              onClick={() => openArticle((activeTab === 'news' ? newsList : curiosities)[0])}
            >
              <img src={(activeTab === 'news' ? newsList : curiosities)[0].img} alt={(activeTab === 'news' ? newsList : curiosities)[0].title} className="w-full h-64 lg:h-80 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              <div className="absolute bottom-0 p-5 lg:p-8 w-full">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${TAG_COLORS[(activeTab === 'news' ? newsList : curiosities)[0].tag] || (activeTab === 'curiosities' ? 'text-purple-400 bg-purple-400/10 border-purple-400/20' : 'text-primary bg-primary/10 border-primary/20')}`}>{(activeTab === 'news' ? newsList : curiosities)[0].tag}</span>
                <h2 className="text-3xl lg:text-5xl font-black text-foreground mt-3 leading-tight" style={{fontFamily: 'Bebas Neue'}}>{(activeTab === 'news' ? newsList : curiosities)[0].title}</h2>
                <p className="text-sm text-muted-foreground/90 mt-2 line-clamp-2 max-w-2xl">{(activeTab === 'news' ? newsList : curiosities)[0].summary}</p>
                <button className="text-xs text-primary font-bold mt-4 flex items-center gap-1 hover:underline">
                    LEER ARTÍCULO COMPLETO <ChevronLeft className="w-3 h-3 rotate-180" />
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {(activeTab === 'news' ? newsList : curiosities).slice(1).map((article, index) => (
              <React.Fragment key={article.id}>
                  {index === 1 && activeTab === 'news' && (
                      <div className="md:col-span-2 py-2">
                          <AdSpace format="banner" />
                      </div>
                  )}
                  <div
                    onClick={() => openArticle(article)}
                    className={`bg-card border rounded-xl overflow-hidden cursor-pointer hover:border-primary/40 transition-all group flex flex-col ${readIds.has(article.id) ? 'border-border opacity-60' : 'border-border'}`}
                  >
                    <img src={article.img} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="p-5 space-y-3 flex-1 flex flex-col">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${TAG_COLORS[article.tag] || (activeTab === 'curiosities' ? 'text-purple-400 bg-purple-400/10 border-purple-400/20' : 'text-primary bg-primary/10 border-primary/20')}`}>
                          {article.tag}
                        </span>
                        <p className="text-[10px] text-muted-foreground font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> {article.date}</p>
                      </div>
                      <h3 className="font-black text-xl text-foreground leading-snug lg:text-2xl" style={{fontFamily: 'Bebas Neue'}}>{article.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{article.summary}</p>
                      <button className="text-xs text-primary/70 font-bold flex items-center gap-1 mt-2.5 group-hover:text-primary transition-colors">
                          <Newspaper className="w-4 h-4"/> LEER COMPLETA
                      </button>
                    </div>
                  </div>
              </React.Fragment>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

