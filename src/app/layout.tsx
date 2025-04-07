import type { Metadata } from 'next'

import { auth } from '@/auth'

import './globals.css'

import { Onest, Yeseva_One } from 'next/font/google'
import { redirect } from 'next/navigation'
import { SessionProvider } from 'next-auth/react'

import Navbar from './_components/global-navbar'
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
  if (!session?.user) {
    redirect('/api/sso-sign-in')
  }

  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <meta
          content='minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no'
          name='viewport'
        />
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
  title: 'Pastel',
}
