import { auth } from '@/auth'
import { Temporal } from '@js-temporal/polyfill'
import * as Sentry from '@sentry/nextjs'
import { initTRPC, TRPCError } from '@trpc/server'
// eslint-disable-next-line camelcase -- this is an experimental feature
import { experimental_nextAppDirCaller } from '@trpc/server/adapters/next-app-dir'
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

export const procedure = t.procedure
  .use(sentryMiddleware)
  .experimental_caller(
    experimental_nextAppDirCaller({
      // pathExtractor: ({ meta }) => (meta as Meta).span,
    })
  )
  .use(async (options) => {
    const session = await auth()
    return options.next({ ctx: { user: session?.user ?? null } })
  })

export const protectedProcedure = procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to do this',
    })
  }

  return next({
    ctx: {
      user: ctx.user as Exclude<typeof ctx.user, null>
    }
  })
})
