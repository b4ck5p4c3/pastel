// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  dsn: 'https://4736411fc89cd1147b7accdeefef82c1@sentry.p.bksp.in/5',

  integrations: [
    Sentry.redisIntegration(),
  ],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
})
