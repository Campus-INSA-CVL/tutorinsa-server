import { disallow } from 'feathers-hooks-common'
import checkData from '../../hooks/check/check-data'
import checkDate from '../../hooks/check/check-room/check-date'
import checkCampus from '../../hooks/check/check-room/check-campus'
import checkDay from '../../hooks/check/check-room/check-day'
// Don't remove this comment. It's needed to format import lines nicely.

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [checkData(), checkDate(), checkCampus(), checkDay()],
    update: [disallow()],
    patch: [checkData(), checkDate(), checkCampus(), checkDay()],
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
