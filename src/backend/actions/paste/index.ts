'use server'

import { protectedProcedure } from '@/backend/trpc'

import { CreatePasteDto } from './dto/create.dto'
import { CreatePasteResponseDto } from './dto/create-response.dto'

export const createPaste = protectedProcedure
  .input(CreatePasteDto)
  .output(CreatePasteResponseDto)
  .mutation(async ({ ctx, input }) => {
    console.log(input)
    await (new Promise(res => setTimeout(res, 1000)))
    return {
      link: 'https://example.com/123456'
    }
  })
