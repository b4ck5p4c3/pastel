import { z } from 'zod'

import { PasteExpiration, PasteVisibility } from '../types'

export const PasteDetailsDto = z.object({
  /**
   * Paste content.
   * Plaintext, or encrypted if isEncrypted is true.
   * Might be null if the paste is single-view only and force flag is not set.
   */
  content: z.string().nullable(),

  /**
   * Initial paste expiration time.
   */
  expiration: z.nativeEnum(PasteExpiration),

  /**
   * ISO 8601 datetime string of the paste expiration time.
   * Null if the paste is kept forever or single-view only.
   */
  expiresAt: z.date().nullable(),

  /**
   * Metadata about the paste.
   */
  metadata: z.object({

    /**
     * Is the paste encrypted using age.
     */
    isEncrypted: z.boolean(),

    /**
     * Monaco editor language
     */
    syntaxLanguage: z.string(),
  }),

  /**
   * Paste visibility scope
   */
  visibility: z.nativeEnum(PasteVisibility)
})

export type PasteDetails = z.infer<typeof PasteDetailsDto>
