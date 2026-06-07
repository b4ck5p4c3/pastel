'use client'
import * as Sentry from '@sentry/nextjs'

const dsn = document.querySelector('meta[name="sentry-dsn"]')?.getAttribute('content')

if (dsn) {
  Sentry.init({
    dsn,
    integrations: [
      Sentry.replayIntegration(),
      Sentry.browserTracingIntegration(),
      Sentry.browserSessionIntegration()
    ],
    replaysOnErrorSampleRate: 1,
    tracesSampleRate: 1,
  })
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
