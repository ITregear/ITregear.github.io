import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

export default function SEO({
  title = "Ivan Tregear - Engineer & Entrepreneur",
  description = "Personal website of Ivan Tregear, engineer and entrepreneur working on robotics and automation at KAIKAKU.",
  image = "https://ivantregear.com/og-image.png",
  url = "https://ivantregear.com/",
  type = "website",
  publishedTime,
  modifiedTime,
  author = "Ivan Tregear"
}: SEOProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property?: string) => {
      const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', property);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Primary meta tags
    updateMetaTag('title', title);
    updateMetaTag('description', description);
    updateMetaTag('author', author);

    // Open Graph tags
    updateMetaTag('og:title', title, 'og:title');
    updateMetaTag('og:description', description, 'og:description');
    updateMetaTag('og:image', image, 'og:image');
    updateMetaTag('og:url', url, 'og:url');
    updateMetaTag('og:type', type, 'og:type');

    // Twitter tags
    updateMetaTag('twitter:title', title, 'twitter:title');
    updateMetaTag('twitter:description', description, 'twitter:description');
    updateMetaTag('twitter:image', image, 'twitter:image');
    updateMetaTag('twitter:url', url, 'twitter:url');

    // Article specific tags
    if (type === 'article' && publishedTime) {
      updateMetaTag('article:published_time', publishedTime, 'article:published_time');
    }
    if (type === 'article' && modifiedTime) {
      updateMetaTag('article:modified_time', modifiedTime, 'article:modified_time');
    }
    if (type === 'article' && author) {
      updateMetaTag('article:author', author, 'article:author');
    }

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // Add structured data
    const addStructuredData = (data: any) => {
      // Remove existing structured data
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Add new structured data
      const script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    };

    if (type === 'article') {
      // Article structured data
      addStructuredData({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "image": image,
        "author": {
          "@type": "Person",
          "name": author
        },
        "publisher": {
          "@type": "Person",
          "name": "Ivan Tregear"
        },
        "datePublished": publishedTime,
        "dateModified": modifiedTime || publishedTime,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": url
        }
      });
    } else {
      // Website structured data
      addStructuredData({
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Ivan Tregear",
        "jobTitle": "Chief Technology Officer",
        "worksFor": {
          "@type": "Organization",
          "name": "KAIKAKU"
        },
        "url": "https://ivantregear.com/",
        "sameAs": [
          "https://www.linkedin.com/in/ivantregear",
          "https://github.com/ITregear",
          "https://x.com/IvanTregear"
        ]
      });
    }

  }, [title, description, image, url, type, publishedTime, modifiedTime, author]);

  return null;
} 