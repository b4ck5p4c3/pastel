import { z } from 'zod'

export const CreatePasteResponseDto = z.object({
  /**
   * URL to the newly created Paste
   */
  link: z.string(),
})

export type CreatePasteResponse = z.infer<typeof CreatePasteResponseDto>
