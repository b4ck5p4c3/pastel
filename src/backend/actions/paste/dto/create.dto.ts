import { z } from 'zod'

import { PasteExpiration, PasteVisibility } from '../types'

export const CreatePasteDto = z.object({
  /**
   * Paste content.
   * Plaintext, or encrypted if isEncrypted is true.
   */
  content: z.string(),

  /**
   * Paste expiration time.
   */
  expiration: z.nativeEnum(PasteExpiration),

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
