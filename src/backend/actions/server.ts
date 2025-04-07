import 'server-only'
import { auth } from '@/auth'
import { headers } from 'next/headers'

import { appRouter } from './routes'

export const action = appRouter.createCaller(
  async () => {
    const requestHeaders = await headers()
    const session = await auth()

    return {
      headers: requestHeaders,
      session,
    }
  }
)
