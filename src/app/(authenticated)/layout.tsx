import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function AuthenticatedLayout ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  if (!session) {
    redirect('/api/sso-sign-in')
  }

  return (
    <div className='relative flex flex-col h-screen'>
      <main className='container xl:max-w-screen-lg mx-auto pt-6 px-6 flex-grow'>
        {children}
      </main>
    </div>
  )
}

export const dynamic = 'force-dynamic'
