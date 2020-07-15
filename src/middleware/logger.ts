import { Request, Response, NextFunction } from 'express'
import { SlowDownRequestAugmentation } from 'express-slow-down'
import util from 'util'
import logger from '../logger'

export default () => {
  return (
    req: Request & { slowDown: SlowDownRequestAugmentation },
    res: Response,
    next: NextFunction
  ) => {
    logger.info(
      `slow down request on ${req.path}:\ninfo: ${util.inspect(
        req.slowDown,
        false,
        2,
        true
      )}`
    )
    next()
  }
}
