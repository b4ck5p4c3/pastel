import { getPaste } from '@/backend/actions/paste'
import { notFound } from 'next/navigation'

import PasteView from './_components/paste-view'

export default async function PasteViewPage (
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Drop all non-zbase32 strings
  if (!/^[ybndrfg8ejkmcpqxot1uwisza345h769]{6}$/.test(id)) {
    notFound()
  }

  const paste = await getPaste({ id })
  return <PasteView id={id} paste={paste} />
}
