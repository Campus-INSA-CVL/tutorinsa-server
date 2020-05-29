import { disallow } from 'feathers-hooks-common'
import checkDate from '../../hooks/check/check-date'

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
    find: [],
    get: [],
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
