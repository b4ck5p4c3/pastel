import type { NextConfig } from 'next'

import { withSentryConfig } from '@sentry/nextjs'

const config: NextConfig = {
  output: 'standalone'
}

export default withSentryConfig(config, {
  org: 'bksp',
  project: 'pastel',
  sentryUrl: 'https://sentry.p.bksp.in/',
  silent: !process.env.CI,
  tunnelRoute: '/monitoring',
  widenClientFileUpload: true,
})
