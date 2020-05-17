import { disallow } from 'feathers-hooks-common'
import checkData from '../../hooks/check/check-data'
import checkDate from '../../hooks/check/check-date'
import checkCampus from '../../hooks/check/check-room/check-campus'
import checkDay from '../../hooks/check/check-room/check-day'
import { Options } from '../../declarations'
// Don't remove this comment. It's needed to format import lines nicely.

const checkDataOptions: Options = {
  fields: ['campus', 'name', 'day', 'startAt', 'duration'],
  numberFields: ['duration'],
  dateFields: ['startAt'],
}

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      checkData(checkDataOptions),
      checkDate(),
      checkCampus(),
      checkDay(),
    ],
    update: [disallow()],
    patch: [
      checkData(checkDataOptions),
      checkDate(),
      checkCampus(),
      checkDay(),
    ],
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
