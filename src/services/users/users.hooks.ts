import * as feathersAuthentication from '@feathersjs/authentication'
import * as local from '@feathersjs/authentication-local'
import { disallow, iff, isProvider, fastJoin } from 'feathers-hooks-common'
// Don't remove this comment. It's needed to format import lines nicely.
import checkData from '../../hooks/check/check-data'

import checkDuplicate from '../../hooks/check/check-duplicate'

import checkIds from '../../hooks/check/check-ids'

import checkEmail from '../../hooks/check/check-user/check-email'

import checkPassword from '../../hooks/check/check-user/check-password'

import checkPermissions from '../../hooks/check/check-user/check-permissions'

import removeUnwantedFields from '../../hooks/remove-unwanted-fields'

import pickResult from '../../hooks/authentication/pick-result'

import resolvers from './users.populate'
import {
  CheckPermissionsOptions,
  CheckDataOptions,
  UserCore,
} from '../../declarations'

const { hashPassword, protect } = local.hooks

const checkDataOptions: CheckDataOptions<UserCore> = {
  fields: [
    'lastName',
    'firstName',
    'email',
    'password',
    'permissions',
    'yearId',
    'departmentId',
    'favoriteSubjectsIds',
    'difficultSubjectsIds',
  ],
  arrayFields: [
    'permissions',
    'favoriteSubjectsIds',
    'difficultSubjectsIds',
    'createdPostsIds',
    'studentSubscriptionsIds',
    'tutorSubscriptionsIds',
  ],
  unwantedFields: ['permissions', 'email'],
}

const unwantedFields = [
  'createdPostsIds',
  'studentSubscriptionsIds',
  'tutorSubscriptionsIds',
]

const permissionsOptions: CheckPermissionsOptions = {
  permissions: ['admin', 'eleve', 'tuteur'],
  admin: 'admin',
  default: 'eleve',
}

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      removeUnwantedFields(unwantedFields),
      checkData(checkDataOptions),
      checkDuplicate(),
      checkIds(),
      checkEmail(),
      checkPassword(),
      checkPermissions(permissionsOptions),
      hashPassword('password'),
    ],
    update: [disallow()],
    patch: [
      iff(isProvider('external'), removeUnwantedFields(unwantedFields)),
      checkData(checkDataOptions),
      checkDuplicate(),
      checkIds(),
      checkEmail(),
      checkPassword(),
      checkPermissions(permissionsOptions),
      hashPassword('password'),
    ],
    remove: [],
  },

  after: {
    all: [
      fastJoin(resolvers),
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password'),
    ],
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
