import { PasteExpiration } from './types'

export const PasteExpirationToSeconds = new Map<PasteExpiration, number | undefined>([
  [PasteExpiration.AfterFirstRead, undefined],
  [PasteExpiration.FifteenMinutes, 15 * 60],
  [PasteExpiration.Never, undefined],
  [PasteExpiration.OneDay, 24 * 60 * 60],
  [PasteExpiration.OneHour, 60 * 60],
  [PasteExpiration.OneWeek, 7 * 24 * 60 * 60],
])
