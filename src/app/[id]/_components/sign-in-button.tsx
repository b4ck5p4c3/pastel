'use client'

import { Button } from '@heroui/react'

import { authClient } from '@/auth-client'

export function SignInButton () {
  return (
    <Button
      className='max-w-xs'
      color='secondary'
      onPress={() => authClient.signIn.oauth2({ providerId: 'bkspid' })}
      size='lg'
      variant='ghost'
    >
      Sign in
    </Button>
  )
}
