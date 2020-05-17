import { disallow } from 'feathers-hooks-common'
import checkData from '../../hooks/check/check-data'
import { Options } from '../../declarations'
// Don't remove this comment. It's needed to format import lines nicely.

const checkDataOptions: Options = {
  fields: ['name'],
}

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [checkData(checkDataOptions)],
    update: [disallow()],
    patch: [checkData(checkDataOptions)],
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
