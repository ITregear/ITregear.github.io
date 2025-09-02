import type { PageContextServer } from 'vite-plugin-ssr/types';
import fs from 'fs';
import path from 'path';
import fm from 'front-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getThoughtsImageUrl(imageName: string): string | null {
  const thoughtsImagesPath = path.resolve(__dirname, '../../../src/assets/thoughts/images');
  const imagePath = path.join(thoughtsImagesPath, imageName);
  
  if (fs.existsSync(imagePath)) {
    return `/src/assets/thoughts/images/${imageName}`;
  }
  return null;
}

function extractFirstImage(content: string): string | null {
  const relativeImageMatch = content.match(/!\[.*?\]\(\.\/images\/(.*?)\)/);
  if (relativeImageMatch) {
    const imageUrl = getThoughtsImageUrl(relativeImageMatch[1]);
    if (imageUrl) {
      return `https://ivantregear.com${imageUrl}`;
    }
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

function createCleanDescription(content: string, title: string): string {
  let text = content
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/---+/g, '')
    .replace(/\n+/g, ' ')
    .trim();

  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  let description = '';
  
  for (const sentence of sentences) {
    const cleanSentence = sentence.trim();
    if (cleanSentence.length > 10 && !cleanSentence.toLowerCase().includes(title.toLowerCase().split(' ')[0])) {
      if (description.length + cleanSentence.length < 150) {
        description += (description ? '. ' : '') + cleanSentence;
      } else {
        break;
      }
    }
  }
  
  return description || text.substring(0, 150).trim();
}

export async function onBeforeRender(pageContext: PageContextServer) {
  const { slug } = pageContext.routeParams;
  
  try {
    const thoughtsDir = path.resolve(__dirname, '../../../src/assets/thoughts');
    const filePath = path.join(thoughtsDir, `${slug}.md`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`Article not found: ${slug}`);
    }
    
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const { attributes, body } = fm(rawContent);
    
    const processedBody = body.replace(/!\[(.*?)\]\(\.\/images\/(.*?)\)/g, (match, altText, imageName) => {
      const imageUrl = getThoughtsImageUrl(imageName);
      if (imageUrl) {
        return `![${altText}](${imageUrl})`;
      }
      console.warn(`Image not found: ${imageName}`);
      return match;
    });
    
    const article = {
      title: (attributes as any).title || slug.replace(/-/g, ' '),
      date: (attributes as any).date || '',
      content: processedBody,
      slug
    };
    
    const articleImage = extractFirstImage(article.content);
    const articleDescription = createCleanDescription(article.content, article.title);
    const defaultImage = "https://ivantregear.com/og-image.png";
    
    const pageProps = {
      article,
      meta: {
        title: `${article.title} - Ivan Tregear`,
        description: articleDescription,
        image: articleImage || defaultImage,
        url: `https://ivantregear.com/thoughts/${article.slug}`,
        type: 'article' as const,
        publishedTime: article.date,
        author: 'Ivan Tregear'
      }
    };
    
    return {
      pageContext: {
        pageProps
      }
    };
  } catch (error) {
    console.error('Error loading article:', error);
    throw error;
  }
}
