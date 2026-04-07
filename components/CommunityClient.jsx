"use client";
import React, { useState } from 'react';
import { Users, Heart, MessageCircle, Share2, Trophy, Send } from 'lucide-react';

const POSTS = [
  {
    id: 1, user: 'CristianoFan7', avatar: '🧔', time: 'hace 2h',
    content: '¡988 goles! CR7 es simplemente incomparable. Van a pasar 100 años antes de que alguien iguale esto. SIUUUU! 🐐',
    likes: 243, comments: 18, team: 'Real Madrid fan',
  },
  {
    id: 2, user: 'FootballAnalyst', avatar: '📊', time: 'hace 4h',
    content: 'Análisis: Si CR7 mantiene un ritmo de 1.4 goles por partido, llegará a 1000 goles en aproximadamente 9 partidos. El hito histórico está MUY cerca.',
    likes: 89, comments: 32, team: 'Analista',
  },
  {
    id: 3, user: 'NassrKingdom', avatar: '🌙', time: 'hace 6h',
    content: 'Anoche fuimos al estadio y fue una locura. CR7 marcó dos golazos y el Mrsool Park explotó. Arabia tiene un privilegio enormous de tenerlo 🔥',
    likes: 156, comments: 24, team: 'Al-Nassr fan',
  },
  {
    id: 4, user: 'PortugalPride', avatar: '🇵🇹', time: 'hace 8h',
    content: 'Portugal sin Cristiano será diferente, pero su legado es eterno. 136 goles con la selección. Ningún jugador en la historia de las selecciones nacionales lo superará pronto.',
    likes: 312, comments: 41, team: 'Portugal fan',
  },
  {
    id: 5, user: 'MadridForever', avatar: '👑', time: 'hace 1d',
    content: '450 goles con el Madrid. Si hay un club que definió a CR7 en su mejor versión, ese fue el Real Madrid. Eterna memoria. ¡Hala Madrid! ⭐',
    likes: 198, comments: 15, team: 'Real Madrid fan',
  },
];

export default function Community() {
  const [posts, setPosts] = useState(POSTS);
  const [liked, setLiked] = useState(new Set());
  const [newPost, setNewPost] = useState('');

  const toggleLike = (id) => {
    setLiked(prev => {
      const n = new Set(prev);
      if (n.has(id)) { n.delete(id); setPosts(p => p.map(post => post.id === id ? {...post, likes: post.likes - 1} : post)); }
      else { n.add(id); setPosts(p => p.map(post => post.id === id ? {...post, likes: post.likes + 1} : post)); }
      return n;
    });
  };

  const submitPost = () => {
    if (!newPost.trim()) return;
    const post = {
      id: Date.now(), user: 'Tú', avatar: '😊', time: 'ahora mismo',
      content: newPost, likes: 0, comments: 0, team: 'Fan',
    };
    setPosts(prev => [post, ...prev]);
    setNewPost('');
  };

  return (
    <div className="p-4 lg:p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-black text-foreground" style={{fontFamily:'Bebas Neue'}}>Comunidad CR7</h1>
        <p className="text-sm text-muted-foreground">Comparte tu amor por el GOAT con fans de todo el mundo</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Fans activos', value: '12.4K', icon: Users },
          { label: 'Posts hoy', value: '847', icon: MessageCircle },
          { label: 'Likes totales', value: '98.2K', icon: Heart },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-3 text-center">
            <Icon className="w-4 h-4 text-primary mx-auto mb-1" />
            <p className="font-black text-lg text-foreground" style={{fontFamily:'Bebas Neue'}}>{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* New post */}
      <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-lg">😊</div>
          <textarea
            value={newPost}
            onChange={e => setNewPost(e.target.value)}
            placeholder="¿Qué piensas sobre CR7 y su camino a los 1000 goles?"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none min-h-16"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={submitPost}
            disabled={!newPost.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            <Send className="w-3.5 h-3.5" /> Publicar
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-card border border-border rounded-2xl p-4 space-y-3 hover:border-primary/20 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl">{post.avatar}</div>
              <div>
                <p className="font-semibold text-sm text-foreground">{post.user}</p>
                <p className="text-xs text-muted-foreground">{post.team} · {post.time}</p>
              </div>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{post.content}</p>
            <div className="flex items-center gap-4 pt-1 border-t border-border">
              <button
                onClick={() => toggleLike(post.id)}
                className={`flex items-center gap-1.5 text-xs font-medium transition-all ${liked.has(post.id) ? 'text-red-400' : 'text-muted-foreground hover:text-red-400'}`}
              >
                <Heart className={`w-4 h-4 ${liked.has(post.id) ? 'fill-red-400' : ''}`} /> {post.likes}
              </button>
              <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-all">
                <MessageCircle className="w-4 h-4" /> {post.comments}
              </button>
              <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-all ml-auto">
                <Share2 className="w-4 h-4" /> Compartir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

