import { procedure, protectedProcedure, router } from '@/backend/actions/trpc'
import { z } from 'zod'

export const pasteRouter = router({
  greeting: protectedProcedure
    .query(({ ctx, input }) => `Hello, ${ctx.session?.user.name}!`),
})

export type PasteRouter = typeof pasteRouter
