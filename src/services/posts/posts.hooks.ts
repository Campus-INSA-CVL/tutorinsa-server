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

import removeUnwantedFields from '../../hooks/remove-unwanted-fields'
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
