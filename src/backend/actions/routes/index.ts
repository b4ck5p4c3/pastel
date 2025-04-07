import { router } from '../trpc'
import { pasteRouter } from './paste'

export const appRouter = router({
  paste: pasteRouter
})
