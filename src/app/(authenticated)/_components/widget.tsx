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
        visibility: properties.onlyResidents
          ? PasteVisibility.ResidentsOnly
          : PasteVisibility.Public
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
        visibility: properties.onlyResidents
          ? PasteVisibility.ResidentsOnly
          : PasteVisibility.Public
      })

      setPasteLink(response.link)
    }
    setAdvancedModalOpen(false)
  }

  const saveQuick = async (content: string, language: string) => {
    setIsLoading(true)
    const response = await createPaste({
      content,
      expiration: PasteExpiration.OneDay,
      metadata: {
        isEncrypted: false,
        syntaxLanguage: language,
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

        const model = currentEditor.getModel()
        if (model) {
          saveQuick(model.getValue(), model.getLanguageId())
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
      <section className='flex flex-col h-full md:h-4/5 gap-6'>
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
            renderValidationDecorations: 'off',
            tabIndex: 0,
            tabSize: 2,
          }}
          theme='vs-dark'
        />
        <section className='flex flex-col md:gap-0 gap-4 md:flex-row justify-between items-center pb-8 md:pb-0'>
          <section className='flex flex-col md:flex-row gap-4 w-full md:w-auto'>
            <Button
              color='success'
              fullWidth
              isDisabled={editorContent === undefined}
              isLoading={isLoading}
              onPress={() => saveQuick(editorContent as string, selectedLanguage)}
              size='lg'
              tabIndex={2}
            >
              Publish for one day
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
            isClearable={false}
            onFocus={event => event.target.select()}
            onSelectionChange={lang => lang && selectLanguage(lang as string)}
            ref={languageInputReference}
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
