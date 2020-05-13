import { disallow } from 'feathers-hooks-common'
import checkData from '../../hooks/check/check-data'
import checkMinutes from '../../hooks/check/check-room/check-minutes'
// Don't remove this comment. It's needed to format import lines nicely.

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [checkData(), checkMinutes()],
    update: [disallow()],
    patch: [checkData(), checkMinutes()],
    remove: [],
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
