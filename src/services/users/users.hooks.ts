import * as feathersAuthentication from '@feathersjs/authentication'
import * as local from '@feathersjs/authentication-local'
import { disallow, iff, isProvider } from 'feathers-hooks-common'
// Don't remove this comment. It's needed to format import lines nicely.
import checkData from '../../hooks/check/check-data'

import checkDuplicate from '../../hooks/check/check-duplicate'

import checkIds from '../../hooks/check/check-ids'

import checkEmail from '../../hooks/check/check-user/check-email'

import checkPassword from '../../hooks/check/check-user/check-password'

import checkPermissions from '../../hooks/check/check-user/check-permissions'

import removeUnwantedFields from '../../hooks/remove-unwanted-fields'

import {
  CheckPermissionsOptions,
  CheckDataOptions,
  UserCore,
} from '../../declarations'

const { authenticate } = feathersAuthentication.hooks
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
  ],
  unwantedFields: ['permissions', 'email'],
}

const unwantedFields = ['createdPostsIds']

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
      checkData(checkDataOptions),
      checkDuplicate(),
      checkIds(),
      checkEmail(),
      checkPassword(),
      checkPermissions(permissionsOptions),
      removeUnwantedFields(unwantedFields),
      hashPassword('password'),
    ],
    update: [disallow()],
    patch: [
      checkData(checkDataOptions),
      checkDuplicate(),
      checkIds(),
      checkEmail(),
      checkPassword(),
      checkPermissions(permissionsOptions),
      iff(isProvider('external'), removeUnwantedFields(unwantedFields)),
      hashPassword('password'),
    ],
    remove: [],
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password'),
    ],
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
