// app/ThemeRegistry.tsx
'use client';

import * as React from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { useServerInsertedHTML } from 'next/navigation';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// cria um cache Emotion por requisição
function createEmotionCache() {
  return createCache({ key: 'css', prepend: true });
}

// seu tema MUI (ajuste cores/tipografia se precisar)
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#f5f5f5' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Inter","Roboto","Helvetica","Arial",sans-serif',
  },
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  // 👇 intercepta todo CSS injetado no cache durante a renderização
  const [{ cache, flush }] = React.useState(() => {
    const cache = createEmotionCache();
    const prevInsert = cache.insert;
    let inserted: string[] = [];

    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };

    const flush = () => {
      const names = inserted;
      inserted = [];
      return names;
    };

    return { cache, flush };
  });

  // 👇 quando o Next estiver montando o HTML no servidor, injeta só o CSS usado
  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) {
      return null;
    }
    let styles = '';
    for (const name of names) {
      styles += cache.inserted[name];
    }
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          {children}
        </LocalizationProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
