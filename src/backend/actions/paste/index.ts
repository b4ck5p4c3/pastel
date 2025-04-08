'use server'

import { protectedProcedure } from '@/backend/trpc'

export const createPaste = protectedProcedure.query(() => 'hello world')
