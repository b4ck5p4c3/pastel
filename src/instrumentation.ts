import type { TRPC_ERROR_CODE_KEY } from '@trpc/server/unstable-core-do-not-import'

import * as Sentry from '@sentry/nextjs'

const TRPC_ERRORS_TO_SKIP: Set<TRPC_ERROR_CODE_KEY> = new Set([
  'FORBIDDEN',
  'NOT_FOUND',
  'UNAUTHORIZED'
])

export async function register () {
  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      beforeSend (event, hint) {
        // Catch TRPC errors
        const code = (hint?.originalException as { code?: TRPC_ERROR_CODE_KEY } | undefined)?.code
        if (code && TRPC_ERRORS_TO_SKIP.has(code)) {
          return null
        }

        return event
      },
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      integrations: [Sentry.redisIntegration()],
      tracesSampleRate: 1,
    })
  }
}

export const onRequestError = Sentry.captureRequestError
