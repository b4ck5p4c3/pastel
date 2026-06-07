'use client'

import { Button, Link } from '@heroui/react'
import { useEffect, useRef, useState } from 'react'

import type { PasteDetails } from '@/backend/actions/paste/dto/paste-details.dto'

import { PasteExpiration, PasteVisibility } from '@/backend/actions/paste/types'

import PasteDecrypt from './decrypt'
import Reveal from './reveal'
import Snippet from './snippet'

export interface PasteViewProperties {
  id: string
  paste: PasteDetails
}

const PasteView: React.FC<PasteViewProperties> = ({ id, paste }) => {
  const [isDecrypted, setIsDecrypted] = useState(!paste.metadata.isEncrypted)
  const [content, setContent] = useState(paste.content)
  const [copyButtonLabel, setCopyButtonLabel] = useState('Copy')
  const copyButtonReference = useRef<HTMLButtonElement>(null)

  // Raw url is only available for public, non-encrypted pastes, which are not destroy-on-read.
  const rawUrl =
    paste.visibility === PasteVisibility.Public &&
    paste.expiration !== PasteExpiration.AfterFirstRead &&
    !paste.metadata.isEncrypted
      ? globalThis.location.href + '/raw'
      : null

  useEffect(() => {
    copyButtonReference.current?.focus?.()
  }, [copyButtonReference])

  const handleContentCopy = () => {
    if (content === null) {
      return
    }

    navigator.clipboard.writeText(content)
    setCopyButtonLabel('Copied!')
  }

  if (content === null) {
    return <Reveal id={id} onContentRevealed={setContent} />
  }

  if (!isDecrypted) {
    return (
      <PasteDecrypt
        content={content}
        onDecrypt={(decrypted) => {
          setContent(decrypted)
          setIsDecrypted(true)
        }}
      />
    )
  }

  return (
    <section className='flex flex-col h-full gap-6'>
      <Snippet content={content} language={paste.metadata.syntaxLanguage} />
      <section className='flex flex-row gap-6'>
        <Button
          color='secondary'
          onPress={handleContentCopy}
          ref={copyButtonReference}
          size='md'
          variant='solid'
        >
          {copyButtonLabel}
        </Button>
        {rawUrl && <Link href={rawUrl} isExternal rel='noreferrer' showAnchorIcon target='_blank'>Raw</Link>}
      </section>
    </section>
  )
}

export default PasteView
