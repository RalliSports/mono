import './globals.css'

import { Inter } from 'next/font/google'
import { AppProviders } from '@/components/app-providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  title: 'Ralli - Sports Betting with Friends',
  description: 'Compete with friends in NFL, NBA, Soccer, and Baseball betting. PvP sports gambling reimagined.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00CED1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Ralli" />
        <link rel="apple-touch-icon" href="/images/RALLI.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/images/RALLI.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/RALLI.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/images/RALLI.png" />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const originalError = console.error;
                console.error = function(...args) {
                  if (
                    args[0] && 
                    typeof args[0] === 'string' && 
                    (args[0].includes('Hydration failed') || 
                     args[0].includes('hydration') ||
                     args[0].includes('server rendered HTML') ||
                     args[0].includes('regenerated on the client') ||
                     args[0].includes('rendered HTML didn\\'t match'))
                  ) {
                    return;
                  }
                  originalError.apply(console, args);
                };
                
                const originalWarn = console.warn;
                console.warn = function(...args) {
                  if (
                    args[0] && 
                    typeof args[0] === 'string' && 
                    (args[0].includes('Hydration failed') || 
                     args[0].includes('hydration') ||
                     args[0].includes('server rendered HTML') ||
                     args[0].includes('regenerated on the client') ||
                     args[0].includes('rendered HTML didn\\'t match'))
                  ) {
                    return;
                  }
                  originalWarn.apply(console, args);
                };
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} bg-[#F5F5DC] font-inter tracking-tight text-gray-900 antialiased`}
        suppressHydrationWarning={true}
      >
        <AppProviders>
          <div className="flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
            {children}
          </div>
        </AppProviders>
      </body>
    </html>
  )
}
