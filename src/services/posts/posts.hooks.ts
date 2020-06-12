import * as feathersAuthentication from '@feathersjs/authentication'
import {
  disallow,
  iff,
  iffElse,
  isProvider,
  fastJoin,
} from 'feathers-hooks-common'
import { PostCore, CheckDataOptions, PostType } from '../../declarations'
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

import addRoom from '../../hooks/add/add-room'

import checkConcordanceDay from '../../hooks/check/check-post/check-concordance-day'

import checkTimeCompaibility from '../../hooks/check/check-post/check-time-compatibility'

import checkCalendars from '../../hooks/check/check-post/check-calendars'

import removeUnwantedFields from '../../hooks/remove-unwanted-fields'

import patchUser from '../../hooks/user/patch-user'

import createCalendar from '../../hooks/calendar/create-calendar'

import patchCalendar from '../../hooks/calendar/patch-calendar'

import addCalendar from '../../hooks/add/add-calendar'

import isPost from '../../hooks/post/is-post'

import pickResult from '../../hooks/authentication/pick-result'

import resolvers from './posts.populate'

const checkDataTutorOptions: CheckDataOptions<PostCore> = {
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

const checkDataStudentOptions: CheckDataOptions<PostCore> = {
  fields: ['comment', 'type', 'subjectId'],
}

const unwantedTutorFields = ['studentsIds', 'tutorsIds', 'creatorId']
const unwantedStudentFields = [
  'startAt',
  'duration',
  'studentsCapacity',
  'tutorsCapacity',
  'roomId',
  'studentsIds',
  'tutorsIds',
  'creatorId',
]

const typesOptions: PostType[] = ['eleve', 'tuteur']

const { authenticate } = feathersAuthentication.hooks

// Order matters
export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      authenticate('jwt'),
      iffElse(
        isPost('tuteur'),
        removeUnwantedFields(unwantedTutorFields),
        removeUnwantedFields(unwantedStudentFields)
      ),
      iffElse(
        isPost('tuteur'),
        checkData(checkDataTutorOptions),
        checkData(checkDataStudentOptions)
      ),
      checkDuplicate(),
      checkIds(),
      checkTime(),
      checkDate(),
      checkType('type', typesOptions),
      checkLength(),
      checkCapacity(),
      normalizeDate(['startAt']),
      iff(
        isPost('tuteur'),
        addRoom(),
        addCalendar(),
        checkConcordanceDay(),
        checkTimeCompaibility(),
        checkCalendars()
      ),
    ],
    update: [disallow()],
    patch: [
      disallow('external'),
      // iff(
      //   isProvider('external'),
      //   removeUnwantedFields(['startAt', ...unwantedFields])
      // ),
      // checkData(checkDataOptions),
      // checkDuplicate(),
      // checkIds(),
      // checkDate(),
      // checkType(),
      // checkTime(),
      // checkLength(),
      // checkCapacity(),
      // normalizeDate(['startAt']),
      // addRoom(),
      // addCalendar(),
      // checkConcordanceDay(),
      // checkTimeCompaibility(),
      // checkCalendars(),
      // ,
    ],
    remove: [
      authenticate('jwt'),
      iff(isPost('tuteur'), addRoom(), addCalendar()),
    ],
  },

  after: {
    all: [fastJoin(resolvers)],
    find: [iff(isProvider('external'), pickResult())],
    get: [iff(isProvider('external'), pickResult())],
    create: [
      patchUser([['createdPostsIds', '_id', 'array']]),
      iff(isPost('tuteur'), createCalendar(), patchCalendar('create')),
    ],
    update: [],
    patch: [
      // patchUser([['createdPostsIds', '_id', 'array']]),
      // createCalendar(),
      // patchCalendar('patch'),
    ],
    remove: [
      patchUser([['createdPostsIds', '_id', 'array']]),
      iff(isPost('tuteur'), patchCalendar('remove')),
    ],
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
