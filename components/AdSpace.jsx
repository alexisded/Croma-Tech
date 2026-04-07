import React, { useEffect } from 'react';
import { DollarSign } from 'lucide-react';

export default function AdSpace({ format = 'banner', className = '' }) {
  // Dimensiones base dictadas por Standard iAB
  const styles = {
    banner: "h-24 w-full max-w-[728px] mx-auto", // 728x90
    square: "h-64 w-full max-w-[300px] mx-auto", // 300x250
    fluid: "min-h-[100px] w-full", // In-feed fluid
  };

  // Next.js usa process.env. Envolvemos en try-catch por seguridad de RSC
  let adClient = '';
  try { adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || process.env.VITE_ADSENSE_CLIENT_ID; } catch(e) {}
  const isProdAd = !!adClient;

  useEffect(() => {
    if (isProdAd) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error:", e.message);
      }
    }
  }, [isProdAd]);

  if (isProdAd) {
      return (
         <div className={`overflow-hidden flex justify-center items-center ${styles[format]} ${className}`}>
             <ins className="adsbygoogle"
                  style={{ display: 'block', width: '100%', height: '100%' }}
                  data-ad-client={adClient}
                  data-ad-format={format === 'fluid' ? 'fluid' : 'auto'}
                  data-full-width-responsive="true"></ins>
         </div>
      );
  }

  // Placeholder para modo desarrollo
  return (
    <div className={`relative bg-card/60 border border-dashed border-border flex flex-col items-center justify-center rounded-xl overflow-hidden group ${styles[format]} ${className}`}>
      <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '16px 16px'}} />
      <div className="text-muted-foreground/40 group-hover:text-primary transition-colors flex flex-col items-center gap-1 relative z-10">
        <DollarSign className="w-5 h-5 mx-auto" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-center">AdSense Oculto<br/>Añade NEXT_PUBLIC_ADSENSE_CLIENT_ID en .env</p>
      </div>
    </div>
  );
}
