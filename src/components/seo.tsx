import { Helmet } from 'react-helmet-async';

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
  const structuredData = type === 'article' ? {
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
  } : {
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
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="author" content={author} />
      <meta name="keywords" content="Ivan Tregear, engineer, entrepreneur, robotics, automation, KAIKAKU, Fusion, robot" />
      <meta name="robots" content="index, follow" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:site_name" content="Ivan Tregear" />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:site" content="@IvanTregear" />
      <meta property="twitter:creator" content="@IvanTregear" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Article specific tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      
      {/* Additional SEO */}
      <meta name="theme-color" content="#8B4513" />
      <meta name="color-scheme" content="light" />
      <meta name="supported-color-schemes" content="light" />
    </Helmet>
  );
} 