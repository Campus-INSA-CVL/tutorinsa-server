import { disallow, iff, isProvider } from 'feathers-hooks-common'
import checkData from '../../hooks/check/check-data'
import { CheckDataOptions, YearCore } from '../../declarations'
import pickResult from '../../hooks/authentication/pick-result'
// Don't remove this comment. It's needed to format import lines nicely.

const checkDataOptions: CheckDataOptions<YearCore> = {
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
    all: [iff(isProvider('external'), pickResult())],
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
