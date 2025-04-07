import { signIn } from '@/auth'

export async function GET (request: Request) {
  const searchParameters = new URL(request.url).searchParams
  return signIn('bkspid', { redirectTo: searchParameters.get('callbackUrl') ?? '' })
}
