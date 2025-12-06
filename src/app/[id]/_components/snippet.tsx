'use client'
import Monaco, { type OnMount } from '@monaco-editor/react'

export type SnippetProperties = {
  content: string;
  language: string;
}

const Snippet: React.FC<SnippetProperties> = ({ content, language }) => {
  return (
    <Monaco
      className='bg-[#1e1e1e] rounded-sm p-4'
      defaultLanguage={language}
      height='80%'
      options={{
        padding: {
          top: 16
        },
        readOnly: true,
        renderLineHighlight: 'none',
        renderValidationDecorations: 'off',
        tabIndex: 0,
        tabSize: 2,
      }}
      theme='vs-dark'
      value={content}
    />
  )
}

export default Snippet
