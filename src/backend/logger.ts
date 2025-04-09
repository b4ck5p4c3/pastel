import { ILogObj, Logger } from 'tslog'

// It's really weird that tslog doesn't export this as an enum
// 0: silly, 1: trace, 2: debug, 3: info, 4: warn, 5: error, 6: fatal

export const log: Logger<ILogObj> = new Logger({
  minLevel: process.env.NODE_ENV === 'production'
    ? 5 // error
    : 1, // trace
  name: 'app',
})
