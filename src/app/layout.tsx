import type { Metadata } from 'next'

import { auth } from '@/auth'

import './globals.css'

// eslint-disable-next-line camelcase -- that's how the font is named
import { Onest, Yeseva_One } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'

import Navbar from './_components/global-navbar'
import RuntimeEnvironment from './_components/runtime-environment'
import { Providers } from './providers'

const onest = Onest({
  display: 'swap',
  subsets: ['latin', 'cyrillic'],
  variable: '--font-onest',
  weight: ['400'],
})

const yeseva = Yeseva_One({
  display: 'swap',
  subsets: ['latin', 'cyrillic'],
  variable: '--font-yeseva-one',
  weight: ['400'],
})

export default async function RootLayout ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <meta
          content='minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no'
          name='viewport'
        />
        <meta content='Pastel' name='apple-mobile-web-app-title' />
        <link href='icons/apple-icon.png' rel='apple-touch-icon' />
        <link href='icons/favicon.png' rel='icon' type='image/png' />
        <RuntimeEnvironment />
      </head>
      <body className={`font-sans ${onest.variable} ${yeseva.variable}`}>
        <SessionProvider session={session}>
          <Providers>
            <div className='relative flex flex-col h-screen'>
              <Navbar />
              <main className='container xl:max-w-screen-lg mx-auto pt-6 px-6 flex-grow'>
                {children}
              </main>
            </div>
          </Providers>
        </SessionProvider>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
  title: 'Pastel'
}

export const dynamic = 'force-dynamic'
