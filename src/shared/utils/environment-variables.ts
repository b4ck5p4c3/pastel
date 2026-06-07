import 'server-only'

export function getPublicEnvironmentVariables (): Record<string, string> {
  const keys = Object.keys(process.env).filter((key) => key.startsWith('NEXT_PUBLIC_'))
  const publicVariables: Record<string, string> = {}

  for (const key of keys) {
    publicVariables[key] = process.env[key] ?? ''
  }

  return publicVariables
}
