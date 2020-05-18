import { disallow, iff, isProvider } from 'feathers-hooks-common'
// Don't remove this comment. It's needed to format import lines nicely.
import checkData from '../../hooks/check/check-data'

import checkDuplicate from '../../hooks/check/check-duplicate'

import checkIds from '../../hooks/check/check-ids'

import checkDate from '../../hooks/check/check-date'

import checkType from '../../hooks/check/check-post/check-type'

import checkTime from '../../hooks/check/check-post/check-time'

import checkLength from '../../hooks/check/check-post/check-length'

import checkCapacity from '../../hooks/check/check-post/check-capacity'

import checkCalendars from '../../hooks/check/check-post/check-calendars'

import removeUnwantedFields from '../../hooks/remove-unwanted-fields'

import normalizeDate from '../../hooks/normalize-date'

import { Options } from '../../declarations'

const checkDataOptions: Options = {
  fields: [
    'comment',
    'type',
    'startAt',
    'duration',
    'studentsCapacity',
    'tutorsCapacity',
    'subjectId',
    'roomId',
  ],
  arrayFields: ['studentsIds', 'tutorsIds'],
  numberFields: ['duration', 'studentsCapacity', 'tutorsCapacity'],
  dateFields: ['startAt'],
}

const unwantedFields = ['studentsIds', 'tutorsIds', 'creatorId']

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      checkData(checkDataOptions),
      checkDuplicate(),
      checkIds(),
      checkTime(),
      checkDate(),
      checkType(),
      checkLength(),
      checkCapacity(),
      checkCalendars(),
      normalizeDate(['startAt']),
      removeUnwantedFields(unwantedFields),
    ],
    update: [disallow()],
    patch: [
      checkData(checkDataOptions),
      checkDuplicate(),
      checkIds(),
      checkDate(),
      checkType(),
      checkTime(),
      checkLength(),
      checkCapacity(),
      checkCalendars(),
      normalizeDate(['startAt']),
      iff(isProvider('external'), removeUnwantedFields(unwantedFields)),
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
