import { Application } from '../declarations'

import limiter from './limiter/limiter'

import slower from './slower/slower'

import authenticationLimiter from './limiter/authentication-limiter'

import authenticationSlower from './slower/authentication-slower'

import authManagementLimiter from './limiter/authentication-limiter'

import authManagementSlower from './slower/authentication-slower'

import logger from './logger/logger'

// Don't remove this comment. It's needed to format import lines nicely.

/* tslint:disable:no-empty */
export default function (app: Application) {
  if (process.env.NODE_ENV === 'production') {
    app.enable('trust proxy')
  }

  app.use(limiter)
  app.use(slower)

  app.use('/authentication/', authenticationLimiter)
  app.use('/authentication/', authenticationSlower)

  app.use('/authManagement', authManagementLimiter)
  app.use('/authManagement', authManagementSlower)

  // @ts-ignore
  app.use(logger())
}
