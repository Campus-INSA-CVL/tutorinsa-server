import slowDown, { Options } from 'express-slow-down'

const slowerOptions: Options = {
  windowMs: 30 * 60 * 1000,
  delayAfter: 4,
  delayMs: 500,
}

const speedLimiter = slowDown(slowerOptions)

export default speedLimiter
