'use client'

import Monaco, { useMonaco } from '@monaco-editor/react'
import { useEffect } from 'react'

export interface EditorProperties {
  language?: string;
  onChange?: (value: string) => void
  onLanguagesListChange?: (languages: string[]) => void
}

const Editor: React.FC<EditorProperties> = ({ language, onChange, onLanguagesListChange }) => {
  const monaco = useMonaco()

  // Lift supported languages to parent
  useEffect(() => {
    if (!monaco) return
    onLanguagesListChange?.(monaco.languages.getLanguages().map((lang) => lang.id))
  }, [monaco?.languages])

  // Update Monaco language on parent's request
  useEffect(() => {
    const model = monaco?.editor.getModels()[0]
    if (!model || !language) {
      return
    }

    monaco.editor.setModelLanguage(model, language)
  }, [monaco?.editor, language])

  return (
    <Monaco
      className='bg-[#1e1e1e] rounded-sm p-4'
      height='80%'
      onChange={code => onChange?.(code ?? '')}
      options={{
        padding: {
          top: 16
        },
        renderLineHighlight: 'none'
      }}
      theme='vs-dark'
    />
  )
}

export default Editor
