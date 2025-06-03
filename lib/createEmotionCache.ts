// lib/createEmotionCache.ts
import createCache from '@emotion/cache';

// chave "css" deve bater com o tema do MUI
export function createEmotionCache() {
  return createCache({ key: 'css', prepend: true });
}
