import { PasteExpiration } from '@/backend/actions/paste/types'

export interface PasteOptions {
  encrypt: boolean
  expiration: PasteExpiration
  onlyResidents: boolean
}
