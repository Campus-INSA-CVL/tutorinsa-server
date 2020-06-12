import { disallow, iff, isProvider } from 'feathers-hooks-common'
import checkData from '../../hooks/check/check-data'
import checkDate from '../../hooks/check/check-date'
import checkCampus from '../../hooks/check/check-room/check-campus'
import checkDay from '../../hooks/check/check-room/check-day'
import { CheckDataOptions, RoomCore } from '../../declarations'
import normalizeDate from '../../hooks/normalize-date'
import pickResult from '../../hooks/authentication/pick-result'
// Don't remove this comment. It's needed to format import lines nicely.

const checkDataOptions: CheckDataOptions<RoomCore> = {
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
      normalizeDate(['startAt']),
    ],
    update: [disallow()],
    patch: [disallow()],
    remove: [],
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
