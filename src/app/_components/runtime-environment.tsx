import 'server-only'

const RuntimeEnvironment: React.FC = () => {
  const keys = Object.keys(process.env).filter((key) => key.startsWith('NEXT_PUBLIC_'))
  const publicVariables: Record<string, string> = {}

  for (const key of keys) {
    publicVariables[key] = process.env[key] ?? ''
  }

  return (
    <script>
      {`window['__ENV'] = ${JSON.stringify(publicVariables)}`}
    </script>
  )
}

export default RuntimeEnvironment
