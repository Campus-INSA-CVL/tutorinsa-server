import slowDown, { Options } from 'express-slow-down'

const slowerOptions: Options = {
  windowMs: 5 * 60 * 1000,
  delayAfter: 4,
  delayMs: 500,
}

const speedLimiter = slowDown(slowerOptions)

export default speedLimiter
