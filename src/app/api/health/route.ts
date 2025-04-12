// eslint-disable-next-line no-restricted-imports -- this one is fine
import { healthCheck } from '@/backend/connectors/redis'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET (): Promise<NextResponse> {
  const redisStatus = await healthCheck()
  const overallStatus = redisStatus

  if (overallStatus) {
    return NextResponse.json(
      {
        cat: '(^._.^)ﾉ',
        status: 'ok',
        ts: new Date().toISOString(),
      },
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        status: 200,
      }
    )
  }
  return NextResponse.json(
    {
      cat: '(=ｘェｘ=)',
      status: 'error',
      ts: new Date().toISOString(),
    },
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      status: 500,
    }
  )
}
