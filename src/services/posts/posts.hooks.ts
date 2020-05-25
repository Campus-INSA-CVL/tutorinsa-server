import { disallow, iff, isProvider } from 'feathers-hooks-common'
import { PostCore, CheckDataOptions } from '../../declarations'
// Don't remove this comment. It's needed to format import lines nicely.
import checkData from '../../hooks/check/check-data'

import checkDuplicate from '../../hooks/check/check-duplicate'

import checkIds from '../../hooks/check/check-ids'

import checkDate from '../../hooks/check/check-date'

import checkType from '../../hooks/check/check-post/check-type'

import checkTime from '../../hooks/check/check-post/check-time'

import checkLength from '../../hooks/check/check-post/check-length'

import checkCapacity from '../../hooks/check/check-post/check-capacity'

import normalizeDate from '../../hooks/normalize-date'

import addRoom from '../../hooks/add-room'

import checkConcordanceDay from '../../hooks/check/check-post/check-concordance-day'

import checkTimeCompaibility from '../../hooks/check/check-post/check-time-compatibility'

import checkCalendars from '../../hooks/check/check-post/check-calendars'

import removeUnwantedFields from '../../hooks/remove-unwanted-fields'

import updateUser from '../../hooks/update-user'

import createCalendar from '../../hooks/create-calendar'

import updateCalendar from '../../hooks/update-calendar'

const checkDataOptions: CheckDataOptions<PostCore> = {
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

// Order matters
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
      normalizeDate(['startAt']),
      addRoom(),
      checkConcordanceDay(),
      checkTimeCompaibility(),
      checkCalendars(),
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
      normalizeDate(['startAt']),
      addRoom(),
      checkConcordanceDay(),
      checkTimeCompaibility(),
      checkCalendars(),
      iff(isProvider('external'), removeUnwantedFields(unwantedFields)),
    ],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      updateUser([['createdPostsIds', '_id', 'array']]),
      createCalendar(),
    ],
    update: [],
    patch: [
      updateUser([['createdPostsIds', '_id', 'array']]),
      updateCalendar(),
    ],
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
