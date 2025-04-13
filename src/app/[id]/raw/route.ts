import { getPaste } from '@/backend/actions/paste'
import { PasteExpiration } from '@/backend/actions/paste/types'
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

    return new Response(paste.content, {
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': 'text/plain'
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
