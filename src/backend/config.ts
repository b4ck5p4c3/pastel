import { z } from 'zod'

const schema = z.object({
  AUTH_BKSPID_CLIENT_ID: z.string(),
  AUTH_BKSPID_ISSUER: z.string().url().default('https://id.bksp.in/oidc'),
  AUTH_SECRET: z.string(),
  NEXT_PUBLIC_APP_NAME: z.string(),
})

const environment = schema.parse(process.env)

export { environment }
