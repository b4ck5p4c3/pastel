'use client'

import { getPaste } from '@/backend/actions/paste'
import { addToast, Button } from '@heroui/react'
import { useState } from 'react'

export type RevealProperties = {
  id: string
  onContentRevealed: (content: string) => void
}

const Reveal: React.FC<RevealProperties> = ({ id, onContentRevealed }) => {
  const [isLoading, setIsLoading] = useState(false)

  const revealContent = async () => {
    setIsLoading(true)
    try {
      const pasteRequest = await getPaste({
        confirmReveal: true,
        id,
      })

      onContentRevealed(pasteRequest.content as string)
    } catch (error) {
      addToast({
        color: 'danger',
        description: `Failed to reveal content: ${error}`,
        title: 'Error'
      })
    }
    setIsLoading(false)
  }

  return (
    <section className='flex flex-col h-full gap-6'>
      <span className='text-5xl font-serif mask-r-from-10% py-1'>This Paste is disappearing</span>
      <p className='text-xl'>You really want to see it? You won't be able to do it again.</p>
      <Button
        className='max-w-xs'
        color='secondary'
        isLoading={isLoading}
        onPress={revealContent}
        size='lg'
        variant='ghost'
      >Yeah, go ahead
      </Button>
    </section>
  )
}

export default Reveal
