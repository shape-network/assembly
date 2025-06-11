import { useLayoutEffect, useState } from 'react';

const viewports = {
  sm: '(max-width: 640px)',
  md: '(min-width: 641px) and (max-width: 1023px)',
  lg: '(min-width: 1024px) and (max-width: 1279px)',
  xl: '(min-width: 1280px) and (max-width: 1649px)',
  '2xl': '(min-width: 1650px)',
  'ultra-wide': '(min-width: 2500px)',
} as const;

type Viewports = keyof typeof viewports;

function getMatches(query: string): boolean {
  if (typeof window !== 'undefined') {
    return window.matchMedia(query).matches;
  }
  return false;
}

export function useMediaQuery(viewport: Viewports): boolean {
  const query = viewports[viewport];

  const [matches, setMatches] = useState(getMatches(query));

  useLayoutEffect(() => {
    function handleChange() {
      setMatches(getMatches(query));
    }

    handleChange();

    const matchMedia = window.matchMedia(query);
    matchMedia.addEventListener('change', handleChange);

    return () => {
      matchMedia.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}
