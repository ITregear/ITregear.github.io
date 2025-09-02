export { render };

import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { PageContextClient } from 'vite-plugin-ssr/types';

async function render(pageContext: PageContextClient) {
  const { Page, pageProps } = pageContext;
  const root = document.getElementById('root')!;
  
  hydrateRoot(root, <Page {...pageProps} />);
}
