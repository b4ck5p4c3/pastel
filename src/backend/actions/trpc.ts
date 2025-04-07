import type { Session } from 'next-auth'

import { Temporal } from '@js-temporal/polyfill'
import * as Sentry from '@sentry/nextjs'
import { initTRPC, TRPCError } from '@trpc/server'
import { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers'
import superjson from 'superjson'
import { ZodError } from 'zod'

interface Meta {
  span: string;
}

/* SuperJSON */
superjson.registerCustom(
  {
    deserialize: (v) => Temporal.PlainDate.from(v as Temporal.PlainDateLike),
    isApplicable: (v): v is Temporal.PlainDate => v instanceof Temporal.PlainDate,
    serialize: (v) => v.toJSON(),
  },
  'Temporal.PlainDate'
)

superjson.registerCustom(
  {
    deserialize: (v) => Temporal.PlainDateTime.from(v as Temporal.PlainDateTimeLike),
    isApplicable: (v): v is Temporal.PlainDateTime => v instanceof Temporal.PlainDateTime,
    serialize: (v) => v.toJSON(),
  },
  'Temporal.PlainDateTime'
)

/* TRPC */
export const t = initTRPC
  .meta<Meta>()
  .context<{
    headers: ReadonlyHeaders;
    session: null | Session;
  }>()
  .create({
    errorFormatter (options) {
      const { error, shape } = options
      return {
        ...shape,
        data: {
          ...shape.data,
          zodError:
            error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
              ? error.cause.flatten()
              : null,
        },
      }
    },
    transformer: superjson,
  })

const sentryMiddleware = t.middleware(
  Sentry.trpcMiddleware({
    attachRpcInput: true,
  })
)

export const procedure = t.procedure.use(sentryMiddleware)
export const router = t.router

export const protectedProcedure = t.procedure.use((options) => {
  const { ctx } = options
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to do this',
    })
  }

  return options.next({
    ctx: {
      headers: ctx.headers,
      session: ctx.session,
    }
  })
})
