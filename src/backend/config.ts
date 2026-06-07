import { z } from 'zod'

function trimTrailingSlash (url: string): string {
  return url.replace(/\/+$/, '')
}

const schema = z.object({
  AUTH_BKSPID_CLIENT_ID: z.string(),
  AUTH_BKSPID_ISSUER: z
    .string()
    .default('https://id.bksp.in/oidc')
    .transform(trimTrailingSlash),
  AUTH_SECRET: z.string(),
  NEXT_PUBLIC_APP_NAME: z.string(),
  NEXT_PUBLIC_BASE_URL: z
    .string()
    .default('http://localhost:3000')
    .transform(trimTrailingSlash),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  REDIS_URL: z.string().default('redis://localhost:6379/0'),
})

const environment = process.env.BUILD === '1'
  ? {} as z.infer<typeof schema>
  : schema.parse(process.env)

export { environment }
