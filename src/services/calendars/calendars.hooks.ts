import { disallow } from 'feathers-hooks-common'
import checkDate from '../../hooks/check/check-date'

import addRoom from '../../hooks/add-room'

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [disallow('external'), checkDate(), addRoom()],
    update: [disallow()],
    patch: [disallow()],
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
