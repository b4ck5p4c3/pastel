'use server'

import { protectedProcedure } from '@/backend/trpc'

export const greeting = protectedProcedure
  .query(async ({ ctx }) => {
    const { user } = ctx

    return {
      message: `Hello ${user.name}`,
    }
  })
