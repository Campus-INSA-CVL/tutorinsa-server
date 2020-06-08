import logger from './hooks/logger' // Application hooks that run for every service
import { iff } from 'feathers-hooks-common'
// Don't remove this comment. It's needed to format import lines nicely.
import authenticate from './hooks/authentication/authenticate'
import authorize from './hooks/authentication/authorize'
import { HookContext } from '@feathersjs/feathers'

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
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
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
