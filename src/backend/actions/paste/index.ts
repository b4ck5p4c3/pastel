'use server'

import { protectedProcedure } from '@/backend/trpc'
import { z } from 'zod'

export const createPaste = protectedProcedure
  .input(z.object)
