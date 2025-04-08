// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  dsn: 'https://4736411fc89cd1147b7accdeefef82c1@sentry.p.bksp.in/5',

  // Add optional integrations for additional features
  integrations: [
    Sentry.replayIntegration(),
  ],

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
})

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
