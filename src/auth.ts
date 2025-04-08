import NextAuth from 'next-auth'
import 'next-auth/jwt'
import { JWT } from 'next-auth/jwt'

import { BkspIdProvider, refreshAccessToken } from './backend/auth/provider'

declare module 'next-auth' {
  interface Session {
    error?: 'RefreshTokenError' | undefined
    expires: string
    user: {
      email: string
      id: string
      image: null | string
      name: string
      username: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    email: string
    error: 'AccountNotLinked' | 'RefreshTokenError' | undefined
    expires_at: number
    name: string
    picture: null | string
    refresh_token: null | string
    sub: string
    username: string
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    jwt: async ({ account, profile, token }) => {
      // Sign In: fetched Access token
      if (account) {
        if (profile) {
          // Check that crucial fields are available
          if (!profile.email || !profile.name || !profile.sub || !profile.username) {
            token.error = 'AccountNotLinked'
            return token
          }

          return {
            email: profile.email as string,
            error: undefined,
            expires_at: account.expires_at as number,
            name: profile.name as string,
            picture: profile.picture as null | string,
            refresh_token: account.refresh_token as null | string,
            sub: profile.sub as string,
            username: profile.username as string,
          } satisfies JWT
        }

        return {
          ...token,
          expires_at: account.expires_at as number,
          refresh_token: account.refresh_token ?? null,
        } satisfies JWT
      }

      // Return access token if it is still valid
      if (Date.now() <= token.expires_at * 1000) {
        return token
      }

      // Access Token is expired, but refresh token is unavailable
      const refreshToken = token['refresh_token'] as string | undefined
      if (!refreshToken) {
        token.error = 'RefreshTokenError'
        return token
      }

      // Attempt to renew access token
      try {
        const set = await refreshAccessToken(refreshToken)
        token.access_token = set.access_token
        token.exp = Math.floor(Date.now() / 1000 + set.expires_in)

        // Some providers only issue refresh tokens once, so preserve if we did not get a new one
        if (set.refresh_token) {
          token.refresh_token = set.refresh_token
        }

        return token
      } catch {
        token.error = 'RefreshTokenError'
        return token
      }
    },
    session: ({ token }) => {
      return {
        error: token.error,
        expires: new Date(token.expires_at * 1000).toISOString(),
        user: {
          email: token.email,
          id: token.sub,
          image: token.picture,
          name: token.name,
          username: token.username,
        }
      }
    },
  },
  pages: {
    signIn: '/api/sso-sign-in',
  },
  providers: [BkspIdProvider],
  trustHost: true,
})
