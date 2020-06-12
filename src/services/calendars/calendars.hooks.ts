import { disallow, iff, isProvider } from 'feathers-hooks-common'
import checkDate from '../../hooks/check/check-date'
import pickResult from '../../hooks/authentication/pick-result'

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [disallow('external'), checkDate()],
    update: [disallow()],
    patch: [disallow('external')],
    remove: [disallow('external')],
  },

  after: {
    all: [],
    find: [iff(isProvider('external'), pickResult())],
    get: [iff(isProvider('external'), pickResult())],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
}
