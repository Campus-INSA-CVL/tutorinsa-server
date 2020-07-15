import rateLimit, { Options } from 'express-rate-limit'

const options: Options = {
  windowMs: 30 * 60 * 1000,
  max: 1000,
  statusCode: 429,
  message: 'Too many request, please try again later !',
  handler(req, res) {
    res
      .status(options.statusCode as number)
      .json({ message: options.message, statusCode: options.statusCode })
  },
}

const limiter = rateLimit(options)

export default limiter
