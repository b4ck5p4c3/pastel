'use client'
import * as Sentry from '@sentry/nextjs'

declare global {
  interface Window {
    __ENV?: Record<string, string>
  }
}

// eslint-disable-next-line unicorn/prefer-global-this -- it's easier to keep focus on FE
const dsn = window.__ENV?.NEXT_PUBLIC_SENTRY_DSN

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
