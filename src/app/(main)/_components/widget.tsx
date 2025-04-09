'use client'

import { createPaste } from '@/backend/actions/paste'
import { PasteExpiration, PasteVisibility } from '@/backend/actions/paste/types'
import { Autocomplete, AutocompleteItem, Button } from '@heroui/react'
import Monaco, { OnMount, useMonaco } from '@monaco-editor/react'
import { useEffect, useRef, useState } from 'react'

import { encrypt, generateUrlSafeKey } from '../_utils/encryption'
import AdvancedOptionsModal from './advanced-modal'
import PasteLinkModal from './link-modal'
import { PasteOptions } from './types'

const DEFAULT_LANGUAGE = 'plaintext'

const CreatePasteWidget: React.FC = () => {
  const monaco = useMonaco()
  const languageInputReference = useRef<HTMLInputElement>(null)

  const [editorContent, setEditorContent] = useState<string | undefined>()
  const [supportedLanguages, setSupportedLanguages] = useState<string[]>([])
  const [isAdvancedModalOpen, setAdvancedModalOpen] = useState<boolean>(false)
  const [selectedLanguage, selectLanguage] = useState<string>(DEFAULT_LANGUAGE)
  const [pasteLink, setPasteLink] = useState<null | string>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const saveAdvanced = async (properties: PasteOptions) => {
    if (editorContent === undefined) {
      return
    }

    if (properties.encrypt) {
      const key = await generateUrlSafeKey()
      const ciphertext = await encrypt(key, editorContent)
      const response = await createPaste({
        content: ciphertext,
        expiration: properties.expiration,
        metadata: {
          isEncrypted: properties.encrypt,
          syntaxLanguage: selectedLanguage,
        },
        visibility: properties.onlyResidents ? PasteVisibility.ResidentsOnly : PasteVisibility.Public
      })

      setPasteLink(`${response.link}#${key}`)
    } else {
      const response = await createPaste({
        content: editorContent,
        expiration: properties.expiration,
        metadata: {
          isEncrypted: properties.encrypt,
          syntaxLanguage: selectedLanguage
        },
        visibility: properties.onlyResidents ? PasteVisibility.ResidentsOnly : PasteVisibility.Public
      })

      setPasteLink(response.link)
    }
    setAdvancedModalOpen(false)
  }

  const saveQuick = async (content: string) => {
    setIsLoading(true)
    const response = await createPaste({
      content,
      expiration: PasteExpiration.OneHour,
      metadata: {
        isEncrypted: false,
        syntaxLanguage: selectedLanguage
      },
      visibility: PasteVisibility.Public
    })

    setPasteLink(response.link)
    setIsLoading(false)
  }

  // React to language change
  useEffect(() => {
    const model = monaco?.editor.getModels()[0]
    if (!model || !selectedLanguage) {
      return
    }

    // Update Monaco model
    monaco.editor.setModelLanguage(model, selectedLanguage)

    // Focus back on editor
    monaco.editor.getEditors()?.[0]?.focus()
  }, [monaco, selectedLanguage])

  // Prepare editor on load
  const handleEditorDidMount: OnMount = (editor, m) => {
    // Save paste on Cmd+Enter
    editor.addAction({
      id: 'pastel-create',
      keybindings: [m.KeyMod.CtrlCmd | m.KeyCode.Enter],
      label: 'Create Paste',
      run: (currentEditor) => {
        if (isLoading) {
          return
        }

        const content = currentEditor.getModel()?.getValue()
        if (content) {
          saveQuick(content)
        }
      },
    })

    // Jump to language selection on Cmd+K
    editor.addAction({
      id: 'pastel-language',
      keybindings: [m.KeyMod.CtrlCmd | m.KeyCode.KeyK],
      label: 'Select Language',
      run: () => {
        languageInputReference.current?.focus()
      },
    })

    // Update supported languages list
    setSupportedLanguages(m.languages.getLanguages().map((lang) => lang.id))

    // Trigger focus on editor area
    editor.focus()
  }

  return (
    <>
      <section className='flex flex-col h-full gap-6'>
        <Monaco
          className='bg-[#1e1e1e] rounded-sm p-4'
          height='80%'
          onChange={setEditorContent}
          onMount={handleEditorDidMount}
          options={{
            padding: {
              top: 16
            },
            renderLineHighlight: 'none',
            tabIndex: 0,
          }}
          theme='vs-dark'
        />
        <section className='flex flex-row justify-between items-center'>
          <section className='flex gap-4'>
            <Button color='success' isDisabled={editorContent === undefined} isLoading={isLoading} onPress={saveQuick} size='lg' tabIndex={2} variant='bordered'>
              Publish for one hour
              <span aria-hidden className='text-success-200 text-sm' hidden={isLoading}>⌘Enter</span>
            </Button>
            <Button color='secondary' isDisabled={isLoading} onPress={() => setAdvancedModalOpen(true)} size='lg' tabIndex={3} variant='light'>
              More…
            </Button>
          </section>
          <Autocomplete
            aria-label='Programming language for syntax highlighting'
            className='max-w-xs'
            endContent={<span aria-hidden className='select-none text-md text-gray-500'>⌘K</span>}
            inputProps={{
              ref: languageInputReference,
              tabIndex: 1,
            }}
            isClearable={false}
            onFocus={event => event.target.select()}
            onSelectionChange={lang => lang && selectLanguage(lang as string)}
            selectedKey={selectedLanguage}
            size='lg'
          >
            {supportedLanguages.map((lang) => (
              <AutocompleteItem key={lang}>{lang}</AutocompleteItem>
            ))}
          </Autocomplete>
        </section>
      </section>
      <AdvancedOptionsModal
        isAvailable={editorContent !== undefined}
        isOpen={isAdvancedModalOpen}
        onClose={() => setAdvancedModalOpen(false)}
        onConfirm={saveAdvanced}
      />
      <PasteLinkModal link={pasteLink} onClose={() => setPasteLink(null)} />
    </>
  )
}

export default CreatePasteWidget
