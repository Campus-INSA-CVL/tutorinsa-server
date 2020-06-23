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

import addPost from '../../hooks/add/add-post'

import addRoom from '../../hooks/add/add-room'

import checkConcordanceDay from '../../hooks/check/check-post/check-concordance-day'

import checkTimeCompatibility from '../../hooks/check/check-post/check-time-compatibility'

import removeUnwantedFields from '../../hooks/remove-unwanted-fields'

import patchUser from '../../hooks/user/patch-user'

import isPost from '../../hooks/post/is-post'

import pickResult from '../../hooks/authentication/pick-result'

import resolvers from './posts.populate'

import checkDisponibility from '../../hooks/check/check-post/check-disponibility'

import checkMinDuration from '../../hooks/check/check-min-duration'

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
      checkMinDuration(),
      checkType('type', typesOptions),
      checkLength(),
      normalizeDate(['startAt']),
      iff(
        isPost('tuteur'),
        checkCapacity(),
        checkTime(),
        // checkDate(),
        addRoom(),
        checkConcordanceDay(),
        checkTimeCompatibility(),
        checkDisponibility()
      ),
    ],
    update: [disallow()],
    patch: [
      addPost(),
      iffElse(
        isPost('tuteur'),
        removeUnwantedFields([...unwantedTutorFields, 'type']),
        removeUnwantedFields(unwantedStudentFields)
      ),
      iffElse(
        isPost('tuteur'),
        checkData(checkDataTutorOptions),
        checkData(checkDataStudentOptions)
      ),
      checkDuplicate(),
      checkIds(),
      checkMinDuration(),
      checkType('type', typesOptions),
      checkLength(),
      normalizeDate(['startAt']),
      iff(
        isPost('tuteur'),
        checkCapacity(),
        checkTime(),
        // checkDate(),
        addRoom(),
        checkConcordanceDay(),
        checkTimeCompatibility(),
        checkDisponibility()
      ),
    ],
    remove: [],
  },

  after: {
    all: [],
    find: [fastJoin(resolvers), iff(isProvider('external'), pickResult())],
    get: [fastJoin(resolvers), iff(isProvider('external'), pickResult())],
    create: [
      patchUser([['createdPostsIds', '_id', 'array']]),
      // to have the correct user
      fastJoin(resolvers),
    ],
    update: [],
    patch: [
      // patchUser([['createdPostsIds', '_id', 'array']]),
      // createCalendar(),
      // patchCalendar('patch'),
    ],
    remove: [
      patchUser([['createdPostsIds', '_id', 'array']]),
      // to have the correct user
      fastJoin(resolvers),
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
