export { render };
export { passToClient };
export { onBeforePrerenderStart };

import { renderToString } from 'react-dom/server';
import { PageContextServer } from 'vite-plugin-ssr/types';
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr/server';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const passToClient = ['pageProps', 'routeParams'];

async function render(pageContext: PageContextServer) {
  const { Page, pageProps } = pageContext;
  
  if (!pageProps?.meta) {
    return escapeInject`<!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Ivan Tregear</title>
        </head>
        <body>
          <div id="root">${dangerouslySkipEscape(renderToString(<Page {...pageProps} />))}</div>
        </body>
      </html>`;
  }

  const { meta } = pageProps;
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": meta.title,
    "description": meta.description,
    "image": meta.image,
    "author": {
      "@type": "Person",
      "name": meta.author
    },
    "publisher": {
      "@type": "Person",
      "name": "Ivan Tregear"
    },
    "datePublished": meta.publishedTime,
    "dateModified": meta.publishedTime,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": meta.url
    }
  };

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        <!-- Primary Meta Tags -->
        <title>${meta.title}</title>
        <meta name="title" content="${meta.title}" />
        <meta name="description" content="${meta.description}" />
        <meta name="author" content="${meta.author}" />
        <meta name="keywords" content="Ivan Tregear, engineer, entrepreneur, robotics, automation, KAIKAKU, Fusion, robot" />
        <meta name="robots" content="index, follow" />
        
        <!-- Open Graph / Facebook -->
        <meta property="og:site_name" content="Ivan Tregear" />
        <meta property="og:type" content="${meta.type}" />
        <meta property="og:url" content="${meta.url}" />
        <meta property="og:title" content="${meta.title}" />
        <meta property="og:description" content="${meta.description}" />
        <meta property="og:image" content="${meta.image}" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />
        
        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:site" content="@IvanTregear" />
        <meta property="twitter:creator" content="@IvanTregear" />
        <meta property="twitter:url" content="${meta.url}" />
        <meta property="twitter:title" content="${meta.title}" />
        <meta property="twitter:description" content="${meta.description}" />
        <meta property="twitter:image" content="${meta.image}" />
        
        <!-- Article specific tags -->
        <meta property="article:published_time" content="${meta.publishedTime}" />
        <meta property="article:author" content="${meta.author}" />
        
        <!-- Canonical URL -->
        <link rel="canonical" href="${meta.url}" />
        
        <!-- Structured Data -->
        <script type="application/ld+json">
          ${dangerouslySkipEscape(JSON.stringify(structuredData))}
        </script>
        
        <!-- Additional SEO -->
        <meta name="theme-color" content="#8B4513" />
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
        
        <!-- Favicon -->
        <link rel="icon" href="/favicon.png" />
      </head>
      <body>
        <div id="root">${dangerouslySkipEscape(renderToString(<Page {...pageProps} />))}</div>
      </body>
    </html>`;

  return documentHtml;
}

function onBeforePrerenderStart() {
  const thoughtsDir = path.resolve(__dirname, '../src/assets/thoughts');
  
  if (!fs.existsSync(thoughtsDir)) {
    console.warn('Thoughts directory not found:', thoughtsDir);
    return [];
  }
  
  const files = fs.readdirSync(thoughtsDir);
  const markdownFiles = files.filter(file => file.endsWith('.md'));
  
  const urls = markdownFiles.map(file => {
    const slug = file.replace('.md', '');
    return `/thoughts/${slug}`;
  });
  
  console.log('Prerendering thoughts pages:', urls);
  return urls;
}
