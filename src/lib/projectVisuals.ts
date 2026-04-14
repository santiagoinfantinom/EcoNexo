export function getProjectVisualImage(params: {
  id?: string;
  name?: string;
  category?: string;
  fallback?: string;
}): string {
  const { id = "", name = "", category = "", fallback = "/assets/default-event.png" } = params;
  const haystack = `${name} ${category}`.toLowerCase();

  const themes: Record<string, string[]> = {
    forest: [
      "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1280&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=1280&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1280&auto=format&fit=crop",
    ],
    education: [
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1280&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1280&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1280&auto=format&fit=crop",
    ],
    health: [
      "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?q=80&w=1280&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1280&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1280&auto=format&fit=crop",
    ],
    ocean: [
      "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?q=80&w=1280&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1280&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=1280&auto=format&fit=crop",
    ],
    food: [
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1280&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1472145246862-b24cf25c4a36?q=80&w=1280&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1280&auto=format&fit=crop",
    ],
    community: [
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1280&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1280&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1469571486292-b53601020ff2?q=80&w=1280&auto=format&fit=crop",
    ],
    recycling: [
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1280&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1280&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=1280&auto=format&fit=crop",
    ],
    tech: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1280&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1280&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1280&auto=format&fit=crop",
    ],
  };

  let theme = "community";
  if (/(reforest|forest|aufforst|biodivers|green roof|bosque|árbol|tree|umwelt)/.test(haystack)) theme = "forest";
  else if (/(educa|robot|workshop|bildung|stem)/.test(haystack)) theme = "education";
  else if (/(clinic|health|salud|medizin|care)/.test(haystack)) theme = "health";
  else if (/(ocean|beach|coast|marin|océan|meer|playa)/.test(haystack)) theme = "ocean";
  else if (/(food|garden|huerto|agri|farm|aliment|ernährung|compost)/.test(haystack)) theme = "food";
  else if (/(recycl|circular|repair|waste|textile|zero waste)/.test(haystack)) theme = "recycling";
  else if (/(tech|digital|smart city|citylab|data|software)/.test(haystack)) theme = "tech";

  const list = themes[theme] || themes.community;
  const hashSeed = `${id}-${name}-${category}`;
  let hash = 0;
  for (let i = 0; i < hashSeed.length; i += 1) hash = (hash * 31 + hashSeed.charCodeAt(i)) >>> 0;
  const selected = list[hash % list.length];
  return selected || fallback;
}
