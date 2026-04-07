import NewsClient from '../../components/NewsClient';

export const metadata = {
  title: 'CR7 Noticias & Hub IA',
  description: 'Noticias actualizadas y curiosidades sobre los récords de Cristiano Ronaldo generadas por Inteligencia Artificial.',
};

// We let the client handle fetching dynamically to preserve user interaction states on this specific module.
// In a fully scaled app this could also be SSR'd, but NewsClient handles degradation elegantly.
export default function NewsPage() {
  return <NewsClient />;
}
