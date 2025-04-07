import { Provider } from 'next-auth/providers'

import { environment } from '../config'

export interface BkspIdSession {
  [claim: string]: unknown
  at_hash: string
  aud: string
  created_at: number
  email: string
  email_verified: boolean
  exp: number
  iat: number
  iss: string
  name: string
  picture: null | string
  sub: string
  updated_at: number
  username: string
}

export interface NewTokensSet {
  access_token: string
  expires_in: number
  refresh_token?: string
}

const BkspIdProvider: Provider<BkspIdSession> = {
  authorization: {
    params: { prompt: 'consent', scope: 'openid profile email offline_access' },
  },
  checks: ['pkce', 'state'],
  client: {
    token_endpoint_auth_method: 'none'
  },
  clientId: environment.AUTH_BKSPID_CLIENT_ID,
  id: 'bkspid',
  issuer: environment.AUTH_BKSPID_ISSUER,
  name: 'BKSP ID',
  type: 'oidc'
}

export async function refreshAccessToken (refreshToken: string): Promise<NewTokensSet> {
  const response = await fetch(`${environment.AUTH_BKSPID_ISSUER}/token`, {
    body: new URLSearchParams({
      client_id: environment.AUTH_BKSPID_CLIENT_ID,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
  })

  const tokensOrError = await response.json()
  if (!response.ok) {
    throw tokensOrError
  }

  return tokensOrError as NewTokensSet
}

export { BkspIdProvider }
