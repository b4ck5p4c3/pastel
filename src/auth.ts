import { betterAuth } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'
import { genericOAuth } from 'better-auth/plugins'

import { environment } from './backend/config'

export const auth = betterAuth({
  advanced: {
    trustedProxyHeaders: true,
  },
  appName: 'Pastel',
  basePath: '/api/auth',
  baseURL: environment.NEXT_PUBLIC_BASE_URL,
  logger: {
    level: 'debug'
  },
  plugins: [
    nextCookies(),
    genericOAuth({
      config: [
        {
          clientId: environment.AUTH_BKSPID_CLIENT_ID,
          discoveryUrl: environment.AUTH_BKSPID_ISSUER + '/.well-known/openid-configuration',
          issuer: environment.AUTH_BKSPID_ISSUER,
          pkce: true,
          providerId: 'bkspid',
          scopes: ['openid', 'profile', 'email', 'username'],
        },
      ]
    })
  ],
  secret: environment.AUTH_SECRET,
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 8, // 8 hours
      refreshCache: true,
      strategy: 'jwe',
      version: '1',
    },
  }
})
