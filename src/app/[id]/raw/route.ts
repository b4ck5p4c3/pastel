import { getPaste } from '@/backend/actions/paste'
import { PasteExpiration } from '@/backend/actions/paste/types'
import { languageToMimeType } from '@/shared/utils/mime-types'
import { TRPCError } from '@trpc/server'
import { getHTTPStatusCodeFromError } from '@trpc/server/unstable-core-do-not-import'

export async function GET (
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const paste = await getPaste({
      confirmReveal: false,
      id
    })

    // Encrypted or single-view pastes cannot be viewed in raw mode
    if (paste.metadata.isEncrypted || paste.expiration === PasteExpiration.AfterFirstRead) {
      return new Response(null, {
        status: 412,
      })
    }

    const mimeType = languageToMimeType.get(paste.metadata.syntaxLanguage) ?? 'text/plain'
    let cacheControl = ''

    if (paste.expiration === PasteExpiration.Never) {
      // 1 year for non-expiring pastes
      cacheControl = 'private, max-age=31536000, immutable'
    } else if (paste.expiresAt === null) {
      // no caching for single-view pastes
      cacheControl = 'no-store'
    } else {
      // Calculate when the paste expires
      const expiresAt = Math.max(0, Math.floor(paste.expiresAt.getTime() - Date.now() / 1000))
      cacheControl = `private, max-age=${expiresAt}`
    }

    return new Response(paste.content, {
      headers: {
        'Cache-Control': cacheControl,
        'Content-Type': `${mimeType}; charset=utf-8`
      },
      status: 200
    })
  } catch (error) {
    if (error instanceof TRPCError) {
      const status = getHTTPStatusCodeFromError(error)
      return new Response(null, { status })
    }

    throw error
  }
}
