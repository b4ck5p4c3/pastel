import 'server-only'

export default function SentryDsn () {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

  if (!dsn) {
    return null
  }

  return (
    <meta content={dsn} name='sentry-dsn' />
  )
}
