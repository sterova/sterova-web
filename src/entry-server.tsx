import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { QueryClient, hydrate } from '@tanstack/react-query';

export function render(url: string, dehydratedState?: unknown) {
  const helmetContext: any = {};
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  if (dehydratedState) {
    hydrate(queryClient, dehydratedState);
  }

  const html = renderToString(
    <React.StrictMode>
      <App 
        ssrPath={url} 
        helmetContext={helmetContext} 
        preSeededQueryClient={queryClient} 
      />
    </React.StrictMode>
  );

  const { helmet } = helmetContext;

  const head = `
    ${helmet?.title?.toString() || ''}
    ${helmet?.priority?.toString() || ''}
    ${helmet?.meta?.toString() || ''}
    ${helmet?.link?.toString() || ''}
    ${helmet?.script?.toString() || ''}
  `;

  return { html, head };
}
