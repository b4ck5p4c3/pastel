'use client'

import React, { createContext, useContext } from 'react'

interface RuntimeEnvironment {
  [key: string]: string
}

const EnvironmentContext = createContext<RuntimeEnvironment | undefined>(undefined)

export function EnvironmentProvider ({
  children,
  env,
}: {
  children: React.ReactNode
  env: RuntimeEnvironment
}) {
  return (
    <EnvironmentContext.Provider value={env}>
      {children}
    </EnvironmentContext.Provider>
  )
}

export function useRuntimeEnvironment () {
  const context = useContext(EnvironmentContext)
  return context
}
