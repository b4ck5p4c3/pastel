'use client'

import type { PasteDetails } from '@/backend/actions/paste/dto/paste-details.dto'

import { PasteExpiration, PasteVisibility } from '@/backend/actions/paste/types'
import { Button, Link } from '@heroui/react'
import { useEffect, useRef, useState } from 'react'

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
  const [rawUrl, setRawUrl] = useState<null | string>(null)
  const copyButtonReference = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (
      paste.visibility === PasteVisibility.Public &&
      paste.expiration !== PasteExpiration.AfterFirstRead &&
      !paste.metadata.isEncrypted
    ) {
      setRawUrl(globalThis.location.href + '/raw')
    }
  }, [paste])

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

  useEffect(() => {
    copyButtonReference.current?.focus?.()
  }, [copyButtonReference])

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
