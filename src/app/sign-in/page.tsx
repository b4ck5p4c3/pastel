'use client'

import { authClient } from '@/auth-client'

export default function SignInPage () {
  authClient.signIn.oauth2({
    providerId: 'bkspid',
  })
}
