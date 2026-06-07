import { headers } from 'next/headers'

import { auth } from '@/auth'

import { SignInButton } from './_components/sign-in-button'

export default async function NotFound () {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session) {
    return (
      <section className='flex flex-col h-full gap-6'>
        <span className='text-5xl font-serif py-1'>Paste not found.</span>
        <p className='text-xl'>You might have the wrong link or the paste expired.</p>
      </section>
    )
  }

  return (
    <section className='flex flex-col h-full gap-6'>
      <span className='text-5xl font-serif py-1'>Paste not found.</span>
      <p className='text-xl'>You might have the wrong link, paste might have expired, or it might be available only to residents.</p>
      <SignInButton />
    </section>
  )
}
