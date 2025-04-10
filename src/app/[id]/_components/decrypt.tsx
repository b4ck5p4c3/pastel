'use client'

import { decrypt } from '@/app/(authenticated)/_utils/encryption'
import { Button, Input } from '@heroui/react'
import { useEffect, useRef, useState } from 'react'

export type PasteDecryptProperties = {
  content: string
  onDecrypt: (content: string) => void
}

const PasteDecrypt: React.FC<PasteDecryptProperties> = ({ content, onDecrypt }) => {
  const [isGlobalLoading, setGlobalLoading] = useState(true)
  const [isInputLoading, setInputLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)
  const keyInputField = useRef<HTMLInputElement>(null)

  // Attempt decryption using password from URL hash
  useEffect(() => {
    const key = globalThis?.location?.hash?.slice(1)
    if (!key) {
      setGlobalLoading(false)
      return
    }

    (async () => {
      try {
        const decrypted = await decrypt(key, content)
        onDecrypt(decrypted)
      } catch {
        setError('Invalid key')
        if (keyInputField.current) {
          keyInputField.current.value = key
          keyInputField.current.focus()
        }
      } finally {
        setGlobalLoading(false)
      }
    })()
  }, [globalThis?.location?.hash])

  const attemptDecrypt = async () => {
    setInputLoading(true)
    let key = keyInputField.current?.value
    if (!key) {
      setError('Key is required')
      setInputLoading(false)
      keyInputField.current?.focus()
      return
    }

    // User might have pasted the key with a leading #
    if (key.startsWith('#')) {
      key = key.slice(1)
    }

    try {
      const decrypted = await decrypt(key, content)
      onDecrypt(decrypted)
    } catch {
      setError('Invalid key')
      keyInputField.current?.focus()
    } finally {
      setInputLoading(false)
    }
  }

  if (isGlobalLoading) {
    return (
      <section className='flex flex-col h-full gap-6'>
        <span className='text-5xl font-serif'>Decrypting...</span>
      </section>
    )
  }

  return (
    <section className='flex flex-col h-full gap-6'>
      <span className='text-5xl font-serif'>This Paste is encrypted</span>
      <Input
        className='max-w-xs'
        errorMessage={error}
        isInvalid={!!error}
        placeholder='Paste the key here'
        readOnly={isInputLoading}
        ref={keyInputField}
        size='lg'
        type='password'
      />
      <Button
        className='max-w-xs'
        color='secondary'
        isDisabled={isInputLoading}
        isLoading={isInputLoading}
        onPress={attemptDecrypt}
        size='lg'
        variant='ghost'
      >Decrypt
      </Button>
    </section>
  )
}

export default PasteDecrypt
