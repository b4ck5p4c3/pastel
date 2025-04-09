'use server'

import { environment } from '@/backend/config'
import { redis } from '@/backend/connectors/redis'
import { procedure, protectedProcedure } from '@/backend/trpc'
import { randomBase32 } from '@/shared/utils/random'
import { TRPCError } from '@trpc/server'

import { CreatePasteDto } from './dto/create.dto'
import { CreatePasteResponseDto } from './dto/create-response.dto'
import { GetPasteDto } from './dto/get.dto'
import { PasteDetailsDto } from './dto/paste-details.dto'
import { PasteExpiration, PasteVisibility, SerialisedPasteMetadata } from './types'
import { PasteExpirationToSeconds } from './utils'

/**
 * Paste ID length in Base32 characters.
 *
 * This might be adjusted in the future, but remember that this app
 * is aimed at pretty limited audience. So 1% collision chance for 4K IDs
 * is tolerable. Simplicity over complexity, yopta.
 *
 * Brute-force attacks are also not a concern here.
 * You should use protected or encrypted pastes for sensitive data.
 */
const PASTE_ID_LENGTH = 6

export const createPaste = protectedProcedure
  .input(CreatePasteDto)
  .output(CreatePasteResponseDto)
  .mutation(async ({ ctx, input }) => {
    // Reserve a Paste ID
    const pasteId = randomBase32(PASTE_ID_LENGTH)
    const reservation = await redis.sadd('paste_ids', pasteId)
    if (reservation === 0) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'You are lucky today – collision occured! Please try again.',
      })
    }

    // Save paste's metadata
    const metadata = {
      createdAt: new Date().toISOString(),
      createdBy: ctx.user.id,
      expiration: input.expiration,
      metadata: {
        isEncrypted: input.metadata.isEncrypted,
        syntaxLanguage: input.metadata.syntaxLanguage,
      },
      visibility: input.visibility,
    } satisfies SerialisedPasteMetadata

    // Save paste's content
    const ttl = PasteExpirationToSeconds.get(input.expiration)
    if (ttl === undefined) {
      await redis.set(`paste:${pasteId}`, JSON.stringify(metadata))
      await redis.set(`paste_content:${pasteId}`, input.content)
    } else {
      await redis.set(`paste:${pasteId}`, JSON.stringify(metadata), 'EX', ttl)
      await redis.set(`paste_content:${pasteId}`, input.content, 'EX', ttl)
    }

    // Return link to the paste
    const link = new URL(pasteId, environment.NEXT_PUBLIC_BASE_URL)
    return {
      link: link.toString()
    }
  })

export const getPaste = procedure
  .input(GetPasteDto)
  .output(PasteDetailsDto)
  .query(async ({ ctx, input }) => {
    // Get paste metadata
    const rawMeta = await redis.get(`paste:${input.id}`)
    if (rawMeta === null) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Paste either expired, not found, or you are not allowed to see it.',
      })
    }

    const meta = JSON.parse(rawMeta) as SerialisedPasteMetadata
    if (!ctx.user && meta.visibility === PasteVisibility.ResidentsOnly) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Paste either expired, not found, or you are not allowed to see it.',
      })
    }

    let content: null | string = null
    let expiresAt: Date | null = null

    // Handle single-view paste
    if (meta.expiration === PasteExpiration.AfterFirstRead) {
      if (input.confirmReveal) {
        content = await redis.get(`paste_content:${input.id}`)
        await redis.del(`paste_content:${input.id}`)
        await redis.del(`paste:${input.id}`)
      }
    } else {
      content = await redis.get(`paste_content:${input.id}`)
    }

    // Calculate TTL for pastes with expiration time
    if (meta.expiration !== PasteExpiration.Never && meta.expiration !== PasteExpiration.AfterFirstRead) {
      const ttl = await redis.ttl(`paste:${input.id}`)
      if (ttl >= 0) {
        expiresAt = new Date(Date.now() + ttl * 1000)
      }
    }

    return {
      content,
      expiration: meta.expiration,
      expiresAt,
      id: input.id,
      metadata: {
        isEncrypted: meta.metadata.isEncrypted,
        syntaxLanguage: meta.metadata.syntaxLanguage,
      },
      visibility: meta.visibility,
    }
  })
