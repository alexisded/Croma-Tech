import './globals.css';
import { ClientProvider } from '../components/ClientProvider.jsx';
import { Suspense } from 'react';
import Script from 'next/script';

export const metadata = {
  title: 'CR7 Tracker | El Camino a 1000 Goles',
  description: 'Acompaña a Cristiano Ronaldo en su legendario camino hacia los 1000 goles oficiales.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <Script
          id="adsense-init"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6834379350484880"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <ClientProvider>
           <Suspense fallback={<div className="min-h-screen bg-background flex text-foreground items-center justify-center">Cargando la Leyenda...</div>}>
              {children}
           </Suspense>
        </ClientProvider>
      </body>
    </html>
  );
}

