import fs from 'fs';
import path from 'path';
import fm from 'front-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getThoughtsImageUrl(imageName, distDir) {
  // Look for the actual hashed filename in the dist directory
  const staticDir = path.join(distDir, 'assets');
  if (fs.existsSync(staticDir)) {
    const files = fs.readdirSync(staticDir);
    const hashedFile = files.find(file => file.startsWith(imageName.replace(/\.[^.]+$/, '')));
    if (hashedFile) {
      return `/assets/${hashedFile}`;
    }
  }
  return `/assets/${imageName}`;
}

function extractFirstImage(content, distDir) {
  const relativeImageMatch = content.match(/!\[.*?\]\(\.\/images\/(.*?)\)/);
  if (relativeImageMatch) {
    const imageUrl = getThoughtsImageUrl(relativeImageMatch[1], distDir);
    return `https://ivantregear.com${imageUrl}`;
  }
  
  const anyImageMatch = content.match(/!\[.*?\]\((.*?)\)/);
  if (anyImageMatch) {
    const imagePath = anyImageMatch[1];
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    if (imagePath.startsWith('/')) {
      return `https://ivantregear.com${imagePath}`;
    }
  }
  
  return null;
}

function createCleanDescription(content, title) {
  let text = content
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to plain text
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`([^`]+)`/g, '$1') // Remove code
    .replace(/---+/g, '') // Remove horizontal rules
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();

  // Split into sentences and clean them
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  let description = '';
  const maxLength = 300; // Increased from 150
  
  for (const sentence of sentences) {
    const cleanSentence = sentence.trim();
    const potentialDescription = description + (description ? '. ' : '') + cleanSentence;
    
    if (potentialDescription.length <= maxLength) {
      description = potentialDescription;
    } else {
      break;
    }
  }
  
  // If we don't have enough content, take the first part of the text
  if (description.length < 100) {
    description = text.substring(0, maxLength).trim();
    // Cut off at the last complete word
    const lastSpace = description.lastIndexOf(' ');
    if (lastSpace > 100) {
      description = description.substring(0, lastSpace);
    }
  }
  
  return description || 'Read this article by Ivan Tregear';
}

function generateHTML(article, distDir) {
  const articleImage = extractFirstImage(article.content, distDir);
  const articleDescription = createCleanDescription(article.content, article.title);
  const defaultImage = "https://ivantregear.com/og-image.png";
  
  const meta = {
    title: article.title,
    description: articleDescription,
    image: articleImage || defaultImage,
    url: `https://ivantregear.com/thoughts/${article.slug}`,
    type: 'article',
    publishedTime: article.date,
    author: 'Ivan Tregear'
  };

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

  return `<!DOCTYPE html>
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
    <meta property="og:image" content="${meta.image}" />
    <meta property="og:image:secure_url" content="${meta.image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${meta.title}" />
    <meta property="og:image:type" content="${meta.image.includes('.png') ? 'image/png' : 'image/jpeg'}" />
    <meta property="og:site_name" content="Ivan Tregear" />
    <meta property="og:type" content="${meta.type}" />
    <meta property="og:url" content="${meta.url}" />
    <meta property="og:title" content="${meta.title}" />
    <meta property="og:description" content="${meta.description}" />
    <meta property="og:locale" content="en_US" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:site" content="@IvanTregear" />
    <meta property="twitter:creator" content="@IvanTregear" />
    <meta property="twitter:url" content="${meta.url}" />
    <meta property="twitter:title" content="${meta.title}" />
    <meta property="twitter:description" content="${meta.description}" />
    <meta property="twitter:image" content="${meta.image}" />
    <meta property="twitter:image:alt" content="${meta.title}" />
    
    <!-- Article specific tags -->
    <meta property="article:published_time" content="${meta.publishedTime}" />
    <meta property="article:author" content="${meta.author}" />
    
    <!-- LinkedIn specific -->
    <meta name="linkedin:owner" content="Ivan Tregear" />
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${meta.url}" />
    
    <!-- Structured Data -->
    <script type="application/ld+json">
      ${JSON.stringify(structuredData)}
    </script>
    
    <!-- Additional SEO -->
    <meta name="theme-color" content="#8B4513" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    
    <!-- Favicon -->
    <link rel="icon" href="/favicon.png" />
    
    <!-- SPA Redirect for Human Users -->
    <script>
      // Detect if this is likely a bot/scraper vs human user
      function isBot() {
        const userAgent = navigator.userAgent.toLowerCase();
        const botPatterns = [
          'facebookexternalhit', 'twitterbot', 'linkedinbot', 'slackbot',
          'whatsapp', 'telegrambot', 'discordbot', 'googlebot', 'bingbot',
          'crawler', 'spider', 'scraper'
        ];
        return botPatterns.some(pattern => userAgent.includes(pattern));
      }
      
      // Only redirect human users to SPA (bots should stay on this HTML)
      if (!isBot()) {
        const path = window.location.pathname || '/';
        const normalizedPath = path.startsWith('/') ? path : '/' + path;
        const search = window.location.search || '';
        const target = '/#' + normalizedPath + search;
        window.location.replace(target);
      }
    </script>
  </head>
  <body>
    <div id="root">
      <!-- Minimal content for social scrapers -->
      <h1>${article.title}</h1>
      <p>${articleDescription}</p>
      <p>Published on ${new Date(article.date).toLocaleDateString()}</p>
      <p>Redirecting to full article...</p>
    </div>
  </body>
</html>`;
}

async function generateStaticHTML() {
  const thoughtsDir = path.resolve(__dirname, '../src/assets/thoughts');
  const distDir = path.resolve(__dirname, '../dist');
  
  if (!fs.existsSync(thoughtsDir)) {
    console.error('Thoughts directory not found:', thoughtsDir);
    return;
  }
  
  const files = fs.readdirSync(thoughtsDir);
  const markdownFiles = files.filter(file => file.endsWith('.md'));
  
  console.log(`Found ${markdownFiles.length} markdown files to process`);
  
  for (const file of markdownFiles) {
    const slug = file.replace('.md', '');
    const filePath = path.join(thoughtsDir, file);
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const { attributes, body } = fm(rawContent);
    
    const article = {
      title: attributes.title || slug.replace(/-/g, ' '),
      date: attributes.date || '',
      content: body,
      slug
    };
    
    const html = generateHTML(article, distDir);
    
    // Create directory structure
    const outputDir = path.join(distDir, 'thoughts', slug);
    fs.mkdirSync(outputDir, { recursive: true });
    
    // Write HTML file
    const outputFile = path.join(outputDir, 'index.html');
    fs.writeFileSync(outputFile, html);
    
    console.log(`Generated: ${outputFile}`);
  }
  
  console.log('Static HTML generation completed!');
}

generateStaticHTML().catch(console.error);
