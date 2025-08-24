import { Metadata } from 'next'
// import { QueryClientProvider } from "@tanstack/react-query"
// import { queryClient } from "@/lib/queryClient"
// import { Toaster } from "@/components/ui/toaster"
// import { TooltipProvider } from "@/components/ui/tooltip"
// import { PostHogProvider } from 'posthog-js/react'
import "@/index.css"

export const metadata: Metadata = {
  title: {
    default: 'Ivan Tregear - Engineer & Entrepreneur',
    template: '%s - Ivan Tregear'
  },
  description: 'Personal website of Ivan Tregear, engineer and entrepreneur working on robotics and automation at KAIKAKU.',
  keywords: ['Ivan Tregear', 'engineer', 'entrepreneur', 'robotics', 'automation', 'KAIKAKU', 'Fusion', 'robot'],
  authors: [{ name: 'Ivan Tregear' }],
  creator: 'Ivan Tregear',
  metadataBase: new URL('https://ivantregear.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ivantregear.com/',
    siteName: 'Ivan Tregear',
    title: 'Ivan Tregear - Engineer & Entrepreneur',
    description: 'Personal website of Ivan Tregear, engineer and entrepreneur working on robotics and automation at KAIKAKU.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ivan Tregear - Engineer & Entrepreneur',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@IvanTregear',
    creator: '@IvanTregear',
    title: 'Ivan Tregear - Engineer & Entrepreneur',
    description: 'Personal website of Ivan Tregear, engineer and entrepreneur working on robotics and automation at KAIKAKU.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.png',
  },
}

function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {children}
    </div>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#8B4513" />
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
      </head>
      <body className="font-typewriter antialiased bg-vintage-beige text-typewriter-dark">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}
