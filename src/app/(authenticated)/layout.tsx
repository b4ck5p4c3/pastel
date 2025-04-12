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

  return children
}

export const dynamic = 'force-dynamic'
