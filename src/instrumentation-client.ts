// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'
import { env } from 'next-runtime-env'

const dsn = env('NEXT_PUBLIC_SENTRY_DSN')

if (dsn) {
  Sentry.init({
    dsn,
    integrations: [Sentry.replayIntegration()],
    replaysOnErrorSampleRate: 1,
    replaysSessionSampleRate: 0.5,
    tracesSampleRate: 1,
  })
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
