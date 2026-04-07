"use client";

// Next.js Safe Dynamic SEO Injector for Client Components
export function setDynamicSEO({ title, description, imageUrl, article }) {
  if (typeof window === 'undefined') return; // Safe guard for Server-Side Rendering

  if (title) {
    document.title = title.includes('CR7') ? title : `${title} | CR7 Tracker`;
  }

  const setMeta = (name, content) => {
    if (!content) return;
    let tag = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
    if (tag) {
      tag.setAttribute('content', content);
    } else {
      tag = document.createElement('meta');
      if (name.startsWith('og:')) {
          tag.setAttribute('property', name);
      } else {
          tag.setAttribute('name', name);
      }
      tag.setAttribute('content', content);
      document.head.appendChild(tag);
    }
  };

  setMeta('description', description);
  setMeta('og:description', description);
  setMeta('og:title', title);
  if (imageUrl) setMeta('og:image', imageUrl);
}
