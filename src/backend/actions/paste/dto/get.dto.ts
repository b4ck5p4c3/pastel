import { z } from 'zod'

export const GetPasteDto = z.object({
  /**
   * Confirmation flag to reveal single-view pastes content.
   * If set, the paste will be revealed to the user, and removed from the database.
   */
  confirmReveal: z.boolean().optional(),

  /**
   * Paste ID.
   * Must contain only ZBase32 characters, otherwise might lead to Redis key-injection.
   */
  id: z
    .string()
    .trim()
    .min(6)
    .regex(/^[ybndrfg8ejkmcpqxot1uwisza345h769]+$/)
})
