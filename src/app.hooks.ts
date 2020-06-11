import { iff, isProvider } from 'feathers-hooks-common'
import { HookContext } from '@feathersjs/feathers'
// Don't remove this comment. It's needed to format import lines nicely.
import authenticate from './hooks/authentication/authenticate'
import authorize from './hooks/authentication/authorize'

import logger from './hooks/logger' // Application hooks that run for every service
import pickData from './hooks/authentication/pick-data'

import handleQuery from './hooks/authentication/handle-query'

export default {
  before: {
    all: [
      logger(),
      iff(
        (context: HookContext): boolean =>
          !!context.params.provider &&
          `/${context.path}` !== context.app.get('authentication').path,
        authenticate(),
        authorize()
      ),
      iff(isProvider('external'), handleQuery()),
    ],
    find: [],
    get: [],
    create: [iff(isProvider('external'), pickData())],
    update: [iff(isProvider('external'), pickData())],
    patch: [iff(isProvider('external'), pickData())],
    remove: [],
  },

  after: {
    all: [logger()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [logger()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
}
