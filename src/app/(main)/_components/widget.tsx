'use client'

import { Autocomplete, AutocompleteItem, Button } from '@heroui/react'
import { useState } from 'react'

import AdvancedOptionsModal from './advanced-modal'
import Editor from './editor'

const DEFAULT_LANGUAGE = 'plaintext'

const CreatePasteWidget: React.FC = () => {
  const [selectedLanguage, selectLanguage] = useState<string>(DEFAULT_LANGUAGE)
  const [supportedLanguages, setSupportedLanguages] = useState<string[]>([])
  const [code, setCode] = useState<string>('')
  const [isAdvancedModalOpen, setAdvancedModal] = useState<boolean>(false)

  const confirm = () => {
    setAdvancedModal(false)
  }

  return (
    <>
      <section className='flex flex-col h-full gap-6'>
        <Editor language={selectedLanguage} onChange={setCode} onLanguagesListChange={setSupportedLanguages} />
        <section className='flex flex-row justify-between items-center'>
          <section className='flex gap-4'>
            <Button color='success' size='lg' variant='bordered'>
              Publish for one hour
            </Button>
            <Button color='secondary' onPress={() => setAdvancedModal(true)} size='lg' variant='light'>
              More…
            </Button>
          </section>
          <Autocomplete
            className='max-w-xs'
            onSelectionChange={lang => lang && selectLanguage(lang as string)}
            selectedKey={selectedLanguage}
            size='lg'
            value={selectedLanguage}
          >
            {supportedLanguages.map((lang) => (
              <AutocompleteItem key={lang}>{lang}</AutocompleteItem>
            ))}
          </Autocomplete>
        </section>
      </section>
      <AdvancedOptionsModal isOpen={isAdvancedModalOpen} onClose={() => setAdvancedModal(false)} onConfirm={confirm} />
    </>
  )
}

export default CreatePasteWidget
